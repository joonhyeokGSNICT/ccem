var topGrid;
var midGrid;
var botGrid;
var subjectGrid;
var cselCode = ""; 			// 상담등록에서 보낸 상담구분
var searchTitle = "";		// 검색 제목

var codeDataPop;

//부모창 값 가져오기
var openerTop = "";
var openerMid = "";
var openerBot = "";
var openerSub = "";

var openerTop_ID = "";
var openerMid_ID = "";
var openerBot_ID = "";
var openerSub_ID = "";

var openerTop_NAME = "";
var openerMid_NAME = "";
var openerBot_NAME = "";
var openerSub_NAME = "";

var tempTop;				// 대분류 임시저장
var tempMid;				// 중분류 임시저장
var tempBot;				// 소분류 임시저장
var tempSub;				// 제목 임시저장



$(function(){
	console.log(opener.name)
	// opener 의 탭 ID 에 따라 참조하는 부분이 달라진다.
	switch(opener.name){
	case 'CCEMPRO031':
		cselCode = "3";
    	openerTop = $.trim($("#textbox19", opener.document).val());
    	openerMid = $.trim($("#textbox21", opener.document).val());
    	openerBot = $.trim($("#textbox23", opener.document).val());
    	openerSub = "";
    	
    	openerTop_ID = "textbox19";
    	openerMid_ID = "textbox21";
    	openerBot_ID = "textbox23";
    	openerSub_ID = "textbox18";
    	
    	openerTop_NAME = "textbox20";
    	openerMid_NAME = "textbox22";
    	openerBot_NAME = "textbox24";
    	openerSub_NAME = "";
		break;
	case 'CCEMPRO032':
		cselCode = "9";
    	openerTop = $.trim($("#textbox20", opener.document).val());
    	openerMid = $.trim($("#textbox22", opener.document).val());
    	openerBot = $.trim($("#textbox24", opener.document).val());
    	openerSub = "";
    	
    	openerTop_ID = "textbox20";
    	openerMid_ID = "textbox22";
    	openerBot_ID = "textbox24";
    	openerSub_ID = "";
    	
    	openerTop_NAME = "textbox21";
    	openerMid_NAME = "textbox23";
    	openerBot_NAME = "textbox25";
    	openerSub_NAME = "";
		break;
	}
	
	// 대분류 LIST
	topGrid = new Grid({
		el: document.getElementById('topGrid'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '분류코드',
				name: 'CODE_ID',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80,
				formatter: function(e){
					if(cselCode != '3'){
						return e.value.slice(-2);
					}else {
						return e.value;
					}
				}
            },
            {
				header: '제목',
				name: 'CODE_NAME',
				align: "center",
				sortable: true,
				ellipsis: true,
            }
		],
	});
	topGrid.on('click', (ev) => {
		topGrid.addSelection(ev);
		topGrid.clickSort(ev);
		if(ev.targetType == 'cell'){
			topSelet = topGrid.getRow(ev.rowKey);
			var codeListPop = codeDataPop.filter(el => "CSEL_MTYPE_CDE".includes(el.CODE_MK));
			var midList = [];
			var upCode = topSelet.CODE_ID;
			for(d of codeListPop){
					if(d.CODE_ID.substring(0,3) == upCode){
						midList.push(d);
				}
			}
			midGrid.resetData(midList);
			botGrid.clear();
			tempTop = topSelet;
			tempMid = null;
			tempBot = null;
		}
    });
	
	// 중분류 LIST
	midGrid = new Grid({
		el: document.getElementById('midGrid'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '분류코드',
				name: 'CODE_ID',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80,
				formatter: function(e){
					if(cselCode != '3'){
						return e.value.slice(-2);
					}else {
						return e.value;
					}
				}
            },
            {
				header: '제목',
				name: 'CODE_NAME',
				align: "center",
				sortable: true,
				ellipsis: true,
            }
		],
	});
	midGrid.on('click', (ev) => {
		if(ev.targetType == 'cell'){
			midGrid.addSelection(ev);
			midGrid.clickSort(ev);
			midGrid.clickCheck(ev);
			midSelet = midGrid.getRow(ev.rowKey);
			var codeListPop = codeDataPop.filter(el => "CSEL_STYPE_CDE".includes(el.CODE_MK));
			var botList = [];
			var upCode = midSelet.CODE_ID;
			for(d of codeListPop){
					if(d.CODE_ID.substring(0,5) == upCode){
						botList.push(d);
					}
			}
			botGrid.resetData(botList);
			tempMid = midSelet;
			tempBot = null;
		}
    });
	
	// 소분류 LIST
	botGrid = new Grid({
		el: document.getElementById('botGrid'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '분류코드',
				name: 'CODE_ID',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80,
				formatter: function(e){
					if(cselCode != '3'){
						return e.value.slice(-2);
					}else {
						return e.value;
					}
				}
            },
            {
				header: '제목',
				name: 'CODE_NAME',
				align: "center",
				sortable: true,
				ellipsis: true,
            }
		],
	});
	botGrid.on('click', (ev) => {
		if(ev.targetType == 'cell'){
			botGrid.addSelection(ev);
			botGrid.clickSort(ev);
			botSelet = botGrid.getRow(ev.rowKey);
			tempBot = botSelet;
		}
    });
	botGrid.on('dblclick', (ev) => {
		if(ev.targetType == 'cell'){
			$("#confirm").click();
		}
    });
	
	// GRID END ===
	
	// 코드 가져오기
	settings = {
			url: `${API_SERVER}/sys.getCommCode.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{}],
			}),
		}

		$.ajax(settings)
			.done(data => {
				codeDataPop = data.dsRecv;
				init();
			})
			.fail(error => {
				console.error(error);
				return reject(error);
			});
	
	
	// BUTTON EVENT
	// 확인 버튼
	$("#confirm").click(function() {
		if(tempTop != null && tempTop != undefined){
			$("#" + openerTop_ID, opener.document).val("");
			$("#" + openerTop_NAME, opener.document).val("");
			$("#" + openerTop_ID, opener.document).val(tempTop.CODE_ID.slice(-2));
			$("#" + openerTop_NAME, opener.document).val(tempTop.CODE_NAME);
		}else {
			$("#" + openerTop_ID, opener.document).val("");
			$("#" + openerTop_NAME, opener.document).val("");
		}
		if(tempMid != null && tempMid != undefined){
			$("#" + openerMid_ID, opener.document).val("");
			$("#" + openerMid_NAME, opener.document).val("");
			$("#" + openerMid_ID, opener.document).val(tempMid.CODE_ID.slice(-2));
			$("#" + openerMid_NAME, opener.document).val(tempMid.CODE_NAME);
		}else{
			$("#" + openerMid_ID, opener.document).val("");
			$("#" + openerMid_NAME, opener.document).val("");
		}
		if(tempBot != null && tempBot != undefined){
			$("#" + openerBot_ID, opener.document).val("");
			$("#" + openerBot_NAME, opener.document).val("");
			$("#" + openerBot_ID, opener.document).val(tempBot.CODE_ID.slice(-2));
			$("#" + openerBot_NAME, opener.document).val(tempBot.CODE_NAME);
		}else{
			$("#" + openerBot_ID, opener.document).val("");
			$("#" + openerBot_NAME, opener.document).val("");
		}
		$("#" + openerSub_ID, opener.document).val("");
		var subject = "";
		if(tempTop?.CODE_NAME)subject+=tempTop.CODE_NAME;
		if(tempMid?.CODE_NAME)subject+=" > " + tempMid.CODE_NAME;
		if(tempBot?.CODE_NAME)subject+=" > " + tempBot.CODE_NAME;
		$("#" + openerSub_ID, opener.document).val(subject);
		window.close();
	});
});

//초기 대분류 조회 func
function init(){
	var codeListPop = codeDataPop.filter(el => "CSEL_LTYPE_CDE".includes(el.CODE_MK));
	var topList = [];
	for(d of codeListPop){
		if(cselCode == '3'){
			if(d.CODE_ID == '301' || d.CODE_ID == '302' || d.CODE_ID == '344'){
				topList.push(d);
			}
		}else if(cselCode == '9'){
			if(d.CODE_ID == '961' || d.CODE_ID == '962' || d.CODE_ID == '964'){
				topList.push(d);
			}
		}
	}
	topGrid.clear();
	topGrid.resetData(topList);
	
	tempTop = topGrid.findRows({
	    CODE_ID: cselCode + openerTop
	})[0];
	console.log(cselCode + openerTop);
	if(tempTop == "" || tempTop == null || tempTop == undefined){return;}
	
	tempMid = null;
	tempBot = null;
	tempSub = null;
	
	topGrid.addSelection(tempTop);
	
	codeListPop = codeDataPop.filter(el => "CSEL_MTYPE_CDE".includes(el.CODE_MK));
	var midList = [];
	var upCode = cselCode + openerTop;
	for(d of codeListPop){
			if(d.CODE_ID.substring(0,3) == upCode){
				midList.push(d);
		}
	}
	midGrid.resetData(midList);
	
	tempMid = midGrid.findRows({
	    CODE_ID: cselCode + openerTop + openerMid
	})[0];

	if(tempMid == "" || tempMid == null || tempMid == undefined){return;}
	
	tempBot = null;
	tempSub = null;
	
	midGrid.addSelection(tempMid);
	
	codeListPop = codeDataPop.filter(el => "CSEL_STYPE_CDE".includes(el.CODE_MK));
	var botList = [];
	var upCode = cselCode + openerTop + openerMid;
	for(d of codeListPop){
			if(d.CODE_ID.substring(0,5) == upCode){
				botList.push(d);
		}
	}
	botGrid.resetData(botList);
	
	tempBot = botGrid.findRows({
	    CODE_ID: cselCode + openerTop + openerMid + openerBot
	})[0];

	if(tempBot == "" || tempBot == null || tempBot == undefined){return;}
	
	botGrid.addSelection(tempBot);
}
//var lvlMk = "<%=S_USER_LVL_MK%>";
/*if(gubun=="Y") {
	// 슈퍼바이저 이상이면
	if(lvlMk<=3){
		if(DS_CNS4717.NameValue(row,"CODE_ID")=="301" || DS_CNS4717.NameValue(row,"CODE_ID")=="302" || DS_CNS4717.NameValue(row,"CODE_ID")=="341"||DS_CNS4717.NameValue(row,"CODE_ID")=="342"||DS_CNS4717.NameValue(row,"CODE_ID")=="343" || DS_CNS4717.NameValue(row, "CODE_ID")=="344" || DS_CNS4717.NameValue(row, "CODE_ID")=="345" || DS_CNS4717.NameValue(row, "CODE_ID")=="346") return true;
		else return false;			
	}
	else {
		if(DS_CNS4717.NameValue(row,"CODE_ID")=="341"||DS_CNS4717.NameValue(row,"CODE_ID")=="342"||DS_CNS4717.NameValue(row,"CODE_ID")=="343" || DS_CNS4717.NameValue(row, "CODE_ID")=="344" || DS_CNS4717.NameValue(row, "CODE_ID")=="345" || DS_CNS4717.NameValue(row, "CODE_ID")=="346") return true;
		else return false;
	}
} else {
	if(DS_CNS4717.NameValue(row,"CODE_ID")=="301"|| DS_CNS4717.NameValue(row,"CODE_ID")=="302") return true;
	else return false;
}*/

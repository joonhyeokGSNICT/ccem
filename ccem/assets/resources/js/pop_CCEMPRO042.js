var topGrid;
var midGrid;
var botGrid;
var subjectGrid;
var cselCode = ""; 			// 상담등록에서 보낸 상담구분
var searchTitle = "";		// 검색 제목

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
	case 'CCEMPRO022':
		cselCode = $("#selectbox3", opener.document).val();
    	openerTop = $.trim($("#textbox14", opener.document).val());
    	openerMid = $.trim($("#textbox16", opener.document).val());
    	openerBot = $.trim($("#textbox18", opener.document).val());
    	openerSub = $.trim($("#textbox12", opener.document).val());
    	
    	openerTop_ID = "textbox14";
    	openerMid_ID = "textbox16";
    	openerBot_ID = "textbox18";
    	openerSub_ID = "textbox12";
    	
    	openerTop_NAME = "textbox15";
    	openerMid_NAME = "textbox17";
    	openerBot_NAME = "textbox19";
    	openerSub_NAME = "";
		break;
	case 'CCEMPRO031':
		cselCode = "";
    	openerTop = $.trim($("#textbox19", opener.document).val());
    	openerMid = $.trim($("#textbox21", opener.document).val());
    	openerBot = $.trim($("#textbox23", opener.document).val());
    	openerSub = "";
    	
    	openerTop_ID = "textbox19";
    	openerMid_ID = "textbox21";
    	openerBot_ID = "textbox23";
    	openerSub_ID = "";
    	
    	openerTop_NAME = "textbox20";
    	openerMid_NAME = "textbox22";
    	openerBot_NAME = "textbox24";
    	openerSub_NAME = "";
		break;
	case 'CCEMPRO032':
		cselCode = "6";
    	openerTop = $.trim($("#textbox14", opener.document).val());
    	openerMid = $.trim($("#textbox16", opener.document).val());
    	openerBot = $.trim($("#textbox18", opener.document).val());
    	openerSub = $.trim($("#textbox12", opener.document).val());
    	
    	openerTop_ID = "textbox14";
    	openerMid_ID = "textbox16";
    	openerBot_ID = "textbox18";
    	openerSub_ID = "textbox12";
    	
    	openerTop_NAME = "textbox15";
    	openerMid_NAME = "textbox17";
    	openerBot_NAME = "textbox19";
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
					return e.value.slice(-2);
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
		if(ev.targetType == 'cell'){
			topGrid.addSelection(ev);
			topGrid.clickSort(ev);
			topGrid.clickCheck(ev);
			topSelet = topGrid.getRow(ev.rowKey);
			searchFunc2("CSEL_MTYPE_CDE",topSelet,midGrid);
			botGrid.clear();
			subjectGrid.clear();
			
			tempTop = topSelet;
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
					return e.value.slice(-2);
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
			searchFunc2("CSEL_STYPE_CDE",midSelet,botGrid);
			subjectGrid.clear();
			
			tempMid = midSelet;
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
					return e.value.slice(-2);
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
			botGrid.clickCheck(ev);
			
			botSelet = botGrid.getRow(ev.rowKey);
			tempBot = botSelet;
			
			var param = {
					senddataids: ["send1"],
					recvdataids: ["recv1"],
					send1: [{
						"CSEL_MK": botSelet.CODE_ID,
						"CSEL_TITLE": searchTitle
					}]
			};
			
			$.ajax({
				url: API_SERVER + '/cns.getCounselTitle.do',
				type: 'POST',
				dataType: 'json',
				contentType: "application/json",
				data: JSON.stringify(param),
				success: function (response) {
					console.log(response);
					if(response.errcode == "0"){
						subjectGrid.clear();
						subjectGrid.resetData(response.recv1);
					}else {
						loading.out();
						client.invoke("notify", response.errmsg, "error", 60000);
					}
				}, error: function (response) {
				}
			});
		}
    });
	
	// 상담제목 LIST
	subjectGrid = new Grid({
		el: document.getElementById('subjectGrid'),
		bodyHeight: 130,
		scrollX: false,
		columns: [
			{
				header: '분류코드',
				name: 'CSEL_TITLE_SEQ',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80,
				formatter: function(e){
					return e.value.slice(-2);
				}
            },
            {
				header: '제목',
				name: 'CSEL_TITLE',
				align: "center",
				sortable: true,
				ellipsis: true,
            }
		],
	});
	subjectGrid.on('click', (ev) => {
		if(ev.targetType == 'cell'){
			subjectGrid.addSelection(ev);
			subjectGrid.clickSort(ev);
			subjectGrid.clickCheck(ev);
			
			subSelet = subjectGrid.getRow(ev.rowKey);
			tempSub = subSelet;
		}
    });
	subjectGrid.on('dblclick', (ev) => {
		if(ev.targetType == 'cell'){
			$("#confirm").click();
		}
    });
	
	// GRID END ===
	
	// 초기 대분류 조회 func
	var param = {
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{
		    	"CODE_MK": "CSEL_LTYPE_CDE",
		    	"CSEL_MK": cselCode,
		    	"CSEL_TITLE": ""
		    		 }]
		};
	
	$.ajax({
	    url: API_SERVER + '/cns.getCounselType.do',
	    type: 'POST',
	    dataType: 'json',
	    contentType: "application/json",
	    data: JSON.stringify(param),
	    success: function (response) {
	        console.log(response);
	        if(response.errcode == "0"){
	        	topGrid.clear();
	        	midGrid.clear();
				botGrid.clear();
				subjectGrid.clear();
	        	topGrid.resetData(response.recv1);
	        	
	        	tempTop = topGrid.findRows({
			        	    CODE_ID: cselCode + openerTop
			        	})[0];
	        	
	        	if(tempTop == "" || tempTop == null || tempTop == undefined){return;}
	        	
	        	tempMid = null;
	        	tempBot = null;
	        	tempSub = null;
	        	
	        	console.log(tempTop);
	        	topGrid.addSelection(tempTop);
	        	
	        	$.ajax({
	        	    url: API_SERVER + '/cns.getCounselType.do',
	        	    type: 'POST',
	        	    dataType: 'json',
	        	    contentType: "application/json",
	        	    data: JSON.stringify({
	        		    senddataids: ["send1"],
	        		    recvdataids: ["recv1"],
	        		    send1: [{
	        		    	"CODE_MK": "CSEL_MTYPE_CDE",
	        		    	"CSEL_MK": tempTop.CODE_ID,
	        		    	"CSEL_TITLE": ""
	        		    		 }]
	        		}),
	        	    success: function (response) {
	        	        console.log(response);
	        	        if(response.errcode == "0"){
	        	        	midGrid.resetData(response.recv1);
	        	        	tempMid = midGrid.findRows({
	        			        	    CODE_ID: cselCode + openerTop + openerMid
	        			        	})[0];
	        	        	if(tempMid == "" || tempMid == null || tempMid == undefined){return;}
	        	        	
	        	        	tempBot = null;
	        	        	tempSub = null;
	        	        	
	        	        	console.log(tempMid);
	        	        	midGrid.addSelection(tempMid);
	        	        	
	        	        	$.ajax({
	        	        	    url: API_SERVER + '/cns.getCounselType.do',
	        	        	    type: 'POST',
	        	        	    dataType: 'json',
	        	        	    contentType: "application/json",
	        	        	    data: JSON.stringify({
	        	        		    senddataids: ["send1"],
	        	        		    recvdataids: ["recv1"],
	        	        		    send1: [{
	        	        		    	"CODE_MK": "CSEL_STYPE_CDE",
	        	        		    	"CSEL_MK": tempMid.CODE_ID,
	        	        		    	"CSEL_TITLE": ""
	        	        		    		 }]
	        	        		}),
	        	        	    success: function (response) {
	        	        	        console.log(response);
	        	        	        if(response.errcode == "0"){
	        	        	        	botGrid.resetData(response.recv1);
	        	        	        	
	        	        	        	tempBot = botGrid.findRows({
	        	        			        	    CODE_ID: cselCode + openerTop + openerMid + openerBot
	        	        			        	})[0];
	        	        	        	if(tempBot == "" || tempBot == null || tempBot == undefined){return;}
	        	        	        	
	        	        	        	tempSub = null;
	        	        	        	
	        	        	        	console.log(tempBot);
	        	        	        	botGrid.addSelection(tempBot);
	        	        	        	
	        	        	        	$.ajax({
	        	        	        	    url: API_SERVER + '/cns.getCounselTitle.do',
	        	        	        	    type: 'POST',
	        	        	        	    dataType: 'json',
	        	        	        	    contentType: "application/json",
	        	        	        	    data: JSON.stringify({
	        	        	        		    senddataids: ["send1"],
	        	        	        		    recvdataids: ["recv1"],
	        	        	        		    send1: [{
	        	        	        		    	"CSEL_MK": tempBot.CODE_ID,
	        	        	        		    	"CSEL_TITLE": ""
	        	        	        		    		 }]
	        	        	        		}),
	        	        	        	    success: function (response) {
	        	        	        	        console.log(response);
	        	        	        	        if(response.errcode == "0"){
	        	        	        	        	subjectGrid.resetData(response.recv1);
	        	        	        	        	
	        	        	        	        	if(openerSub == ""){
	        	        	        	        		return;
	        	        	        	        	}
	        	        	        	        	
	        	        	        	        	tempSub = subjectGrid.findRows({
	        	        	        			        	    CSEL_TITLE: openerSub
	        	        	        			        	})[0];
	        	        	        	        	console.log(tempSub);
	        	        	        	        	subjectGrid.addSelection(tempSub);
	        	        	        	        }else {
	        	        	        	        	loading.out();
	        	        	        	        	client.invoke("notify", response.errmsg, "error", 60000);
	        	        	        	        }
	        	        	        	    }, error: function (response) {
	        	        	        	    }
	        	        	        	});
	        	        	        	
	        	        	        }else {
	        	        	        	loading.out();
	        	        	        	client.invoke("notify", response.errmsg, "error", 60000);
	        	        	        }
	        	        	    }, error: function (response) {
	        	        	    }
	        	        	});
	        	        	
	        	        }else {
	        	        	loading.out();
	        	        	client.invoke("notify", response.errmsg, "error", 60000);
	        	        }
	        	    }, error: function (response) {
	        	    }
	        	});
	        	
	        	
	        }else {
	        	loading.out();
	        	client.invoke("notify", response.errmsg, "error", 60000);
	        }
	    }, error: function (response) {
	    }
	});
	
	// BUTTON EVENT
	// 조회버튼
	$("#search").click(function() {
		searchTitle = $.trim($("#subjectSearchInput").val());
		searchFunc($.trim($("#subjectSearchInput").val()), cselCode);
	});
	
	// 제목검색
	$("#subjectSearchInput").keyup(function(e){
		var keyCode = e.which;
		if(keyCode === 13){
			searchTitle = $.trim($("#subjectSearchInput").val());
			searchFunc($.trim($("#subjectSearchInput").val()), cselCode);
		}
	});
	
	// 확인 버튼
	$("#confirm").click(function() {
		if(tempTop != null && tempTop != undefined){
			$("#" + openerTop_ID, opener.document).val(tempTop.CODE_ID.slice(-2));
			$("#" + openerTop_NAME, opener.document).val(tempTop.CODE_NAME);
		}
		if(tempMid != null && tempMid != undefined){
			$("#" + openerMid_ID, opener.document).val(tempMid.CODE_ID.slice(-2));
			$("#" + openerMid_NAME, opener.document).val(tempMid.CODE_NAME);
		}
		if(tempBot != null && tempBot != undefined){
			$("#" + openerBot_ID, opener.document).val(tempBot.CODE_ID.slice(-2));
			$("#" + openerBot_NAME, opener.document).val(tempBot.CODE_NAME);
		}
		if(tempSub != null && tempSub != undefined){
			$("#" + openerSub_ID, opener.document).val(tempSub.CSEL_TITLE);
		}
		window.close();
	});
});







// 제목 검색
function searchFunc(title, csCode) {
	var param = {
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{
		    	"CODE_MK": "CSEL_LTYPE_CDE",
		    	"CSEL_MK": csCode,
		    	"CSEL_TITLE": title
		    		 }]
		};
	
	$.ajax({
	    url: API_SERVER + '/cns.getCounselType.do',
	    type: 'POST',
	    dataType: 'json',
	    contentType: "application/json",
	    data: JSON.stringify(param),
	    success: function (response) {
	        console.log(response);
	        if(response.errcode == "0"){
	        	topGrid.clear();
	        	midGrid.clear();
				botGrid.clear();
				subjectGrid.clear();
	        	topGrid.resetData(response.recv1);
	        }else {
	        	loading.out();
	        	client.invoke("notify", response.errmsg, "error", 60000);
	        }
	    }, error: function (response) {
	    }
	});
}

function searchFunc2(type, select, grid){
	var param = {
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"CODE_MK": type,
				"CSEL_MK": select.CODE_ID,
				"CSEL_TITLE": searchTitle
			}]
	};
	
	$.ajax({
		url: API_SERVER + '/cns.getCounselType.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(param),
		success: function (response) {
			console.log(response);
			if(response.errcode == "0"){
				grid.clear();
				grid.resetData(response.recv1);
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
}
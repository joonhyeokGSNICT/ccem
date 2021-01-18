var topGrid;
var midGrid;
var botGrid;
var subjectGrid;
var cselCode = $("#selectbox3", opener.document).val(); // 상담등록에서 보낸 상담구분
var searchTitle = "";
$(function(){
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
			/*var param = {
					senddataids: ["send1"],
					recvdataids: ["recv1"],
					send1: [{
						"CODE_MK": "CSEL_MTYPE_CDE",
						"CSEL_MK": topSelet.CODE_ID,
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
						midGrid.clear();
						botGrid.clear();
						subjectGrid.clear();
						midGrid.resetData(response.recv1);
					}else {
						loading.out();
						client.invoke("notify", response.errmsg, "error", 60000);
					}
				}, error: function (response) {
				}
			});*/
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
			/*var param = {
					senddataids: ["send1"],
					recvdataids: ["recv1"],
					send1: [{
						"CODE_MK": "CSEL_STYPE_CDE",
						"CSEL_MK": midSelet.CODE_ID,
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
						botGrid.clear();
						subjectGrid.clear();
						botGrid.resetData(response.recv1);
					}else {
						loading.out();
						client.invoke("notify", response.errmsg, "error", 60000);
					}
				}, error: function (response) {
				}
			});*/
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
	        	
	        	// 부모창 값 가져오기
	        	var openerTop = $("#textbox14", opener.document).val();
	        	var openerMid = $("#textbox16", opener.document).val();
	        	var openerBot = $("#textbox18", opener.document).val();
	        	var openerSub = $("#textbox12", opener.document).val();
	        	
	        	tempTop = topGrid.findRows({
			        	    CODE_ID: cselCode + openerTop
			        	});
	        	console.log(tempTop);
	        	topGrid.addSelection(tempTop[0]);
	        	
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
	        		    	"CSEL_MK": tempTop[0].CODE_ID,
	        		    	"CSEL_TITLE": ""
	        		    		 }]
	        		}),
	        	    success: function (response) {
	        	        console.log(response);
	        	        if(response.errcode == "0"){
	        	        	midGrid.resetData(response.recv1);
	        	        	
	        	        	tempMid = midGrid.findRows({
	        			        	    CODE_ID: cselCode + openerTop + openerMid
	        			        	});
	        	        	console.log(tempMid);
	        	        	midGrid.addSelection(tempMid[0]);
	        	        	
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
	        	        		    	"CSEL_MK": tempMid[0].CODE_ID,
	        	        		    	"CSEL_TITLE": ""
	        	        		    		 }]
	        	        		}),
	        	        	    success: function (response) {
	        	        	        console.log(response);
	        	        	        if(response.errcode == "0"){
	        	        	        	botGrid.resetData(response.recv1);
	        	        	        	
	        	        	        	tempBot = botGrid.findRows({
	        	        			        	    CODE_ID: cselCode + openerTop + openerMid + openerBot
	        	        			        	});
	        	        	        	console.log(tempBot);
	        	        	        	botGrid.addSelection(tempBot[0]);
	        	        	        	
	        	        	        	$.ajax({
	        	        	        	    url: API_SERVER + '/cns.getCounselTitle.do',
	        	        	        	    type: 'POST',
	        	        	        	    dataType: 'json',
	        	        	        	    contentType: "application/json",
	        	        	        	    data: JSON.stringify({
	        	        	        		    senddataids: ["send1"],
	        	        	        		    recvdataids: ["recv1"],
	        	        	        		    send1: [{
	        	        	        		    	"CSEL_MK": tempBot[0].CODE_ID,
	        	        	        		    	"CSEL_TITLE": ""
	        	        	        		    		 }]
	        	        	        		}),
	        	        	        	    success: function (response) {
	        	        	        	        console.log(response);
	        	        	        	        if(response.errcode == "0"){
	        	        	        	        	subjectGrid.resetData(response.recv1);
	        	        	        	        	
	        	        	        	        	tempSub = subjectGrid.findRows({
	        	        	        			        	    CSEL_TITLE: openerSub
	        	        	        			        	});
	        	        	        	        	console.log(tempSub);
	        	        	        	        	subjectGrid.addSelection(tempSub[0]);
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
	$("#search").click(function() {
		searchTitle = $.trim($("#subjectSearchInput").val());
		searchFunc($.trim($("#subjectSearchInput").val()), cselCode);
	});
	$("#subjectSearchInput").keyup(function(e){
		var keyCode = e.which;
		if(keyCode === 13){
			searchTitle = $.trim($("#subjectSearchInput").val());
			searchFunc($.trim($("#subjectSearchInput").val()), cselCode);
		}
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
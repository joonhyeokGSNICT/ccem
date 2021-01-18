var topGrid;
var midGrid;
var botGrid;

var csel

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
				width: 80
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
		topGrid.clickCheck(ev);
		topSelet = topGrid.getRow(ev.rowKey);
		var param = {
			    senddataids: ["send1"],
			    recvdataids: ["recv1"],
			    send1: [{
			    	"CODE_MK": "CSEL_MTYPE_CDE",
			    	"CSEL_MK": topSelet.CODE_ID,
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
		        	midGrid.resetData(response.recv1);
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
		
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
				width: 80
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
		midGrid.addSelection(ev);
		midGrid.clickSort(ev);
		midGrid.clickCheck(ev);
		
		midSelet = midGrid.getRow(ev.rowKey);
		var param = {
			    senddataids: ["send1"],
			    recvdataids: ["recv1"],
			    send1: [{
			    	"CODE_MK": "CSEL_STYPE_CDE",
			    	"CSEL_MK": midSelet.CODE_ID,
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
		        	botGrid.resetData(response.recv1);
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
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
				width: 80
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
		botGrid.addSelection(ev);
		botGrid.clickSort(ev);
		botGrid.clickCheck(ev);
		
		botSelet = botGrid.getRow(ev.rowKey);
		var param = {
			    senddataids: ["send1"],
			    recvdataids: ["recv1"],
			    send1: [{
			    	"CODE_MK": "CSEL_STYPE_CDE",
			    	"CSEL_MK": botSelet.CODE_ID,
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
		        	botGrid.resetData(response.recv1);
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
    });
	
	// 상담제목 LIST
	subjectGrid = new Grid({
		el: document.getElementById('subjectGrid'),
		bodyHeight: 130,
		scrollX: false,
		columns: [
			{
				header: '분류코드',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
            },
            {
				header: '제목',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
            }
		],
	});
	subjectGrid.on('click', (ev) => {
		subjectGrid.addSelection(ev);
		subjectGrid.clickSort(ev);
		subjectGrid.clickCheck(ev);
    });
	
	// GRID END ===
	
	var param = {
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{
		    	"CODE_MK": "CSEL_LTYPE_CDE",
		    	"CSEL_MK": "1",
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
	        	topGrid.resetData(response.recv1);
	        }else {
	        	loading.out();
	        	client.invoke("notify", response.errmsg, "error", 60000);
	        }
	    }, error: function (response) {
	    }
	});
	
});
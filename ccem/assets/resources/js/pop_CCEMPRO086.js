let grid
var multipleSmsList_grid;


$(document).keydown(function(e){
	if(e.keyCode === 13){
		onSearch();
	}
});


$(function(){
	if(opener){
		$("#multipleSend_whole").val("[" + opener.currentSendInfo.TOT + "건]" + opener.currentSendInfo.SUBJECT_NAME);	// 다량발송 팝업으로 열림
		onSearch(1);
	}
	
    // create grid
    // 다량발송 리스트
	multipleSmsList_grid = new Grid({
        el: document.getElementById("multipleSmsList_grid"),
        bodyHeight: 480,
		pageOptions: {
		  perPage: 25,
		  useClient: true
		},
		rowHeaders: [
			{
				type: 'rowNum',
                header: "NO",
            },
        ],
		columns: [
			{
				header: '일련번호',
				name: 'SEQNO',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '예약시간',
				name: 'RTIME',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.time(columnInfo.value)
			},
			{
				header: '수신자명',
				name: 'RECVNAME',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '수신전화번호',
				name: 'RPHONE',
				align: "center",
				width: 110,
				sortable: true,
				ellipsis: true,
			},
			{
				header: '전송자명',
				name: 'SENDNAME',
				align: "center",
				width: 90,
				sortable: true,
				ellipsis: true,
			},
			{
				header: '전송전화번호',
				name: 'SPHONE',
				align: "center",
				width: 110,
				sortable: true,
				ellipsis: true,
			},
			//2:전송성공,99:대기,1:발송중,0:발송대기
			{
				header: '전송상태',
				name: 'RESULT',
				align: "center",
				width: 90,
				sortable: true,
				ellipsis: true,
				formatter: function(e){
					result = "";
					if(e.value != null){
						switch(e.value){
						case '2':result = '전송성공'; break;
						case '99':result = '승인대기'; break;
						case '1':result = '발송중'; break;
						case '0':result = '발송대기'; break;
						}
					}
					return result;
				}
			},
			{
				header: '전송결과',
				name: 'ERRCODE',
				align: "center",
				width: 90,
				sortable: true,
				ellipsis: true,
			},
			{
				header: '전송일시',
				name: 'LASTTIME',
				align: "center",
				width: 90,
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.dateTime(columnInfo.value)
			},
			{
				header: '전송내용',
				name: 'MSG',
				align: "center",
				width: 370,
				sortable: true,
				ellipsis: true,
			}
		],
    });
	multipleSmsList_grid.on("click", ev => {
    	if(ev.targetType="cell"){
    		multipleSmsList_grid.addSelection(ev);
    		multipleSmsList_grid.clickSort(ev);
    	}
    });
    
    // === 이벤트
    // 탭 이동시 이벤트
    $("a[data-toggle='tab']").on("shown.bs.tab", function(e) {
		id = $(this).attr('id');
		switch($(this).attr('id')){
		// 고객정보
		case 'recieveTab':
			smsRecvListGrid.refreshLayout();
			break;
		};
    });
    
  //검색 input 이벤트 1
	$(".searchInputCheck").keyup(function(e){
		var keyCode = e.which;
		if (keyCode === 13) { // Enter Key
			$("#"+$(this).parent().parent().parent().parent().parent().parent().parent().attr("id") + "Btn").click();
		}
		if($(this).val().length != 0){	// 길이가 0일 경우 체크해제
			$("#"+$(this).attr("id") + "Check").prop("checked",true);
		}else {
			$("#"+$(this).attr("id") + "Check").prop("checked",false);
		}
	});
	
	// 고객, 선생님찾기 input 이벤트 2
	$(".searchInputCheck").change(function(e){
		//$("#"+$(this).attr("id") + "Check").prop("checked",true);
		if($(this).val().length != 0){	// 길이가 0일 경우 체크해제
			$("#"+$(this).attr("id") + "Check").prop("checked",true);
		}else {
			$("#"+$(this).attr("id") + "Check").prop("checked",false);
		}
	});
	
	// 일자 체크 이벤트
	$(".searchInputCheck_dt").keyup(function(e){
		var keyCode = e.which;
		if(keyCode === 13){
		}
		tempId = $(this).attr('id');
		if(($("#"+tempId.split('_')[0]+"_st").val().replace(/_/gi,"").length == 10 && $("#"+tempId.split('_')[0]+"_ed").val().replace(/_/gi,"").length == 10)){	// 길이가 10이 아닌 경우 체크해제
			$("#"+tempId.split('_')[0] + "DateCheck").prop("checked",true);
		}else {
			$("#"+tempId.split('_')[0] + "DateCheck").prop("checked",false);
		}
	});
});

function onSearch(auto){
	
	var param = {
			menuname: 'SMS다량발송이력',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: 	[
				{
					"RDAY": "",							// 예약일자
					"SMS_ID": "",						// SMS 아이디
					"TB_NAME": "",						// 테이블명 (필수)
					"KIND": "",							// 발송종류(0:SMS, 5:LMS, 6:알림톡)
					"FLAG": "",							// 발송상태(0:대기, 1:실패, 2:성공, '' 전체)
					"CHK_FLAG": "",						// 발송상태 조건여부
					"DEST_NAME": "",					// 수신자명
					"CHK_DEST_NAME": "",				// 수신자명 조회여부
				}
			]
	};
	
	if(auto == 1){
		//if(opener.currentSendInfo.SMS_ID){
			param.send1[0].RDAY = opener.currentSendInfo.RDAY;
			param.send1[0].SMS_ID = opener.currentSendInfo.SMS_ID != null?opener.currentSendInfo.SMS_ID:"";
			param.send1[0].TB_NAME = opener.currentSendInfo.TB_NAME;
			param.send1[0].KIND = opener.currentSendInfo.KIND;
		/*}else {
			alert("선택한 내역의 주제ID가 없습니다.");
			return;
		}*/
	}else {
		if($("#multipleSend_nameCheck").is(":checked")){
			param.send1[0].CHK_DEST_NAME = "Y";
			param.send1[0].DEST_NAME = $.trim($("#multipleSend_name").val());
		}
		if($("#multipleSend_statCheck").is(":checked")){
			param.send1[0].CHK_FLAG = "Y";
			param.send1[0].FLAG = $.trim($("#multipleSend_stat").val());
		}
		if($("#multipleSend_wholeCheck").is(":checked")){
			param.send1[0].CHK_DEST_NAME = "";
			param.send1[0].CHK_FLAG = "";
		}
		param.send1[0].RDAY = opener.currentSendInfo.RDAY;
		param.send1[0].SMS_ID = opener.currentSendInfo.SMS_ID;
		param.send1[0].TB_NAME = opener.currentSendInfo.TB_NAME;
		param.send1[0].KIND = opener.currentSendInfo.KIND;
	}
	
	$.ajax({
		url: API_SERVER + '/sys.getSMSSendInfo.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(param),
		success: function (response) {
			// console.log(response);
			if(response.errcode == "0"){
				
				// 대기건수가 없거나, 사용자 권한이 3이상이면 SMS발송 비활성화	
				if(opener.currentUser.user.userMK > 2 || response.recv1.length == 0){
					$("#sendSms").prop('disabled',true);
				}else {
					$("#sendSms").prop('disabled',false);
				}
				if(response.recv1 != null){
					multipleSmsList_grid.resetData(response.recv1);
					multipleSmsList_grid.sort('SEQNO');
				}
				multipleSmsList_grid.refreshLayout();
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
}

//============================================================================
// SMS 발송 
//============================================================================   			     	
function onSmssend(){
	// 발송 여부 확인
	if(!confirm("SMS를 발송하시겠습니까?")) return;
	
	if(opener.currentSendInfo.STATUS != 99){
		return;
	}
	
	$.ajax({
		url: API_SERVER + '/sys.excGroupMSG.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			menuname: 'SMS다량발송',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: 	[
				{
					"SMS_ID": opener.currentSendInfo.SMS_ID,						// SMS 아이디
					"RESULT": "0",
				}
			]
		}),
		success: function (response) {
			// console.log(response);
			if(response.errcode == "0"){
				
			}
		}
	})
}


//엑셀 다운로드 excelExport(그리드객체, 파일이름, 테이블id) {
function excelExport(gridId, excelfile, tableId){
	var gridAllData = gridId.getData();
	var gridData = gridId.getColumns();
	$("#"+tableId).empty();
	//헤더
	$("#"+tableId).append("<thead><tr></tr></thead>");
	for(dataObj of gridData){
		if(dataObj["hidden"] == false){
			$("#"+tableId+">thead>tr").append("<th>"+dataObj["header"]+"</th>");
		}
	}
	//내용
	$("#"+tableId).append("<tbody>");
	for(gridRow of gridAllData){
		var appendStr ="";
		appendStr += "<tr>";
		for(dataObj of gridData){
			if(dataObj["hidden"] == false){
				var tempD = gridRow[dataObj["name"]] != null? gridRow[dataObj["name"]]:"";
				appendStr += `<td style="mso-number-format:'\@'">${tempD}</td>`;
			}
		}
		appendStr += "</tr>";
		$("#"+tableId+">tbody").append(appendStr);
	}
	$("#"+tableId).append("</tbody>");
	// console.log(gridData);
		var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
		tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
		tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
		tab_text = tab_text + '<x:Name>Sheet</x:Name>';
		tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
		tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
		tab_text = tab_text + "<table border='1px'>";
		var exportTable = $("#"+tableId).clone();
		exportTable.find('input').each(function (index, elem) { $(elem).remove(); });
		tab_text = tab_text + exportTable.html();
		tab_text = tab_text + '</table></body></html>';
		var data_type = 'data:application/vnd.ms-excel';
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
	   var fileName = excelfile + '.xls';
	   //Explorer 환경에서 다운로드
	   if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
	      if (window.navigator.msSaveBlob) {
	         var blob = new Blob([tab_text], {
	            type: "application/csv;charset=utf-8;"
	         });
	         navigator.msSaveBlob(blob, fileName);
	      }
	   } else {
	      var blob2 = new Blob([tab_text], {
	         type: "application/csv;charset=utf-8;"
	      });
	      var filename = fileName;
	      var elem = window.document.createElement('a');
	      elem.href = window.URL.createObjectURL(blob2);
	      elem.download = filename;
	      document.body.appendChild(elem);
	      elem.click();
	      document.body.removeChild(elem);
	   }
}

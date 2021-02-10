let grid
var smsRecvListGrid;

var currentSendInfo;
var currentUser = opener.currentUserInfo;
$(function(){

	// 날짜 픽커
	calendarUtil.init('customerSMS_st',calendarUtil.calendarOption,function(){
		if(($("#customerSMS_st").val().replace(/_/gi,"").length == 10 && $("#customerSMS_ed").val().replace(/_/gi,"").length == 10)){	// 길이가 10이 아닌 경우 체크해제
			$("#customerSMSDateCheck").prop("checked",true);
		}else {
			$("#customerSMSDateCheck").prop("checked",false);
		}
	});
	calendarUtil.init('customerSMS_ed',calendarUtil.calendarOption,function(){
		if(($("#customerSMS_st").val().replace(/_/gi,"").length == 10 && $("#customerSMS_ed").val().replace(/_/gi,"").length == 10)){	// 길이가 10이 아닌 경우 체크해제
			$("#customerSMSDateCheck").prop("checked",true);
		}else {
			$("#customerSMSDateCheck").prop("checked",false);
		}
	});
	calendarUtil.init('customerSMSSend_st',calendarUtil.calendarOption,function(){
		if(($("#customerSMSSend_st").val().replace(/_/gi,"").length == 10 && $("#customerSMSSend_ed").val().replace(/_/gi,"").length == 10)){	// 길이가 10이 아닌 경우 체크해제
			$("#customerSMSSendDateCheck").prop("checked",true);
		}else {
			$("#customerSMSSendDateCheck").prop("checked",false);
		}
	});
	calendarUtil.init('customerSMSSend_ed',calendarUtil.calendarOption,function(){
		if(($("#customerSMSSend_st").val().replace(/_/gi,"").length == 10 && $("#customerSMSSend_ed").val().replace(/_/gi,"").length == 10)){	// 길이가 10이 아닌 경우 체크해제
			$("#customerSMSSendDateCheck").prop("checked",true);
		}else {
			$("#customerSMSSendDateCheck").prop("checked",false);
		}
	});
	calendarUtil.init('customerSMSPer_st',calendarUtil.calendarOption,function(){
		if(($("#customerSMSPer_st").val().replace(/_/gi,"").length == 10 && $("#customerSMSPer_ed").val().replace(/_/gi,"").length == 10)){	// 길이가 10이 아닌 경우 체크해제
			$("#customerSMSPerDateCheck").prop("checked",true);
		}else {
			$("#customerSMSPerDateCheck").prop("checked",false);
		}
	});
	calendarUtil.init('customerSMSPer_ed',calendarUtil.calendarOption,function(){
		if(($("#customerSMSPer_st").val().replace(/_/gi,"").length == 10 && $("#customerSMSPer_ed").val().replace(/_/gi,"").length == 10)){	// 길이가 10이 아닌 경우 체크해제
			$("#customerSMSPerDateCheck").prop("checked",true);
		}else {
			$("#customerSMSPerDateCheck").prop("checked",false);
		}
	});
	/*$('input[name="customerSMS"]').daterangepicker(calendarUtil.calendarOption, function(start, end, label) {
	    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
	  });*/
	
	// input mask
    $(".calendar").each((i, el) => calendarUtil.init(el.id));

    $(".searchInputCheck_dt").val(getToday(0)); // 오늘 날짜로 세팅
    
    // create grid
    // 수신목록
    smsRecvListGrid = new Grid({
        el: document.getElementById("smsRecvListGrid"),
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
				header: '수신일자',
				name: 'SMS_DATE',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
			},
			{
				header: '수신시간',
				name: 'SMS_TIME',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.time(columnInfo.value)
			},
			{
				header: '단말번호',
				name: 'MOBIL_ORGNO',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '수신번호',
				name: 'MOBIL_USERNO',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '메시지',
				name: 'MSG',
				align: "center",
				sortable: true,
				ellipsis: true,
			}
		],
    });
    smsRecvListGrid.on("click", ev => {
    	if(ev.targetType="cell"){
    		smsRecvListGrid.addSelection(ev);
    		smsRecvListGrid.clickSort(ev);
    	}
    });
    
    // 발신목록
    smsSendListGrid = new Grid({
        el: document.getElementById("smsSendListGrid"),
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
				header: '예약일자',
				name: 'RDAY',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
			},
			{
				header: '주제명ID',
				name: 'SMS_ID',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '주제명',
				name: 'SUBJECT_NAME',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '전송건수',
				name: 'TOT',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '성공건수',
				name: 'OK',
				align: "center",
				width: 90,
				sortable: true,
				ellipsis: true,
			},
			{
				header: '실패건수',
				name: 'NG',
				align: "center",
				width: 90,
				sortable: true,
				ellipsis: true,
			},
			{
				header: '예약건수',
				name: 'SEND',
				align: "center",
				width: 90,
				sortable: true,
				ellipsis: true,
			},
			{
				header: '대기건수',
				name: 'HOLD',
				align: "center",
				width: 90,
				sortable: true,
				ellipsis: true,
			},
			{
				header: '문자구분',
				name: 'KIND',
				align: "center",
				width: 90,
				sortable: true,
				ellipsis: true,
				hidden: true
			}
		],
    });
    smsSendListGrid.on("click", ev => {
    	if(ev.targetType="cell"){
    		smsSendListGrid.addSelection(ev);
    		smsSendListGrid.clickSort(ev);
    	}
    });
    smsSendListGrid.on("dblclick", ev => {
    	if(ev.targetType="cell"){
    		currentSendInfo = smsSendListGrid.getRow(ev.rowKey);
    		if(currentSendInfo != null){
    			PopupUtil.open('CCEMPRO086', 1145, 700);
    		}
    	}
    });
    
    // 개인별 발신목록
	smsPerSendListGrid = new Grid({
		el: document.getElementById('smsPerSendListGrid'),
		bodyHeight: 480,
		rowHeaders: [{
            type: 'rowNum',
            header: "NO",
        }],
        pageOptions: {
  		  perPage: 25,
  		  useClient: true
  		},
        columnOptions: {
            minWidth: 50,
            resizable: true,
            frozenCount: 0,
            frozenBorderWidth: 1,
        },
        columns: [
			{
				header: '구분',
				name: 'KIND_NM',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '발신일자',
				name: 'RDATE',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
			},
			{
				header: '발신시간',
				name: 'RTIME',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.time(columnInfo.value)
			},
			//data="2:성공,4:실패"	</C>	
			{
				header: '발신결과',
				name: 'RESULT',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: function(e){
					var result = "";
					switch(e.value){
					case '2':
						result = "성공"
						break;
					case '4':
						result = "실패"
						break;
					}
					return result;
				}
			},
			{
				header: '발신전화번호',
				name: 'RPHONE',
				width: 130,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담원',
				name: 'SENDNAME',
				align: "center",
				width: 80,
				sortable: true,
				ellipsis: true,
			},
			{
				header: '내용',
				name: 'MSG',
				align: "center",
				sortable: true,
				ellipsis: true,
			}
			],
	});
	smsPerSendListGrid.on('click', (ev) => {
		if(ev.targetType =='cell'){
			smsPerSendListGrid.addSelection(ev);
			smsPerSendListGrid.clickSort(ev);
			/*var currentData = smsPerSendListGrid.getRow(ev.rowKey);
			$("#smsContent").val(currentData.MSG);*/
		}
    });
    
    
    
    // === 이벤트
    // 탭 이동시 이벤트
    $("a[data-toggle='tab']").on("shown.bs.tab", function(e) {
		id = $(this).attr('id');
		smsRecvListGrid.refreshLayout();
		smsPerSendListGrid.refreshLayout();
		smsSendListGrid.refreshLayout();
    });
    
    $(".ccemBtn").click(function(){
    	id = $(this).attr("id");
    	switch(id){
    	case 'recieveTabBtn' :
    		loadList("getRecvSMS", smsRecvListGrid, "", "SMS_DATE");
    		smsRecvListGrid.refreshLayout();
    		break;
		case 'sendTabBtn' :
			loadList("getSendSMS", smsSendListGrid, "", "RDAY");
			smsSendListGrid.refreshLayout();
    		break;
		case 'personalTabBtn' :
			loadList("getTB_SMSDATA", smsPerSendListGrid, "", "RDATE");
			smsPerSendListGrid.refreshLayout();
			break;
			
    	}
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

/**
 * 그리드 리스트 조회
 * @param id	해당 그리드 id
 * @param grid	리스트를 표시 해 줄 그리드 객체
 * @returns
 * 21-01-04 최준혁
 */
function loadList(id, grid, listID, sort) {
	var param = {
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{}]
	};
	var sendUrl = '';
	
	switch(id){
	
	// 수신이력
	case 'getRecvSMS':		// 수신조회 
		param.menuname = "SMS 수/발신이력";
		if($("#customerSMSDateCheck").is(":checked")){		
			param.send1[0].CHK_SEARCH_DATE = "Y";
			param.send1[0].SEARCH_STDATE = $("#customerSMS_st").val().replace(/-/gi,"");				// 날짜시작
			param.send1[0].SEARCH_EDDATE = $("#customerSMS_ed").val().replace(/-/gi,"");				// 날짜종료
		}else {
			alert("기간은 필수입니다.");
			return;
		}
		if($("#customerSMSPhoneCheck").is(":checked")){		
			param.send1[0].CHK_MOBIL_NO = "Y";
			param.send1[0].MOBIL_NO = $("#customerSMSPhone").val().replace(/-/gi,"");					// 핸드폰번호
		}
		if($("#customerSMSNameCheck").is(":checked")){		
			param.send1[0].CHK_MSG = "Y";
			param.send1[0].MSG = $("#customerSMSName").val();											// 메세지내용
		}
		sendUrl = '/sys.getRecvSMS.do';
		break;
		
	// 발신이력
	case 'getSendSMS':
		param.menuname = "SMS 수/발신이력";
		if($("#customerSMSSendDateCheck").is(":checked")){		
			param.send1[0].CHK_SEARCH_DATE = "Y";
			param.send1[0].SEARCH_STDATE = $("#customerSMSSend_st").val().replace(/-/gi,"");				// 날짜시작
			param.send1[0].SEARCH_EDDATE = $("#customerSMSSend_ed").val().replace(/-/gi,"");				// 날짜종료
		}else {
			alert("기간은 필수입니다.");
			return;
		}
		if($("#customerSMSSendPhoneCheck").is(":checked")){		
			param.send1[0].CHK_GROUP_NAME = "Y";
			param.send1[0].GROUP_NAME = $("#customerSMSSendPhone").val().replace(/-/gi,"");					// 주제명
		}
		sendUrl = '/sys.getSendSMS.do';
		break;
		
	// 개인별 발송
	case 'getTB_SMSDATA':
		param.menuname = "SMS 수/발신이력";
		if($("#customerSMSPerDateCheck").is(":checked") || $("#customerSMSPerPhoneCheck").is(":checked")){
		}else {
			alert("검색조건이 하나 이상 필요합니다.");
			return;
		}
		
		if($("#customerSMSPerDateCheck").is(":checked")){	
			if($("#customerSMSPerPhoneCheck").is(":checked")){
			}else {
				var between = (new Date($("#customerSMSPer_ed").val()).getTime() - new Date($("#customerSMSPer_st").val()).getTime()) / 1000 / 60 / 60 / 24;
				console.log(between);
				if(between != 0){ // 두 날짜 사이 구하기
					alert("기간으로만 조회시 하루만 가능합니다.");
					return;
				}
			}
			param.send1[0].CHK_DATE = "Y";
			param.send1[0].START_DATE = $("#customerSMSPer_st").val().replace(/-/gi,"");				// 날짜시작
			param.send1[0].END_DATE = $("#customerSMSPer_ed").val().replace(/-/gi,"");					// 날짜종료
		}
		if($("#customerSMSPerPhoneCheck").is(":checked")){
			param.send1[0].CHK_PHONE = "Y";
			param.send1[0].DEST_PHONE = $("#customerSMSPerPhone").val().replace(/-/gi,"");				// 전화번호
		}
		sendUrl = '/cns.getTB_SMSDATA.do';
		break;
	}
	
	$.ajax({
		url: API_SERVER + sendUrl,
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(param),
		success: function (response) {
			console.log(response);
			if(response.errcode == "0"){
				console.log("DATA ===> :" , response);
				grid.resetData(response.recv1);
				grid.sort(sort);
				grid.refreshLayout();
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
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
	console.log(gridData);
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

let grid
var smsRecvListGrid;

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
	/*$('input[name="customerSMS"]').daterangepicker(calendarUtil.calendarOption, function(start, end, label) {
	    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
	  });*/
	
	// input mask
    $(".calendar").each((i, el) => calendarUtil.init(el.id));

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
    
    // 개인별 발신목록
    smsPerSendListGrid = new Grid({
        el: document.getElementById("smsPerSendListGrid"),
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
    smsPerSendListGrid.on("click", ev => {
    	if(ev.targetType="cell"){
    		smsPerSendListGrid.addSelection(ev);
    		smsPerSendListGrid.clickSort(ev);
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
		case 'smsSearchBtn_per' :
			
			break;
		case 'smsSearchBtn' :
    		
    		break;
		case 'smsSearchBtn_send' :
		    		
		    		break;
		case 'smsSearchBtn_per' :
			
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
	case 'getRecvSMS':		// 수신조회 
		param.menuname = "수신조회";
		if($("#customerSMSDateCheck").is(":checked")){		
			param.send1[0].CHK_SEARCH_DATE = "Y";
			param.send1[0].SEARCH_STDATE = $("#customerSMS_st").val().replace(/-/gi,"");				// 날짜시작
			param.send1[0].SEARCH_EDDATE = $("#customerSMS_ed").val().replace(/-/gi,"");				// 날짜종료
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
		
	case 'getSendSMS':
		param.menuname = "발신조회";
		if($("#customerSMSSendDateCheck").is(":checked")){		
			param.send1[0].CHK_SEARCH_DATE = "Y";
			param.send1[0].SEARCH_STDATE = $("#customerSMSSend_st").val().replace(/-/gi,"");				// 날짜시작
			param.send1[0].SEARCH_EDDATE = $("#customerSMSSend_ed").val().replace(/-/gi,"");				// 날짜종료
		}
		if($("#customerSMSSendPhoneCheck").is(":checked")){		
			param.send1[0].CHK_GROUP_NAME = "Y";
			param.send1[0].GROUP_NAME = $("#customerSMSSendPhone").val().replace(/-/gi,"");					// 주제명
		}
		sendUrl = '/sys.getSendSMS.do';
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

let grid
var multipleSmsList_grid;

$(function(){
	if(opener.currentSendInfo.SMS_ID){
		var param = {
				userid: opener.opener.currentUserInfo.user.external_id,
				menuname: 'SMS다량발송이력',
				senddataids: ["send1"],
				recvdataids: ["recv1"],
				send1: 	[
					{
						"SMS_ID": opener.currentSendInfo.SMS_ID,
						"TB_NAME": opener.currentSendInfo.TB_NAME,
					}
					]
		};
		
		$.ajax({
			url: API_SERVER + '/sys.getSMSSendInfo.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				console.log(response);
				if(response.errcode == "0"){
					console.log("DATA ===> :" , response);
					multipleSmsList_grid.resetData(response.recv1);
					multipleSmsList_grid.sort('SEQNO');
					multipleSmsList_grid.refreshLayout();
				}else {
					loading.out();
					client.invoke("notify", response.errmsg, "error", 60000);
				}
			}, error: function (response) {
			}
		});
		
	}else {
		alert("선택한 내역의 주제ID가 없습니다.");
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
						case '99':result = '대기'; break;
						case '1':result = '발송중'; break;
						case '0':result = '발송대기'; break;
						}
					}
					return result;
				}
			},
			{
				header: '에러코드',
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


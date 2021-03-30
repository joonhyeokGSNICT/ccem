var smsContentsListGrid;

var param = {send1:[{}]};
var openerParam = {};

var msgType = 0;
var originObj;
var transHist = '';

$(function(){
	
	if(opener.name.includes('top_bar')){
		originObj = opener;
	}else {
		originObj = opener.topbarObject;
	}
	
	getBasicList("13").then(function(d){$("#smsSendNum").val(CSNumber(d));});				// 대표전화번호
	const codeList = originObj.codeData.filter(el => "SMS_SENDER".includes(el.CODE_MK));
	console.log(codeList);
	
	$(".specialCharacter").click(function(){
		insertText($(this).text());
		bytesHandler($("#smsContentArea"));
		checkByteDisplay();
	});
	
	$("#smsContentArea").keyup(function(){
		bytesHandler(this);
		checkByteDisplay();
	});
	
	// 문자메세지 컨텐츠 LIST
	smsContentsListGrid = new Grid({
		el: document.getElementById('smsContentsListGrid'),
		bodyHeight: 200,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
            {
				header: '구분',
				name: 'SMS_FIX_NAME',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 100
            },
            {
				header: '메시지',
				name: 'SMS_CNTS',
				align: "left",
				sortable: true,
				ellipsis: true,
				width: 700
			},
		],
	});
	smsContentsListGrid.on('click', (ev) => {
		if(ev.targetType=='cell'){
			smsContentsListGrid.addSelection(ev);
			smsContentsListGrid.clickSort(ev);
			smsContentsListGrid.clickCheck(ev);
		}
    });
	smsContentsListGrid.on('dblclick', (ev) => {
		if(ev.targetType=='cell'){
			var contents = smsContentsListGrid.getRow(ev.rowKey).SMS_CNTS;
			$("#smsContentArea").val("");
			$("#smsContentArea").val(contents);
			bytesHandler($("#smsContentArea"));
			checkByteDisplay();
		}
    });
	
	// 발신번호 LIST
	contactNumberGrid = new Grid({
		el: document.getElementById('contactNumberGrid'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
            {
				header: '구분',
				name: 'CODE_NAME',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 100
            },
            {
				header: '발신번호',
				name: 'ETC',
				align: "left",
				sortable: true,
				ellipsis: true,
			},
		],
	});
	contactNumberGrid.on('click', (ev) => {
		if(ev.targetType=='cell'){
			contactNumberGrid.addSelection(ev);
			contactNumberGrid.clickSort(ev);
		}
    });
	contactNumberGrid.on('dblclick', (ev) => {
		if(ev.targetType=='cell'){
			$("#smsSendNum").val(contactNumberGrid.getRow(ev.rowKey).ETC);
		}
    });
	
	
	// 문자메세지 컨텐츠 리스트 조회
	$.ajax({
		url: API_SERVER + '/sys.getSMSContents.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: originObj.currentUserInfo.user.external_id,
		    menuname: 'SMS전송팝업',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{}]
		}),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				smsContentsListGrid.resetData(response.recv1);
				contactNumberGrid.resetData(codeList);
			}else {
				loading.out();
			}
		}, error: function (response) {
		}
	});
	
	
	transVar(); // SMS 데이터 세팅
	
	$("input[name=sendCheck]").change(function(){
		$("#sendtoNum").val(($(this).val()));
	})
	
});

function checkByteDisplay(){
	if(Number($("#calByte").text()) > 90){
		$("#lmsBadge").css("display","");
		$("#smsBadge").css("display","none");
		msgType = 5;
	}else{
		$("#smsBadge").css("display","");
		$("#lmsBadge").css("display","none");
		msgType = 0;
	}
};

function getTextLength(str) {
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		if (escape(str.charAt(i)).length == 6) {
			len++;
		}
		len++;
	}
	return len;
}

function bytesHandler(obj){
	var text = $(obj).val();
	$('#calByte').text(getTextLength(text));
}

function insertText(addChar){
	console.log(addChar);
	 var txtArea = document.getElementById('smsContentArea');
	 var txtValue = txtArea.value;
	 var selectPos = txtArea.selectionStart; // 커서 위치 지정
	 var beforeTxt = txtValue.substring(0, selectPos);  // 기존텍스트 ~ 커서시작점 까지의 문자
	 var afterTxt = txtValue.substring(txtArea.selectionEnd, txtValue.length);   // 커서끝지점 ~ 기존텍스트 까지의 문자
	 var addTxt = addChar; // 추가 입력 할 텍스트

	 txtArea.value = beforeTxt + addTxt + afterTxt;

	 selectPos = selectPos + addTxt.length;
	 txtArea.selectionStart = selectPos; // 커서 시작점을 추가 삽입된 텍스트 이후로 지정
	 txtArea.selectionEnd = selectPos; // 커서 끝지점을 추가 삽입된 텍스트 이후로 지정
	 txtArea.focus();
}
// 초기화
function cleanContent(){
	$("#smsContentArea").val("");
	bytesHandler($("#smsContentArea"));
	checkByteDisplay();
};

/**
 * sms 발송
 * @returns
 * 21-01-28 최준혁
 */
function sendSMS(){
	//param.send1 = [{}];
	param.userid = originObj.currentUserInfo.user.external_id;
	param.menuname = 'SMS전송';
	param.senddataids = ["send1"];
	param.recvdataids = ["recv1"];
	
	param.send1[0].MSG_TYPE = msgType;																						//메시지 타입(0:SMS,5:LMS)
	param.send1[0].DEST_PHONE = $("#sendtoNum").val().replace(/-/gi,""); 													//수신번호
	param.send1[0].DEST_NAME = $("#sendCustName").val();
	param.send1[0].SEND_PHONE = $("#smsSendNum").val().replace(/-/gi,"");
	param.send1[0].SEND_NAME =	originObj.currentUserInfo.user.name;
	param.send1[0].MSG_BODY =	$("#smsContentArea").val().replaceAll('+','＋').replaceAll('%','％');
	param.send1[0].STATUS = 0;
	param.send1[0].EXTERNAL_ID = originObj.currentUserInfo.user.external_id,         											//상담자ID
	param.send1[0].SMS_TRGT_ID = "";         																				//대상구분(1:지점,2:학부모,3:교사)
	param.send1[0].SMS_FIX_ID = "";         	
	if(transHist != null && transHist != undefined){
		param.send1[0].TRANS_HIST = transHist;
	}
	
	console.log(param);
	
	$.ajax({
		url: API_SERVER + '/sys.addSMSData.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(param),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				alert("메세지가 발송 되었습니다.");
			}else {
				loading.out();
				alert("문제가 발생했습니다.");
			}
		}, error: function (response) {
		}
	});
}

/******************************************************
 * 대표전화번호
 ******************************************************/
 function CSNumber(SSCSNumber){
     var csnumber = SSCSNumber;
     csnumber = $.trim(csnumber);
     var retNumber = "";
     var NumberArr = csnumber.split("-");
     for (i=0; i<NumberArr.length; i++) {
         if (NumberArr[i] > 0 ) retNumber = retNumber + NumberArr[i] + "-";
     }
     if (retNumber.length > 0) retNumber = retNumber.substring(0,retNumber.length-1);
     return retNumber;
 }
 
 /******************************************************
  * SMS 회원명으로 발송하기위하여 회원정보 셋팅하기.
  ******************************************************/    
  function transVar() {
	  param.send1 = [{}];
	  if(POP_DATA != undefined){
		  param.send1[0].CUST_ID 	= POP_DATA[0]; 	// 고객번호 
		  param.send1[0].DEST_NAME 	= POP_DATA[1]; 	// 고객명
		  $("#sendCustName").val(POP_DATA[1]);
		  $("#custPhoneNum").val(POP_DATA[2]); 		// 회원휴대폰
		  $("#inputTable").find('input:radio').eq(0).val(POP_DATA[2]);
		  $("#custMBRPhoneNum").val(POP_DATA[3]); 	// 회원/모 휴대폰
		  $("#inputTable").find('input:radio').eq(1).val(POP_DATA[3]);
		  $("#custFATPhoneNum").val(POP_DATA[4]); 	// 회원/부 휴대폰
		  $("#inputTable").find('input:radio').eq(2).val(POP_DATA[4]);
		  var rdoSelect      		= POP_DATA[5]; 	// 휴대폰 디폴트 선택값
		  param.send1[0].MBR_ID 	= POP_DATA[6]!=null?POP_DATA[6]:""; 	// 회원번호
		  param.send1[0].CSEL_DATE 	= POP_DATA[7]; 	// 상담일자
		  param.send1[0].CSEL_NO 	= POP_DATA[8]; 	// 상담번호
		  param.send1[0].CSEL_SEQ 	= POP_DATA[9]; 	// 상담순번
		  var sUrl  		 		= POP_DATA[10]; // 부모창 URL(clm3700, cns2100, cns2700, cns5400)
		  transHist					= POP_DATA[11]; // 이력 구분
		  if (!isNaN(rdoSelect)) {
			  $("#inputTable").find('input:radio').eq(rdoSelect-1).prop('checked', true);
			  $("#sendtoNum").val($("#inputTable").find('input:radio').eq(rdoSelect-1).parent().parent().next().val());
		  }     
	  }
  }
  
  function validationCheck(){
	  if($.trim($("#sendtoNum").val()) == ""){
		  alert("수신 전화번호를 입력하세요.");
		  return;
	  }
	  if($.trim($("#smsContentArea").val()) == ""){
		  alert("메세지 내용을 입력하세요.");
		  return;
	  }
	  
	  sendSMS();
  }

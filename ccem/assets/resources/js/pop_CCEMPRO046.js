var smsContentsListGrid;

$(function(){
	getBasicList("13").then(function(d){
		if(d.substring(0,1) == "-"){
			$("#smsSendNum").val(d.substring(1));
		}else {
			$("#smsSendNum").val(d);
		}
		});
	
	const codeList = opener.codeData.filter(el => "SMS_SENDER".includes(el.CODE_MK));
	console.log(codeList);
	
	$(".specialCharacter").click(function(){
		insertText($(this).text());
		bytesHandler($("#smsContentArea"));
		checkByte();
	});
	
	$("#smsContentArea").keyup(function(){
		bytesHandler(this);
		checkByte();
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
				align: "center",
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
			checkByte();
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
				align: "center",
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
			userid: opener.currentUserInfo.user.external_id,
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
});

function checkByte(){
	if(Number($("#calByte").text()) > 90){
		$("#lmsBadge").css("display","");
		$("#smsBadge").css("display","none");
	}else{
		$("#smsBadge").css("display","");
		$("#lmsBadge").css("display","none");
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
	checkByte();
};

/**
 * sms 발송
 * @returns
 * 21-01-28 최준혁
 */
function sendSMS(){
	
	var param = {
			userid: opener.currentUserInfo.user.external_id,
		    menuname: 'SMS전송',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"MSG_TYPE" : "",			//메시지 타입(0:SMS,5:LMS)
				"DEST_PHONE" : "",	        //수신번호
				"DEST_NAME" : "",           //수신자
				"SEND_PHONE" : "",          //발신번호
				"SEND_NAME" : "",           //발신자명
				"MSG_BODY" : "",            //전송내용
				"STATUS" : "",              //발송상태  (0:발송대기)
				"CUST_ID" : "",             //고객번호
				"MBR_ID" : "",              //회원번호
				"CSEL_DATE" : "",           //상담일자
				"CSEL_NO" : "",             //상담번호
				"CSEL_SEQ" : "",            //상담순번
				"EXTERNAL_ID" : "",         //상담자ID
				"SMS_TRGT_ID" : "",         //대상구분(1:지점,2:학부모,3:교사)
				"SMS_FIX_ID" : ""           //구분코드(1:입회,2:시정처리,3:상담연계,4:계좌변경)
			}]
		}
	
	$.ajax({
		url: API_SERVER + '/sys.addSMSData.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(param),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
			}else {
				loading.out();
			}
		}, error: function (response) {
		}
	});
}
$(function(){
	
	$("#black_CUST_ID").val(opener.currentCustInfo.CUST_ID);						// 고객번호
	loadBlackInfo();
	getCodeList();
});

/** 
 * 공통코드 조회
 */
const getCodeList = () => {
	
	var jb = $( 'select' ).get();
	var CODE_MK_LIST = [];
	for(dataObj of jb){
		if(dataObj["name"] != "" && dataObj["name"] != null){
			CODE_MK_LIST.push(dataObj["name"]);
		}
	}
	// get code
	const codeList = opener.codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// sorting
	const sortKey = "CODE_ID";
	codeList.sort((a, b) => a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0);

	// create select options
	for (const code of codeList) {

		const codeType = code.CODE_MK;
		const codeNm = code.CODE_NAME;
		const codeVal = code.CODE_ID;

		// filtering
		if (codeType == "DM_TYPE_CDE") { // 지급사유
			if (codeVal == "01" || codeVal == "02" || codeVal == "04" || codeVal == "05") continue;
		}
		if (codeType == "PROC_MK") { // 처리구분
			if (codeVal == "5" || codeVal == "6") continue;
		}

		// set
		$(`select[name='${codeType}']`).append(new Option(codeNm, codeVal));
	}
}

//유효성체크
function onChkValue(){
	bytesHandler($("#black_REMARK"));
    if( $("#black_REMARK").val().length > 500 ){
        alert("입력제한 글자수(500자)를 초과하였습니다.");    
        return false;
    }else if($("#black_REMARK").val().length == 0 ){
        alert("내용을 입력해 주십시요.");    
        return false;
    }else if($("#black_BLACK_CUST_MK").val() == ""){
    	alert("정성구분을 선택해 주십시요.");
    	return false;
    }else if(Number($("#calByte").text()) > 500){
    	alert("공지 내용은 500Byte이상 저장할 수 없습니다.\n\n다시 입력해 주십시요.");
    	return false;
    }
    
    return true;
}
// 정성회원 정보 조회
function loadBlackInfo(){
	$.ajax({
		url: API_SERVER + '/cns.getBlackCust.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '정성회원 등록/수정',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"CUST_ID"		:opener.currentCustInfo.CUST_ID,				// 회원번호
			}]
		}),
		success: function (response) {
			if(response.errcode == "0"){
				if(response.recv1.length > 0){
					console.log(response.recv1[0]);
					$("#black_CUST_ID").val(response.recv1[0].CUST_ID);						// 고객번호
					$("#black_BLACK_YN").val(response.recv1[0].BLACK_YN);					// 정성여부
					$("#black_REGDATE").val(FormatUtil.date(response.recv1[0].REGDATE));	// 생성일자
					$("#black_REG_USER_NAME").val(response.recv1[0].REG_USER_NAME);			// 생성자
					$("#black_CHGDATE").val(FormatUtil.date(response.recv1[0].CHGDATE));	// 수정일자
					$("#black_CHG_USER_NAME").val(response.recv1[0].CHG_USER_NAME);			// 수정자
					$("#black_BLACK_CUST_MK").val(response.recv1[0].BLACK_CUST_MK);			// 정성구분
					$("#black_REMARK").val(response.recv1[0].REMARK);						// 내용
				}
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
}
// 정성회원 저장
function saveBlack(){
	if(onChkValue() == true){
		$.ajax({
			url: API_SERVER + '/cns.saveBlackCust.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify({
				userid: opener.currentUserInfo.user.external_id,
			    menuname: '정성회원 등록/수정',
				senddataids: ["send1"],
				recvdataids: ["recv1"],
				send1: [{
					"CUST_ID"		:$("#black_CUST_ID").val(),				// 회원번호
					"BLACK_YN"		:$("#black_BLACK_YN").val(),
					"REMARK"		:$("#black_REMARK").val(),
					"REG_USER_ID"	:opener.currentUserInfo.user.external_id,
					"BLACK_CUST_MK"	:$("#black_BLACK_CUST_MK").val(),
				}]
			}),
			success: function (response) {
				if(response.errcode == "0"){
					alert("저장 되었습니다.");
					loadBlackInfo();
					opener.onAutoSearch($("#black_CUST_ID").val());
				}else {
					loading.out();
					alert(response.errmsg);
				}
			}, error: function (response) {
			}
		});
	}
}

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
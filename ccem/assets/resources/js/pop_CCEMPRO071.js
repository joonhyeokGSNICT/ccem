var _CUST_RESP_MK_OB ;

client.on("api_notification.ob_result_modal_on", function (data) {
	console.log('[CCEM TOPBAR] api_notification.ob_result_modal_on 진입 >>> ', data.body);
	_api.getOB();
    client.invoke('popover', 'show').then(function () {
        $('#obResultModal').modal('show');
    })
});

var _api = {
	getOB() { // 코드북 요청
		var txtList = []
		txtList.push("CALL_RST_MK_OB");		// 통화결과구분OB
		txtList.push("CUST_RESP_MK_OB");	// 고객반응OB
		txtList.push("CSEL_RST_MK_OB");		// 상담결과OB

		for (index in txtList) {
			var param = {
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{CODE_MK: txtList[index]}]
			};
			$.ajax({
				url: API_SERVER + '/sys.getCodeBook.do',
				type: 'POST',
				dataType: 'json',
				contentType: "application/json",
				data: JSON.stringify(param),
				success: function (response) {
					switch(response.dsRecv[0].CODE_MK){
						case "CALL_RST_MK_OB" :
							// console.log("getOB _ "+response.dsRecv[0].CODE_MK+" >> ",response.dsRecv);
							_init.callRstMkOb(response.dsRecv);
							break;
						case "CUST_RESP_MK_OB" :
							// console.log("getOB _ "+response.dsRecv[0].CODE_MK+" >> ",response.dsRecv);
							_CUST_RESP_MK_OB = response.dsRecv ;
							_init.custRespMkOb(response.dsRecv);
							break;
						case "CSEL_RST_MK_OB" :
							// console.log("getOB _ "+response.dsRecv[0].CODE_MK+" >> ",response.dsRecv);
							_init.cselRstMkOb(response.dsRecv);
							break;
					}
				}, error: function (response) {
				}
			});
		}
	},
}

/**
 * 모달 내 radioBox 삽입
 */
var _init = {
	callRstMkOb(respData) { // 통화결과구분OB
		var initData = respData.filter(data => data.USE_YN == 'Y');
			initData = initData.sort( function(a, b){ return a["CODE_ID"] - b["CODE_ID"]; });
		var html = '';
		html += `<colgroup>
					<col width="33.3%"></col>
					<col width="33.3%"></col>
					<col width="33.3%"></col>
				</colgroup>
				<tbody>
					<tr>`
		for ( index in initData ) {
			html += `<td>
						<div class="custom-control custom-radio custom-control-inline">
						<input id="call_rst_ob_`+index+`" name="call_rst" type="radio" class="custom-control-input" codeId="`+initData[index].CODE_ID+`">
						<label class="custom-control-label" for="call_rst_ob_`+index+`">`+initData[index].CODE_NAME+`</label>
						</div>
					</td>`
			if ( index%3 == 2 && (Number(index)+1) == initData.length )html += `</tr></tbody>`
			else if ( index%3 == 0 && (Number(index)+1) == initData.length ) html += `<td></td><td></td></tr></tbody>`	
			else if ( index%3 == 1 && (Number(index)+1) == initData.length ) html += `<td></td></tr></tbody>`	
			else if ( index%3 == 2 ) html += `</tr><tr>`
		}
		var p = document.getElementById("callRstMkObTable");
		p.innerHTML = html;
	},
	custRespMkOb(respData) { // 고객반응OB
		var initData = respData.filter(data => data.USE_YN == 'Y');
			initData = initData.sort( function(a, b){ return a["CODE_ID"] - b["CODE_ID"]; });
		if ( $("input[name=call_rst]:checked").attr("codeId") == "05" ) {	// 통화결과가 조사거부일 경우 고객반응 라디오버튼 변경
			initData = initData.filter( data => Number(data.CODE_ID) > 10);
		} else {
			initData = initData.filter( data => Number(data.CODE_ID) < 11);
		}
		var html = '';
		html += `<colgroup>
					<col width="33.3%"></col>
					<col width="33.3%"></col>
					<col width="33.3%"></col>
				</colgroup>
				<tbody>
					<tr>`
		for ( index in initData ) {
			html += `<td>
						<div class="custom-control custom-radio custom-control-inline">
						<input id="cust_rst_ob_`+index+`" name="cust_rst" type="radio" class="custom-control-input" codeId="`+initData[index].CODE_ID+`">
						<label class="custom-control-label" for="cust_rst_ob_`+index+`">`+initData[index].CODE_NAME+`</label>
						</div>
					</td>`
			if ( index%3 == 2 && (Number(index)+1) == initData.length )html += `</tr></tbody>`
			else if ( index%3 == 0 && (Number(index)+1) == initData.length ) html += `<td></td><td></td></tr></tbody>`	
			else if ( index%3 == 1 && (Number(index)+1) == initData.length ) html += `<td></td></tr></tbody>`	
			else if ( index%3 == 2 ) html += `</tr><tr>`
		}
		var p = document.getElementById("custRespMkObTable");
		p.innerHTML = html;
	},
	cselRstMkOb(respData) { // 상담결과OB
		var initData = respData.filter(data => data.USE_YN == 'Y');
			initData = initData.sort( function(a, b){ return a["CODE_ID"] - b["CODE_ID"]; });
		var html = '';
		html += `<colgroup>
					<col width="33.3%"></col>
					<col width="33.3%"></col>
					<col width="33.3%"></col>
				</colgroup>
				<tbody>
					<tr>`
		for ( index in initData ) {
			html += `<td>
						<div class="custom-control custom-radio custom-control-inline">
						<input id="csel_rst_ob_`+index+`" name="csel_rst" type="radio" class="custom-control-input" codeId="`+initData[index].CODE_ID+`">
						<label class="custom-control-label" for="csel_rst_ob_`+index+`">`+initData[index].CODE_NAME+`</label>
						</div>
					</td>`
			if ( index%3 == 2 && (Number(index)+1) == initData.length )html += `</tr></tbody>`
			else if ( index%3 == 0 && (Number(index)+1) == initData.length ) html += `<td></td><td></td></tr></tbody>`	
			else if ( index%3 == 1 && (Number(index)+1) == initData.length ) html += `<td></td></tr></tbody>`	
			else if ( index%3 == 2 ) html += `</tr><tr>`
		}
		var p = document.getElementById("cselRstMkObTable");
		p.innerHTML = html;
	}
}

var _checkVal = {
	callresult() {
		_init.custRespMkOb(_CUST_RESP_MK_OB);	
	},
	validite() {
		if (isEmpty( $("input[name=call_rst]:checked").attr("codeId") )) {
			client.invoke('notify',"[OB결과등록] 통화결과 값을 선택해야 합니다.", 'alert', 5000);
			return true;
		} else if (isEmpty( $("input[name=cust_rst]:checked").attr("codeId") )) {
			client.invoke('notify',"[OB결과등록] 고객반응 값을 선택해야 합니다.", 'alert', 5000);
			return true;
		} else if (isEmpty( $("input[name=csel_rst]:checked").attr("codeId") )) {
			client.invoke('notify',"[OB결과등록] 상담결과 값을 선택해야 합니다.", 'alert', 5000);
			return true;
		}
		return false;
	}
}

var save_call_rst = function(){
	// ccem에 ob결과 저장 후, 모달 hide
	if (_checkVal.validite() ) return false;
	
	sidebarClient.get('ticket').then(function (data) {
		console.log(data)
		if (! isEmpty(data.ticket.externalId) ) {
			if ( data.ticket.externalId.indexOf('_') > 0 ) temp.LIST_CUST_ID = data.ticket.externalId;
			else CALLBACK_ID = data.ticket.externalId;
		} else return false;
	});

	var temp = {};
	temp.OBLIST_CDE = getOBMK();
	temp.CALL_RST_MK = $("input[name=call_rst]:checked").attr("codeId");
	temp.CUST_RESP_MK = $("input[name=cust_rst]:checked").attr("codeId");
	temp.CSEL_RST_MK = $("input[name=csel_rst]:checked").attr("codeId");
	temp.USER_ID = currentUserInfo.user.external_id;
	temp.TELPNO = ""	// softphone에서 값 제시 필요
	temp.CALL_TIME = "" // softphone에서 값 제시 필요
	
	console.log('[CCEM TOPBAR] OB결과 저장 클릭!');
	console.log(temp);
    $('#obResultModal').modal('hide');
}

$(document).ready(function(){
	$("input:radio[name=call_rst]").click(function(){
		$("input:radio[name=cust_rst]:checked").prop("checked", false);
		$("input:radio[name=csel_rst]:checked").prop("checked", false);
		_init.custRespMkOb(_CUST_RESP_MK_OB);
	});
});

/**
 * 티켓필드에 입력된 리스트ID_고객번호를 반환.
 */
const getOBMK = async () => {
	if(!sidebarClient) return "";
	const ticketFieldPath = `ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["OB_MK"]}`;
	const res = await sidebarClient.get(ticketFieldPath);
	return res[ticketFieldPath] ? res[ticketFieldPath] : "";
}

// _api.getOB();
// client.invoke('popover', 'show').then(function () {
// 	$('#obResultModal').modal('show');
// })


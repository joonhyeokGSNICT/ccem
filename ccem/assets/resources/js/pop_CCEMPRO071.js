
client.on("api_notification.ob_result_modal_on", function (data) {
	console.log('[CCEM TOPBAR] api_notification.ob_result_modal_on 진입 >>> ', data.body);
	_api.getCallRstOB();
    client.invoke('popover', 'show').then(function () {
        $('#obResultModal').modal('show');
    })
});

var save_call_rst = function(){
    // ccem에 ob결과 저장 후, 모달 hide
    console.log('[CCEM TOPBAR] OB결과 저장 클릭!');
    $('#obResultModal').modal('hide');
}

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
					switch(txtList[index]){
						case "CALL_RST_MK_OB" :
							console.log("getOB _ "+txtList[index]+" >> ",response.dsRecv);
						case "CUST_RESP_MK_OB" :
							console.log("getOB _ "+txtList[index]+" >> ",response.dsRecv);
						case "CSEL_RST_MK_OB" :
							console.log("getOB _ "+txtList[index]+" >> ",response.dsRecv);
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
		var initData = respData.filter(data => data.USE_UN == 'Y');
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
			if ( index%3 == 0 && index+1 == initData.length ) {
				html += `</tr>`
			} 
			else if ( index%3 == 0 ) html += `</tr><tr>`
			else if ( index%3 == 1 && index+1 == initData.length ) html += `<td></td><td></td></tr>`	
			else if ( index%3 == 2 && index+1 == initData.length ) html += `<td></td></tr>`	
		}
		console.log(html);
		callRstMkObTable

	},
	custRespMkOb(respData) { // 고객반응OB
		var html = '';
	},
	cselRstMkOb(respData) { // 상담결과OB
		var html = '';
	}
}
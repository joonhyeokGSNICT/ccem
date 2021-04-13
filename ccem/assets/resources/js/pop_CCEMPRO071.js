var _CUST_RESP_MK_OB ;  // custRespMkOb
var _CSEL_RST_MK_OB ;   // cselRstMkOb
var _OB_CDE;
var _ticketUpdator_ID

client.on("api_notification.openOBResult", function (data) {
	console.log('[CCEM TOPBAR] api_notification.openOBResult 진입 >>> ', data.body);
	for ( index in currentTicketInfo?.ticket?.tags ) {
		// 정보이용동의, 전화설문, 고객직접퇴회, 전화상담신청, IVR콜백 시 팝업 호출
		if ( obCallFlag == true && currentTicketInfo.ticket.tags[index] == 'oblist_cde_10' || currentTicketInfo.ticket.tags[index] == 'oblist_cde_20' || currentTicketInfo.ticket.tags[index] == 'oblist_cde_30' || currentTicketInfo.ticket.tags[index] == 'oblist_cde_40' || currentTicketInfo.ticket.tags[index] == 'oblist_cde_60'    ) {
			var str = currentTicketInfo.ticket.tags[index];
			_OB_CDE = str.substr( str.length-2, 2 );
			_api.getOB();
			$('#obResultModalClose').addClass('d-none');
			client.invoke('popover', 'show').then(function () {
				$('#obResultModal').modal('show');
			})
			obCallFlag = false;
		}
	}	
});

var _api = {
	async getOB() { // 코드북 요청
		var tempList;
		tempList = await getCodeListOBsave("CALL_RST_MK_OB");
		_init.callRstMkOb( tempList );									// 통화결과구분OB
		_CUST_RESP_MK_OB = await getCodeListOBsave("CUST_RESP_MK_OB") ;
		_init.custRespMkOb(_CUST_RESP_MK_OB);							// 고객반응OB
		_CSEL_RST_MK_OB = await getCodeListOBsave("CSEL_RST_MK_OB");
		_init.cselRstMkOb( _CSEL_RST_MK_OB ); 									// 상담결과OB

		return "";
	}
}

/**
 * 모달 내 radioBox 삽입
 */
var _init = {
	callRstMkOb(respData) { // 통화결과구분OB
		var	initData = respData.sort( function(a, b){ return a["CODE_ID"] - b["CODE_ID"]; });
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
						<input id="call_rst_ob_`+index+`" name="call_rst" type="radio" class="custom-control-input" codeId="`+initData[index].CODE_ID+`" onclick="onClickRadio();">
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
		var	initData = respData.sort( function(a, b){ return a["CODE_ID"] - b["CODE_ID"]; });
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
		var	initData = respData.sort( function(a, b){ return a["CODE_ID"] - b["CODE_ID"]; });
		if ( $("input[name=call_rst]:checked").attr("codeId") == "01" || $("input[name=call_rst]:checked").attr("codeId") == "05"  ) {	// 통화결과가 통화 혹은 조사거부일 경우 고객반응 라디오버튼 변경
		} else if ( $("input[name=call_rst]:checked").attr("codeId") != "01" && $("input[name=call_rst]:checked").attr("codeId") != "05" && $("input[name=call_rst]:checked").attr("codeId") != undefined) {
			initData = initData.filter( data => Number(data.CODE_ID) > 9);
		} else {
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
		} else if ( $("input[name=call_rst]:checked").attr("codeId")==01 && isEmpty( $("input[name=cust_rst]:checked").attr("codeId") )) {
			client.invoke('notify',"[OB결과등록] 고객반응 값을 선택해야 합니다.", 'alert', 5000);
			return true;
		} else if ( $("input[name=call_rst]:checked").attr("codeId")==05 && isEmpty( $("input[name=cust_rst]:checked").attr("codeId") )) {
			client.invoke('notify',"[OB결과등록] 고객반응 값을 선택해야 합니다.", 'alert', 5000);
			return true;
		} else if ( $("input[name=call_rst]:checked").attr("codeId")==01 && isEmpty( $("input[name=csel_rst]:checked").attr("codeId") )) {
			client.invoke('notify',"[OB결과등록] 상담결과 값을 선택해야 합니다.", 'alert', 5000);
			return true;
		}
		return false;
	}
}

async function save_call_rst(){
	// ccem에 ob결과 저장 후, 모달 hide
	if (_checkVal.validite() ) return false;
	var url = '/sys.saveObCallRst.do';
	var temp = {};
	
	if (! isEmpty(_OB_CDE) ) {
		if ( _OB_CDE != 60 ) {
			temp.LIST_CUST_ID = await getTicketField("LIST_CUST_ID");	
			if ( _OB_CDE != 60 && isEmpty(temp.LIST_CUST_ID) ) {
				client.invoke('notify',"[OB결과등록] 리스트번호가 없습니다. 새로고침 후 OB결과를 저장하세요.", 'alert', 5000);
				return;
			}
		} else {
			temp.CALLBACK_ID = await getTicketField("CALLBACK_ID");
			if ( _OB_CDE == 60 && isEmpty(temp.CALLBACK_ID) ) {
				client.invoke('notify',"[OB결과등록] 콜백번호가 없습니다. 새로고침 후 OB결과를 저장하세요.", 'alert', 5000);
				return;
			}
		}
	} else return false;
	
	temp.OBLIST_CDE = _OB_CDE;												// OB코드
	temp.CALL_RST_MK = $("input[name=call_rst]:checked").attr("codeId");	// 통화결과
	temp.CUST_RESP_MK = $("input[name=cust_rst]:checked").attr("codeId");	// 고객반응
	temp.CSEL_RST_MK = $("input[name=csel_rst]:checked").attr("codeId");	// 상담결과
	temp.USER_ID = currentUserInfo.user.external_id;						// 상담사 사번
	temp.TELPNO = await getTicketField("CSEL_TELNO");						// 통화한 전화번호
	temp.CALL_TIME = "";													// 통화시간
	
	var param = {};
	param.senddataids = ["dsSend"];
	param.recvdataids = ["dsRecv"];
	param.dsSend = [temp]
	
	console.log('[CCEM TOPBAR] OB결과 저장 클릭!');
	console.log(param);		// param
    console.log(url)		// url
	
	ajax( param, url ).then( function(data) {
		var tempTicketUpdate = {};
		if ( isEmpty(data.dsRecv) ) {
			client.invoke('notify',"[OB결과등록] 성공적으로 저장되었습니다.", 'alert', 5000);
			temp.ZEN_TICKET_ID = currentTicketInfo.ticket.id;
			if ( temp.CSEL_RST_MK == '06' )	{ 					// 상담 성공일 때
				temp.CSEL_STATUS = 'solved';
				if ( _OB_CDE == '20' ) {						// 전화설문조사일 때 
					onclickCselBtn('cust');						// #1 상담 팝업 호출
					var param2 = {};							// #2 목표치 완료 후 나머지 티켓상태 업데이트
						param2.senddataids = ["dsSend"];
						param2.recvdataids = ["dsRecv1", "dsRecv2"];
						param2.dsSend = [temp];
					var urlCheck = '/sys.getRespRate.do';
					ajax( param2, urlCheck ).then( function(data) {
						console.log(data);
						if ( data.dsRecv1[0].OBJ_RESP_RATE < data.dsRecv1[0].CUR_RESP_RATE) {
							transAutoTicketUpdator(data.dsRecv2)
						}
					});
				}
			} else {
				temp.CSEL_STATUS = 'open';
			}
			temp.CSEL_CNTS = `=== OB통화결과저장 ===
							  OB통화결과: `+ $("input[name=call_rst]:checked").next().text()+`
							  고 객 반 응: `+ $("input[name=cust_rst]:checked").next().text()+`
							  OB상담결과: `+ $("input[name=csel_rst]:checked").next().text()
			updateOBresult(temp);
			$('#obResultModal').modal('hide');
		} else if (! isEmpty(data.dsRecv) ) {
			if( data.errcode != '0' ) {

			} 
		}
	});
}


/******************************************************
 * 티켓필드에 입력된 값을 반환.
 ******************************************************/
const getTicketField = async (prop) => {
	if(!sidebarClient) return "";
	var ticketFieldPath = `ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"][prop]}`;
	const res = await sidebarClient.get(ticketFieldPath);
	return res[ticketFieldPath] ? res[ticketFieldPath] : "";
}


/******************************************************
 * Zendesk 티켓 업데이트 for OB결과 저장
 * @param {object} cselData    상담정보
 * @param {object} customData  티켓정보
 ******************************************************/
const updateOBresult = async (cselData) => {

	// 티켓필드 세팅
	const custom_fields = [
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CALL_RST_MK_OB"],		value: `call_rst_mk_ob_${Number(cselData.CALL_RST_MK)}` },		// 통화결과(OB)
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CUST_RESP_MK"],			value: `cust_resp_mk_${Number(cselData.CUST_RESP_MK)}` },		// 고객반응   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_RST_MK_OB"], 		value: `csel_rst_mk_ob_${Number(cselData.CSEL_RST_MK)}` }, 		// 상담결과(OB)						// 상담결과
	];
	
	// const tag = [ `call_rst_mk_ob_${Number(cselData.CALL_RST_MK)}`, `cust_resp_mk_${Number(cselData.CUST_RESP_MK)}`, `csel_rst_mk_ob_${Number(cselData.CSEL_RST_MK)}` ]

	const option = {
		url: `/api/v2/tickets/${cselData.ZEN_TICKET_ID}`,
		method: 'PUT',
		contentType: "application/json",
		data: JSON.stringify({ 
			ticket: {
				// tags: tag,							 // 태그
				comment: {
					public		: false,				 // 내부메모
					body		: cselData.CSEL_CNTS,	 // 상담내용
				},
				status: cselData.CSEL_STATUS,			 // 티켓상태
				custom_fields,							 // 커스텀필드
			}
		}),
	}
	
	console.log(option);
	await client.request(option);
}


/************************************************************************************************************
 * API호출
 * @param arr 			api로 호출할 때 필요한 값 설정
 * @param serviceUrl 	api호출할 url 설정
 *
 * @return response 	API결과 값  
 ************************************************************************************************************/
function ajax(arr,serviceUrl) {
	return new Promise(function (resolve, reject) {
		var param = arr;
			param.userid = currentUserInfo.user.external_id;
			param.menuname = 'OB결과저장';
		
		$.ajax({
			url: API_SERVER + serviceUrl,
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: JSON.stringify(param),
			success: function (response) {
				resolve(response);
			}, error: function (response) {
			}
		});	
	});
}


/******************************************************
 * 공통코드 조회(소스)
 ******************************************************/
var getCodeListOBsave = (name) => {
	return new Promise(function (resolve, reject) {
		var CODE_MK_LIST = [];
		if( name != "" && name != null){
			CODE_MK_LIST.push(name);
		}
		// get code
		const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));
		console.log(codeList);
		resolve(codeList);
	});
}

/******************************************************
 * 라디오 버튼 클릭 시 변경
 ******************************************************/
function onClickRadio(){
	if ( $("input[name=call_rst]:checked").attr("codeId") == '01' || $("input[name=call_rst]:checked").attr("codeId") == '05' ) {
		$("section[name=cust_resp]").removeClass('d-none');
	} else {
		$("section[name=cust_resp]").addClass('d-none');
	}
	$("input:radio[name=cust_rst]:checked").prop("checked", false);
	$("input:radio[name=csel_rst]:checked").prop("checked", false);
	_init.custRespMkOb(_CUST_RESP_MK_OB);
	_init.cselRstMkOb(_CSEL_RST_MK_OB);
};

/******************************************************
 * OB결과등록 창 팝업 확인
 ******************************************************/
async function OBResultPopUp() {
	var cnt = 0;
	var temp = {};

	for ( index in currentTicketInfo.ticket.tags ) {
		// 정보이용동의, 전화설문, 고객직접퇴회, 전화상담신청, IVR콜백 시 팝업 호출
		if ( currentTicketInfo.ticket.tags[index] == 'oblist_cde_10' || currentTicketInfo.ticket.tags[index] == 'oblist_cde_20' || currentTicketInfo.ticket.tags[index] == 'oblist_cde_30' || currentTicketInfo.ticket.tags[index] == 'oblist_cde_40' || currentTicketInfo.ticket.tags[index] == 'oblist_cde_60') {
			if ( currentTicketInfo.ticket.tags[index] != 'oblist_cde_60' ) {
				temp.LIST_CUST_ID = await getTicketField("LIST_CUST_ID");	
				if ( _OB_CDE != 60 && isEmpty(temp.LIST_CUST_ID) ) {
					client.invoke('notify',"[OB결과등록 팝업호출] 리스트번호가 없습니다. 새로고침 후 OB결과를 저장하세요.", 'alert', 5000);
					return;
				}
			} else {
				temp.CALLBACK_ID = await getTicketField("CALLBACK_ID");
				if ( _OB_CDE == 60 && isEmpty(temp.CALLBACK_ID) ) {
					client.invoke('notify',"[OB결과등록 팝업호출] 콜백번호가 없습니다. 새로고침 후 OB결과를 저장하세요.", 'alert', 5000);
					return;
				}
			}

			var str = currentTicketInfo.ticket.tags[index];
			_OB_CDE = str.substr( str.length-2, 2 );
			_api.getOB();
			$('#obResultModalClose').removeClass('d-none');
			client.invoke('popover', 'show').then(function () {
				$('#obResultModal').modal('show');
			})
			cnt++;
		} 
		if ( Number(index)+1 == currentTicketInfo.ticket.tags.length && cnt == 0 ) {
			client.invoke('notify',"해당 티켓은 OB상담건이 아닙니다.", 'alert', 5000);
		}
	}	

}

/******************************************************
 * OB결과등록 창 팝업 닫기
 ******************************************************/
function closeOBResultModal() {
	$('#obResultModal').modal('hide');
}

/******************************************************
 * ticketUpdator App 정보 확인 및 값 전송
 * @param transData 전송할 티켓 데이터
 ******************************************************/
function transAutoTicketUpdator(transData) {
	client.request('/api/v2/apps/installations').then(function (datas) {
	   _ticketUpdator_ID = datas.installations.filter(data => data.settings.name == 'ticketUpdator')[0]?.app_id;

	   client.request({
			url:'/api/v2/apps/notify.json',
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			data: JSON.stringify({
				"event": "autoTicketUpdator", 
				"app_id": _ticketUpdator_ID, 
				"agent_id": currentUserInfo.user.id, 
				"body": transData
			})
		}).then(function (data){ console.log(data) });
    });
   
   client.invoke('notify',"[전화설문조사] 해당 전화설문조사가 완료되었습니다.", 'alert', 5000);
}
//전역변수
var sTelNo_DDD = new Array(
                              "02"    // 서울
                            , "031"   // 경기도
                            , "032"   // 인천
                            , "033"   // 강원
                            , "041"   // 충남
                            , "042"   // 대전
                            , "043"   // 충북
                            , "044"   // 세종시
                            , "051"   // 부산
                            , "052"   // 울산
                            , "053"   // 대구
                            , "054"   // 경북
                            , "055"   // 경남
                            , "061"   // 전남
                            , "062"   // 광주
                            , "063"   // 전북
                            , "064"   // 제주

                            , "010"   // 통합(이동)
                            , "011"   // SKT
                            , "016"   // KTF
                            , "017"   // SKT
                            , "018"   // KTF
                            , "019"   // LGT

                            , "0502"   // 평생번호(KT)
                            , "0504"   // 평생번호(KT)
                            , "0505"   // 평생번호(데이콤)
                            , "0506"   // 평생번호(KT)
                            , "060"   // 서비스/정보이용
                            , "070"   // 인터넷전화
                            , "080"   // 수신자부담(크로바서비스)

                            );
// 전역변수(핸드폰번호)
var sTelHPNo_DDD = new Array(                            
                              "010"   // 통합(이동)
                            , "011"   // SKT
                            , "016"   // KTF
                            , "017"   // SKT
                            , "018"   // KTF
                            , "019"   // LGT

                            , "0502"   // 평생번호(KT)
                            , "0504"   // 평생번호(KT)
                            , "0505"   // 평생번호(데이콤)
                            , "0506"   // 평생번호(KT)
                            
                            );


/**
 * api 오류 체크
 * @param {object} response 
 * @param {object} settings 
 * @param {string} customMsg
 */
const checkApi = (response, settings) => {
	if (response.errcode == "0") return true;

	let errMsg = "[CCEM] " + (settings.errMsg || "서버에서 오류가 발생하였습니다.");
	errMsg += `<br><br>오류코드 : ${response.errcode}<br>오류메시지 : ${response.errmsg}<br>호출서비스 : ${settings.url}`;

	if(typeof client != 'undefined') {
		client.invoke("notify", errMsg, "error", 60000);
	}else {
		errMsg = errMsg.replaceAll("<br>", "\n");
		alert(errMsg);
	}

	return false;
}

/**
 * api 오류 메시지 반환
 * @param {object} response 
 * @param {object} settings 
 * @param {string} customMsg
 */
const getApiMsg = (response, settings) => `오류코드 : ${response.errcode}\n오류메시지 : ${response.errmsg}\n호출서비스 : ${settings.url}`;

/**
 * 날짜계산 함수
 * @param {string} type year, month, day
 * @param {number} num 
 */
const getDateFormat = (type, num) => {
    let date = new Date();
    if (typeof type == "string" && typeof num == "number") {
        if (type == "year") {
            date.setFullYear(date.getFullYear() + num);
        } else if (type == "month") {
            date.setMonth(date.getMonth() + num);
        } else if (type == "day") {
            date.setDate(date.getDate() + num);
        }
    }
    let y = date.getFullYear();
    let m = ("0" + (date.getMonth() + 1)).slice(-2);
    let d = ("0" + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
}

/**
 * 시간
 */
const getTimeFormat = () => {
	let today = new Date();   
	let h = ("0"+today.getHours()).slice(-2); 
	let m = ("0" + today.getMinutes()).slice(-2);
	let s = ("0" + today.getSeconds()).slice(-2);
	return `${h}:${m}:${s}`;
}

/**
 * @param {object} tableEl 
 * @param {string} fileName 
 */
const tableToExcel = (tableEl, fileName) => {
	let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
	tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
	tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
	tab_text = tab_text + '<x:Name>Sheet1</x:Name>';
	tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes>';
	tab_text = tab_text + '/x:WorksheetOptions></x:ExcelWorksheet>';
	tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head>';
	tab_text = tab_text + "<body><table border='1px'>";
	tab_text = tab_text + tableEl.html();
	tab_text = tab_text + '</table></body></html>';
	// let data_type = 'data:application/vnd.ms-excel';
	let data_type = 'application/csv;charset=utf-8;';
	let ua = window.navigator.userAgent;
	let msie = ua.indexOf("MSIE ");
	let blob = new Blob([tab_text], { type: data_type });
	//Explorer 환경에서 다운로드
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		if (window.navigator.msSaveBlob) navigator.msSaveBlob(blob, fileName);
	} else {
		let elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob);
		elem.download = fileName;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
}

/**
 * 빈 객체(또는 빈 배열) 체크
 * @param {object|Array} param 
 */
const isEmpty = (param) => {
    if (!param)  return true;
    return Object.keys(param).length === 0;
}

/**
 * 녹취청취
 * - as-is : cns6200.onRecPlay()
 * - Test recordId : "202102031640157898"
 * @param {string} recordId 녹취ID
 */
const recordPlay = recordId => {

	if (!recordId || recordId.length != 18) {
		if(typeof client != "undefined") client.invoke("notify", `녹취코드가 정상적이지 않습니다.<br><br>녹취 청취 할 수 없습니다.`, "error", 60000);
    	else alert("녹취코드가 정상적이지 않습니다.\n\n녹취 청취 할 수 없습니다.");
		return;
	}

	const url = `${REC_SERVER}?date=${recordId.substr(0, 8)}&keycode=${recordId}&local=${recordId.substr(14, 4)}`;
	window.open(url, "VoiceRecPlayA", "width=1000, height=730, top=0, left=0, tool=no,location=no,scrollbars=yes,directories=no,resizable=yes");

}

/**
 * 국번번호 체크
 * @param ddd
 * @returns
 * 21-01-08 최준혁
 */
function gf_chkDDDNumber(ddd){
    for (i=0 ; i<sTelNo_DDD.length ;i++){
        if (sTelNo_DDD[i] == ddd) return true;
    }
    return false;
}

/**
 * 휴대폰 앞자리 체크
 * @param ddd
 * @returns
 */
function chkHPDDDNumber(ddd){
    for (i=0 ; i<sTelHPNo_DDD.length ;i++){
        if (sTelHPNo_DDD[i] == ddd) return true;
    }
    return false;
}

/**
 * 기준값 조회
 * @param {string} key
 * @param {string} customMsg
 */
const getBasicList = (key, customMsg) => new Promise((resolve, reject) => {
	customMsg = (customMsg || "기준값 조회") + "중 오류가 발생하였습니다.";

	const settings = {
		url: `${API_SERVER}/sys.getBasicList.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}],
		}),
	}

	$.ajax(settings)
		.done(data => {
			if(!checkApi(data, settings)) return reject(new Error(getApiMsg(data, settings)));

			const basicList = data.dsRecv;
			if(basicList.length === 0) {
				alert(customMsg);
				return reject(new Error("검색 결과가 없습니다."));
			}

			const basic = basicList.find(el => el.BSC_SCT == key);
			if (!basic) {
				alert(customMsg);
				return reject(new Error("검색 결과가 없습니다."));
			}

			return resolve(basic.BSC_VAL);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 로젠택배 배송정보 창
 * @param {string} invoiceNum 송장번호
 */
const openLogen = (invoiceNum) => {   
	// invoiceNum = "90318348201"; // TEST 
    const baseUrl = "http://www.ilogen.com/d2d/delivery/invoice_search_popup.jsp?viewType=type2&invoiceNum=";
    window.open(baseUrl + invoiceNum, "logen", "width=730, height=600");
}

/**
 * byte 체크
 * - as-is : cns5810.onTextAreaKeyUp()
 * @param {string} value 
 * @param {number} limit 
 */
const checkByte = (value, limit) => {

	const byteCnt = value.length + (escape(value) + "%u").match(/%u/g).length - 1;
	return byteCnt < limit;

}

/**
 * 상담 통화시간 저장
 * @param {object} param 저장정보
 */
 var saveCallTime = async (param) => {
	console.debug("saveCallTime: ", param);

	const settings = {
		global: false,
		url: `${API_SERVER}/sys.saveCallTime.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid		: param.userid,
			menuname	: param.menuname,
			senddataids	: ["dsSend"],
			recvdataids	: ["dsRecv"],
			dsSend		: [{
				CSEL_NO		: param.CSEL_NO, 		// 상담번호	
				CSEL_DATE	: param.CSEL_DATE, 		// 상담일자		
				CALL_STTIME	: param.CALL_STTIME, 	// 통화시작시간(시분초:172951)		
				CALL_EDTIME	: param.CALL_EDTIME, 	// 통화종료시간(시분초:173428)		
				RECORD_ID	: param.RECORD_ID, 		// 녹취키(리스트) 없는 경우 []		
			}]
		}),
		errMsg: "상담 통화시간 저장중 오류가 발생하였습니다.",
	}
	
	$.ajax(settings)
		.done(res => {
			if (res.errcode != "0") console.error(getApiMsg(res, settings));
		})
		.fail((jqXHR) => {
			console.error(getErrMsg(jqXHR.statusText));
		});

};

/**
 * 해당 티켓필드에서 통화시작/종료시각/녹취키his 반환.
 * @param {string|number} ticket_id
 */
var getCallTimeCondition = async (client, ticket_id) => {

	let CALL_STTIME = "";   		// 통화시작시각 	   
	let CALL_EDTIME = "";   		// 통화종료시각  
	let RECORD_ID_HIS = ""; 		// 녹취키History (string)
	let RECORD_ID_HIS_Arr = [];		// 녹취키History (array)

	try {

		const { ticket } = await client.request(`/api/v2/tickets/${ticket_id}`);

		if (ticket?.custom_fields?.length > 0) {

			const fCALL_STTIME 	 = ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["CALL_STTIME"]);
			const fCALL_EDTIME 	 = ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["CALL_EDTIME"]);
			const fRECORD_ID_HIS = ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["RECORD_ID_HIS"]);

			CALL_STTIME   = fCALL_STTIME?.value 	|| "";
			CALL_EDTIME   = fCALL_EDTIME?.value 	|| "";
			RECORD_ID_HIS = fRECORD_ID_HIS?.value   || "";
			RECORD_ID_HIS_Arr = RECORD_ID_HIS ? RECORD_ID_HIS.split(",") : [];

		}

	} catch (error) {
		console.error(error);
	} 

	return { CALL_STTIME, CALL_EDTIME, RECORD_ID: RECORD_ID_HIS_Arr };

}
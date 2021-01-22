let currentUser = {};   // 현재 사용중인 유저의 정보(ZENDESK)
let codeData = [];

let giftList = [];      // 사은품내역2 코드

let DS_COUNSEL      = {};   // 상담내역
let DS_CHARGE       = {};   // 담당선생님과 지점장
let DS_VOC_PROC     = {};   // VOC 지점 처리 내역
let DS_GIFT         = {};   // 사은품
let DS_HPCALL1      = {};   // 1차 해피콜 내역
let DS_HPCALL2      = {};   // 2차 해피콜 내역
let DS_TRANS_DEPT   = {};   // 형제회원 지점확인을 위한 조회
let DS_DEPT_PROC    = {};   // 센터처리 내역

let sCSEL_DATE  = "";   // 상담일자
let sCSEL_NO    = "";   // 상담번호
let sCSEL_SEQ   = "";   // 상담순번
let sPROC_MK    = "";   // 처리구분

let SEND_PHONE = "";    // 대표번호

let sCallPage = "";

$(function () {

    // create calendar
    calendarUtil.init("calendar1", { drops: "up", opens: "left" });
    
    // input mask
    calendarUtil.currency("textbox30");
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
    $(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));

    onStart(opener ? opener.name : "");
    getGiftList();

});

/**
 * 오픈하는곳에 따라 분기처리
 * @param {string} openerNm 
 */
const onStart = async (openerNm) => {
    
    console.debug("openerNm: ", openerNm)
    

    // TODO 상담조회에서 팝업 되었을때,
    if (openerNm.includes("CCEMPRO000")) { 
        sCSEL_DATE = "";
        sCSEL_NO   = "";
        sCSEL_SEQ  = "";
        sPROC_MK   = "";
        sCallPage = "1";
    }
    // TODO 시정처리관리에서 팝업되었을때,
    else if (openerNm.includes("CCEMPRO000")) { 
        sCSEL_DATE = "";
        sCSEL_NO   = "";
        sCSEL_SEQ  = "";
        sPROC_MK   = "";
        sCallPage = "2";
    }
    // TODO I/B해피콜 리스트에서 팝업되었을때,
    else if (openerNm.includes("CCEMPRO000")) { 
        sCSEL_DATE = "";
        sCSEL_NO   = "";
        sCSEL_SEQ  = "";
        sPROC_MK   = "";
        sCallPage = "3";
    }
    // TODO 연계확인에서 팝업되었을때,
    else if (openerNm.includes("CCEMPRO000")) { 
        sCSEL_DATE = "";
        sCSEL_NO   = "";
        sCSEL_SEQ  = "";
        sPROC_MK   = "";
        sCallPage = "3";
    }
    // TODO 상담등록에서 팝업되었을때,
    else if (openerNm.includes("CCEMPRO022")) {
        currentUser = opener.currentUser;
        codeData    = opener.codeData;

        sCSEL_DATE = opener.calendarUtil.getImaskValue("textbox27");    //상담일자
        sCSEL_NO   = $("#textbox28", opener.document).val();            //상담번호
        sCSEL_SEQ  = $("#selectbox14", opener.document).val();          //상담순번
        sPROC_MK   = $("#selectbox4", opener.document).val();           //처리구분

        sCallPage = "4";

        getCounselRst(sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);
        getCharge(sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);
        getDeptProcVoc(sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);
        getGift(sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);
        getHappy1(sCSEL_DATE, sCSEL_NO);
        getTransList(sCSEL_DATE, sCSEL_NO, sPROC_MK);
        
    }

    setCodeData(codeData);

}

/**
 * 콤보박스 세팅
 * - as-is : cns2700.setCombo()
 * @param {object} data codeData
 */
const setCodeData = (data) => {

	const CODE_MK_LIST = [
        "SATIS_CDE",        // 상담원만족도
        "HPCALL_CHNL_MK",   // 피드백경로
        "GIFT_TYPE_CDE",    // 사은품내역1
        "GIFT_CHNL_MK",     // 발송경로
	];

	// get code
	const codeList = data.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// create select options
	for (const code of codeList) {
		$(`select[name='${code.CODE_MK}']`).append(new Option(code.CODE_NAME, code.CODE_ID));
    }
    
}

/**
 * 사은품내역2 코드 조회
 */
const getGiftList = () => {
    
    const settings = {
		url: `${API_SERVER}/sys.getGiftList.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ }],
		}),
		errMsg: "사은품내역 코드 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
        if (!checkApi(data, settings)) return;
        giftList = data.dsRecv;
        giftList.forEach(el =>  $("#selectbox6").append(new Option(el.GIFT_NAME, el.GIFT_CDE)));
	});
}

/**
 * 상담내역 조회
 * - as-is : cns2700.onSearch()
 * @param {string} CSEL_DATE 상담일자
 * @param {string} CSEL_NO   상담번호
 * @param {string} CSEL_SEQ  상담순번
 */
const getCounselRst = (CSEL_DATE, CSEL_NO, CSEL_SEQ) => {

	const settings = {
		url: `${API_SERVER}/cns.getCounselRst.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ CSEL_DATE, CSEL_NO, CSEL_SEQ }],
		}),
		errMsg: "상담내역 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		if (data.dsRecv.length >= 1) {
            DS_COUNSEL = data.dsRecv[0];
            calendarUtil.setImaskValue("datebox1", DS_COUNSEL.CSEL_DATE || "")            // 상담일자
            // DS_COUNSEL.CSEL_NO             // 상담번호
            // DS_COUNSEL.CSEL_SEQ            // 상담순번
            // DS_COUNSEL.CUST_ID             // 고객번호
            // DS_COUNSEL.CUST_MK             // 고객구분
            // DS_COUNSEL.CSEL_USER_ID        // 상담원ID
            // DS_COUNSEL.CSEL_STTIME         // 상담시작시간
            $("#textbox16").val(DS_COUNSEL.CSEL_TITLE);          // 상담제목
            $("#textbox17").val(DS_COUNSEL.CSEL_CNTS);           // 상담상세내용
            // DS_COUNSEL.MBR_ID              // 회원번호
            calendarUtil.setImaskValue("datebox2", DS_COUNSEL.PROC_HOPE_DATE || "");       // 처리희망일자
            // DS_COUNSEL.DEPT_ID             // 관할지점코드
            calendarUtil.setImaskValue("datebox3", DS_COUNSEL.TRANS_DATE || "");           // 연계일자
            // DS_COUNSEL.TRANS_NO            // 연계번호
            // DS_COUNSEL.PROC_MK             // 처리구분
            // DS_COUNSEL.PROC_STS_MK         // 처리상태구분
            // DS_COUNSEL.TO_TEAM_DEPT        // 지점장부서
            $("#textbox14").val(DS_COUNSEL.CSEL_MK_NAME);        // 상담구분
            $("#textbox15").val(DS_COUNSEL.PROC_MK_NAME);        // 처리구분
            $("#textbox6").val(DS_COUNSEL.LIMIT_MK_NAME);        // 처리시한구분
            $("#textbox3").val(DS_COUNSEL.CSEL_USER);            // 상담원명
            $("#textbox22").val(DS_COUNSEL.DEPT_NAME);           // 관할지점명
            $("#textbox4").val(DS_COUNSEL.EMP_MBR_ID);           // 회원번호
            $("#textbox1").val(DS_COUNSEL.NAME);                 // 교사명or고객명
            $("#textbox2").val(DS_COUNSEL.TEL_NO);               // 전화번호
            $("#textbox5").val(DS_COUNSEL.MOBIL_NO);             // 휴대폰번호
            $("#textbox8").val(DS_COUNSEL.DONG);                 // 동
            $("#textbox9").val(DS_COUNSEL.ADDR);                 // 동이하
            // DS_COUNSEL.FAT_RSDNO           // 세대주주민번호
            $("#timebox5").val(DS_COUNSEL.TRANS_TIME);           // 연계시간
            $("#textbox23").val(DS_COUNSEL.DEPT_REP_EMP);        // 교육국장(사업국장)
            $("#textbox10").val(DS_COUNSEL.DEPT_REP_EMP);
            // DS_COUNSEL.CSEL_RST_MK         // 상담결과
            $("#textbox7").val(DS_COUNSEL.ETC_TEL_NO);           // 모연락처
            // DS_COUNSEL.FAT_TEL_NO          // 부연락처
            // DS_COUNSEL.CSEL_MAN_MK         // 내담자구분
            // DS_COUNSEL.DEPT_REP_EMP_PDA    // 교육국장 PDA
            $("#textbox11").val(DS_COUNSEL.DEPT_REP_EMP_HP);     // 교육국장 HP
            // DS_COUNSEL.DEPT_REP_EMPID      // 교육국장 사번
            $("#textbox13").val(DS_COUNSEL.LC_REP_EMP_HP);       // 센터장 HP
            // DS_COUNSEL.LC_REP_EMPID        // 센터장 사번
            $("#textbox12").val(DS_COUNSEL.LC_REP_EMP);          // 센터장
            
            setText(DS_COUNSEL.CUST_MK);          // 고객 또는 선생님 셋팅
            setButton(DS_COUNSEL.PROC_STS_MK);    // 버튼 셋팅
            setDisplay(DS_COUNSEL.PROC_STS_MK, DS_COUNSEL.CSEL_RST_MK);   // 화면 셋팅

        }

	});
}

/**
 * 담당선생님, 지점장 정보 조회
 * - as-is : cns2700.onSearch()
 * @param {string} CSEL_DATE 상담일자
 * @param {string} CSEL_NO   상담번호
 * @param {string} CSEL_SEQ  상담순번
 */
const getCharge = (CSEL_DATE, CSEL_NO, CSEL_SEQ) => {

	const settings = {
		url: `${API_SERVER}/cns.getCharge.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ CSEL_DATE, CSEL_NO, CSEL_SEQ }],
		}),
		errMsg: "담당선생님 및 지점장 정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		if (data.dsRecv.length >= 1) {
		    DS_CHARGE = data.dsRecv[0];
            // DS_CHARGE.EMP_ID            // 교사사번  
            $("#textbox20").val(DS_CHARGE.TCHR_NAME);         // 교사명      
            // DS_CHARGE.PART_EMP_ID       // 지점장사번      
            $("#textbox21").val(DS_CHARGE.PART_NO1_NAME);     // 지점장명   
        }

	});
}

/**
 * 사업국처리 내역 조회
 * - as-is : cns2700.onSearch()
 * @param {string} CSEL_DATE 상담일자
 * @param {string} CSEL_NO   상담번호
 * @param {string} CSEL_SEQ  상담순번
 */
const getDeptProcVoc = (CSEL_DATE, CSEL_NO, CSEL_SEQ) => {

	const settings = {
		url: `${API_SERVER}/cns.getDeptProcVoc.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ CSEL_DATE, CSEL_NO, CSEL_SEQ }],
		}),
		errMsg: "사업국처리 내역 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		if (data.dsRecv.length >= 1) {
            DS_VOC_PROC = data.dsRecv[0];
            calendarUtil.setImaskValue("datebox7", DS_VOC_PROC.VOC_PROC_DATE || "");     // 처리일자      
            $("#timebox4").val(DS_VOC_PROC.VOC_PROC_TIME);     // 처리시간          
            // DS_VOC_PROC.VOC_PROC_EMP_ID   // 처리자ID          
            $("#textbox29").val(DS_VOC_PROC.VOC_PROC_EMP_NM);   // 처리자          
            $("#textbox33").val(DS_VOC_PROC.VOC_PROC_CNTS);     // 처리내용          
            // DS_VOC_PROC.CTI_CHGDATE       // CTI변경일자     
        }

        getDeptProc(sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);

	});
}

/**
 * 사은품 정보 조회
 * - as-is : cns2700.onSearch()
 * @param {string} CSEL_DATE 상담일자
 * @param {string} CSEL_NO   상담번호
 * @param {string} CSEL_SEQ  상담순번
 */
const getGift = (CSEL_DATE, CSEL_NO, CSEL_SEQ) => {

	const settings = {
		url: `${API_SERVER}/cns.getGift.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ CSEL_DATE, CSEL_NO, CSEL_SEQ }],
		}),
		errMsg: "사은품 정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
        if (!checkApi(data, settings)) return;

		if (data.dsRecv.length >= 1) {
            DS_GIFT = data.dsRecv[0];
            // DS_GIFT.GIFT_DATE       // 사은품접수일자    
            // DS_GIFT.GIFT_NO         // 사은품접수번호
            // DS_GIFT.GIFT_SEQ        // 사은품접수순번    
            // DS_GIFT.DTL_MK          // 내역구분
            // DS_GIFT.CUST_ID         // 고객번호
            $("#selectbox5").val(DS_GIFT.GIFT_TYPE_CDE);   // 사은품분류코드  (내역1) 
            $("#selectbox6").val(DS_GIFT.GIFT_CDE);        // 사은품코드     (내역2)
            calendarUtil.setImaskValue("textbox30", String(DS_GIFT.GIFT_PRICE));    // 사은품가격    
            calendarUtil.setImaskValue("calendar1", DS_GIFT.SEND_DATE || "");       // 발송일자    
            $("#selectbox7").val(DS_GIFT.GIFT_CHNL_MK);    // 전달경로구분        
            $("#textbox31").val(DS_GIFT.PASS_USER);        // 전달자    
            // DS_GIFT.CTI_CHGDATE     // CTI변경일자    
            $("#textbox32").val(DS_GIFT.INVOICENUM);       // 배송송장번호    
        } 
        // 검색결과가 없는경우.
        else {
            calendarUtil.setImaskValue("calendar1", getDateFormat());           // 발송일자  
        }

        // 사은품분류(내역1)이 없으면 사은품코드(내역2) 비활성화
        onChangeGiftType();
        
	});
}

/**
 * 1차 해피콜 내역 조회
 * - as-is : cns2700.onSearch()
 * @param {string} CSEL_DATE 상담일자
 * @param {string} CSEL_NO   상담번호
 */
const getHappy1 = (CSEL_DATE, CSEL_NO) => {

	const settings = {
		url: `${API_SERVER}/cns.getHappy1.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ CSEL_DATE, CSEL_NO }],
		}),
		errMsg: "1차 해피콜 내역 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		if (data.dsRecv.length >= 1) {
            DS_HPCALL1 = data.dsRecv[0];
            // DS_HPCALL1.CSEL_DATE        // 상담일자       
            // DS_HPCALL1.CSEL_NO          // 상담번호   
            calendarUtil.setImaskValue("datebox5", DS_HPCALL1.HPCALL_DATE || ""); // 해피콜일자       
            $("#timebox2").val(DS_HPCALL1.HPCALL_TIME);        // 해피콜시간       
            $("#textbox26").val(DS_HPCALL1.HPCALL_TITLE);      // 해피콜제목           
            $("#textbox35").val(DS_HPCALL1.HPCALL_CNTS);       // 해피콜내용       
            $("#selectbox2").val(DS_HPCALL1.HPCALL_CHNL_MK);   // 해피콜경로구분           
            // DS_HPCALL1.HPCALL_USER_ID   // 해피콜담당자ID           
            $("#selectbox1").val(DS_HPCALL1.SATIS_CDE);        // 고객만족도코드       
            // DS_HPCALL1.SATIS_CDE1       // 고객만족도코드1       
            // DS_HPCALL1.SATIS_CDE2       // 고객만족도코드2       
            // DS_HPCALL1.GIFT_DATE        // 사은품접수일자       
            // DS_HPCALL1.GIFT_NO          // 사은품접수번호   
            // DS_HPCALL1.CTI_CHGDATE      // CTI변경일자    
            $("#textbox25").val(DS_HPCALL1.HPCALL_NAME);        // 해피콜담당자명 // TODO 서비스목록에 없음, 실제로 오는지 확인하고 안오면 요청.
            getHappy2(sCSEL_DATE, sCSEL_NO, true);
        } 
        // 처음 저장인 경우
        else {
            calendarUtil.setImaskValue("datebox5", getDateFormat()); // 해피콜일자 초기화
            $("#timebox2").val(getTimeFormat());                     // 해피콜시간 초기화
            $("#textbox25").val(currentUser.name);                   // 해피콜담당자명 초기화
            getHappy2(sCSEL_DATE, sCSEL_NO, false);
        }

        
        

	});
}

/**
 * 2차 해피콜 내역 조회
 * - as-is : cns2700.onSearch()
 * @param {string}  CSEL_DATE 상담일자
 * @param {string}  CSEL_NO   상담번호
 * @param {boolean} isHappy1 1차해피콜 데이터유무
 */
const getHappy2 = (CSEL_DATE, CSEL_NO, isHappy1) => {

	const settings = {
		url: `${API_SERVER}/cns.getHappy2.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ CSEL_DATE, CSEL_NO }],
		}),
		errMsg: "2차 해피콜 내역 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		if (data.dsRecv.length >= 1) {
            DS_HPCALL2 = data.dsRecv[0];
            // DS_HPCALL2.CSEL_DATE          // 상담일자
            // DS_HPCALL2.CSEL_NO            // 상담번호
            calendarUtil.setImaskValue("datebox6", DS_HPCALL2.HPCALL_DATE || ""); // 해피콜일자    
            $("#timebox3").val(DS_HPCALL2.HPCALL_TIME);                           // 해피콜시간    
            $("#textbox28").val(DS_HPCALL2.HPCALL_TITLE);                         // 해피콜제목    
            $("#textbox36").val(DS_HPCALL2.HPCALL_CNTS);                          // 해피콜내용    
            $("#selectbox4").val(DS_HPCALL2.HPCALL_CHNL_MK);                      // 해피콜경로구분    
            // DS_HPCALL2.HPCALL_USER_ID     // 해피콜담당자ID                    
            $("#selectbox3").val(DS_HPCALL2.SATIS_CDE);                           // 고객만족도코드
            // DS_HPCALL2.CTI_CHGDATE        // CTI변경일자                   
            $("#textbox27").val(DS_HPCALL2.HPCALL_NAME);                          // 해피콜담당자명        
        } 
        // 검색결과가 없고, 1차해피콜 결과도 없을때.
        else if (!isHappy1) {
            calendarUtil.setImaskValue("datebox6", getDateFormat());    // 해피콜일자 초기화
            $("#timebox3").val(getTimeFormat());                        // 해피콜시간 초기화
            $("#textbox27").val(currentUser.name);                      // 해피콜담당자명 초기화
        }

	});
}

/**
 * 상담연계대상선택 조회
 * - 형제회원 지점확인을 위한 조회
 * - as-is : cns2700.onSearch()
 * @param {string} CSEL_DATE 상담일자   
 * @param {string} CSEL_NO   상담번호
 * @param {string} PROC_MK   처리구분
 */
const getTransList = (CSEL_DATE, CSEL_NO, PROC_MK) => {

	const settings = {
		url: `${API_SERVER}/cns.getTransList.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ CSEL_DATE, CSEL_NO, PROC_MK }],
		}),
		errMsg: "상담연계대상선택 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		if (data.dsRecv.length >= 1) {
            DS_TRANS_DEPT = data.dsRecv[0];
            // DS_TRANS_DEPT.CSEL_DATE       // 상담일자    
            // DS_TRANS_DEPT.CSEL_SEQ        // 상담순번    
            // DS_TRANS_DEPT.CUST_TCHR_NAME  // 고객명or교사명        
            // DS_TRANS_DEPT.DEPT_NAME       // 지점명    
            // DS_TRANS_DEPT.CSEL_LTYPE_CDE  // 대분류        
            // DS_TRANS_DEPT.CSEL_MTYPE_CDE  // 중분류        
            // DS_TRANS_DEPT.CSEL_STYPE_CDE  // 소분류        
            // DS_TRANS_DEPT.CHO_FLAG        // 체크박스플레그    
            // DS_TRANS_DEPT.LC_NAME         // 센터명      
        }

	});
}

/**
 * 지점처리 내역 조회
 * - as-is : cns2700.onSearch()
 * @param {string} CSEL_DATE 상담일자
 * @param {string} CSEL_NO   상담번호
 * @param {string} CSEL_SEQ  상담순번
 */
const getDeptProc = (CSEL_DATE, CSEL_NO, CSEL_SEQ) => {

	const settings = {
		url: `${API_SERVER}/cns.getDeptProc.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ CSEL_DATE, CSEL_NO, CSEL_SEQ }],
		}),
		errMsg: "지점처리 내역 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		if (data.dsRecv.length >= 1) {
            DS_DEPT_PROC = data.dsRecv[0];
            // DS_DEPT_PROC.TRANS_DATE        // 연계일자
            // DS_DEPT_PROC.TRANS_NO          // 연계번호
            // DS_DEPT_PROC.TRANS_MK          // 연계구분
            // DS_DEPT_PROC.TRANS_TIME        // 연계시간
            // DS_DEPT_PROC.TRANS_DEPT_ID     // 연계지점코드    
            // DS_DEPT_PROC.TRANS_CHNL_MK     // 연계방법구분    
            // DS_DEPT_PROC.TRANS_TITLE       // 연계제목
            // DS_DEPT_PROC.TRANS_CNTS        // 연계상세내용
            // DS_DEPT_PROC.PROC_HOPE_DATE    // 처리희망일자    
            // DS_DEPT_PROC.DEPT_ACP_ID       // 지점접수자사번
            $("#textbox18").val(DS_DEPT_PROC.DEPT_ACP_NAME);    // 지점접수자성명   
            calendarUtil.setImaskValue("datebox8", DS_DEPT_PROC.DEPT_ACP_DATE || "");     // 지점접수일자(접수일자)
            $("#timebox1").val(DS_DEPT_PROC.DEPT_ACP_TIME);     // 지점접수시간(접수시간)
            // DS_DEPT_PROC.PROC_STS_MK       // 처리상태구분
            // DS_DEPT_PROC.RTN_FLAG          // 회신여부구분
            // DS_DEPT_PROC.PROC_DATE         // 처리일자
            // DS_DEPT_PROC.PROC_TIME         // 처리시간
            $("#textbox19").val(DS_DEPT_PROC.PROC_EMP);          // 지점처리자  
            $("#textbox34").val(DS_DEPT_PROC.PROC_CNTS);         // 처리내용 
            // DS_DEPT_PROC.RTN_USER_ID       // 피드백접수자ID
            // DS_DEPT_PROC.RTN_DATE          // 피드백일자
            // DS_DEPT_PROC.RTN_TIME          // 피드백시간
            // DS_DEPT_PROC.CTI_CHGDATE       // CTI변경일자    
        }
        // 처음 저장인 경우
        else {
            calendarUtil.setImaskValue("datebox8", getDateFormat());    // 접수일자 초기화
            $("#timebox1").val(getTimeFormat());                        // 접수시간 초기화
            DS_DEPT_PROC.TRANS_DATE     =   getDateFormat();            // 연계일자
            DS_DEPT_PROC.TRANS_MK       =   DS_COUNSEL.PROC_MK-2;       // 연계구분
            DS_DEPT_PROC.TRANS_DEPT_ID  =   DS_COUNSEL.DEPT_ID;         // 연계지점
            DS_DEPT_PROC.TRANS_TITLE    =   DS_COUNSEL.CSEL_TITLE;      // 연계 제목
            DS_DEPT_PROC.TRANS_CNTS     =   DS_COUNSEL.CSEL_CNTS;       // 연계 내용
            DS_DEPT_PROC.PROC_HOPE_DATE =   DS_COUNSEL.PROC_HOPE_DATE;  // 처리희망일
            DS_DEPT_PROC.PROC_TIME      =   "";                         // 처리시간                        
        }
        // 접수일자 체크
        if (calendarUtil.getImaskValue("datebox8").length < 8) {
            calendarUtil.setImaskValue("datebox8", getDateFormat());
        }
        // 접수시간 체크
        if ($("#timebox1").val().length < 6) {
            $("#timebox1").val(getTimeFormat());   
        }
        // 사업국처리시간 세팅
        const intervalTime = gf_getIntervalTime(DS_DEPT_PROC.DEPT_ACP_DATE, DS_DEPT_PROC.DEPT_ACP_TIME, DS_VOC_PROC.VOC_PROC_DATE, DS_VOC_PROC.VOC_PROC_TIME);
        $("#textbox24").val(intervalTime);  

	});
}

/**
 * 화면 TEXT 셋팅
 * - as-is : cns2700.setText()
 * @param {string} CUST_MK 고객구분
 */
const setText = (CUST_MK) => {
    // 고객 또는 선생님 셋팅
    if (CUST_MK == "TC" || CUST_MK == "PE") {
        $("#thNAME").text("선생님명");
        $("#thID").text("사원번호");
    } else {
        $("#thNAME").text("회원명");
        $("#thID").text("회원번호");
    }
}

/**
 * 화면 버튼 셋팅
 * - as-is : cns2700.setButton()
 * @param {string} PROC_STS_MK 처리상태구분
 */
const setButton = (PROC_STS_MK) => {

    // 상담연계, 시정처리에 대한 버튼 셋팅 
    switch (sPROC_MK) {
        
        case "3": // 상담연계인 경우
            // 접수상태
            if (PROC_STS_MK == "01") {
                $("#button2").prop("disabled", false);
                $("#button3").prop("disabled", false);
            }
            // 지점처리중
            else if (PROC_STS_MK == "03") {
                $("#button2").prop("disabled", false);
                $("#button3").prop("disabled", false);
            }
            // 지점처리완료
            else if (PROC_STS_MK == "04") {
                $("#button2").prop("disabled", false);
                $("#button3").prop("disabled", false);
            }
            // 해피콜완료
            else if (PROC_STS_MK == "15") {
                $("#button2").prop("disabled", false);
                $("#button3").prop("disabled", false);
            }
            // 2차 해피콜완료
            else if (PROC_STS_MK == "16") {
                $("#button2").prop("disabled", false);
                $("#button3").prop("disabled", false);
            }
            // 완료
            else if (PROC_STS_MK == "99") {
                $("#button2").prop("disabled", true);
                $("#button3").prop("disabled", false);
            }
            break;

        case "4": // 시정처리인 경우

            const USER_LVL = currentUser.user_fields.user_lvl_mk;
            if (USER_LVL == "user_lvl_mk_1" || USER_LVL == "user_lvl_mk_2" || USER_LVL == "user_lvl_mk_3") { // 관리자와 상담원에 대한 버튼 권한

                /* 접수상태 */
                if (PROC_STS_MK == "01") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
                /* 지점처리중 */
                else if (PROC_STS_MK == "03") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
                /* 지점처리완료 */
                else if (PROC_STS_MK == "04") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
                /* 2차결재완료 */
                else if (PROC_STS_MK == "12") {
                    $("#button2").prop("disabled", false);
                    $("#button3").prop("disabled", false);
                }
                /* 해피콜완료 */
                else if (PROC_STS_MK == "15") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
                /* 2차 해피콜완료 */
                else if (PROC_STS_MK == "16") {
                    $("#button2").prop("disabled", false);
                    $("#button3").prop("disabled", false);
                }
                /* 완료 */
                else if (PROC_STS_MK == "99") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
            }
            else {

                /* 접수상태 */
                if (PROC_STS_MK == "01") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", true);
                }
                /* 지점처리중 */
                else if (PROC_STS_MK == "03") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
                /* 지점처리완료 */
                else if (PROC_STS_MK == "04") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
                /* 2차결재완료 */
                else if (PROC_STS_MK == "12") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
                /* 해피콜완료 */
                else if (PROC_STS_MK == "15") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
                /* 2차 해피콜완료 */
                else if (PROC_STS_MK == "16") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
                /* 완료 */
                else if (PROC_STS_MK == "99") {
                    $("#button2").prop("disabled", true);
                    $("#button3").prop("disabled", false);
                }
            }
            break;

        default:
            break;
    }
}

/**
 * 각 해당 화면 활성 또는 비활성 셋팅
 * - as-is : cns2700.setDisplay()
 * @param {string} PROC_STS_MK 처리상태구분
 * @param {string} CSEL_RST_MK 상담결과구분
 */
const setDisplay = (PROC_STS_MK, CSEL_RST_MK) => {
    
    if (sPROC_MK == "3") {
        /* 처리상태에 따른 각 화면의 활성 비활서 셋팅 */
        switch (PROC_STS_MK) {
            case "01": // 처리상태구분이 접수인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(비활성)
                setHpCall1EorD(false);                          // 1차해피콜 화면(비활성)
                setHpCall2EorD(false);                          // 2차해피콜 화면(비활성)
                setGiftEorD(false);                             // 사은품 화면(비활성)
                $("#checkbox4").prop("checked", false);         // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", false);        // 지점처리중 체크박스(비활성)
                break;
            case "03": // 처리상태구분이 지점처리중인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(false);                          // 1차해피콜 화면(비활성)
                setHpCall2EorD(false);                          // 2차해피콜 화면(비활성)
                setGiftEorD(false);                             // 사은품 화면(비활성)
                $("#checkbox4").prop("checked", false);         // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", false);        // 지점처리중 체크박스(활성)
                break;
            case "04": // 처리상태구분이 지점처리완료인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(true);                           // 1차해피콜 화면(활성)
                setHpCall2EorD(false);                          // 2차해피콜 화면(비활성)
                setGiftEorD(false);                             // 사은품 화면(비활성)
                $("#checkbox4").prop("checked", true);          // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", true);         // 지점처리중 체크박스(비활성)
                break;
            case "15": // 처리상태구분이 해피콜완료인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(true);                           // 1차해피콜 화면(활성)
                setHpCall2EorD(true);                           // 2차해피콜 화면(활성)
                if (CSEL_RST_MK == "12") setGiftEorD(true);     // 상담결과구분이 사은품지금인경우 활성
                else setGiftEorD(false);                        // 아닌경우 사은품 화면(비활성)
                $("#checkbox4").prop("checked", true);          // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", true);         // 지점처리중 체크박스(비활성)
                break;
            case "12": // 처리상태구분이 2차결재인 경우 -- 상담연계인 경우는 2차결재인 경우는 없음.
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(true);                           // 1차해피콜 화면(활성)
                setHpCall2EorD(true);                           // 2차해피콜 화면(활성)
                if (CSEL_RST_MK == "12") setGiftEorD(true);     // 상담결과구분이 사은품지금인경우 활성
                else setGiftEorD(false);                        // 아닌경우 사은품 화면(비활성)
                $("#checkbox4").prop("checked", true);          // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", true);         // 지점처리중 체크박스(비활성)
                break;
            case "16": // 처리상태구분이 2차해피콜완료인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(true);                           // 1차해피콜 화면(활성)
                setHpCall2EorD(true);                           // 2차해피콜 화면(활성)
                if (CSEL_RST_MK == "12") setGiftEorD(true);     // 상담결과구분이 사은품지금인경우 활성
                else setGiftEorD(false);                        // 아닌경우 사은품 화면(비활성)
                $("#checkbox4").prop("checked", true);          // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", true);         // 지점처리중 체크박스(비활성)
                break;
            case "99": // 처리상태구분이 완료인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(true);                           // 1차해피콜 화면(활성)
                setHpCall2EorD(true);                           // 2차해피콜 화면(활성)
                if (CSEL_RST_MK == "12") setGiftEorD(true);     // 상담결과구분이 사은품지금인경우 활성
                else setGiftEorD(false);                        // 아닌경우 사은품 화면(비활성)
                $("#checkbox4").prop("checked", true);          // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", true);         // 지점처리중 체크박스(비활성)
                break;
        }
    }
    else if (sPROC_MK == "4") {
        /* 처리상태에 따른 각 화면의 활성 비활서 셋팅 */
        switch (PROC_STS_MK) {
            case "01": // 처리상태구분이 접수인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(비활성)
                setHpCall1EorD(false);                          // 1차해피콜 화면(비활성)
                setHpCall2EorD(false);                          // 2차해피콜 화면(비활성)
                setGiftEorD(false);                             // 사은품 화면(비활성)
                $("#checkbox4").prop("checked", false);         // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", false);        // 지점처리중 체크박스(비활성)
                break;
            case "03": // 처리상태구분이 지점처리중인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(false);                          // 1차해피콜 화면(비활성)
                setHpCall2EorD(false);                          // 2차해피콜 화면(비활성)
                setGiftEorD(false);                             // 사은품 화면(비활성)
                $("#checkbox4").prop("checked", false);         // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", false);        // 지점처리중 체크박스(활성)
                break;
            case "04": // 처리상태구분이 지점처리완료인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(true);                           // 1차해피콜 화면(활성)
                setHpCall2EorD(false);                          // 2차해피콜 화면(비활성)
                setGiftEorD(false);                             // 사은품 화면(비활성)
                $("#checkbox4").prop("checked", true);          // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", true);         // 지점처리중 체크박스(비활성)
                break;
            case "15": // 처리상태구분이 해피콜완료인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(true);                           // 1차해피콜 화면(활성)
                setHpCall2EorD(false);                          // 2차해피콜 화면(비활성)
                setGiftEorD(false);                             // 사은품 화면(비활성)
                $("#checkbox4").prop("checked", true);          // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", true);         // 지점처리중 체크박스(비활성)
                break;
            case "12": // 처리상태구분이 2차결재인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(true);                           // 1차해피콜 화면(활성)
                setHpCall2EorD(true);                           // 2차해피콜 화면(활성)
                setGiftEorD(true);                              // 사은품 활성
                $("#checkbox4").prop("checked", true);          // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", true);         // 지점처리중 체크박스(비활성)
                break;
            case "16": // 처리상태구분이 2차해피콜완료인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(true);                           // 1차해피콜 화면(활성)
                setHpCall2EorD(true);                           // 2차해피콜 화면(활성)
                setGiftEorD(true);                              // 사은품 활성
                $("#checkbox4").prop("checked", true);          // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", true);         // 지점처리중 체크박스(비활성)
                break;
            case "99": // 처리상태구분이 완료인 경우
                setDeptEorD(true);                              // 지점처리내역 화면(활성)
                setHpCall1EorD(true);                           // 1차해피콜 화면(활성)
                setHpCall2EorD(true);                           // 2차해피콜 화면(활성)
                setGiftEorD(true);                              // 사은품 활성
                $("#checkbox4").prop("checked", true);          // 해피콜 여부 체크박스가 지점처리중이면 '체크해제', 지점처리완료 이후 프로세스인 경우는 '체크'
                $("#checkbox4").prop("disabled", true);         // 지점처리중 체크박스(비활성)
                break;
        }
    }
}

/**
 * 지점처리 내역 활성 또는 비활성
 * - as-is : cns2700.setDeptEorD()
 * @param {boolean} bWrite 
 */
const setDeptEorD = (bWrite) => {
    if (bWrite){
        $("#datebox8").prop("readonly", false);
        $("#timebox1").prop("readonly", false);
        $("#textbox18").prop("readonly", false);
        $("#textbox19").prop("readonly", false);
        $("#textbox34").prop("readonly", false);
    } else {
        $("#datebox8").prop("readonly", true);
        $("#timebox1").prop("readonly", true);
        $("#textbox18").prop("readonly", true);
        $("#textbox19").prop("readonly", true);
        $("#textbox20").prop("readonly", true);
        $("#textbox22").prop("readonly", true);
        $("#textbox21").prop("readonly", true);
        $("#textbox23").prop("readonly", true);
        $("#textbox34").prop("readonly", true);
        $("#textbox24").prop("readonly", true);
    }
}

/**
 * 1차 해피콜 활성 또는 비활성
 * - as-is : cns2700.setHpCall1EorD()
 * @param {boolean} bWrite 
 */
const setHpCall1EorD = (bWrite) => {
    if (bWrite) {
        $("#datebox5").prop("readonly", false);
        $("#timebox2").prop("readonly", false);
        $("#textbox25").prop("readonly", false);
        $("#textbox35").prop("readonly", false);
        $("#selectbox1").prop("disabled", true);
        $("#selectbox2").prop("disabled", true);
    } else {
        $("#datebox5").prop("readonly", true);
        $("#timebox2").prop("readonly", true);
        $("#textbox25").prop("readonly", true);
        $("#textbox35").prop("readonly", true);
        $("#selectbox1").prop("disabled", false);
        $("#selectbox2").prop("disabled", false);
    }
}

/**
 * 2차 해피콜 활성 또는 비활성
 * - as-is : cns2700.setHpCall2EorD()
 * @param {boolean} bWrite 
 */ 
const setHpCall2EorD = (bWrite) => {
    if (bWrite) {
        $("#datebox6").prop("readonly", false);
        $("#timebox3").prop("readonly", false);
        $("#textbox28").prop("readonly", false);
        $("#textbox36").prop("readonly", false);
        $("#selectbox3").prop("disabled", true);
        $("#selectbox4").prop("disabled", true);
    } else {
        $("#datebox6").prop("readonly", true);
        $("#timebox3").prop("readonly", true);
        $("#textbox28").prop("readonly", true);
        $("#textbox36").prop("readonly", true);
        $("#selectbox3").prop("disabled", false);
        $("#selectbox4").prop("disabled", false);
    }
}

/**
 * 사은품 활성 또는 비활성
 * - as-is : cns2700.setGiftEorD()
 * @param {boolean} bWrite 
 */ 
const setGiftEorD = (bWrite) => {
    if (bWrite) {
        $("#calendar1").prop("disabled", false);
        $("#selectbox5").prop("disabled", true);
        $("#selectbox6").prop("disabled", true);
        $("#textbox30").prop("readonly", false);
        $("#selectbox7").prop("disabled", true);
        $("#textbox31").prop("readonly", false);
        $("#textbox32").prop("readonly", false);
    } else {
        $("#calendar1").prop("disabled", true);
        $("#selectbox5").prop("disabled", false);
        $("#selectbox6").prop("disabled", false);
        $("#textbox30").prop("readonly", true);
        $("#selectbox7").prop("disabled", false);
        $("#textbox31").prop("readonly", true);
        $("#textbox32").prop("readonly", true);
    }
}

/**
 * 실제처리시간 계산하기 위한 함수
 * - as-is : cns2700.gf_getIntervalTime()
 * @param {*} fromDay 
 * @param {*} fromTime 
 * @param {*} toDay 
 * @param {*} totime 
 */
const gf_getIntervalTime = (fromDay, fromTime, toDay, totime) => {
    // console.debug("gf_getIntervalTime:" + fromDay + ":" + fromTime + ":" + toDay + ":" + totime + ":" + isNaN(toDay));

    if (isNaN(toDay) || isNaN(totime)) {
        return "00:00:00:00";
    }

    for (var i = 0; i < 8; i++) {
        if ((fromDay.charAt(i) == '.') || (fromDay.charAt(i) == ','))
            return "00:00:00:00";
        if ((toDay.charAt(i) == '.') || (toDay.charAt(i) == ','))
            return "00:00:00:00";
    }

    for (var j = 0; j < 6; j++) {
        if ((fromTime.charAt(j) == ':') || (fromTime.charAt(j) == ','))
            return "00:00:00:00";
        if ((totime.charAt(j) == ':') || (totime.charAt(j) == ','))
            return "00:00:00:00";
    }

    if (fromDay.length != 8 || toDay.length != 8) {
        return "00:00:00:00";
    }

    if (fromTime.length != 6 || totime.length != 6) {
        return "00:00:00:00";
    }

    var year = Number(fromDay.substring(0, 4));
    var month = Number(fromDay.substring(4, 6));
    var day = Number(fromDay.substring(6, 8));
    var hour = Number(fromTime.substring(0, 2));
    var min = Number(fromTime.substring(2, 4));
    var sec = Number(fromTime.substring(4, 6));

    var year2 = Number(toDay.substring(0, 4));
    var month2 = Number(toDay.substring(4, 6));
    var day2 = Number(toDay.substring(6, 8));
    var hour2 = Number(totime.substring(0, 2));
    var min2 = Number(totime.substring(2, 4));
    var sec2 = Number(totime.substring(4, 6));

    if (isNaN(year) || isNaN(month) || isNaN(day)) return "00:00:00:00";

    if (isNaN(year2) || isNaN(month2) || isNaN(day2)) return "00:00:00:00";

    if ((year <= 0) || (year2 <= 0)) return "00:00:00:00";

    if ((month <= 0 || month > 12) || (month2 <= 0 || month2 > 12)) return "00:00:00:00";

    var fromDate = fromDay + fromTime;
    var toDate = toDay + totime;

    //피드백처리일이 상담등록일보다 빠른지 검사
    if (fromDate >= toDate) {
        return "00:00:00:00";
    }
    else {
        // 초계산
        if (sec2 < sec) {
            sec2 = sec2 + 60;
            min2 = min2 - 1;
        }
        var resultsec = sec2 - sec;

        // 분계산
        if (min2 < min) {
            min2 = min2 + 60;
            hour2 = hour2 - 1;
        }
        var resultmin = min2 - min;

        // 시간계산
        if (hour2 < hour) {
            hour2 = hour2 + 24;
            day2 = day2 - 1;
        }
        var resulthour = hour2 - hour;

        var from_time = new Date(year, Number(month) - 1, day);
        var to_time = new Date(year2, Number(month2) - 1, day2);
        var fmillsec = from_time.getTime();
        var tmillsec = to_time.getTime();
        var resultday = (tmillsec - fmillsec) / (1000 * 60 * 60 * 24);

        if (resultsec < 10) { resultsec = "0" + resultsec; }
        else { resultsec = "" + resultsec; }

        if (resultmin < 10) { resultmin = "0" + resultmin; }
        else { resultmin = "" + resultmin; }

        if (resulthour < 10) { resulthour = "0" + resulthour; }
        else { resulthour = "" + resulthour; }

        if (resultday < 10) { resultday = "0" + resultday; }
        else { resultday = "" + resultday; }

        return `${resultday}:${resulthour}:${resultmin}:${resultsec}`;
    }
}

/**
 * 사은품내역1 change event
 * - as-is : cns2700.CBO_GiftTypeCode.OnCloseUp()
 * @param {string} value 
 */
const onChangeGiftType = (value) => {
    if (!value) {
        $("#selectbox6").prop("disabled", true);
    } else {
        $("#selectbox6").prop("disabled", false);
    }
    calendarUtil.setImaskValue("textbox30", "0");
    $("#selectbox6").empty().append(new Option("", ""));
    const newGifList = giftList.filter(el => el.GIFT_TYPE_CDE == value);
    newGifList.forEach(el => $("#selectbox6").append(new Option(el.GIFT_NAME, el.GIFT_CDE)));
}

/**
 * 사은품내역2 change event
 * - as-is : cns2700.CBO_GiftCode.OnCloseUp()
 * @param {string} value 
 */
const onChangeGift = (value) => {
    const gif = giftList.find(el => el.GIFT_CDE == value);
    const price = gif ? String(gif.GIFT_PRICE) : "0";
    calendarUtil.setImaskValue("textbox30", price);
}

/**
 * SMS 버튼 클릭시 호출되는 함수
 * - as-is : cns2700.onSMS()
 * @param {string} sType 
 */
const onSMS = (sType) => {

    // MOL상담원 SMS사용금지
    if (currentUser.user_fields.user_grp_cde == "7096") return;

    var arrInData = new Array();
    // 회원 SMS 발송인 경우
    if (sType == "1") {
        arrInData[0] = DS_COUNSEL.CUST_ID;          // 회원번호
        arrInData[1] = $("#textbox1").val();        // 회원명
        arrInData[2] = $("#textbox5").val();        // 회원휴대폰
        arrInData[3] = $("#textbox7").val();        // 회원/모 휴대폰
        arrInData[4] = DS_COUNSEL.FAT_TEL_NO;       // 회원/부 휴대폰
        arrInData[5] = "2";                         // 휴대폰 디폴트 선택값 [ 1:회원 || 2:회원모 || 3:회원부 ]
        arrInData[6] = DS_COUNSEL.MBR_ID;		    // 회원번호
        arrInData[7] = DS_COUNSEL.CSEL_DATE;        // 상담일자
        arrInData[8] = DS_COUNSEL.CSEL_NO;          // 상담번호
        arrInData[9] = DS_COUNSEL.CSEL_SEQ;         // 상담순번
        arrInData[10]= "cns2700";      // url정보
    }
    // 지점장 SMS 발송인 경우
    else if (sType == "2") {
       
        arrInData[0] = DS_COUNSEL.DEPT_REP_EMPID;   // 지점장 사원번호
        arrInData[1] = $("#textbox10").val();       // 지점장명
        arrInData[2] = DS_COUNSEL.DEPT_REP_EMP_HP;  // 지점장 HP 
        arrInData[3] = $("#textbox11").val();  	    // 지점장 PDA
        arrInData[4] = "";
        arrInData[5] = "2";                         // 휴대폰 디폴트 선택값 [ 1:HP || 2:PDA || 3: ]
        arrInData[6] = DS_COUNSEL.DEPT_REP_EMPID;	// 지점장 사원번호
        arrInData[7] = DS_COUNSEL.CSEL_DATE;        // 상담일자
        arrInData[8] = DS_COUNSEL.CSEL_NO;          // 상담번호
        arrInData[9] = DS_COUNSEL.CSEL_SEQ;         // 상담순번	    	
        arrInData[10]= "cns2700";      // url정보
    }
    // 센터장 SMS 발송인 경우
    else {
        arrInData[0] = DS_COUNSEL.LC_REP_EMPID;     // 지점장 사원번호
        arrInData[1] = $("#textbox12").val();       // 지점장명
        arrInData[2] = DS_COUNSEL.LC_REP_EMP_HP;    // 지점장 HP 
        arrInData[3] = $("#textbox13").val();  	    // 지점장 PDA
        arrInData[4] = "";  
        arrInData[5] = "2";                         // 휴대폰 디폴트 선택값 [ 1:HP || 2:PDA || 3: ]
        arrInData[6] = DS_COUNSEL.LC_REP_EMPID;	    // 지점장 사원번호
        arrInData[7] = DS_COUNSEL.CSEL_DATE;        // 상담일자
        arrInData[8] = DS_COUNSEL.CSEL_NO;          // 상담번호
        arrInData[9] = DS_COUNSEL.CSEL_SEQ;         // 상담순번	    	
        arrInData[10]= "cns2700";      // url정보	    	
    }

    PopupUtil.open("CCEMPRO046", 980, 600);
}

/**
 * SMS 보내기 버튼 클릭시 호출되는 함수
 * - as-is : cns2700.onSMSSend()
 */    
const onSMSSend = async () => {

    const chkMbrSMSYN   = $("#checkbox1").is(":checked") ? "Y" : "N";
    const chkEmpSMSYN   = $("#checkbox2").is(":checked") ? "Y" : "N";
    const chkLCEmpSMSYN = $("#checkbox3").is(":checked") ? "Y" : "N";
    
    // 체크박스 점검
    if (chkMbrSMSYN == "N" && chkEmpSMSYN == "N" && chkLCEmpSMSYN == "N") { // 연계일시 및 지점장연계에 체크가 되어 있지 않은 경우
        alert("SMS 발송 대상에 하나라도 체크되어야 합니다.");
        return false;
    }
    
    // 회원 전화번호 점검    	
    let recevier = "";  // txtRecevier
    if (chkMbrSMSYN == "Y") {
        const selRdoTel = $("input[name='rdoTel']:checked").attr("id");
        if (selRdoTel == "radio1") {
            recevier = $("#textbox2").val();
        } else if (selRdoTel == "radio2") {
            recevier = $("#textbox5").val();
        } else {
            recevier = $("#textbox7").val();
        }
        if (recevier.replace(/[^0-9]/gi, "").length < 7) {
            alert("회원 수신번호를 확인하여 주십시오!");
            return false;
        }
    }

    // 지점장 전화번호 점검    	
    if (chkEmpSMSYN == "Y") {
        if ($("#textbox11").val().replace(/[^0-9]/gi, "").length < 7) {
            alert("사업국장 수신번호를 확인하여 주십시오!");
            return false;
        }
    }

    // 센터 전화번호 점검    	
    if (chkLCEmpSMSYN == "Y") {
        if ($("#textbox13").val().replace(/[^0-9]/gi, "").length < 7) { 
            alert("센터장 수신번호를 확인하여 주십시오!");
            return false;
        }
    }			
    	
    const smsSendData = new Array();
    // 회원 전화번호 점검    	
    if (chkMbrSMSYN == "Y") {
        const smsCondition = getSmsCondition('1', recevier);
        if (!smsCondition) return;
        smsSendData.push(smsCondition);
    }
    // 지점장 전화번호 점검    	
    if (chkEmpSMSYN == "Y") {
        recevier = $("#textbox11").val();
        const smsCondition = getSmsCondition('2', recevier);
        if (!smsCondition) return;
        smsSendData.push(smsCondition);
    }
    // 센터장 전화번호 점검    	
    if (chkLCEmpSMSYN == "Y") {
        recevier = $("#textbox13").val();
        const smsCondition = getSmsCondition('3', recevier);
        if (!smsCondition) return;
        smsSendData.push(smsCondition);
    }	    	

    // TODO SMS전송 API 호출
    // TR_SMSDATA.Action   = "/com/com1500/com1502T.jsp";
    // TR_SMSDATA.KeyValue = "JSP(I:ENTER=DS_SMSDATA)";
    // setTimeout("TR_SMSDATA.post()",250);   
        
}  

/**
 * SMS데이터 구성
 * - as-is : cns2700.setSmsData()
 * @param {string} sType 
 * @param {string} recevier
 */
const getSmsCondition = async (sType, recevier) => {

    // 상담자 대표번호 설정   	
    SEND_PHONE = SEND_PHONE ? SEND_PHONE : (await getBasicList("13", "SMS발신번호 조회")).replace(/[^0-9]/gi, "");	// SMS발신번호(기준값 13, '-'없이)

    // 수신번호 세팅
    const tel = FormatUtil.tel(recevier).split("-");
    // 발신번호 세팅
    const tel2 = FormatUtil.tel(SEND_PHONE).split("-");

    const DS_SMSDATA = {
        SENDID       :  currentUser.external_id, //       
        SENDNAME     :  currentUser.name, //           
        RPHONE1      :  tel[0], //       
        RPHONE2      :  tel[1], //       
        RPHONE3      :  tel[2], //       
        RECVNAME     :  "", //           
        SPHONE1      :  tel2[0], //       
        SPHONE2      :  tel2[1], //       
        SPHONE3      :  tel2[2], //       
        MSG          :  "", //   
        URL          :  "", //   
        RDATE        :  "", //       
        RTIME        :  "", //       
        RESULT       :  "0", //       
        KIND         :  "0", //       
        ERRCODE      :  "", //       
        RETRY1       :  "0", //       
        RETRY2       :  "0", //       
        LASTTIME     :  "", //           
        SMS_FLAG     :  "2", //           
        SUBJECT_NAME :  "", //               
        SMS_DATE     :  "", //           
        SMS_TIME     :  "", //           
        CUST_ID      :  "", //       
        MBR_ID       :  "", //       
        CSEL_DATE    :  DS_COUNSEL.CSEL_DATE, //           
        CSEL_NO      :  DS_COUNSEL.CSEL_NO, //       
        CSEL_SEQ     :  DS_COUNSEL.CSEL_SEQ, //           
        USER_ID      :  currentUser.external_id, //       
        MSG1         :  "", //       
        MSG2         :  "", //       
        MSG3         :  "", //       
        MSG4         :  "", //       
        MSG5         :  "", //       
        MSG6         :  "", //       
        MSG7         :  "", //       
        MSG8         :  "", //       
        MSG9         :  "", //       
        SMS_TRGT_ID  :  "", //           
        SMS_FIX_ID   :  "", //           
    }

    // 회원 SMS 발송
    if (sType == "1") {
        let csel_man_mk = DS_COUNSEL.CSEL_MAN_MK;
        let csel_man_nm = "고객님";
        if (csel_man_mk == "01") csel_man_nm = "어머님";
        else if (csel_man_mk == "02") csel_man_nm = "아버님";

        DS_SMSDATA.RECVNAME     = $("#textbox1").val();
        DS_SMSDATA.MSG          = `[${csel_man_nm}]의 소중한 의견이 해당 지점에 전달되어 신속하게 연락드릴 예정입니다.대교 상담실`;
        DS_SMSDATA.CUST_ID      = DS_COUNSEL.CUST_ID;// 회원번호
        DS_SMSDATA.MBR_ID       = DS_COUNSEL.MBR_ID;// 회원번호
    }
    // 지점장 SMS 발송
    else if (sType == "2") {
        DS_SMSDATA.RECVNAME     = $("#textbox10").val();
        DS_SMSDATA.MSG          = "사업국장(사업국)의 고객의견이 접수되어 신속한 상담 부탁 드립니다.-대교 상담실-";
        DS_SMSDATA.CUST_ID      = DS_COUNSEL.DEPT_REP_EMPID;// 지점장 사번
        DS_SMSDATA.MBR_ID       = DS_COUNSEL.DEPT_REP_EMPID;// 지점장 사번
    }
    // 센터장 SMS 발송
    else {
        DS_SMSDATA.RECVNAME     = $("#textbox12").val();
        DS_SMSDATA.MSG          = "센터장님(센터)의 고객의견이 접수되어 신속한 상담 부탁 드립니다.-대교 상담실-";;
        DS_SMSDATA.CUST_ID      = DS_COUNSEL.LC_REP_EMPID;// 지점장 사번
        DS_SMSDATA.MBR_ID       = DS_COUNSEL.LC_REP_EMPID;// 지점장 사번
    }

    return DS_SMSDATA;
    
}

/**
 * TODO 저장
 * - as-is : cns2700.onSaveT()
 * @param {string} sBtnMk 
 */
const onSave = (sBtnMk) => {
    
    /* 지점처리내역 */
    var bSeq = "";  // 순번을 저장하기 위한 변수
    if(DS_DEPT_PROC.SysStatus(1) == 1 ){  // 저장할 경우 
        
        var sDeptName = "";  // 지점을 비교하기 위한 지점명 변수
        var bSameDept = true; // 선택된 항목들 중에 다른 지점이 있는지 확인 하기 위한 변수 'true':모든지점이 같은 경우 'false':다른지점이 존재하는 경우
        
                
        for ( a=1 ; a<= DS_TRANS_DEPT.CountRow ; a++ ) // 리스트에 체크 여부를 확인하기 위한 Loop
        {                
            /* Array에 전달할 값들 셋팅 */
            if(DS_COUNSEL.NameValue(1,"DEPT_NAME") == DS_TRANS_DEPT.NameValue(a,"DEPT_NAME")){ // 상담순번
                bSeq += DS_TRANS_DEPT.NameValue(a,"CSEL_SEQ")+",";
            }
            if(a == 1){
                sDeptName = DS_TRANS_DEPT.NameValue(a,"DEPT_NAME");
            }
            else{
                if(sDeptName != DS_TRANS_DEPT.NameValue(a,"DEPT_NAME")){
                    bSameDept = false;
                }
            }                
        }
        
        // 마지막에 붙은 , 제거
        bSeq = bSeq.substring(0, bSeq.length-1);            
        
        if(bSameDept == false){
            if(confirm("다른 사업국이 존재합니다. 계속하시겠습니까?") == false) {  return ; } 
        }                              
            
        //alert("연계를 하시고 작업하십시요.");
        //return; 
        if(getDeptValidityCheck()){ DS_CNS2700_TR.NameValue(1, "MK_TRANS_TR") = "I"; }
        else{ return; }      						

    }        
    else if(DS_DEPT_PROC.SysStatus(1) == 3 ){ // 변경할 경우
        if(getDeptValidityCheck()){ DS_CNS2700_TR.NameValue(1, "MK_TRANS_TR") = "U"; }
        else{ return; }
    }
    else{ DS_CNS2700_TR.NameValue(1, "MK_TRANS_TR") = "N"; } // 저장 또는 변경이 아닌경우
    
    /* 1차 해피콜 */  
    if(DS_HPCALL1.SysStatus(1) == 1){ // 저장인 경우            
        if(DS_HPCALL1.NameValue(1, "HPCALL_TITLE").length   >= 1 ||
            DS_HPCALL1.NameValue(1, "HPCALL_CNTS").length    >= 1 ||
            DS_HPCALL1.NameValue(1, "SATIS_CDE").length      >= 1 ||
            DS_HPCALL1.NameValue(1, "SATIS_CDE1").length     >= 1 ||
            DS_HPCALL1.NameValue(1, "SATIS_CDE2").length     >= 1 ||
            DS_HPCALL1.NameValue(1, "HPCALL_CHNL_MK").length >= 1 )
        {   // 데이터의 조작이 있는 경우   
            if(getHpCall1ValidityCheck()){ DS_CNS2700_TR.NameValue(1, "MK_HPCALL1_TR") = "I"; }
            else{ return; }
        }
        else{ DS_CNS2700_TR.NameValue(1, "MK_HPCALL1_TR") = "N"; } // 저장이지만 데이터의 조작이 없는 경우
    }
    else if(DS_HPCALL1.SysStatus(1) == 3){ // 변경인 경우
        if(getHpCall1ValidityCheck()){ DS_CNS2700_TR.NameValue(1, "MK_HPCALL1_TR") = "U"; }
        else{ return; }
    }
    else if(DS_HPCALL1.UserStatus(1) == 2){ // 삭제인 경우            
        DS_CNS2700_TR.NameValue(1, "MK_HPCALL1_TR") = "D";            
    }        
    else{ DS_CNS2700_TR.NameValue(1, "MK_HPCALL1_TR") = "N"; } // 저장 또는 변경이 아닌경우
        
    /* 2차 해피콜 */
    if(DS_HPCALL2.SysStatus(1) == 1){ // 저장인 경우
        if(DS_HPCALL1.SysStatus(1) != 1){ // 1차해피콜이 저장(신규)이 아닌 경우
            if(DS_HPCALL2.NameValue(1, "HPCALL_TITLE").length   >= 1 ||
                DS_HPCALL2.NameValue(1, "HPCALL_CNTS").length    >= 1 ||
                DS_HPCALL2.NameValue(1, "SATIS_CDE").length      >= 1 ||
                DS_HPCALL2.NameValue(1, "HPCALL_CHNL_MK").length >= 1 )
            {   // 데이터의 조작이 있는 경우
                if(getHpCall2ValidityCheck()){ DS_CNS2700_TR.NameValue(1, "MK_HPCALL2_TR") = "I"; }
                else{ return; }
            }
            else{ DS_CNS2700_TR.NameValue(1, "MK_HPCALL2_TR") = "N"; } // 저장이지만 데이터의 조작이 없는 경우
        }
        else{ DS_CNS2700_TR.NameValue(1, "MK_HPCALL2_TR") = "N"; } // 1차 해피콜이 저장(신규)인 경우
    }
    else if(DS_HPCALL2.SysStatus(1) == 3){ // 변경인 경우
        if(getHpCall2ValidityCheck()){ DS_CNS2700_TR.NameValue(1, "MK_HPCALL2_TR") = "U"; }
        else{ return; }
    }
    else{ DS_CNS2700_TR.NameValue(1, "MK_HPCALL2_TR") = "N"; } // 저장 또는 변경이 아닌경우
                    
    /* 사은품 */        
    if(DS_GIFT.SysStatus(1) == 1)
    { // 저장인 경우
        if(DS_HPCALL1.SysStatus(1) != 1 || 
            DS_CNS2700_TR.NameValue(1, "MK_HPCALL1_TR") == "I"){ // 1차해피콜이 신규가 아니거나, 1차해피콜을  저장하는 경우
            if(DS_GIFT.NameValue(1, "GIFT_TYPE_CDE").length >= 1 ||
                DS_GIFT.NameValue(1, "GIFT_CDE").length      >= 1 ||
                DS_GIFT.NameValue(1, "GIFT_PRICE").length    >= 1 ||
                DS_GIFT.NameValue(1, "GIFT_CHNL_MK").length  >= 1 ||
                DS_GIFT.NameValue(1, "PASS_USER").length     >= 1 ||
                DS_GIFT.NameValue(1, "INVOICENUM").length    >= 1)
            {   // 데이터의 조작이 있는 경우
                if(getGiftValidityCheck()){ DS_CNS2700_TR.NameValue(1, "MK_GIFT_TR") = "I"; }
                else{ return; }
            }
            else{ DS_CNS2700_TR.NameValue(1, "MK_GIFT_TR") = "N"; } // 저장이지만 데이터의 조작이 없는 경우
        }
        else{ DS_CNS2700_TR.NameValue(1, "MK_GIFT_TR") = "N"; } // 1차해피콜이 신규인 경우이고, 1차해피콜을 저장 하지 않을 경우
    }
    else if(DS_GIFT.SysStatus(1) == 3){ // 변경인 경우
        if(getGiftValidityCheck()){ DS_CNS2700_TR.NameValue(1, "MK_GIFT_TR") = "U"; }
        else{ return; }
    }
    else{ DS_CNS2700_TR.NameValue(1, "MK_GIFT_TR") = "N"; } // 저장, 변경이 아닌경우
    
    //alert("지점["+DS_CNS2700_TR.NameValue(1, "MK_TRANS_TR")+"]  1차["+DS_CNS2700_TR.NameValue(1, "MK_HPCALL1_TR")+"]  2차["+DS_CNS2700_TR.NameValue(1, "MK_HPCALL2_TR")+"]  사은품["+DS_CNS2700_TR.NameValue(1, "MK_GIFT_TR")+"]");
    if(DS_CNS2700_TR.NameValue(1, "MK_TRANS_TR")   != "N" || 
        DS_CNS2700_TR.NameValue(1, "MK_HPCALL1_TR") != "N" || 
        DS_CNS2700_TR.NameValue(1, "MK_HPCALL2_TR") != "N" || 
        DS_CNS2700_TR.NameValue(1, "MK_GIFT_TR")    != "N" ||
        sBtnMk == "2A" || sBtnMk == "3A" || sBtnMk == "CO" || sBtnMk == "1D"){
        
        gf_setBlock(true);   // 조회중 처리(시작)
        
        /* 각 데이터들을 셋팅 */
        setCselSave();        /* 상담데이타 DataSet Setting    */
        setDeptSave();        /* 지점처리내역 DataSet Setting  */
        setHpCall1Save();     /* 1차 해피콜 DataSet Setting    */
        setHpCall2Save();     /* 2차 해피콜 DataSet Setting    */
        setGiftSave();        /* 사은품 DataSet Setting        */
        setProcStsMk(sBtnMk); /* 처리상태 변경 DataSet Setting */
        
        
        // 상담연계 없이 결과를 저장시에 순번을 저장
        if(DS_DEPT_PROC.SysStatus(1) == 1 ){	            
            DS_CNS2700_TR.NameValue(1, "CSEL_SEQ") = bSeq;                              	
        }

        /* 최종 트랜젝션 */
        TR_CNS2700.action = "/cns/cns2700/cns2700T.jsp";
        TR_CNS2700.keyvalue = "JSP(I:CNS2700=DS_CNS2700_TR)";
        setTimeout("TR_CNS2700.post()",250);
        
        window.returnValue = true;
    }
}


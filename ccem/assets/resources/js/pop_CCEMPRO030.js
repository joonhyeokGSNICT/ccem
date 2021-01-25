let currentUser = {};   // 현재 사용중인 유저의 정보(ZENDESK)
let codeData = [];

let giftList = [];      // 사은품내역2 코드

let DS_COUNSEL      = {};   // 상담내역
let DS_CHARGE       = {};   // 담당선생님과 지점장
let DS_VOC_PROC     = {};   // VOC 지점 처리 내역
let DS_GIFT         = {};   // 사은품
let DS_HPCALL1      = {};   // 1차 해피콜 내역
let DS_HPCALL2      = {};   // 2차 해피콜 내역
// let DS_TRANS_DEPT   = {};   // 형제회원 지점확인을 위한 조회
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
    calendarUtil.init("calendar2");
    calendarUtil.init("calendar3");
    calendarUtil.init("calendar4");
    
    // input mask
    calendarUtil.currency("textbox30");
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
    $(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));

    onStart(opener ? opener.name : "");

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

        sCSEL_DATE = opener.calendarUtil.getImaskValue("textbox27");    //상담일자
        sCSEL_NO   = $("#textbox28", opener.document).val();            //상담번호
        sCSEL_SEQ  = $("#selectbox14", opener.document).val();          //상담순번
        sPROC_MK   = $("#selectbox4", opener.document).val();           //처리구분

        sCallPage = "4";

        await setCodeData(opener.codeData);
        getCounselRst();
        getCharge();
        getDeptProcVoc();
        getGift();
        getHappy1();
        // getTransList();
        
    }


}

/**
 * 콤보박스 세팅
 * - as-is : cns2700.setCombo()
 * @param {object} data codeData
 */
const setCodeData = async (data) => {

	const CODE_MK_LIST = [
        "SATIS_CDE",        // 상담원만족도
        "HPCALL_CHNL_MK",   // 피드백경로
        "GIFT_TYPE_CDE",    // 사은품내역1
        "GIFT_CHNL_MK",     // 발송경로
	];

	// get code
    const codeList = data.filter(el => CODE_MK_LIST.includes(el.CODE_MK));
    giftList = await getGiftList();

	// create select options
	for (const code of codeList) {
		$(`select[name='${code.CODE_MK}']`).append(new Option(code.CODE_NAME, code.CODE_ID));
    }
    giftList.forEach(el =>  $("#selectbox6").append(new Option(el.GIFT_NAME, el.GIFT_CDE)));
    
}

/**
 * 사은품내역2 코드 조회
 */
const getGiftList = () => new Promise((resolve, reject) => {

    const settings = {
        url: `${API_SERVER}/sys.getGiftList.do`,
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify({
            senddataids: ["dsSend"],
            recvdataids: ["dsRecv"],
            dsSend: [{}],
        }),
        errMsg: "사은품내역 코드 조회중 오류가 발생하였습니다.",
    }
    $.ajax(settings)
        .done(data => {
            if (!checkApi(data, settings)) return reject(new Error(getApiMsg(data, settings)));
            return resolve(data.dsRecv);
        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 사은품내역1 change event
 * - as-is : cns2700.CBO_GiftTypeCode.OnCloseUp()
 * @param {string} GIFT_CDE 사은품코드
 * @param {string} GIFT_PRICE 사은품가격
 */
const onChangeGiftType = (GIFT_CDE, GIFT_PRICE) => {
    // 내역2 초기화
    const value = $("#selectbox5").val();
    if (!value) $("#selectbox6").prop("disabled", true);
    else $("#selectbox6").prop("disabled", false);
    $("#selectbox6").empty().append(new Option("", ""));
    const newGifList = giftList.filter(el => el.GIFT_TYPE_CDE == value);
    newGifList.forEach(el => $("#selectbox6").append(new Option(el.GIFT_NAME, el.GIFT_CDE)));
    $("#selectbox6").val(GIFT_CDE);
    // 가격 초기화
    GIFT_PRICE = GIFT_PRICE ? String(GIFT_PRICE) : "0";
    calendarUtil.setImaskValue("textbox30", GIFT_PRICE);
}

/**
 * 사은품내역2 change event
 * - as-is : cns2700.CBO_GiftCode.OnCloseUp()
 * @param {string} value 사은품코드
 */
const onChangeGift = (value) => {
    const gif = giftList.find(el => el.GIFT_CDE == value);
    const price = gif ? String(gif.GIFT_PRICE) : "0";
    calendarUtil.setImaskValue("textbox30", price);
}

/**
 * 상담내역 조회
 * - as-is : cns2700.onSearch()
 */
const getCounselRst = () => {

	const settings = {
		url: `${API_SERVER}/cns.getCounselRst.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE   : sCSEL_DATE,   // 상담일자
                CSEL_NO     : sCSEL_NO,     // 상담번호
                CSEL_SEQ    : sCSEL_SEQ,    // 상담순번
            }],
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
 */
const getCharge = () => {

	const settings = {
		url: `${API_SERVER}/cns.getCharge.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE   : sCSEL_DATE,   // 상담일자
                CSEL_NO     : sCSEL_NO,     // 상담번호
                CSEL_SEQ    : sCSEL_SEQ,    // 상담순번
            }],
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
 */
const getDeptProcVoc = () => {

	const settings = {
		url: `${API_SERVER}/cns.getDeptProcVoc.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE   : sCSEL_DATE,   // 상담일자 
                CSEL_NO     : sCSEL_NO,     // 상담번호
                CSEL_SEQ    : sCSEL_SEQ,    // 상담순번
            }],
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
 */
const getGift = () => {

	const settings = {
		url: `${API_SERVER}/cns.getGift.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE   : sCSEL_DATE,   // 상담일자 
                CSEL_NO     : sCSEL_NO,     // 상담번호
                CSEL_SEQ    : sCSEL_SEQ,    // 상담순번
            }],
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
            // DS_GIFT.GIFT_CDE        // 사은품코드     (내역2)
            // DS_GIFT.GIFT_PRICE      // 사은품가격    
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

        // 사은품코드와 가격 세팅
        onChangeGiftType(DS_GIFT.GIFT_CDE, DS_GIFT.GIFT_PRICE);
        
	});
}

/**
 * 1차 해피콜 내역 조회
 * - as-is : cns2700.onSearch()
 */
const getHappy1 = () => {

	const settings = {
		url: `${API_SERVER}/cns.getHappy1.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE   : sCSEL_DATE,   // 상담일자
                CSEL_NO     : sCSEL_NO,     // 상담번호
            }],
		}),
		errMsg: "1차 해피콜 내역 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		if (data.dsRecv.length >= 1) {
            DS_HPCALL1 = data.dsRecv[0];
            // DS_HPCALL1.CSEL_DATE        // 상담일자       
            // DS_HPCALL1.CSEL_NO          // 상담번호   
            calendarUtil.setImaskValue("calendar3", DS_HPCALL1.HPCALL_DATE || ""); // 해피콜일자       
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
            getHappy2(true);
        } 
        // 처음 저장인 경우
        else {
            calendarUtil.setImaskValue("calendar3", getDateFormat()); // 해피콜일자 초기화
            $("#timebox2").val(getTimeFormat());                     // 해피콜시간 초기화
            $("#textbox25").val(currentUser.name);                   // 해피콜담당자명 초기화
            getHappy2(false);
        }

        
        

	});
}

/**
 * 2차 해피콜 내역 조회
 * - as-is : cns2700.onSearch()
 * @param {boolean} isHappy1 1차해피콜 데이터유무
 */
const getHappy2 = (isHappy1) => {

	const settings = {
		url: `${API_SERVER}/cns.getHappy2.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE   : sCSEL_DATE,   // 상담일자
                CSEL_NO     : sCSEL_NO,     // 상담번호 
            }],
		}),
		errMsg: "2차 해피콜 내역 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		if (data.dsRecv.length >= 1) {
            DS_HPCALL2 = data.dsRecv[0];
            // DS_HPCALL2.CSEL_DATE          // 상담일자
            // DS_HPCALL2.CSEL_NO            // 상담번호
            calendarUtil.setImaskValue("calendar4", DS_HPCALL2.HPCALL_DATE || ""); // 해피콜일자    
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
            calendarUtil.setImaskValue("calendar4", getDateFormat());    // 해피콜일자 초기화
            $("#timebox3").val(getTimeFormat());                        // 해피콜시간 초기화
            $("#textbox27").val(currentUser.name);                      // 해피콜담당자명 초기화
        }

	});
}

/**
 * 상담연계대상선택 조회
 * - 형제회원 지점확인을 위한 조회
 * - as-is : cns2700.onSearch()
 */
// const getTransList = () => {

// 	const settings = {
// 		url: `${API_SERVER}/cns.getTransList.do`,
// 		method: 'POST',
// 		contentType: "application/json; charset=UTF-8",
// 		dataType: "json",
// 		data: JSON.stringify({
// 			senddataids: ["dsSend"],
// 			recvdataids: ["dsRecv"],
//             dsSend: [{ 
//                 CSEL_DATE : sCSEL_DATE, // 상담일자    
//                 CSEL_NO   : sCSEL_NO,   // 상담번호
//                 PROC_MK   : sPROC_MK,   // 처리구분
//             }],
// 		}),
// 		errMsg: "상담연계대상선택 조회중 오류가 발생하였습니다.",
// 	}
// 	$.ajax(settings).done(data => {
// 		if (!checkApi(data, settings)) return;

// 		if (data.dsRecv.length >= 1) {
//             DS_TRANS_DEPT = data.dsRecv[0];
//             // DS_TRANS_DEPT.CSEL_DATE       // 상담일자    
//             // DS_TRANS_DEPT.CSEL_SEQ        // 상담순번    
//             // DS_TRANS_DEPT.CUST_TCHR_NAME  // 고객명or교사명        
//             // DS_TRANS_DEPT.DEPT_NAME       // 지점명    
//             // DS_TRANS_DEPT.CSEL_LTYPE_CDE  // 대분류        
//             // DS_TRANS_DEPT.CSEL_MTYPE_CDE  // 중분류        
//             // DS_TRANS_DEPT.CSEL_STYPE_CDE  // 소분류        
//             // DS_TRANS_DEPT.CHO_FLAG        // 체크박스플레그    
//             // DS_TRANS_DEPT.LC_NAME         // 센터명      
//         }

// 	});
// }

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
            calendarUtil.setImaskValue("calendar2", DS_DEPT_PROC.DEPT_ACP_DATE || "");     // 지점접수일자(접수일자)
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
            calendarUtil.setImaskValue("calendar2", getDateFormat());    // 접수일자 초기화
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
        if (calendarUtil.getImaskValue("calendar2").length < 8) {
            calendarUtil.setImaskValue("calendar2", getDateFormat());
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
        $("#calendar2").prop("disabled", false);
        $("#timebox1").prop("readonly", false);
        $("#textbox18").prop("readonly", false);
        $("#textbox19").prop("readonly", false);
        $("#textbox34").prop("readonly", false);
    } else {
        $("#calendar2").prop("disabled", true);
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
        $("#calendar3").prop("disabled", false);
        $("#timebox2").prop("readonly", false);
        $("#textbox25").prop("readonly", false);
        $("#textbox35").prop("readonly", false);
        $("#selectbox1").prop("disabled", false);
        $("#selectbox2").prop("disabled", false);
    } else {
        $("#calendar3").prop("disabled", true);
        $("#timebox2").prop("readonly", true);
        $("#textbox25").prop("readonly", true);
        $("#textbox35").prop("readonly", true);
        $("#selectbox1").prop("disabled", true);
        $("#selectbox2").prop("disabled", true);
    }
}

/**
 * 2차 해피콜 활성 또는 비활성
 * - as-is : cns2700.setHpCall2EorD()
 * @param {boolean} bWrite 
 */ 
const setHpCall2EorD = (bWrite) => {
    if (bWrite) {
        $("#calendar4").prop("disabled", false);
        $("#timebox3").prop("readonly", false);
        $("#textbox28").prop("readonly", false);
        $("#textbox36").prop("readonly", false);
        $("#selectbox3").prop("disabled", false);
        $("#selectbox4").prop("disabled", false);
    } else {
        $("#calendar4").prop("disabled", true);
        $("#timebox3").prop("readonly", true);
        $("#textbox28").prop("readonly", true);
        $("#textbox36").prop("readonly", true);
        $("#selectbox3").prop("disabled", true);
        $("#selectbox4").prop("disabled", true);
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
        $("#selectbox5").prop("disabled", false);
        $("#selectbox6").prop("disabled", false);
        $("#textbox30").prop("readonly", false);
        $("#selectbox7").prop("disabled", false);
        $("#textbox31").prop("readonly", false);
        $("#textbox32").prop("readonly", false);
    } else {
        $("#calendar1").prop("disabled", true);
        $("#selectbox5").prop("disabled", true);
        $("#selectbox6").prop("disabled", true);
        $("#textbox30").prop("readonly", true);
        $("#selectbox7").prop("disabled", true);
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
        arrInData[2] = $("#textbox5").val().trim(); // 회원휴대폰
        arrInData[3] = $("#textbox7").val().trim(); // 회원/모 휴대폰
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
        arrInData[3] = $("#textbox11").val().trim();// 지점장 PDA
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
        arrInData[3] = $("#textbox13").val().trim();// 지점장 PDA
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
        const smsCondition = await getSmsCondition('1', recevier);
        if (!smsCondition) return;
        smsSendData.push(smsCondition);
    }
    // 지점장 전화번호 점검    	
    if (chkEmpSMSYN == "Y") {
        recevier = $("#textbox11").val().trim();
        const smsCondition = await getSmsCondition('2', recevier);
        if (!smsCondition) return;
        smsSendData.push(smsCondition);
    }
    // 센터장 전화번호 점검    	
    if (chkLCEmpSMSYN == "Y") {
        recevier = $("#textbox13").val().trim();
        const smsCondition = await getSmsCondition('3', recevier);
        if (!smsCondition) return;
        smsSendData.push(smsCondition);
    }	    	

    // SMS전송 API 호출
    addSMSData(smsSendData);
        
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

    return {
        MSG_TYPE    : "0",                  // 메시지 타입(0:SMS,5:LMS)      
        DEST_PHONE  : tel.join(""),         // 수신번호      
        DEST_NAME   : DS_SMSDATA.RECVNAME,  // 수신자      
        SEND_PHONE  : SEND_PHONE,           // 발신번호      
        MSG_BODY    : DS_SMSDATA.MSG,       // 전송내용      
        STATUS      : "",                   // 발송상태  (0:발송대기)  
        CUST_ID     : DS_SMSDATA.CUST_ID,   // 고객번호  
        MBR_ID      : DS_SMSDATA.MBR_ID,    // 회원번호  
        CSEL_DATE   : DS_SMSDATA.CSEL_DATE, // 상담일자      
        CSEL_NO     : DS_SMSDATA.CSEL_NO,   // 상담번호  
        CSEL_SEQ    : DS_SMSDATA.CSEL_SEQ,  // 상담순번      
        EXTERNAL_ID : DS_SMSDATA.USER_ID,   // 상담자ID      
        SMS_TRGT_ID : "",                   // 대상구분(1:지점,2:학부모,3:교사)      
        SMS_FIX_ID  : "",                   // 구분코드(1:입회,2:시정처리,3:상담연계,4:계좌변경)      
    }

}

/**
 * SMS 발송
 */
const addSMSData = (sendData) => {
    const settings = {
		url: `${API_SERVER}/sys.addSMSData.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids : ["dsSend"],
            recvdataids : ["dsRecv"],
            dsSend      : sendData
		}),
        errMsg: "SMS 발송 중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(res => {
        if (!checkApi(res, settings)) return;
        alert("SMS가 발송되었습니다.");
    });
}

/**
 * 완료/저장 버튼 클릭시
 * - as-is : cns2700.onSaveT()
 * @param {string} sBtnMk 
 */
const onSave = (sBtnMk) => {
    
    // 1. 지점처리내역 
    // - 저장할 경우 
    if(!getDeptValidityCheck()) return;
    MK_TRANS_TR = "I"
    // - 변경할 경우 
    if(!getDeptValidityCheck()) return;
    MK_TRANS_TR = "U"
    // - 저장 또는 변경이 아닌경우        
    MK_TRANS_TR = "N"
    
    // 2. 1차 해피콜
    // - 저장인 경우, 데이터의 조작이 있는 경우 
    if ($("#textbox26").val().length >= 1 ||
        $("#textbox35").val().length >= 1 ||
        $("#selectbox1").val().length >= 1 ||
        $("#selectbox2").val.length >= 1) {
        if (!getHpCall1ValidityCheck()) return;
        MK_HPCALL1_TR = "I"
    }
    // - 저장이지만 데이터의 조작이 없는 경우
    MK_HPCALL1_TR = "N"
    // - 변경인 경우 
    if (!getHpCall1ValidityCheck()) return;
    MK_HPCALL1_TR = "U"
    // 저장 또는 변경이 아닌경우
    MK_HPCALL1_TR = "N"

        
    // 3. 2차 해피콜
    // - 저장인 경우, 1차해피콜이 저장(신규)이 아닌 경우, 데이터의 조작이 있는 경우
    if ($("#textbox28").val().length >= 1 ||
        $("#textbox36").val().length >= 1 ||
        $("#selectbox3").val().length >= 1 ||
        $("#selectbox4").val().length >= 1) {
        if (!getHpCall2ValidityCheck()) return;
        MK_HPCALL2_TR = "I"
    } 
    // - 데이터의 조작이 없는 경우
    else {
        MK_HPCALL2_TR = "N"
    }
    // - 저장인 경우, 1차 해피콜이 저장(신규)인 경우
    MK_HPCALL2_TR = "N"
    // - 변경인 경우
    if (!getHpCall2ValidityCheck()) return;
    MK_HPCALL2_TR = "U"
    // - 저장 또는 변경이 아닌경우
    MK_HPCALL2_TR = "N"
                    
    // 4. 사은품      
    // - 저장인 경우, 1차해피콜이 신규가 아니거나, 1차해피콜을  저장하는 경우, 데이터의 조작이 있는 경우  
    if ($("#selectbox5").val().length >= 1 ||
        $("#selectbox6").val().length >= 1 ||
        calendarUtil.getImaskValue("textbox30").length >= 1 ||
        $("#selectbox7").val().length >= 1 ||
        $("#textbox31").val().length >= 1 ||
        $("#textbox32").val().length >= 1) {
        if (!getGiftValidityCheck()) return;
        MK_GIFT_TR = "I"
    }
    // - 데이터의 조작이 없는 경우
    else {
        MK_GIFT_TR = "N"
    }
    // - 저장인 경우, 1차해피콜이 신규인 경우이고, 1차해피콜을 저장 하지 않을 경우
    MK_GIFT_TR = "N"
    // - 변경인 경우
    if (!getGiftValidityCheck()) return;
    MK_GIFT_TR = "U"
    // - 저장, 변경이 아닌경우
    MK_GIFT_TR = "N"
  
    if (MK_TRANS_TR != "N" || MK_HPCALL1_TR != "N" || MK_HPCALL2_TR != "N" || MK_GIFT_TR != "N" || sBtnMk == "CO") {
        const condition = getSaveCondition(sBtnMk);
        saveCselResult(condition);
    }
}

/**
 * 유효성 확인 - 지점처리내역
 * - as-is : cns2700.getDeptValidityCheck()
 */
const getDeptValidityCheck = () => {
    if(calendarUtil.getImaskValue("calendar2").length < 8){
        alert("접수일자를 정확히 입력하십시요.");
        $("#calendar2").focus();
        return false;            
    }
    if($("#timebox1").val().length < 6){
        alert("접수시간을 정확히 입력하십시요.");
        $("#timebox1").focus();
        return false;
    }
    if($("#textbox18").val().trim().length < 1){
        alert("접수자를 입력하십시요.");
        $("#textbox18").focus();
        return false;
    }
    if($("#textbox19").val().trim().length < 1){
        alert("처리자를 입력하십시요.");
        $("#textbox19").focus();
        return false;
    }
    if($("#textbox34").val().trim().length < 1){
        alert("처리내용을 입력하십시요.");
        $("#textbox34").focus();
        return false;
    }
    return true;
}

/**
 * 유효성 확인 - 2차 해피콜
 * - as-is : cns2700.getHpCall2ValidityCheck()
 */
const getHpCall2ValidityCheck = () => {
    if (calendarUtil.getImaskValue("calendar4").length < 8) {
        alert("해피콜일자를 정확히 입력하십시요.");
        $("#calendar4").focus();
        return false;
    }
    if ($("#timebox3").val().length < 6) {
        alert("해피콜시간을 정확히 입력하십시요.");
        $("#timebox3").focus();
        return false;
    }
    if (!$("#textbox28").val().trim()) {
        alert("해피콜 제목을 입력하십시요.");
        $("#textbox28").focus();
        return false;
    }
    if (!$("#textbox36").val().trim()) {
        alert("해피콜 내용을 입력하십시요.");
        $("#textbox36").focus();
        return false;
    }
    if (!$("#selectbox3").val()) {
        alert("고객 만족도를 선택하십시요.");
        $("#selectbox3").focus();
        return false;
    }
    if (!$("#selectbox4").val()) {
        alert("피드백 경로를 선택하십시요.");
        $("#selectbox4").focus();
        return false;
    }
    return true;
}

/**
 * 유효성 확인 - 1차 해피콜
 * - as-is : cns2700.getHpCall1ValidityCheck()
 */ 
const getHpCall1ValidityCheck = () => {
    if (calendarUtil.getImaskValue("calendar3").length < 8) {
        alert("해피콜일자를 정확히 입력하십시요.");
        $("#calendar3").focus();
        return false;
    }
    if ($("#timebox2").val().length < 6) {
        alert("해피콜시간을 정확히 입력하십시요.");
        $("#timebox2").focus();
        return false;
    }
    if (!$("#textbox26").val().trim()) {
        alert("해피콜 제목을 입력하십시요.");
        $("#textbox26").focus();
        return false;
    }
    if (!$("#textbox35").val().trim()) {
        alert("해피콜 내용을 입력하십시요.");
        $("#textbox35").focus();
        return false;
    }
    if (!$("#selectbox1").val()) {
        alert("상담원 만족도를 선택하십시요.");
        $("#selectbox1").focus();
        return false;
    }
    if (!$("#selectbox2").val()) {
        alert("피드백 경로를 선택하십시요.");
        $("#selectbox2").focus();
        return false;
    }
    return true;
}

/**
 * 유효성 확인 - 사은품
 * - as-is : cns2700.getGiftValidityCheck()
 */
const getGiftValidityCheck = () => {
    if (!$("#selectbox5").val()) {
        alert("사은품 내역을 선택 하십시요.");
        $("#selectbox5").focus();
        return false;
    }
    if ($("#selectbox6 option").length > 1 && $("#selectbox6").val().length < 1) {
        alert("사은품 내역을 선택 하십시요.");
        $("#selectbox6").focus();
        return false;
    }
    if (!calendarUtil.getImaskValue("textbox30")) {
        alert("사은품 가격을 입력하십시요.");
        $("#textbox30").focus();
        return false;
    }
    if (calendarUtil.getImaskValue("calendar1").length < 8) {
        alert("발송일을 정확히 입력하십시요.");
        $("#calendar1").focus();
        return false;
    }
    if (!$("#selectbox7").val()) {
        alert("사은품 발송경로를 선택 하십시요.");
        $("#selectbox7").focus();
        return false;
    }
    if (!$("#textbox31").val()) {
        alert("사은품 전달자를 입력하십시요.");
        $("#textbox31").focus();
        return false;
    }
    return true;
}

/**
 * 저장 value check
 * - as-is : cns2700.setCselSave(), setDeptSave(), setHpCall1Save(), setHpCall2Save(), setGiftSave(), setProcStsMk
 */
const getSaveCondition = (sBtnMk) => {
    const data = {
        // 지점처리정보 데이터
        DS_TRANS: {
            ROW_TYPE         : "",                                      // 저장구분(I/U/D)              TODO
            CSEL_DATE        : DS_COUNSEL.CSEL_DATE,                    // 상담일자
            CSEL_NO          : DS_COUNSEL.CSEL_NO,                      // 상담번호
            CSEL_SEQ         : DS_COUNSEL.CSEL_SEQ,                     // 상담순번
            TRANS_DATE       : DS_DEPT_PROC.TRANS_DATE,                 // 연계일자
            TRANS_NO         : DS_DEPT_PROC.TRANS_NO,                   // 연계번호
            TRANS_MK         : DS_DEPT_PROC.TRANS_MK,                   // 연계구분
            TRANS_TIME       : DS_DEPT_PROC.TRANS_TIME,                 // 연계시간
            TRANS_DEPT_ID    : DS_DEPT_PROC.TRANS_DEPT_ID,              // 연계지점코드
            TRANS_CHNL_MK    : DS_DEPT_PROC.TRANS_CHNL_MK,              // 연계방법구분
            TRANS_TITLE      : DS_DEPT_PROC.TRANS_TITLE,                // 연계제목
            TRANS_CNTS       : DS_DEPT_PROC.TRANS_CNTS,                 // 연계상세내용
            PROC_HOPE_DATE   : DS_DEPT_PROC.PROC_HOPE_DATE,             // 처리희망일자
            PROC_STS_MK      : "",                                      // 처리상태구분
            RTN_FLAG         : DS_DEPT_PROC.RTN_FLAG,                   // 회신여부구분
            PROC_DATE        : DS_DEPT_PROC.PROC_DATE,                  // 처리일자
            PROC_TIME        : DS_DEPT_PROC.PROC_TIME,                  // 처리시간
            PROC_EMP         : $("#textbox19").val().trim(),            // 지점처리자
            PROC_CNTS        : $("#textbox34").val().trim(),            // 처리내용
            RTN_USER_ID      : currentUser.external_id,                 // 피드백접수자ID
            RTN_DATE         : DS_DEPT_PROC.RTN_DATE,                   // 피드백일자
            RTN_TIME         : DS_DEPT_PROC.RTN_TIME,                   // 피드백시간
            // DEPT_ACP_NAME   : $("#textbox18").val().trim(),
            // DEPT_ACP_DATE   : calendarUtil.getImaskValue("calendar2"),
            // DEPT_ACP_TIME   : $("#timebox1").val(),
        },
        // 해피콜1차 정보 데이터
        DS_HPCALL1: {
            ROW_TYPE         : "",                                       // 저장구분(I/U/D)             TODO
            CSEL_DATE        : DS_HPCALL1.CSEL_DATE,                     // 상담일자
            CSEL_NO          : DS_HPCALL1.CSEL_NO,                       // 상담번호
            HPCALL_DATE      : calendarUtil.getImaskValue("calendar3"),  // 해피콜일자
            HPCALL_TIME      : $("#timebox2").val(),                     // 해피콜시간
            HPCALL_TITLE     : $("#textbox26").val().trim(),             // 해피콜제목
            HPCALL_CNTS      : $("#textbox35").val().trim(),             // 해피콜내용
            HPCALL_CHNL_MK   : $("#selectbox2").val(),                   // 피드백경로
            HPCALL_USER_ID   : currentUser.external_id,                  // 해피콜상담원ID
            SATIS_CDE        : $("#selectbox1").val(),                   // 고객만족도
            SATIS_CDE1       : DS_HPCALL1.SATIS_CDE1,                    // 고객만족도1
            SATIS_CDE2       : DS_HPCALL1.SATIS_CDE2,                    // 고객만족도2
            // GIFT_DATE        : "",
            // GIFT_NO          : "",
        },
        // 해피콜2차 정보 데이터
        DS_HPCALL2: {
            ROW_TYPE         : "",                                       // 저장구분(I/U/D)                TODO   
            CSEL_DATE        : DS_HPCALL2.CSEL_DATE,                     // 상담일자      
            CSEL_NO          : DS_HPCALL2.CSEL_NO,                       // 상담번호  
            HPCALL_DATE      : calendarUtil.getImaskValue("calendar4"),  // 해피콜일자      
            HPCALL_TIME      : $("#timebox3").val(),                     // 해피콜시간      
            HPCALL_TITLE     : $("#textbox28").val().trim(),             // 해피콜제목          
            HPCALL_CNTS      : $("#textbox36").val().trim(),             // 해피콜내용      
            HPCALL_CHNL_MK   : $("#selectbox4").val(),                   // 피드백경로          
            HPCALL_USER_ID   : currentUser.external_id,                  // 해피콜상담원ID          
            SATIS_CDE        : $("#selectbox3").val(),                   // 고객만족도      
        },
        // 사은품 정보 데이터
        DS_GIFT: {
            ROW_TYPE         : "",                                       // 저장구분(I/U/D)                 TODO   
            CSEL_DATE        : DS_COUNSEL.CSEL_DATE,                     // 상담일자       
            CSEL_NO          : DS_COUNSEL.CSEL_NO ,                      // 상담번호   
            GIFT_DATE        : DS_GIFT.GIFT_DATE,                        // 사은품일자       
            GIFT_NO          : DS_GIFT.GIFT_NO,                          // 사은품번호   
            GIFT_SEQ         : DS_GIFT.GIFT_SEQ,                         // 사은품순번       
            DTL_MK           : "1",                                      // 내역구분(사은품내역구분 '1'은 상담임.)  
            CUST_ID          : DS_GIFT.CUST_ID,                          // 고객번호   
            GIFT_TYPE_CDE    : $("#selectbox5").val(),                   // 사은품분류코드           
            GIFT_CDE         : $("#selectbox6").val(),                   // 사은품코드       
            GIFT_PRICE       : calendarUtil.getImaskValue("textbox30"),  // 사은품가격       
            SEND_DATE        : calendarUtil.getImaskValue("calendar1"),  // 발송일       
            GIFT_CHNL_MK     : $("#selectbox7").val(),                   // 전달경로구분           
            PASS_USER        : $("#textbox31").val().trim(),             // 전달자       
            INVOICENUM       : $("#textbox32").val().trim(),             // 택배송장번호       
        } 
    }

    // 완료 버튼을 클릭한 경우
    if (sBtnMk == "CO") {
        if (DS_COUNSEL.PROC_STS_MK == "99") { // 이미 완료인 경우
            data.DS_TRANS.PROC_STS_MK = "99"; // 완료
        } else if (DS_COUNSEL.PROC_STS_MK == "16") {  // 2차해피콜완료인 경우
            data.DS_TRANS.PROC_STS_MK = "99"; // 완료
        } else if (DS_COUNSEL.PROC_STS_MK == "12") {  // 2차결재
            data.DS_TRANS.PROC_STS_MK = "99"; // 완료
        } else if (DS_COUNSEL.PROC_STS_MK == "15") {  // 해피콜완료
            if (DS_COUNSEL.PROC_MK == "3") {  // 처리구분이 시정처리인 경우
                data.DS_TRANS.PROC_STS_MK = "99"; // 완료
            } else {
                data.DS_TRANS.PROC_STS_MK = DS_COUNSEL.PROC_STS_MK; // 바뀌지 않음
            }
        } else if (DS_COUNSEL.PROC_STS_MK == "04") {  // 지점처리완료
            if (DS_COUNSEL.PROC_MK == "3") {  // 처리구분이 시정처리인 경우
                data.DS_TRANS.PROC_STS_MK = "99";  // 완료
            } else {
                data.DS_TRANS.PROC_STS_MK = DS_COUNSEL.PROC_STS_MK; // 바뀌지 않음
            }
        } else {  // 접수, 지점처리중은는 완료할 수 없다... 버튼에서 컨트롤함.
            data.DS_TRANS.PROC_STS_MK = DS_COUNSEL.PROC_STS_MK; // 바뀌지 않음
        }
    }
    // 저장 버튼을 클릭한 경우
    else if (sBtnMk == "SA") {
        if (DS_COUNSEL.PROC_STS_MK == "03" || DS_COUNSEL.PROC_STS_MK == "01") { // 지점처리중인 경우                
            if (data.DS_HPCALL2.ROW_TYPE != "N") { // 2차해피콜인 경우                                                      TODO
                data.DS_TRANS.PROC_STS_MK = "16"; // 2차해피콜완료
            } else if (data.DS_HPCALL1.ROW_TYPE != "N") { // 1차해피콜인 경우                                                      TODO
                data.DS_TRANS.PROC_STS_MK = "15"; // 해피콜완료
            } else if (data.DS_TRANS.ROW_TYPE != "N") { // 지점처리인 경우                                                      TODO
                data.DS_TRANS.PROC_STS_MK = "04"; // 지점처리중
            } else {
                data.DS_TRANS.PROC_STS_MK = "03"; // 지점처리완료
            }
        } else if (DS_COUNSEL.PROC_STS_MK == "04") { // 지점처리완료인 경우
            if (data.DS_HPCALL2.ROW_TYPE != "N") { // 2차해피콜인 경우                                                      TODO
                data.DS_TRANS.PROC_STS_MK = "16"; // 2차해피콜완료
            } else if (data.DS_HPCALL1.ROW_TYPE != "N") { // 1차해피콜인 경우                                                      TODO
                data.DS_TRANS.PROC_STS_MK = "15"; // 해피콜완료
            } else {
                data.DS_TRANS.PROC_STS_MK = "04"; // 지점처리완료
            }
        } else if (DS_COUNSEL.PROC_STS_MK == "12") { // 2차결재인 경우
            data.DS_TRANS.PROC_STS_MK = "12"; // 2차결재
        } else if (DS_COUNSEL.PROC_STS_MK == "15") { // 해피콜완료인 경우
            if (data.DS_HPCALL2.ROW_TYPE != "N") { // 2차해피콜인 경우                                                      TODO
                data.DS_TRANS.PROC_STS_MK = "16"; // 2차해피콜완료
            } else {
                data.DS_TRANS.PROC_STS_MK = "15"; // 해피콜완료
            }
        } else if (DS_COUNSEL.PROC_STS_MK == "16") { // 2차해피콜완료인 경우
            data.DS_TRANS.PROC_STS_MK = "16"; // 2차해피콜완료
        } else if (DS_COUNSEL.PROC_STS_MK == "99") { // 완료인 경우
            data.DS_TRANS.PROC_STS_MK = "99"; // 완료
        } else { // 접수인 경우
            data.DS_TRANS.PROC_STS_MK = DS_COUNSEL.PROC_STS_MK; // 바뀌지 않음
        }
    }

}

/**
 * 저장
 */
const saveCselResult = (condition) => {
    const settings = {
		url: `${API_SERVER}/cns.saveCselResult.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids : ["DS_TRANS", "DS_HPCALL1", "DS_HPCALL2", "DS_GIFT"],
			recvdataids : ["dsRecv"],
            DS_TRANS    : [condition.DS_TRANS],
            DS_HPCALL1  : [condition.DS_HPCALL1],
            DS_HPCALL2  : [condition.DS_HPCALL2],
            DS_GIFT     : [condition.DS_GIFT],
		}),
        errMsg: "상담결과 저장 중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(res => {
        if (!checkApi(res, settings)) return;
        getCounselRst();
        getCharge();
        getDeptProcVoc();
        getGift();
        getHappy1();
        // getTransList();
    });
}

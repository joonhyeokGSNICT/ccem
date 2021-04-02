var topbarObject;			// topbar window
let topbarClient;			// topbar client
let sidebarClient;          // sidebar client
var currentUser = {};       // 현재 사용중인 유저의 정보(ZENDESK)

let giftList = [];      // 사은품내역2 코드

let DS_COUNSEL      = {};   // 상담내역
let DS_CHARGE       = {};   // 담당선생님과 지점장
let DS_VOC_PROC     = {};   // VOC 지점 처리 내역
let DS_GIFT         = {};   // 사은품
let DS_HPCALL1      = {};   // 1차 해피콜 내역
let DS_HPCALL2      = {};   // 2차 해피콜 내역
let DS_TRANS_DEPT   = [];   // 형제회원 지점확인을 위한 조회
let DS_DEPT_PROC    = {};   // 센터처리 내역

var sCSEL_DATE  = "";   // 상담일자
var sCSEL_NO    = "";   // 상담번호
var sCSEL_SEQ   = "";   // 상담순번
let sPROC_MK    = "";   // 처리구분

let SEND_PHONE = "";    // 대표번호

$(function () {

   // 창이 닫힐때 발생하는 event
	$(window).on('beforeunload', () => {
		PopupUtil.closeAll();   // 오픈된 모든 자식창 close
		onSaveCallTime();       // 상담 통화시간 저장
	});

    // create calendar
    calendarUtil.init("calendar1", { drops: "up", opens: "left" });
    calendarUtil.init("calendar2");
    calendarUtil.init("calendar3");
    calendarUtil.init("calendar4");
    
    // input mask
    calendarUtil.currency("textbox30");
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
    $(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));

    onStart();

});

/**
 * 오픈하는곳에 따라 분기처리
 */
const onStart = async () => {
    
    const opener_name = opener ? opener.name : "";

    // 상담조회에서 팝업 되었을때,
    if (opener_name.includes("CCEMPRO035")) { 
        topbarObject  = opener.topbarObject;
        topbarClient  = topbarObject.client;
        sidebarClient = topbarObject.sidebarClient;
        currentUser   = topbarObject.currentUserInfo.user;

        const counselGrid = opener.grid1;	// 상담조회 grid
		const rowKey 	  = counselGrid.getSelectedRowKey();
        sCSEL_DATE        = counselGrid.getValue(rowKey, "CSEL_DATE");	
        sCSEL_NO          = counselGrid.getValue(rowKey, "CSEL_NO");	
        sCSEL_SEQ         = counselGrid.getValue(rowKey, "CSEL_SEQ");	
        sPROC_MK          = counselGrid.getValue(rowKey, "PROC_MK");

        await setCodeData(topbarObject.codeData);
        onSearch();

    // 상담등록에서 팝업되었을때,
    } else if (opener_name.includes("CCEMPRO022")) {
        topbarObject  = opener.topbarObject;
        topbarClient  = topbarObject.client;
        sidebarClient = topbarObject.sidebarClient;
        currentUser   = topbarObject.currentUserInfo.user;

        sCSEL_DATE = opener.calendarUtil.getImaskValue("textbox27");    //상담일자
        sCSEL_NO   = $("#textbox28", opener.document).val();            //상담번호
        sCSEL_SEQ  = $("#selectbox14", opener.document).val();          //상담순번
        sPROC_MK   = $("#selectbox4", opener.document).val();           //처리구분

        await setCodeData(topbarObject.codeData);
        onSearch();
    }

	// 전화아이콘 상태를 컨트롤 하기위해
	topbarObject?.wiseNTalkUtil.saveWindowObj(window);

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
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
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
 * 발송경로 change event
 * @param {string} value 발송경로
 */
const onChangeGiftChnl = (value) => {

    // 발송경로 세팅
    $("#selectbox7").val(value);

    // 발송경로가 SMS일 경우 전화번로 표시
    if (value == "4") {
        $("#thText1").css("display", "none");
        $("#thText2").css("display", "");
    // 그외는 송장번호 표시
    } else {
        $("#thText1").css("display", "");
        $("#thText2").css("display", "none");
    }

}

/**
 * 수신자 전화번호 radio 버튼 change event
 */
const onChangeRdoTel = () => {

    const id = $("input[name='rdoTel']:checked").attr("id");

    // 전화번호 선택
    if (id == "radio1") {
        $("#thText3").text("전화번호");
        $("#textbox37").val($("#textbox2").val());
    // 회원HP 선택
    } else if (id == "radio2") {
        $("#thText3").text("회원HP");
        $("#textbox37").val($("#textbox5").val());
    // 회원모HP 선택
    } else if (id == "radio3") {
        $("#thText3").text("회원모HP");
        $("#textbox37").val($("#textbox7").val());
    }

}

/**
 * 조회
 */
const onSearch = async (DS_TICKET) => {

    await getCounselRst();
    await getCharge();
    await getDeptProcVoc();
    await getDeptProc();
    await getGift();
    await getHappy1();
    await getHappy2();
    await getChkDeptInfo();
            
    setText(DS_COUNSEL.CUST_MK);                                  // 고객 또는 선생님 셋팅
    setButton(DS_COUNSEL.PROC_STS_MK);                            // 버튼 셋팅
    setDisplay(DS_COUNSEL.PROC_STS_MK, DS_COUNSEL.CSEL_RST_MK);   // 화면 셋팅

    // 저장후 재조회시 티켓업데이트
    if (DS_TICKET) {
        DS_TICKET.IS_HAPY = $("#checkbox4").is(":checked");       // 해피콜여부
        updateTicket(DS_TICKET).catch(error => {
            alert(`티켓업데이트 중 오류가 발생하였습니다.\n\n${error}`);
        });
    }

}

/**
 * 상담내역 조회
 * - as-is : cns2700.onSearch()
 */
const getCounselRst = () => new Promise((resolve, reject) => {

	const settings = {
		url: `${API_SERVER}/cns.getCounselRst.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
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

	$.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));

            // 상담내역 세팅
            DS_COUNSEL = (res.dsRecv?.length > 0) ? res.dsRecv[0] : new Object();
            
            calendarUtil.setImaskValue("datebox1", DS_COUNSEL.CSEL_DATE)            // 상담일자
            // DS_COUNSEL.CSEL_NO             // 상담번호
            // DS_COUNSEL.CSEL_SEQ            // 상담순번
            // DS_COUNSEL.CUST_ID             // 고객번호
            // DS_COUNSEL.CUST_MK             // 고객구분
            // DS_COUNSEL.CSEL_USER_ID        // 상담원ID
            // DS_COUNSEL.CSEL_STTIME         // 상담시작시간
            $("#textbox16").val(DS_COUNSEL.CSEL_TITLE);          // 상담제목
            $("#textbox17").val(DS_COUNSEL.CSEL_CNTS);           // 상담상세내용
            // DS_COUNSEL.MBR_ID              // 회원번호
            calendarUtil.setImaskValue("datebox2", DS_COUNSEL.PROC_HOPE_DATE);       // 처리희망일자
            // DS_COUNSEL.DEPT_ID             // 관할지점코드
            calendarUtil.setImaskValue("datebox3", DS_COUNSEL.TRANS_DATE);           // 연계일자
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
            // DS_COUNSEL.ZEN_TICKET_ID        // 티켓ID
            
            onChangeRdoTel();                                    // 회원 전화번호 세팅

            return resolve(DS_COUNSEL);
            
        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 담당선생님, 지점장 정보 조회
 * - as-is : cns2700.onSearch()
 */
const getCharge = () => new Promise((resolve, reject) => {

	const settings = {
		url: `${API_SERVER}/cns.getCharge.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
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

	$.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));
            
            
            // 담당선생님 및 지점장 정보세팅
            DS_CHARGE = (res.dsRecv?.length > 0) ? res.dsRecv[0] : new Object();

            // DS_CHARGE.EMP_ID            // 교사사번  
            $("#textbox20").val(DS_CHARGE.TCHR_NAME);         // 교사명      
            // DS_CHARGE.PART_EMP_ID       // 지점장사번      
            $("#textbox21").val(DS_CHARGE.PART_NO1_NAME);     // 지점장명   

            return resolve(DS_CHARGE);

        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 사업국처리 내역 조회
 * - as-is : cns2700.onSearch()
 */
const getDeptProcVoc = () => new Promise((resolve, reject) => {

	const settings = {
		url: `${API_SERVER}/cns.getDeptProcVoc.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
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

	$.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));

            // 사업국처리 내역 세팅
            DS_VOC_PROC = (res.dsRecv?.length > 0) ? res.dsRecv[0] : new Object();

            calendarUtil.setImaskValue("datebox7", DS_VOC_PROC.VOC_PROC_DATE);     // 처리일자      
            $("#timebox4").val(DS_VOC_PROC.VOC_PROC_TIME);                         // 처리시간          
            // DS_VOC_PROC.VOC_PROC_EMP_ID   // 처리자ID          
            $("#textbox29").val(DS_VOC_PROC.VOC_PROC_EMP_NM);                      // 처리자          
            $("#textbox33").val(DS_VOC_PROC.VOC_PROC_CNTS);                        // 처리내용          
            // DS_VOC_PROC.CTI_CHGDATE       // CTI변경일자 

            return resolve(DS_VOC_PROC);

        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 지점처리 내역 조회
 * - as-is : cns2700.onSearch()
 */
 const getDeptProc = () => new Promise((resolve, reject) => {

	const settings = {
		url: `${API_SERVER}/cns.getDeptProc.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE   : sCSEL_DATE,   // 상담일자
                CSEL_NO     : sCSEL_NO,     // 상담번호
                CSEL_SEQ    : sCSEL_SEQ,    // 상담순번
            }],
		}),
		errMsg: "지점처리 내역 조회중 오류가 발생하였습니다.",
	}
    
	$.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));

            // 검색결과가 있는경우.
            if (res.dsRecv?.length > 0) {
                DS_DEPT_PROC = res.dsRecv[0];
                DS_DEPT_PROC.ROW_TYPE = "U";
            
            // 검색결과가 없는경우.
            } else {
                DS_DEPT_PROC = new Object();
                DS_DEPT_PROC.ROW_TYPE       = "I";                        // 지점처리정보 저장구분
                DS_DEPT_PROC.TRANS_DATE     = getDateFormat().replace(/[^0-9]/gi, "");  // 연계일자
                DS_DEPT_PROC.TRANS_MK       = DS_COUNSEL.PROC_MK-2;       // 연계구분
                DS_DEPT_PROC.TRANS_DEPT_ID  = DS_COUNSEL.DEPT_ID;         // 연계지점
                DS_DEPT_PROC.TRANS_TITLE    = DS_COUNSEL.CSEL_TITLE;      // 연계 제목
                DS_DEPT_PROC.TRANS_CNTS     = DS_COUNSEL.CSEL_CNTS;       // 연계 내용
                DS_DEPT_PROC.TRANS_CHNL_MK  = "1";                        // 연계방법(1: 전화)
                DS_DEPT_PROC.PROC_HOPE_DATE = DS_COUNSEL.PROC_HOPE_DATE;  // 처리희망일
                DS_DEPT_PROC.PROC_TIME      = "";                         // 처리시간                        
            }

            // 처리내역 세팅
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
            $("#textbox18").val(DS_DEPT_PROC.DEPT_ACP_NAME);                         // 지점접수자성명   
            calendarUtil.setImaskValue("calendar2", DS_DEPT_PROC.DEPT_ACP_DATE);     // 지점접수일자(접수일자)
            $("#timebox1").val(DS_DEPT_PROC.DEPT_ACP_TIME);                          // 지점접수시간(접수시간)
            // DS_DEPT_PROC.PROC_STS_MK       // 처리상태구분
            // DS_DEPT_PROC.RTN_FLAG          // 회신여부구분
            // DS_DEPT_PROC.PROC_DATE         // 처리일자
            // DS_DEPT_PROC.PROC_TIME         // 처리시간
            $("#textbox19").val(DS_DEPT_PROC.PROC_EMP);                              // 지점처리자  
            $("#textbox34").val(DS_DEPT_PROC.PROC_CNTS);                             // 처리내용 
            // DS_DEPT_PROC.RTN_USER_ID       // 피드백접수자ID
            // DS_DEPT_PROC.RTN_DATE          // 피드백일자
            // DS_DEPT_PROC.RTN_TIME          // 피드백시간
            // DS_DEPT_PROC.CTI_CHGDATE       // CTI변경일자   
            // DS_DEPT_PROC.TRANS_LC_ID,      // 연계센터코드 

            // 접수일자 체크
            // if (calendarUtil.getImaskValue("calendar2").length < 8) {
            //     calendarUtil.setImaskValue("calendar2", getDateFormat());
            // }
            // 접수시간 체크
            // if ($("#timebox1").val().length < 6) {
            //     $("#timebox1").val(getTimeFormat());   
            // }

            // 사업국처리시간 세팅
            const intervalTime = gf_getIntervalTime(DS_DEPT_PROC.DEPT_ACP_DATE||"", DS_DEPT_PROC.DEPT_ACP_TIME||"", DS_VOC_PROC.VOC_PROC_DATE||"", DS_VOC_PROC.VOC_PROC_TIME||"");
            $("#textbox24").val(intervalTime); 
            
            return resolve(DS_DEPT_PROC);

        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 사은품 정보 조회
 * - as-is : cns2700.onSearch()
 */
const getGift = () => new Promise((resolve, reject) => {

	const settings = {
		url: `${API_SERVER}/cns.getGift.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
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

	$.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));

            // 검색결과가 있는경우.
            if (res.dsRecv?.length > 0) {
                DS_GIFT = res.dsRecv[0];
                DS_GIFT.ROW_TYPE = "U";
            
            // 검색결과가 없는경우.
            } else {
                DS_GIFT = new Object();
                DS_GIFT.ROW_TYPE    = "I";  // 사은품 저장구분
                DS_GIFT.SEND_DATE   = getDateFormat().replace(/[^0-9]/gi, ""); // 발송일자 초기화
            }

            // 사은품정보 세팅
            // DS_GIFT.GIFT_DATE       // 사은품접수일자    
            // DS_GIFT.GIFT_NO         // 사은품접수번호
            // DS_GIFT.GIFT_SEQ        // 사은품접수순번    
            // DS_GIFT.DTL_MK          // 내역구분
            // DS_GIFT.CUST_ID         // 고객번호
            $("#selectbox5").val(DS_GIFT.GIFT_TYPE_CDE);                     // 사은품분류코드  (내역1) 
            // DS_GIFT.GIFT_CDE        // 사은품코드     (내역2)
            // DS_GIFT.GIFT_PRICE      // 사은품가격    
            calendarUtil.setImaskValue("calendar1", DS_GIFT.SEND_DATE);      // 발송일자    
            // DS_GIFT.GIFT_CHNL_MK    // 전달경로구분        
            $("#textbox31").val(DS_GIFT.PASS_USER);                          // 전달자    
            // DS_GIFT.CTI_CHGDATE     // CTI변경일자                        
            $("#textbox32").val(DS_GIFT.INVOICENUM);                         // 배송송장번호    

            onChangeGiftType(DS_GIFT.GIFT_CDE, DS_GIFT.GIFT_PRICE);          // 사은품코드와 가격 세팅
            onChangeGiftChnl(DS_GIFT.GIFT_CHNL_MK);                          // 전달경로구분 세팅

            return resolve(DS_GIFT);
            
        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 1차 해피콜 내역 조회
 * - as-is : cns2700.onSearch()
 */
const getHappy1 = () => new Promise((resolve, reject) => {

	const settings = {
		url: `${API_SERVER}/cns.getHappy1.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE   : sCSEL_DATE,   // 상담일자
                CSEL_NO     : sCSEL_NO,     // 상담번호
            }],
		}),
		errMsg: "1차 해피콜 내역 조회중 오류가 발생하였습니다.",
	}

	$.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));

            // 검색결과가 있는경우.
            if (res.dsRecv?.length > 0) {
                DS_HPCALL1 = res.dsRecv[0];
                DS_HPCALL1.ROW_TYPE = "U";

            // 검색결과가 없는경우.
            } else {
                DS_HPCALL1 = new Object();
                DS_HPCALL1.ROW_TYPE     = "I";  // 1차해피콜 저장구분
                DS_HPCALL1.HPCALL_DATE  = getDateFormat().replace(/[^0-9]/gi, "");   // 해피콜일자 초기화
                DS_HPCALL1.HPCALL_TIME  = getTimeFormat().replace(/[^0-9]/gi, "");   // 해피콜시간 초기화
                DS_HPCALL1.HPCALL_NAME  = currentUser.name;  // 해피콜담당자명 초기화
            }

            // 1차해피콜 세팅
            // DS_HPCALL1.CSEL_DATE        // 상담일자       
            // DS_HPCALL1.CSEL_NO          // 상담번호   
            calendarUtil.setImaskValue("calendar3", DS_HPCALL1.HPCALL_DATE); // 해피콜일자       
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
            $("#textbox25").val(DS_HPCALL1.HPCALL_NAME);        // 해피콜담당자명

            return resolve(DS_HPCALL1);

        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 2차 해피콜 내역 조회
 * - as-is : cns2700.onSearch()
 */
const getHappy2 = () => new Promise((resolve, reject) => {

	const settings = {
		url: `${API_SERVER}/cns.getHappy2.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE   : sCSEL_DATE,   // 상담일자
                CSEL_NO     : sCSEL_NO,     // 상담번호 
            }],
		}),
		errMsg: "2차 해피콜 내역 조회중 오류가 발생하였습니다.",
	}

	$.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));

            // 검색결과가 있는경우.
            if (res.dsRecv?.length > 0) {
                DS_HPCALL2 = res.dsRecv[0];
                DS_HPCALL2.ROW_TYPE = "U";
            
            // 검색결과가 없는경우.
            } else {
                DS_HPCALL2 = new Object();
                DS_HPCALL2.ROW_TYPE = "I";  // 2차해피콜 저장구분
                // 검색결과가 없고, 1차해피콜이 있을때
                if (DS_HPCALL1.ROW_TYPE == "U") {
                    DS_HPCALL2.HPCALL_DATE = getDateFormat().replace(/[^0-9]/gi, "");       // 해피콜일자 초기화
                    DS_HPCALL2.HPCALL_TIME = getTimeFormat().replace(/[^0-9]/gi, "");       // 해피콜시간 초기화
                    DS_HPCALL2.HPCALL_NAME = currentUser.name;      // 해피콜담당자명 초기화
                }
            }

            // 2차해피콜 세팅
            // DS_HPCALL2.CSEL_DATE          // 상담일자
            // DS_HPCALL2.CSEL_NO            // 상담번호
            calendarUtil.setImaskValue("calendar4", DS_HPCALL2.HPCALL_DATE);    // 해피콜일자    
            $("#timebox3").val(DS_HPCALL2.HPCALL_TIME);                         // 해피콜시간    
            $("#textbox28").val(DS_HPCALL2.HPCALL_TITLE);                       // 해피콜제목    
            $("#textbox36").val(DS_HPCALL2.HPCALL_CNTS);                        // 해피콜내용    
            $("#selectbox4").val(DS_HPCALL2.HPCALL_CHNL_MK);                    // 해피콜경로구분    
            // DS_HPCALL2.HPCALL_USER_ID     // 해피콜담당자ID                  
            $("#selectbox3").val(DS_HPCALL2.SATIS_CDE);                         // 고객만족도코드
            // DS_HPCALL2.CTI_CHGDATE        // CTI변경일자                   
            $("#textbox27").val(DS_HPCALL2.HPCALL_NAME);                        // 해피콜담당자명        

            return resolve(DS_HPCALL2);

        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 형제회원 지점 확인 조회 
 * - as-is : cns2700.onSearch()
 */
const getChkDeptInfo = () => new Promise((resolve, reject) => {

	const settings = {
		url: `${API_SERVER}/cns.getChkDeptInfo.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE : sCSEL_DATE, // 상담일자      
                CSEL_NO   : sCSEL_NO,   // 상담번호  
                PROC_MK   : sPROC_MK,   // 처리구분  
            }],
		}),
		errMsg: "형제회원 지점 확인 조회중 오류가 발생하였습니다.",
	}

	$.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));
            DS_TRANS_DEPT = res.dsRecv;
            return resolve(DS_TRANS_DEPT);
        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

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
        // $("#calendar2").prop("disabled", false);
        // $("#timebox1").prop("readonly", false);
        // $("#textbox18").prop("readonly", false);
        $("#textbox19").prop("readonly", false);
        $("#textbox34").prop("readonly", false);
    } else {
        // $("#calendar2").prop("disabled", true);
        // $("#timebox1").prop("readonly", true);
        // $("#textbox18").prop("readonly", true);
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
        $("#textbox26").prop("readonly", false);
        $("#textbox35").prop("readonly", false);
        $("#selectbox1").prop("disabled", false);
        $("#selectbox2").prop("disabled", false);

        // 권한이 관리자이고, 2차해피콜이 저장되지 않은 경우 1차해피콜삭제 버튼 활성화
		const currentUserLvl = currentUser?.user_fields?.user_lvl_mk;
        const isAdmin = (currentUserLvl == "user_lvl_mk_1" || currentUserLvl == "user_lvl_mk_2" || currentUserLvl == "user_lvl_mk_3") ? true : false;
        if (isAdmin && DS_HPCALL2.ROW_TYPE == "I") {
            $("#button9").prop("disabled", false);
        } else {
            $("#button9").prop("disabled", true);
        }

    } else {
        $("#calendar3").prop("disabled", true);
        $("#timebox2").prop("readonly", true);
        $("#textbox25").prop("readonly", true);
        $("#textbox26").prop("readonly", true);
        $("#textbox35").prop("readonly", true);
        $("#selectbox1").prop("disabled", true);
        $("#selectbox2").prop("disabled", true);
        $("#button9").prop("disabled", true);
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
        arrInData[10]= "cns2700";                   // url정보
        arrInData[11]= "";                          // 이력구분
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
        arrInData[10]= "cns2700";                   // url정보
        arrInData[11]= "D";                         // 이력구분
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
        arrInData[10]= "cns2700";                   // url정보	    	
        arrInData[11]= "L";                         // 이력구분
    }

    PopupUtil.open("CCEMPRO046", 980, 600, "", arrInData);
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
        TRANS_HIST   :  "", // 이력구분((L :러닝센터, D 지점)         
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
        DS_SMSDATA.TRANS_HIST   = "D";
    }
    // 센터장 SMS 발송
    else {
        DS_SMSDATA.RECVNAME     = $("#textbox12").val();
        DS_SMSDATA.MSG          = "센터장님(센터)의 고객의견이 접수되어 신속한 상담 부탁 드립니다.-대교 상담실-";;
        DS_SMSDATA.CUST_ID      = DS_COUNSEL.LC_REP_EMPID;// 지점장 사번
        DS_SMSDATA.MBR_ID       = DS_COUNSEL.LC_REP_EMPID;// 지점장 사번
        DS_SMSDATA.TRANS_HIST   = "L";
    }

    return {
        MSG_TYPE    : "0",                  // 메시지 타입(0:SMS,5:LMS)      
        DEST_PHONE  : tel.join(""),         // 수신번호      
        DEST_NAME   : DS_SMSDATA.RECVNAME,  // 수신자      
        SEND_PHONE  : SEND_PHONE,           // 발신번호      
        MSG_BODY    : DS_SMSDATA.MSG,       // 전송내용      
        STATUS      : "0",                  // 발송상태  (0:발송대기)  
        CUST_ID     : DS_SMSDATA.CUST_ID,   // 고객번호  
        MBR_ID      : DS_SMSDATA.MBR_ID,    // 회원번호  
        CSEL_DATE   : DS_SMSDATA.CSEL_DATE, // 상담일자      
        CSEL_NO     : DS_SMSDATA.CSEL_NO,   // 상담번호  
        CSEL_SEQ    : DS_SMSDATA.CSEL_SEQ,  // 상담순번      
        EXTERNAL_ID : DS_SMSDATA.USER_ID,   // 상담자ID      
        SMS_TRGT_ID : "",                   // 대상구분(1:지점,2:학부모,3:교사)      
        SMS_FIX_ID  : "",                   // 구분코드(1:입회,2:시정처리,3:상담연계,4:계좌변경)   
        TRANS_HIST  : DS_SMSDATA.TRANS_HIST,// 이력구분((L :러닝센터, D 지점)
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
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
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
 * 1차해피콜삭제/완료/저장 버튼 클릭시
 * - as-is : cns2700.onSaveT()
 * @param {string} sBtnMk 
 */
const onSave = (sBtnMk) => {

    // 1차해피콜삭제 버튼을 클릭한 경우
    if (sBtnMk == "1D") {
        DS_HPCALL1.ROW_TYPE = "D";
        DS_HPCALL2.ROW_TYPE = "D";
    }

    // 1. 지점처리내역 
    if (DS_DEPT_PROC.ROW_TYPE == "I" || DS_DEPT_PROC.ROW_TYPE == "U") {
        if (!getDeptValidityCheck()) return;
    } else {
        DS_DEPT_PROC.ROW_TYPE = "N";
    }
    
    // 2. 1차 해피콜
    const orgHp1Stat = DS_HPCALL1.ROW_TYPE;
    if (DS_HPCALL1.ROW_TYPE == "I") {
        
        // 데이터의 조작이 있는 경우 
        if ($("#textbox26").val().length >= 1 ||        // 제목
            $("#textbox35").val().length >= 1 ||        // 내용
            $("#selectbox1").val().length >= 1 ||       // 상담원만족도
            $("#selectbox2").val().length >= 1) {       // 피드백경로
            if (!getHpCall1ValidityCheck()) return;
        
        // 데이터의 조작이 없는 경우
        } else {
            DS_HPCALL1.ROW_TYPE = "N";
        }

    } else if (DS_HPCALL1.ROW_TYPE == "U") {
        if (!getHpCall1ValidityCheck()) return;
    } else if (DS_HPCALL1.ROW_TYPE == "D") {

    } else {
        DS_HPCALL1.ROW_TYPE = "N";
    }

    // 3. 2차 해피콜
    if (DS_HPCALL2.ROW_TYPE == "I") {
        
        // 1차해피콜이 저장(신규)이 아닌 경우
        if (orgHp1Stat != "I") {
           
            // 데이터의 조작이 있는 경우
            if ($("#textbox28").val().length >= 1 ||
                $("#textbox36").val().length >= 1 ||
                $("#selectbox3").val().length >= 1 ||
                $("#selectbox4").val().length >= 1) {
                if (!getHpCall2ValidityCheck()) return;
            
            // 데이터의 조작이 없는 경우
            } else {
                DS_HPCALL2.ROW_TYPE = "N";
            }
        
        // 1차 해피콜이 저장(신규)인 경우
        } else {
            DS_HPCALL2.ROW_TYPE = "N";
        }

    } else if (DS_HPCALL2.ROW_TYPE == "U") {
        if (!getHpCall2ValidityCheck()) return;
    } else {
        DS_HPCALL2.ROW_TYPE = "N";
    }

    // 4. 사은품      
    if (DS_GIFT.ROW_TYPE == "I") {

        // 1차해피콜이 신규가 아니거나, 1차해피콜을  저장하는 경우
        if (orgHp1Stat != "I" || DS_HPCALL1.ROW_TYPE == "I") {
            
            // 데이터의 조작이 있는 경우
            if ($("#selectbox5").val().length >= 1 ||
                $("#selectbox6").val().length >= 1 ||
                // calendarUtil.getImaskValue("textbox30").length >= 1 ||
                $("#selectbox7").val().length >= 1 ||
                $("#textbox31").val().length >= 1 ||
                $("#textbox32").val().length >= 1) {
                if (!getGiftValidityCheck()) return;
            
            // 데이터의 조작이 없는 경우
            } else {
                DS_GIFT.ROW_TYPE = "N";
            }

        // 1차해피콜이 신규인 경우이고, 1차해피콜을 저장 하지 않을 경우
        } else {
            DS_GIFT.ROW_TYPE = "N";
        }

    } else if (DS_GIFT.ROW_TYPE == "U") {
        if (!getGiftValidityCheck()) return;
    } else {
        DS_GIFT.ROW_TYPE = "N";
    }
    
    if (DS_DEPT_PROC.ROW_TYPE != "N" || DS_HPCALL1.ROW_TYPE != "N" || DS_HPCALL2.ROW_TYPE != "N" || DS_GIFT.ROW_TYPE != "N" ||
        sBtnMk == "CO" || sBtnMk == "1D") {
        const condition = getSaveCondition(sBtnMk);
        if (!condition) return;
        saveCselResult(condition);
    }
}

/**
 * 유효성 확인 - 지점처리내역
 * - as-is : cns2700.getDeptValidityCheck()
 */
const getDeptValidityCheck = () => {
    // if(calendarUtil.getImaskValue("calendar2").length < 8){
    //     alert("접수일자를 정확히 입력하십시요.");
    //     $("#calendar2").focus();
    //     return false;            
    // }
    // if($("#timebox1").val().length < 6){
    //     alert("접수시간을 정확히 입력하십시요.");
    //     $("#timebox1").focus();
    //     return false;
    // }
    // if($("#textbox18").val().trim().length < 1){
    //     alert("접수자를 입력하십시요.");
    //     $("#textbox18").focus();
    //     return false;
    // }
    if($("#textbox19").val().trim().length < 1){
        alert("처리자를 입력하십시요.");
        $("#textbox19").focus();
        return false;
    }
    if(!checkByte($("#textbox19").val().trim(), 12)){
        alert("처리자는 12Byte를 초과할 수 없습니다.");
        $("#textbox19").focus();
        return false;
    }
    if($("#textbox34").val().trim().length < 1){
        alert("처리내용을 입력하십시요.");
        $("#textbox34").focus();
        return false;
    }
    if(!checkByte($("#textbox34").val().trim(), 4000)){
        alert("처리내용은 4000Byte를 초과할 수 없습니다.");
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
    if (!checkByte($("#textbox36").val().trim(), 4000)) {
        alert("해피콜내용은 4000Byte를 초과할 수 없습니다.");
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
    if (!checkByte($("#textbox35").val().trim(), 4000)) {
        alert("해피콜내용은 4000Byte를 초과할 수 없습니다.");
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
        // 지점처리 정보
        DS_TRANS: {
            ROW_TYPE         : DS_DEPT_PROC.ROW_TYPE,                   // 저장구분(I/U/D)
            CSEL_DATE        : DS_COUNSEL.CSEL_DATE,                    // 상담일자
            CSEL_NO          : DS_COUNSEL.CSEL_NO,                      // 상담번호
            CSEL_SEQ         : [String(DS_COUNSEL.CSEL_SEQ)],           // 상담순번
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
            DEPT_ACP_NAME   : $("#textbox18").val().trim(),             // 지점접수자 
            DEPT_ACP_DATE   : calendarUtil.getImaskValue("calendar2"),  // 지점점수일자
            DEPT_ACP_TIME   : $("#timebox1").val(),                     // 지점접수시간 
            TRANS_LC_ID     : DS_DEPT_PROC.TRANS_LC_ID,                 // 연계센터코드    
            USER_ID         : currentUser.external_id,                  // 사용자ID
        },
        // 해피콜1차 정보 
        DS_HPCALL1: {
            ROW_TYPE         : DS_HPCALL1.ROW_TYPE,                      // 저장구분(I/U/D)  
            CSEL_DATE        : DS_COUNSEL.CSEL_DATE,                     // 상담일자
            CSEL_NO          : DS_COUNSEL.CSEL_NO,                       // 상담번호
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
        // 해피콜2차 정보
        DS_HPCALL2: {
            ROW_TYPE         : DS_HPCALL2.ROW_TYPE,                      // 저장구분(I/U/D)
            CSEL_DATE        : DS_COUNSEL.CSEL_DATE,                     // 상담일자      
            CSEL_NO          : DS_COUNSEL.CSEL_NO,                       // 상담번호  
            HPCALL_DATE      : calendarUtil.getImaskValue("calendar4"),  // 해피콜일자      
            HPCALL_TIME      : $("#timebox3").val(),                     // 해피콜시간      
            HPCALL_TITLE     : $("#textbox28").val().trim(),             // 해피콜제목          
            HPCALL_CNTS      : $("#textbox36").val().trim(),             // 해피콜내용      
            HPCALL_CHNL_MK   : $("#selectbox4").val(),                   // 피드백경로          
            HPCALL_USER_ID   : currentUser.external_id,                  // 해피콜상담원ID          
            SATIS_CDE        : $("#selectbox3").val(),                   // 고객만족도      
        },
        // 사은품 정보
        DS_GIFT: {
            ROW_TYPE         : DS_GIFT.ROW_TYPE,                         // 저장구분(I/U/D)
            CSEL_DATE        : DS_COUNSEL.CSEL_DATE,                     // 상담일자       
            CSEL_NO          : DS_COUNSEL.CSEL_NO ,                      // 상담번호   
            GIFT_DATE        : DS_GIFT.GIFT_DATE || "",                  // 사은품일자       
            GIFT_NO          : DS_GIFT.GIFT_NO,                          // 사은품번호   
            GIFT_SEQ         : DS_GIFT.GIFT_SEQ,                         // 사은품순번       
            DTL_MK           : "1",                                      // 내역구분(사은품내역구분 '1'은 상담임.)  
            CUST_ID          : DS_COUNSEL.CUST_ID,                       // 고객번호   
            GIFT_TYPE_CDE    : $("#selectbox5").val(),                   // 사은품분류코드           
            GIFT_CDE         : $("#selectbox6").val(),                   // 사은품코드       
            GIFT_PRICE       : calendarUtil.getImaskValue("textbox30"),  // 사은품가격       
            SEND_DATE        : calendarUtil.getImaskValue("calendar1"),  // 발송일       
            GIFT_CHNL_MK     : $("#selectbox7").val(),                   // 전달경로구분
            PASS_USER        : $("#textbox31").val().trim(),             // 전달자       
            INVOICENUM       : $("#textbox32").val().trim(),             // 택배송장번호       
        },
        // 티켓 정보
        DS_TICKET: {
            ZEN_TICKET_ID           : DS_COUNSEL.ZEN_TICKET_ID,                     // 티켓ID
            GIFT_ROW_TYPE           : "",                                           // 사은품 저장구분(I/U/D)
            GIFT_CHNL_MKNM          : $("#selectbox7 option:selected").text(),      // 전달경로이름 
            GIFT_NAME               : $("#selectbox6 option:selected").text(),      // 사은품명
            GIFT_PRICE              : calendarUtil.getImaskValue("textbox30"),      // 사은품가격
            SEND_DATE               : calendarUtil.getImaskValue("calendar1"),      // 발송일
            PASS_USER               : $("#textbox31").val().trim(),                 // 전달자
            INVOICENUM              : $("#textbox32").val().trim(),                 // 택배송장번호
            IS_HAPY                 : "",                                           // 해피콜여부
            PROC_STS_MK             : "",                                           // 처리상태구분
            HPCALL1_ROW_TYPE        : "",                                           // 1차해피콜 저장구분(I/U/D)
            HPCALL2_ROW_TYPE        : "",                                           // 2차해피콜 저장구분(I/U/D)
            BTN_MK                  : sBtnMk,                                       // 버튼구분(CO: 완료, SA: 저장)
            TRANS_CHNL_MK           : "",                                           // 연계방법
            DEPT_ACP_DATE           : "",                                           // 접수일자
            DEPT_ACP_TIME           : "",                                           // 접수시간
            DEPT_ACP_DATE_TIME      : "",                                           // 접수일시(YYYY-MM-DD hh:mm:ss)
            DEPT_ACP_NAME           : "",                                           // 접수자명
            VOC_PROC_DATE           : DS_VOC_PROC.VOC_PROC_DATE,                    // 처리일자
            VOC_PROC_TIME           : DS_VOC_PROC.VOC_PROC_TIME,                    // 처리시간
            VOC_PROC_DATE_TIME      : "",                                           // 처리일시(YYYY-MM-DD hh:mm:ss)
            VOC_PROC_EMP_NM         : DS_VOC_PROC.VOC_PROC_EMP_NM,                  // 처리자명
            HPCALL1_DATE_TIME       : "",                                           // 1차해피콜일시(YYYY-MM-DD hh:mm:ss)
            HPCALL1_CNTS            : "",                                           // 1차해피콜 내용
            HPCALL1_CHNL_MK_NM      : $("#selectbox2 option:selected").text(),      // 1차해피콜 경로
            HPCALL1_USER_ID         : "",                                           // 1차해피콜 상담원명
            HPCALL1_SATIS_CDE_NM    : $("#selectbox1 option:selected").text(),      // 1차해피콜 상담원만족도
            HPCALL2_DATE_TIME       : "",                                           // 2차해피콜일시(YYYY-MM-DD hh:mm:ss)
            HPCALL2_CNTS            : "",                                           // 2차해피콜 내용
            HPCALL2_CHNL_MK_NM      : $("#selectbox4 option:selected").text(),      // 2차해피콜 경로
            HPCALL2_USER_ID         : "",                                           // 2차해피콜 상담원명
            HPCALL2_SATIS_CDE_NM    : $("#selectbox3 option:selected").text(),      // 2차해피콜 상담원만족도
            CHILD_TICKET_ID         : [],                                           // 티켓ID(같은 사업국은 동시 저장하기 위해)
        },
    }



    /**
     * 신규저장시 같은 사업국은 동시 저장하기위해 순번 세팅.
     */
    if (data.DS_TRANS.ROW_TYPE == "I") {
        
        let bSameDept = true; // 선택된 항목들 중에 다른 지점이 있는지 확인 하기 위한 변수 'true':모든지점이 같은 경우 'false':다른지점이 존재하는 경우
    
        DS_TRANS_DEPT?.forEach(el => {

            // 같은 사업국이면 순번 추가
            if (DS_COUNSEL.DEPT_NAME == el.DEPT_NAME) {
                
                // 중복체크
                el.CSEL_SEQ = String(el.CSEL_SEQ);
                if (!data.DS_TRANS.CSEL_SEQ.includes(el.CSEL_SEQ)) {
                    data.DS_TRANS.CSEL_SEQ.push(el.CSEL_SEQ);
                    data.DS_TICKET.CHILD_TICKET_ID.push(el.ZEN_TICKET_ID);
                }

            }

            // 다른 사업국이 존재했을때.
            if (DS_TRANS_DEPT[0].DEPT_NAME != el.DEPT_NAME) bSameDept = false;

        });
        
        if (bSameDept == false) {
            if (!confirm("다른 사업국이 존재합니다. 계속하시겠습니까?")) return false;
        }

    }



    /**
     * 처리상태 세팅
     */
    // 1차해피콜 삭제 버튼을 클릭한 경우
    if (sBtnMk == "1D") {
        data.DS_TRANS.PROC_STS_MK = "04"; // 지점처리완료 상태

    // 완료 버튼을 클릭한 경우
    } else if (sBtnMk == "CO") {
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

    // 저장 버튼을 클릭한 경우
    } else if (sBtnMk == "SA") {
        if (DS_COUNSEL.PROC_STS_MK == "03" || DS_COUNSEL.PROC_STS_MK == "01") { // 지점처리중인 경우                
            if (data.DS_HPCALL2.ROW_TYPE != "N") { // 2차해피콜인 경우                                                    
                data.DS_TRANS.PROC_STS_MK = "16"; // 2차해피콜완료
            } else if (data.DS_HPCALL1.ROW_TYPE != "N") { // 1차해피콜인 경우                                                   
                data.DS_TRANS.PROC_STS_MK = "15"; // 해피콜완료
            } else if (data.DS_TRANS.ROW_TYPE != "N") { // 지점처리인 경우                                               
                data.DS_TRANS.PROC_STS_MK = "04"; // 지점처리중
            } else {
                data.DS_TRANS.PROC_STS_MK = "03"; // 지점처리완료
            }
        } else if (DS_COUNSEL.PROC_STS_MK == "04") { // 지점처리완료인 경우
            if (data.DS_HPCALL2.ROW_TYPE != "N") { // 2차해피콜인 경우                                            
                data.DS_TRANS.PROC_STS_MK = "16"; // 2차해피콜완료
            } else if (data.DS_HPCALL1.ROW_TYPE != "N") { // 1차해피콜인 경우                                          
                data.DS_TRANS.PROC_STS_MK = "15"; // 해피콜완료
            } else {
                data.DS_TRANS.PROC_STS_MK = "04"; // 지점처리완료
            }
        } else if (DS_COUNSEL.PROC_STS_MK == "12") { // 2차결재인 경우
            data.DS_TRANS.PROC_STS_MK = "12"; // 2차결재
        } else if (DS_COUNSEL.PROC_STS_MK == "15") { // 해피콜완료인 경우
            if (data.DS_HPCALL2.ROW_TYPE != "N") { // 2차해피콜인 경우                                                
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

    // 해피콜여부에 체크가 되어 있지 않은 경우
    if ($("#checkbox4").is(":checked") == false) {
        data.DS_TRANS.PROC_STS_MK = "03"; // 지점처리중
    }



    /**
     * 접수자가 있고 접수일시가 없을때 현재시간으로 세팅
     */
	if (data.DS_TRANS.DEPT_ACP_NAME && !data.DS_TRANS.DEPT_ACP_DATE) {
		data.DS_TRANS.DEPT_ACP_DATE = getDateFormat().replace(/[^0-9]/gi, '');
		data.DS_TRANS.DEPT_ACP_TIME = getTimeFormat().replace(/[^0-9]/gi, '');
	}



    /**
     * 티켓정보 세팅
     */
    data.DS_TICKET.PROC_STS_MK = data.DS_TRANS.PROC_STS_MK;                 // 처리상태
    data.DS_TICKET.GIFT_ROW_TYPE = data.DS_GIFT.ROW_TYPE;                   // 사은품 저장구분
    data.DS_TICKET.HPCALL1_ROW_TYPE = data.DS_HPCALL1.ROW_TYPE;             // 1차해피콜 저장구분
    data.DS_TICKET.HPCALL2_ROW_TYPE = data.DS_HPCALL2.ROW_TYPE;             // 2차해피콜 저장구분
    data.DS_TICKET.TRANS_CHNL_MK = data.DS_TRANS.TRANS_CHNL_MK;             // 연계방법  
    data.DS_TICKET.HPCALL1_CNTS = data.DS_HPCALL1.HPCALL_CNTS;              // 1차해피콜 내용
    data.DS_TICKET.HPCALL1_USER_ID = data.DS_HPCALL1.HPCALL_USER_ID;        // 1차해피콜 상담원명
    data.DS_TICKET.HPCALL2_CNTS = data.DS_HPCALL2.HPCALL_CNTS;              // 1차해피콜 내용
    data.DS_TICKET.HPCALL2_USER_ID = data.DS_HPCALL2.HPCALL_USER_ID;        // 1차해피콜 상담원명
    data.DS_TICKET.DEPT_ACP_DATE = data.DS_TRANS.DEPT_ACP_DATE;             // 접수일자
    data.DS_TICKET.DEPT_ACP_TIME = data.DS_TRANS.DEPT_ACP_TIME;             // 접수시간
    data.DS_TICKET.DEPT_ACP_NAME = data.DS_TRANS.DEPT_ACP_NAME;             // 접수자명
    if (data.DS_TICKET.DEPT_ACP_DATE?.length == 8 && data.DS_TICKET.DEPT_ACP_TIME?.length == 6) {
        data.DS_TICKET.DEPT_ACP_DATE_TIME = `${FormatUtil.date(data.DS_TICKET.DEPT_ACP_DATE)} ${FormatUtil.time(data.DS_TICKET.DEPT_ACP_TIME)}`;
    }
    if (data.DS_TICKET.VOC_PROC_DATE?.length == 8 && data.DS_TICKET.VOC_PROC_TIME?.length == 6) {
        data.DS_TICKET.VOC_PROC_DATE_TIME = `${FormatUtil.date(data.DS_TICKET.VOC_PROC_DATE)} ${FormatUtil.time(data.DS_TICKET.VOC_PROC_TIME)}`;
    }
    if (data.DS_HPCALL1.HPCALL_DATE?.length == 8 && data.DS_HPCALL1.HPCALL_TIME?.length == 6) {
        data.DS_TICKET.HPCALL1_DATE_TIME = `${FormatUtil.date(data.DS_HPCALL1.HPCALL_DATE)} ${FormatUtil.time(data.DS_HPCALL1.HPCALL_TIME)}`;
    }
    if (data.DS_HPCALL2.HPCALL_DATE?.length == 8 && data.DS_HPCALL2.HPCALL_TIME?.length == 6) {
        data.DS_TICKET.HPCALL2_DATE_TIME = `${FormatUtil.date(data.DS_HPCALL2.HPCALL_DATE)} ${FormatUtil.time(data.DS_HPCALL2.HPCALL_TIME)}`;
    }

    return data;

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
			userid: currentUser?.external_id,
			menuname: "상담결과등록",
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
        
        // 저장성공시 
        onSearch(condition.DS_TICKET);     // 재조회 및 티켓업데이트
        refreshDisplay();                  // 오픈된 화면 재조회
        alert("저장 되었습니다.");

    });

}

/**
 * Zendesk 티켓 업데이트
 * @param {object} DS_TICKET 티켓정보
 */
const updateTicket = async (DS_TICKET) => {
    
    if (!DS_TICKET.ZEN_TICKET_ID) return;

    // 티켓필드 세팅
    const custom_fields = new Array();
    
    // 사은품정보 저장시 - 사은품관련 티켓필드 세팅
    if (DS_TICKET.GIFT_ROW_TYPE == "I" || DS_TICKET.GIFT_ROW_TYPE == "U") {
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["GIFT_NAME"],	     value: DS_TICKET.GIFT_NAME });                  // 사은품명  
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["GIFT_PRICE"],	     value: DS_TICKET.GIFT_PRICE });                 // 사은품 가격  
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["SEND_DATE"],		 value: FormatUtil.date(DS_TICKET.SEND_DATE) }); // 사은품 발송일자  
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["GIFT_CHNL_MKNM"],  value: DS_TICKET.GIFT_CHNL_MKNM });             // 사은품 발송경로  
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["PASS_USER"],	     value: DS_TICKET.PASS_USER });                  // 사은품 전달자명  
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["INVOICENUM"],	     value: DS_TICKET.INVOICENUM });                 // 사은품 송장번호  
    }

    // OB구분 티켓필드 세팅
    let OB_MK_VAL;
    if (DS_TICKET.IS_HAPY) OB_MK_VAL = "oblist_cde_110"; // 해피콜여부 체크시 1차해피콜
    if (DS_TICKET.HPCALL1_ROW_TYPE == "I" || DS_TICKET.HPCALL1_ROW_TYPE == "U") OB_MK_VAL = "oblist_cde_111"; // 1차해피콜 저장시 2차해피콜
    if (DS_TICKET.HPCALL2_ROW_TYPE == "I" || DS_TICKET.HPCALL2_ROW_TYPE == "U") OB_MK_VAL = ""; // 2차해피콜 저장시 빈값
    if (DS_TICKET.BTN_MK == "CO") OB_MK_VAL = "";   // 완료시 빈값
    if (typeof OB_MK_VAL == "string") {
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["OB_MK"], value: OB_MK_VAL });
    }

    // 1차해피콜 저장시 - 1차해피콜관련 티켓필드 세팅
    if (DS_TICKET.HPCALL1_ROW_TYPE == "I" || DS_TICKET.HPCALL1_ROW_TYPE == "U") {
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_DATE1_TIME1"],     value: DS_TICKET.HPCALL1_DATE_TIME });               // 1차 해피콜 일시
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CNTS1"],           value: DS_TICKET.HPCALL1_CNTS });                    // 1차 해피콜 내용
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CHNL_MKNM1"],      value: DS_TICKET.HPCALL1_CHNL_MK_NM });              // 1차 해피콜 경로
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_USER_IDNM1"],      value: currentUser.name });                          // 1차 해피콜 상담원명
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["SATIS_CDENM1"],           value: DS_TICKET.HPCALL1_SATIS_CDE_NM });            // 1차 해피콜 고객만족도
    
    // 1차해피콜 삭제시 - 1차해피콜관련 티켓필드 세팅
    } else if (DS_TICKET.HPCALL1_ROW_TYPE == "D") {
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_DATE1_TIME1"],     value: "" }); // 1차 해피콜 일시
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CNTS1"],           value: "" }); // 1차 해피콜 내용
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CHNL_MKNM1"],      value: "" }); // 1차 해피콜 경로
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_USER_IDNM1"],      value: "" }); // 1차 해피콜 상담원명
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["SATIS_CDENM1"],           value: "" }); // 1차 해피콜 고객만족도
    }

    // 2차해피콜 저장시 - 2차해피콜관련 티켓필드 세팅
    if (DS_TICKET.HPCALL2_ROW_TYPE == "I" || DS_TICKET.HPCALL2_ROW_TYPE == "U") {
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_DATE2_TIME2"],     value: DS_TICKET.HPCALL2_DATE_TIME });               // 2차 해피콜 일시
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CNTS2"],           value: DS_TICKET.HPCALL2_CNTS });                    // 2차 해피콜 내용
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CHNL_MKNM2"],      value: DS_TICKET.HPCALL2_CHNL_MK_NM });              // 2차 해피콜 경로
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_USER_IDNM2"],      value: currentUser.name });                          // 2차 해피콜 상담원명
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["SATIS_CDENM2"],           value: DS_TICKET.HPCALL2_SATIS_CDE_NM });            // 2차 해피콜 고객만족도
    }

    // 기타 티켓필드 세팅
    const PROC_STS_MK_VAL = `proc_sts_mk_${Number(DS_TICKET.PROC_STS_MK)}`;    
    const TRANS_CHNL_MK_VAL = `trans_chnl_mk_${Number(DS_TICKET.TRANS_CHNL_MK)}`;
    const PROC_CTI_CHGDATE_TIME_VAL = moment_diff(DS_TICKET.DEPT_ACP_DATE, DS_TICKET.DEPT_ACP_TIME, DS_TICKET.VOC_PROC_DATE, DS_TICKET.VOC_PROC_TIME);
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_STS_MK"],            value: PROC_STS_MK_VAL });                           // 처리상태
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["TRANS_CHNL_MK"],          value: TRANS_CHNL_MK_VAL });                         // 연계방법
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE_TIME"],  value: PROC_CTI_CHGDATE_TIME_VAL });                 // 사업국처리시간
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_EMP_IDNM"],          value: DS_TICKET.VOC_PROC_EMP_NM });                 // 처리자명
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE"],       value: DS_TICKET.VOC_PROC_DATE_TIME });              // 처리일시  
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["DEPT_ACP_DATE_TIME"],     value: DS_TICKET.DEPT_ACP_DATE_TIME });              // 접수일시
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["DEPT_ACP_NAME"],          value: DS_TICKET.DEPT_ACP_NAME });                   // 접수자명
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["IS_HPCALL"],              value: DS_TICKET.IS_HAPY });                         // 해피콜 여부
    
    // 현재 순번의 티켓 업데이트
    await topbarClient.request({
        url: `/api/v2/tickets/${DS_TICKET.ZEN_TICKET_ID}`,
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify({ ticket: { custom_fields } }),
    });

    // 같은 사업국 순번의 티켓 업데이트
    if (DS_TICKET.CHILD_TICKET_ID.length > 0) {
        
        // 티켓필드 세팅
        const child_custom_fields = new Array();
        child_custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_STS_MK"],            value: PROC_STS_MK_VAL });                           // 처리상태
        child_custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE_TIME"],  value: PROC_CTI_CHGDATE_TIME_VAL });                 // 사업국처리시간
        child_custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["DEPT_ACP_DATE_TIME"],     value: DS_TICKET.DEPT_ACP_DATE_TIME });              // 접수일시
        child_custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["DEPT_ACP_NAME"],          value: DS_TICKET.DEPT_ACP_NAME });                   // 접수자명
        child_custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["IS_HPCALL"],              value: DS_TICKET.IS_HAPY });                         // 해피콜 여부
        child_custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["TRANS_CHNL_MK"],          value: TRANS_CHNL_MK_VAL });                         // 연계방법
        if (typeof OB_MK_VAL == "string") {
            child_custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["OB_MK"], value: OB_MK_VAL }); // OB구분
        }

        // 티켓 업데이트
        for (const ticket_id of DS_TICKET.CHILD_TICKET_ID) {
            await topbarClient.request({
                url: `/api/v2/tickets/${ticket_id}`,
                method: 'PUT',
                contentType: "application/json",
                data: JSON.stringify({ ticket: { custom_fields: child_custom_fields } }),
            });
        }

    }

}

/**
 * 오픈된 화면 재조회
 */
const refreshDisplay = async () => {
    if (opener?.name == "CCEMPRO022") opener.onSearch();                    // 상담등록화면 재조회
    if (opener?.name == "CCEMPRO035") opener.onSearch(true);                // 상담조회화면 재조회
	if (opener?.opener?.name == "CCEMPRO035") opener.opener.onSearch(true);	// 상담조회화면 재조회
    topbarObject?.refreshGrid();                                            // 탑바화면 재조회
}

/**
 * 시간차이 계산
 * @param {string} fromDay  시작일시
 * @param {string} fromTime 시작일시
 * @param {string} toDay    종료일시
 * @param {string} toTime   종료일시
 */
const moment_diff = (fromDay, fromTime, toDay, toTime) => {
    const t1 = moment(`${fromDay} ${fromTime}`, 'YYYYMMDD hhmmss');
    const t2 = moment(`${toDay} ${toTime}`, 'YYYYMMDD hhmmss');
    const diff = moment.duration(t2.diff(t1));

    if (diff.days() >= 0 && diff.hours() >= 0 && diff.minutes() >= 0 && diff.seconds() >= 0) {
        return `${diff.days()}일${diff.hours()}시간${diff.minutes()}분${diff.seconds()}초`;
    } else {
        return "0일0시간0분0초";
    }

}

/**
 * 전화걸기
 * - as-is : cns2700.onMakeCall()
 */
const onMakeCall = (elm, iIdx) => {

    const status = $(elm).hasClass("callOn") ? "callOn" : "callOff";
    let targetPhone = "";

    if (iIdx == "1") {
        targetPhone = $("#textbox2").val().trim().replace(/-/gi, ''); // 전화번호
    } else if (iIdx == "2") {
        targetPhone = $("#textbox5").val().trim().replace(/-/gi, ''); // 회원HP
    } else {
        targetPhone = $("#textbox7").val().trim().replace(/-/gi, ''); // 회원모HP
    }

    if (status == "callOn" && targetPhone.length < 4) {
        alert("전화걸기를 할 수 없습니다.\n\n전화번호가 유효하지 않습니다.");
        return;
    }

    topbarObject.wiseNTalkUtil.callStart(status, targetPhone, "CCEMPRO030", DS_COUNSEL.ZEN_TICKET_ID, "1");

}

/**
 * 상담 통화시간 저장
 */
 const onSaveCallTime = async () => {

    // 현재 상담건의 순번이 1번일 경우 상담 통화시간 저장
	if (DS_COUNSEL.CSEL_SEQ == "1") {

        const ticket_id = DS_COUNSEL.ZEN_TICKET_ID;
        if (!ticket_id) return;
    
        const data = await getCallTimeCondition(topbarClient, ticket_id);
        
        topbarObject.saveCallTime({
            userid			: currentUser?.external_id,
            menuname		: "상담결과등록",
            CSEL_NO			: DS_COUNSEL.CSEL_NO, 	 // 상담번호	
            CSEL_DATE		: DS_COUNSEL.CSEL_DATE,  // 상담일자		
            CALL_STTIME		: data.CALL_STTIME, 	 // 통화시작시간(시분초:172951)
            CALL_EDTIME		: data.CALL_EDTIME, 	 // 통화종료시간(시분초:173428)
            RECORD_ID		: data.RECORD_ID, 		 // 녹취키(리스트) 없는 경우 []
        });

    }

}

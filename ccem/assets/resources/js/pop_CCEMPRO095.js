var topbarObject;			// topbar window
let topbarClient;			// topbar client
let sidebarClient;          // sidebar client
let currentUser;            // 현재 사용중인 유저의 정보(ZENDESK)

let giftList = [];      // 사은품내역2 코드

let DS_CSEL_PROC = {};  // 상담내역

let sCselDate = "";
let sCselNo   = "";
let sCselSeq  = "";
let sCustId   = "";
let sCustMk   = "";

$(function () {

    // 창이 닫힐때 발생하는 event
    $(window).on('beforeunload', () => {
        PopupUtil.closeAll();   // 오픈된 모든 자식창 close
        onSaveCallTime();       // 상담 통화시간 저장
    });

    // create calendar
    calendarUtil.init("calendar5");
    calendarUtil.init("calendar1");
    calendarUtil.init("calendar2");
    calendarUtil.init("calendar3");
    calendarUtil.init("calendar4", { drops: "up", opens: "left"})

    // input mask
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
    calendarUtil.currency("textbox28");

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
		sCselDate 	      = counselGrid.getValue(rowKey, "CSEL_DATE");	// 상담일자
		sCselNo  		  = counselGrid.getValue(rowKey, "CSEL_NO");	// 상담번호
        sCselSeq 		  = counselGrid.getValue(rowKey, "CSEL_SEQ");	// 상담순번
        sCustId           = counselGrid.getValue(rowKey, "CUST_ID");    // 고객번호
        sCustMk           = counselGrid.getValue(rowKey, "CUST_MK")     // 고객구분

        await setCodeData(topbarObject.codeData);
        onSearch();

    // 상담등록화면에서 팝업되었을때,
    } else if (opener_name.includes("CCEMPRO022")) {
        topbarObject  = opener.topbarObject;
        topbarClient  = topbarObject.client;
        sidebarClient = topbarObject.sidebarClient;
        currentUser   = topbarObject.currentUserInfo.user;

        sCselDate   = opener.calendarUtil.getImaskValue("textbox27");   // 상담일자
        sCselNo     = $("#textbox28", opener.document).val();           // 상담번호
        sCselSeq    = $("#selectbox14", opener.document).val();         // 상담순번
        sCustId     = $("#hiddenbox6", opener.document).val();          // 고객번호
        sCustMk     = $("#hiddenbox2", opener.document).val();          // 고객구분

        await setCodeData(topbarObject.codeData);
        onSearch();
    }
    
	// 전화아이콘 상태를 컨트롤 하기위해
	topbarObject?.wiseNTalkUtil.saveWindowObj(window);

}

/**
 * 콤보박스 세팅
 * - as-is : cns6000.setCMBData()
 * @param {object} data codeData
 */
const setCodeData = async (data) => {
    
    const CODE_MK_LIST = [
        "SATIS_CDE",        // 고객만족도
        "HPCALL_CHNL_MK",   // 피드백경로    
        "GIFT_TYPE_CDE",    // 사은품분류코드    
        "GIFT_CHNL_MK",     // 발송경로
	];
    
	// get code
	const codeList = data.filter(el => CODE_MK_LIST.includes(el.CODE_MK));
    giftList = await getGiftList();

	// create select options
	for (const code of codeList) {
		$(`select[name='${code.CODE_MK}']`).append(new Option(code.CODE_NAME, code.CODE_ID));
    }
    giftList.forEach(el =>  $("#selectbox4").append(new Option(el.GIFT_NAME, el.GIFT_CDE)));
    
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
			menuname: "상담결과등록-상담원처리",
            senddataids: ["dsSend"],
            recvdataids: ["dsRecv"],
            dsSend: [{}],
        }),
        errMsg: "사은품내역 코드 조회중 오류가 발생하였습니다.",
    }
    $.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));
            return resolve(res.dsRecv);
        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 사은품내역1 change event
 * - as-is : cns6000.CMB_GIFT_TYPE_CDE.OnSelChange()
 * @param {string} GIFT_CDE 사은품코드
 * @param {string} GIFT_PRICE 사은품가격
 */
const onChangeGiftType = (GIFT_CDE, GIFT_PRICE) => {
    // 내역2 초기화
    const value = $("#selectbox3").val();
    if (!value) $("#selectbox4").prop("disabled", true);
    else $("#selectbox4").prop("disabled", false);
    $("#selectbox4").empty().append(new Option("", ""));
    const newGifList = giftList.filter(el => el.GIFT_TYPE_CDE == value);
    newGifList.forEach(el => $("#selectbox4").append(new Option(el.GIFT_NAME, el.GIFT_CDE)));
    $("#selectbox4").val(GIFT_CDE);
    // 가격 초기화
    GIFT_PRICE = GIFT_PRICE ? String(GIFT_PRICE) : "0";
    calendarUtil.setImaskValue("textbox28", GIFT_PRICE);
}

/**
 * 사은품내역2 change event
 * - as-is : cns6000.CMB_TB_GIFTCODE.OnSelChange()
 * @param {string} value 사은품코드
 */
const onChangeGift = (value) => {
    const gif = giftList.find(el => el.GIFT_CDE == value);
    const price = gif ? String(gif.GIFT_PRICE) : "0";
    calendarUtil.setImaskValue("textbox28", price);
}

/**
 * 발송경로 change event
 * @param {string} value 발송경로
 */
const onChangeGiftChnl = (value) => {

    // 발송경로 세팅
    $("#selectbox5").val(value);

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
 * 조회
 */
 const onSearch = async (DS_TICKET) => {

    await getCselProc();

    // 저장후 재조회시 티켓업데이트
    if (DS_TICKET) {

        const HPCALL_DATE = calendarUtil.getImaskValue("calendar3");
        const HPCALL_TIME = $("#timebox1").val();

        // 해피콜 일시(yyyy-mm-dd hh:mm:dd)
        if (HPCALL_DATE.length == 8 && HPCALL_TIME.length == 6) {
            DS_TICKET.HPCALL_DATE_TIME = `${FormatUtil.date(HPCALL_DATE)} ${FormatUtil.time(HPCALL_TIME)}`;
        }

        DS_TICKET.HPCALL_CNTS           = $("#textbox27").val().trim();              // 해피콜 내용
        DS_TICKET.HPCALL_CHNL_MK_NM     = $("#selectbox2 option:selected").text();   // 해피콜 경로    
        DS_TICKET.HPCALL_USER_NM        = $("#textbox25").val();                     // 해피콜 상담원명    
        DS_TICKET.HPCALL_SATIS_CDE_NM   = $("#selectbox1 option:selected").text();   // 해피콜 고객만족도     
        DS_TICKET.IS_HAPY               = $("#checkbox1").is(":checked");            // 해피콜여부   

        updateTicket(DS_TICKET);                                 

    }

}

/**
 * 상담내역 조회
 * - as-is : cns6000.onSearch()
 */
const getCselProc = () => new Promise((resolve, reject) => {

    const settings = {
		url: `${API_SERVER}/cns.getCselProc.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담결과등록-상담원처리",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{ 
                CSEL_DATE:  sCselDate, // 상담일자 
                CSEL_NO:    sCselNo  , // 상담번호 
                CSEL_SEQ:   sCselSeq , // 상담순번 
                CUST_ID:    sCustId  , // 고객번호 
                CUST_MK:    sCustMk  , // 고객구분
            }],
		}),
		errMsg: "상담내역 조회중 오류가 발생하였습니다.",
	}

	$.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));

            // 상담내역 세팅
            DS_CSEL_PROC = (res.dsRecv?.length > 0) ? res.dsRecv[0] : new Object();

            calendarUtil.setImaskValue("calendar5", DS_CSEL_PROC.CSEL_DATE);        // MSK_CSEL_DATE          // 상담일자        
            $("#textbox1").val(DS_CSEL_PROC.CSEL_NO);                               // txtCSEL_NO            // 상담번호        
            $("#textbox2").val(DS_CSEL_PROC.CSEL_SEQ);                              // txtCSEL_SEQ           // 상담순번        
            calendarUtil.setImaskValue("calendar1", DS_CSEL_PROC.PROC_HOPE_DATE);   // MSK_PROC_HOPE_DATE     // 처리희망일자            
            // DS_CSEL_PROC.DEPT_ID            // 지점번호        
            // DS_CSEL_PROC.CUST_ID            // 고객번호        
            // DS_CSEL_PROC.DIV_CDE            // 지점(본부)코드        
            $("#textbox22").val(DS_CSEL_PROC.CSEL_CNTS);                            // txaCSEL_CNTS          // 상담내용        
            // DS_CSEL_PROC.CSEL_LTYPE_CDE     // 상담대분류코드             
            // DS_CSEL_PROC.CSEL_MTYPE_CDE     // 상담중분류코드            
            // DS_CSEL_PROC.CSEL_STYPE_CDE     // 상담소분류코드            
            // DS_CSEL_PROC.PROC_STS_MK        // 처리상태구분            
            calendarUtil.setImaskValue("calendar2", DS_CSEL_PROC.PROC_DATE);       // MSK_PROC_DATE          // 처리일자 
            // DS_CSEL_PROC.PROC_USER_ID       // 처리자ID            
            $("#textbox24").val(DS_CSEL_PROC.PROC_CNTS);                            // txaPROC_CNTS          // 처리내용        
            calendarUtil.setImaskValue("calendar3", DS_CSEL_PROC.HPCALL_DATE);     // MSK_HPCALL_DATE        // 해피콜일자       
            $("#timebox1").val(DS_CSEL_PROC.HPCALL_TIME);                           // MSK_HPCALL_TIME        // 해피콜시간            
            $("#textbox26").val(DS_CSEL_PROC.HPCALL_TITLE);                         // txtHPCALL_TITLE       // 해피콜제목            
            $("#textbox27").val(DS_CSEL_PROC.HPCALL_CNTS);                          // txaHPCALL_CNTS        // 해피콜내용            
            $("#selectbox2").val(DS_CSEL_PROC.HPCALL_CHNL_MK);                      // CMB_HPCALL_CHNL_MK     // 해피콜경로구분            
            // DS_CSEL_PROC.HPCALL_USER_ID     // 해피콜상담원ID                       
            $("#selectbox1").val(DS_CSEL_PROC.SATIS_CDE);                           // CMB_SATIS_CDE          // 고객만족도코드        
            // DS_CSEL_PROC.SATIS_CDE1         // 고객만족도코드1        
            // DS_CSEL_PROC.SATIS_CDE2         // 고객만족도코드2        
            // DS_CSEL_PROC.GIFT_DATE          // 사은품접수일자        
            // DS_CSEL_PROC.GIFT_NO            // 사은품접수번호        
            // DS_CSEL_PROC.GIFT_SEQ           // 사은품접수순번        
            // DS_CSEL_PROC.DTL_MK             // 내역구분    
            $("#selectbox3").val(DS_CSEL_PROC.GIFT_TYPE_CDE);                       // CMB_GIFT_TYPE_CDE      // 사은품분류코드            
            $("#selectbox4").val(DS_CSEL_PROC.GIFT_CDE);                            // CMB_TB_GIFTCODE           // 사은품코드        
            calendarUtil.setImaskValue("textbox28", DS_CSEL_PROC.GIFT_PRICE);       // txtGIFT_PRICE         // 사은품가격        
            calendarUtil.setImaskValue("calendar4", DS_CSEL_PROC.SEND_DATE);        // MSK_SEND_DATE          // 발송일자  
            // DS_CSEL_PROC.GIFT_CHNL_MK                                            // CMB_GIFT_CHNL_MK       // 전달경로구분
            $("#textbox29").val(DS_CSEL_PROC.PASS_USER);                            // txtPASS_USER          // 전달자명        
            $("#textbox10").val(DS_CSEL_PROC.DEPT_ID_NM);                           // txtDEPT_ID_NM         // 지점명        
            $("#textbox8").val(DS_CSEL_PROC.DIV_CDE_NM);                            // txtDIV_CDE_NM         // 본부명        
            $("#textbox16").val(DS_CSEL_PROC.CSEL_LTYPE_CDE_NM);                    // txtCSEL_LTYPE_CDE_NM  // 상담대분류코드명                
            $("#textbox18").val(DS_CSEL_PROC.CSEL_MTYPE_CDE_NM);                    // txtCSEL_MTYPE_CDE_NM  // 상담중분류코드명                
            $("#textbox20").val(DS_CSEL_PROC.CSEL_STYPE_CDE_NM);                    // txtCSEL_STYPE_CDE_NM  // 상담소분류코드명                
            $("#textbox9").val(DS_CSEL_PROC.CSEL_CHNL_MK_NM);                       // txtCSEL_CHNL_MK_NM    // 채널구분명                
            $("#textbox11").val(DS_CSEL_PROC.USER_NM);                              // txtUSER_NM            // 사용자명        
            $("#textbox15").val(DS_CSEL_PROC.CSEL_LTYPE_CDE_D);                     // txtCSEL_LTYPE_CDE_D   // 상담대분류코드_D                
            $("#textbox17").val(DS_CSEL_PROC.CSEL_MTYPE_CDE_D);                     // txtCSEL_MTYPE_CDE_D   // 상담대분류코드_D                
            $("#textbox19").val(DS_CSEL_PROC.CSEL_STYPE_CDE_D);                     // txtCSEL_STYPE_CDE_D   // 상담대분류코드_D                
            $("#textbox23").val(DS_CSEL_PROC.PROC_USER_NM);                         // txtPROC_USER_NM       // 처리사용자명            
            $("#textbox25").val(DS_CSEL_PROC.HPCALL_USER_NM);                       // txtHPCALL_USER_NM     // 해피콜처리자명            
            $("#textbox13").val(DS_CSEL_PROC.TCHR_NM);                              // txtTCHR_NM            // 담당교사명        
            $("#textbox21").val(DS_CSEL_PROC.CSEL_TITLE);                           // txtCSEL_TITLE         // 상담제목        
            $("#textbox3").val(DS_CSEL_PROC.NAME);                                  // txtNAME               // 고객명    
            $("#textbox5").val(DS_CSEL_PROC.MBR_ID);                                // txtMBR_ID             // 회원번호    
            $("#textbox4").val(DS_CSEL_PROC.TELPNO);                                // txtTELPNO             // 학습장소전화    
            $("#textbox6").val(DS_CSEL_PROC.MOBILNO);                               // txtMOBILNO            // 회원핸드폰        
            // DS_CSEL_PROC.MOBILNO_FAT        // 회원부핸드폰                       
            $("#textbox14").val(DS_CSEL_PROC.ADDR);                                 // txtADDR               // 학습장소주소    
            $("#textbox7").val(DS_CSEL_PROC.MOBILNO_MBR);                           // txtMOBILNO_MBR        // 회원모핸드폰            
            // DS_CSEL_PROC.CSEL_RST_MK1       // 상담결과                      
            // DS_CSEL_PROC.CSEL_USER_ID       // 상담등록자                        
            $("#textbox30").val(DS_CSEL_PROC.INVOICENUM);                           // txtInVoiceNum         // 택배송장번호        
            $("#textbox12").val(DS_CSEL_PROC.LC_ID_NM);                             // txtLC_ID_NM           // 센터명   
            // DS_CSEL_PROC.ZEN_TICKET_ID        // 티켓ID

            onChangeGiftChnl(DS_CSEL_PROC.GIFT_CHNL_MK);    // 발송경로 세팅         
            setActiveControl();                             // 활성 및 비활성 항목 처리
            
            // 저장구분 체크 - 해당정보가 있으면 수정(U), 없으면 신규(I)
            DS_CSEL_PROC.PROC_STAT   = DS_CSEL_PROC.PROC_DATE   ? "U" : "I";    // 처리내역
            DS_CSEL_PROC.HPCALL_STAT = DS_CSEL_PROC.HPCALL_DATE ? "U" : "I";    // 해피콜정보
            DS_CSEL_PROC.GIFT_STAT   = DS_CSEL_PROC.GIFT_DATE   ? "U" : "I";    // 사은품정보

            return resolve(DS_CSEL_PROC);

        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 항목 비활성 제어 함수
 * - as-is : cns6000.setActiveControl()
 */
const setActiveControl = async () => {

    const S_USER_ID = currentUser.external_id;
    const S_USER_NAME = currentUser.name;
    const S_USER_LVL_MK = currentUser.user_fields.user_lvl_mk;
    const isAdmin = (S_USER_LVL_MK == "user_lvl_mk_1" || S_USER_LVL_MK == "user_lvl_mk_2" || S_USER_LVL_MK == "user_lvl_mk_3") ? true : false;

    switch (DS_CSEL_PROC.PROC_STS_MK) {
        case "01": // 접수
        case "03": // 지점처리중
            $("#button1").prop("disabled", false);  // 완료버튼 활성화
            $("#button7").prop("disabled", true);   // 1차해피콜삭제 비활성화
            if (!$("#textbox23").val()) {
                $("#textbox23").val(S_USER_NAME);
                DS_CSEL_PROC.PROC_USER_ID = S_USER_ID;
            }
            if (!calendarUtil.getImaskValue("calendar2")) {
                calendarUtil.setImaskValue("calendar2", getDateFormat());
            }
            break;
        case "04": // 지점처리완료(i/b해피콜 대상)
        case "15": // 해피콜완료                
            $("#checkbox1").prop("checked", true);
        case "99": //완료
            $("#button1").prop("disabled", false);              // 완료버튼 활성화
            if (isAdmin) $("#button7").prop("disabled", false); // 관리자인 경우 1차해피콜삭제 활성화
            if (DS_CSEL_PROC.CSEL_RST_MK1 != "12") setDisableGift(); // 상담결과(dm접수-사은품:12)일때만 활성화한다.

            //지점처리자 설정-자신과 관리자만 수정 가능함.
            //상담결과_상담원처리 예외 권한 사용자번호[cb.getBasicCodeData("28")] - 2007.03.03 김미경과장 요청사항
            if (DS_CSEL_PROC.PROC_USER_ID == S_USER_ID || DS_CSEL_PROC.CSEL_USER_ID == S_USER_ID ||
                DS_CSEL_PROC.PROC_USER_ID == "" || S_USER_ID == "" || isAdmin == true) {

                //수정가능함.

            //다른사람일경우 비활성화
            } else {
                const exceptionUser = await getBasicList(28, "예외 권한 사용자번호 조회");
                if (exceptionUser == S_USER_ID) {
                    switch (DS_CSEL_PROC.CSEL_STYPE_CDE) {
                        case "1050201":
                        case "1050202":
                            break;
                        default:
                            setDisableProc();
                            break;
                    }

                } else {
                    setDisableProc();
                }
            }

            //해피콜 처리자 설정
            if (!$("#textbox25").val()) {
                $("#textbox25").val(S_USER_NAME);
                DS_CSEL_PROC.HPCALL_USER_ID = S_USER_ID;
                calendarUtil.setImaskValue("calendar3", getDateFormat());
                $("#timebox1").val(getTimeFormat());

            //자신과 관리자만 수정 가능함.
            } else if (DS_CSEL_PROC.HPCALL_USER_ID == S_USER_ID || isAdmin) {
                //수정가능함.

            //다른사람일 경우 비활성화
            } else {
                setDisableHpCall();
                setDisableGift();
            }
            break;
    }
    
}

/**
 * 사은품 비활성
 * - as-is : cns6000.setDisableGift()
 */
const setDisableGift = () => {
    $("#selectbox3").prop("disabled", true);    // 내역1
    $("#selectbox4").prop("disabled", true);    // 내역2
    $("#textbox28").prop("readonly", true);     // 가격
    $("#calendar4").prop("disabled", true);     // 발송일
    $("#selectbox5").prop("disabled", true);    // 발송경로
    $("#textbox29").prop("readonly", true);     // 전달자
    $("#textbox10").prop("readonly", true);     // 사업국
    $("#textbox30").prop("readonly", true);     // 송장번호
    $("#textbox12").prop("readonly", true);     // 센터
}

/**
 * 처리내역 비활성
 * - as-is : cns6000.setDisableProc()
 */
const setDisableProc = () => {
    $("#calendar2").prop("disabled", true);     // 처리일자
    $("#textbox24").prop("readonly", true);     // 처리내용
}

/**
 * 해피콜 내역 비활성
 * - as-is : cns6000.setDisableHpCall()
 */
const setDisableHpCall = () => {
    $("#calendar3").prop("disabled", true);     // 처리일시
    $("#timebox1").prop("readonly", true);      // 처리일시
    $("#textbox26").prop("readonly", true);     // 제목
    $("#textbox27").prop("readonly", true);     // 내용
    $("#selectbox2").prop("disabled", true);    // 피드백경로
    $("#selectbox1").prop("disabled", true);    // 고객만족도
}

/**
 * 1차해피콜삭제/완료/저장버튼 클릭시
 * - as-is : cns6000.onComplete(), onSave()
 * @param {string} sBtnMk 
 */
const onSave = (sBtnMk) => {

    // 1차해피콜삭제 버튼을 클릭한 경우 처리상태를 지점처리중(03)으로 설정
    if (sBtnMk == "1D") {
        DS_CSEL_PROC.PROC_STS_MK = "03";
        $("#checkbox1").prop("checked", false);
    
    // 완료 버튼을 클릭한 경우 처리상태를 완료(99)로 설정
    } else if (sBtnMk == "CO") {
        DS_CSEL_PROC.PROC_STS_MK = "99";
        $("#checkbox1").prop("checked", false);
    }
    
    // 해피콜 처리일시 체크
    if (!(calendarUtil.getImaskValue("calendar3").length == 0 || calendarUtil.getImaskValue("calendar3").length == 8)) {
        alert("해피콜처리일시가 정확하게 입력되지 않았습니다.");
        return;
    }				
    
    let isOk = "N";
    
    switch(DS_CSEL_PROC.PROC_STS_MK){
        case "01" :
        case "03" :
            if (onChkProc()) {
                isOk = "Y";
                DS_CSEL_PROC.PROC_STS_MK = "03";
            }
            break;
        case "04" :
            //해피콜여부 체크시는 해피콜내용 체크함.
            //해피콜여부 체크후에도 지점처리 수정 가능하게 작업
            if ($("#checkbox1").is(":checked")) {
                if (onChkProc()) {
                    isOk = "Y";
                    //해피콜 입력 검사
                    if (onChkHpCall()) {
                        DS_CSEL_PROC.PROC_STS_MK = "15";
                        $("#checkbox1").prop("checked", false);
                    }
                }
            } else {
                //해피콜여부 체크해제시는 다시 03으로 돌아감
                if (onChkProc()) {
                    isOk = "Y";
                    DS_CSEL_PROC.PROC_STS_MK = "03";
                }
            }
            break;
        case "15" :
        case "99" :
            if (onChkProc()) {
                isOk = "Y";
            }
        default   :
    }

    if( isOk == "Y" ){
        //해피콜대상 체크되어 있으면
        if ($("#checkbox1").is(":checked")) {
            if (DS_CSEL_PROC.PROC_STS_MK != "15" &&
                DS_CSEL_PROC.PROC_STS_MK != "99") {
                DS_CSEL_PROC.PROC_STS_MK = "04";
            }
        }

        //기념품접수일자가 ""이 이고,
        //기념품을 선택하였을때 현재일자를 설정한다.
        if(!DS_CSEL_PROC.GIFT_DATE && $("#selectbox4").val() != "" ){
            DS_CSEL_PROC.GIFT_DATE = getDateFormat().replace(/[^0-9]/gi, "");
        }

        const condition = getSaveCondition(sBtnMk);
        if (!condition) return;
        saveCselProc(condition);
    }

}

/**
 * 지점처리 조건 체크
 * - as-is : cns6000.onChkProc()
 */
const onChkProc = () => {
    if (!DS_CSEL_PROC.PROC_USER_ID) {
        alert("지점 처리 내용을 입력하세요.");
        return false;
    }
    if (!$("#textbox24").val().trim()) {
        alert("지점처리내용을 입력하세요.");
		$("#textbox24").focus();
        return false;
    }
    if (!checkByte($("#textbox24").val().trim(), 4000)) {
		alert("지점처리내용은 4000Byte를 초과할 수 없습니다.");
		$("#textbox24").focus();
		return false;
	}
    return true;
}

/**
 * 해피콜 조건 체크
 * - as-is : cns6000.onChkHpCall()
 */
const onChkHpCall = () => {
    //처리사용자가 존재하고,
    //처리내용,해피콜제목,해피콜내용이 존재하면,
    if (DS_CSEL_PROC.PROC_USER_ID &&
        $("#textbox24").val().trim().length > 0 &&
        $("#textbox26").val().trim().length > 0 &&
        $("#textbox27").val().trim().length > 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 저장 value check
 */
const getSaveCondition = (sBtnMk) => {
    const data = {
        DS_CHKDATA  : {
            CSEL_DATE       : DS_CSEL_PROC.CSEL_DATE,                   // 상담일자
            CSEL_NO         : DS_CSEL_PROC.CSEL_NO,                     // 상담번호
            CSEL_SEQ        : DS_CSEL_PROC.CSEL_SEQ,                    // 상담순번
            CUST_ID         : DS_CSEL_PROC.CUST_ID,                     // 고객번호
            GIFT_DATE       : DS_CSEL_PROC.GIFT_DATE,                   // 사은품접수일자
            GIFT_NO         : DS_CSEL_PROC.GIFT_NO,                     // 사은품접수번호
            PROC_STS_MK     : DS_CSEL_PROC.PROC_STS_MK,                 // 처리상태구분
        },
        DS_PROC     : {
            ROW_TYPE        : DS_CSEL_PROC.PROC_STAT,                   // 저장구분(I/U/D)
            CSEL_DATE       : DS_CSEL_PROC.CSEL_DATE,                   // 상담일자
            CSEL_NO         : DS_CSEL_PROC.CSEL_NO,                     // 상담번호
            CSEL_SEQ        : DS_CSEL_PROC.CSEL_SEQ,                    // 상담순번
            PROC_DATE       : calendarUtil.getImaskValue("calendar2"),  // 처리일자
            PROC_USER_ID    : DS_CSEL_PROC.PROC_USER_ID,                // 처리자ID
            PROC_CNTS       : $("#textbox24").val().trim(),             // 처리내용
            PROC_STS_MK     : DS_CSEL_PROC.PROC_STS_MK,                 // 처리상태구분
        },
        DS_HPCALL   : {
            ROW_TYPE        : DS_CSEL_PROC.HPCALL_STAT,                 // 저장구분(I/U/D)           
            CSEL_DATE       : DS_CSEL_PROC.CSEL_DATE,                   // 상담일자           
            CSEL_NO         : DS_CSEL_PROC.CSEL_NO,                     // 상담번호       
            HPCALL_DATE     : calendarUtil.getImaskValue("calendar3"),  // 해피콜일자           
            HPCALL_TIME     : $("#timebox1").val(),                     // 해피콜시간           
            HPCALL_TITLE    : $("#textbox26").val().trim(),             // 해피콜제목               
            HPCALL_CNTS     : $("#textbox27").val().trim(),             // 해피콜내용           
            HPCALL_CHNL_MK  : $("#selectbox2").val(),                   // 해피콜경로구분               
            HPCALL_USER_ID  : DS_CSEL_PROC.HPCALL_USER_ID,              // 해피콜상담원ID               
            SATIS_CDE       : $("#selectbox1").val(),                   // 고객만족도코드           
            SATIS_CDE1      : DS_CSEL_PROC.SATIS_CDE1,                  // 고객만족도코드1           
            SATIS_CDE2      : DS_CSEL_PROC.SATIS_CDE2,                  // 고객만족도코드2           
            GIFT_DATE       : DS_CSEL_PROC.GIFT_DATE,                   // 사은품접수일자           
            GIFT_NO         : DS_CSEL_PROC.GIFT_NO,                     // 사은품접수번호       
        },
        DS_GIFT     : {
            ROW_TYPE        : DS_CSEL_PROC.GIFT_STAT,                   // 저장구분(I/U/D)       
            CUST_ID         : DS_CSEL_PROC.CUST_ID,                     // 고객번호   
            GIFT_DATE       : DS_CSEL_PROC.GIFT_DATE,                   // 사은품접수일자       
            GIFT_NO         : DS_CSEL_PROC.GIFT_NO,                     // 사은품접수번호   
            GIFT_SEQ        : DS_CSEL_PROC.GIFT_SEQ,                    // 사은품접수순번       
            GIFT_TYPE_CDE   : $("#selectbox3").val(),                   // 사은품분류코드           
            GIFT_CDE        : $("#selectbox4").val(),                   // 사은품코드       
            GIFT_PRICE      : calendarUtil.getImaskValue("textbox28"),  // 사은품가격       
            SEND_DATE       : calendarUtil.getImaskValue("calendar4"),  // 발송일자       
            GIFT_CHNL_MK    : $("#selectbox5").val(),                   // 전달경로구분           
            PASS_USER       : $("#textbox29").val().trim(),             // 전달자명       
            INVOICENUM      : $("#textbox30").val().trim(),             // 택배송장번호       
        },
        DS_TICKET: {
            ZEN_TICKET_ID       : DS_CSEL_PROC.ZEN_TICKET_ID,                   // 티켓ID
            GIFT_ROW_TYPE       : DS_CSEL_PROC.GIFT_STAT,                       // 사은품 저장구분(I/U/D)
            GIFT_CHNL_MKNM      : $("#selectbox5 option:selected").text(),      // 전달경로이름 
            GIFT_NAME           : $("#selectbox4 option:selected").text(),      // 사은품명
            GIFT_PRICE          : calendarUtil.getImaskValue("textbox28"),      // 사은품가격       
            SEND_DATE           : calendarUtil.getImaskValue("calendar4"),      // 발송일자       
            PASS_USER           : $("#textbox29").val(),                        // 전달자명       
            INVOICENUM          : $("#textbox30").val(),                        // 택배송장번호       
            IS_HAPY             : "",                                           // 해피콜여부
            PROC_STS_MK         : DS_CSEL_PROC.PROC_STS_MK,                     // 처리상태구분
            HPCALL_ROW_TYPE     : DS_CSEL_PROC.HPCALL_STAT,                     // 해피콜 저장구분(I/U/D)
            BTN_MK              : sBtnMk,                                       // 버튼구분(CO: 완료, SA: 저장)
            PROC_DATE           : "",                                           // 처리일자(YYYY-MM-DD)
            PROC_USER_NM        : $("#textbox23").val(),                        // 처리자명
            PROC_CNTS           : $("#textbox24").val().trim(),                 // 처리내용
            HPCALL_CNTS         : "",                                           // 해피콜 내용
            HPCALL_DATE_TIME    : "",                                           // 해피콜일시(YYYY-MM-DD hh:mm:ss)
            HPCALL_CHNL_MK_NM   : "",                                           // 해피콜 경로
            HPCALL_SATIS_CDE_NM : "",                                           // 해피콜 고객만족도
            HPCALL_USER_NM      : "",                                           // 해피콜 상담원명
        },
    }

    // 티켓정보 세팅
    data.DS_TICKET.PROC_DATE = FormatUtil.date(data.DS_PROC.PROC_DATE);

    return data;

}

/**
 * 결과등록(상담원처리) 저장
 */
const saveCselProc = (condition) => {
    const settings = {
        url: `${API_SERVER}/cns.saveCselProc.do`,
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담결과등록-상담원처리",
            senddataids : ["DS_CHKDATA", "DS_PROC", "DS_HPCALL", "DS_GIFT"],
            recvdataids : ["dsRecv"],
            DS_CHKDATA  : [condition.DS_CHKDATA],
            DS_PROC     : [condition.DS_PROC],
            DS_HPCALL   : [condition.DS_HPCALL],
            DS_GIFT     : [condition.DS_GIFT],
        }),
        errMsg: "상담결과(상담원처리)저장 중 오류가 발생하였습니다.",
    }
    $.ajax(settings).done(res => {
        if (!checkApi(res, settings)) return;

        // 저장성공후
        onSearch(condition.DS_TICKET);     // 재조회 및 티켓업데이트
        refreshDisplay();                  // 오픈된 화면 재조회
        alert("저장 되었습니다.");
        
    })
}

/**
 * Zendesk 티켓 업데이트
 * @param {object} DS_TICKET 티켓정보
 */
const updateTicket = (DS_TICKET) => {
    
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
    if (DS_TICKET.PROC_STS_MK == "15" || DS_TICKET.HPCALL_ROW_TYPE == "U") OB_MK_VAL = ""; // 해피콜 저장시 빈값
    if (DS_TICKET.BTN_MK == "CO") OB_MK_VAL = "";   // 완료시 빈값
    if (typeof OB_MK_VAL == "string") {
        custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["OB_MK"], value: OB_MK_VAL });
    }

    // 해피콜관련 티켓필드 세팅
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_DATE1_TIME1"],     value: DS_TICKET.HPCALL_DATE_TIME });       // 해피콜 일시
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CNTS1"],           value: DS_TICKET.HPCALL_CNTS });            // 해피콜 내용
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CHNL_MKNM1"],      value: DS_TICKET.HPCALL_CHNL_MK_NM });      // 해피콜 경로
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_USER_IDNM1"],      value: DS_TICKET.HPCALL_USER_NM });         // 해피콜 상담원명
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["SATIS_CDENM1"],           value: DS_TICKET.HPCALL_SATIS_CDE_NM });    // 해피콜 고객만족도

    // 기타 티켓필드 세팅
    const PROC_STS_MK_VAL = `proc_sts_mk_${Number(DS_TICKET.PROC_STS_MK)}`;
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_STS_MK"],            value: PROC_STS_MK_VAL });          // 처리상태 
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_PROC_DATE"],         value: DS_TICKET.PROC_DATE });      // 상담원처리 처리일시
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_PROC_USER_NAME"],    value: DS_TICKET.PROC_USER_NM });   // 상담원처리 처리자명
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_PROC_CNTS"],         value: DS_TICKET.PROC_CNTS });      // 상담원처리 처리내용
    custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["IS_HPCALL"],              value: DS_TICKET.IS_HAPY });        // 해피콜 여부

    const option = {
        url: `/api/v2/tickets/${DS_TICKET.ZEN_TICKET_ID}`,
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify({ 
            ticket: { custom_fields }
        }),
    }

    return topbarClient.request(option);

}

/**
 * 오픈된 화면 재조회
 */
const refreshDisplay = () => {
    if (opener?.name == "CCEMPRO022") opener.onSearch();                    // 상담등록화면 재조회
    if (opener?.name == "CCEMPRO035") opener.onSearch(true);                // 상담조회화면 재조회
	if (opener?.opener?.name == "CCEMPRO035") opener.opener.onSearch(true);	// 상담조회화면 재조회
    topbarObject?.refreshGrid();                                            // 탑바화면 재조회
}

/**
 * 전화걸기
 * - as-is : cns6000.onMakeCall()
 */
const onMakeCall = (elm, iIdx) => {

    const status = $(elm).hasClass("callOn") ? "callOn" : "callOff";
    let targetPhone = "";

    if (iIdx == "1") {
        targetPhone = $("#textbox4").val().trim().replace(/-/gi, ''); // 학습장소
    } else if (iIdx == "2") {
        targetPhone = $("#textbox6").val().trim().replace(/-/gi, ''); // 회원HP
    } else {
        targetPhone = $("#textbox7").val().trim().replace(/-/gi, ''); // 회원모HP
    }

    if (status == "callOn" && targetPhone.length < 4) {
        alert("전화걸기를 할 수 없습니다.\n\n전화번호가 유효하지 않습니다.");
        return;
    }

    topbarObject.wiseNTalkUtil.callStart(status, targetPhone, "CCEMPRO095", DS_CSEL_PROC.ZEN_TICKET_ID, "1");

}

/**
 * 상담 통화시간 저장
 */
 const onSaveCallTime = async () => {

    const ticket_id = DS_CSEL_PROC.ZEN_TICKET_ID;
    if (!ticket_id) return;

    const data = await getCallTimeCondition(topbarClient, ticket_id);
    
    topbarObject.saveCallTime({
        userid			: currentUser?.external_id,
        menuname		: "상담결과등록-상담원처리",
        CSEL_NO			: DS_CSEL_PROC.CSEL_NO,   // 상담번호	
        CSEL_DATE		: DS_CSEL_PROC.CSEL_DATE, // 상담일자		
        CALL_STTIME		: data.CALL_STTIME, 	  // 통화시작시간(시분초:172951)
        CALL_EDTIME		: data.CALL_EDTIME, 	  // 통화종료시간(시분초:173428)
        RECORD_ID		: data.RECORD_ID, 		  // 녹취키(리스트) 없는 경우 []
    });

}

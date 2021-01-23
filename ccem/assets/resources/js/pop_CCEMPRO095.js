let currentUser;        // 현재 사용중인 유저의 정보(ZENDESK)
let giftList = [];      // 사은품내역2 코드

let DS_CSEL_PROC = {};  // 상담내역

let sCselDate = "";
let sCselNo   = "";
let sCselSeq  = "";
let sCustId   = "";
let sCustMk   = "";
let isCallUpdate = false;     // 닫기시 해피콜 전화여부 여부 판단 변수

let objSys1100 = ""; //콜처리 페이지(top:sys1100.jsp) 객체

$(function () {

    // create calendar
    $(".calendar").each((i, el) => {
        if(el.id === "calendar4") calendarUtil.init(el.id, { drops: "up", opens: "left"});
        else calendarUtil.init(el.id);
    });

    // input mask
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
    calendarUtil.currency("textbox28");

    onStart(opener ? opener.name : "");

});

/**
 * 오픈하는곳에 따라 분기처리
 * @param {string} openerNm 
 */
const onStart = async (openerNm) => {

    // TODO 상담조회에서 팝업 되었을때,
    if (openerNm.includes("CCEMPRO000")) {
        objSys1100  = "";
        sCselDate   = ""  // 상담일자
        sCselNo     = ""  // 상담번호
        sCselSeq    = ""  // 상담순번
        sCustId     = ""  // 고객번호
        sCustMk     = ""  // 고객구분

    // 상담등록화면에서 팝업되었을때,
    } else if (openerNm.includes("CCEMPRO022")) {
        currentUser = opener.currentUser;

        objSys1100  = "";
        sCselDate   = opener.calendarUtil.getImaskValue("textbox27");   // 상담일자
        sCselNo     = $("#textbox28", opener.document).val();           // 상담번호
        sCselSeq    = $("#selectbox14", opener.document).val();         // 상담순번
        sCustId     = $("#hiddenbox6", opener.document).val();          // 고객번호
        sCustMk     = $("#hiddenbox2", opener.document).val();          // 고객구분

        await setCodeData(opener.codeData);
        getCselProc();

    // TODO I/B해피콜 리스트에서 팝업되었을때,
    } else if (openerNm.includes("CCEMPRO000")) {
        objSys1100  = "";
        sCselDate   = "";  // 상담일자
        sCselNo     = "";  // 상담번호
        sCselSeq    = "";  // 상담순번
        sCustId     = "";  // 고객번호
    }

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
 * 상담내역 조회
 * - as-is : cns6000.onSearch()
 */
const getCselProc = () => {
    const settings = {
		url: `${API_SERVER}/cns.getCselProc.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
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
	$.ajax(settings).done(res => {
        if (!checkApi(res, settings)) return;

        if (res.dsRecv.length >= 1) {
            DS_CSEL_PROC = res.dsRecv[0];
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
            $("#textbox28").val(DS_CSEL_PROC.GIFT_PRICE);                           // txtGIFT_PRICE         // 사은품가격        
            calendarUtil.setImaskValue("calendar4", DS_CSEL_PROC.SEND_DATE);        // MSK_SEND_DATE          // 발송일자  
            $("#selectbox5").val(DS_CSEL_PROC.GIFT_CHNL_MK);                        // CMB_GIFT_CHNL_MK       // 전달경로구분            
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
                
            setActiveControl();
        }

    });
}

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
            $("#button1").prop("disabled", false);  // 완료버튼 활성화
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
 * 완료버튼 클릭시
 * - as-is : cns6000.onComplete()
 */
const onComplete = () => {
    //처리구분: 완료(99)설정
    DS_CSEL_PROC.PROC_STS_MK = "99";
    $("#checkbox1").prop("checked", false);
    onSave();
}

/**
 * 저장버튼 클릭시
 * - as-is : cns6000.onSave()
 */
const onSave = () => {
    
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
        if(DS_CSEL_PROC.GIFT_DATE == "" && $("#selectbox4").val() != "" ){
            DS_CSEL_PROC.GIFT_DATE = getDateFormat().replace(/[^0-9]/gi, "");
        }

        const saveCondition = getSaveCondition();
        if (!saveCondition) return;
        saveCselProc(saveCondition);
    }

}

/**
 * 지점처리 조건 체크
 * - as-is : cns6000.onChkProc()
 */
const onChkProc = () => {
    if (DS_CSEL_PROC.PROC_USER_ID && $("#textbox24").val().trim().length > 0) {
        return true;
    } else {
        alert("지점 처리 내용을 입력하세요.");
        return false;
    }
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
const getSaveCondition = () => {
    return {
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
            ROW_TYPE        : "", // 저장구분(I/U/D)
            CSEL_DATE       : DS_CSEL_PROC.CSEL_DATE,                   // 상담일자
            CSEL_NO         : DS_CSEL_PROC.CSEL_NO,                     // 상담번호
            CSEL_SEQ        : DS_CSEL_PROC.CSEL_SEQ,                    // 상담순번
            PROC_DATE       : calendarUtil.getImaskValue("calendar2"),  // 처리일자
            PROC_USER_ID    : DS_CSEL_PROC.PROC_USER_ID,                // 처리자ID
            PROC_CNTS       : $("#textbox24").val(),                    // 처리내용
            PROC_STS_MK     : DS_CSEL_PROC.PROC_STS_MK,                 // 처리상태구분
        },
        DS_HPCALL   : {
            ROW_TYPE        : "", // 저장구분(I/U/D)           
            CSEL_DATE       : DS_CSEL_PROC.CSEL_DATE,                   // 상담일자           
            CSEL_NO         : DS_CSEL_PROC.CSEL_NO,                     // 상담번호       
            HPCALL_DATE     : calendarUtil.getImaskValue("calendar3"),  // 해피콜일자           
            HPCALL_TIME     : $("#timebox1").val(),                     // 해피콜시간           
            HPCALL_TITLE    : $("#textbox26").val(),                    // 해피콜제목               
            HPCALL_CNTS     : $("#textbox27").val(),                    // 해피콜내용           
            HPCALL_CHNL_MK  : $("#selectbox2").val(),                   // 해피콜경로구분               
            HPCALL_USER_ID  : DS_CSEL_PROC.HPCALL_USER_ID,              // 해피콜상담원ID               
            SATIS_CDE       : $("#selectbox1").val(),                   // 고객만족도코드           
            SATIS_CDE1      : DS_CSEL_PROC.SATIS_CDE1,                  // 고객만족도코드1           
            SATIS_CDE2      : DS_CSEL_PROC.SATIS_CDE2,                  // 고객만족도코드2           
            GIFT_DATE       : DS_CSEL_PROC.GIFT_DATE,                   // 사은품접수일자           
            GIFT_NO         : DS_CSEL_PROC.GIFT_NO,                     // 사은품접수번호       
        },
        DS_GIFT     : {
            ROW_TYPE        : "", // 저장구분(I/U/D)       
            CUST_ID         : DS_CSEL_PROC.CUST_ID,                     // 고객번호   
            GIFT_DATE       : DS_CSEL_PROC.GIFT_DATE,                   // 사은품접수일자       
            GIFT_NO         : DS_CSEL_PROC.GIFT_NO,                     // 사은품접수번호   
            GIFT_SEQ        : DS_CSEL_PROC.GIFT_SEQ,                    // 사은품접수순번       
            GIFT_TYPE_CDE   : $("#selectbox3").val(),                   // 사은품분류코드           
            GIFT_CDE        : $("#selectbox4").val(),                   // 사은품코드       
            GIFT_PRICE      : $("#textbox28").val(),                    // 사은품가격       
            SEND_DATE       : calendarUtil.getImaskValue("calendar4"),  // 발송일자       
            GIFT_CHNL_MK    : $("#selectbox5").val(),                   // 전달경로구분           
            PASS_USER       : $("#textbox29").val(),                    // 전달자명       
            INVOICENUM      : $("#textbox30").val(),                    // 택배송장번호       
        },
    }
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
        console.debug("saveCselProc: ", res);
        getCselProc();
    })
}
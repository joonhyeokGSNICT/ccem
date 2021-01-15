const TEL_LIST = {
    home  : [],   // 자택
    work  : [],   // 직장
    fat   : [],   // 회원부
    mot   : [],   // 회원모
    mbr   : [],   // 회원
};

$(function() {

    // 날짜와 시간 세팅
    $("#calendar1").val(getDateFormat());
    $("#time1").val(getTimeFormat());

    // create calendar
    calendarUtil.init("calendar1");
    
    // input mask
    calendarUtil.timeMask("time1", "hh:mm");

    // 연락처 구분 radio
    $("input[name='tel'").on("change", ev => {
        const targetId = ev.target.id;
        switch(targetId) {
            case "radio1": 
                $("#textbox1").val(TEL_LIST.home[0]).prop("disabled", true);
                $("#textbox2").val(TEL_LIST.home[1]).prop("disabled", true);
                $("#textbox3").val(TEL_LIST.home[2]).prop("disabled", true);
                break;
            case "radio2": 
                $("#textbox1").val(TEL_LIST.work[0]).prop("disabled", true);
                $("#textbox2").val(TEL_LIST.work[1]).prop("disabled", true);
                $("#textbox3").val(TEL_LIST.work[2]).prop("disabled", true);
                break;
            case "radio3": 
                $("#textbox1").val(TEL_LIST.mot[0]).prop("disabled", true);
                $("#textbox2").val(TEL_LIST.mot[1]).prop("disabled", true);
                $("#textbox3").val(TEL_LIST.mot[2]).prop("disabled", true);
                break;
            case "radio4": 
                $("#textbox1").val(TEL_LIST.mbr[0]).prop("disabled", true);
                $("#textbox2").val(TEL_LIST.mbr[1]).prop("disabled", true);
                $("#textbox3").val(TEL_LIST.mbr[2]).prop("disabled", true);
                break;
            case "radio5": 
                $("#textbox1").val("").prop("disabled", false);
                $("#textbox2").val("").prop("disabled", false);
                $("#textbox3").val("").prop("disabled", false);
                break;
            default: 
                break;
        }
    });

    onStart();

});

const onStart = async () => {
    const openerNm = opener ? opener.name : "";
    
    if (openerNm == "CCEMPRO022") {  // 상담등록 화면에서 오픈했을때.
        const CUST_ID = opener.document.getElementById("hiddenbox6").value;

        // 자택, 직장, 회원모, 회원 전화번호 가져오기
        const telNoData = await getTelNo(CUST_ID);
        if (telNoData) {
            TEL_LIST.home    = FormatUtil.tel(telNoData.TEL_HOME        || "").split("-");
            TEL_LIST.work    = FormatUtil.tel(telNoData.TEL_WORKPLACE   || "").split("-");
            TEL_LIST.fat     = FormatUtil.tel(telNoData.MOBILNO_FAT     || "").split("-");
            TEL_LIST.mot     = FormatUtil.tel(telNoData.MOBILNO_MOT     || "").split("-");
            TEL_LIST.mbr     = FormatUtil.tel(telNoData.MOBILNO_MBR     || "").split("-");
        }

        $("#radio1").click();   // default 자택
    }
}

/**
 * 연락처 정보 반환.
 * @param {string} CUST_ID 고객번호
 */
const getTelNo = (CUST_ID) => new Promise((resolve, reject) => {
    const settings = {
        url: `${API_SERVER}/cns.getTelNo.do`,
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify({
            senddataids: ["dsSend"],
            recvdataids: ["dsRecv"],
            dsSend: [{ CUST_ID }],
        }),
        errMsg: "연락처 조회 중 오류가 발생하였습니다.",
    }
    $.ajax(settings)
        .done(data => {
            if (!checkApi(data, settings)) return reject(settings.errmsg);
            return resolve(data.dsRecv[0]);
        })
        .fail(error => {
            return reject(error);
        });
});

/**
 * 저장
 */
const onSave = async () => {
    const openerNm = opener ? opener.name : "";

    // 상담등록 화면에서 오픈했을때.
    if (openerNm == "CCEMPRO022") {  
        const tel1 = $("#textbox1").val();
        const tel2 = $("#textbox2").val();
        const tel3 = $("#textbox3").val();

        if (!tel1) {
            alert("전화번호 국번을 정확히 입력하십시요.");
            $("#textbox1").focus();
            return;
        }
        if (tel2.length < 2) {
            alert("전화번호 앞번호를 정확히 입력하십시요.");
            $("#textbox2").focus();
            return;
        }
        if (tel3.length < 4) {
            alert("전화번호 뒷번호를 정확히 입력하십시요.");
            $("#textbox3").focus();
            return;
        }

        opener.DS_SCHEDULE.TELNO = tel1 + tel2 + tel3;
        window.close();
    // 부모창이 존재하지 않을때.
    } else {
        alert("재통화예약 저장 중 오류가 발생하였습니다. 팝업창을 닫고 다시 실행해 주세요.");
    }

}
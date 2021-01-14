let topbarObject;
let sidebarClient;

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

    if(openerNm == "CCEMPRO022") {  // 상담등록 화면에서 오픈했을때.
        topbarObject = opener.topbarObject;
        const CUST_ID = opener.document.getElementById("hiddenbox6").value;

        // 자택, 직장, 회원모, 회원 전화번호 가져오기
        const telNoData = await getTelNo(CUST_ID);
        if(telNoData) {
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

    sidebarClient = topbarObject.sidebarClient;

    if(!sidebarClient) {
        alert("대상티켓이 없습니다.\n\n[티켓오픈] 또는 [티켓생성]을 먼저 하고, 처리 하시기 바랍니다.");
        return;
    }

    const tel = $("#textbox1").val() + $("#textbox2").val() + $("#textbox3").val();
    let req = new Object(), res = new Object();
    req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["re_call_no"]}`] = tel;

    // 티켓필드 입력
    res = await sidebarClient.set(req);

    // 티켓이 존재하지 않을때...
    if(res["code"]) {
        console.error(res);
        alert("대상티켓이 없습니다.\n\n[티켓오픈] 또는 [티켓생성]을 먼저 하고, 처리 하시기 바랍니다.");
        return;
    }

    // 티켓필드 입력 성공여부 체크
    let succ = false;
    for(let key in req) {
        if(res[key] === req[key]) {
            succ = true;
        }else {
            succ = false;
            break;
        }
    }

    // 티켓필드가 존재하지 않을때...
    if(!succ) {
        console.error(res);
        alert("[재통화연락처] 필드가 없습니다. 관리자에게 문의하시기 바랍니다.");
        return;
    }

    alert("저장 되었습니다.");

}
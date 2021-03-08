window.resizeTo(744, 445);

let currentUser;    // 현재 사용중인 유저의 정보(ZENDESK)
let grid;           // 연계이력 grid

$(function () {
    
    $(window).on('beforeunload', () => {
		PopupUtil.closeAll();
	});

    createGrids();
    onStart();
});

const createGrids = () => {

    grid = new Grid({
        el: document.getElementById("grid"),
        bodyHeight: 300,
        rowHeaders: [
            { type: 'rowNum', header: "NO", minWidth: 30, },
        ],
        columns: [
            { header: "연계지점",           name: "DEPT_NAME",          width: 100,     align: "center",     sortable: true, ellipsis: true, hidden: false, },
            { header: "연계지점장",         name: "REP_EMP_NAME",       width: 100,     align: "center",     sortable: true, ellipsis: true, hidden: false, },
            { header: "구분",               name: "TRANS_WAY_NAME",     width: 100,     align: "center",    sortable: true, ellipsis: true, hidden: false, },
            { header: "대상자/FaxNo",       name: "EMP_NAME_OR_FAX_NO", width: 150,     align: "center",    sortable: true, ellipsis: true, hidden: false, 
                formatter: columnInfo => columnInfo.row.EMP_NAME || columnInfo.row.FAX_NO,
            },
            { header: "날짜",               name: "TRANS_DATE",         width: 100,     align: "center",    sortable: true, ellipsis: true, hidden: false, 
                formatter: columnInfo => FormatUtil.date(columnInfo.row.TRANS_TM?.substring(0, 8)),
            },
            { header: "시간",               name: "TRANS_TIME",         width: 100,     align: "center",    sortable: true, ellipsis: true, hidden: false, 
                formatter: columnInfo => FormatUtil.time(columnInfo.row.TRANS_TM?.substring(8, 14)),
            },
        ],
    });

    grid.on("click", (ev) => {
        grid.addSelection(ev);
        grid.clickSort(ev);
    });

}

/**
 * 오픈하는 곳에 따라 분기처리.
 */
const onStart = () => {

    const opener_name = opener?.name || "";

    // 상담결과등록 > 연계이력 버튼으로 오픈했을 때.
    if (opener_name == "CCEMPRO030") {
        currentUser = opener.currentUser;

        // 연계이력 조회
        const sCSEL_DATE = opener.sCSEL_DATE;    // 상담일자
        const sCSEL_NO	 = opener.sCSEL_NO;      // 상담번호    
        const sCSEL_SEQ	 = opener.sCSEL_SEQ;     // 상담순번    
        getTransHistory(sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);

    }
    
}

/**
 * 연계이력 조회
 */
const getTransHistory = (CSEL_DATE, CSEL_NO, CSEL_SEQ) => {
    
    const settings = {
        url: `${API_SERVER}/cns.getTransHistory.do`,
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "연계이력",
            senddataids: ["dsSend"],
            recvdataids: ["dsRecv"],
            dsSend: [{ CSEL_DATE, CSEL_NO, CSEL_SEQ }],
        }),
        errMsg: "연계이력 조회중 오류가 발생하였습니다.",
    }

    $.ajax(settings).done(res => {
        if (!checkApi(res, settings)) return;
        grid.resetData(res.dsRecv || []);
    });

}
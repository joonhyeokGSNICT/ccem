let grid;

$(function () {
    createGrids();
    onStart(opener ? opener.name : "");
});

const createGrids = () => {
    grid = new Grid({
        el: document.getElementById("grid"),
        bodyHeight: 300,
        scrollX: false,
        rowHeaders: [
            { type: 'rowNum', header: "NO", minWidth: 30, },
        ],
        columns: [
            { header: "구분", name: "CNT_WHERE", width: 50, align: "center", sortable: true, ellipsis: true, hidden: false, },
            { header: "관계", name: "FAT_REL_NAME", width: 50, align: "center", sortable: true, ellipsis: true, hidden: false, },
            { header: "회원명", name: "FML_NAME", width: 100, align: "center", sortable: true, ellipsis: true, hidden: false, },
            { header: "학년", name: "GRADE_NAME", width: 100, align: "center", sortable: true, ellipsis: true, hidden: false, },
            { header: "성별", name: "GND_NAME", width: 50, align: "center", sortable: true, ellipsis: true, hidden: false, },
            { header: "회원번호", name: "MBR_ID", width: 150, align: "center", sortable: true, ellipsis: true, hidden: false, },
            { header: "고객번호", name: "CUST_ID", width: 150, align: "center", sortable: true, ellipsis: true, hidden: false, },
            { header: "세대주주민번호", name: "FAT_RSDNO", width: 50, align: "center", sortable: true, ellipsis: true, hidden: true, },
        ],
        summary: {
            height: 28,
            position: 'bottom',
            columnContent: {
                name1: "Total",
                name2: { template: valueMap => valueMap.cnt },
            },
        },
    });

    grid.on("click", (ev) => {
        grid.addSelection(ev);
        grid.clickSort(ev);
    });

    grid.on("dblclick", (ev) => {

        const openerName = opener ? opener.name : "";

        // 상담등록 > 관계회원 버튼으로 오픈했을 때.
        if (openerName.includes("CCEMPRO022")) {
            const rowData = grid.getRow(ev.rowKey);
            opener.addCselByFamily(rowData);
            window.close();
        }

    });
}

/**
 * 오픈하는 곳에 따라 분기처리.
 * @param {string} openerName 
 */
const onStart = (openerName) => {

    // 상담등록 > 관계회원 버튼으로 오픈했을 때.
    if (openerName.includes("CCEMPRO022")) {
        const custId = opener.document.getElementById("hiddenbox6").value;
        getFamily(custId);
    }

}

/**
 * 관계회원 조회
 * @param {string} custId 고객번호
 */
const getFamily = (custId) => {
    const settings = {
		url: `${API_SERVER}/cns.getFamilyInfo.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ CUST_ID: custId}],
        }),
        errMsg: "관계회원 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
        if (!checkApi(data, settings)) return;
        grid.resetData(data.dsRecv);
	});
}
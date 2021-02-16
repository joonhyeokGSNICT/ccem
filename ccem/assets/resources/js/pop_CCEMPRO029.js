let currentUser;    // 현재 사용중인 유저의 정보(ZENDESK)
let grid;           // 관계회원 grid

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
        if (ev.targetType != "cell") return;
        
        // 고객번호가 존재하지 않을때.
        const CUST_ID = grid.getValue(ev.rowKey, "CUST_ID");
        if (!CUST_ID) {
            alert("고객번호가 존재하지 않는 고객입니다.\n\n먼저 고객 정보 등록을 하시기 바랍니다.");
            return;
        }

        // 부모창이 존재하지 않을때.
        const opener_name = opener?.name;
        if (!opener_name) {
            alert("세션정보를 찾을 수 없습니다.\n\n팝업창을 닫고 다시 실행해 주세요.");
            return;
        }
        
        // 젠데스크 사용자 생성 or 업데이트
        opener.topbarObject.onAutoSearch(CUST_ID, "1");

        // 상담등록화면에서 오픈했을 때.
        if (opener_name == "CCEMPRO022") {

            const sJobType = opener.getJobType("selectbox14", "L"); // 마지막순번 상담저장구분

            // 신규일 경우.
            if (sJobType == "I") {
                const sMsg = "변경된 정보가 존재합니다."
                                + "\n\n선택한 관계회원으로 상담등록하시려면 [확인]을 클릭하십시요."
                                + "\n\n기존정보를 유지하고 저장하시려면 [취소]를 클릭하십시요.";
                if (confirm(sMsg)) opener.getBaseData("C", CUST_ID, "I");
        
            // 수정일 경우.
            } else if (sJobType == "U") { 
                opener.addCsel();
                opener.getBaseData("C", CUST_ID, "I");

            // 신규 또는 수정이 아닐 때.
            } else {
                alert(`저장구분이 올바르지 않습니다.[${sJobType}]\n\n관리자에게 문의하기시 바랍니다.`);
                return;
            }

            window.close();

        }

        // 입회등록화면에서 오픈했을 때.
        else if (opener_name == "CCEMPRO031") {

            const sJobType = opener.getJobType("selectbox3", "L"); // 마지막순번 상담저장구분

            // 신규일 경우.
            if (sJobType == "I") {

            // 수정일 경우.
            } else if (sJobType == "U") { 
                opener.addCsel();

            // 신규 또는 수정이 아닐 때.
            } else {
                alert(`저장구분이 올바르지 않습니다.[${sJobType}]\n\n관리자에게 문의하기시 바랍니다.`);
                return;
            }

            opener.getCust(CUST_ID, "I");
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
        currentUser = opener.currentUser;
        const sCUST_ID = opener.document.getElementById("hiddenbox6").value;
        getFamily(sCUST_ID);
    }
    // 입회등록 > 관계회원 버튼으로 오픈했을 때.
    else if (openerName.includes("CCEMPRO031")) {
        const sCUST_ID = opener.document.getElementById("hiddenbox3").value;
        getFamily(sCUST_ID);
    }
    
}

/**
 * 관계회원 조회
 * @param {string} CUST_ID 고객번호
 */
const getFamily = (CUST_ID) => {
    const settings = {
		url: `${API_SERVER}/cns.getFamilyInfo.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "관계회원",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ CUST_ID }],
        }),
        errMsg: "관계회원 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
        if (!checkApi(data, settings)) return;
        grid.resetData(data.dsRecv);
	});
}
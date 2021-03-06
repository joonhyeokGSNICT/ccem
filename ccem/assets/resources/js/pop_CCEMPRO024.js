var topbarObject;
let topbarClient;

let currentUser;
let currentTicket;

let grid1, grid2;

let sFLAG, sLIST_CUST_ID, sCUST_ID, sCSEL_DATE, sCSEL_NO, sCSEL_SEQ

$(function () {

	$(window).on('beforeunload', () => {
		PopupUtil.closeAll();
	});
	
	createGrids();
	onStart();
	
});

const createGrids = () => {
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 100,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", },
		],
		columns: [
			{ header: "회원명",                                 name: "CUST_NAME",               align: "center",       sortable: true, ellipsis: true,     hidden: false,   },
			{ header: "회원번호",                               name: "MBR_ID",                  align: "center",       sortable: true, ellipsis: true,     hidden: false,   },
			{ header: "전화번호",                               name: "MOBILNO",                 align: "center",       sortable: true, ellipsis: true,     hidden: false,   },
			{ header: "개설기관명",                             name: "BANK_NAME",               align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
			{ header: "예금주 성명",                            name: "ACCOUNT_HOLDER_NAME",     align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
			{ header: "계좌번호",                               name: "ACCT_ID",                 align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
			{ header: "중단사유 코드명",                        name: "REFUND_NAME",             align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
			{ header: "중단사유 상세",                          name: "REFUND_CNTS",             align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
			{ header: "가족관계코드명",                         name: "FML_CONNT_NAME",          align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
			{ header: "고객직접퇴회 등록일시",                   name: "CTI_CREDATE",             align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
			{ header: "환불 요청 SEQ",                          name: "REFUND_SEQ",              align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
			{ header: "고객번호",                               name: "CUST_ID",                 align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
			{ header: "과목테이블관계키_본인 2건이상 접수시",     name: "REFUND_SEQ_REF",          align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
			{ header: "환불예상금액",                           name: "REFUND_AMT",              align: "center",       sortable: true, ellipsis: true,     hidden: true,   },
		],
	});

	const grid1onClick = (rowKey) => {
		if (typeof rowKey === "undefined") return;

		const rowData	= grid1.getRow(rowKey);

		// 학습중단 과목 조회
		getRefundPrdt(rowData.REFUND_SEQ);	

		// 퇴회신청내역 세팅
		$(`input[name='RFD_PROC_MK']:radio[value=${rowData.RFD_PROC_MK}]`).prop("checked", true); // 퇴회처리구분
		$("#textbox1").val(rowData.BANK_NAME);				// 은행명
		$("#textbox2").val(rowData.ACCT_ID);				// 계좌번호
		$("#textbox3").val(rowData.REFUND_AMT);				// 환불예상금액
		$("#textbox4").val(rowData.ACCOUNT_HOLDER_NAME);	// 예금주
		$("#textbox5").val(rowData.FML_CONNT_NAME);			// 관계
		$("#textbox6").val(rowData.REFUND_NAME);			// 중단사유
		$("#textbox7").val(rowData.REFUND_CNTS);			// 중단사유상세
	}

	grid1.on("click", ev => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
		grid1onClick(ev.rowKey);
	});

	grid1.on("onGridUpdated", () => {
		if(grid1.getRowCount() >= 1) grid1onClick(0);
	});

	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 288,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", },
		],
		columns: [
			{ header: "과목명",		name: 'PRDT_NAME', 	align: "center", sortable: true, ellipsis: true, hidden: false, },
			{ header: "학습횟수", 	name: 'JUCHA', 		align: "center", sortable: true, ellipsis: true, hidden: false, },
			{ header: "환불금액", 	name: 'FEE_AMT', 	align: "center", sortable: true, ellipsis: true, hidden: true,  },
		],
	});

	grid2.on("click", ev => {
		grid2.addSelection(ev);
		grid2.clickSort(ev);
	});
}

const onStart = () => {

	// 상담등록 화면에서 오픈했을때.
	if (opener?.name == "CCEMPRO022") {  
		topbarObject	= opener.topbarObject;
		topbarClient	= opener.topbarClient;
		currentUser 	= opener.currentUser;
		currentTicket	= opener.currentTicket;

		const selectSeq = opener.document.getElementById("selectbox14");				// 순번 selectbox
		sFLAG 			= selectSeq.options[selectSeq.selectedIndex].dataset.jobType;	// 저장구분(I: 신규, U: 수정)
		sLIST_CUST_ID 	= getListCustId();												// 리스트ID_고객번호
		sCUST_ID		= opener.document.getElementById("hiddenbox6").value;			// 고객번호
		sCSEL_DATE 		= opener.calendarUtil.getImaskValue("textbox27");				// 상담일자
		sCSEL_NO 		= opener.document.getElementById("textbox28").value;			// 상담번호
		sCSEL_SEQ 		= selectSeq.options[selectSeq.selectedIndex].value;				// 상담순번

		getRefund(sFLAG, sLIST_CUST_ID, sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);
	}
	
}

/**
 * 티켓필드에 입력된 리스트ID_고객번호를 반환.
 */
const getListCustId = () => {

	let fResult = "";

	if (currentTicket?.custom_fields?.length > 0) {
		const fLIST_CUST_ID = currentTicket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["LIST_CUST_ID"]);
		fResult = fLIST_CUST_ID?.value || "";
	}

	return fResult;
}

/**
 * 고객직접퇴회 조회
 * - as-is : cns4640.onSearch()
 * @param {string} FLAG 		조회구분
 * @param {string} LIST_CUST_ID 리스트아이디
 * @param {string} CSEL_DATE 	상담일자		
 * @param {string} CSEL_NO 		상담번호			
 * @param {string} CSEL_SEQ 	상담순번		
 */
const getRefund = (FLAG, LIST_CUST_ID, CSEL_DATE, CSEL_NO, CSEL_SEQ) => {

	let condition = {};
	// 신규(I)
	if (FLAG == "I") {
		if (!LIST_CUST_ID) return;
		condition = { FLAG, LIST_CUST_ID };
	// 기존(U)
	} else {
		if (!CSEL_DATE || !CSEL_NO || !CSEL_SEQ) return;
		condition = { FLAG, CSEL_DATE, CSEL_NO, CSEL_SEQ };
	}

	const settings = {
		url: `${API_SERVER}/cns.getRefund.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "고객직접퇴회",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
	}

	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		grid1.resetData(data.dsRecv || []);
	});

}

/**
 * 학습중단 과목 조회
 * - as-is : cns4640.onSearchPrdt()
 * @param {string} REFUND_SEQ 환불요청 SEQ
 */
const getRefundPrdt = (REFUND_SEQ) => {
	if(!REFUND_SEQ) return;

	const settings = {
		url: `${API_SERVER}/cns.getRefundPrdt.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "고객직접퇴회",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ REFUND_SEQ }],
		}),
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		grid2.resetData(data.dsRecv || []);
	});
}

/**
 * key에 따라 해당하는 팝업 띄우기
 * - as-is : cns4640.onSms(), onDreams()
 * @param {string} key 
 */
const openPopup = async (key) => {
	switch (key) {
		case "SMS":
			const rowKey = grid1.getSelectedRowKey();
			const sendData = new Array();
			sendData[0] = grid1.getValue(rowKey,"CUST_ID");  	// 회원번호
			sendData[1] = grid1.getValue(rowKey,"CUST_NAME");	// 회원명
			sendData[2] = grid1.getValue(rowKey,"MOBILNO");  	// 회원휴대폰
			sendData[3] = "";  // 회원/모 휴대폰
			sendData[4] = "";  // 회원/부 휴대폰
			sendData[5] = "1"; // 휴대폰 디폴트 선택값 [ 1:회원 || 2:회원모 || 3:회원부 ]
			sendData[6] = grid1.getValue(rowKey,"MBR_ID");		// 회원번호
			sendData[7] = sCSEL_DATE;	// 상담일자
			sendData[8] = sCSEL_NO;		// 상담번호
			sendData[9] = sCSEL_SEQ;	// 상담순번
			PopupUtil.open("CCEMPRO046", 980, 600, "", sendData);
			break;
		case "DREAMS":
			const sGbn 	 = "ES";
			const sId 	 = currentUser.external_id;
			const sPwd 	 = currentUser.external_id;
			const basUrl = await getBasicList("9");
			const sUrl   = `${basUrl}?zsite=${sGbn}&zlogin_id=${sId}&zpasswd=${sPwd}&move=drop`;
			window.open(sUrl, 'Refund', 'width=1024,height=768,menubar=yes,resizable=yes,scrollbars=yes,toolbar=yes');
			break;
		default:
			break;
	}
}

/**
 * 확인
 * - as-is : cns4640.onSave()()
 */
const onSave = () => {

	// 상담등록 화면에서 오픈했을때.
	if (opener?.name == "CCEMPRO022") {  
		opener.DS_DROP_CHG.CSEL_DATE    = sCSEL_DATE;	// 상담일자
		opener.DS_DROP_CHG.CSEL_NO 	  	= sCSEL_NO;		// 상담번호
		opener.DS_DROP_CHG.CSEL_SEQ 	= sCSEL_SEQ;	// 상담순번
		opener.DS_DROP_CHG.CUST_ID 	  	= sCUST_ID;		// 고객번호
		opener.DS_DROP_CHG.LIST_ID	  	= sLIST_CUST_ID?.split("_")[0] || "";				// 리스트아이디
		opener.DS_DROP_CHG.RFD_PROC_MK  = $("input[name='RFD_PROC_MK']:checked").val();		// 퇴회처리구분
		opener.DS_DROP_CHG.CTI_CHGDATE  = "";			// 변경일
	
		// 상담등록 > 상담내용 세팅
		const cselCnts = opener.document.getElementById("textbox13");	// 상담등록 > 상담내용 textarea
		const addCntsTxt = $("#textbox8").val();						// 상담내역
		if(addCntsTxt.trim().length > 0) {
			cselCnts.value = addCntsTxt + "\n" + cselCnts.value;
		}
		
		window.close();
	}

}

/**
 * 닫기 버튼 클릭시
 */
const onClose = () => {
	if (confirm("고객직접퇴회를 저장하지 않고 닫으시겠습니까?") == false) return;

	if (sFLAG == "U") {
		onSave();
	} else {
		opener.DS_DROP_CHG = {};
		window.close();
	}
}
let sidebarClient;
let currentUser;

let grid1, grid2;

let sFLAG, sLIST_CUST_ID, sCUST_ID, sCSEL_DATE, sCSEL_NO, sCSEL_SEQ

$(async function () {
	
	createGrids();

	const openerNm = opener ? opener.name : "";

	if (openerNm == "CCEMPRO022") {  // 상담등록 화면에서 오픈했을때.
		sidebarClient 	= opener.sidebarClient;
		currentUser 	= opener.currentUser;

		const selectSeq = opener.document.getElementById("selectbox14");				// 순번 selectbox
		sFLAG 			= selectSeq.options[selectSeq.selectedIndex].dataset.jobType;	// 저장구분(I: 신규, U: 수정)
		sLIST_CUST_ID 	= await getListCustId();										// 리스트ID_고객번호
		sCUST_ID		= opener.document.getElementById("hiddenbox6").value;			// 고객번호
		sCSEL_DATE 		= opener.calendarUtil.getImaskValue("textbox27");				// 상담일자
		sCSEL_NO 		= opener.document.getElementById("textbox28").value;			// 상담번호
		sCSEL_SEQ 		= selectSeq.options[selectSeq.selectedIndex].value;				// 상담순번

		getRefund(sFLAG, sLIST_CUST_ID, sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);
	}
	
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

		const REFUND_SEQ 				= grid1.getValue(rowKey, "REFUND_SEQ");				// 환불요청 SEQ
		const BANK_NAME			 		= grid1.getValue(rowKey, "BANK_NAME");				// 은행 
		const ACCT_ID     		 		= grid1.getValue(rowKey, "ACCT_ID");				// 계좌번호
		const REFUND_AMT     		 	= grid1.getValue(rowKey, "REFUND_AMT");				// 환불예상금액 
		const ACCOUNT_HOLDER_NAME  		= grid1.getValue(rowKey, "ACCOUNT_HOLDER_NAME");	// 예금주  
		const FML_CONNT_NAME 		 	= grid1.getValue(rowKey, "FML_CONNT_NAME");			// 관계   
		const REFUND_NAME   		 	= grid1.getValue(rowKey, "REFUND_NAME");			// 중단사유 	
		const REFUND_CNTS   		 	= grid1.getValue(rowKey, "REFUND_CNTS");			// 중단사유상세 

		// 학습중단 과목 조회
		getRefundPrdt(REFUND_SEQ);	

		// 퇴회신청내역 세팅
		$("#textbox1").val(BANK_NAME);
		$("#textbox2").val(ACCT_ID);
		$("#textbox3").val(REFUND_AMT);
		$("#textbox4").val(ACCOUNT_HOLDER_NAME);
		$("#textbox5").val(FML_CONNT_NAME);
		$("#textbox6").val(REFUND_NAME);
		$("#textbox7").val(REFUND_CNTS);
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

/**
 * 티켓필드에 입력된 리스트ID_고객번호를 반환.
 */
const getListCustId = async () => {
	if(!sidebarClient) return "";
	const ticketFieldPath = `ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LIST_CUST_ID"]}`;
	const res = await sidebarClient.get(ticketFieldPath);
	return res[ticketFieldPath] ? res[ticketFieldPath] : "";
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
 * 기준값 조회 for DREAMS
 * @param {string} key
 */
const getBasicList = (key) => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/sys.getBasicList.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}],
		}),
		errMsg: "기준값 조회 중 오류가 발생하였습니다.",
	}

	$.ajax(settings)
		.done(data => {
			if (!checkApi(data, settings)) return reject(settings.errMsg);

			const basicList = data.dsRecv;
			if(basicList.length === 0) {
				alert(settings.errMsg);
				return reject(settings.errMsg);
			}

			const basic = basicList.find(el => el.BSC_SCT == key);
			if (!basic) {
				alert(settings.errMsg);
				return reject(settings.errMsg);
			}

			return resolve(basic.BSC_VAL);
		})
		.fail(error => {
			console.error(error);
			return reject(settings.errMsg);
		});
});

/**
 * key에 따라 해당하는 팝업 띄우기
 * @param {string} key 
 */
const openPopup = async (key) => {
	switch (key) {
		case "SMS":
			PopupUtil.open("CCEMPRO046", 980, 600);
			break;
		case "DREAMS":
			const sId 		= currentUser.external_id;
			const basUrl 	= await getBasicList("7");
			const sUrl 		= `${basUrl}?zsite=ES&zlogin_id=${sId}&zpasswd=${sId}&move=drop`;
			window.open(sUrl,'Refund');	// IE Tab 사용을 위해 새탭에서 실행
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
	const openerNm = opener ? opener.name : "";

	// 상담등록 화면에서 오픈했을때.
	if (openerNm == "CCEMPRO022") {  
		opener.DS_DROP_CHG.CSEL_DATE    = sCSEL_DATE;	// 상담일자
		opener.DS_DROP_CHG.CSEL_NO 	  	= sCSEL_NO;		// 상담번호
		opener.DS_DROP_CHG.CSEL_SEQ 	= sCSEL_SEQ;	// 상담순번
		opener.DS_DROP_CHG.CUST_ID 	  	= sCUST_ID;		// 고객번호
		opener.DS_DROP_CHG.LIST_ID	  	= sLIST_CUST_ID ? sLIST_CUST_ID.split("_")[0] : "";	// 리스트아이디
		opener.DS_DROP_CHG.RFD_PROC_MK  = $("input[name='RFD_PROC_MK']:checked").val();		// 퇴회처리구분
		opener.DS_DROP_CHG.CTI_CHGDATE  = "";			// 변경일
	
		// 상담등록 > 상담내용 세팅
		const cselCnts = opener.document.getElementById("textbox13");	// 상담등록 > 상담내용 textarea
		const addCntsTxt = $("#textbox8").val();						// 상담내역
		if(addCntsTxt.trim().length > 0) {
			cselCnts.value = addCntsTxt + "\n" + cselCnts.value;
		}
		
		window.close();
	// 부모창이 존재하지 않을때.
	} else {
		alert("고객직접퇴회 저장 중 오류가 발생하였습니다. 팝업창을 닫고 다시 실행해 주세요.");
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
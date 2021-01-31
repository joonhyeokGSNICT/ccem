$(function () {

	// create calendar
	$(".calendar").each((i, el) => calendarUtil.init(el.id));

	// input mask
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	onStart();

});

/**
 * 오픈되는 곳에 따라 분기처리
 */
const onStart = () => {

	const opener_name = parent.opener.name;
	const hash = parent.location.hash;

    // TODO 탑바 > 고객정보 > 고객 > 선생님소개 버튼으로 오픈
	if (opener_name.includes("top_bar") && hash.includes("by_cust")) {	           
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	
		
		const sCSEL_CHNL_MK = "1";	// 접수채널구분        
		const sTarget 		= "C";	//대상구분 ( "C" : 고객, "T" : 선생님 )
		const sCUST_ID 		= $("#custInfo_CUST_ID", topbarObject.document).val(); // 고객번호

		setCodeData();
			
	// TODO 탑바 > 고객정보 > 선생님 > 선생님소개 버튼으로 오픈
	} else if (opener_name.includes("top_bar") && hash.includes("by_tchr")) {
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	
		
		const sCSEL_CHNL_MK = "1";	//접수채널구분        
		const sTarget 		= "T";	//대상구분 ( "C" : 고객, "T" : 선생님 )        
		const sEMP_ID 		= $("#tchrInfo_EMP_ID", topbarObject.document).val(); // 사원번호

		setCodeData();
		
	}
	// TODO 상담조회 > 상담/입회수정 버튼으로 오픈
	else if (opener_name.includes("CCEMPRO035")) {	
		topbarObject  = parent.opener.topbarObject;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;

		const counselGrid	= parent.opener.grid1;	// 상담조회 grid
		const rowKey 		= counselGrid.getSelectedRowKey();
		const sCSEL_DATE 	= counselGrid.getValue(rowKey, "CSEL_DATE");		// 상담일자
		const sCSEL_NO 		= counselGrid.getValue(rowKey, "CSEL_NO");			// 상담번호
		const sCSEL_SEQ 	= counselGrid.getValue(rowKey, "CSEL_SEQ");			// 상담순번
		const sCUST_ID 		= counselGrid.getValue(rowKey, "CUST_ID");			// 고객번호 or 사원번호
		const sCUST_MK 		= counselGrid.getValue(rowKey, "CUST_MK");			// 고객구분
		const sTarget 		= (sCUST_MK=="TC" || sCUST_MK=="PE") ? "T" : "C";	// 대상구분 ( "C" : 고객, "T" : 선생님 )

		setCodeData();

	}

}

/**
 * 콤보박스 세팅
 * - as-is : clm3110.setCombo()
 */
const setCodeData = () => {

	const CODE_MK_LIST = [
		"CSEL_CHNL_MK",		// 상담채널
		"TRANS_CHNL_MK",	// 연계방법
		"CANCELLATION_CDE",	// 해지사유
		"RE_ACTIVITY_CRS",	// 재사업경로
		"ACTIVITY_MK",		// 사업구분
		"PROC_STS_MK",		// 처리상태
		"CSEL_MK",			// 상담구분
		"PROC_MK",			// 처리구분
		"FAX_TYPE_CDE",		// FAX구분

		"INTEREST_MK",		// 관심부분
		"RE_ACTIVITY_MK",	// 재사업시기
	];

	// get code
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// sorting
	const sortKey = "CODE_ID";
	codeList.sort((a, b) => a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0);

	// create select or radio
	for (const code of codeList) {
		const CODE_MK = code.CODE_MK;
		const CODE_ID = code.CODE_ID;
		const CODE_NAME = code.CODE_NAME;
		if (CODE_MK == "INTEREST_MK" || CODE_MK == "RE_ACTIVITY_MK") {
			$(`div.${CODE_MK}`).append(
				`<div class="form-check mb-2">
					<input class="form-check-input" type="radio" name="${CODE_MK}" id="${CODE_MK+CODE_ID}">
					<label class="form-check-label" for="${CODE_MK+CODE_ID}">${CODE_NAME}</label>
				</div>`
			);
		} else {
			$(`select[name='${CODE_MK}']`).append(new Option(CODE_NAME, CODE_ID));
		}
	}

	// init check
	$("#INTEREST_MK77").prop("checked", true);		// YC종합
	$("#RE_ACTIVITY_MK1").prop("checked", true);	// 즉시

}

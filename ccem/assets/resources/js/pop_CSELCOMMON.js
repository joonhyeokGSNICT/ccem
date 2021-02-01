var topbarObject;		// tobar window
var topbarClient;		// tobar client
var sidebarClient;		// sidebar client
var currentUser;		// 현재 사용중인 유저의 정보(ZENDESK)
var codeData = [];		// 공통코드-전체
var prods	 = [];		// 과목리스트

/**
 * 상담 과목 리스트 조회
 * @param {object} grid grid1, grid4
 */
const getProd = (grid) => {
	const settings = {
		url: `${API_SERVER}/cns.getProd.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}],
		}),
		errMsg: "상담과목 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		prods = data.dsRecv;
		grid.resetData(data.dsRecv);
	});
}

/**
 * 과목검색
 * @param {object} grid grid1, grid4
 * @param {string} column PRDT_NAME, PRDT_GRP
 * @param {string} keyword
 */
const searchProd = (grid, column, keyword) => {

	// filter
	keyword = keyword.toUpperCase();
	let data = prods.filter(el => (el[column].toUpperCase()).includes(keyword));

	// delete rowKey
	data = data.map(el => {
		return {
			PRDT_CDE: 	el.PRDT_CDE,
			PRDT_GRP: 	el.PRDT_GRP,
			PRDT_GRPNM: el.PRDT_GRPNM,
			PRDT_ID: 	el.PRDT_ID,
			PRDT_NAME: 	el.PRDT_NAME,
			PRDT_SEQ: 	el.PRDT_SEQ,
			USE: 		el.USE,
			USE_FLAG: 	el.USE_FLAG
		};
	});

	grid.resetData(data);

	// checked check
	let checkedGrid;
	if (grid.el.id === "grid1") checkedGrid = grid2;
	else if (grid.el.id === "grid4") checkedGrid = grid5;

	if (checkedGrid) {
		let checkedData = checkedGrid.getData();
		checkedData = checkedData.map(el => el.PRDT_ID);
		
		const gridData = grid.getData();
		gridData.forEach(el => {
			if(checkedData.includes(el.PRDT_ID)) {
				grid.check(el.rowKey);
			}
		});
	}

}

/**
 * 과목선택
 * @param {object} grid 
 * @param {object} data 
 */
const checkProd = (grid, data) => {

	// 중복체크
	let gridData = grid.getData();
	for(let row of gridData) {
		if(data.PRDT_ID == row.PRDT_ID) return;
	}
	
	grid.appendRow(data);
	
	// sort
	let sortKey = "PRDT_SEQ";
	gridData = grid.getData();
	gridData.sort((a, b) => {
		return a[sortKey] < b[sortKey] ? -1 :
					a[sortKey] > b[sortKey] ? 1 : 0;
	});

	// delete rowKey
	gridData = gridData.map(el => {
		return {
			PRDT_CDE: 	el.PRDT_CDE,
			PRDT_GRP: 	el.PRDT_GRP,
			PRDT_GRPNM: el.PRDT_GRPNM,
			PRDT_ID: 	el.PRDT_ID,
			PRDT_NAME: 	el.PRDT_NAME,
			PRDT_SEQ: 	el.PRDT_SEQ,
			USE: 		el.USE,
			USE_FLAG: 	el.USE_FLAG
		};
	});

	grid.resetData(gridData);
}

/**
 * 과목선택 해제
 * @param {object} grid 
 * @param {object} data 
 */
const uncheckProd = (grid, data) => {

	let id = data.PRDT_ID;
	let gridData = grid.getData();

	for (let row of gridData) {
		if (row.PRDT_ID == id) {
			grid.removeRow(row.rowKey);
			break;
		}
	}

}

/**
 * 순번 selectbox 생성
 * @param {object} $target 순번selectbox
 * @param {number} cnt     순번count
 */
const createSeq = ($target, cnt) => {
	$target.empty();
	for (let seq = 1; seq <= cnt; seq++) {
		const option = new Option(seq, seq);
		option.dataset.jobType = "U";
		$target.append(option);
	}
}

/**
 * 병행과목코드의 PLURAL_PRDT_LIST로 grid 체크하는 함수
 * - as-is : comm.js.gf_setPlProd()
 * @param {object} grid grid1, grid4
 * @param {string} data PLURAL_PRDT_LIST
 */
const setPlProd = (grid, data) => {
	const checkeds = data ? data.split("_") : "";
	const gridData = grid.getData();

	if(checkeds.length == 0) {
		gridData.forEach(el => grid.uncheck(el.rowKey));
		return;
	}

	gridData.forEach(el => {
		if (checkeds.includes(el.PRDT_ID)) {
			grid.check(el.rowKey);
		} else {
			grid.uncheck(el.rowKey);
		}
	});
}

/**
 * 선택된 과목들을 과목코드로 sorting하여 병행과목리스트 반환. 
 * - as-is : com.js.gf_getPlProd()
 * @param {object} grid grid2, grid5
 * @returns {object} { ids, names }
 */
const getPlProd = (grid) => {
	const ids = new Array();
	const names = new Array();
	
	const data = grid.getData();

	// sort
	data.sort((a, b) => a.PRDT_ID < b.PRDT_ID ? -1 : a.PRDT_ID > b.PRDT_ID ? 1 : 0);

	data.forEach(el => {
		ids.push(el.PRDT_ID);	  // 제품id
		names.push(el.PRDT_NAME); //제품명
	});

	return { ids, names };
}

/**
 * 해당코드의 NAME을 반환.
 * @param {string} mk 코드구분 
 * @param {string} id 코드ID
 */
const findCodeName = (mk, id) => {
	const code = codeData.find(el => el.CODE_MK == mk && el.CODE_ID == id);
	return code ? code.CODE_NAME : "";
}

/**
 * key 값에 따라 해당 팝업을 오픈합니다.
 * @param {string} key
 */
const openPopup = (key) => {
	switch (key) {
		case "CCEMPRO028":	// 상담연계
			PopupUtil.open(key, 830, 555);
			break;
		case "CCEMPRO029":	// 관계회원
			PopupUtil.open(key, 728, 410);
			break;
		case "CCEMPRO033":	// 고객조회
			PopupUtil.open(key, 1184, 650);
			break;
		case "CCEMPRO034":	// 선생님조회
			PopupUtil.open("CCEMPRO033", 1184, 650, "#counselMain_teacherSearchTab");
			break;
		default:
			break;
	}
}

/**
 * 사업국/센터/연계부서 팝업
 * - as-is : cns5810.openCOM1300(), openCOM1620(), openCOM1030()
 * @param {number} keyCode 
 */
const openCCEMPRO044 = (keyCode, hash) => {
	if (keyCode == 13) {
		PopupUtil.open("CCEMPRO044", 1145, 475, hash);
	}
}

/**
 * 주소 팝업
 * - as-is : cns5810.openCNS6610()
 * @param {number} keyCode 
 */
function openCCEMPRO043(keyCode){
    if(keyCode == 13){
		PopupUtil.open("CCEMPRO043", 1100, 700);
    }
}

/**
 * 상담 분류 팝업
 * - as-is : cns5810.onCselTypePopUp()
 * @param {number} keyCode 
 */
const openCCEMPRO042 = (keyCode) => {
	if (keyCode == 13) {
		PopupUtil.open("CCEMPRO042", 870, 610);
	}
}

/**
 * 팔로워 정보 반환
 * @param {array} EMP_ID_LIST 연계대상자리스트
 * @param {string} type SET, UP
 */
const getFollowers = async (EMP_ID_LIST, type) => {
	const followerData = new Array();
	for (const EMP_ID of EMP_ID_LIST) {
		const { users } = await topbarClient.request(`/api/v2/users/search.json?external_id=${EMP_ID.trim()}`);
		if (users.length > 0) {
			if (type == "UP") followerData.push({ user_id: users[0].id, action: "put" }); 
			else followerData.push({ id: users[0].id});
		}
	}
	return followerData;
}

/**
 * Zendesk 티켓 업데이트 for 추가등록/관계회원
 * @param {object} cselData    상담정보
 * @param {object} customData  커스텀필드정보
 * @param {object} EMP_ID_LIST 연계대상자ID
 */
const updateTicket = async (cselData, customData, EMP_ID_LIST) => {

	const CSEL_DATE_NO_SEQ = `${FormatUtil.date(cselData.CSEL_DATE)}_${cselData.CSEL_NO}_${cselData.CSEL_SEQ}`;
	const followerData = await getFollowers(EMP_ID_LIST, "UP");

	const option = {
		url: `/api/v2/tickets/${cselData.ZEN_TICKET_ID}`,
		method: 'PUT',
		contentType: "application/json",
		data: JSON.stringify({ 
			ticket: {
				external_id		: CSEL_DATE_NO_SEQ,
				subject			: cselData.CSEL_TITLE,	 // 제목
				comment: {
					public		: false,				 // 내부메모
					body		: cselData.CSEL_CNTS,	 // 상담내용
				},
				followers		: followerData,			 // 팔로워
				custom_fields: [
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_DATE_NO_SEQ"], 		value: CSEL_DATE_NO_SEQ }, 									// 상담번호
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_LTYPE_CDE"],		value: cselData.CSEL_LTYPE_CDE }, 							// 상담분류(대)  
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_MTYPE_CDE"],		value: cselData.CSEL_MTYPE_CDE }, 							// 상담분류(중)  
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_STYPE_CDE"],		value: cselData.CSEL_STYPE_CDE }, 							// 상담분류(소)  
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_MK"],				value: `csel_mk_${cselData.CSEL_MK}` }, 					// 상담구분   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_CHNL_MK"],			value: `csel_chnl_mk_${cselData.CSEL_CHNL_MK}` }, 			// 상담채널   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CUST_RESP_MK"],			value: `cust_resp_mk_${cselData.CUST_RESP_MK}` },			// 고객반응   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["CALL_RST_MK"],			value: `call_rst_mk_${counselData.CALL_RST_MK}` },				// 통화결과(O/B결과)
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_RST_MK"],			value: `csel_rst_mk_${cselData.CSEL_RST_MK1}` },			// 상담결과   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_MK"],				value: `proc_mk_${cselData.PROC_MK}` },						// 처리구분   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CUST_MK"],				value: `cust_mk_${cselData.CUST_MK}`.toLowerCase() },		// 고객구분   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_STS_MK"],			value: `proc_sts_mk_${cselData.PROC_STS_MK}` },				// 처리상태   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["MOTIVE_CDE"],				value: `std_motive_cde_${counselData.MOTIVE_CDE}` },			// 입회사유   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["CALL_RST_MK_OB"],			value: `call_rst_mk_ob_${?}` },									// OB결과   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["AGE_GRADE_CDE"],			value: `${customData.ageCde}::${counselData.GRADE_CDE}`.toLowerCase() },// 학년(연령::학년)
					{ id: ZDK_INFO[_SPACE]["ticketField"]["PRDT"],					value: customData.prdtList },								// 과목   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["DEPT_IDNM"],				value: customData.deptIdNm },								// 지점부서명(사업국명)   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["DIV_CDE"],				value: `div_cde_${cselData.DIV_CDE}`.toLowerCase() },		// 지점본부명(본부코드)   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["AREA_CDENM"],			value: customData.aeraCdeNm },								// 지역코드명  
					{ id: ZDK_INFO[_SPACE]["ticketField"]["FST_CRS_CDE"],			value: findCodeName("STD_CRS_CDE", cselData.FST_CRS_CDE) },	// 첫상담경로   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["VOC_MK"],				value: cselData.VOC_MK == "Y" ? true : false },				// VOC여부   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_GRD"],				value: `csel_grd_${cselData.CSEL_GRD}` },					// 상담등급   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_DEPT_IDNM"],		value: customData.procDeptIdNm },							// 연계부서명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["TRANS_CHNL_MK"],			value: `trans_chnl_mk_${?}` },									// 현장연계 연계방법   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["RTN_FLAG"],				value: `rtn_flag_${?}` },										// 회신여부   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["TRANS_MK"],				value: `trans_mk_${?}` },										// 현장연계 연계구분   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["TRANS_DEPT_IDNM"],		value: "" },													// 현장연계 지점명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["LC_IDNM"],				value: "" },													// 현장연계 러닝센터명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE_TIME"],	value: "0일1시간0분0초" },				      					 // 현장연계 지점처리시간   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE_MS"],	value: Number },												// 현장연계 지점처리시간(ms) 
					// { id: ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE"],		value: "2018-04-03T05:10:58.000Z" },							// 현장연계 일시   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["PROC_EMP_IDNM"],			value: "" },													// 현장처리 처리자명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_DATE1_TIME1"],		value: "2018-04-03 05:10:58" },									// 1차 해피콜 일시   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CNTS1"],			value: "" },													// 1차 해피콜 내용   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CHNL_MKNM1"],		value: "" },													// 1차 해피콜 경로   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_USER_IDNM1"],		value: "" },													// 1차 해피콜 상담원명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["SATIS_CDENM1"],			value: "" },													// 1차 해피콜 고객만족도   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_DATE2_TIME2"],		value: "" },													// 2차 해피콜 일시   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CNTS2"],			value: "" },													// 2차 해피콜 내용   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CHNL_MKNM2"],		value: "" },													// 2차 해피콜 경로   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["HPCALL_USER_IDNM2"],		value: "" },													// 2차 해피콜 상담원명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["SATIS_CDENM2"],			value: "" },													// 2차 해피콜 고객만족도   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["GIFT_NAME"],				value: "" },													// 사은품명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["GIFT_PRICE"],				value: "" },													// 사은품 가격   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["SEND_DATE"],				value: Date },													// 사은품 발송일자   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["GIFT_CHNL_MKNM"],			value: "" },													// 사은품 발송경로   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["PASS_USER"],				value: "" },													// 사은품 전달자명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["INVOICENUM"],				value: "" },													// 사은품 송장번호   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_PROC_DATE"],			value: "" },													// 상담원처리 처리일시   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_PROC_USER_NAME"],	value: "" },													// 상담원처리 처리자명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_PROC_CNTS"],			value: "" },													// 상담원처리 처리내용   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["OB_MK"],					value: `oblist_cde_${?}` },										// OB구분   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["DEPT_ACP_DATE_TIME"],		value: "" },													// 현장연계 접수일시   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["DEPT_ACP_NAME"],			value: "" },													// 현장연계 접수자명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["LIST_CUST_ID"],			value: "" },													// 리스트ID_고객번호   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["IS_HPCALL"],				value: Boolean },												// 해피콜 여부   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["FIN_YN"],					value: "fin_yn_${?}" },											// 통화여부   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["CALLBACK_ID"],			value: "" },													// 콜백번호   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["LIST_MK"],				value: `list_mk_${?}` },										// 리스트구분   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["LC_NAME"],				value: customData.lcName },									// 러닝센터명(센터)
					{ id: ZDK_INFO[_SPACE]["ticketField"]["LC_MK"],					value: cselData.LC_MK == "Y" ? true : false },				// LC여부   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["HL_MK"],					value: cselData.HL_MK == "Y" ? true : false },				// HL여부   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["YC_MK"],					value: cselData.YC_MK == "Y" ? true : false },				// YC여부   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["VISIT_CHNL"],				value: "" },												// 방문채널   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["TCH_NM"],					value: "" },												// 교사명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["TCH_NO"],					value: "" },												// 교사사번   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["TCH_WRK_MNT"],			value: Number },											// 교사근무개월수   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["RE_PROC"],				value: cselData.RE_PROC == "1" ? true : false },			// 재확인여부   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["RECL_CNTCT"],			value: customData.reclCntct },								// 재통화 연락처   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["RECL_CMPLT"],				value: Boolean },											// 재통화 완료   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["OFCL_RSPN"],				value: "" },												// 직책   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["JOB"],					value: "" },												// 직무   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["DIV_KIND_CDE"],			value: `div_kind_cde_${customData.brandId}` },					// 브랜드   
				],
			}
		}),
	}
	
	await topbarClient.request(option);
}

/**
 * Zendesk 티켓필드 입력
 * @param {object} counselData 상담정보
 * @param {obejct} customData  커스텀필드정보
 * @param {obejct} EMP_ID_LIST 연계대상자ID
 */
const setTicket = async (counselData, customData, EMP_ID_LIST) => {

	const CSEL_DATE_NO_SEQ = `${FormatUtil.date(counselData.CSEL_DATE)}_${counselData.CSEL_NO}_${counselData.CSEL_SEQ}`;
	const followerData = await getFollowers(EMP_ID_LIST, "SET");

	let req = new Object()
	req["ticket.subject"] = counselData.CSEL_TITLE;
	req["ticket.externalId"] = CSEL_DATE_NO_SEQ;
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_DATE_NO_SEQ"]}`] 		 = CSEL_DATE_NO_SEQ;										 // 상담번호
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_LTYPE_CDE"]}`]          = counselData.CSEL_LTYPE_CDE;                               // 상담분류(대)  
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_MTYPE_CDE"]}`]          = counselData.CSEL_MTYPE_CDE;                               // 상담분류(중)  
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_STYPE_CDE"]}`]          = counselData.CSEL_STYPE_CDE;                               // 상담분류(소)  
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_MK"]}`]                 = `csel_mk_${counselData.CSEL_MK}`;                         // 상담구분   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_CHNL_MK"]}`]            = `csel_chnl_mk_${counselData.CSEL_CHNL_MK}`;               // 상담채널   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CUST_RESP_MK"]}`]            = `cust_resp_mk_${counselData.CUST_RESP_MK}`;               // 고객반응   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CALL_RST_MK"]}`]             = `call_rst_mk_${counselData.CALL_RST_MK}`;                 // 통화결과(O/B결과)
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_RST_MK"]}`]             = `csel_rst_mk_${counselData.CSEL_RST_MK1}`;                // 상담결과   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_MK"]}`]                 = `proc_mk_${counselData.PROC_MK}`;                         // 처리구분   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CUST_MK"]}`]                 = `cust_mk_${counselData.CUST_MK}`.toLowerCase();           // 고객구분   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_STS_MK"]}`]             = `proc_sts_mk_${counselData.PROC_STS_MK}`;                 // 처리상태   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["MOTIVE_CDE"]}`]              = `std_motive_cde_${counselData.MOTIVE_CDE}`;               // 입회사유
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CALL_RST_MK_OB"]}`]          = `call_rst_mk_ob_${?}`;                                    // OB결과
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["AGE_GRADE_CDE"]}`]           = `${customData.ageCde}::${counselData.GRADE_CDE}`.toLowerCase(); // 학년
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PRDT"]}`]                    = customData.customPrdtList;                                // 과목   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DEPT_IDNM"]}`]               = customData.customDeptIdNm;                                // 지점부서명(사업국명)   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DIV_CDE"]}`]                 = `div_cde_${counselData.DIV_CDE}`.toLowerCase();           // 지점본부명(본부코드)   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["AREA_CDENM"]}`]              = customData.customAeraCdeNm;                               // 지역코드명  
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["FST_CRS_CDE"]}`]             = findCodeName("STD_CRS_CDE", counselData.FST_CRS_CDE);     // 첫상담경로   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["VOC_MK"]}`]                  = counselData.VOC_MK == "Y" ? true : false;                 // VOC여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_GRD"]}`]                = `csel_grd_${counselData.CSEL_GRD}`;                       // 상담등급   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_DEPT_IDNM"]}`]          = customData.customProcDeptIdNm;                            // 연계부서명   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TRANS_CHNL_MK"]}`]           = `trans_chnl_mk_${?}`;                                     // 현장연계 연계방법
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RTN_FLAG"]}`]                = `rtn_flag_${?}`;                                          // 회신여부
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TRANS_MK"]}`]                = `trans_mk_${?}`;                                          // 현장연계 연계구분
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TRANS_DEPT_IDNM"]}`]         = "";                                                       // 현장연계 지점명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LC_IDNM"]}`]                 = "";                                                       // 현장연계 러닝센터명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE_TIME"]}`]   = "0일1시간0분0초";                                          // 현장연계 지점처리시간
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE_MS"]}`]     = Number;                                                   // 현장연계 지점처리시간(ms
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE"]}`]        = "2018-04-03T05:10:58.000Z";                               // 현장연계 일시
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_EMP_IDNM"]}`]           = "";                                                       // 현장처리 처리자명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HPCALL_DATE1_TIME1"]}`]      = "2018-04-03 05:10:58";                                    // 1차 해피콜 일시
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CNTS1"]}`]            = "";                                                       // 1차 해피콜 내용
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CHNL_MKNM1"]}`]       = "";                                                       // 1차 해피콜 경로
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HPCALL_USER_IDNM1"]}`]       = "";                                                       // 1차 해피콜 상담원명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["SATIS_CDENM1"]}`]            = "";                                                       // 1차 해피콜 고객만족도
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HPCALL_DATE2_TIME2"]}`]      = "";                                                       // 2차 해피콜 일시
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CNTS2"]}`]            = "";                                                       // 2차 해피콜 내용
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HPCALL_CHNL_MKNM2"]}`]       = "";                                                       // 2차 해피콜 경로
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HPCALL_USER_IDNM2"]}`]       = "";                                                       // 2차 해피콜 상담원명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["SATIS_CDENM2"]}`]            = "";                                                       // 2차 해피콜 고객만족도
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["GIFT_NAME"]}`]               = "";                                                       // 사은품명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["GIFT_PRICE"]}`]              = "";                                                       // 사은품 가격
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["SEND_DATE"]}`]               = Date;                                                     // 사은품 발송일자
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["GIFT_CHNL_MKNM"]}`]          = "";                                                       // 사은품 발송경로
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PASS_USER"]}`]               = "";                                                       // 사은품 전달자명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["INVOICENUM"]}`]              = "";                                                       // 사은품 송장번호
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_PROC_DATE"]}`]          = "";                                                       // 상담원처리 처리일시
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_PROC_USER_NAME"]}`]     = "";                                                       // 상담원처리 처리자명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_PROC_CNTS"]}`]          = "";                                                       // 상담원처리 처리내용
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["OB_MK"]}`]                   = `oblist_cde_${?}`;                                        // OB구분
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DEPT_ACP_DATE_TIME"]}`]      = "";                                                       // 현장연계 접수일시
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DEPT_ACP_NAME"]}`]           = "";                                                       // 현장연계 접수자명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LIST_CUST_ID"]}`]            = "";                                                       // 리스트ID_고객번호
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["IS_HPCALL"]}`]               = Boolean;                                                  // 해피콜 여부
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["FIN_YN"]}`]                  = "fin_yn_${?}";                                            // 통화여부
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CALLBACK_ID"]}`]             = "";                                                       // 콜백번호
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LIST_MK"]}`]                 = `list_mk_${?}`;                                           // 리스트구분
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LC_NAME"]}`]                 = customData.customLcName;                                  // 러닝센터명(센터)
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LC_MK"]}`]                   = counselData.LC_MK == "Y" ? true : false;                  // LC여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HL_MK"]}`]                   = counselData.HL_MK == "Y" ? true : false;                  // HL여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["YC_MK"]}`]                   = counselData.YC_MK == "Y" ? true : false;                  // YC여부   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["VISIT_CHNL"]}`]              = "";                                                       // 방문채널
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TCH_NM"]}`]                  = "";                                                       // 교사명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TCH_NO"]}`]                  = "";                                                       // 교사사번
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TCH_WRK_MNT"]}`]             = Number;                                                   // 교사근무개월수
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RE_PROC"]}`]                 = counselData.RE_PROC == "1" ? true : false;                // 재확인여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RECL_CNTCT"]}`]              = customData.customReclCntct;                               // 재통화 연락처   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RECL_CMPLT"]}`]              = Boolean;                                                  // 재통화 완료         
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["OFCL_RSPN"]}`]               = "";                                                       // 직책 
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["JOB"]}`]                     = "";                                                       // 직무 
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DIV_KIND_CDE"]}`]            = `div_kind_cde_${customData.brandId}`;						// 브랜드  
	
	
	await sidebarClient.set(req);											 // 티켓필드 입력
	await sidebarClient.set("comment.type", "internalNote");				 // 내부메모로 변경
	await sidebarClient.invoke('comment.appendText', counselData.CSEL_CNTS); // 코멘트입력
	for (follower of followerData) {
		await sidebarClient.invoke('ticket.collaborators.add', follower);	 // 팔로워세팅
	}
	
}

/**
 * 티켓이 유효한지 체크
 * @param {string} jobType       저장구분(I, U)
 * @param {string} ZEN_TICKET_ID 티켓ID
 */
const checkTicket = async (jobType, ZEN_TICKET_ID) => {
    
    sidebarClient = topbarObject.sidebarClient;	// 현재 활성화된 티켓을 가져온다.

    if (!sidebarClient) {
        alert("대상티켓이 없습니다.\n\n[티켓오픈] 또는 [티켓생성]을 먼저 하고, 처리 하시기 바랍니다.");
        return false;
    }

    const { ticket } = await sidebarClient.get("ticket");
    if (!ticket) {
        alert("대상티켓이 없습니다.\n\n[티켓오픈] 또는 [티켓생성]을 먼저 하고, 처리 하시기 바랍니다.");
        return false;
    }

    // 신규일때
    if (jobType == "I") {

        if (ticket.externalId) {
            alert("이미 상담이 등록된 티켓입니다.\n\n[티켓오픈] 또는 [티켓생성]을 먼저 하고, 처리 하시기 바랍니다.");
            return false;
        }
    }
    // 수정일때
    else {

        if (ZEN_TICKET_ID && ZEN_TICKET_ID != ticket.id) {
            alert(`현재 상담정보의 티켓이 아닙니다. \n\n#${ZEN_TICKET_ID} 티켓을 다시 오픈해 주시기 바랍니다.`);
            return false;
        }
    }

    return ticket.id;

}
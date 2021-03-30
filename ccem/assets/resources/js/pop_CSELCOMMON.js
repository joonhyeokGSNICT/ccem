var topbarObject;		// tobar window
var topbarClient;		// tobar client
var sidebarClient;		// sidebar client
var currentTicket;		// 현재 사용중인 티켓정보
var currentUser;		// 현재 사용중인 유저의 정보(ZENDESK)
var codeData = [];		// 공통코드-전체
var prods	 = [];		// 과목리스트

/**
 * 상담 과목 리스트 조회
 * @param {object} grid grid1, grid4
 */
const getProd = () => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/cns.getProd.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담등록",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}],
		}),
		errMsg: "상담과목 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings)
		.done(data => {
			if (!checkApi(data, settings)) return reject(new Error(getApiMsg(data, settings)));
			return resolve(data.dsRecv || []);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

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
 * @param {object} removeGrid 	상담과목, 입회과목 grid
 * @param {object} unCheckGrid 	과목 grid
 * @param {object} unCheckRowKey 
 */
const uncheckProd = (removeGrid, unCheckGrid, unCheckRowKey) => {

	const findId = unCheckGrid.getValue(unCheckRowKey, "PRDT_ID");
	const removeGridData = removeGrid.getData();
	const findData = removeGridData.find(el => el.PRDT_ID == findId);
	if (findData) {
		removeGrid.removeRow(findData.rowKey);
	} else {
		// unCheckGrid.uncheck(unCheckRowKey);
	}

}

/**
 * 과목선택 삭제
 * @param {object} unCheckGrid 	 과목 grid
 * @param {object} removeGrid 	 상담과목, 입회과목 grid
 * @param {object} removeRowKey 
 */
const deleteProd = (unCheckGrid, removeGrid, removeRowKey) => {

	const findId = removeGrid.getValue(removeRowKey, "PRDT_ID");
	const unCheckGridData = unCheckGrid.getData();
	const findData = unCheckGridData.find(el => el.PRDT_ID == findId);
	if (findData) {
		unCheckGrid.uncheck(findData.rowKey);
	} else {
		removeGrid.removeRow(removeRowKey);
	}

}

/**
 * 상담순번 selectbox 생성
 * @param {object} $target 	 상담순번 selectbox
 * @param {array} DS_COUNSEL 상담데이터셋
 */
const createSeq = ($target, DS_COUNSEL) => {
	$target.empty();
	DS_COUNSEL.forEach(el => {
		const option = new Option(el.CSEL_SEQ, el.CSEL_SEQ);
		option.dataset.jobType = "U";
		$target.append(option);
	});
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
 * 학년코드에 해당하는 연령코드 반환.
 * @param {string} id 학년구분
 * @returns [연령코드::학년코드]
 */
const findGradeAgeCde = (id) => {
	const code = codeData.find(el => el.CODE_MK == "GRADE_CDE" && el.CODE_ID == id);
	return code ? `${Number(code.ETC)}::${code.CODE_ID}`.toLowerCase() : "";
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
 * 상담 분류 팝업 for 상담등록
 * - as-is : cns5810.onCselTypePopUp()
 * @param {number} keyCode 
 */
const openCCEMPRO042 = (keyCode) => {
	if (keyCode == 13) {
		PopupUtil.open("CCEMPRO042", 870, 610);
	}
}

/**
 * 상담 분류 팝업 for 입회등록/선생님소개
 * - as-is : cns4700.GRD_MBRINFO.OnPopup()
 * @param {number} keyCode 
 */
const openCCEMPRO042_2 = (keyCode) => {
	if (keyCode == 13) {
		PopupUtil.open("CCEMPRO042_2", 870, 400);
	}
}

/**
 * Zendesk 사용자정보 조회
 * @param {string} external_id 고객번호
 */
const zendeskUserSearch = (external_id) => topbarClient.request(`/api/v2/users/search.json?external_id=${external_id}`);

/**
 * Zendesk show ticket
 * @param {string|number} ticket_id 티켓번호
 */
const zendeskShowTicket = (ticket_id) => topbarClient.request(`/api/v2/tickets/${ticket_id}`);

/**
 * 팔로워 정보 반환
 * @param {array} EMP_ID_LIST 연계대상자리스트
 * @param {string} type SET, UP
 */
const getFollowers = async (EMP_ID_LIST = [], type) => {
	const followerData = new Array();
	for (const EMP_ID of EMP_ID_LIST) {
		const { users } = await zendeskUserSearch(EMP_ID.trim());
		if (users.length > 0) {
			if (type == "UP") followerData.push({ user_id: users[0].id, action: "put" }); 
			else followerData.push({ id: users[0].id});
		}
	}
	return followerData;
}

/**
 * Zendesk 티켓 업데이트 for 상담등록/입회등록/선생님소개
 * @param {object} cselData    상담정보
 * @param {object} customData  티켓정보
 */
const updateTicket = async (cselData, customData) => {

	// 팔로워 세팅
	const followerData 	= await getFollowers(customData.empList, "UP");
	
	// 상담번호 티켓필드 세팅
	const CSEL_DATE_NO_SEQ = `${FormatUtil.date(cselData.CSEL_DATE)}_${cselData.CSEL_NO}_${cselData.CSEL_SEQ}`; 

	// 상담결과	티켓필드 세팅
	let CSEL_RST_MK1 = ""; 
	if (cselData.CSEL_RST_MK1) {
		CSEL_RST_MK1 = `csel_rst_mk_${Number(cselData.CSEL_RST_MK1)}`;
	} else {
		if (cselData.ORG_CSEL_RST_MK1 == "12") CSEL_RST_MK1 = "";
		else CSEL_RST_MK1 = `csel_rst_mk_${Number(cselData.ORG_CSEL_RST_MK1)}`;
	}

	// 티켓필드 세팅
	const custom_fields = [
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_DATE_NO_SEQ"], 		value: CSEL_DATE_NO_SEQ }, 									// 상담번호
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_LTYPE_CDE"],		value: cselData.CSEL_LTYPE_CDE }, 							// 상담분류(대)  
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_MTYPE_CDE"],		value: cselData.CSEL_MTYPE_CDE }, 							// 상담분류(중)  
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_STYPE_CDE"],		value: cselData.CSEL_STYPE_CDE }, 							// 상담분류(소)  
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_MK"],				value: `csel_mk_${Number(cselData.CSEL_MK)}` },				// 상담구분   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_CHNL_MK"],			value: `csel_chnl_mk_${Number(cselData.CSEL_CHNL_MK)}` },	// 상담채널   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CUST_RESP_MK"],			value: `cust_resp_mk_${Number(cselData.CUST_RESP_MK)}` },	// 고객반응   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["CALL_RST_MK"],			value: `call_rst_mk_${Number(cselData.CALL_RST_MK)}` },		// 통화결과(O/B결과)
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_RST_MK"],			value: CSEL_RST_MK1 },										// 상담결과   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_MK"],				value: `proc_mk_${Number(cselData.PROC_MK)}` },				// 처리구분   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CUST_MK"],				value: `cust_mk_${cselData.CUST_MK}`.toLowerCase() },		// 고객구분   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_STS_MK"],			value: `proc_sts_mk_${Number(cselData.PROC_STS_MK)}` },		// 처리상태   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["MOTIVE_CDE"],			value: `std_motive_cde_${Number(cselData.MOTIVE_CDE)}` },	// 입회사유   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["AGE_GRADE_CDE"],			value: findGradeAgeCde(cselData.GRADE_CDE) },				// 학년(연령::학년)
		{ id: ZDK_INFO[_SPACE]["ticketField"]["PRDT"],					value: customData.prdtList },								// 과목   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["DEPT_IDNM"],				value: customData.deptIdNm },								// 지점부서명(사업국명)   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["DIV_CDE"],				value: `div_cde_${cselData.DIV_CDE}`.toLowerCase() },		// 지점본부명(본부코드)   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["DIV_CDENM"],				value: findCodeName("DIV_CDE", cselData.DIV_CDE) },			// 지점본부명(본부명)   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["AREA_CDENM"],			value: customData.aeraCdeNm },								// 지역코드명  
		{ id: ZDK_INFO[_SPACE]["ticketField"]["FST_CRS_CDE"],			value: findCodeName("STD_CRS_CDE", cselData.FST_CRS_CDE) },	// 첫상담경로   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["VOC_MK"],				value: cselData.VOC_MK == "Y" },							// VOC여부   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_GRD"],				value: `csel_grd_${Number(cselData.CSEL_GRD)}` },			// 상담등급   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_DEPT_IDNM"],		value: customData.procDeptIdNm },							// 연계부서명   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["TRANS_CHNL_MK"],			value: `trans_chnl_mk_${?}` },									// 현장연계 연계방법   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["RTN_FLAG"],				value: `rtn_flag_${?}` },										// 회신여부   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["TRANS_MK"],				value: `trans_mk_${Number(customData.transMk)}` },					// 현장연계 연계구분   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["TRANS_DEPT_IDNM"],		value: "" },													// 현장연계 지점명   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["LC_IDNM"],				value: "" },													// 현장연계 러닝센터명   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE_TIME"],	value: "0일1시간0분0초" },				      					 // 현장연계 지점처리시간   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE_MS"],	value: Number },												// 현장연계 지점처리시간(ms) 
		// { id: ZDK_INFO[_SPACE]["ticketField"]["TRANS_DATE_TIME"],		value: "2018-04-03T05:10:58.000Z" },							// 현장연계 일시   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE"],		value: "" },													// 현장처리 일시   
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
		{ id: ZDK_INFO[_SPACE]["ticketField"]["LC_MK"],					value: cselData.LC_MK == "Y" },								// LC여부   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["HL_MK"],					value: cselData.HL_MK == "Y" },								// HL여부   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["YC_MK"],					value: cselData.YC_MK == "Y" },								// YC여부   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["VISIT_CHNL"],				value: "" },												// 방문채널   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["TCH_NM"],					value: "" },												// 교사명   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["TCH_NO"],					value: "" },												// 교사사번   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["TCH_WRK_MNT"],			value: Number },											// 교사근무개월수   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["RE_PROC"],				value: cselData.RE_PROC == "1" },							// 재확인여부   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["RECL_CNTCT"],			value: customData.reclCntct },								// 재통화 연락처   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["RECL_CMPLT"],				value: Boolean },											// 재통화 완료   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["OFCL_RSPN"],				value: "" },												// 직책   
		// { id: ZDK_INFO[_SPACE]["ticketField"]["JOB"],					value: "" },												// 직무   
		{ id: ZDK_INFO[_SPACE]["ticketField"]["DIV_KIND_CDE"],			value: `div_kind_cde_${Number(customData.brandId)}` },		// 브랜드   
	];

	if (cselData.RE_CALL_CMPLT) {
		custom_fields.push({ id: ZDK_INFO[_SPACE]["ticketField"]["RECL_CMPLT"], value: cselData.RE_CALL_CMPLT == "Y" });			// 재통화 완료  
	}

	const option = {
		url: `/api/v2/tickets/${cselData.ZEN_TICKET_ID}`,
		method: 'PUT',
		contentType: "application/json",
		data: JSON.stringify({ 
			ticket: {
				assignee_id		: cselData.ASSIGNEE_ID,	 // 젠데스크 담당자
				external_id		: CSEL_DATE_NO_SEQ,		 // 티켓 external_id (0000-00-00_0_0)
				subject			: cselData.CSEL_TITLE,	 // 제목
				comment: {
					public		: false,				 // 내부메모
					body		: cselData.CSEL_CNTS,	 // 상담내용
				},
				requester_id	: customData.requesterId,// 요청자ID
				followers		: followerData,			 // 팔로워
				custom_fields,							 // 커스텀 티켓필드
			}
		}),
	}
	
	await topbarClient.request(option);
}

/**
 * Zendesk 티켓필드 입력 - 사용안함
 * @param {object} cselData 	상담정보
 * @param {obejct} customData   티켓정보
 */
const setTicket = async (cselData, customData) => {

	// 팔로워 세팅
	const followerData = await getFollowers(customData.empList, "SET");

	// 상담번호 티켓필드 세팅
	const CSEL_DATE_NO_SEQ = `${FormatUtil.date(cselData.CSEL_DATE)}_${cselData.CSEL_NO}_${cselData.CSEL_SEQ}`;

	// 상담결과	티켓필드 세팅
	let CSEL_RST_MK1 = ""; 
	if (cselData.CSEL_RST_MK1) {
		CSEL_RST_MK1 = `csel_rst_mk_${Number(cselData.CSEL_RST_MK1)}`;
	} else {
		if (cselData.ORG_CSEL_RST_MK1 == "12") CSEL_RST_MK1 = "";
		else CSEL_RST_MK1 = `csel_rst_mk_${Number(cselData.ORG_CSEL_RST_MK1)}`;
	}

	// 티켓필드 세팅
	const req = new Object()
	req["ticket.assignee"]   = { groupId: currentUser.default_group_id, userId: currentUser.id }; // 담당자(상담원)
	req["ticket.requester"]  = { id: customData.requesterId };	// 요청자ID
	req["ticket.subject"] 	 = cselData.CSEL_TITLE;				// 제목
	req["ticket.externalId"] = CSEL_DATE_NO_SEQ;				// 티켓 external_id (0000-00-00_0_0)
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_DATE_NO_SEQ"]}`] 		 = CSEL_DATE_NO_SEQ;									  // 상담번호
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_LTYPE_CDE"]}`]          = cselData.CSEL_LTYPE_CDE;                               // 상담분류(대)  
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_MTYPE_CDE"]}`]          = cselData.CSEL_MTYPE_CDE;                               // 상담분류(중)  
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_STYPE_CDE"]}`]          = cselData.CSEL_STYPE_CDE;                               // 상담분류(소)  
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_MK"]}`]                 = `csel_mk_${Number(cselData.CSEL_MK)}`;				  // 상담구분   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_CHNL_MK"]}`]            = `csel_chnl_mk_${Number(cselData.CSEL_CHNL_MK)}`;		  // 상담채널   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CUST_RESP_MK"]}`]            = `cust_resp_mk_${Number(cselData.CUST_RESP_MK)}`;		  // 고객반응   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CALL_RST_MK"]}`]             = `call_rst_mk_${Number(cselData.CALL_RST_MK)}`;	  	// 통화결과(O/B결과)
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_RST_MK"]}`]             = CSEL_RST_MK1;		  							      // 상담결과   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_MK"]}`]                 = `proc_mk_${Number(cselData.PROC_MK)}`;				  // 처리구분   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CUST_MK"]}`]                 = `cust_mk_${cselData.CUST_MK}`.toLowerCase();           // 고객구분   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_STS_MK"]}`]             = `proc_sts_mk_${Number(cselData.PROC_STS_MK)}`;		  // 처리상태   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["MOTIVE_CDE"]}`]              = `std_motive_cde_${Number(cselData.MOTIVE_CDE)}`;		  // 입회사유
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["AGE_GRADE_CDE"]}`]           = findGradeAgeCde(cselData.GRADE_CDE); 				  // 학년
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PRDT"]}`]                    = customData.customPrdtList;                              // 과목   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DEPT_IDNM"]}`]               = customData.customDeptIdNm;                              // 지점부서명(사업국명)   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DIV_CDE"]}`]                 = `div_cde_${cselData.DIV_CDE}`.toLowerCase();            // 지점본부명(본부코드)   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DIV_CDENM"]}`]               = findCodeName("DIV_CDE", cselData.DIV_CDE);              // 지점본부명(본부명)   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["AREA_CDENM"]}`]              = customData.customAeraCdeNm;                             // 지역코드명  
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["FST_CRS_CDE"]}`]             = findCodeName("STD_CRS_CDE", cselData.FST_CRS_CDE);      // 첫상담경로   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["VOC_MK"]}`]                  = cselData.VOC_MK == "Y";				                   // VOC여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_GRD"]}`]                = `csel_grd_${Number(cselData.CSEL_GRD)}`;				   // 상담등급   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_DEPT_IDNM"]}`]          = customData.customProcDeptIdNm;                          // 연계부서명   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TRANS_CHNL_MK"]}`]           = `trans_chnl_mk_${?}`;                                     // 현장연계 연계방법
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RTN_FLAG"]}`]                = `rtn_flag_${?}`;                                          // 회신여부
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TRANS_MK"]}`]                = `trans_mk_${Number(customData.transMk)}`;   			   // 현장연계 연계구분
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TRANS_DEPT_IDNM"]}`]         = "";                                                       // 현장연계 지점명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LC_IDNM"]}`]                 = "";                                                       // 현장연계 러닝센터명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE_TIME"]}`]   = "0일1시간0분0초";                                          // 현장연계 지점처리시간
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE_MS"]}`]     = Number;                                                   // 현장연계 지점처리시간(ms
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TRANS_DATE_TIME"]}`]         = "2018-04-03T05:10:58.000Z";                               // 현장연계 일시
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_CTI_CHGDATE"]}`]        = "";                                						// 현장처리 일시
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
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LC_NAME"]}`]                 = customData.customLcName;                               // 러닝센터명(센터)
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LC_MK"]}`]                   = cselData.LC_MK == "Y";				                  // LC여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HL_MK"]}`]                   = cselData.HL_MK == "Y";				                  // HL여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["YC_MK"]}`]                   = cselData.YC_MK == "Y";				                  // YC여부   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["VISIT_CHNL"]}`]              = "";                                                       // 방문채널
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TCH_NM"]}`]                  = "";                                                       // 교사명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TCH_NO"]}`]                  = "";                                                       // 교사사번
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TCH_WRK_MNT"]}`]             = Number;                                                   // 교사근무개월수
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RE_PROC"]}`]                 = cselData.RE_PROC == "1";                				  // 재확인여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RECL_CNTCT"]}`]              = customData.customReclCntct;                            // 재통화 연락처   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RECL_CMPLT"]}`]              = Boolean;                                                  // 재통화 완료         
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["OFCL_RSPN"]}`]               = "";                                                       // 직책 
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["JOB"]}`]                     = "";                                                       // 직무 
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DIV_KIND_CDE"]}`]            = `div_kind_cde_${Number(customData.brandId)}`;		  // 브랜드  
	
	if (cselData.RE_CALL_CMPLT) {
		req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RECL_CMPLT"]}`]          = cselData.RE_CALL_CMPLT == "Y";	    				  // 재통화 완료         
	}

	await sidebarClient.set(req);										  // 티켓필드 입력
	await sidebarClient.set("comment.type", "internalNote");			  // 내부메모로 변경
	await sidebarClient.invoke('comment.appendText', cselData.CSEL_CNTS); // 코멘트입력
	for (follower of followerData) {
		await sidebarClient.invoke('ticket.collaborators.add', follower); // 팔로워세팅
	}
	
}

/**
 * 티켓이 유효한지 체크
 */
const checkTicket = async () => {

	if (!currentTicket) {
		alert("대상티켓이 없습니다.\n\n[티켓오픈] 또는 [티켓생성]을 먼저 하고, 처리 하시기 바랍니다.");
		return false;
	}

	// if (currentTicket.externalId) {
	// 	alert("이미 상담이 등록된 티켓입니다.\n\n[티켓오픈] 또는 [티켓생성]을 먼저 하고, 처리 하시기 바랍니다.");
	// 	return false;
	// }

	const CSEL_DATE_NO_SEQ = getCustomFieldValue(currentTicket, ZDK_INFO[_SPACE]["ticketField"]["CSEL_DATE_NO_SEQ"]);
	if (CSEL_DATE_NO_SEQ) {
		alert(`#${currentTicket.id} 이미 상담이 등록된 티켓입니다.\n\n[티켓오픈] 또는 [티켓생성]을 먼저 하고, 처리 하시기 바랍니다.`);
		return false;
	}

	if (currentTicket.status == "closed") {
		alert(`#${currentTicket.id} 티켓 상태가 종료일 경우 티켓이 업데이트되지 않습니다.`);
		return false;
	}

    return currentTicket.id;
}

/**
 * 티켓생성 전 사용자가 있는지 체크하고 없으면 생성.
 * @return {number|boolean} Zendesk user id
 */
const checkUser = async (target, CUST_ID, CUST_NAME) => {

	if (!CUST_ID || !CUST_NAME) {
		alert("조회된 고객이 없습니다.\n\n[고객조회]또는[선생님조회]를 먼저 하고, 처리 하시기 바랍니다.");
		return false;
	}

	let sMsg = "";
	sMsg += "\n * 고객번호 : " + CUST_ID;
	sMsg += "\n * 고객명   : " + CUST_NAME;
	sMsg += "\n\n 위 항목으로 티켓을 생성 하시겠습니까?";
	if (confirm(sMsg) == false) return false;

	const { users } = await zendeskUserSearch(CUST_ID.trim());
	
	// 젠데스크 사용자가 없으면 사용자생성
	// let user_id = "";
	// if (users.length === 0) {
	// 	const custInfo = await getCustInfo(target, CUST_ID);
	// 	const { user } = await createUser(target, custInfo);
	// 	user_id = user.id;
	// } else {
	// 	user_id = users[0].id;
	// }

	// 젠데스크 사용자생성은 topbar에서 처리함.
	if (users.length === 0) {
		alert("해당 회원을 젠데스크 사용자로 등록 중 입니다. 잠시후 다시 시도해 주세요.(최대 1~2분 소요)\n\n이 오류가 반복되면 관리자에게 문의하세요.");
		return false;
	}

	return users[0].id;
}

/**
 * 고객정보조회 for createUser()
 */
const getCustInfo = (target, custId) => new Promise((resolve, reject) => {
	
	let service, condition;

	// 고객
	if (target == "C") {
		service = "/cns.getCustInfo.do";
		condition = { CUST_ID: custId };
	// 선생님
	} else if (target == "T") {
		service = "/cns.getTchrInfoDtl.do";
		condition = { EMP_ID: custId };
	}

	const settings = {
		global: false,
		url: `${API_SERVER + service}`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담등록",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg: "고객정보조회 중 오류가 발생하였습니다.",
	}
	$.ajax(settings)
		.done(data => {
			if (data.errcode != "0") return reject(new Error(getApiMsg(data, settings)));
			return resolve(data.dsRecv[0]);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 사용자생성
 * @param {string} target 
 * @param {object} data 
 */
const createUser = async (target, data) => {

	let mobilnoMbr	= "";	// 휴대폰번호(엄마)	
	let mobilnoFat	= "";	// 휴대폰번호(아빠)
	let mobilnoLaw	= "";	// 휴대폰번호(법정대리인)
	let telpno		= "";	// 자택 전화번호
	let custMk		= "";	// 고객구분
	let gradeNm		= "";	
	let fatRelNm	= "";	

	// set user_fields data
	if (target == "C") {
		if (!data || !data.NAME || !data.CUST_ID) throw new Error("젠데스크 사용자 생성시 필수 값이 존재하지 않습니다.");
		mobilnoMbr = data.MOBILNO_MBR ? data.MOBILNO_MBR.replace(/[^0-9]/gi, "") : "";
		mobilnoFat = data.MOBILNO_FAT ? data.MOBILNO_FAT.replace(/[^0-9]/gi, "") : "";
		mobilnoLaw = data.MOBILNO_LAW ? data.MOBILNO_LAW.replace(/[^0-9]/gi, "") : "";
		telpno 	   = (data.DDD || "") + (data.TELPNO1 || "") + (data.TELPNO2 || "");
		custMk 	   = "고객";
		gradeNm    = findCodeName("GRADE_CDE", data.GRADE_CDE);
		fatRelNm   = findCodeName("FAT_REL", data.FAT_REL);
	} else {
		if (!data || !data.NAME || !data.EMP_ID) throw new Error("젠데스크 사용자 생성시 필수 값이 존재하지 않습니다.");
		custMk = "교사";
	}

	// get organization_id
	const orgId = await checkOrg(telpno, data.FAT_RSDNO);
	
	// create user
    const option = {
		url: '/api/v2/users',
		method: 'POST',
		contentType: "application/json",
		data: JSON.stringify({
			user: {
				name				: data.NAME,			// 고객명
				external_id			: data.CUST_ID,			// 고객번호
				organization_id		: orgId,				// 조직ID
				role				: "end-user",			// 최종 사용자로 통일
				email				: data.EMAIL,			// 이메일
				phone				: data.MOBILNO,			// 핸드폰번호
				user_fields	: {
					bonbu				: data.UPDEPTNAME,	// 본부
					dept				: data.DEPT_NAME,	// 사업국	
					center				: data.LC_NAME,		// 센터
					grade				: gradeNm,			// 학년	
					mobilno_mother		: mobilnoMbr,		// 휴대폰번호(엄마)	
					mobilno_father		: mobilnoFat,		// 휴대폰번호(아빠)
					mobile_legal		: mobilnoLaw,		// 휴대폰번호(법정대리인)	
					home_tel			: telpno,			// 자택 전화번호
					custom_no			: data.MBR_ID,		// 회원번호	
					fml_connt_cde		: fatRelNm,			// 가족관계
					fml_seq				: data.FAT_RSDNO,	// 관계번호
					cust_mk				: custMk,			// 고객구분
				}
			},
		}),
	}
	return await topbarClient.request(option);
}

/**
 * 사용자생성 전 조직이 있는지 체크하고 없으면 생성.
 * @param {string} TELNO 	 자택번호
 * @param {string} FAT_RSDNO 관계번호
 * @return {number} organization_id
 */
const checkOrg = async (TELNO, FAT_RSDNO) => {

	let orgId = "";

	// get organization_id
	if (FAT_RSDNO) {
		const { organizations } = await topbarClient.request(`/api/v2/organizations/search?external_id=${FAT_RSDNO}`);
		orgId = (organizations.length > 0) ? organizations[0].id : "";
	}

	// create organization
	if (!orgId && TELNO && FAT_RSDNO) {
		const option = {
			url: '/api/v2/organizations/create_or_update',
			method: 'POST',
			contentType: "application/json",
			data: JSON.stringify({
				organization: {
					name		: `${TELNO}_${FAT_RSDNO}`,	// 자택번호_관계번호
					external_id : FAT_RSDNO,				// 관계번호
				},
			}),
		}
		const { organization } = await topbarClient.request(option);
		orgId = organization.id;
	}

	return orgId;
}

/**
 * 티켓생성
 * @param {string|number} user_id Zendesk user id
 * @param {string|number} parent_id Zendesk ticket id
 * @return {object} ticket response
 */
const createTicket = async (user_id, parent_id) => {

	// 추가등록/관계회원의 티켓생성일 경우 1번째 순번 티켓의 OB관련 데이터를 가져와서 추가한다.
	const new_fields = new Array();
	if (parent_id) {

		const { ticket } = await zendeskShowTicket(parent_id);

		if (ticket?.custom_fields?.length > 0) {
			const fOB_MK 		= ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["OB_MK"]);
			const fLIST_CUST_ID = ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["LIST_CUST_ID"]);
			const fCALLBACK_ID 	= ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["CALLBACK_ID"]);
			new_fields.push({id: ZDK_INFO[_SPACE]["ticketField"]["OB_MK"], 			value: fOB_MK?.value});				// OB구분   		
			new_fields.push({id: ZDK_INFO[_SPACE]["ticketField"]["LIST_CUST_ID"], 	value: fLIST_CUST_ID?.value});		// 리스트ID_고객번호
			new_fields.push({id: ZDK_INFO[_SPACE]["ticketField"]["CALLBACK_ID"], 	value: fCALLBACK_ID?.value});		// 콜백번호   
		}		
	
	}

	const option = {
		url: '/api/v2/tickets.json',
		method: 'POST',
		contentType: "application/json",
		data: JSON.stringify({ 
			ticket: {
				subject			: "CCEM 앱에서 티켓생성 버튼으로 생성된 티켓입니다.",	 // 제목
				ticket_form_id	: ZDK_INFO[_SPACE]["ticketForm"]["CNSLT_INQRY"], 	 // 양식 : 상담문의 고정
				requester_id	: user_id,  				// 젠데스크 고객번호
				assignee_id		: currentUser.id,			// 젠데스크 상담원번호
				status			: "open",					// 젠데스크 티켓 상태
				tags            : ["AUTO_FROM_CCEM"],		// TODO 프로젝트 오픈전 해당 티켓건 삭제를 위해
				comment: {
					public		: false,					// 내부메모
					body		: "CCEM 앱에서 티켓생성 버튼으로 생성된 티켓입니다.",
				},
				custom_fields: new_fields,
			} 
		}),
	}

	return await topbarClient.request(option);
}

/**
 * 상담 저장구분 반환.
 * @param {string} id selectbox element id
 * @param {string} flag C: 현재순번, L: 마지막순번
 * @return {string} I: 신규, U: 수정
 */
var getJobType = (id, flag) => {

	const selectbox = document.getElementById(id);

	// 마지막순번
	if (flag == "L") {
		const selectboxLastIndex = selectbox.options.length - 1;
		const sJobType = selectbox.options[selectboxLastIndex].dataset.jobType;	// 저장구분(I: 신규, U: 수정)
		return sJobType;
	
	// 현재순번
	} else {	
		const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;
		return sJobType;
	}
	
}

/**
 * 특정 커스텀필드값 반환
 * @param {object} ticket
 * @param {string|number} custom_field_id
 */
const getCustomFieldValue = (ticket, custom_field_id) => {

	let sData = undefined;

	if (ticket?.custom_fields?.length > 0) {
		const fData = ticket.custom_fields.find(el => el.id == custom_field_id);
		sData = fData?.value;
	}

	return sData;

}

/**
 * 현재 오픈된 티켓세팅
 */
const setCurrentTicket = async () => {
	const origin = sidebarClient ? await sidebarClient.get("ticket") : new Object();
	const ticket_id = origin?.ticket?.id;
	if (!ticket_id) return

	// 티켓이 삭제된 경우 예외처리
	try {
		const { ticket } = await zendeskShowTicket(ticket_id);
		currentTicket = ticket;
	} catch (error) {
		console.error(error);
	}

}

/**
 * 오픈된 화면 재조회
 */
const refreshDisplay = async () => {

	// 탑바화면 재조회
	topbarObject?.refreshGrid(); 			

	// 상담조회화면 재조회
	if (opener?.name == "CCEMPRO035") opener.onSearch(true);   
	
	// 입회조회화면 재조회
	if (opener?.name == "CCEMPRO037") opener.onSearch();   	   

}

/**
 * 녹취정보 저장
 * @param {object} cselData 상담정보
 */
const saveRecData = (cselData) => new Promise((resolve, reject) => {
	
	if (!cselData.RECORD_ID) return resolve(false);

	const settings = {
		global: false,
		url: `${API_SERVER}/sys.saveRecData.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담등록",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
				RECORD_ID	 : cselData.RECORD_ID,  // 녹취키번호	
				CUST_ID		 : cselData.CUST_ID, 	// 고객번호
				CSEL_DATE	 : cselData.CSEL_DATE,  // 상담일자	
				CSEL_NO		 : cselData.CSEL_NO, 	// 상담번호
			}],
		}),
	}

	$.ajax(settings)
		.done(res => {
			if (res.errcode != "0") return reject(new Error(getApiMsg(res, settings)));
			return resolve(true);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 상담채널, 상담경로 최초 세팅값 반환.
 */
const getInitChanel = () => {

	/*
		[티켓필드_OB구분]		=> 	[상담채널] 	    	=> 	[상담경로]
		1. 정보이용동의 		=> 	정보동의(11) 	    => 	 변경없음
		2. 전화설문    			=> 	발신(2)		   		=> 	변경없음	
		3. 고객직접퇴회 		=> 	고객직접퇴회(12)	=> 	 변경없음		
		4. 전화상담신청 		=> 	마카다미아(13)		=> 	 변경없음		
		5. 방문상담신청			=> 	변경없음			=> 	 변경없음			
		6. IVR콜백   		   =>  착신(1)			   =>   콜백(50)
		7. MOS      		   =>  MOS(14)			  =>   변경없음	
		8. WEB설문   		   =>  조사(9)			   => 	변경없음	
		9. 팩스수신   		   =>  FAX(5)			   => 	변경없음
	*/

	let sCSEL_CHNL_MK, sSTD_CRS_CDE;

	if (currentTicket) {

		// 티켓채널이 chat일 경우
		if (currentTicket.via?.channel == "chat") {
			sCSEL_CHNL_MK = "85";
		}

		// OB구분에 따라 상담채널 및 상담경로 세팅
		const sOB_MK = getCustomFieldValue(currentTicket, ZDK_INFO[_SPACE]["ticketField"]["OB_MK"]);
		// OB구분이 정보이용동의 일 경우
		if (sOB_MK == "oblist_cde_10") {
			sCSEL_CHNL_MK = "11";
		// OB구분이 전화설문 일 경우
		} else if (sOB_MK == "oblist_cde_20") {
			sCSEL_CHNL_MK = "2";
		// OB구분이 고객직접퇴회 일 경우
		} else if (sOB_MK == "oblist_cde_30") {
			sCSEL_CHNL_MK = "12";
		// OB구분이 전화상담신청 일 경우
		} else if (sOB_MK == "oblist_cde_40") {
			sCSEL_CHNL_MK = "13";
		// OB구분이 방문상담신청 일 경우
		} else if (sOB_MK == "oblist_cde_50") {

		// OB구분이 IVR콜백 일 경우
		} else if (sOB_MK == "oblist_cde_60") {
			sCSEL_CHNL_MK = "1";
			sSTD_CRS_CDE = "50";
		// OB구분이 MOS 일 경우
		} else if (sOB_MK == "oblist_cde_80") {
			sCSEL_CHNL_MK = "14";
		// OB구분이 WEB설문 일 경우
		} else if (sOB_MK == "oblist_cde_90") {
			sCSEL_CHNL_MK = "9";
		// OB구분이 팩스수신 일 경우
		} else if (sOB_MK == "oblist_cde_100") {
			sCSEL_CHNL_MK = "5";
		}

	}

	return { sCSEL_CHNL_MK, sSTD_CRS_CDE };
	
}
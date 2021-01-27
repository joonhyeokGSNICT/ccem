var grid4;	// 입회등록 > 과목 grid
var grid5;	// 입회등록 > 입회과목 grid

$(function () {
	
	createGrids();
	getProd(grid4);

	// create calendar
	$(".calendar").each((i, el) =>  calendarUtil.init(el.id));

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	// 저장 버튼
	$("#button1").on("click", ev => {
		loading = new Loading(getLoadingSet('입회등록중 입니다.'));
		onSave()
			.then((succ) => { if (succ) alert("저장 되었습니다."); })
			.catch((error) => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`입회등록중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

	onStart();

});

/**
 * 상담등록에서 사용하는 모든 Grid를 생성합니다.
 */
const createGrids = () => {
	// 입회등록 > 과목 grid
	grid4 = new Grid({
		el: document.getElementById('grid4'),
		bodyHeight: 310,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum',   header: "NO",   minWidth: 30,},
			{ type: 'checkbox', header: " ",    minWidth: 30,},
		],
		columns: [
			{ header: '제품코드',     name: 'PRDT_ID',      width: 100,  	align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '과목',       name: 'PRDT_NAME',   	minWidth: 142,  align: "left", sortable: true, ellipsis: true, hidden: false    },
			{ header: 'CTI제품코드',  name: 'PRDT_CDE',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군코드',   name: 'PRDT_GRP',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군명',     name: 'PRDT_GRPNM',   width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품순번',     name: 'PRDT_SEQ',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '사용여부',     name: 'USE_FLAG',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '선택',         name: 'USE',          width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
		],
	});
	grid4.on('click', (ev) => {
		grid4.addSelection(ev);
		grid4.clickSort(ev);
		grid4.clickCheck(ev);
	});
	grid4.on("check", ev => {
		checkProd(grid5, grid4.getRow(ev.rowKey));
	});
	grid4.on("uncheck", ev => {
		uncheckProd(grid5, grid4.getRow(ev.rowKey));
	});

	// 입회등록 > 입회과목 grid
	grid5 = new Grid({
		el: document.getElementById('grid5'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", minWidth: 30, },
		],
		columns: [
			{ header: '제품코드',     name: 'PRDT_ID',      align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '입회과목',     name: 'PRDT_NAME',    align: "left", sortable: true, ellipsis: true, hidden: false    },
			{ header: 'CTI제품코드',  name: 'PRDT_CDE',     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군코드',   name: 'PRDT_GRP',     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군명',     name: 'PRDT_GRPNM',   align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품순번',     name: 'PRDT_SEQ',     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '사용여부',     name: 'USE_FLAG',     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '선택',         name: 'USE',          align: "left", sortable: true, ellipsis: true, hidden: true    },
		],
	});
	grid5.on('click', (ev) => {
		grid5.addSelection(ev);
		grid5.clickSort(ev);
	});
}

/**
 * 오픈되는 곳에 따라 분기처리
 */
const onStart = () => {

	const opener_name = parent.opener.name;

	// 탑바 > 고객정보 > 고객 > 상담등록 버튼으로 오픈
	if (opener_name.includes("top_bar")) {	
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	

		const sCUST_ID = topbarObject.document.getElementById("custInfo_CUST_ID").value; // 고객번호
		const sMBR_ID  = topbarObject.document.getElementById("custInfo_MBR_ID").value;	 // 회원번호

		setCodeData(codeData);
		setDate("con");
		getCust(sCUST_ID);

		console.debug("onStart by top_bar: ", sCUST_ID, sMBR_ID)

	// 상담조회 > 상담/입회수정 버튼으로 오픈
	} else if (opener_name.includes("CCEMPRO035")) {	
		topbarObject  = parent.opener.topbarObject;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;

		const counselGrid  = parent.opener.grid1;	// 상담조회 grid
		const rowKey 	   = counselGrid.getSelectedRowKey();
		const sCSEL_DATE   = counselGrid.getValue(rowKey, "CSEL_DATE");	// 상담일자
		const CSEL_NO      = counselGrid.getValue(rowKey, "CSEL_NO");	// 상담번호
		const sCSEL_SEQ    = counselGrid.getValue(rowKey, "CSEL_SEQ");	// 상담순번

		console.debug("onStart by CCEMPRO035: ", sCSEL_DATE, CSEL_NO, sCSEL_SEQ)

	}
	
}

/**
 * 콤보박스 세팅
 * - as-is : cns4700.setCombo()
 * @param {array} codeData
 */
const setCodeData = (codeData) => {

	const CODE_MK_LIST = [
		"PRDT_GRP",			// 과목군
		"GRADE_CDE",		// 학년
		"CSEL_CHNL_MK",		// 상담채널
		"TRANS_CHNL_MK",	// 연계방법
		"CSEL_PREFACE",		// 안내문구
		"STD_MOTIVE_CDE",	// 입회사유
		"STD_CRS_CDE",		// 입회경로
		"CSEL_MAN_MK",		// 내담자
		"MEDIA_CDE",		// 매체구분
		"SAP_USE_FLAG",		// ?
	];

	// get code
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// sorting
	const sortKey = "CODE_ID";
	codeList.sort((a, b) => a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0);

	// create select options
	for (const code of codeList) {
		$(`select[name='${code.CODE_MK}']`).append(new Option(code.CODE_NAME, code.CODE_ID));
	}

	// init setting 
	const S_USER_GRP_CDE = currentUser.user_fields.user_grp_cde;
	if(S_USER_GRP_CDE == "7096") $("#selectbox4").val("71");
	else if(S_USER_GRP_CDE == "7100") $("#selectbox4").val("61");
	else $("#selectbox4").val("1");			// 기본값은 "착신" : 2007.03.07
	$("#selectbox9").val("01");	// 내담자: 모
	$("#selectbox5").val("3");	// 연계방법: FAX
}

/**
 * 날짜 및 시간세팅
 * - as-is : cns4700.getDBDate()
 * @param {string} flag 
 */
const setDate = async (flag) => {
	const { CDATE, CTIME } = await getSysdate();
	
	// 연계일자, 시간 
	if (flag == "con") { 
		calendarUtil.setImaskValue("calendar4", CDATE);
		$("#timebox3").val(CTIME);
	} 
	// 상담일자, 시간 
	else { 
		calendarUtil.setImaskValue("calendar3", CDATE);
		$("#timebox2").val(CTIME);
	}	

}

/**
 * DB시간조회
 */
const getSysdate = () => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/sys.getSysdate.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids	: ["dsSend"],
			recvdataids	: ["dsRecv"],
			dsSend		: [{}]
		}),
		errMsg: "DB시간 조회중 오류가 발생하였습니다.",
	}
	
	$.ajax(settings)
		.done(res => {
			if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));

			const sysdate = res.dsRecv;

			if (sysdate.length == 0) {
				alert(settings.errMsg + "\n\n검색 결과가 없습니다.");
				return reject(new Error(settings.errMsg + "\n\n검색 결과가 없습니다."));
			}

			return resolve(sysdate[0]);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 고객정보 조회
 * @param {string} CUST_ID 고객번호
 */
const getCust = (CUST_ID) => {
	const settings = {
		url: `${API_SERVER}/cns.getCust.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids	: ["dsSend"],
			recvdataids	: ["dsRecv"],
			dsSend		: [{ CUST_ID }]
		}),
		errMsg: "고객정보 조회중 오류가 발생하였습니다.",
	}
	
	$.ajax(settings).done(res => {
		if (!checkApi(res, settings)) return;

		setDate("csel");

		const custData = res.dsRecv[0];
		if (!custData) return;
		
		$("#textbox2").val(custData.NAME);				// 고객명	
		$("#textbox3").val(custData.ID);				// 회원번호
		$("#textbox4").val(custData.TELPNO);			// 전화번호	
		$("#textbox5").val(custData.ZIPCDE);			// 우편번호	
		// custData.MK					// 고객구분
		$("#textbox6").val(custData.ADDR);				// 주소	
		$("#hiddenbox6").val(custData.AREA_CDE);		// 지역코드		
		// custData.AREA_NAME			// 지역코드명		
		$("#textbox12").val(custData.DEPT_ID);			// 지점(부서)코드(연계사업국코드)	
		$("#textbox13").val(custData.DEPT_NAME);		// 지점(부서)코드명(연계사업국이름)		
		$("#textbox8").val(custData.UP_DEPT_ID);		// 상위지점(부서)코드(연계본부코드)
		$("#textbox9").val(custData.UPDEPTNAME);		// 상위지점(부서)코드명(연계본부이름)
		// custData.ZIPCDE_DEPT			// 지점(부서) 우편번호		
		// custData.ADDR_DEPT			// 지점(부서) 주소		
		// custData.ZIP_ADDR_DEPT		// 지점(부서) 기본주소 			
		// custData.TELPNO_DEPT			// 지점(부서) 전화번호		
		// custData.FAXNO_DEPT			// 지점(부서) 팩스번호		
		$("#selectbox2").val(custData.GRADE_CDE);		// 학년코드		
		// custData.GRADE_NAME			// 학년코드명		
		// custData.FST_CRS_CDE			// 첫상담경로코드		
		$("#hiddenbox2").val(custData.DEPT_EMP_ID);		// 지점장사번		
		$("#hiddenbox1").val(custData.LC_ID)			// 센터ID	
		$("#textbox15").val(custData.LC_NAME);			// 센터명	
		$("#textbox10").val(custData.TELPNO_LC);		// 센터전화번호		
		$("#hiddenbox4").val(custData.LC_EMP_ID);		// 센터장사번		
		$("#textbox16").val(custData.FAT_NAME);			// 학부모명		
		// custData.FAT_RSDNO			// 학부모주민번호		
		// custData.TEL					// 전화번호
		// custData.MOB					// 회원핸드폰
		$("#textbox17").val(custData.CPHONE);			// 학부모핸드폰	
		// custData.DEPT_EMP_ID			// 지점장사번		
		// custData.DEPT_EMP_NAME		// 지점장명			
		// custData.DEPT_EMP_MOBILE		// 지점장핸드폰			
		// custData.LC_EMP_ID			// 센터장사번		
		// custData.LC_EMP_NAME			// 센터장명		
		// custData.LC_EMP_MOBILNO		// 센터장핸드폰		
		$("#hiddenbox3").val(CUST_ID);					// 고객번호	
	});
};

/**
 * 입회정보 저장
 * @param {object} counselData 입회정보
 * @param {object} transData   연계정보
 * @param {object} obData      OB관련 데이터
 */
const saveEnter = (counselData, transData, obData) => new Promise((resolve, reject) => {

	const settings = {
		global: false,
		url: `${API_SERVER}/cns.saveEnter.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids	: ["DS_COUNSEL", "DS_TRANS", "DS_OB"],
			recvdataids	: ["dsRecv"],
			DS_COUNSEL	: [counselData],
			DS_TRANS	: [transData], 	
			DS_OB		: [obData],		
		}),
	}
	
	$.ajax(settings)
		.done(data => {
			if (data.errcode != "0") return reject(new Error(getApiMsg(data, settings)));
			if (data.dsRecv.length == 0) return reject(new Error("저장 결과 데이터가 존재하지 않습니다."));
			return resolve(data.dsRecv[0]);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 입회조회
 * @param {string}  sCselSeq 상담순번
 * @param {boolean} isFirst  최초조회 여부
 */
const getEnterData = (sCselSeq, isFirst) => {
	const settings = {
		url: `${API_SERVER}/cns.getEnterData.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
				CSEL_DATE 	: calendarUtil.getImaskValue("calendar3"),  // 상담일자
				CSEL_NO		: $("#textbox7").val(), 					// 상담번호
			}],
		}),
		errMsg: "입회등록정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(res => {
		if (!checkApi(res, settings)) return;

		const enterData = res.dsRecv;
		console.debug(enterData)

		// 최초 조회시 순번 selectbox 생성
		if (isFirst) {
			$("#selectbox3").empty();
			enterData.forEach(el => {
				const option = new Option(el.CSEL_SEQ, el.CSEL_SEQ);
				option.dataset.jobType = "U";
				$("#selectbox3").append(option);
			});
		}

		// 순번 세팅
		$("#selectbox3").val(sCselSeq);

		// 입회정보 세팅
		if (enterData.length >= 1) {

			const rowIdx = $("#selectbox3 option:selected").index();
			const rowData 	= enterData[rowIdx];

			// 추가등록/관계회원이 아닌경우에만 티켓오픈.
			if(sCselSeq == 1) topbarClient.invoke('routeTo', 'ticket', rowData.ZEN_TICKET_ID);
			
			// TODO 나머지 입회정보 세팅하기.
			

			setBtnCtrlAtLoadComp();

			getCust(rowData.CUST_ID);					// 고객정보 조회			
			setPlProd(grid4, rowData.PLURAL_PRDT_LIST);	// 입회과목 선택
		}

	});
}

/**
 * 저장
 * - as-is : cns4700.onSave()
 */
const onSave = async () => {

	// 과목군을 전체로 변경하여 filter 처리후에 검색어 검색 처리
	$("#selectbox1").val("").trigger("change");

	// 저장구분(I: 신규, U: 수정)
	const selectbox = document.getElementById("selectbox3");
	const selectedSeq = selectbox.value;
	const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;	

	// 저장 validation check
	const counselData = getCounselCondition(sJobType);
	if (!counselData) return false;
	const transData = getTransCondition(sJobType);
	if (!transData) return false;
	const obData = getObCondition(sJobType);
	if (!obData) return false;

	// CCEM 저장
	let resSave = await saveEnter(counselData, transData, obData);

	// TODO 티켓 set or update
	
	// 저장성공후
	$("#textbox7").val(resSave.CSEL_NO);	// 접수번호 세팅
	getEnterData(selectedSeq, true)			// 입회 재조회	

	return true;
}

/**
 * 입회정보 validation check
 * -as-is : cns4700.onNeedCheck(), setDataForSave(), 
 */
const getCounselCondition = (sJobType) => {

	const DS_COUNSEL = {
		ROW_TYPE			: sJobType, 									// 저장구분(I/U/D)		
		CSEL_DATE			: calendarUtil.getImaskValue("calendar3"), 		// 상담일자		
		CSEL_NO				: $("#textbox7").val(), 						// 상담번호	
		CSEL_SEQ			: $("#selectbox3").val(), 						// 상담순번		
		CUST_ID				: $("#hiddenbox3").val(), 						// 고객번호	
		CUST_MK				: "MB", 										// 고객구분(MB로 고정)	
		CSEL_USER_ID		: currentUser.external_id, 						// 상담원id			
		CSEL_STTIME			: $("#timebox2").val(), 						// 상담시작시간		
		CSEL_EDTIME			: "", // 상담종료시간						
		CSEL_CHNL_MK		: $("#selectbox4").val(), 						// 상담채널구분			
		CSEL_MK				: "3", 											// 상담구분(3으로 고정)	
		CSEL_LTYPE_CDE		: $("#textbox19").val(), 						// 상담대분류코드			
		CSEL_MTYPE_CDE		: $("#textbox21").val(), 						// 상담중분류코드			
		CSEL_STYPE_CDE		: $("#textbox23").val(), 						// 상담소분류코드			
		CSEL_CNTS			: $("#textbox25").val().trim(), 				// 상담상세내용		
		LIMIT_MK			: "", // 처리시한구분		
		PROC_HOPE_DATE		: "", // 처리희망일자			
		CSEL_MAN_MK			: $("#selectbox9").val(), 						// 내담자구분		
		CUST_RESP_MK		: "", // 고객반응구분			
		CALL_RST_MK			: "", // 통화결과구분		
		DEPT_ID				: $("#textbox12").val(), 						// 관할지점코드(사업국코드)	
		DIV_CDE				: $("#textbox8").val(), 						// 관할본부코드(본부코드)	
		AREA_CDE			: $("#hiddenbox6").val(), 						// 관할지역코드		
		GRADE_CDE			: $("#selectbox2").val(), 						// 학년코드		
		MOTIVE_CDE			: $("#selectbox7").val(), 						// 입회사유코드		
		FST_CRS_CDE			: $("#selectbox8").val(), 						// 첫상담경로(입회경로)
		TRANS_DATE			: calendarUtil.getImaskValue("calendar4"), 		// 연계일자		
		TRANS_NO			: "", // 연계번호		
		PROC_STS_MK			: getProcStsMk(), 								// 처리상태구분		
		WORK_STYL_MK		: "", // 근무형태구분			
		USER_GRP_CDE		: currentUser.user_fields.user_grp_cde, 		// 상담원그룹코드			
		MBR_ID				: $("#textbox3").val(), 						// 회원번호	
		DEPT_EMP_ID			: $("#hiddenbox2").val(),   					// 지점장사번		
		CTI_CHGDATE			: "", // cti변경일자		
		TO_TEAM_DEPT		: "", // 지점장부서			
		CALL_STTIME			: "", // 통화시작시간		
		CALL_EDTIME			: "", // 통화종료시간		
		LC_ID				: $("#hiddenbox1").val(), 						// 센터ID	
		LC_EMP_ID			: $("#hiddenbox4").val(), 						// 센터장사번		
		ZEN_TICKET_ID		: $("#hiddenbox5").val(), 						// 티켓ID			
		PLURAL_PRDT_ID		: "", // 병행과목코드			
		PLURAL_PRDT_LIST	: "", // 병행과목코드리스트				
		PLURAL_PRDT_NAME	: "", // 병행과목코드명				
	}

	// 날짜 및 시간 유효성 체크
	DS_COUNSEL.CSEL_DATE 	  = DS_COUNSEL.CSEL_DATE.length != 8 ? "" 	: DS_COUNSEL.CSEL_DATE;
	DS_COUNSEL.TRANS_DATE	  = DS_COUNSEL.TRANS_DATE.length != 8 ? "" 	: DS_COUNSEL.TRANS_DATE;
	DS_COUNSEL.CSEL_STTIME	  = DS_COUNSEL.CSEL_STTIME.length != 6 ? "" : DS_COUNSEL.CSEL_STTIME;

	// 병행과목코드리스트 세팅
	const plProd = getPlProd(grid5);
	DS_COUNSEL.PLURAL_PRDT_LIST = plProd.ids.join("_");
	DS_COUNSEL.PLURAL_PRDT_NAME = plProd.names.join(",");

	// TODO CTI사용여부가 Y이면, 통화시간정보를 셋팅한다.
	/* if( "<%=S_CTI_USE_YN%>" == "Y" ){ */
	// if (objSys1100.objSysCALL != "") {

	// 	// 통화시작시간과 통화종료시간을 가져온다.
	// 	if (isCall == "Y") {
	// 		try {
	// 			var arrCallTimes = objSys1100.gf_getCallTimes();
	// 			DS_CNS4797.NameValue(1, "CALL_STTIME") = arrCallTimes[0];
	// 			DS_CNS4797.NameValue(1, "CALL_EDTIME") = arrCallTimes[1];
	// 		} catch (e) { }

	// 	}
	// }

	if (!DS_COUNSEL.MBR_ID) { 
		alert("고객을 선택하여 주십시오."); 
		return false;
	}
	if (!DS_COUNSEL.TRANS_DATE) { 
		alert("연계일시를 입력하여 주십시오"); 
		$("#calendar4").focus();
		return false;
	 }
	if (!DS_COUNSEL.MOTIVE_CDE) { 
		alert("입회사유를 선택하여 주십시오"); 
		$("#selectbox7").focus();
		return false; 
	}
	if (!DS_COUNSEL.FST_CRS_CDE) { 
		alert("입회경로를 선택하여 주십시오"); 
		$("#selectbox8").focus();
		return false; 
	}
	if (!$("#selectbox5").val()) { 
		alert("연계방법을 선택하여 주십시오"); 
		$("#selectbox5").focus();
		return false;
	}
	if (!DS_COUNSEL.PLURAL_PRDT_LIST) {
		alert("입회과목을 선택하여 주십시오"); 
		return false;
	}

	// 상담원 그룹일 경우 중,소 분류코드까지 입력을 받아야 함
	const lvlMk = currentUser.user_fields.user_lvl_mk;
	const isLowLvl = (lvlMk != "user_lvl_mk_1" && lvlMk != "user_lvl_mk_2" && lvlMk != "user_lvl_mk_3") ? true : false;
	if (chkGroup() && isLowLvl) {
		if (!DS_COUNSEL.CSEL_LTYPE_CDE) {
			alert("대분류를 선택하여 주십시오"); 
			$("#textbox20").focus();
			return false;
		}
		if (!DS_COUNSEL.CSEL_MTYPE_CDE) {
			alert("중분류를 선택하여 주십시오"); 
			$("#textbox22").focus();
			return false;
		}
		if (!DS_COUNSEL.CSEL_STYPE_CDE) {
			alert("소분류코드를 선택하여 주십시오"); 
			$("#textbox24").focus();
			return false;
		}
	// 기타 상담원 및 슈퍼바이저이상 의 경우 중분류 코드까지 입력 받음
	} else { 
		if (!DS_COUNSEL.CSEL_LTYPE_CDE) {
			alert("대분류를 선택하여 주십시오"); 
			$("#textbox20").focus();
			return false;
		}
		if (!DS_COUNSEL.CSEL_MTYPE_CDE) {
			alert("중분류를 선택하여 주십시오"); 
			$("#textbox22").focus();
			return false;
		}
	}

	return DS_COUNSEL;

}

/**
 * 연계정보 validation check
 */
const getTransCondition = () => {

	const DS_TRANS = {
		TRANS_DATE		: calendarUtil.getImaskValue("calendar4"), // 연계일시	
		TRANS_NO		: "", // 연계번호	
		TRANS_MK		: "", // 연계구분	
		TRANS_DEPT_ID	: "", // 연계지점코드		
		TRANS_LC_ID		: "", // 연계센터코드	
		TRANS_CNTS		: "", // 연계내용	
		TRANS_CHNL_MK	: "", // 연계방법구분		
	}

	return DS_TRANS;

}

/**
 * OB관련 데이터 validation check
 */
const getObCondition = () => {
	
	const DS_OB = {
		OBLIST_CDE		: "", // OB리스트구분		
		LIST_CUST_ID	: "", // 리스트_고객_ID(OBLIST_CDE = '60' 외 나머지 경우 셋팅)		
		CSEL_DATE		: "", // 상담일자		
		CSEL_NO			: "", // 상담번호	
		CALLBACK_ID		: "", // CALLBACK_ID(OBLIST_CDE = '60'일 경우 셋팅)		
	}

	return DS_OB;

}

/**
 * 연계방법에 따른 처리상태구분 반환.
 * -as-is : cns4700.setCntWay()
 * @return {string} PROC_STS_MK 처리상태구분
 */
const getProcStsMk = () => {
	let PROC_STS_MK = "";
	const way = $("#selectbox5").val();				// 연계방법
	const txtCntAcp = $("#textbox14").val().trim();	// 접수자

	if (way == "") PROC_STS_MK = "";
	else if (way == "1") {					// 연계방법이 전화인 경우
		if (txtCntAcp) PROC_STS_MK = "99";	// 지점 접수자가 있으면 바로 완료 상태
		else PROC_STS_MK = "01";			// 없으면 접수
	}
	else PROC_STS_MK = "99";				// 연계방법 Email,Fax인경우 바로 완료 상태

	return PROC_STS_MK;
}

/**
 * 상담원그룹 체크 (TCR,TSR,FCR,CCR,TCR(전체) 체크)
 * -as-is : cns4700.chkGroup()
 */
const chkGroup = () => {
	const lvlMk = currentUser.user_fields.user_lvl_mk;
	const grpCde = currentUser.user_fields.user_grp_cde;
	if (grpCde == "7006" || grpCde == "7011" || grpCde == "7014" || grpCde == "7015" || grpCde == "7016") {
		return true;
	} else {
		// 수정 : 권한(슈퍼바이저 이상)
		if (lvlMk == "user_lvl_mk_1" || lvlMk == "user_lvl_mk_2" || lvlMk == "user_lvl_mk_3") return true;
		else return false;
	}
}

/**
 * 저장이 완료 되었거나, 팝업되어 수정 상황일때 버튼 컨트롤 하는 함수.
 * @param {string} PROC_MK 처리구분
 */
const setBtnCtrlAtLoadComp = (PROC_MK) => {

	$("#button2").prop("disabled", true); 	// 고객조회 비활성화
	$("#button3").prop("disabled", false);	// 입회연계 활성화
	$("#button4").prop("disabled", false);	// 추가등록 활성화
	$("#button5").prop("disabled", false);	// 관계회원 활성화  

	// TODO 처리구분에 따른 입회연계 버튼 제어
	switch (PROC_MK) {
		case "1":
			break;
		default:
			break;
	}

}
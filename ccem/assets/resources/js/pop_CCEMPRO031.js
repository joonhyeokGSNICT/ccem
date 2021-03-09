var grid4;	// 입회등록 > 과목 grid
var grid5;	// 입회등록 > 입회과목 grid

var DS_COUNSEL = [];	// 상담정보

$(function () {
	
	// 창이 닫힐때 발생하는 event
	$(window).on('beforeunload', () => {
		PopupUtil.closeAll();   // 오픈된 모든 자식창 close
		onSaveCallTime();       // 상담 통화시간 저장
	});

	// create calendar
	$(".calendar").each((i, el) =>  calendarUtil.init(el.id));

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	createGrids();
	setEvent();
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
		uncheckProd(grid5, grid4, ev.rowKey);
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
			{ header: ' ',         	  name: 'PRDT_ID',     align: "center", sortable: false, ellipsis: true, hidden: false, 
				minWidth: 22, width: 22, 
				renderer: {
					type: CustomIconRenderer,
					options: {
						src: "../img/delBtn.svg",
						width: 15,
						height: 15,
						title: "삭제",
						onClick: (props) => deleteProd(grid4, grid5, props.rowKey),
					}
				}
			},
		],
	});
	grid5.on('click', (ev) => {
		grid5.addSelection(ev);
		grid5.clickSort(ev);
	});
}

const setEvent = () => {
	
	// 티켓생성 버튼 
	$("#button7").on("click", ev => {
		const loading = new Loading(getLoadingSet('티켓을 생성 중 입니다.'));
		onNewTicket()
			.then( async (ticket_id) => { 
				if (ticket_id)  {
					await topbarClient.invoke('routeTo', 'ticket', ticket_id);	// 티켓오픈
					alert("티켓생성이 완료되었습니다."); 
				}
			})
			.catch((error) => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`티켓생성 중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

	// 저장 버튼
	$("#button1").on("click", ev => {
		loading = new Loading(getLoadingSet('입회등록중 입니다.'));
		onSave()
			.catch((error) => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`입회등록중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

}

/**
 * 오픈되는 곳에 따라 분기처리
 */
const onStart = async () => {

	const opener_name = parent.opener.name;
	const hash = parent.location.hash;

	// 탑바 > 고객정보 > 고객 > 상담등록 버튼으로 오픈
	if (opener_name.includes("top_bar") && hash.includes("by_cust")) {	
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	

		// 오픈된 티켓세팅
		await setCurrentTicket();
		
		// 콤보박스 세팅
		await setCodeData();

		// 고객정보 조회
		const sCUST_ID = topbarObject.document.getElementById("custInfo_CUST_ID").value; // 고객번호
		const sMBR_ID  = topbarObject.document.getElementById("custInfo_MBR_ID").value;	 // 회원번호
		getCust(sCUST_ID, "I");

	// 탑바 > 고객정보, 선생님 > 상담수정 버튼으로 오픈
	} else if (opener_name.includes("top_bar") && hash.includes("by_modify")) {	
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	

		// 콤보박스 세팅
		await setCodeData();

		// 티켓오픈
		if (POP_DATA.ZEN_TICKET_ID) topbarClient.invoke('routeTo', 'ticket', POP_DATA.ZEN_TICKET_ID);  

		// 상담정보 조회
		calendarUtil.setImaskValue("calendar3", POP_DATA.CSEL_DATE);
		$("#textbox7").val(POP_DATA.CSEL_NO);
		onSearch(POP_DATA.CSEL_SEQ);

	// 상담조회 > 상담/입회수정 버튼으로 오픈
	} else if (opener_name.includes("CCEMPRO035")) {	
		topbarObject  = parent.opener.topbarObject;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;

		// 콤보박스 세팅
		await setCodeData();

		const counselGrid  = parent.opener.grid1;				// 상담조회 grid
		const rowKey 	   = counselGrid.getSelectedRowKey();	// grid rowKey
		
		// 티켓오픈
		const ZEN_TICKET_ID = counselGrid.getValue(rowKey, "ZEN_TICKET_ID");	// 티켓ID
		if (ZEN_TICKET_ID) topbarClient.invoke('routeTo', 'ticket', ZEN_TICKET_ID);  

		// 상담조회
		const sCSEL_DATE   = counselGrid.getValue(rowKey, "CSEL_DATE");	// 상담일자
		const sCSEL_NO     = counselGrid.getValue(rowKey, "CSEL_NO");	// 상담번호
		const sCSEL_SEQ    = counselGrid.getValue(rowKey, "CSEL_SEQ");	// 상담순번
		calendarUtil.setImaskValue("calendar3", sCSEL_DATE); 
		$("#textbox7").val(sCSEL_NO); 				   	
		onSearch(sCSEL_SEQ);

	// 입회조회 > 입회수정 버튼으로 오픈
	} else if (opener_name.includes("CCEMPRO037")) {	
		topbarObject  = opener.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;

		// 콤보박스 세팅
		await setCodeData();

		const counselGrid  = opener.grid;						// 입회조회 grid
		const rowKey 	   = counselGrid.getSelectedRowKey();	// grid rowKey
		
		// 티켓오픈
		const ZEN_TICKET_ID = counselGrid.getValue(rowKey, "ZEN_TICKET_ID");	// 티켓ID
		if (ZEN_TICKET_ID) topbarClient.invoke('routeTo', 'ticket', ZEN_TICKET_ID);  

		// 상담조회
		const sCSEL_DATE   = counselGrid.getValue(rowKey, "CSEL_DATE");	// 상담일자
		const sCSEL_NO     = counselGrid.getValue(rowKey, "CSEL_NO");	// 상담번호
		const sCSEL_SEQ    = counselGrid.getValue(rowKey, "CSEL_SEQ");	// 상담순번
		calendarUtil.setImaskValue("calendar3", sCSEL_DATE); 
		$("#textbox7").val(sCSEL_NO); 				   	
		onSearch(sCSEL_SEQ);

	}

	// 전화아이콘 상태를 컨트롤 하기위해
	topbarObject?.wiseNTalkUtil.saveWindowObj(window);
	topbarObject?.wiseNTalkUtil.changePhoneIcon(window);
	
}

/**
 * 콤보박스 세팅
 * - as-is : cns4700.setCombo()
 */
const setCodeData = async () => {

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
	];

	// get code
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));
	prods = await getProd();
	grid4.resetData(prods);

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
	else $("#selectbox4").val("1");		// 상담채널 : 착신
	$("#selectbox9").val("01");			// 내담자 : 모
	$("#selectbox5").val("3");			// 연계방법 : FAX

	// 상담채널 세팅
	if (currentTicket) {
		const sOB_MK = getCustomFieldValue(currentTicket, ZDK_INFO[_SPACE]["ticketField"]["OB_MK"]);
		// OB구분이 정보이용동의 일경우
		if (sOB_MK == "oblist_cde_10") {
			$("#selectbox4").val("11");
		// 티켓채널이 채팅일 경우
		} else if (currentTicket?.via?.channel == "chat") {
			$("#selectbox4").val("85");
		}
	}

}

/**
 * 날짜 및 시간세팅
 * - as-is : cns4700.getDBDate()
 */
const setDate = async () => {
	const { CDATE, CTIME } = await getSysdate();
	
	// 연계일자, 시간 
	calendarUtil.setImaskValue("calendar4", CDATE);
	$("#timebox3").val(CTIME);

	// 상담일자, 시간 
	if (calendarUtil.getImaskValue("calendar3").length != 8) calendarUtil.setImaskValue("calendar3", CDATE);
	$("#timebox2").val(CTIME);

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
			userid: currentUser?.external_id,
			menuname: "입회등록",
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
 * @param {string} sJobType 저장구분(I: 신규, U: 수정)
 */
var getCust = (CUST_ID, sJobType) => {
	const settings = {
		url: `${API_SERVER}/cns.getCust.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "입회등록",
			senddataids	: ["dsSend"],
			recvdataids	: ["dsRecv"],
			dsSend		: [{ CUST_ID }]
		}),
		errMsg: "고객정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings)
		.done(res => {
			if (!checkApi(res, settings)) return;

			const custData = (res?.dsRecv?.length > 0) ? res.dsRecv[0] : new Object();
			$("#textbox2").val(custData.NAME);				// 고객명	
			$("#textbox3").val(custData.ID);				// 회원번호
			$("#textbox4").val(custData.TELPNO);			// 전화번호	
			$("#textbox5").val(custData.ZIPCDE);			// 우편번호	
			// custData.MK				// 고객구분
			$("#textbox6").val(custData.ADDR);				// 주소	
			// custData.AREA_CDE		// 지역코드		
			// custData.AREA_NAME		// 지역코드명
			// custData.DEPT_ID			// 지점(부서)코드(연계사업국코드)	
			// custData.DEPT_NAME		// 지점(부서)코드명(연계사업국명)		
			// custData.UP_DEPT_ID		// 상위지점(부서)코드(연계본부코드)
			// custData.UPDEPTNAME		// 상위지점(부서)코드명(연계본부명)
			// custData.ZIPCDE_DEPT		// 지점(부서) 우편번호		
			// custData.ADDR_DEPT		// 지점(부서) 주소		
			// custData.ZIP_ADDR_DEPT	// 지점(부서) 기본주소 			
			// custData.TELPNO_DEPT		// 지점(부서) 전화번호		
			// custData.FAXNO_DEPT		// 지점(부서) 팩스번호		
			$("#selectbox13").val(custData.GRADE_CDE);		// 학년코드		
			// custData.GRADE_NAME		// 학년코드명		
			// custData.FST_CRS_CDE		// 첫상담경로코드				
			// custData.LC_ID			// 센터ID	(연계센터코드)
			// custData.LC_NAME			// 센터명	(연계센터명)
			// custData.TELPNO_LC		// 센터전화번호		
			$("#textbox16").val(custData.FAT_NAME);			// 학부모명		
			// custData.FAT_RSDNO		// 학부모주민번호		
			// custData.TEL				// 전화번호
			// custData.MOB				// 회원핸드폰
			$("#textbox17").val(custData.CPHONE);			// 학부모핸드폰	
			// custData.DEPT_EMP_ID		// 지점장사번		
			// custData.DEPT_EMP_NAME	// 지점장명			
			// custData.DEPT_EMP_MOBILE	// 지점장핸드폰			
			// custData.LC_EMP_ID		// 센터장사번		
			// custData.LC_EMP_NAME		// 센터장명		
			// custData.LC_EMP_MOBILNO	// 센터장핸드폰		
			// custData.GRADE_CDE		// 학년코드
			// custData.AGE_CDE			// 연령코드
			// custData.DIV_KIND_CDE	// 브랜드ID
			$("#hiddenbox3").val(CUST_ID);					// 고객번호	

			// 신규일경우 초기값 세팅
			if (sJobType == "I") {
				$("#textbox8").val(custData.UP_DEPT_ID);		// 상위지점(부서)코드(연계본부코드)
				$("#textbox9").val(custData.UPDEPTNAME);		// 상위지점(부서)코드명(연계본부명)
				$("#hiddenbox10").val(custData.DIV_KIND_CDE);	// 브랜드ID
				$("#hiddenbox6").val(custData.AREA_CDE);		// 지역코드
				$("#textbox10").val(custData.TELPNO_LC || custData.TELPNO_DEPT); // 연계사업국/센터 전화번호
				$("#textbox12").val(custData.DEPT_ID);			// 지점(부서)코드(연계사업국코드)	
				$("#textbox13").val(custData.DEPT_NAME);		// 지점(부서)코드명(연계사업국명)		
				$("#hiddenbox2").val(custData.DEPT_EMP_ID);		// 지점장사번
				$("#hiddenbox1").val(custData.LC_ID)			// 센터ID	(연계센터코드)
				$("#textbox15").val(custData.LC_NAME);			// 센터명	(연계센터명)
				$("#hiddenbox4").val(custData.LC_EMP_ID);		// 센터장사번
				$("#selectbox2").val(custData.GRADE_CDE);		// 학년코드
				$("#hiddenbox9").val(custData.AGE_CDE);			// 연령코드
				setDate();										// 상담시간, 연계시간
			}

		});
};

/**
 * 입회정보 저장
 * @param {object} counselData 입회정보
 * @param {object} transData   연계정보
 * @param {object} obData      OB관련 데이터
 */
const saveEnterInfo = (counselData, transData, obData) => new Promise((resolve, reject) => {

	const settings = {
		global: false,
		url: `${API_SERVER}/cns.saveEnter.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "입회등록",
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
 * 입회정보 조회
 * @param {string} sCSEL_DATE 상담일자
 * @param {string} sCSEL_NO   상담번호
 * @param {string} sCSEL_SEQ  상담순번
 */
const getCounsel = (sCSEL_DATE, sCSEL_NO, sCSEL_SEQ) => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/cns.getCounsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "입회등록",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
				CSEL_DATE : sCSEL_DATE, // 상담일자, 
				CSEL_NO	  : sCSEL_NO,	// 상담번호
				PROC_MK   : "5",		// 처리구분-5로 셋팅
			}],
		}),
		errMsg: "입회등록정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings)
		.done(res => {
			if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));
			
			DS_COUNSEL = res.dsRecv;
			if(DS_COUNSEL.length == 0) {
				const errmsg = settings.errMsg + "\n\n입회정보가 존재하지 않습니다.";
				alert(errmsg);
				return reject(new Error(errmsg));
			}

			// 상담순번 세팅
			createSeq($("#selectbox3"), DS_COUNSEL);
			$("#selectbox3").val(sCSEL_SEQ);
			const cselIdx  = $("#selectbox3 option:selected").index();
			const cselData = DS_COUNSEL[cselIdx];

			// 티켓ID가 존재하고, 추가등록/관계회원이 아닌경우에만 티켓오픈.
			if(cselData.ZEN_TICKET_ID && sCSEL_SEQ == 1) topbarClient.invoke('routeTo', 'ticket', cselData.ZEN_TICKET_ID);

			// 입회과목 세팅
			setPlProd(grid4, cselData.PLURAL_PRDT_LIST); 

			// 입회정보 세팅
			// cselData.CSEL_DATE				// 상담일자				
			// cselData.CSEL_NO					// 상담번호				
			// cselData.CSEL_SEQ				// 상담순번				
			// cselData.CUST_ID					// 고객번호				
			// cselData.CUST_MK					// 고객구분				
			// cselData.CSEL_USER_ID			// 상담원id					
			$("#timebox2").val(cselData.CSEL_STTIME);							// 상담시작시간					
			// cselData.CSEL_EDTIME				// 상담종료시간					
			$("#selectbox4").val(cselData.CSEL_CHNL_MK);						// 상담채널구분					
			// cselData.CSEL_MK					// 상담구분				
			$("#textbox18").val(cselData.CSEL_TITLE);							// 상담제목			
			$("#textbox25").val(cselData.CSEL_CNTS);							// 상담상세내용				
			// cselData.OCCUR_DATE				// 문제발생일자				
			// cselData.LIMIT_MK				// 처리시한구분				
			// cselData.PROC_HOPE_DATE			// 처리희망일자					
			$("#selectbox9").val(cselData.CSEL_MAN_MK);							// 내담자구분					
			// cselData.CUST_RESP_MK			// 고객반응구분					
			// cselData.CALL_RST_MK				// 통화결과구분					
			// cselData.CSEL_RST_MK1			// 상담결과구분					
			// cselData.CSEL_RST_MK2			// 상담결과구분2					
			// cselData.PROC_MK					// 처리구분				
			$("#textbox12").val(cselData.DEPT_ID);								// 관할지점코드(연계사업국코드)		
			$("#textbox8").val(cselData.DIV_CDE);								// 관할본부코드				
			$("#hiddenbox6").val(cselData.AREA_CDE);							// 관할지역코드
			$("#selectbox2").val(cselData.GRADE_CDE);							// 학년코드				
			$("#selectbox7").val(cselData.MOTIVE_CDE);							// 입회사유코드				
			$("#selectbox8").val(cselData.FST_CRS_CDE);							// 첫상담경로					
			calendarUtil.setImaskValue("calendar4", cselData.TRANS_DATE);		// 연계일자				
			$("#hiddenbox7").val(cselData.TRANS_NO);							// 연계번호				
			// cselData.PROC_STS_MK				// 처리상태구분					
			// cselData.WORK_STYL_MK			// 근무형태구분					
			// cselData.USER_GRP_CDE			// 상담원그룹코드					
			// cselData.PLURAL_PRDT_ID			// 병행과목코드					
			// cselData.MBR_ID					// 회원번호			
			$("#hiddenbox2").val(cselData.DEPT_EMP_ID);		// 지점장사번
			// cselData.CTI_CHGDATE				// cti변경일자					
			// cselData.TO_TEAM_DEPT			// 지점장부서					
			// cselData.OPEN_GBN				// 공개여부				
			// cselData.VOC_MK					// VOC			
			// cselData.CSEL_GRD				// 상담등급				
			// cselData.RE_PROC					// 재확인여부				
			// cselData.CALL_STTIME				// 통화시작시간					
			// cselData.CALL_EDTIME				// 통화종료시간					
			// cselData.TELPNO_DEPT				// 지점전화번호	
			$("#textbox13").val(cselData.DEPT_NAME);							// 지점명(연계사업국명)	
			$("#textbox9").val(cselData.UP_DEPT_NAME);							// 본부명(연계본부명)		
			// cselData.AREA_NAME				// 지역코드		
			$("#textbox19").val(cselData.CSEL_LTYPE_CDE_D);						// 분류(대)	2자리	
			$("#textbox21").val(cselData.CSEL_MTYPE_CDE_D);						// 분류(중)	2자리	
			$("#textbox23").val(cselData.CSEL_STYPE_CDE_D);						// 분류(소)	2자리			
			$("#textbox20").val(cselData.CSEL_LTYPE_NAME);						// 분류(대) 명						
			$("#textbox22").val(cselData.CSEL_MTYPE_NAME);						// 분류(중) 명						
			$("#textbox24").val(cselData.CSEL_STYPE_NAME);						// 분류(소) 명						
			// cselData.PLURAL_PRDT_LIST		// 병행과목코드						
			// cselData.PLURAL_PRDT_NAME		// 병행과목명						
			// cselData.ORG_CSEL_RST_MK1		// ORG상담결과구분						
			// cselData.TASK_ID					// 태스크ID				
			// cselData.LIST_ID					// 리스트ID				
			// cselData.OB_TYPE					// OB_TYPE				
			// cselData.PROC_DEPT_ID			// 직원상담처리지점					
			// cselData.PROC_DEPT_NAME			// 직원상담처리지점명					
			$("#hiddenbox1").val(cselData.LC_ID);								// 센터코드	(연계센터코드)		
			$("#hiddenbox4").val(cselData.LC_EMP_ID);							// 센터장사번
			$("#textbox15").val(cselData.LC_NAME);								// 센터명(연계센터명)	
			$("#textbox10").val(cselData.TELPNO_LC || cselData.TELPNO_DEPT);	// 센터전화번호(사업국/센터 전화번호)			
			$("#hiddenbox5").val(cselData.ZEN_TICKET_ID);						// ZEN_티켓 ID	
			// cselData.EVT_NM					// 이벤트명			
			$("#hiddenbox9").val(cselData.AGE_CDE);								// 연령코드			
			// cselData.DEPT_EMP_NAME			// 지점장명					
			// cselData.DEPT_EMP_MOBILE			// 지점장핸드폰번호						
			// cselData.LC_EMP_NAME				// 센터장명					
			// cselData.LC_EMP_MOBILNO			// 센터장핸드폰번호	
			$("#hiddenbox10").val(cselData.DIV_KIND_CDE);						// 브랜드ID
				
			setBtnCtrlAtLoadComp();				// 버튼제어

			return resolve(cselData);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 연계정보 조회
 * @param {string} TRANS_DATE 연계일자
 * @param {string} TRANS_NO 연계번호
 */
const getEnterData = (TRANS_DATE, TRANS_NO) => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/cns.getEnterData.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "입회등록",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv1", "dsRecv2"],
			dsSend: [{ TRANS_DATE, TRANS_NO }],
		}),
		errMsg: "연계정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings)
		.done(res => {
			if (!checkApi(res, settings)) return reject(new Error(getApiMsg(data, settings)));
			
			const DS_TRANS 	   = res.dsRecv1;
			const DS_TRANS_EMP = res.dsRecv2;
			
			// 지점연계정보 세팅
			const transData = (DS_TRANS?.length > 0) ? DS_TRANS[0] : new Object();
			calendarUtil.setImaskValue("calendar4", transData.TRANS_DATE); 	    // 연계일자
			$("#hiddenbox7").val(transData.TRANS_NO);					        // 연계번호
			$("#timebox3").val(transData.TRANS_TIME);				    	    // 연계일시
			$("#selectbox5").val(transData.TRANS_CHNL_MK);					    // 연계방법	
			// transData.TRANS_DEPT_ID		// 지점코드(연계사업국코드)	
			// transData.DEPT_ACP_ID		// 접수자사번
			$("#textbox14").val(transData.DEPT_ACP_NAME);						// 접수자	
			if ($("#textbox14").val()) $("#textbox14").prop("readonly", true);  // 접수자가 있으면 입력안되게
			// transData.TRANS_CNTS			// 상담내용
			calendarUtil.setImaskValue("calendar5", transData.DEPT_ACP_DATE); 	// 접수일자	
			$("#timebox4").val(transData.DEPT_ACP_TIME);					 	// 접수시간	

			// 지점연계대상자정보 세팅
			const empData = (DS_TRANS_EMP?.length > 0) ? DS_TRANS_EMP : new Array();
			const ids 	= empData.map(el => el.TRANS_EMP_ID).join(", ");
			const names = empData.map(el => el.TRANS_EMP_NM).join(", ");
			$("#hiddenbox8").val(ids);
			$("#textbox11").val(names);

			return resolve({DS_TRANS, DS_TRANS_EMP});
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 조회 버튼
 * @param {string} CSEL_SEQ 상담순번
 */
var onSearch = async (CSEL_SEQ) => {

	// 입회정보 조회
	const sCSEL_DATE = calendarUtil.getImaskValue("calendar3") // 상담일자
	const sCSEL_NO	 = $("#textbox7").val(); 				   // 상담번호
	const sCSEL_SEQ	 = CSEL_SEQ || $("#selectbox3").val();	   // 상담순번
	const cselData = await getCounsel(sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);
	
	// 고객정보 조회
	getCust(cselData.CUST_ID, "U");		

	// 연계정보 조회
	getEnterData(cselData.TRANS_DATE, cselData.TRANS_NO);

}

/**
 * 저장
 * - as-is : cns4700.onSave()
 */
const onSave = async () => {

	// 과목군을 전체로 변경하여 filter 초기화
	$("#selectbox1").val("").trigger("change");

	// 저장 validation check
	const cselData = await getCselCondition();
	if (!cselData) return false;
	const transData = getTransCondition();
	if (!transData) return false;
	const customData  = await getCustomData();
	if (!customData) return false;

	// OB관련 데이터 세팅
	const obData = await getObCondition(cselData.ZEN_TICKET_ID);
	cselData.OBLIST_CDE		= obData.OBLIST_CDE;
	cselData.LIST_CUST_ID	= obData.LIST_CUST_ID;
	cselData.CALLBACK_ID	= obData.CALLBACK_ID;

	// 티켓 요청자 체크
	await checkTicketRequester(cselData.ZEN_TICKET_ID, customData.requesterId);
	
	// CCEM DB 저장
	const resSave = await saveEnterInfo(cselData, transData, obData);
	$("#textbox7").val(resSave.CSEL_NO);
	cselData.CSEL_NO = resSave.CSEL_NO;
	
	// 티켓 업데이트
	await updateTicket(cselData, customData);

	// 녹취정보 저장
	await saveRecData(cselData);
	
	// 저장성공후
	onSearch()								// 입회등록화면 재조회	
	refreshDisplay();						// 오픈된 화면 재조회
	topbarClient.invoke("popover", "hide"); // topbar 숨김
	alert("저장 되었습니다.");

	return true;
}

/**
 * 입회정보 validation check
 * -as-is : cns4700.onNeedCheck(), setDataForSave(), 
 */
const getCselCondition = async () => {

	const data = {
		ROW_TYPE			: "",		 									// 저장구분(I/U/D)		
		CSEL_DATE			: calendarUtil.getImaskValue("calendar3"), 		// 상담일자		
		CSEL_NO				: $("#textbox7").val(), 						// 상담번호	
		CSEL_SEQ			: $("#selectbox3").val(), 						// 상담순번		
		CUST_ID				: $("#hiddenbox3").val(), 						// 고객번호	
		CUST_MK				: "MB", 										// 고객구분(MB로 고정)	
		CSEL_USER_ID		: currentUser.external_id, 						// 상담원id			
		CSEL_STTIME			: $("#timebox2").val(), 						// 상담시작시간		
		// CSEL_EDTIME		: "", // 상담종료시간						
		CSEL_CHNL_MK		: $("#selectbox4").val(), 						// 상담채널구분			
		CSEL_MK				: "3", 											// 상담구분(3으로 고정)	
		CSEL_LTYPE_CDE		: $("#textbox19").val(), 						// 상담대분류코드			
		CSEL_MTYPE_CDE		: $("#textbox21").val(), 						// 상담중분류코드			
		CSEL_STYPE_CDE		: $("#textbox23").val(), 						// 상담소분류코드	
		CSEL_TITLE			: $("#textbox18").val(),   					    // 상담제목
		CSEL_CNTS			: $("#textbox25").val().trim(), 				// 상담상세내용		
		// LIMIT_MK			: "", // 처리시한구분		
		// PROC_HOPE_DATE	: "", // 처리희망일자			
		CSEL_MAN_MK			: $("#selectbox9").val(), 						// 내담자구분		
		// CUST_RESP_MK		: "", // 고객반응구분			
		// CALL_RST_MK		: "", // 통화결과구분		
		DEPT_ID				: $("#textbox12").val(), 						// 관할지점코드(연계사업국코드)	
		DIV_CDE				: $("#textbox8").val(), 						// 관할본부코드(본부코드)	
		AREA_CDE			: $("#hiddenbox6").val(), 						// 관할지역코드		
		GRADE_CDE			: $("#selectbox2").val(), 						// 학년코드		
		MOTIVE_CDE			: $("#selectbox7").val(), 						// 입회사유코드		
		FST_CRS_CDE			: $("#selectbox8").val(), 						// 첫상담경로(입회경로)
		TRANS_DATE			: calendarUtil.getImaskValue("calendar4"), 		// 연계일자		
		TRANS_NO			: $("#hiddenbox7").val(), 						// 연계번호		
		PROC_STS_MK			: getProcStsMk(), 								// 처리상태구분		
		// WORK_STYL_MK		: "", // 근무형태구분			
		USER_GRP_CDE		: currentUser.user_fields.user_grp_cde, 		// 상담원그룹코드			
		MBR_ID				: $("#textbox3").val(), 						// 회원번호	
		DEPT_EMP_ID			: $("#hiddenbox2").val(),   					// 지점장사번		
		// CTI_CHGDATE		: "", // cti변경일자		
		// TO_TEAM_DEPT		: "", // 지점장부서			
		// CALL_STTIME		: "", // 통화시작시간		
		// CALL_EDTIME		: "", // 통화종료시간		
		LC_ID				: $("#hiddenbox1").val(), 						// 센터ID	
		LC_EMP_ID			: $("#hiddenbox4").val(), 						// 센터장사번		
		ZEN_TICKET_ID		: $("#hiddenbox5").val(), 						// 티켓ID			
		// PLURAL_PRDT_ID	: "", // 병행과목코드			
		// PLURAL_PRDT_LIST	: "", // 병행과목코드리스트				
		// PLURAL_PRDT_NAME	: "", // 병행과목코드명		
		PROC_MK				: "5" 											// 처리구분(5로 고정)	
	}
	
	// 저장구분 세팅(I: 신규, U: 수정)
	const selectbox = document.getElementById("selectbox3");
	const selectedSeq = selectbox.value;
	const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;
	data.ROW_TYPE = sJobType;

	// 날짜 및 시간 유효성 체크
	data.CSEL_DATE 	  = data.CSEL_DATE.length != 8 ? "" 	: data.CSEL_DATE;
	data.TRANS_DATE	  = data.TRANS_DATE.length != 8 ? "" 	: data.TRANS_DATE;
	data.CSEL_STTIME	  = data.CSEL_STTIME.length != 6 ? "" : data.CSEL_STTIME;

	// 병행과목코드리스트 세팅
	const plProd = getPlProd(grid5);
	data.PLURAL_PRDT_LIST = plProd.ids.join("_");
	data.PLURAL_PRDT_NAME = plProd.names.join(",");

	// 상담분류세팅
	data.CSEL_LTYPE_CDE = data.CSEL_MK + data.CSEL_LTYPE_CDE;
	data.CSEL_MTYPE_CDE = data.CSEL_LTYPE_CDE + data.CSEL_MTYPE_CDE;
	data.CSEL_STYPE_CDE = data.CSEL_MTYPE_CDE + data.CSEL_STYPE_CDE;

	if (!data.CUST_ID) {
		alert("조회된 고객이 없습니다.\n\n[고객조회]를 먼저 하고, 처리 하시기 바랍니다.");
		return false;
	}
	if (!data.TRANS_DATE) { 
		alert("연계일시를 입력하여 주십시오"); 
		$("#calendar4").focus();
		return false;
	 }
	if (!data.MOTIVE_CDE) { 
		alert("입회사유를 선택하여 주십시오"); 
		$("#selectbox7").focus();
		return false; 
	}
	if (!data.FST_CRS_CDE) { 
		alert("입회경로를 선택하여 주십시오"); 
		$("#selectbox8").focus();
		return false; 
	}
	if (!$("#selectbox5").val()) { 
		alert("연계방법을 선택하여 주십시오"); 
		$("#selectbox5").focus();
		return false;
	}
	if (!data.PLURAL_PRDT_LIST) {
		alert("입회과목을 선택하여 주십시오"); 
		return false;
	}
	if (!checkByte(data.CSEL_CNTS, 4000)) {
		alert("기타요구사항은 4000Byte를 초과할 수 없습니다.");
		$("#textbox25").focus();
		return false;
	}

	// 상담원 그룹일 경우 중,소 분류코드까지 입력을 받아야 함
	const lvlMk = currentUser.user_fields.user_lvl_mk;
	const isLowLvl = (lvlMk != "user_lvl_mk_1" && lvlMk != "user_lvl_mk_2" && lvlMk != "user_lvl_mk_3") ? true : false;
	if (chkGroup() && isLowLvl) {
		if (!$("#textbox19").val()) {
			alert("대분류를 선택하여 주십시오"); 
			$("#textbox20").focus();
			return false;
		}
		if (!$("#textbox21").val()) {
			alert("중분류를 선택하여 주십시오"); 
			$("#textbox22").focus();
			return false;
		}
		if (!$("#textbox23").val()) {
			alert("소분류코드를 선택하여 주십시오"); 
			$("#textbox24").focus();
			return false;
		}
	// 기타 상담원 및 슈퍼바이저이상 의 경우 중분류 코드까지 입력 받음
	} else { 
		if (!$("#textbox19").val()) {
			alert("대분류를 선택하여 주십시오"); 
			$("#textbox20").focus();
			return false;
		}
		if (!$("#textbox21").val()) {
			alert("중분류를 선택하여 주십시오"); 
			$("#textbox22").focus();
			return false;
		}
	}
	
	if (!data.MBR_ID) {
		// 회원번호가 없으면 회원번호 생성
		data.MBR_ID = await getNewMbrId(data.CUST_ID);
		// 회원번호 생성 실패시
		if (!data.MBR_ID) { 
			alert("회원번호를 확인할 수 없습니다. \n\n회원의 성별, 이름, 주소, 지점정보는 필수 입력사항입니다.\n\n다시 확인해 주십시오.");
			if (!confirm("회원번호 없이 저장하시겠습니까?")) return false;
		}
	}

	// 저장구분에 따라 티켓체크
	// 상담순번이 1이고, 신규저장일떄.
	if (sJobType == "I" && selectedSeq == 1) {

		// 티켓이 유효한지 체크.
		const ticket_id = await checkTicket();
		if (!ticket_id) return false;
		data.ZEN_TICKET_ID = ticket_id;

		// 녹취키세팅
		data.RECORD_ID = getCustomFieldValue(currentTicket, ZDK_INFO[_SPACE]["ticketField"]["RECORD_ID"]);

	// 추가등록/관계회원 신규저장일때.
	} else if (sJobType == "I" && selectedSeq > 1) {

		// 티켓생성
		const ticket_id = await onNewTicket(DS_COUNSEL[0].ZEN_TICKET_ID);
		if (!ticket_id) return false;
		data.ZEN_TICKET_ID = ticket_id;
	
	// 수정저장일떄.
	} else if (sJobType == "U") {

	} else {
		alert(`저장구분이 올바르지 않습니다.[${sJobType}]\n\n관리자에게 문의하기시 바랍니다.`);
		return false;
	}

	return data;

}

/**
 * 연계정보 validation check
 */
const getTransCondition = () => {

	const data = {
		TRANS_DATE		: calendarUtil.getImaskValue("calendar4"), // 연계일시	
		TRANS_TIME		: $("#timebox3").val(),					   // 연계시간
		TRANS_NO		: $("#hiddenbox7").val(), 				   // 연계번호	
		TRANS_DEPT_ID	: $("#textbox12").val(), 				   // 연계지점코드(연계사업국코드)		
		TRANS_LC_ID		: $("#hiddenbox1").val(), 				   // 연계센터코드	
		TRANS_CNTS		: $("#textbox25").val().trim(), 		   // 연계내용	
		TRANS_CHNL_MK	: $("#selectbox5").val(), 				   // 연계방법구분		
		DEPT_ACP_NAME	: $("#textbox14").val().trim(),			   // 접수자
		DEPT_ACP_DATE	: calendarUtil.getImaskValue("calendar5"), // 접수일자
		DEPT_ACP_TIME	: $("#timebox4").val(),					   // 접수시간
	}

	// 접수자가 있고 접수일시가 없을때 현재시간으로 세팅
	if (data.DEPT_ACP_NAME && !data.DEPT_ACP_DATE) {
		data.DEPT_ACP_DATE = getDateFormat().replace(/[^0-9]/gi, '');
		data.DEPT_ACP_TIME = getTimeFormat().replace(/[^0-9]/gi, '');
	}

	return data;

}

/**
 * OB관련 데이터 value check
 * @param {string|number} ticket_id
 */
const getObCondition = async (ticket_id) => {

	const data = {
		OBLIST_CDE		: "", // OB리스트구분	
		LIST_CUST_ID	: "", // 리스트_고객_ID(OBLIST_CDE = '60' 외 나머지 경우 셋팅)
		CSEL_DATE		: calendarUtil.getImaskValue("calendar3"),  // 상담일자	
		CSEL_NO			: $("#textbox7").val(), 					// 상담번호
		CALLBACK_ID		: "", // CALLBACK_ID(OBLIST_CDE = '60'일 경우 셋팅)
	}
	
	// 티켓필드에서 필요한정보를 가져온다.
	if (!ticket_id) return new Object();
	const { ticket } = await topbarClient.request(`/api/v2/tickets/${ticket_id}`);
	if (!ticket || !ticket.custom_fields || ticket.custom_fields.length == 0) return new Object();

	const fOB_MK 		= ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["OB_MK"]);
	const fLIST_CUST_ID = ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["LIST_CUST_ID"]);
	const fCALLBACK_ID 	= ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["CALLBACK_ID"]);

	// OB리스트구분에 따라 값세팅
	data.OBLIST_CDE = fOB_MK?.value?.split("_")[2] || ""; // oblist_cde_${OBLIST_CDE}
	if (data.OBLIST_CDE == "60") {
		data.CALLBACK_ID = fCALLBACK_ID?.value || "";
	} else {
		data.LIST_CUST_ID = fLIST_CUST_ID?.value || "";
	}

	return data;
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

	// if (way == "") PROC_STS_MK = "";
	// else if (way == "1") {					// 연계방법이 전화인 경우
	// 	if (txtCntAcp) PROC_STS_MK = "99";	// 지점 접수자가 있으면 바로 완료 상태
	// 	else PROC_STS_MK = "01";			// 없으면 접수
	// }
	// else PROC_STS_MK = "99";				// 연계방법 Email,Fax인경우 바로 완료 상태

	if (txtCntAcp) {
		PROC_STS_MK = "99";	// 완료
	} else {
		PROC_STS_MK = "03"; // 지점으로 전달완료
	}

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
 */
const setBtnCtrlAtLoadComp = () => {
	$("#button2").prop("disabled", true);	// 고객조회 비활성화
	$("#button3").prop("disabled", false);	// 입회연계 활성화
	$("#button4").prop("disabled", false);	// 추가등록 활성화
	$("#button5").prop("disabled", false);	// 관계회원 활성화  
	$("#button7").prop("disabled", true);	// 티켓생성버튼 비활성화
}

/**
 * 추가등록
 * - as-is : cns4700.onAddReg()
 */
var addCsel = () => {
	  
	// 상담내용 초기화.
	$("#textbox25").val("");
	$("#selectbox6").val("");

	// 상담순번 추가
	const newIdx = $("#selectbox3 option").length + 1;
	const option = new Option(newIdx, newIdx);
	option.dataset.jobType = "I";
	$("#selectbox3").append(option);
	$("#selectbox3").val(newIdx);

	// 버튼 제어
	$("#button3").prop("disabled", true);	// 입회연계 비활성화
	$("#button4").prop("disabled", true);	// 추가등록 비활성화

	// init value
	$("#selectbox9").val("01");	// 내담자 : 모
	$("#selectbox5").val("3");	// 연계방법 : FAX

}

/**
 * 티켓생성버튼
 * @param {string|number} parent_id Zendesk ticket id
 */
const onNewTicket = async (parent_id) => {
	
	// 사용자 체크
	const CUST_ID = $("#hiddenbox3").val();
	const CUST_NAME = $("#textbox2").val();
	const target = "C";	// 대상구분(고객 : C, 선생님 : T)
	const user_id = await checkUser(target, CUST_ID, CUST_NAME);
	if (!user_id) return false;

	// 티켓생성
	const origin = await createTicket(user_id, parent_id);
	currentTicket = origin.ticket;
	$("#button7").prop("disabled", true);	// 티켓생성버튼 비활성화

	return currentTicket.id;

}

/**
 * 티켓정보 value check
 */
const getCustomData = async () => {

    const data = {
	    prdtList 	    : grid5.getData().map(el => `${Number(el.PRDT_GRP)}::${el.PRDT_ID}`.toLowerCase()), // 과목리스트(ex. ["11::2k", "11::k","10::m"])
		deptIdNm 	    : $("#textbox13").val(),			// 지점부서명(사업국명)
	    aeraCdeNm 	    : "",	// 지역코드명
	    procDeptIdNm    : "",	// 연계부서명
        lcName 		    : $("#textbox15").val(),			// 러닝센터명(센터명)
		reclCntct 	    : "", // 재통화예약연락처
		ageCde 			: $("#hiddenbox9").val().trim(),	// 연령코드
		brandId			: $("#hiddenbox10").val(),			// 브랜드ID
		empList    		: [], // 연계대상자
		requesterId		: undefined, // requester_id
		transMk			: "3",		 // 연계구분 - 입회연계
	}

	// 고객번호가 있을경우에만 requesterId 세팅
	const sCUST_ID = $("#hiddenbox3").val();
	if (sCUST_ID) {
		const { users } = await zendeskUserSearch(sCUST_ID.trim());

		if (users.length === 0) {
			alert("젠데스크 사용자를 생성중입니다.\n\n잠시후 다시 시도해 주세요.");
			return false;
		}

		data.requesterId = users[0].id;
	}

	return data;
	
}

/**
 * 사업국/센터 선택시
 * @param {object} data 
 */
var setDisPlay = (data) => {
	$("#textbox8").val(data.DIV_CDE);			// 상위지점(부서)코드		(연계본부코드)
	$("#textbox9").val(data.UPDEPTNAME);		// 상위지점(부서)코드명		(연계본부명)
	$("#hiddenbox10").val(data.DIV_KIND_CDE);	// 브랜드ID
	$("#hiddenbox6").val(data.AREA_CDE)			// 지역코드
	$("#textbox10").val(data.TELPNO_LC || data.TELPNO_DEPT); // 연계사업국/센터 전화번호
	$("#textbox12").val(data.DEPT_ID);			// 지점(부서)코드			(연계사업국코드)	
	$("#textbox13").val(data.DEPT_NAME);		// 지점(부서)코드명			(연계사업국명)		
	$("#hiddenbox2").val(data.DEPT_EMP_ID);		// 지점장ID
	$("#hiddenbox1").val(data.LC_ID)			// 센터ID					(연계센터코드)
	$("#textbox15").val(data.LC_NAME);			// 센터명					(연계센터명)
	$("#hiddenbox4").val(data.LC_EMP_ID);		// 센터장ID
}

/**
 * 회원번호 생성
 * @param {string} CUST_ID 고객번호
 * @return {string} MBR_ID(회원번호)
 */
const getNewMbrId = (CUST_ID) => new Promise((resolve, reject) => {
	const settings = {
		global: false,
		url: `${API_SERVER}/cns.getNewMbrId.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "입회등록",
			senddataids	: ["dsSend"],
			recvdataids	: ["dsRecv"],
			dsSend		: [{CUST_ID}]
		}),
		errMsg: "회원번호 생성중 오류가 발생하였습니다.",
	}
	
	$.ajax(settings)
		.done(res => {

			if (res.errcode != "0") {
				console.error("getNewMbrId: ", res.errmsg);
				return resolve("");
			}

			if (res.dsRecv?.length > 0) return resolve(res.dsRecv[0].MBR_ID || "");
			else return resolve("");

		})
		.fail(() => resolve(""));
});

/**
 * 전화걸기
 * - as-is : cns4700.onMakeCall()
 */
 const onMakeCall = (elm) => {

	const status = $(elm).hasClass("callOn") ? "callOn" : "callOff";
	const selectbox = document.getElementById("selectbox3");
	const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;
	const sCselSeq = selectbox.value;
	const targetPhone = $("#textbox10").val().trim().replace(/-/gi,''); // 연계사업국/센터 전화번호
	const ticket_id = $("#hiddenbox5").val();

	// 고객과의 통화시간을 저장하기 위해서
	// 고객과 통화종료후 SEQ=1인것을 저장을 하지 않은상태에서 지점 전화걸기를 막는다.
	if (status == "callOn" && sJobType == "I" && sCselSeq == "1") {
		alert("먼저 입회등록 정보를 저장하신 후에\n\n사업국/센터로 전화를 걸기 바랍니다.");
		return;
	}

	if (status == "callOn" && targetPhone.length < 4) {
		alert("전화걸기를 할 수 없습니다.\n\n전화번호가 유효하지 않습니다.");
		return;
	}
	
	topbarObject.wiseNTalkUtil.callStart(status, targetPhone, "CCEMPRO031", ticket_id);

}

/**
 * 상담 통화시간 저장
 */
 const onSaveCallTime = async () => {

	// 현재 상담건의 저장구분이 수정(U) 일 경우 상담 통화시간 저장
	if (getJobType("selectbox3") == "U") {

		const ticket_id = $("#hiddenbox5").val();
		if (!ticket_id) return;

		const data = await getCallTimeCondition(topbarClient, ticket_id);
		
		topbarObject.saveCallTime({
			userid			: currentUser?.external_id,
			menuname		: "입회등록",
			CSEL_NO			: $("#textbox7").val(), 					// 상담번호	
			CSEL_DATE		: calendarUtil.getImaskValue("calendar3"),  // 상담일자		
			CALL_STTIME		: data.CALL_STTIME, 						// 통화시작시간(시분초:172951)
			CALL_EDTIME		: data.CALL_EDTIME, 						// 통화종료시간(시분초:173428)
			RECORD_ID		: data.RECORD_ID, 							// 녹취키(리스트) 없는 경우 []
		});

	}

}

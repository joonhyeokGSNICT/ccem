var topbarObject;

var sidebarClient;			// 현재 오픈된 티켓사이드바 client
var topbarClient;			// 탑바 client

var currentUser;			// 현재 사용중인 유저의 정보(ZENDESK)

var codeData = [];			// 전체 공통코드
var prods	 = [];			// 과목리스트

var grid1;	// 상담등록 > 과목 grid
var grid2;	// 상담등록 > 상담과목 grid
var grid3;	// 상담등록 > 학습중인과목 grid
var grid4;	// 입회등록 > 과목 grid
var grid5;	// 입회등록 > 입회과목 grid

var DS_DM_RECEIPT  = {};		// DM 사은품 접수 정보 저장 data
var DS_DROP_TEMP2  = {};		// 개인정보동의 정보 저장 data
var DS_DROP_CHG    = {};		// 고객직접퇴회 정보 저장 data
var DS_SCHEDULE	   = {};		// 재통화예약 정보 저장 data

$(function () {
	
	createGrids();
	getProd();

	// grid refreshLayout
	$('.nav-link').on('shown.bs.tab', ev => refreshGrid(ev.target.id));

	// insert hash
	$('.nav-link').on('click', ev => window.location.hash = ev.target.hash);

	// 티켓생성 버튼 
	$("#button10").on("click", ev => {
		loading = new Loading(getLoadingSet('티켓을 생성 중 입니다.'));
		createTicket()
			.then( async (data) => { 
				if (data)  {
					await topbarClient.invoke('routeTo', 'ticket', data.ticket.id);	// 티켓오픈
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
	$("#button8").on("click", ev => {
		loading = new Loading(getLoadingSet('상담정보 저장 중 입니다.'));
		saveCounsel()
			.then((succ) => { if (succ) alert("저장 되었습니다."); })
			.catch((error) => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`상담정보 저장중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

	// select tab by hash
	let hash = window.location.hash;
	if (hash === "#counselRgtrTab") $("#counselRgtrNav").click();
	else if (hash === "#entrRgtrTab") $("#entrRgtrNav").click();
	else if (hash === "#tchrIntrdTab") $("#tchrIntrdNav").click();

	// 날짜와 시간 초기값 세팅
	$("#textbox27").val(getDateFormat());
	$("#textbox29").val(getTimeFormat());
	$("#calendar2").val(getDateFormat());

	// create calendar
	$(".calendar").each((i, el) => {
		if(el.id === "calendar2") calendarUtil.init(el.id, { drops: "up" });
		else if(el.id === "calendar5") calendarUtil.init(el.id, { opens: "center" });
		else calendarUtil.init(el.id);
	});

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	onStart(opener ? opener.name : "");

});

/**
 * 상담등록에서 사용하는 모든 Grid를 생성합니다.
 */
const createGrids = () => {
	// 상담등록 > 과목 grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 310,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum',   header: "NO",   minWidth: 30,},
			{ type: 'checkbox', header: " ",    minWidth: 30,},
		],
		columns: [
			{ header: '제품코드',     name: 'PRDT_ID',      width: 100,  	align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '과목',         name: 'PRDT_NAME',    minWidth: 142,  align: "left", sortable: true, ellipsis: true, hidden: false    },
			{ header: 'CTI제품코드',  name: 'PRDT_CDE',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군코드',   name: 'PRDT_GRP',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군명',     name: 'PRDT_GRPNM',   width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품순번',     name: 'PRDT_SEQ',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '사용여부',     name: 'USE_FLAG',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '선택',         name: 'USE',          width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
		],
	});
	grid1.on('click', (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
		grid1.clickCheck(ev);
	});
	grid1.on("check", ev => {
		checkProd(grid2, grid1.getRow(ev.rowKey));
	});
	grid1.on("uncheck", ev => {
		uncheckProd(grid2, grid1.getRow(ev.rowKey));
	});

	// 상담등록 > 상담과목 grid
	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", minWidth: 30, },
		],
		columns: [
			{ header: '제품코드',     name: 'PRDT_ID',     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '상담과목',     name: 'PRDT_NAME',   align: "left", sortable: true, ellipsis: true, hidden: false    },
			{ header: 'CTI제품코드',  name: 'PRDT_CDE',    align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군코드',   name: 'PRDT_GRP',    align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군명',     name: 'PRDT_GRPNM',  align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품순번',     name: 'PRDT_SEQ',    align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '사용여부',     name: 'USE_FLAG',    align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '선택',         name: 'USE',         align: "left", sortable: true, ellipsis: true, hidden: true    },
		],
	});
	grid2.on('click', (ev) => {
		grid2.addSelection(ev);
		grid2.clickSort(ev);
	});

	// 상담등록 > 학습중인과목 grid
	grid3 = new Grid({
		el: document.getElementById('grid3'),
		bodyHeight: 80,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", },
		],
		columns: [
			{ header: '등록여부', 	    name: 'REG_YN',         align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                    
			{ header: '과목코드', 	    name: 'PRDT_ID',        align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '사번', 	        name: 'EMP_ID',         align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                
			{ header: '제품', 	        name: 'PRDT_NAME',      align: "center", sortable: false,  ellipsis: true,      hidden: false,  },                                                                                                                                                                                        
			{ header: '선생님', 	    name: 'TCHR',           align: "center", sortable: true,   ellipsis: true,      hidden: false,  },                                                                                                                                                                                    
			{ header: '전화번호', 	    name: 'TELPNO',         align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                    
			{ header: '팀장', 	        name: 'TCHR_PART',      align: "center", sortable: false,  ellipsis: true,      hidden: false,  },                                                                                                                                                                                        
			{ header: 'CTI과목코드', 	name: 'PRDT_CDE',       align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                            
			{ header: '핸드폰번호', 	name: 'MOBILNO',        align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                            
			{ header: '본부명', 	    name: 'DIV_NAME',       align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '지점명', 	    name: 'DEPT_NAME',      align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '지역명', 	    name: 'AREA_NAME',      align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '지점코드', 	    name: 'DEPT_ID',        align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '지점 전화번호 ', name: 'TELNO',          align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                 	                                                                                        
			{ header: '본부코드', 	    name: 'DIV_CDE',        align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '지역코드', 	    name: 'AREA_CDE',       align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '교사구분', 	    name: 'TCHR_MK_CDE',    align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                            
			{ header: '지점장사번', 	name: 'DEPT_EMP_ID',    align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                                
			{ header: '센터ID', 	    name: 'LC_ID',          align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                    
			{ header: '센터명', 	    name: 'LC_NAME',        align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '센터전화번호', 	name: 'TELPNO_LC',      align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                            
			{ header: '센터장사번', 	name: 'LC_EMP_ID',      align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                            
			{ header: 'YC여부', 	    name: 'YC_MK',          align: "center", sortable: false,  ellipsis: true,      hidden: true,   },   
		],
	});
	grid3.on('click', (ev) => {
		grid3.addSelection(ev);
		grid3.clickSort(ev);
	});

	// 입회등록 > 과목 grid
	grid4 = new Grid({
		el: document.getElementById('grid4'),
		bodyHeight: 283,
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
 * 그리드 레이아웃을 새로 고칩니다. 숨겨진 상태에서 그리드를 렌더링 한 경우이 방법을 사용합니다.
 * @param {string} key - nav id
 */
const refreshGrid = (key) => {
	switch (key) {
		case "counselRgtrNav":	// 상담등록
			grid1.refreshLayout();
			grid2.refreshLayout();
			grid3.refreshLayout();
			break;
		case "entrRgtrNav":      // 입회등록
			grid4.refreshLayout();
			grid5.refreshLayout();
			break;
		case "tchrIntrdNav":	 // 선생님소개
			break;
		default:
			grid1.refreshLayout();
			grid2.refreshLayout();
			grid3.refreshLayout();
			grid4.refreshLayout();
			grid5.refreshLayout();
			break;
	}
}

/**
 * 상담 과목 리스트 조회
 */
const getProd = () => {
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
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		prods = data.dsRecv;
		grid1.resetData(data.dsRecv);
		grid4.resetData(data.dsRecv);
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
 * 콤보박스 세팅
 * - as-is : cns5810.setCodeData()
 */
const setCodeData = () => {

	const CODE_MK_LIST = [
		"PRDT_GRP",			// 과목군
		"OPEN_GBN",			// 개인정보
		"CSEL_MAN_MK",		// 내담자
		"CSEL_MK",			// 상담구분
		"PROC_MK",			// 처리구분
		"LIMIT_MK",			// 처리시한
		"CUST_RESP_MK", 	// 고객반응
		"CSEL_RST_MK",		// 상담결과
		"STD_CRS_CDE", 		// 상담경로
		"PROC_STS_MK",		// 처리상태
		"CSEL_GRD",			// 상담등급
		"CSEL_CHNL_MK",		// 상담채널
		"GRADE_CDE",		// 학년
		"DM_TYPE_CDE",		// 지급사유
	];

	// get code
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// sorting
	const sortKey = "CODE_ID";
	codeList.sort((a, b) => a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0);

	// create select options
	for (const code of codeList) {

		const codeType = code.CODE_MK;
		const codeNm = code.CODE_NAME;
		const codeVal = code.CODE_ID;

		// filtering
		if (codeType == "DM_TYPE_CDE") { // 지급사유
			if (codeVal == "01" || codeVal == "02" || codeVal == "04" || codeVal == "05") continue;
		}
		if (codeType == "PROC_MK") { // 처리구분
			if (codeVal == "5" || codeVal == "6") continue;
		}

		// set
		$(`select[name='${codeType}']`).append(new Option(codeNm, codeVal));
	}
}

/**
 * 오픈되는 곳에 따라 분기처리
 * @param {string} openerName 
 */
const onStart = (openerName) => {

	// init
	$("#selectbox6").val("2");				// 고객반응
	$("#selectbox10").val("99");			// 처리상태
	$("#button4").prop("disabled", true);	// 상담연계
	$("#button5").prop("disabled", true);	// 추가등록
	$("#button6").prop("disabled", true);	// 관계회원
	$("#button7").prop("disabled", true);	// 결과등록

	// 탑바 > 고객정보 > 고객 > 상담등록 버튼으로 오픈
	if(openerName.includes("top_bar")) {	
		topbarObject = opener;
		topbarClient = topbarObject.client;
		currentUser  = topbarObject.currentUserInfo.user;
		codeData 	 = topbarObject.codeData;

		setCodeData();

		const custId = topbarObject.document.getElementById("custInfo_CUST_ID").value;	// 고객번호
		const custMk = topbarObject.document.getElementById("custInfo_CUST_MK").value;	// 고객구분
		const target = (custMk == "PE" || custMk == "TC") ? "T" : "C";
		getBaseData(target, custId);

	// 상담조회 > 상담/입회수정 버튼으로 오픈
	}else if(openerName.includes("CCEMPRO035")) {	
		topbarObject = opener.topbarObject;
		topbarClient = topbarObject.client;
		currentUser  = topbarObject.currentUserInfo.user;
		codeData 	 = topbarObject.codeData;

		setCodeData();

		const counselGrid = opener.grid1;	// 상담조회 grid
		const rowKey 		= counselGrid.getSelectedRowKey();
		const cselDate 		= counselGrid.getValue(rowKey, "CSEL_DATE");	// 상담일자
		const cselNo 		= counselGrid.getValue(rowKey, "CSEL_NO");		// 상담번호
		const cselSeq 		= counselGrid.getValue(rowKey, "CSEL_SEQ");		// 상담순번
		calendarUtil.setImaskValue("textbox27", cselDate);
		$("#textbox28").val(cselNo);
		getCounsel(cselSeq, true);

	}
}

/**
 * 상담등록 기본정보 조회 and 학습중인 제품 조회
 * - as-is : cns5810.onSearchBaseData()
 * @param {string} target 대상구분 ( "C" : 고객, "T" : 선생님 )
 * @param {string} targetId 고객번호 or 사번
 */
var getBaseData = (target, targetId) => {

	let service, condition;

	if (target == "C") {
		service = "/cns.getCust.do";
		condition = { CUST_ID: targetId };
	} else if (target == "T") {
		service = "/cns.getTchr.do";
		condition = { EMP_ID: targetId };
	}

	const settings = {
		url: `${API_SERVER + service}`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg: "상담등록 기본정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		const baseData = data.dsRecv;
		if (baseData.length > 0) {

			const row = baseData[0];
			$("#textbox21").val(row.NAME);			// 고객명, 선생님명
			$("#textbox22").val(row.ID);			// 회원번호, 사원번호
			$("#textbox23").val(row.TELPNO);		// 고객전화번호
			$("#textbox24").val(row.ZIPCDE);		// 고객주소
			$("#textbox25").val(row.ADDR);			// 고객상세주소
			$("#textbox3").val(row.AREA_CDE);		// 지역코드
			$("#textbox4").val(row.AREA_NAME);		// 지역명
			$("#textbox5").val(row.DEPT_ID);   		// 지점코드
			$("#textbox6").val(row.DEPT_NAME);  	// 지점명
			$("#textbox1").val(row.UP_DEPT_ID); 	// 본부코드
			$("#textbox2").val(row.UPDEPTNAME); 	// 본부명
			$("#textbox7").val(row.TELPNO_DEPT);	// 지점전화
			$("#textbox9").val(row.LC_NAME);   		// 센터명
			$("#textbox10").val(row.TELPNO_LC); 	// 센터전화
			$("#selectbox13").val(row.GRADE_CDE);	// 학년코드
			$("#hiddenbox1").val(row.LC_ID);   		// 센터코드		
			$("#hiddenbox2").val(row.MK); 			// 고객구분코드
			$("#hiddenbox3").val(row.DEPT_EMP_ID); 	// 사업국장    
			$("#hiddenbox4").val(row.LC_EMP_ID); 	// 센터장
			$("#hiddenbox6").val(targetId); 		// 고객번호
			
			setInitCselRstMkDS();	// 상담결과 저장정보 초기화
			onDmReceiptChange();	// DM 사은품접수 저장정보 세팅

			setLable(target);
			getStudy(row.ID);
		}
	});

}

/**
 * 학습중인 제품 조회
 * - as-is : cns5810.onSearchDS_STUDY_NOW()
 * @param {string} id 회원번호
 */
const getStudy = (id) => {
	const settings = {
		url: `${API_SERVER}/cns.getStudy.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ MBR_ID: id }],
		}),
		errMsg: "학습중인 과목 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		
		const studyList = data.dsRecv;
		grid3.resetData(studyList);

		// 신규상담일 경우 학습중인 과목을 좌측 상담과목 선택
		const selectSeq = document.getElementById("selectbox14")
		const jobType = selectSeq.options[selectSeq.selectedIndex].dataset.jobType;
		if(jobType == "I") {
			const study_id_arr = studyList.map(el => el.PRDT_ID);
			const study_id_str = study_id_arr.join("_");
			setPlProd(grid1, study_id_str);
		}
	});
}

/**
 * 상담등록 기존 데이타 조회 for update
 * - as-is : cns5810.onSearchDS_COUNSEL()
 * @param {string} sCselSeq 상담순번
 * @param {boolean} isFirst 최초조회 여부
 */
const getCounsel = (sCselSeq, isFirst) => {

	const condition = {
		CSEL_DATE : calendarUtil.getImaskValue("textbox27"), // 상담일자
		CSEL_NO   : $("#textbox28").val(),			     	 // 상담번호 	
	}
	
	if(!condition.CSEL_DATE || !condition.CSEL_NO) {
		alert("상담일자 또는 상담번호는 필수 입력입니다.")
		return;
	}

	const settings = {
		url: `${API_SERVER}/cns.getCounsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg: "상담등록정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		const counselData = data.dsRecv;
		console.debug(counselData)

		// 최초 조회시 상담순번 selectbox 생성
		if (isFirst) {
			$("#selectbox14").empty();
			counselData.forEach(el => {
				const option = new Option(el.CSEL_SEQ, el.CSEL_SEQ);
				option.dataset.jobType = "U";
				$("#selectbox14").append(option);
			});
		}

		$("#selectbox14").val(sCselSeq);

		if (counselData.length >= 1) {

			const rowIdx = $("#selectbox14 option:selected").index();
			const rowData 	= counselData[rowIdx];

			// 추가등록/관계회원이 아닌경우에만 티켓오픈.
			if(sCselSeq == 1) {
				topbarClient.invoke('routeTo', 'ticket', rowData.ZEN_TICKET_ID);	// 티켓오픈
			}
			
			const CUST_MK	= rowData.CUST_MK;			// 고객구분
			const target 	= (CUST_MK == "PE" || CUST_MK == "TC") ? "T" : "C"; // C : 고객, T : 선생님
			getBaseData(target, rowData.CUST_ID);		// 기본정보조회

			setPlProd(grid1, rowData.PLURAL_PRDT_LIST);	// 상담과목 선택
			
			// 상담정보 세팅
			$("#textbox29").val(rowData.CSEL_STTIME);										// 상담시간
			$("#selectbox15").val(rowData.CSEL_CHNL_MK);		                			// 상담채널구분
			$("#textbox11").val(rowData.PROC_DEPT_ID);										// 직원상담처리지점 (연계부서코드)
			$("#textbox26").val(rowData.PROC_DEPT_NAME);									// 직원상담처리지점명 (연계부서이름)      
			$("#checkbox1").prop("checked", rowData.LC_MK == "Y" ? true : false);			// 러닝센터(LC)  
			$("#checkbox2").prop("checked", rowData.YC_MK == "Y" ? true : false);			// YC
			$("#checkbox3").prop("checked", rowData.HL_MK == "Y" ? true : false);			// HL
			$("#textbox12").val(rowData.CSEL_TITLE);										// 상담제목
			$("#textbox13").val(rowData.CSEL_CNTS);											// 상담상세내용    
			$("#selectbox1").val(rowData.OPEN_GBN);											// 공개여부  (개인정보)    
			$("#selectbox2").val(rowData.CSEL_MAN_MK);										// 내담자구분      
			$("#textbox14").val(rowData.CSEL_LTYPE_CDE);									// 상담대분류코드
			$("#textbox16").val(rowData.CSEL_MTYPE_CDE);			                		// 상담중분류코드
			$("#textbox18").val(rowData.CSEL_STYPE_CDE);									// 상담소분류코드
			$("#textbox15").val(rowData.CSEL_LTYPE_NAME);									// 분류(대) 명
			$("#textbox17").val(rowData.CSEL_MTYPE_NAME);									// 분류(중) 명
			$("#textbox19").val(rowData.CSEL_STYPE_NAME);									// 분류(소) 명
			$("#selectbox3").val(rowData.CSEL_MK);											// 상담구분
			$("#selectbox4").val(rowData.PROC_MK);											// 처리구분
			$("#selectbox5").val(rowData.LIMIT_MK);											// 처리시한구분
			$("#selectbox6").val(rowData.CUST_RESP_MK);										// 고객반응구분
			calendarUtil.setImaskValue("calendar2", rowData.PROC_HOPE_DATE);				// 처리희망일자
			$("#selectbox8").val(rowData.CSEL_RST_MK1);				                		// 상담결과구분
			$("#selectbox9").val(rowData.FST_CRS_CDE);										// 첫상담경로
			$("#selectbox10").val(rowData.PROC_STS_MK);					            		// 처리상태구분
			$("#selectbox11").val(rowData.CSEL_GRD);				                		// 상담등급
			$("#checkbox4").prop("checked", rowData.RE_PROC == "1" ? true : false);			// 재확인여부
			$("#checkbox5").prop("checked", rowData.VOC_MK == "Y" ? true : false);			// VOC
			$("#checkbox6").prop("checked", rowData.RE_CALL_CMPLT == "Y" ? true : false);	// 재통화완료여부
			$("#selectbox16").val(rowData.DM_TYPE_CDE);										// DM종류	(지급사유)
			$("#hiddenbox10").val(rowData.ZEN_TICKET_ID);									// 티켓ID
			$("#hiddenbox5").val(rowData.CSEL_RST_MK1);										// 상담결과구분코드
			$("#hiddenbox9").val(rowData.PROC_STS_MK);					            		// 처리상태구분
			$("#hiddenbox7").val(rowData.DM_MATCHCD);										// DM매치코드
			$("#hiddenbox8").val(rowData.DM_LIST_ID);										// DM목록ID

			// 상담결과 구분이 DM 사은품접수일 경우.
			if(rowData.CSEL_RST_MK1 == "12") { 
				// 지급사유 selectbox 활성화
				$("#selectbox16").prop("disabled", false);
				return;
			} else {
				// 지급사유 selectbox 비활성화
				$("#selectbox16").prop("disabled", true);
				$("#selectbox16").val("");
			}

			setBtnCtrlAtLoadComp();

		}

	});
}

/**
 * 고객/선생님에 따른 레이블 설정
 * - as-is : cns5810.setLable()
 * @param {string} target 대상구분 ( "C" : 고객, "T" : 선생님 )
 */
const setLable = (target) => {
	if (target == "T") {
		$("#thNAME").text("선생님명");
		$("#thID").text("사원번호");
	} else {
		$("#thNAME").text("회원명");
		$("#thID").text("회원번호");
	}
}

/**
 * 티켓생성 for 티켓생성버튼/추가등록/관계회원
 * @return {object} response
 */
const createTicket = async () => {

	const user_id = await checkUser();
	if(!user_id) return false;

	const option = {
		url: '/api/v2/tickets.json',
		method: 'POST',
		contentType: "application/json",
		data: JSON.stringify({ 
			ticket: {
				subject			: "CCEM 앱에서 티켓생성 버튼으로 생성된 티켓입니다.",	 // 제목
				ticket_form_id	: ZDK_INFO[_SPACE]["ticketForm"]["CNSLT_INQRY"], 	 // 양식 : 상담문의 고정
				requester_id	: user_id,  				// 젠데스크 고객번호
				assignee_id		: currentUser.id,	// 젠데스크 상담원번호
				status			: "open",					// 젠데스크 티켓 상태
				tags            : ["AUTO_FROM_CCEM"],		// TODO 프로젝트 오픈전 해당 티켓건 삭제를 위해
				comment: {
					public		: false,	// 내부메모
					body		: "CCEM 앱에서 티켓생성 버튼으로 생성된 티켓입니다.",
				},
			} 
		}),
	}

	return await topbarClient.request(option);		// 티켓생성
}

/**
 * 티켓 업데이트 for 추가등록/관계회원
 * @param {object} counselData 상담정보
 * @param {obejct} addInfoData DM 사은품 접수/개인정보동의/고객직접퇴회
 * @param {obejct} obData OB관련 데이터
 */
const updateTicket = async (counselData, addInfoData, obData) => {

	const CSEL_DATE_NO_SEQ = `${FormatUtil.date(counselData.CSEL_DATE)}_${counselData.CSEL_NO}_${counselData.CSEL_SEQ}`;

	const customPrdtList 		= grid2.getData().map(el => `${el.PRDT_GRP}::${el.PRDT_ID}`.toLowerCase()); // 과목리스트(ex. ["11::2k", "11::k","10::m"])
	const customDeptIdNm 		= $("#textbox6").val();		// 지점부서명(사업국명)
	const customAeraCdeNm 		= $("#textbox4").val();		// 지역코드명
	const customProcDeptIdNm 	= $("#textbox26").val();	// 연계부서명
	const customLcName 			= $("#textbox9").val();		// 러닝센터명(센터명)
	const customReclCntct 		= $("#selectbox8").val() == "01" ? DS_SCHEDULE.TELNO : ""; // 상담결과 구분이 재통화예약일경우

	const option = {
		url: `/api/v2/tickets/${counselData.ZEN_TICKET_ID}`,
		method: 'PUT',
		contentType: "application/json",
		data: JSON.stringify({ 
			ticket: {
				external_id		: CSEL_DATE_NO_SEQ,
				subject			: counselData.CSEL_TITLE,	 // 제목
				comment: {
					public		: false,	// 내부메모
					body		: counselData.CSEL_CNTS,	// 상담내용
				},
				custom_fields: [
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_DATE_NO_SEQ"], 		value: CSEL_DATE_NO_SEQ }, 										// 상담번호
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_LTYPE_CDE"],		value: counselData.CSEL_LTYPE_CDE }, 							// 상담분류(대)  
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_MTYPE_CDE"],		value: counselData.CSEL_MTYPE_CDE }, 							// 상담분류(중)  
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_STYPE_CDE"],		value: counselData.CSEL_STYPE_CDE }, 							// 상담분류(소)  
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_MK"],				value: `csel_mk_${counselData.CSEL_MK}` }, 						// 상담구분   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_CHNL_MK"],			value: `csel_chnl_mk_${counselData.CSEL_CHNL_MK}` }, 			// 상담채널   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CUST_RESP_MK"],			value: `cust_resp_mk_${counselData.CUST_RESP_MK}` },			// 고객반응   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["CALL_RST_MK"],			value: `call_rst_mk_${counselData.CALL_RST_MK}` },				// 통화결과(O/B결과)
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_RST_MK"],			value: `csel_rst_mk_${counselData.CSEL_RST_MK1}` },				// 상담결과   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_MK"],				value: `proc_mk_${counselData.PROC_MK}` },						// 처리구분   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CUST_MK"],				value: `cust_mk_${counselData.CUST_MK}`.toLowerCase() },		// 고객구분   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_STS_MK"],			value: `proc_sts_mk_${counselData.PROC_STS_MK}` },				// 처리상태   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["MOTIVE_CDE"],				value: `std_motive_cde_${counselData.MOTIVE_CDE}` },			// 입회사유   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["CALL_RST_MK_OB"],			value: `call_rst_mk_ob_${?}` },									// OB결과   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["AGE_GRADE_CDE"],			value: `${?}::${counselData.GRADE_CDE}`.toLowerCase() },		// 학년
					{ id: ZDK_INFO[_SPACE]["ticketField"]["PRDT"],					value: customPrdtList },										// 과목   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["DEPT_IDNM"],				value: customDeptIdNm },										// 지점부서명(사업국명)   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["DIV_CDE"],				value: `div_cde_${counselData.DIV_CDE}`.toLowerCase() },		// 지점본부명(본부코드)   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["AREA_CDENM"],			value: customAeraCdeNm },										// 지역코드명  
					{ id: ZDK_INFO[_SPACE]["ticketField"]["FST_CRS_CDE"],			value: findCodeName("STD_CRS_CDE", counselData.FST_CRS_CDE) },	// 첫상담경로   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["VOC_MK"],				value: counselData.VOC_MK == "Y" ? true : false },				// VOC여부   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["CSEL_GRD"],				value: `csel_grd_${counselData.CSEL_GRD}` },					// 상담등급   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["PROC_DEPT_IDNM"],		value: customProcDeptIdNm },									// 연계부서명   
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
					{ id: ZDK_INFO[_SPACE]["ticketField"]["LC_NAME"],				value: customLcName },											// 러닝센터명(센터)
					{ id: ZDK_INFO[_SPACE]["ticketField"]["LC_MK"],					value: counselData.LC_MK == "Y" ? true : false },				// LC여부   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["HL_MK"],					value: counselData.HL_MK == "Y" ? true : false },				// HL여부   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["YC_MK"],					value: counselData.YC_MK == "Y" ? true : false },				// YC여부   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["VISIT_CHNL"],				value: "" },												// 방문채널   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["TCH_NM"],					value: "" },												// 교사명   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["TCH_NO"],					value: "" },												// 교사사번   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["TCH_WRK_MNT"],			value: Number },											// 교사근무개월수   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["RE_PROC"],				value: counselData.RE_PROC == "1" ? true : false },				// 재확인여부   
					{ id: ZDK_INFO[_SPACE]["ticketField"]["RECL_CNTCT"],			value: customReclCntct },										// 재통화 연락처   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["RECL_CMPLT"],				value: Boolean },											// 재통화 완료   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["OFCL_RSPN"],				value: "" },												// 직책   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["JOB"],					value: "" },												// 직무   
					// { id: ZDK_INFO[_SPACE]["ticketField"]["DIV_KIND_CDE"],			value: `div_kind_cde_${?}` },								// 브랜드   
				],
			}
		}),
	}
	await topbarClient.request(option);
}

/**
 * TODO Zendesk 티켓필드 입력
 * @param {object} counselData 상담정보
 * @param {obejct} addInfoData DM 사은품 접수/개인정보동의/고객직접퇴회
 * @param {obejct} obData OB관련 데이터
 */
const setTicket = async (counselData, addInfoData, obData) => {

	const CSEL_DATE_NO_SEQ = `${FormatUtil.date(counselData.CSEL_DATE)}_${counselData.CSEL_NO}_${counselData.CSEL_SEQ}`;

	const customPrdtList 		= grid2.getData().map(el => `${el.PRDT_GRP}::${el.PRDT_ID}`.toLowerCase()); // 과목리스트(ex. ["11::2k", "11::k","10::m"])
	const customDeptIdNm 		= $("#textbox6").val();		// 지점부서명(사업국명)
	const customAeraCdeNm 		= $("#textbox4").val();		// 지역코드명
	const customProcDeptIdNm 	= $("#textbox26").val();	// 연계부서명
	const customLcName 			= $("#textbox9").val();		// 러닝센터명(센터명)
	
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
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["AGE_GRADE_CDE"]}`]           = `${?}::${counselData.GRADE_CDE}`.toLowerCase();           // 학년
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PRDT"]}`]                    = customPrdtList;                                           // 과목   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DEPT_IDNM"]}`]               = customDeptIdNm;                                           // 지점부서명(사업국명)   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DIV_CDE"]}`]                 = `div_cde_${counselData.DIV_CDE}`.toLowerCase();           // 지점본부명(본부코드)   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["AREA_CDENM"]}`]              = customAeraCdeNm;                                          // 지역코드명  
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["FST_CRS_CDE"]}`]             = findCodeName("STD_CRS_CDE", counselData.FST_CRS_CDE);     // 첫상담경로   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["VOC_MK"]}`]                  = counselData.VOC_MK == "Y" ? true : false;                 // VOC여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_GRD"]}`]                = `csel_grd_${counselData.CSEL_GRD}`;                       // 상담등급   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["PROC_DEPT_IDNM"]}`]          = customProcDeptIdNm;                                       // 연계부서명   
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
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LC_NAME"]}`]                 = customLcName;                                             // 러닝센터명(센터)
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["LC_MK"]}`]                   = counselData.LC_MK == "Y" ? true : false;                  // LC여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["HL_MK"]}`]                   = counselData.HL_MK == "Y" ? true : false;                  // HL여부   
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["YC_MK"]}`]                   = counselData.YC_MK == "Y" ? true : false;                  // YC여부   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["VISIT_CHNL"]}`]              = "";                                                       // 방문채널
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TCH_NM"]}`]                  = "";                                                       // 교사명
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TCH_NO"]}`]                  = "";                                                       // 교사사번
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["TCH_WRK_MNT"]}`]             = Number;                                                   // 교사근무개월수
	req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RE_PROC"]}`]                 = counselData.RE_PROC == "1" ? true : false;                // 재확인여부   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RECL_CNTCT"]}`]              = "";                                          				// 재통화 연락처   
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RECL_CMPLT"]}`]              = Boolean;                                                  // 재통화 완료         
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["OFCL_RSPN"]}`]               = "";                                                       // 직책 
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["JOB"]}`]                     = "";                                                       // 직무 
	// req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["DIV_KIND_CDE"]}`]            = `div_kind_cde_${?}`;                                      // 브랜드  

	// 상담결과 구분이 재통화예약일경우
	if($("#selectbox8").val() == "01")	{
		req[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["RECL_CNTCT"]}`] = DS_SCHEDULE.TELNO;
	}
	
	// 티켓필드 입력
	await sidebarClient.set(req);
	await sidebarClient.invoke('comment.appendText', counselData.CSEL_CNTS);
	
}

/**
 * 티켓생성 전 사용자가 있는지 체크하고 없으면 생성.
 * @return {number|boolean} Zendesk user id
 */
const checkUser = async () => {
	const CUST_ID = $("#hiddenbox6").val();
	const CUST_NAME = $("#textbox21").val();
	const CUST_MK = $("#hiddenbox2").val();	// 고객구분
	const target = (CUST_MK == "PE" || CUST_MK == "TC") ? "T" : "C";	// 대상구분(고객 : C, 선생님 : T)

	if (!CUST_ID || !CUST_NAME) {
		alert("조회된 고객이 없습니다.\n\n[고객조회]또는[선생님조회]를 먼저 하고, 처리 하시기 바랍니다.");
		return false;
	}

	let sMsg = "";
	sMsg += "\n * 고객번호 : " + CUST_ID;
	sMsg += "\n * 고객명   : " + CUST_NAME;
	sMsg += "\n\n 위 항목으로 티켓을 생성 하시겠습니까?";
	if (confirm(sMsg) == false) return false;

	const { users } = await topbarClient.request(`/api/v2/users/search.json?external_id=${CUST_ID}`);
	let user_id = "";
	
	// 젠데스크 사용자가 없으면 사용자생성
	if (users.length === 0) {
		const custInfo = await getCustInfo(target, CUST_ID);
		const { user } = await createUser(custInfo);
		user_id = user.id;
	} else {
		user_id = users[0].id;
	}

	return user_id;
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
	// TODO 선생님 조회 서비스 URL/조건 확인필요
	} else if (target == "T") {
		service = "/cns.getCustInfo.do";
		condition = { CUST_ID: custId };
	}

	const settings = {
		global: false,
		url: `${API_SERVER + service}`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
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
 * @param {object} data 
 */
const createUser = async (data) => {

	if(!data.NAME || !data.CUST_ID) {
		throw new Error("젠데스크 사용자 생성시 필수 값이 존재하지 않습니다.");
	}

	// custom data
	const mobilnoMbr = data.MOBILNO_MBR ? data.MOBILNO_MBR.replace(/[^0-9]/gi, "") : "";	// 휴대폰번호(엄마)	
	const mobilnoFat = data.MOBILNO_FAT ? data.MOBILNO_FAT.replace(/[^0-9]/gi, "") : ""; 	// 휴대폰번호(아빠)
	const mobilnoLaw = data.MOBILNO_LAW ? data.MOBILNO_LAW.replace(/[^0-9]/gi, "") : "";	// 휴대폰번호(법정대리인)	
	const telpno = (data.DDD || "") + (data.TELPNO1 || "") + (data.TELPNO2 || "");			// 자택 전화번호
	const custMk = (data.CUST_MK == "PE" || data.CUST_MK == "TC") ? "교사" : "고객";		 // 고객구분
	const gradeNm = findCodeName("GRADE_CDE", data.GRADE_CDE);
	const fatRelNm = findCodeName("FAT_REL", data.FAT_REL);

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
 * 해당코드의 NAME을 반환.
 * @param {string} mk 코드구분 
 * @param {string} id 코드ID
 */
const findCodeName = (mk, id) => {
	const code = codeData.find(el => el.CODE_MK == mk && el.CODE_ID == id);
	return code ? code.CODE_NAME : "";
}

/**
 * 신규버튼 선택시에 고객 기본정보 초기화
 * - as-is : cns5810.onNewCustInit()
 */
const onNewCustInit = () => {
	$("#textbox21").val("");		// 고객명, 선생님명
	$("#textbox22").val("");		// 회원번호, 사원번호
	$("#textbox23").val("");		// 고객전화번호
	$("#textbox24").val("");		// 고객주소
	$("#textbox25").val("");		// 고객상세주소
	$("#textbox3").val("");   		// 지역코드
	$("#textbox4").val("");   		// 지역명 
	$("#textbox5").val("");   		// 사업국코드 
	$("#textbox6").val("");   		// 사업국명
	$("#textbox1").val("");   		// 본부코드
	$("#textbox2").val("");   		// 본부명
	$("#textbox7").val("");   		// 지점전화
	$("#textbox9").val("");   		// 센터명
	$("#textbox10").val("");  		// 센터전화
	$("#selectbox13").val("00");	// 학년
	$("#hiddenbox1").val(""); 		// 센터코드		
	$("#hiddenbox2").val(""); 		// 고객구분코드
	$("#hiddenbox3").val(""); 		// 지점장번호
	$("#hiddenbox4").val("")  		// 센터장사번
	$("#hiddenbox6").val(""); 		// 고객번호
	$("#checkbox1").prop("checked", false);   	// LC
	$("#checkbox2").prop("checked", false);		// YC
	$("#checkbox3").prop("checked", false);		// HL 
    $("#selectbox9").val("");   	// 상담경로
    $("#textbox11").val("");		// 연계부서코드
	$("#textbox26").val("");		// 연계부서명  
	setInitCselRstMkDS();			// 상담결과 저장정보
	grid3.clear();			  		// 학습중인 과목
}

/**
 * 추가등록
 */
const addCsel = () => {
	  
	// 상담내용을 초기화.
	$("#textbox13").val("");

	// 상담순번 설정
	const newIdx = $("#selectbox14 option").length + 1;
	const option = new Option(newIdx, newIdx);
	option.dataset.jobType = "I";
	$("#selectbox14").append(option);
	$("#selectbox14").val(newIdx);

	//버튼 비활성화
	$("#button4").prop("disabled", true); // 상담연계
	$("#button5").prop("disabled", true); // 추가등록
	$("#button6").prop("disabled", true); // 관계회원
	$("#button7").prop("disabled", true); // 결과등록

}

/**
 * 추가등록 by 관계회원
 * - as-is : cns5810.onAddCsel()
 * @param {object} data
 */
var addCselByFamily = (data) => {

	const target = "C";		// 대상구분 ( "C" : 고객, "T" : 선생님 )
	const custId = data.CUST_ID;	// 고객번호

	if(custId){
		setLable(target);
		getBaseData(target, custId);
		addCsel();
	}else{
		alert("고객번호가 존재하지 않는 고객입니다.\n\n먼저 고객 정보 등록을 하시기 바랍니다.");
	}
	
}

/**
 * 저장
 * - as-is : cns5810.onSave()
 */
const saveCounsel = async () => {

	// 과목군을 전체로 변경하여 filter 처리후에 검색어 검색 처리
	$("#selectbox12").val("").trigger("change");

	// 저장구분(I: 신규, U: 수정)
	const selectbox = document.getElementById("selectbox14");
	const selectedSeq = selectbox.value;
	const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;	

	// 상담정보 value check
	const counselData = await getCounselCondition(sJobType);
	if (!counselData) return false;
	const addInfoData = getAddInfoCondition();
	if (!addInfoData) return false;
	const obData = {};							// TODO OB관련 데이터
	if (!obData) return false;

	let resSaveCCEM;

	////////////////////////////////////////// 추가등록 또는 관계회원 신규 ////////////////////////////////////////
	if (sJobType == "I" && selectedSeq > 1) {
		
		// 티켓생성
		const { ticket } = await createTicket();
		if (!ticket) return false;

		// ccem 저장
		counselData.ZEN_TICKET_ID = ticket.id;
		resSaveCCEM = await saveCCEM(counselData, addInfoData, obData);
	
		// 티켓 업데이트
		counselData.CSEL_NO = resSaveCCEM.CSEL_NO;
		await updateTicket(counselData, addInfoData, obData);

	////////////////////////////////////////// 추가등록 또는 관계회원 수정 ////////////////////////////////////////
	} else if (sJobType == "U" && selectedSeq > 1) {

		// ccem 저장
		resSaveCCEM = await saveCCEM(counselData, addInfoData, obData);

		// 티켓 업데이트
		await updateTicket(counselData, addInfoData, obData);
		
	///////////////////////////////////////////////////// 수정 //////////////////////////////////////////////////
	} else if (sJobType == "U") {

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

		if (counselData.ZEN_TICKET_ID && counselData.ZEN_TICKET_ID != ticket.id) {
			alert(`현재 상담정보의 티켓이 아닙니다. \n\n#${counselData.ZEN_TICKET_ID} 티켓을 다시 오픈해 주시기 바랍니다.`);
			return;
		}

		// ccem 저장
		counselData.ZEN_TICKET_ID = ticket.id;
		resSaveCCEM = await saveCCEM(counselData, addInfoData, obData);

		// 티켓필드 입력
		await setTicket(counselData, addInfoData, obData);
	
	///////////////////////////////////////////////////// 신규 //////////////////////////////////////////////////
	} else if (sJobType == "I") {	

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

		// ccem 저장
		counselData.ZEN_TICKET_ID = ticket.id;
		resSaveCCEM = await saveCCEM(counselData, addInfoData, obData);

		// 티켓필드 입력
		counselData.CSEL_NO = resSaveCCEM.CSEL_NO;
		await setTicket(counselData, addInfoData, obData);

	} else {
		alert(`저장구분이 올바르지 않습니다.[${sJobType}]\n\n관리자에게 문의하기시 바랍니다.`);
		return false;
	}
	
	// 저장성공후
	$("#textbox28").val(resSaveCCEM.CSEL_NO); 	// 접수번호 세팅
	getCounsel(selectedSeq, true);				// 상담 재조회

	return true;

}

/**
 * 상담저장 정보 value check
 * - as-is : cns5810.onValueCheck()
 * @param {string} sJobType 저장구분(I/U/D)
 */
const getCounselCondition = async (sJobType) => {

	const data = {
		ROW_TYPE         : sJobType,             // 저장구분(I/U/D)    
		CSEL_DATE        : calendarUtil.getImaskValue("textbox27"),             // 상담일자           
		CSEL_NO          : $("#textbox28").val(),             // 상담번호           
		CSEL_SEQ         : $("#selectbox14").val(),             // 상담순번           
		CUST_ID          : $("#hiddenbox6").val(),             // 고객번호           
		CUST_MK          : $("#hiddenbox2").val(),             // 고객구분           
		CSEL_USER_ID     : currentUser.external_id,             // 상담원id           
		CSEL_STTIME      : $("#textbox29").val(),             // 상담시작시간       
		CSEL_EDTIME      : "",             // 상담종료시간       
		CSEL_CHNL_MK     : $("#selectbox15").val(),             // 상담채널구분       
		CSEL_MK          : $("#selectbox3").val(),             // 상담구분           
		CSEL_LTYPE_CDE   : $("#textbox14").val(),             // 상담대분류코드     
		CSEL_MTYPE_CDE   : $("#textbox16").val(),             // 상담중분류코드     
		CSEL_STYPE_CDE   : $("#textbox18").val(),             // 상담소분류코드     
		CSEL_TITLE       : $("#textbox12").val().trim(),             // 상담제목           
		CSEL_CNTS        : $("#textbox13").val().trim(),             // 상담상세내용       
		// OCCUR_DATE       : "",             // 문제발생일자       
		LIMIT_MK         : $("#selectbox5").val(),             // 처리시한구분       
		PROC_HOPE_DATE   : calendarUtil.getImaskValue("calendar2"),             // 처리희망일자       
		CSEL_MAN_MK      : $("#selectbox2").val(),             // 내담자구분         
		CUST_RESP_MK     : $("#selectbox6").val(),             // 고객반응구분       
		// CALL_RST_MK      : "",             // 통화결과구분      (O/B결과) 		
		CSEL_RST_MK1     : $("#selectbox8").val(),             // 상담결과구분       
		CSEL_RST_MK2     : "",             // 상담결과구분2      
		PROC_MK          : $("#selectbox4").val(),             // 처리구분           
		DEPT_ID          : $("#textbox5").val(),             // 관할지점코드   (사업국코드)    
		DIV_CDE          : $("#textbox1").val(),             // 관할본부코드   (본부코드)
		AREA_CDE         : $("#textbox3").val(),             // 관할지역코드   (지역코드)
		GRADE_CDE        : $("#selectbox13").val(),             // 학년코드           
		MOTIVE_CDE       : "",             // 입회사유코드       
		FST_CRS_CDE      : $("#selectbox9").val(),             // 첫상담경로         
		// MEDIA_CDE     : "",                // 매체구분코드    
		TRANS_DATE       : "",             // 연계일자           
		TRANS_NO         : "",             // 연계번호           
		PROC_STS_MK      : $("#selectbox10").val(),             // 처리상태구분       
		// VENDER_CDE    : "",                // 동종업체코드    (타학습지)
		// PRDT_ID       : "",                // 동종업체제품코드(제품명)
		WORK_STYL_MK     : "",             // 근무형태구분       
		USER_GRP_CDE     : currentUser.user_fields.user_grp_cde,             // 상담원그룹코드     
		PLURAL_PRDT_ID   : "",             // 병행과목리스트     
		MBR_ID           : $("#textbox22").val(),             // 회원번호           
		DEPT_EMP_ID      : $("#hiddenbox3").val(),             // 지점장사번         
		CTI_CHGDATE      : "",             // cti변경일자        
		TO_TEAM_DEPT     : "",             // 지점장부서         
		OPEN_GBN         : $("#selectbox1").val(),             // 공개여부  (개인정보)         
		VOC_MK           : $("#checkbox5").is(":checked") ? "Y" : "",             // VOC                
		CSEL_GRD         : $("#selectbox11").val(),             // 상담등급           
		RE_PROC          : $("#checkbox4").is(":checked") ? "1" : "0",             // 재확인여부         
		CALL_STTIME      : "",             // 통화시작시간       
		CALL_EDTIME      : "",             // 통화종료시간       
		// STD_STS       : "",                // 타학습이력학습상
		// STD_MON_CDE   : "",                // 학습개월        
		// RENEW_POTN    : "",                // 복회가능여부    
		LC_MK            : $("#checkbox1").is(":checked") ? "Y" : "",             // 러닝센터(LC)           
		PROC_DEPT_ID     : $("#textbox11").val(),             // 직원상담 처리지점  (연계부서코드)
		// TIME_APPO     : "",                // 시간약속        
		LC_ID            : $("#hiddenbox1").val(),             // 센터ID             
		LC_EMP_ID        : $("#hiddenbox4").val(),             // 센터장사번         
		YC_MK            : $("#checkbox2").is(":checked") ? "Y" : "",             // YC                 
		ZEN_TICKET_ID    : $("#hiddenbox10").val(),             // 티켓ID             
		HL_MK            : $("#checkbox3").is(":checked") ? "Y" : "",             // HL                 
		PLURAL_PRDT_LIST : "",  			// 병행과목코드리스트 
		PLURAL_PRDT_NAME : "",				// 병행과목코드명     
		ORG_CSEL_RST_MK1 : "",              // ORG상담결과구분    
		RE_CALL_CMPLT    : $("#checkbox6").is(":checked") ? "Y" : "",             // 재통화완료여부     
	}

	// 날짜 및 시간 유효성 체크
	data.CSEL_DATE 		= data.CSEL_DATE.length != 8 ? "" : data.CSEL_DATE;
	data.PROC_HOPE_DATE = data.PROC_HOPE_DATE.length != 8 ? "" : data.PROC_HOPE_DATE;
	data.CSEL_STTIME	= data.CSEL_STTIME.length != 6 ? "" : data.CSEL_STTIME;

	// 병행과목코드리스트 세팅
	const plProd = getPlProd(grid2);
	data.PLURAL_PRDT_LIST = plProd.ids.join("_");
	data.PLURAL_PRDT_NAME = plProd.names.join(",");

	const sLtype = data.CSEL_LTYPE_CDE;
    const sMtype = data.CSEL_MTYPE_CDE;
    const sStype = data.CSEL_STYPE_CDE;
	const sMan_mk = data.CSEL_MAN_MK;

	if (!data.CSEL_TITLE) {
		alert("상담제목으로 입력하여 주십시요.");
		return false;
	}
	if (!data.CSEL_CNTS) {
		alert("상담내용을 입력하여 주십시요.");
		$("#textbox13").focus();
		return false;
	}
	if (data.PLURAL_PRDT_LIST.length > 100) {
		alert("상담제품의 수가 너무 많습니다.");
		return false;
	}
	if (data.PLURAL_PRDT_NAME.length > 1000) {
		alert("상담제품의 수가 너무 많습니다.");
		return false;
	}
	if (data.CSEL_TITLE.length > 100) {
		alert("상담제목은 100Byte를 초과할 수 없습니다.");
		return false;
	}
	if (data.CSEL_CNTS.length > 4000) {
		alert("상담내용은 4000Byte를 초과할 수 없습니다.");
		$("#textbox13").focus();
		return false;
	}
	if (!data.CSEL_LTYPE_CDE) {
		alert("상담분류(대)를 선택하여 주십시요.");
		$("#textbox14").focus();
		return false;
	}
	if (!data.CSEL_MTYPE_CDE) {
		alert("상담분류(중)를 선택하여 주십시요.");
		$("#textbox16").focus();
		return false;
	}
	if (!data.CSEL_STYPE_CDE) {
		alert("상담분류(소)를 선택하여 주십시요.");
		$("#textbox18").focus();
		return false;
	}
	if (!data.CUST_RESP_MK && bIsOB == "N") {
		alert("고객반응을 선택해 주십시요.");
		$("#selectbox6").focus();
		return false;
	}
	if (!data.PROC_STS_MK) {
		alert("처리상태를 선택해 주십시요.");
		$("#selectbox10").focus();
		return false;
	}
	if ((sMan_mk == "04" || sMan_mk == "05" || sMan_mk == "06" || sMan_mk == "07" || sMan_mk == "08" || sMan_mk == "09") && !data.PROC_DEPT_ID) {
		// 내담자가 직원인 경우에는 처리지점 입력
		alert("연계부서를 입력해 주십시요.");
		$("#textbox26").focus();
		return false;
	}
	if ((sMtype == "20508" || sMtype == "40508") && data.RE_PROC == "0") {
		// 연말정산관련 요청 및 문의시에는 재확인 필수 체크
		alert("재확인을 선택해 주십시요.");
		$("#checkbox4").focus();
		return false;
	}

	//상담제품 선택여부 체크
    if (data.PLURAL_PRDT_LIST.length == 0) {

        //시정처리 일때 필수
		if (data.PROC_MK == "4") {
			alert("상담제품을 선택하여 주십시요.");
			return false;
		}

		//상담분류체크-소분류만으로 체크할 경우
		if (sStype == "1010100" || sStype == "1010101" || sStype == "4010100" || sStype == "4010101") {
			alert("상담제품을 선택하여 주십시요.");
			return false;
		}

		//중분류로 체크할경우
		if (sMtype == "10301" ||
			sMtype == "10806" ||
			sMtype == "11508" ||
			sMtype == "20302" ||
			sMtype == "20303" ||
			sMtype == "20305" ||
			sMtype == "20806" ||
			sMtype == "20601" ||
			sMtype == "20808" ||
			sMtype == "21508" ||
			sMtype == "41508" ||
			sMtype == "81508") {
			alert("상담제품을 선택하여 주십시요.");
			return false;
		}

		//대분류로 체크할경우
		switch (sLtype) {
			case "101":
				//중분류가 10102~10121일경우 체크
				if (sMtype >= "10102" && sMtype <= "10121") {
					if (sMtype != "10112" && sStype != "1010401") {
						alert("상담제품을 선택하여 주십시요.");
						return false;
					}
				}
				break;
			case "104":
				//중분류가 10402~10408일경우 체크
				if (sMtype >= "10402" && sMtype <= "10408") {
					if (sMtype != "10406" && sMtype != "10407" && sStype != "1040503") {
						alert("상담제품을 선택하여 주십시요.");
						return false;
					}
				}
				break;
			case "204":
				//중분류가 20402~20408일경우 체크
				if (sMtype >= "20402" && sMtype <= "20408") {
					if (sMtype != "20406" && sMtype != "20407" && sStype != "2040504") {
						alert("상담제품을 선택하여 주십시요.");
						return false;
					}
				}
				break;
			case "201":
				if (sMtype != "20104" && sMtype != "20111" && sMtype != "20199") {
					alert("상담제품을 선택하여 주십시요.");
					return false;
				}
				break;
		}

	}

	//교구재(30),전집류(40),전집(50)등과 같은 박사와 관련된 제품을 선택한 경우
    //prdt_grp:30,40,50군에 포함되지 않으면 상담과목을 잘못 선택했다는 메세지를 뿌리도록
    //20151005 과목군의 소빅스군(22)으로 교구재, 전집류, 전집이 편집됨(이혜진실장)
    if (data.PLURAL_PRDT_LIST.length > 0) {

        //종합교재/전집류(09)
        if (sLtype == "109" || sLtype == "209") {

			//상담과목의 제품군을 뽑아내 30,40,50군에 포함되어있는지 체크한다.
			const checkData = grid2.getData();
            for (const prodId of plProd.ids) {
				const checkRow = checkData.find(el => el.PRDT_ID == prodId);
                if (checkRow && checkRow.PRDT_GRP != "22") {
					alert("상담과목을 잘못 선택했습니다.");
					return false;
                }
			}
			
        }
	}
	
	// 수정일때,
    if (sJobType == "U") {
        //상담연계(3)이고,
        if (data.CSEL_MK == "3" && $("#hiddenbox9").val() != "01") {
			alert("결과등록 한 상담이력은 수정할 수 없습니다.");
			return false;
        }
	}
	
	// 당월에 시정처리 등록건이 있는지 조회
    // 당월에 시정처리건이 등록되어 있으면, 또 등록할 것인지를 물어본다.
	if (data.PROC_MK == "4") {
		const saveChkRes = await getSaveChk(sCustId);
		if(saveChkRes && saveChkRes[0] && saveChkRes[0].CNT_SIJUNG > 0) {
			if (!confirm("동일한 월에 이미 시정처리한 내역이 존재 합니다.\n\n그래도 등록하시겠습니까?")) return;
		}
	}
	
	//지점정보 없을때, 값 설정
    if (!data.DEPT_ID) {
        data.DEPT_ID = "000Z";
		$("#textbox5").val("000Z");
		$("#textbox6").val("000Z");
	}
	
	//지역정보 없을때, 값 설정
    if (!data.AREA_CDE) {
		data.AREA_CDE = "000";
		$("#textbox3").val("000");
	}
	
	//INSERT시,
    if (sJobType == "I") {

        // TODO CTI사용여부가 Y이면, 통화시간정보를 셋팅한다.
        //듀얼 모니터 사용으로 세션중복이 생겨서 CTI사용여부 변경     
        // if (objSys1100.objSysCALL != "") {
        //     // 통화시작시간과 통화종료시간을 가져온다.
        //     if (isCall == "Y") {
        //         try {
        //             var arrCallTimes = objSys1100.gf_getCallTimes();
        //             DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "CALL_STTIME") = arrCallTimes[0];
        //             DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "CALL_EDTIME") = arrCallTimes[1];
        //         } catch (e) { }
        //     }
        // }

        //"I"이고, 상담일자가 없을경우, (추가등록,관계회원등록 일때)
        if (!data.CSEL_DATE) {
            data.CSEL_DATE = getDateFormat().replace(/[^0-9]/gi, '');
        }
       
        // TODO O/B통화결과에서 팝업되었을때,
        // if (objOpener.document.URL.indexOf("cns0000.jsp") > 0) {
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "TASK_ID") = sTaskId; // [ 3] task_id        [ 13] 태스크ID
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "LIST_ID") = sListId; // [ 4] list_id        [ 17] 리스트ID
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "SEQ") = sSeq;    // [ 6] seq            [  3] 순번
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "OB_TYPE") = sObType; // [ 4] ob_type        [  1] OB/고객Care 구분 :[ 1.pv || 2.고객Care || 3.인바운드재통화 || 4.MOL학습관리 ]                
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "STD_DATE") = sStdDate; //[ 8] STD_DATE       [  8] 관리일자                                
        // }

        // TODO MOL학습관리에서 팝업되었을때,
        // if (objOpener.document.URL.indexOf("mol1100.jsp") > 0) {
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "TASK_ID") = sTaskId; // [ 3] task_id        [ 20] 주문번호
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "LIST_ID") = sListId; // [ 4] list_id        [ 15] 상품코드
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "SEQ") = sSeq;    // [ 6] seq            [  3] 순번
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "OB_TYPE") = sObType; // [ 4] ob_type        [  1] OB/고객Care 구분 :[ 1.pv || 2.고객Care || 3.인바운드재통화 || 4.MOL학습관리 ]                
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "STD_DATE") = sStdDate; //[ 8] STD_DATE       [  8] 관리일자                                
        // }

        // TODO O/B PV에서 팝업되었을때,
        // if (objOpener.document.URL.indexOf("clm2900.jsp") > 0 || objOpener.document.URL.indexOf("clm1100.jsp") > 0) {
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "TASK_ID") = sTaskId; // [ 3] task_id        [ 13] 태스크ID
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "LIST_ID") = sListId; // [ 4] list_id        [ 17] 리스트ID
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "SEQ") = sSeq;    // [ 6] seq            [  3] 순번
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "OB_TYPE") = sObType; // [ 4] ob_type        [  1] OB/고객Care 구분 :[ 1.pv || 2.고객Care || 3.인바운드재통화 || 4.MOL학습관리 ]                
        //     //DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition,"STD_DATE")= sStdDate; //[ 8] STD_DATE       [  8] 관리일자                                
        // }
    } else {
        // 상담결과 변경여부 체크를 위하여, 조회되었던 상담결과코드를 설정한다.
        data.ORG_CSEL_RST_MK1 = $("#hiddenbox5").val();
	}

	return data;
}

/**
 * 상담결과 구분에 따라 저장 data 선택
 */
const getAddInfoCondition = () => {

	const cselRstMk = $("#selectbox8").val();	// 상담결과 구분
	
	// DM 사은품 접수
	if (cselRstMk == "12") {		
		return DS_DM_RECEIPT;
	} 
	// 개인정보동의
	else if (cselRstMk == "19") {	
		return DS_DROP_TEMP2;
	} 
	// 고객직접퇴회
	else if (cselRstMk == "20") {	
		return DS_DROP_CHG;
	} 
	// 기타
	else {
		return {};
	}
}

/**
 * CCEM 저장
 * @param {object} counselData 상담정보
 * @param {obejct} addInfoData DM 사은품 접수/개인정보동의/고객직접퇴회
 * @param {obejct} obData OB관련 데이터
 */
const saveCCEM = async (counselData, addInfoData, obData) => new Promise((resolve, reject) => {

	const settings = {
		global: false,
		url: `${API_SERVER}/cns.saveCounsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids	: ["DS_COUNSEL", "DS_ADDINFO", "DS_OB"],
			recvdataids	: ["dsRecv"],
			DS_COUNSEL	: [counselData],			// 상담정보
			DS_ADDINFO	: [addInfoData], 			// DM 사은품 접수 정보, 개인정보동의 정보, 고객직접퇴회 정보 저장 data
			DS_OB		: [obData],					// OB관련 데이터
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
 * 병행과목코드의 PLURAL_PRDT_LIST로 grid 체크하는 함수
 * - as-is : comm.js.gf_setPlProd()
 * @param {object} grid TOAST UI Grid
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
 * @param {object} grid TOAST UI Grid
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
 * 시정처리건 조회
 * @param {string} custId 고객번호
 */
const getSaveChk = (custId) => new Promise((resolve, reject) => {
	const settings = {
		global: false,
		url: `${API_SERVER}/cns.getSaveChk.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ CUST_ID: custId }],
		}),
	}
	$.ajax(settings)
		.done(data => {
			if (data.errcode != "0") return reject(new Error(getApiMsg(data, settings)));

			return resolve(data.dsRecv);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

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
		case "CCEMPRO030":	// 결과등록
			const PROC_MK = $("#selectbox4").val();
			if (PROC_MK == "3" || PROC_MK == "4") PopupUtil.open(key, 1098, 810);
			else if (PROC_MK == "2") PopupUtil.open("CCEMPRO095", 1110, 603);
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
 * 사업국/센터/연계부서 팝업
 * - as-is : cns5810.openCOM1300(), openCOM1620(), openCOM1030()
 * @param {number} keyCode 
 */
const openCCEMPRO044 = (keyCode) => {
	if (keyCode == 13) {
		PopupUtil.open("CCEMPRO044", 1145, 475);
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
 * 상담결과 selectbox change 이벤트
 * - as-is : cns5810.onCselRstMkPopUp()
 * @param {string} code 상담결과 구분
 */
const openCselRst = code => {

	const mbrId = $("#textbox22").val();	// 회원번호
	const custId = $("#hiddenbox6").val();	// 고객번호

	// 고객정보가 있는지 체크
	if (!custId) {
		alert("상담대상이 없습니다.\n\n[고객조회]또는[선생님조회]를 먼저 하고, 처리 하시기 바랍니다.");
		$("#selectbox8").val("");
		return;
	}

	// 저장 data 초기화
	setInitCselRstMkDS();

	// 지급사유 selectbox 비활성화
	$("#selectbox16").prop("disabled", true);
	$("#selectbox16").val("");

	switch (code) {
		case "01":	// 재통화예약
			PopupUtil.open("CCEMPRO025", 500, 330);
			break;
		case "06":	// TODO 상담성공
			
			break;
		case "07":	// TODO 상담실패
			
			break;
		case "12":	// 사은품접수
			$("#selectbox16").prop("disabled", false); // 지급사유 selectbox 활성화
			break;
		case "19":	// 개인정보동의신청
			PopupUtil.open("CCEMPRO023", 594, 670);
			break;
		case "20":	// 고객직접퇴회
			if (mbrId == "") {
				alert("회원번호가 없습니다.\n\n고객직접퇴회 신청을 할 수 없습니다.");
				return;
			}
			PopupUtil.open("CCEMPRO024", 670, 800);
			break;
		case "MOS문의답변":		// TODO MOS문의답변
			PopupUtil.open("CCEMPRO094", 570, 720);
			break;
		case "MOS(커뮤니티)":	// TODO MOS커뮤니티
			
			break;
		default:
			break;
	}
}

/**
 * 상담결과 팝업 저장 data를 초기화한다.
 * - as-is : cns5810.setInitCselRstMkDS()
 */
const setInitCselRstMkDS = () => {
	DS_DM_RECEIPT  = {};		// DM 사은품 접수 정보 저장 data
	DS_DROP_TEMP2  = {};		// 개인정보동의 정보 저장 data
	DS_DROP_CHG    = {};		// 고객직접퇴회 정보 저장 data
	DS_SCHEDULE	   = {};		// 재통화예약 정보 저장 data
}

/**
 * 지급사유 selectbox change 이벤트
 */
const onDmReceiptChange = () => {

	dmTypeText = $("#selectbox16 option:selected").text();
	dmTypeValue = $("#selectbox16 option:selected").val();

	if (!dmTypeValue) {
		DS_DM_RECEIPT = {};
		return;
	}

	DS_DM_RECEIPT.CSEL_DATE   =	calendarUtil.getImaskValue("textbox27");	// 상담일자		
	DS_DM_RECEIPT.CSEL_NO     =	$("#textbox28").val();						// 상담번호
	DS_DM_RECEIPT.CSEL_SEQ    =	$("#selectbox14").val();					// 상담순번
	DS_DM_RECEIPT.CUST_ID     =	$("#hiddenbox6").val();						// 고객번호
	DS_DM_RECEIPT.CUST_NAME   =	$("#textbox21").val();						// 고객명
	DS_DM_RECEIPT.DM_MATCHCD  =	$("#hiddenbox7").val();						// DM매치코드
	DS_DM_RECEIPT.DM_LIST_ID  =	$("#hiddenbox8").val();						// DM목록ID
	DS_DM_RECEIPT.DM_TYPE_CDE =	dmTypeValue;								// DM종류코드
	DS_DM_RECEIPT.DMLABEL	  = dmTypeText;									// DM종류
	DS_DM_RECEIPT.DM_ZIPCDE   =	$("#textbox24").val();						// 우편번호
	DS_DM_RECEIPT.DM_ADDR     =	$("#textbox25").val();						// 주소
	DS_DM_RECEIPT.DM_REQ_DATE =	getDateFormat().replace(/[^0-9]/gi, '');	// 요청일자
	DS_DM_RECEIPT.REQ_USER_ID =	currentUser.external_id;					// 요청자ID	

}

/**
 * 상담구분, 상담채널 변경시 호출되는 함수
 * - as-is : cns5810.onCloseUpCMB_CSEL_MK()
 */
const changeCselType =() => {
    
    //상담분류 초기화
	$("#textbox14").val("");
	$("#textbox15").val("");
	$("#textbox16").val("");
	$("#textbox17").val("");
	$("#textbox18").val("");
	$("#textbox19").val("");

    //상담구분이 문의(1)일 경우
	if ($("#selectbox3").val() == "1") {
		$("#selectbox5").val("");						// 처리시한
		calendarUtil.setImaskValue("calendar2", "");	// 처리희망일
		$("#selectbox6").val("2");						// 고객반응 (보통)
		$("#selectbox2").focus();
	} else {
		$("#selectbox5").val("");	// 처리시한           
		$("#selectbox6").val("");	// 고객반응                  
	}
    
    //처리구분이 변경되면,
	//신규(I)일때 처리상태를 접수(01)로 선택한다.
	const selectSeq = document.getElementById("selectbox14")
	const jobType = selectSeq.options[selectSeq.selectedIndex].dataset.jobType;
	if (jobType == "I") $("#selectbox10").val("01");

}

/**
 * 저장이 완료 되었거나, 팝업되어 수정 상황일때 버튼 컨트롤 하는 함수.
 * - as-is : cns5810.setBtnCtrlAtLoadComp()
 */
const setBtnCtrlAtLoadComp = () => {
	$("#button5").prop("disabled", false);	// 추가등록
	$("#button6").prop("disabled", false);	// 관계회원

	// 처리구분에 따른 상담연계/결과등록버튼 제어
	switch ($("#selectbox4").val()) {
		case "2":       //상담원처리 = 고객의견
			$("#button4").prop("disabled", true);	// 상담연계
			$("#button7").prop("disabled", false);	// 결과등록
			break;
		case "3":       //상담연계 = 결과등록
			$("#button4").prop("disabled", false);	// 상담연계
			$("#button7").prop("disabled", false);	// 결과등록
			break;
		case "4":       //시정처리 = 결과등록
			$("#button4").prop("disabled", true);	// 상담연계
			$("#button7").prop("disabled", false);	// 결과등록
			break;
		default:
			$("#button4").prop("disabled", true);	// 상담연계
			$("#button7").prop("disabled", true);	// 결과등록
			break;
	}

}

/**
 * 상담내용 현재 입력 bytes 체크하기
 * - as-is : cns5810.onTextAreaKeyUp()
 */
const checkTextLengh = () => {

	const el = $("#textbox13");
	const value = el.val();
	const sCnt = value.length + (escape(value) + "%u").match(/%u/g).length - 1;
	if (sCnt > 4000) {
		alert("상담 내용은 4000Byte이상 저장할 수 없습니다.\n\n다시 입력해 주십시요.");
		el.focus();
	}

}

/**
 * 지역/사업국/센터 선택시 호출.
 * @param {object} data 
 */
var setDisPlayUp = (data) => {
	$("#hiddenbox1").val(data.LC_ID);			// 센터코드
	$("#hiddenbox4").val(data.LC_EMP_ID);		// 센터장
	$("#textbox1").val(data.DIV_CDE);			// 본부코드
	$("#textbox2").val(data.UPDEPTNAME);		// 본부이름
	$("#textbox3").val(data.AREA_CDE);			// 지역코드
	$("#textbox4").val(data.AREA_NAME);			// 지역이름
	$("#textbox5").val(data.DEPT_ID);			// 사업국코드
	$("#textbox6").val(data.DEPT_NAME);			// 사업국이름
	$("#textbox7").val(data.TELPNO_DEPT);		// 사업국전화번호
	$("#textbox9").val(data.LC_NAME);			// 센터이름
	$("#textbox10").val(data.TELPNO_LC);		// 센터전화번호
}

/**
 * 연계부서 선택시 호출.
 * @param {object} data 
 */
var setDisPlayDn = (data) => {
	$("#textbox11").val(data.PROC_DEPT_ID);		// 연계부서코드
	$("#textbox26").val(data.PROC_DEPT_NAME);	// 연계부서이름
}

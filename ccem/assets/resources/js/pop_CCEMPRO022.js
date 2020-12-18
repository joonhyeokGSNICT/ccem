let grid1, grid2, grid3, grid4, grid5;

$(function () {

	// select tab
	let hash = window.location.hash;
	if (hash === "#counselRgtrTab") $("#counselRgtrNav").click();
	else if (hash === "#entrRgtrTab") $("#entrRgtrNav").click();
	else if (hash === "#tchrIntrdTab") $("#tchrIntrdNav").click();

	// insert hash
	$('.nav-link').on('click', ev => window.location.hash = ev.target.hash);

	// grid refreshLayout
	$('.nav-link').on('shown.bs.tab', ev => refreshGrid(ev.target.id));

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.init(el.id));
	$(".imask-date-up").each((i, el) => calendarUtil.init(el.id, { drops: "up" }));
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
	calendarUtil.init("calendar5", { opens: "center" });

	createGrids();
	getCodeList()
	getProd();

});

/**
 * 상담등록에서 사용하는 모든 Grid를 생성합니다.
 */
const createGrids = () => {
	// 상담등록 > 과목 grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 283,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
				minWidth: 30,
			},
			{
				type: 'checkbox',
				header: " ",
				minWidth: 30,
			},
		],
		columns: [
			{
				header: '과목',
				name: 'PRDT_NAME',
				minWidth: 142,
				align: "left",
				sortable: true,
				ellipsis: true,
				filter: "text",
			},
			{
				header: '과목군코드',
				name: 'PRDT_GRP',
				width: 50,
				align: "left",
				sortable: true,
				ellipsis: true,
				filter: "text",
			},
		],
	});
	grid1.on('click', (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
		grid1.clickCheck(ev);
	});

	// 상담등록 > 상담과목 grid
	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
				minWidth: 30,
			}
		],
		columns: [
			{
				header: '상담과목',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
			}
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
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
			{
				header: '제품',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '선생님',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '팀장',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
			}
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
			{
				type: 'rowNum',
				header: "NO",
				minWidth: 30,
			},
			{
				type: 'checkbox',
				header: " ",
				minWidth: 30,
			},
		],
		columns: [
			{
				header: '과목',
				name: 'PRDT_NAME',
				minWidth: 142,
				align: "left",
				sortable: true,
				ellipsis: true,
				filter: "text",
			},
			{
				header: '과목군코드',
				name: 'PRDT_GRP',
				width: 50,
				align: "left",
				sortable: true,
				ellipsis: true,
				filter: "text",
			},
		],
	});
	grid4.on('click', (ev) => {
		grid4.addSelection(ev);
		grid4.clickSort(ev);
		grid4.clickCheck(ev);
	});

	// 입회등록 > 입회과목 grid
	grid5 = new Grid({
		el: document.getElementById('grid5'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
				minWidth: 30,
			}
		],
		columns: [
			{
				header: '입회과목',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
			}
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
 * key 값에 따라 해당 팝업을 오픈합니다.
 * @param {string} key
 */
const openPopup = (key) => {
	switch (key) {
		case "CCEMPRO023":	// 개인정보동의신청
			PopupUtil.open(key, 594, 670);
			break;
		case "CCEMPRO024":	// 고객직접퇴회
			PopupUtil.open(key, 663, 705);
			break;
		case "CCEMPRO025":	// 재통화예약
			PopupUtil.open(key, 536, 330);
			break;
		case "CCEMPRO028":	// 상담연계
			PopupUtil.open(key, 830, 555);
			break;
		case "CCEMPRO029":	// 관계회원
			PopupUtil.open(key, 728, 410);
			break;
		case "CCEMPRO030":	// 결과등록
			if ($("#selectbox1").val() === "2")
				PopupUtil.open("CCEMPRO095", 1110, 603);
			else
				PopupUtil.open(key, 1098, 810);
			break;
		case "CCEMPRO033":
			PopupUtil.open(key, 1184, 650);
			break;
		case "CCEMPRO034":
			PopupUtil.open("CCEMPRO033", 1184, 650, "#counselMain_teacherSearchTab");
			break;
		case "CCEMPRO042": // 분류
			PopupUtil.open(key, 870, 610);
			break;
		default:
			break;
	}
}

/**
 * 과목검색
 * @param {object} grid grid1, grid4
 * @param {string} column PRDT_NAME, PRDT_GRP
 * @param {string} keyword
 */
const searchProd = (grid, column, keyword) => {
	grid.unfilter();
	grid.filter(column, [{ code: 'contain', value: keyword }]);
}

/**
 * 공통코드 조회
 */
const getCodeList = () => {

	let CODE_MK_LIST = ["PRDT_GRP", ];	// 과목군

	CODE_MK_LIST.forEach(codeName => {
		$.ajax({
			url: `${API_SERVER}/sys.getCommCode.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{ CODE_MK: codeName }],
			}),
			success: (data) => {
				if(data.errcode == "0") {
					let codeList = data.dsRecv;
					codeList.forEach(code => {
						$(`select[name='${codeName}']`).append(new Option(code.CODE_NAME, code.CODE_ID));
					});
				}
			},
		});
	});
	
}

/**
 * 상담 과목 리스트 조회
 */
const getProd = () => {
	$.ajax({
		url: `${API_SERVER}/cns.getProd.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}],
		}),
		success: (data) => {
			if (data.errcode != "0") {
				alert(`[API ERROR] ${data.errcode} ${data.errmsg}`);
				return;
			}
			grid1.resetData(data.dsRecv);
			grid4.resetData(data.dsRecv);
		},
	});
}


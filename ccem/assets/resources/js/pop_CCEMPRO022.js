let grid1, grid2, grid3, grid4, grid5;

$(function () {

	// select tab
	let hash = window.location.hash;
	if(hash === "#counselRgtrTab") $("#counselRgtrNav").click();
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

	// 상담결과 selectbox
	$("#selectbox1").on("change", (ev) => {
		let value = ev.target.value;
		if(value === "CCEMPRO023") PopupUtil.open(value, 594, 670);
		else if(value === "CCEMPRO024") PopupUtil.open(value, 663, 705);
		else if(value === "CCEMPRO025") PopupUtil.open(value, 536, 330);
	});
	
	createGrids();

});

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
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
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
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
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
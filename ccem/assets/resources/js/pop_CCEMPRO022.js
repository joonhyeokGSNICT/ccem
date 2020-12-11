var subjectGrid;
var counselSubjectGrid;
var currentSubjectGrid;

$(function(){

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.init(el.id));
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	// 상담등록 > 상담등록 > 과목 grid
	subjectGrid = new Grid({
		el: document.getElementById('subjectGrid'),
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
				// align: "center",
				sortable: true,
				ellipsis: true,
			},
		],
	});
	subjectGrid.on('click', (ev) => {
		subjectGrid.addSelection(ev);
		subjectGrid.clickSort(ev);
		subjectGrid.clickCheck(ev);
	});
	// 과목 끝
	
	// 상담등록 > 상담등록 > 선택한과목 grid
	counselSubjectGrid = new Grid({
		el: document.getElementById('counselSubjectGrid'),
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
	counselSubjectGrid.on('click', (ev) => {
		counselSubjectGrid.addSelection(ev);
		counselSubjectGrid.clickSort(ev);
	});
	// 선택한과목 끝
		
	// 상담등록 > 상담등록 > 학습중인과목 grid
	currentSubjectGrid = new Grid({
		el: document.getElementById('currentSubjectGrid'),
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
	currentSubjectGrid.on('click', (ev) => {
		currentSubjectGrid.addSelection(ev);
		currentSubjectGrid.clickSort(ev);
	});
	// 학습중인과목 끝
});

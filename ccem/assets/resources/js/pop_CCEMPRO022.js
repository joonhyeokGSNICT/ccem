var counselInsert_subject_grid;
var counselInsert_subjectSelected_grid;

$(function(){
	// 상담등록 > 상담등록 > 과목 grid
	counselInsert_subject_grid = new Grid({
		el: document.getElementById('counselInsert_subject_grid'),
		bodyHeight: 322,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
			{
				type: 'checkbox',
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
	counselInsert_subject_grid.on('click', (ev) => {
		counselInsert_subject_grid.addSelection(ev);
		counselInsert_subject_grid.clickSort(ev);
		counselInsert_subject_grid.clickCheck(ev);
	});
	// 과목 끝
	
	// 상담등록 > 상담등록 > 선택한과목 grid
	counselInsert_subjectSelected_grid = new Grid({
		el: document.getElementById('counselInsert_subjectSelected_grid'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
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
	counselInsert_subjectSelected_grid.on('click', (ev) => {
		counselInsert_subjectSelected_grid.addSelection(ev);
		counselInsert_subjectSelected_grid.clickSort(ev);
	});
	// 선택한과목 끝
		
	// 상담등록 > 상담등록 > 학습중인과목 grid
	counselInsert_currentSubject_grid = new Grid({
		el: document.getElementById('counselInsert_currentSubject_grid'),
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
	counselInsert_currentSubject_grid.on('click', (ev) => {
		counselInsert_currentSubject_grid.addSelection(ev);
		counselInsert_currentSubject_grid.clickSort(ev);
	});
	// 학습중인과목 끝
});

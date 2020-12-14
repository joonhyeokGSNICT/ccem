var grid1;
var grid2;

$(function(){
	// calendar
	$(".imask-date").each((i, el) => calendarUtil.init(el.id, {drops:"up"}));

	// 고객정보 grid1
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 100,
		scrollX: false,
		rowHeaders: [
            {
				type: 'checkbox',
			},
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
			{
				header: '고객명',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '학년',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원번호',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '과목',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
		],
	});

	grid1.on("click", (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
	});

	// 고객정보 grid2
	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 100,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
			{
				header: '상담과목',
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
				header: '사업팀장',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
		],
	});
	grid2.on("click", (ev) => {
		grid2.addSelection(ev);
		grid2.clickSort(ev);
    });
    
});
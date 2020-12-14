var recordGrid;

$(function(){

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.init(el.id));
	$(".imask-date-up").each((i, el) => calendarUtil.init(el.id, {drops: "up"}));

	// 녹취LIST
	recordGrid = new Grid({
		el: document.getElementById('recordGrid'),
		bodyHeight: 322,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
			{
				header: '녹취ID',
				name: 'name1',
				width: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '녹취일자',
				name: 'name2',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '시작시간',
				name: 'name3',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '종료시간',
				name: 'name4',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '전화번호',
				name: 'name5',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '상담일자',
				name: 'name6',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '번호',
				name: 'name7',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '고객번호',
				name: 'name8',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '',
				name: 'name9',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '',
				name: 'name10',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
		],
	});
	recordGrid.on('click', (ev) => {
		recordGrid.addSelection(ev);
		recordGrid.clickSort(ev);
    });
});
var recordGrid;

$(function(){
	// 녹취LIST
	recordGrid = new Grid({
		el: document.getElementById('recordGrid'),
		bodyHeight: 322,
		scrollX: false,
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
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '녹취일자',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '시작시간',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '종료시간',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '전화번호',
				name: 'name5',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '상담일자',
				name: 'name6',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '번호',
				name: 'name7',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '고객번호',
				name: 'name8',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '',
				name: 'name9',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '',
				name: 'name10',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
		],
	});
	recordGrid.on('click', (ev) => {
		recordGrid.addSelection(ev);
		recordGrid.clickSort(ev);
		recordGrid.clickCheck(ev);
    });
});
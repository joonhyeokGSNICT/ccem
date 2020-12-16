let grid;

$(function(){
	grid = new Grid({
		el: document.getElementById('grid'),
		bodyHeight: 400,
		scrollX: false,
		columns: [
			{
				header: '회원명',
				name: 'name1',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원번호',
				name: 'name2',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '과목',
				name: 'name3',
				width: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '환불대상회비',
				name: 'name4',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '실환불금액',
				name: 'name5',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '송신일',
				name: 'name6',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '실이체일',
				name: 'name7',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결과',
				name: 'name8',
				width: 60,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '계좌번호',
				name: 'name9',
				minWidth: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
		],
	});
	grid.on('click', (ev) => {
		grid.addSelection(ev);
		grid.clickSort(ev);
	});
});
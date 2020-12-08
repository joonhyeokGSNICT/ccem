var grid;

$(function(){
	grid = new Grid({
		el: document.getElementById('grid'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '회원명',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원번호',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '과목',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '환불대상회비',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '실환불금액',
				name: 'name5',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '송신일',
				name: 'name6',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '실이체일',
				name: 'name7',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결과',
				name: 'name8',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '계좌번호',
				name: 'name9',
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
    grid.resetDummyData(100)
});
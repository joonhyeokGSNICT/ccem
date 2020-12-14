var grid1;
var grid2;

$(function(){

	// input mask
	$(".imask-month").each((i, el) => calendarUtil.monthMask(el.id));
	$(".imask-date").each((i, el) => calendarUtil.init(el.id));

	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 350,
		scrollX: false,
		columns: [
			{
				header: '이체의뢰년월',
				name: 'name1',
                width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '의뢰금액',
				name: 'name2',
                minWidth: 80,
				align: "right",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결제금액',
				name: 'name3',
                minWidth: 80,
				align: "right",
				sortable: true,
				ellipsis: true,
            },
		],
	});
	grid1.on('click', (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
    });
    grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 350,
		columns: [
			{
				header: '실이체일자',
                name: 'name1',
                width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '과목',
				name: 'name2',
                width: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원명',
				name: 'name3',
                width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원번호',
				name: 'name4',
                width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '의뢰금액',
				name: 'name5',
                width: 100,
				align: "right",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결과금액',
				name: 'name6',
                width: 100,
				align: "right",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결과금액',
				name: 'name7',
                width: 100,
				align: "right",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결과금액',
				name: 'name7',
                width: 100,
				align: "right",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결과금액',
				name: 'name8',
                width: 100,
				align: "right",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결과금액',
				name: 'name10',
                width: 100,
				align: "right",
				sortable: true,
				ellipsis: true,
            },
		],
	});
	grid2.on('click', (ev) => {
		grid2.addSelection(ev);
		grid2.clickSort(ev);
	});
});
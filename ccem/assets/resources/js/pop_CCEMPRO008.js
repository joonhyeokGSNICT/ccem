var grid1;
var grid2;

$(function(){

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.init(el.id));

	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '대상년월',
				name: 'name1',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '과목',
				name: 'name2',
				width: 200,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '입금일',
				name: 'name3',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '금액',
				name: 'name4',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '교사명',
				name: 'name5',
				width: 130,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '교사사번',
				name: 'name6',
				minWidth: 100,
				align: "center",
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
        bodyHeight: 150,
        scrollX: false,
		columns: [
			{
				header: '승인구분',
				name: 'name1',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '승인일자',
				name: 'name2',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '승인번호',
				name: 'name3',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '카드번호',
				name: 'name4',
				width: 200,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '카드명',
				name: 'name5',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '총금액',
				name: 'name6',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '할부개월',
				name: 'name7',
				minWidth: 100,
				align: "center",
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
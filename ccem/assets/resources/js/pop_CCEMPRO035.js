let grid1, grid2;

$(function(){

	// create calendar
	$(".calendar").each((i, el) => calendarUtil.init(el.id));

	// 상담조회 > 상담조회 리스트 grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 200,
		pageOptions: {
		  perPage: 7,
		},
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
			{
				header: '상담일자',
				name: 'name1',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '접수',
				name: 'name2',
				width: 60,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담채널',
				name: 'name3',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담구분',
				name: 'name4',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원명',
				name: 'name5',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원번호',
				name: 'name6',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '통화시각',
				name: 'name7',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담시간',
				name: 'name8',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '처리시간',
				name: 'name9',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '학년',
				name: 'name10',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '본부',
				name: 'name11',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '사업국',
				name: 'name12',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '센터',
				name: 'name13',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			}
		],
	});
	grid1.on("click", (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
	});

	// 상담조회 > 상담제품 리스트 grid
	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 97,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
			{
				header: '상담제품',
				name: 'name1',
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
var counselHistoryGrid;
var counselProductGrid;

$(function(){

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.init(el.id));

	// 상담조회 > 상담조회 리스트 grid
	counselHistoryGrid = new Grid({
		el: document.getElementById('counselHistoryGrid'),
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
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '접수',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담채널',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담구분',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원명',
				name: 'name5',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원번호',
				name: 'name6',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '통화시각',
				name: 'name7',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담시간',
				name: 'name8',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '처리시간',
				name: 'name9',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '학년',
				name: 'name10',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '본부',
				name: 'name11',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '사업국',
				name: 'name12',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '센터',
				name: 'name13',
				align: "center",
				sortable: true,
				ellipsis: true,
			}
		],
	});

	counselHistoryGrid.on("click", (ev) => {
		counselHistoryGrid.addSelection(ev);
		counselHistoryGrid.clickSort(ev);
	});
	// 상담조회 끝

	// 상담조회 > 상담제품 리스트 grid
	counselProductGrid = new Grid({
		el: document.getElementById('counselProductGrid'),
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
	counselProductGrid.on("click", (ev) => {
		counselProductGrid.addSelection(ev);
		counselProductGrid.clickSort(ev);
	});
	
});
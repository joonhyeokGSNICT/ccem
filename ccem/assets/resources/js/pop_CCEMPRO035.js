var counselHist_historyList_grid;
var counselHist_counselProduct_grid;

$(function(){
	// 상담조회 > 상담조회 리스트 grid
	counselHist_historyList_grid = new Grid({
		el: document.getElementById('counselHist_historyList_grid'),
		bodyHeight: 150,
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

	counselHist_historyList_grid.on("click", (ev) => {
		counselHist_historyList_grid.addSelection(ev);
		counselHist_historyList_grid.clickSort(ev);
	});
	// 상담조회 끝

	// 상담조회 > 상담제품 리스트 grid
	counselHist_counselProduct_grid = new Grid({
		el: document.getElementById('counselHist_counselProduct_grid'),
		bodyHeight: 88,
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
	counselHist_counselProduct_grid.on("click", (ev) => {
		counselHist_counselProduct_grid.addSelection(ev);
		counselHist_counselProduct_grid.clickSort(ev);
	});
	
});
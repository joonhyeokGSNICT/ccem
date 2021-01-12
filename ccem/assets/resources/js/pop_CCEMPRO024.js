let grid1, grid2;

$(function () {

	// create grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 100,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", },
		],
		columns: [
			{ header: '회원명', 	name: 'name1', align: "center", sortable: true, ellipsis: true, },
			{ header: '회원번호', 	name: 'name2', align: "center", sortable: true, ellipsis: true, },
			{ header: '전화번호', 	name: 'name3', align: "center", sortable: true, ellipsis: true, },
		],
	});
	grid1.on("click", (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
	});

	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 288,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", },
		],
		columns: [
			{ header: '과목명', 	name: 'name1', align: "center", sortable: true, ellipsis: true, },
			{ header: '학습횟수', 	name: 'name2', align: "center", sortable: true, ellipsis: true, },
		],
	});
	grid2.on("click", (ev) => {
		grid2.addSelection(ev);
		grid2.clickSort(ev);
	});

});
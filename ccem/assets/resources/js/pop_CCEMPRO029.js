let grid;

$(function() {
    grid = new Grid({
        el: document.getElementById("grid"),
        bodyHeight: 300,
        scrollX: false,
        rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
				minWidth: 30,
            },
        ],
        columns: [
			{
				header: '구분',
                name: 'name1',
                width: 50,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
			{
				header: '관계',
                name: 'name2',
                width: 50,
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
				header: '학년',
                name: 'name4',
                width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
			{
				header: '성별',
                name: 'name5',
                width: 50,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
			{
				header: '회원번호',
                name: 'name6',
                width: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
			{
				header: '고객번호',
                name: 'name7',
                minWidth: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
        ],
        summary: {
            height: 28,
            position: 'bottom',
            columnContent: {
                name1: "Total",
                name2: {
                    template: valueMap => valueMap.cnt
                }
            },
        },
    });
    grid.on("click", (ev) => {
        grid.addSelection(ev);
        grid.clickSort(ev);
    });
});
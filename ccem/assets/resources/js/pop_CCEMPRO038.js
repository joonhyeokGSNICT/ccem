let grid

$(function(){

	// input mask
    $(".calendar").each((i, el) => calendarUtil.init(el.id));

    // create grid
    grid = new Grid({
        el: document.getElementById("grid"),
        bodyHeight: 380,
		pageOptions: {
		  perPage: 13,
		},
		rowHeaders: [
			{
				type: 'rowNum',
                header: "NO",
            },
        ],
		columns: [
			{
				header: '접수일자',
				name: 'name1',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '접수번호',
				name: 'name2',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '시작시간',
				name: 'name3',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원명',
				name: 'name4',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원번호',
				name: 'name5',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '학년',
				name: 'name6',
				width: 50,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '전화번호',
				name: 'name7',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '입회연계과목',
				name: 'name8',
				width: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '학습과목',
				name: 'name9',
				width: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '주소',
				name: 'name10',
				width: 200,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '',
				name: 'name11',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '',
				name: 'name12',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '',
				name: 'name13',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			}
		],
    });
    grid.on("click", ev => {
        grid.addSelection(ev);
        grid.clickSort(ev);
    });
    
});
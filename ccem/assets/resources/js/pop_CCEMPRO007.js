var grid1;
var grid2;
var grid3;

$(function(){
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '대상년월',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결제금액',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결제일자',
				name: 'name3',
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
		bodyHeight: 300,
		columns: [
			{
				header: '실결제일자',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '대상년월',
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
				header: '회원명',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원번호',
				name: 'name5',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '의뢰금액',
				name: 'name6',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '결과..',
				name: 'name7',
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
    grid3 = new Grid({
		el: document.getElementById('grid3'),
		bodyHeight: 100,
		columns: [
			{
				header: '신청일',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '과목',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원명',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원번호',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '신청금액',
				name: 'name5',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '선생님',
				name: 'name6',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '승인취소예정일',
				name: 'name7',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
		],
	});
	grid3.on('click', (ev) => {
		grid3.addSelection(ev);
		grid3.clickSort(ev);
    });
});
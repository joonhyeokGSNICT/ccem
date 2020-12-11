var topGrid;
var midGrid;
var botGrid;

$(function(){
	
	// 대분류 LIST
	topGrid = new Grid({
		el: document.getElementById('topGrid'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '분류코드',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
            },
            {
				header: '제목',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
            }
		],
	});
	topGrid.on('click', (ev) => {
		topGrid.addSelection(ev);
		topGrid.clickSort(ev);
		topGrid.clickCheck(ev);
    });
	
	// 중분류 LIST
	midGrid = new Grid({
		el: document.getElementById('midGrid'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '분류코드',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
            },
            {
				header: '제목',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
            }
		],
	});
	midGrid.on('click', (ev) => {
		midGrid.addSelection(ev);
		midGrid.clickSort(ev);
		midGrid.clickCheck(ev);
    });
	
	// 소분류 LIST
	botGrid = new Grid({
		el: document.getElementById('botGrid'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '분류코드',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
            },
            {
				header: '제목',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
            }
		],
	});
	botGrid.on('click', (ev) => {
		botGrid.addSelection(ev);
		botGrid.clickSort(ev);
		botGrid.clickCheck(ev);
    });
	
	// 상담제목 LIST
	subjectGrid = new Grid({
		el: document.getElementById('subjectGrid'),
		bodyHeight: 130,
		scrollX: false,
		columns: [
			{
				header: '분류코드',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
            },
            {
				header: '제목',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
            }
		],
	});
	subjectGrid.on('click', (ev) => {
		subjectGrid.addSelection(ev);
		subjectGrid.clickSort(ev);
		subjectGrid.clickCheck(ev);
    });
});
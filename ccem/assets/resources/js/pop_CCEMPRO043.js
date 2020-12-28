var _addrGrid;
var _orgBcdGrid;
var _orgCenterGrid;
var _chooseAddrGrid;

function init(){
	
	// 우편번호 LIST
	_addrGrid = new Grid({
		el: document.getElementById('addrGrid'),
		bodyHeight: 180,
		bodyWidth:'auto', 
		columns: [
			{
				header: 'No',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 40
            },
            {
				header: '우편번호',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
			},
			{
				header: '주소',
				name: 'name3',
				align: "center",
				minWidth: 170,
				sortable: true,
				ellipsis: true,
            },
			{
				header: 'DDD',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 40
			},
			{
				header: '지역구분',
				name: 'name5',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
            },
			{
				header: '지역명',
				name: 'name6',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 120
            }
			
		],
	});
	_addrGrid.on('click', (ev) => {
		_addrGrid.addSelection(ev);
		_addrGrid.clickSort(ev);
		_addrGrid.clickCheck(ev);
    });

	// 사업국목록 LIST
	_orgBcdGrid = new Grid({
		el: document.getElementById('orgBcdGrid'),
		bodyHeight: 120,
		bodyWidth:'auto', 
		columns: [
			{
				header: 'No',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 40
            },
            {
				header: '우편번호',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
			},
			{
				header: '주소',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
			{
				header: 'DDD',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 40
			},
			{
				header: '지역구분',
				name: 'name5',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
            },
			{
				header: '지역명',
				name: 'name6',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 120
            }
			
		],
	});
	_orgBcdGrid.on('click', (ev) => {
		_orgBcdGrid.addSelection(ev);
		_orgBcdGrid.clickSort(ev);
		_orgBcdGrid.clickCheck(ev);
	});
	
	// 센터목록 LIST
	_orgCenterGrid = new Grid({
		el: document.getElementById('orgCenterGrid'),
		bodyHeight: 120,
		bodyWidth:'auto', 
		columns: [
			{
				header: 'No',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 40
            },
            {
				header: '우편번호',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
			},
			{
				header: '주소',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
			{
				header: 'DDD',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 40
			},
			{
				header: '지역구분',
				name: 'name5',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
            },
			{
				header: '지역명',
				name: 'name6',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 120
            }
			
		],
	});
	_orgCenterGrid.on('click', (ev) => {
		_orgCenterGrid.addSelection(ev);
		_orgCenterGrid.clickSort(ev);
		_orgCenterGrid.clickCheck(ev);
    });

	// 선택할 주소
	_chooseAddrGrid = new Grid({
		el: document.getElementById('chooseAddrGrid'),
		bodyHeight: 130,
		bodyWidth:'auto', 
		columns: [
			{
				header: 'No',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 40
            },
            {
				header: '우편번호',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
			},
			{
				header: '지번',
				name: 'name3',
				align: "center",
				minWidth: 170,
				sortable: true,
				ellipsis: true,
            },
			{
				header: '도로명',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 170
			}
		],
	});
	_chooseAddrGrid.on('click', (ev) => {
		_chooseAddrGrid.addSelection(ev);
		_chooseAddrGrid.clickSort(ev);
		_chooseAddrGrid.clickCheck(ev);
    });


	_styleChanger.resizeWidth();
	_styleChanger.resizeHeight();

};



// #02 document ready function모음
$( document ).ready(function() {
	// #01_윈도우 크기에 따라 그리드 크기 조정
	$(window).resize(function() {
		_styleChanger.resizeWidth();
		_styleChanger.resizeHeight();
	});

});

// #03 _styleChanger : 화면 내 스타일 변경사항처리 JS
var _styleChanger = {

	// #03_01 그리드 가로 수정
	resizeWidth(){
		var widthSize;
		widthSize = $('#addrGrid').prev().css('width').replace('px','');
		// _addrGrid.setWidth(widthSize);
		// _orgBcdGrid.setWidth(widthSize);
		// _orgCenterGrid.setWidth(widthSize);
	},
	// #03_02 그리드 세로 수정
	resizeHeight(){
		var heightSize;
		heightSize = $('#addrGrid').parent().height();
		// console.log(heightSize);
		_addrGrid.setHeight(heightSize-70);

		heightSize = $('#orgBcdGrid').parent().height();
		// console.log(heightSize);
		_orgBcdGrid.setHeight(heightSize-30);

		heightSize = $('#orgCenterGrid').parent().height();
		// console.log(heightSize);
		_orgCenterGrid.setHeight(heightSize-30);
		
		heightSize = $('#chooseAddrGrid').closest('body').height();
		console.log(heightSize);
		_chooseAddrGrid.setHeight(heightSize-485);
	}
}


init();
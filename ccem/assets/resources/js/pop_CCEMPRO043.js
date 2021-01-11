/**
 * 파일명 : POP_CCEMPRO043.js
 * 설  명 : 주소찾기 JS
 * 생성자 : 이재민
 * 작성일 : 2020-12-18
 * 수정일 : 2021-01-11
 */


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
		rowHeaders: [
			{
				type: 'rowNum',
				sortable: true,
				ellipsis: true,
			}
		],
		columns: [
            {
				header: '우편번호',
				name: 'ZIPCDE',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
			},
			{
				header: '주소',
				name: 'ZIP_ADDR',
				align: "left",
				minWidth: 170,
				sortable: true,
				ellipsis: true,
            },
			{
				header: 'DDD',
				name: 'DDD',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 40
			},
			{
				header: '지역구분',
				name: 'AREA_CDE',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
            },
			{
				header: '지역명',
				name: 'AREA_NAME',
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

		$('#addrZipCode_input').val(_addrGrid.getFormattedValue(ev.rowKey, "ZIPCDE"));
		$('#addrZipAddr_input').val(_addrGrid.getFormattedValue(ev.rowKey, "ZIP_ADDR"));
		_getAddrList.branchAddrList(_addrGrid.getFormattedValue(ev.rowKey, "ZIPCDE"));
    });

	// 사업국목록 LIST
	_orgBcdGrid = new Grid({
		el: document.getElementById('orgBcdGrid'),
		bodyHeight: 120,
		bodyWidth:'auto', 
		rowHeaders: [
			{
				type: 'rowNum',
				sortable: true,
				ellipsis: true,
			}
		],
		columns: [
            {
				header: '본부',
				name: 'DIV_NAME',
				align: "left",
				sortable: true,
				ellipsis: true,
				width: 140
			},
			{
				header: '사업국',
				name: 'DEPT_NAME',
				align: "left",
				sortable: true,
				ellipsis: true,
				width: 140
            },
			{
				header: '관할지역',
				name: 'ZIP_CNTS',
				align: "left",
				sortable: true,
				ellipsis: true,
				width: 500
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
				header: '본부',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 140
			},
			{
				header: '사업국',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 140
			},
			{
				header: '센터',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 140
            },
			{
				header: '관할지역',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 40
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
		// console.log(heightSize);
		_chooseAddrGrid.setHeight(heightSize-485);
	}
}


/**
 * 테이블 내역 조회
 */
const _searchTable = {
	addrList(){
		var searchText = $('#searchAddr_input').val();
		_getAddrList.addrList(searchText);
	},
}


/**
 * API 조회
 */
const _getAddrList = {
	addrList(prop){
		var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{JUSO_TXT:prop}]
		};
		
		$.ajax({
			url: API_SERVER + '/cns.getZIPNM.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				// console.log("addrList값",response.dsRecv);
				var temp = response.dsRecv;
				temp = temp.map(el => {
					return {
						ZIPCDE : 	el.ZIPCDE,
						ZIP_ADDR : el.ZIP_ADDR,
						DDD : el.DDD,
						AREA_CDE : el.AREA_CDE,
						AREA_NAME : el.AREA_NAME,
					};
				});
				_addrGrid.resetData(temp);

			}, error: function (response) {
			}
		});
	},

	branchAddrList(prop){
		let today = new Date();   

		let year = today.getFullYear(); // 년도
		let month = today.getMonth() + 1;  // 월
		let date = today.getDate();  // 날짜
		 
		if (month <10) {
			month = '0'+month;
		}

		let todaydate = year+month+date;

		var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ZIPCDE:prop, ACT_EDDATE:todaydate}]
		};
		
		$.ajax({
			url: API_SERVER + '/cns.getBranchNM.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				console.log("branchAddrList값",response.dsRecv);
				var temp = response.dsRecv;
				temp = temp.map(el => {
					return {
						DIV_NAME : 	el.DIV_NAME,
						DEPT_NAME : el.DEPT_NAME,
						ZIP_CNTS : el.ZIP_CNTS
					};
				});
				_orgBcdGrid.resetData(temp);

			}, error: function (response) {
			}
		});
	},
}

/**
 * 엔터키 이벤트
 */
$('#searchAddr_input').keyup(function(){
    if(event.keyCode == 13){
        $('#searchAddr_btn').trigger('click');
    }
});

init();
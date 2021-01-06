/**
 * 파일명 : POP_CCEMPRO041.js
 * 설  명 : 호전환 JS
 * 생성자 : 이재민
 * 작성일 : 2020-12-18
 * 수정일 : 2020-12-18
 */


// #00 전역변수
var _centerInterPhone_grid;		// 센터내선 Grid
var _daekyoInterPhone_grid;		// 대교내선 Grid
var _branchInterPhone_grid;		// 지점 Grid


// #01 init_화면 초기화
function init(){

	// #01_001 Grid 초기화
		// #01_001_01 센터내선
		_centerInterPhone_grid = new Grid({
			el: document.getElementById('centerInterPhone_grid'),
			bodyHeight: 300,
			bodyWidht: "100%",
			scrollX: false,
			rowHeaders: [
				{
					type: 'rowNum',
					header: "NO",
				},
			],
			columns: [
				{
					header: '그룹',
					name: 'GRP_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담원',
					name: 'USER_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '전화번호',
					name: 'USER_IN_TEL',
					align: "center",
					sortable: true,
					ellipsis: true,
				}
			],
		});
		_centerInterPhone_grid.on('click', (ev) => {
			_centerInterPhone_grid.addSelection(ev);
			_centerInterPhone_grid.clickSort(ev);
			_centerInterPhone_grid.clickCheck(ev);
		});

		// #01_001_02 대교내선
		_daekyoInterPhone_grid = new Grid({
			el: document.getElementById('daekyoInterPhone_grid'),
			bodyHeight: 300,
			bodyWidht: "100%",
			scrollX: false,
			rowHeaders: [
				{
					type: 'rowNum',
					header: "NO",
				},
			],
			columns: [
				{
					header: '회사명',
					name: 'CO_NM',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '팀명',
					name: 'DEPT_NM',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '직책',
					name: 'JIC_NM',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '사원',
					name: 'EMP_NM',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '전화번호',
					name: 'TELPNO',
					align: "center",
					sortable: true,
					ellipsis: true,
				}
			],
		});
		_daekyoInterPhone_grid.on('click', (ev) => {
			_daekyoInterPhone_grid.addSelection(ev);
			_daekyoInterPhone_grid.clickSort(ev);
			_daekyoInterPhone_grid.clickCheck(ev);
		});
		
		// #01_001_03 지점
		_branchInterPhone_grid = new Grid({
			el: document.getElementById('branchInterPhone_grid'),
			bodyHeight: 300,
			bodyWidht: "100%",
			scrollX: false,
			columns: [
				{
					header: 'No',
					name: 'name1',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 60
				},
				{
					header: '본부',
					name: 'name2',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '지점',
					name: 'name3',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '전화번호',
					name: 'name4',
					align: "center",
					sortable: true,
					ellipsis: true,
				}
			],
		});
		_branchInterPhone_grid.on('click', (ev) => {
			_branchInterPhone_grid.addSelection(ev);
			_branchInterPhone_grid.clickSort(ev);
			_branchInterPhone_grid.clickCheck(ev);
		});

	// #01_002 그리드 사이즈 초기화
	_styleChanger.resizeWidth();
	_styleChanger.resizeHeight();

	_getTelList.centerTelList();
	_getTelList.inDeptTelList();
	_getTelList.deptTelList();

	_getComboList.codeBook('USER_GRP_CDE');
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
		var widthSize = document.body.offsetWidth - 35;
		if (document.body.offsetWidth <= 400) {
			widthSize = 366;
		}
		_centerInterPhone_grid.setWidth(widthSize);
		_daekyoInterPhone_grid.setWidth(widthSize);
		_branchInterPhone_grid.setWidth(widthSize);
	},
	// #03_02 그리드 세로 수정
	resizeHeight(){
		var heightSize = window.innerHeight - 160;
		if (window.innerHeight <= 300) {
			heightSize = 140;
		}
		_centerInterPhone_grid.setHeight(heightSize);
		_daekyoInterPhone_grid.setHeight(heightSize);
		_branchInterPhone_grid.setHeight(heightSize);
	}
}

/**
 * 센터/대교/지점 전화조회
 */
const _getTelList = {
	centerTelList(){
		var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}]
		};
		
		$.ajax({
			url: API_SERVER + '/sys.getCenterTelList.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				console.log(response);
				_centerInterPhone_grid.resetData(response.dsRecv);
			}, error: function (response) {
			}
		});
	},

	inDeptTelList(){
		var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}]
		};
		
		$.ajax({
			url: API_SERVER + '/sys.getInDeptTelList.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				console.log(response);
				_daekyoInterPhone_grid.resetData(response.dsRecv);
			}, error: function (response) {
			}
		});
	},

	deptTelList(){
		var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}]
		};
		
		$.ajax({
			url: API_SERVER + '/sys.getDeptTelList.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				console.log(response);
			}, error: function (response) {
			}
		});
	}
}


/**
 * 콤보박스 조회
 */
const _getComboList = {
	codeBook(codeName){
		var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{CODE_MK: codeName}]
		};
		
		$.ajax({
			url: API_SERVER + '/sys.getCommCode.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				console.log(response);
				var codeList = response.dsRecv;
				if (codeName = 'USER_GRP_CDE'){
					codeList.forEach(code => {
						$('#centerSelectBox').append(new Option(code.CODE_NAME, code.CODE_ID));
					});
				} else if ( codeName = '123'){

				}
			}, error: function (response) {
			}
		});
	}
}

// const getCodeList = () => {
// 	let settings = {
// 		url: `${API_SERVER}/sys.getCenterTelList.do`,
// 		method: 'POST',
// 		contentType: "application/json; charset=UTF-8",
// 		dataType: "json",
// 		data: JSON.stringify({
// 			senddataids: ["dsSend"],
// 			recvdataids: ["dsRecv"],
// 			dsSend: [{}],
// 		}),
// 	}
// 	$.ajax(settings).done(data => {
// 		if (checkApi(data, settings)) {
// 			let codeList = data.dsRecv;
// 			console.log(codeList);
// 			console.log("1");
// 		}
// 	});
// }


init();
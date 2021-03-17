/**
 * 파일명 : POP_CCEMPRO041.js
 * 설  명 : 호전환 JS
 * 생성자 : 이재민
 * 작성일 : 2020-12-18
 * 수정일 : 2021-01-11
 */


// #00 전역변수
var _centerInterPhone_grid;		// 센터내선 Grid
var _daekyoInterPhone_grid;		// 대교내선 Grid
var _branchInterPhone_grid;		// 지점 Grid
var _centerInterPhone_list;		// 센터내선 list
var _daekyoInterPhone_list;		// 대교내선 list
var _branchInterPhone_list;		// 지점 list


var tempStat = "";				// 전화 걸수 있는 상태

var cenFlag = false;			// 최초 조회 flag
var empFlag = false;
var brnFlag = false;

$(function(){
	//탭 이동시 이벤트
	$("a[data-toggle='tab']").on("shown.bs.tab", function(e) {
		id = $(this).attr('id');
		console.log(id);
		switch(id){
		/*case 'centerInterPhoneTab' :
			if(!cenFlag){
				_getTelList.centerTelList();
				cenFlag = true;
			}
			break;*/
		case 'daekyoInterPhone' :
			if(empFlag == false){
				_getTelList.inDeptTelList();
				empFlag = true;
			}
			break;
		case 'branchInterPhone' :
			if(brnFlag == false){
				_getTelList.deptTelList();
				brnFlag = true;
			}
			break;
		}
	});
});
// #01 init_화면 초기화
function init(){
	
	setStatus();
	//탑바에 윈도우 객체 전달
	opener.wiseNTalkUtil.saveWindowObj(window);

	// #01_001 Grid 초기화
		// #01_001_01 센터내선
		_centerInterPhone_grid = new Grid({
			el: document.getElementById('centerInterPhone_grid'),
			bodyHeight: 300,
			bodyWidht: "100%",
			scrollX: false,
			rowHeaders: [
				{
					type: 'rowNum'
				}
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
			$('#top_input_name').val(_centerInterPhone_grid.getFormattedValue(ev.rowKey, "USER_NAME"));
			$('#top_input_tel').val(_centerInterPhone_grid.getFormattedValue(ev.rowKey, "USER_IN_TEL"));
		});

		_centerInterPhone_grid.on("dblclick", ev => {
		});

		// #01_001_02 대교내선
		_daekyoInterPhone_grid = new Grid({
			el: document.getElementById('daekyoInterPhone_grid'),
			bodyHeight: 300,
			bodyWidht: "100%",
			scrollX: true,
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
					width: "120",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '팀명',
					name: 'DEPT_NM',
					align: "center",
					width: "120",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '직책',
					name: 'JIC_NM',
					align: "center",
					width: "80",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '성명',
					name: 'EMP_NM',
					align: "center",
					width: "80",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '전화번호',
					name: 'TELPNO',
					align: "center",
					width: "120",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '직무_hidden',
					name: 'WORK_CNTS',
					align: "center",
					width: "120",
					sortable: true,
					ellipsis: true,
					hidden: true
				}
			],
		});
		_daekyoInterPhone_grid.on('click', (ev) => {
			_daekyoInterPhone_grid.addSelection(ev);
			_daekyoInterPhone_grid.clickSort(ev);
			_daekyoInterPhone_grid.clickCheck(ev);
			$('#inter_textarea').val(_daekyoInterPhone_grid.getFormattedValue(ev.rowKey, "WORK_CNTS"));
			$('#top_input_name').val(_daekyoInterPhone_grid.getFormattedValue(ev.rowKey, "EMP_NM"));
			$('#top_input_tel').val(_daekyoInterPhone_grid.getFormattedValue(ev.rowKey, "TELPNO"));
		});
		_daekyoInterPhone_grid.on("dblclick", ev => {
		});
		
		// #01_001_03 지점
		_branchInterPhone_grid = new Grid({
			el: document.getElementById('branchInterPhone_grid'),
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
					header: '본부',
					name: 'DIV_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '지점',
					name: 'DEPT_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '전화번호',
					name: 'TELNO',
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
			$('#top_input_name').val(_branchInterPhone_grid.getFormattedValue(ev.rowKey, "DEPT_NAME"));
			$('#top_input_tel').val(_branchInterPhone_grid.getFormattedValue(ev.rowKey, "TELNO"));
		});
		_branchInterPhone_grid.on("dblclick", ev => {
		});

	// #01_002 그리드 사이즈 초기화
	_styleChanger.resizeWidth();
	_styleChanger.resizeHeight();

	_getTelList.centerTelList();
	/*_getTelList.inDeptTelList();
	_getTelList.deptTelList();*/

	// _getComboList.codeBook('USER_GRP_CDE');
	
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
		var heightSize = window.innerHeight - 268;
		if (window.innerHeight <= 450) {
			heightSize = 300;
		}
		_centerInterPhone_grid.setHeight(heightSize+101);
		_daekyoInterPhone_grid.setHeight(heightSize);
		_branchInterPhone_grid.setHeight(heightSize+101);
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
				// console.log("_centerInterPhone_grid와 list값",response.dsRecv);
				_centerInterPhone_list = response.dsRecv;
				_centerInterPhone_grid.resetData(response.dsRecv);

				// 상담원그룹 selectBox 삽입
				var temp = removeDuplicates(_centerInterPhone_list,"GRP_NAME");
				temp.forEach(temp => {
					$('#centerSelectBox').append(new Option(temp.GRP_NAME, temp.USER_GRP_CDE));
				});

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
				// console.log(response);
				_daekyoInterPhone_list = response.dsRecv;
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
				// console.log(response);
				_branchInterPhone_list = response.dsRecv;
				_branchInterPhone_grid.resetData(response.dsRecv);
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
				// console.log(response);
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


/**
 * 테이블 내역 조회
 */
const _searchTable = {
	centerTelList(){
		var searchGroup = $('#centerSelectBox').val();
		var temp = _centerInterPhone_list;
		if(searchGroup!='전체' ){
			temp = temp.filter(data=> data.USER_GRP_CDE == searchGroup);
		}
		var searchText = $('#searchCenterInterPhone_input').val();
		temp = temp.filter(data => new RegExp(searchText,"i").test(data.USER_NAME));
		temp = temp.map(el => {
			return {
				GRP_NAME : 	el.GRP_NAME,
				USER_NAME : el.USER_NAME,
				USER_IN_TEL : el.USER_IN_TEL
			};
		});
		_centerInterPhone_grid.resetData(temp);
	},
	daekyoTelList(){
		var searchGroup = $('#daekyoSelectBox').val();
		var temp = _daekyoInterPhone_list;
		var searchText = $('#searchDaekyoInterPhone_input').val();
		temp = temp.filter(data => new RegExp(searchText,"i").test(data[searchGroup]));
		temp = temp.map(el => {
			return {
				CO_NM: el.CO_NM,
				DEPT_NM: el.DEPT_NM,
				EMP_NM: el.EMP_NM,
				JIC_NM: el.JIC_NM,
				TELPNO: el.TELPNO,
				WORK_CNTS: el.WORK_CNTS,
			};
		});
		_daekyoInterPhone_grid.resetData(temp);
	},
	branchTelList(){
		var temp = _branchInterPhone_list;
		var searchText = $('#searchBranchInterPhone_input').val();
		temp = temp.filter(data => new RegExp(searchText,"i").test(data.DEPT_NAME));
		temp = temp.map(el => {
			return {
				DIV_NAME: el.DIV_NAME,
				DEPT_NAME: el.DEPT_NAME,
				TELNO: el.TELNO
			};
		});
		_branchInterPhone_grid.resetData(temp);
	}
}
/**
 * 엔터키 이벤트
 */
$('#searchCenterInterPhone_input').keyup(function(){
    if(event.keyCode == 13){
        $('#searchCenterInterPhone_btn').trigger('click');
    }
});

$('#searchDaekyoInterPhone_input').keyup(function(){
    if(event.keyCode == 13){
        $('#searchDaekyoInterPhone_btn').trigger('click');
    }
});

$('#searchBranchInterPhone_input').keyup(function(){
    if(event.keyCode == 13){
        $('#searchBranchInterPhone_btn').trigger('click');
    }
});


/**
 * 중복값을 제거
 * @param {중복값을 제거할 배열} originalArray 
 * @param {기준 값} prop 
 */
function removeDuplicates(originalArray, prop) {
	// console.log("(common)removeDuplicates 진입 >>> ", prop);
    var newArray = [];
	var lookupObject  = {};
	if (isEmpty(prop)) {
		for(var i in originalArray) {
			lookupObject[originalArray[i]] = originalArray[i];
		 }
		 for(i in lookupObject) {
			 newArray.push(lookupObject[i]);
		 }
	} else {
		for(var i in originalArray) {
		   lookupObject[originalArray[i][prop]] = originalArray[i];
		}
		for(i in lookupObject) {
			newArray.push(lookupObject[i]);
		}
	}
	return newArray;
}

/**
 * 빈값 확인
 * @param {빈값확인하는 데이터} data 
 */
function isEmpty(data) {
	if (!data || data == "" || data == undefined || Object.keys(data).length === 0 ) return true;
	else return false;
}

// 전화 걸기 func
function callRequest(type){
	/*if(tempStat != 'callOn'){
		alert('전화 걸 수 없는 상태입니다.');
		return;
	}*/
	if(opener.currentTicketInfo?.ticket?.id != null && opener.currentTicketInfo?.ticket?.id != undefined && opener.currentTicketInfo?.ticket?.id != '' && type == 'ticketCall'){
		opener.wiseNTalkUtil.callStart(tempStat, $.trim($('#top_input_tel').val()), 'CCEMPRO041_2', opener.currentTicketInfo?.ticket?.id, '1');
	}else {
		opener.wiseNTalkUtil.callStart(tempStat, $.trim($('#top_input_tel').val()), 'CCEMPRO041_2', '', '1');
	}
}

// cti 상태 설정
function setStatus(){
		switch(opener.CTI_STATUS.state){
		case 'INITIATING':
			tempType = 'callOff';
			break;
		case 'INITIATED':
			tempStat = 'callOff';
			break;
		case 'ACTIVE':
			tempStat = 'callOff';
			break;
		case 'WRAP_UP':
			tempStat = 'callOn';
			break;
		case 'DROPPED':
			tempStat = 'callOn';
			break;
		default:
			tempStat = 'callOn';
		break;	
		}
	}

init();

$(window).bind("beforeunload", function (e){
	delete opener.wiseNTalkUtil.openedCallPop.CCEMPRO041_2
});

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
		_getAddrList.centerAddrList(_addrGrid.getFormattedValue(ev.rowKey, "ZIPCDE"));
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
		
		$('#orgBcd_NAME').val(_orgBcdGrid.getFormattedValue(ev.rowKey, "DIV_NAME"));
		$('#orgCenter_NAME').val(_orgBcdGrid.getFormattedValue(ev.rowKey, "DEPT_NAME"));
		$('#orgDetail_NAME').val("");
	});
	
	// 센터목록 LIST
	_orgCenterGrid = new Grid({
		el: document.getElementById('orgCenterGrid'),
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
				header: '센터',
				name: 'LC_NAME',
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
	_orgCenterGrid.on('click', (ev) => {
		_orgCenterGrid.addSelection(ev);
		_orgCenterGrid.clickSort(ev);
		_orgCenterGrid.clickCheck(ev);

		$('#orgBcd_NAME').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "DIV_NAME"));
		$('#orgCenter_NAME').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "DEPT_NAME"));
		$('#orgDetail_NAME').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "LC_NAME"));
    });

	// 선택할 주소
	_chooseAddrGrid = new Grid({
		el: document.getElementById('chooseAddrGrid'),
		bodyHeight: 130,
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
				name: 'ZPRNJ',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 80
			},
			{
				header: '지번',
				name: 'ADDRJ',
				align: "center",
				minWidth: 250,
				sortable: true,
				ellipsis: true,
            },
			{
				header: '도로명',
				name: 'ADDRR',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 250
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

		// 테이블 목록 비우기
		_orgBcdGrid.clear();
		_orgCenterGrid.clear();
		_chooseAddrGrid.clear();

		// 선택한 사업국/센터
		$('#orgBcd_NAME').val("");
		$('#orgCenter_NAME').val("");
		$('#orgDetail_NAME').val("");

		// 상세주소
		$('#addrZipCode_input').val("");
		$('#addrZipAddr_input').val("");
		$('#addrZipAddr2_input').val("");
			
		// 검증결과
		$('#checkAddr').val("");

		// 입력주소
		$('#typedPostNo').val("");
		$('#typedAddr1').val("");
		$('#typedAddr2').val("");

		// 정제된 지번주소
		$('#jibunPostNo').val("");
		$('#jibunAddr1').val("");
		$('#jibunAddr2').val("");

		
		// 정제된 도로명주소
		$('#doroPostNo').val("");
		$('#doroAddr1').val("");
		$('#doroAddr2').val("");
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
				// console.log("branchAddrList값",response.dsRecv);
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

	centerAddrList(prop){
		// console.log(prop);
		var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
				GUBUN:"Z",
				ZIPCDE:prop,
			}] // GUBUN : 검색조건(C:센터ID, Z:우편, L : 센터명)
		};
		
		$.ajax({
			url: API_SERVER + '/cns.getLcNM.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				// console.log("centerAddrList값",response.dsRecv);
				var temp = response.dsRecv;
				temp = temp.map(el => {
					return {
						DIV_NAME : 	el.DIV_NAME,
						DEPT_NAME : el.DEPT_NAME,
						LC_NAME : el.LC_NAME,
						ZIP_CNTS : el.ZIP_CNTS
					};
				});
				_orgCenterGrid.resetData(temp);

			}, error: function (response) {
			}
		});
	},

	chooseAddrList(){
		var postNo = $('#addrZipCode_input').val();
		var addr1 = $('#addrZipAddr_input').val();
		var addr2 = $('#addrZipAddr2_input').val();
		// console.log(postNo+"/"+addr1+"/"+addr2);

		var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
				POST_NO: postNo,
				ADDR1: addr1,
				ADDR2: addr2
			}]
		};

		if ( isEmpty(postNo) ) {
			alert("우편번호가 비어 있습니다. 주소를 검색해주세요.");
			$('#searchAddr_input').focus();
			return false;
		} else if ( isEmpty(addr1) ){
			alert("읍면동 주소가 없습니다. 주소를 검색해주세요.");
			$('#searchAddr_input').focus();
			return false;
		} else if ( isEmpty(addr2) ){
			alert("상세주소가 없습니다. 상세주소를 입력해주세요.");
			$('#addrZipAddr2_input').focus();
			return false;
		}
		
		$.ajax({
			url: API_SERVER + '/cns.getCheckJuso.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				console.log("chooseAddrList값",response.dsRecv);
				if( isEmpty(response.dsRecv[0].ZPRNJ) ) {
					// 입력주소
					$('#typedPostNo').val(postNo);
					$('#flexRadioDefault1 > option:selected').val();
				} else {
					var temp = response.dsRecv;
					temp = temp.map(el => {
						return {
							ZPRNJ : el.ZPRNJ,
							ADDRJ : el.ADDRJ,
							ADDRR : el.ADDRR
						};
					});
					_chooseAddrGrid.resetData(temp);
					
					// 입력주소
					$('#typedPostNo').val(response.dsRecv[0].ZPRNJ);
					$('#flexRadioDefault2 > option:selected').val();
				}
				
				// 검증결과
				$('#checkAddr').val(response.dsRecv[0].RMG3);

				// 입력주소
				$('#typedAddr1').val(addr1);
				$('#typedAddr2').val(addr2);

				// 정제된 지번주소
				$('#jibunPostNo').val(response.dsRecv[0].ZPRNJ);
				$('#jibunAddr1').val(response.dsRecv[0].ADDR1Y);
				$('#jibunAddr2').val(response.dsRecv[0].STDADDR);

				
				// 정제된 도로명주소
				$('#doroPostNo').val(response.dsRecv[0].ZPRNR);
				$('#doroAddr1').val(response.dsRecv[0].NADR1S);
				$('#doroAddr2').val(response.dsRecv[0].NADR3S);

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

$('#addrZipAddr2_input').keyup(function(){
    if(event.keyCode == 13){
        $('#searchOrgAddr').trigger('click');
    }
});


/**
 * 빈값 확인
 * @param {빈값확인하는 데이터} data 
 */
function isEmpty(data) {
	if (!data || data == "" || data == undefined || Object.keys(data).length === 0 ) return true;
	else return false;
}

init();
/**
 * 파일명 : POP_CCEMPRO043.js
 * 설  명 : 주소찾기 JS
 * 생성자 : 이재민
 * 작성일 : 2020-12-18
 * 수정일 : 2021-01-11
 */


/**
 * Mode설정
 * @param _mode 
 * 		  = customer        : 고객 주소 찾기 팝업시 / 고객의 정보를 업데이트 해주는 기능 / 사업국 및 센터를 선택하지 않은 경우 주소만 보내준다.
 *        = org             : 상담등록 주소 팝업시  / 사업국의 정보를 찾아주는 기능 / 더블클릭으로 해당 정보 전송
 */
var _mode = "customer";
var _currentUserInfo	// 현재 상담사 정보

if ( opener.name == 'CCEMPRO022' ) {
	_mode ="org";
	_currentUserInfo = opener.currentUser;
} else if ( opener.name.indexOf('app_CCEM_top_bar') > -1 ) {
	_mode="customer";
	_currentUserInfo = opener.currentUserInfo.user;
}

var _addrGrid;
var _orgBcdGrid;
var _orgCenterGrid;
var _chooseAddrGrid;

function init(){
	
	// 모드에 따른 화면 제거
	switch (_mode){
		case "customer" :
			
			break;
		case "org" : 
			$('#rightSide').addClass('d-none');
			$("#leftSide").attr("style","width:100%;padding:16px;");
			window.resizeTo(700,700);
			break;
	}

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
			},
			{
				header: '지역구분',
				name: 'AREA_CDE',
			},
			{
				header: '지역명',
				name: 'AREA_NAME',
			},
			{
				header: '사업국ID',
				name: 'DEPT_ID',
			},
			{
				header: '본부ID',
				name: 'DIV_CDE',
			},
			{
				header: '전화번호',
				name: 'TELNO',
			},
			{
				header: '사업국장사번_hide',
				name: 'DEPT_EMP_ID',
				hidden: true
			},
		],
		
	});

	// 숨김 처리할 컬럼들
	_orgBcdGrid.hideColumn("AREA_CDE"); 
	_orgBcdGrid.hideColumn("AREA_NAME"); 
	_orgBcdGrid.hideColumn("DEPT_ID"); 
	_orgBcdGrid.hideColumn("DIV_CDE"); 
	_orgBcdGrid.hideColumn("TELNO"); 


	_orgBcdGrid.on('click', (ev) => {
		_orgBcdGrid.addSelection(ev);
		_orgBcdGrid.clickSort(ev);
		_orgBcdGrid.clickCheck(ev);
		
		$('#orgBcd_NAME').val(_orgBcdGrid.getFormattedValue(ev.rowKey, "DIV_NAME"));
		$('#orgCenter_NAME').val(_orgBcdGrid.getFormattedValue(ev.rowKey, "DEPT_NAME"));
		$('#orgDetail_NAME').val("");

		$('#AREA_CDE_input').val(_orgBcdGrid.getFormattedValue(ev.rowKey, "AREA_CDE"));
		$('#AREA_NAME_input').val(_orgBcdGrid.getFormattedValue(ev.rowKey, "AREA_NAME"));
		$('#DEPT_ID_input').val(_orgBcdGrid.getFormattedValue(ev.rowKey, "DEPT_ID"));
		$('#DIV_CDE_input').val(_orgBcdGrid.getFormattedValue(ev.rowKey, "DIV_CDE"));
		$('#LC_ID_input').val("");
		$('#TELNO_input').val(_orgBcdGrid.getFormattedValue(ev.rowKey, "TELNO"));
		$('#TELNO_LC_input').val("");
	});

	if ( _mode == "org"){
		_orgBcdGrid.on("dblclick", (ev) => {
			const rowData = _orgBcdGrid.getRow(ev.rowKey);
			// console.log(rowData);
			/**
				AREA_CDE : 	지역구분,
				AREA_NAME : 지역명,
				DIV_NAME : 	본부명,
				DIV_CDE : 	본부ID,
				DEPT_NAME : 사업국명,
				DEPT_ID : 사업국ID,
				TELNO : 사업국전화번호
				ZIP_CNTS : 관할지역내용,
			 */

			var sendRow = {};
			sendRow.LC_ID = "";
			sendRow.LC_EMP_ID = "";
			sendRow.DIV_CDE = rowData.DIV_CDE;
			sendRow.UPDEPTNAME = rowData.DIV_NAME;
			sendRow.AREA_CDE = rowData.AREA_CDE;
			sendRow.AREA_NAME = rowData.AREA_NAME;
			sendRow.DEPT_ID = rowData.DEPT_ID;
			sendRow.DEPT_NAME = rowData.DEPT_NAME;
			sendRow.DEPT_EMP_ID = rowData.DEPT_EMP_ID;
			sendRow.TELPNO_DEPT = rowData.TELNO;
			sendRow.LC_NAME = "";
			sendRow.TELNO_LC = "";
			
			// console.log(sendRow);
			opener.setDisPlayUp(sendRow);
			window.close();
		});
	}
	
	
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
			},
			
			{
				header: '지역구분',
				name: 'AREA_CDE',
			},
			{
				header: '지역명',
				name: 'AREA_NAME',
			},
			{
				header: '사업국ID',
				name: 'DEPT_ID',
			},
			{
				header: '본부ID',
				name: 'DIV_CDE',
			},
			{
				header: '지점ID',
				name: 'LC_ID',
			},
			{
				header: '지점전화번호',
				name: 'TELNO',
			},
			{
				header: 'LC전화번호',
				name: 'TELNO_LC',
			},
			{
				header: '센터장사번_hide',
				name: 'LC_EMP_ID',
				hidden: true
			},
			{
				header: '사업국장사번_hide',
				name: 'DEPT_EMP_ID',
				hidden: true
			},
		],
	});

	// 숨김 처리할 컬럼들
	_orgCenterGrid.hideColumn("AREA_CDE"); 
	_orgCenterGrid.hideColumn("AREA_NAME"); 
	_orgCenterGrid.hideColumn("DEPT_ID"); 
	_orgCenterGrid.hideColumn("DIV_CDE"); 
	_orgCenterGrid.hideColumn("LC_ID"); 
	_orgCenterGrid.hideColumn("TELNO"); 
	_orgCenterGrid.hideColumn("TELNO_LC"); 

	_orgCenterGrid.on('click', (ev) => {
		_orgCenterGrid.addSelection(ev);
		_orgCenterGrid.clickSort(ev);
		_orgCenterGrid.clickCheck(ev);

		$('#orgBcd_NAME').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "DIV_NAME"));
		$('#orgCenter_NAME').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "DEPT_NAME"));
		$('#orgDetail_NAME').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "LC_NAME"));
		$('#AREA_CDE_input').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "AREA_CDE"));
		$('#AREA_NAME_input').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "AREA_NAME"));
		$('#DEPT_ID_input').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "DEPT_ID"));
		$('#DIV_CDE_input').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "DIV_CDE"));
		$('#LC_ID_input').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "LC_ID"));
		$('#TELNO_input').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "TELNO"));
		$('#TELNO_LC_input').val(_orgCenterGrid.getFormattedValue(ev.rowKey, "TELNO_LC"));
    });
	
	if ( _mode == "org"){
		_orgCenterGrid.on("dblclick", (ev) => {
			const rowData = _orgCenterGrid.getRow(ev.rowKey);
			// console.log(rowData);
			/**
			 * 	
				LC_ID : 센터ID,

				DIV_CDE : 	본부ID,
				DIV_NAME : 	본부명,
				AREA_CDE : 	지역구분,
				AREA_NAME : 지역명,
				DEPT_ID : 사업국ID,
				DEPT_NAME : 사업국명,
				TELNO : 사업국전화번호
				LC_NAME : 센터명,
				TELNO_LC : 센터전화번호,
			 */

			var sendRow = {};
			sendRow.LC_ID = rowData.LC_ID;
			sendRow.LC_EMP_ID = rowData.LC_EMP_ID;
			sendRow.DEPT_EMP_ID = rowData.DEPT_EMP_ID;
			sendRow.DIV_CDE = rowData.DIV_CDE;
			sendRow.UPDEPTNAME = rowData.DIV_NAME;
			sendRow.AREA_CDE = rowData.AREA_CDE;
			sendRow.AREA_NAME = rowData.AREA_NAME;
			sendRow.DEPT_ID = rowData.DEPT_ID;
			sendRow.DEPT_NAME = rowData.DEPT_NAME;
			sendRow.TELPNO_DEPT = rowData.TELNO;
			sendRow.LC_NAME = rowData.LC_NAME;
			sendRow.TELPNO_LC = rowData.TELNO_LC;

			// console.log(sendRow);
			opener.setDisPlayUp(sendRow);
			window.close();
		});
	}
	

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

	/* 고객의 상세주소가 있는 경우 자동으로 긁어오기 */
	// console.log( opener.document.getElementById('custInfo_ADDR').value );
	if ( opener.name.indexOf('app_CCEM_top_bar') > -1 && !isEmpty(opener.document.getElementById('custInfo_ADDR').value) ) {
		$('#addrZipAddr2_input').val(opener.document.getElementById('custInfo_ADDR').value);
	} else if ( opener.name == 'CCEMPRO022' && !isEmpty(opener.document.getElementById('textbox4').value) ) {
		$('#searchAddr_input').val(opener.document.getElementById('textbox4').value);
		_searchTable.addrList();
	}
	_styleChanger.resizeWidth();
	_styleChanger.resizeHeight();

	/* 자동으로 포커싱 */
	$('#searchAddr_input').focus();
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
		if( isEmpty($('#searchAddr_input').val()) ) {
			alert("읍면동 또는 도로명을 입력하세요.");
			return false;
		} else if ( $('#searchAddr_input').val().length < 2 ) {
			alert("읍면동 또는 도로명을 2자 이상 입력하세요.");
			return false;
		}
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
			userid : _currentUserInfo.external_id,
			menuname : '주소찾기',
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
				if (response.errcode == '-2') {
					alert("읍면동/도로명 주소 검색 에러 : "+response.errmsg);
					return false;
				} else {
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
				}
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
		// $('#addrZipAddr2_input').val("");
			
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
			userid : _currentUserInfo.external_id,
			menuname : '주소찾기',
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
				if (response.errcode == '-2') {
					alert("사업국 검색 에러 : "+response.errmsg);
					return false;
				} else {
					var temp = response.dsRecv;
					temp = temp.map(el => {
						return {
							DIV_NAME : 	el.DIV_NAME,
							DEPT_NAME : el.DEPT_NAME,
							ZIP_CNTS : el.ZIP_CNTS,
							AREA_CDE : 	el.AREA_CDE,
							AREA_NAME : el.AREA_NAME,
							DEPT_ID : el.DEPT_ID,
							DIV_CDE : 	el.DIV_CDE,
							DEPT_EMP_ID : 	el.DEPT_EMP_ID,
							TELNO : el.TELNO
						};
					});
					_orgBcdGrid.resetData(temp);
				}
			}, error: function (response) {
			}
		});
	},

	centerAddrList(prop){
		// console.log(prop);
		var param = {
			userid : _currentUserInfo.external_id,
			menuname : '주소찾기',
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
				if (response.errcode == '-2') {
					alert("센터 검색 에러 : "+response.errmsg);
					return false;
				} else {
					var temp = response.dsRecv;
					temp = temp.map(el => {
						return {
							DIV_NAME : 	el.DIV_NAME,
							DEPT_NAME : el.DEPT_NAME,
							LC_NAME : el.LC_NAME,
							ZIP_CNTS : el.ZIP_CNTS,
							AREA_CDE : 	el.AREA_CDE,
							AREA_NAME : el.AREA_NAME,
							DEPT_ID : el.DEPT_ID,
							DIV_CDE : 	el.DIV_CDE,
							LC_ID : 	el.LC_ID,
							TELNO : el.TELNO,
							TELNO_LC : el.TELNO_LC,
							LC_EMP_ID : el.LC_EMP_ID,
							DEPT_EMP_ID : el.DEPT_EMP_ID
						};
					});
					_orgCenterGrid.resetData(temp);
				}

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
			userid : _currentUserInfo.external_id,
			menuname : '주소찾기',
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
				// console.log("chooseAddrList값",response.dsRecv);
				if (response.errcode == '-2') {
					alert("주소 검증 에러 : "+response.errmsg);
					return false;
				} else {
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
	
					$('#flexRadioDefault1').prop("checked", true); 
	
					if ( response.dsRecv[0].RMG3 != '새우편번호를 찾지 못한 주소입니다.') {
						// 정제된 지번주소
						$('#jibunPostNo').val(response.dsRecv[0].ZPRNJ);
						$('#jibunAddr1').val(response.dsRecv[0].ADDR1Y);
						$('#jibunAddr2').val(response.dsRecv[0].STDADDR);
						
						// 정제된 도로명주소
						$('#doroPostNo').val(response.dsRecv[0].ZPRNR);
						$('#doroAddr1').val(response.dsRecv[0].NADR1S);
						$('#doroAddr2').val(response.dsRecv[0].NADR3S);
	
						// 에러문구가 없다면, 2번째 선택
						$('#flexRadioDefault2').prop("checked", true); 
					}
				}

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

/**
 * sendAddr()
 */
function sendAddr() {
	if ( $('#flexRadioDefault1').prop("checked")!=true && $('#flexRadioDefault2').prop("checked")!=true && $('#flexRadioDefault3').prop("checked")!=true ) {
		alert("선택된 주소가 없습니다.");
		return false;
	}

	var temp = {};
	var responseData = {};
	if ( $('#flexRadioDefault1').prop("checked")==true ) {
		temp.POST_NO = $('#typedPostNo').val();
		temp.ADDR_MAIN = $('#typedAddr1').val();
		temp.ADDR_SUB = $('#typedAddr2').val();
	} else if ( $('#flexRadioDefault2').prop("checked")==true ) {
		temp.POST_NO = $('#jibunPostNo').val();
		temp.ADDR_MAIN = $('#jibunAddr1').val();
		temp.ADDR_SUB = $('#jibunAddr2').val();
	} else if ( $('#flexRadioDefault3').prop("checked")==true ) {
		temp.POST_NO = $('#doroPostNo').val();
		temp.ADDR_MAIN = $('#doroAddr1').val();
		temp.ADDR_SUB = $('#doroAddr2').val();
	}
	responseData.ADDR = temp;
	temp = {};
	temp.DIV_NAME =	$('#orgBcd_NAME').val();
	temp.DEPT_NAME = $('#orgCenter_NAME').val();
	temp.LC_NAME = $('#orgDetail_NAME').val();
	temp.AREA_CDE = $('#AREA_CDE_input').val();
	temp.AREA_NAME = $('#AREA_NAME_input').val();
	temp.DEPT_ID = $('#DEPT_ID_input').val();
	temp.DIV_CDE = $('#DIV_CDE_input').val();
	temp.LC_ID = $('#LC_ID_input').val();
	temp.TELNO = $('#TELNO_input').val();
	temp.TELNO_LC =	$('#TELNO_LC_input').val();
	responseData.org = temp;

	/**
	 * 전송할 데이터
	 * @param org    : 선택한 본부/사업국/지점 정보
	 * @param ADDR : 선택한 주소 정보 
	 */
	// console.log("CCEMPRO043 전송 데이터 >> ",responseData);
	
	// 주소정보 업데이트
	opener.document.getElementById("custInfo_ZIPCDE").value = responseData.ADDR.POST_NO;
	opener.document.getElementById("custInfo_ZIP_ADDR").value = responseData.ADDR.ADDR_MAIN;
	opener.document.getElementById("custInfo_ADDR").value = responseData.ADDR.ADDR_SUB;

	opener.document.getElementById("custInfo_UPDEPTNAME").value = responseData.org.DIV_NAME
	opener.document.getElementById("custInfo_DEPT_ID").value = responseData.org.DEPT_ID
	opener.document.getElementById("custInfo_DEPT_NAME").value = responseData.org.DEPT_NAME
	opener.document.getElementById("custInfo_TELPNO_DEPT").value = responseData.org.TELNO
	opener.document.getElementById("custInfo_LC_NAME").value = responseData.org.LC_NAME
	opener.document.getElementById("custInfo_TELPNO_LC").value = responseData.org.TELNO_LC
	opener.document.getElementById("custInfo_LC_ID").value = responseData.org.LC_ID

	window.close();
}

init();
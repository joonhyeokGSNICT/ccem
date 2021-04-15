/**
 * 전역변수
 */

var employeeListGrid; 	// 구성원 그리드
var tree;				// 트리구성표

var _tchrMkCDEList;		// 통합코드 TCHR_MK_CDE : 선생님 직책리스트 - 그리드 내 코드 직책 변환
var _currentUserInfo	// 현재 상담사 정보
var _codeData;			// 전체코드정보

var _closedOrgList; 	// 폐쇄기관 포함된 조직 리스트
var _openOrgList;		// 오픈한 조직 리스트(폐쇄 제외)

var _selectedNode;		// 현재 트리에 선택된 값(선택된 값이 정보로 표기)
var _searchedEmpList;	// 검색한 조직원 리스트(조회 후 트리에 맞게 표기)

var _isChange; 			// 트리구조 내 리스트 변경여부 (기준 폐쇄기관의 체크 변경 확인)
var _isEmpSearch; 		// 구성원 검색 시 (Ajax통신 사용)
var _isSave;			// 사업국 저장시, 해당 트리로 바로 이동하기 위한 변수
var _isFirst = true;	// 첫 진입 여부 확인

var _topWindow;		// topBar window위치값

let hash = window.location.hash; // 구분처리


/**
 * Mode설정
 * @param _mode 
 * 		  = chkTree         : 트리구조 체크 / 구성원 검색 X / 구성원 체크 X / 선택시 조직  리스트 전송 / 조직관할구역 저장 X / 웹설문 페이지에서 활용
 *        = plainTree       : 트리구조 일반 / 구성원 검색 O / 구성원 체크 O / 선택시 구성원리스트 전달 / 조직관할구역 저장 X / 현장, 상담, 소개연계 페이지에서 활용
 *        = plainTreeNoEmp  : 트리구조 일반 / 구성원 검색 X / 구성원 체크 X / 선택 버튼 X             / 조직관할구역 저장 X / 조직관할구역 페이지 활용
 *        = plainTreeSelOrg : 트리구조 일반 / 구성원 검색 X / 구성원 체크 X / 선택 버튼 O             / 조직관할구역 저장 X / 본부/사업국/센터 선택시
 *        = search          : 트리구조 일반 / 구성원 검색 O / 구성원 체크 X / 선택 버튼 X             / 조직관할구역 저장 O / 탑바에서 본부/사업국/센터 페이지
 *
 * @param opener.name 진입 부모창의 이름에 따라 모드가 변경됨
 * ======== 진입구분 ========
 * CCEMPRO022 : [팝업] 상담등록 
 * 	1. #disPlayUp & #disPlayUpDown : 사업국/센터 찾기
 * 	2. #disPlayDn : 연계부서 찾기
 * CCEMPRO028 : [팝업] 상담연계 
 * CCEMPRO031 : [팝업] 입회등록
 * CCEMPRO032 : [팝업] 선생님소개
 * CCEMPRO022 : 
 * app_CCEM_~ : 탑바(메인화면)
 * 	1. #menu : 상단 메뉴
 * 	2. #info : 유저정보
 */

// console.log(opener.name+' / '+ hash);
// .wiseNTalkUtil.saveWindowObj(window)

var _mode = "plainTree";
if ( opener.name == 'CCEMPRO022' ) {
	if (hash =="#disPlayUp" || hash =="#disPlayUpDown" ) _mode ="plainTreeSelOrg";
	else if (hash =="#disPlayDn") _mode ="plainTree";
	_topWindow = opener.topbarObject;
	_currentUserInfo = opener.currentUser;
	_codeData = opener.codeData;
}
else if ( opener.name == 'CCEMPRO028' ) {
	_mode ="plainTree";
	_topWindow = opener.opener.topbarObject;
	_currentUserInfo = opener.opener.currentUser;
	_codeData = opener.opener.codeData;
}
else if ( opener.name == 'CCEMPRO031' || opener.name == 'CCEMPRO032' ) {
	_mode ="plainTreeSelOrg";
	_topWindow = opener.topbarObject;
	_currentUserInfo = opener.currentUser;
	_codeData = opener.codeData;
}
else if ( opener.name.indexOf('app_CCEM_top_bar') > -1) {
	if (hash == "#menu" ) _mode="search";
	else if (hash =="#info")  _mode="plainTreeSelOrg"; 
	_topWindow = opener;
	_currentUserInfo = opener.currentUserInfo.user;
	_codeData = opener.codeData;
}
_topWindow.wiseNTalkUtil.saveWindowObj(window)

console.log(_mode);

var _modeSelect = {
	chkTree : {
		treeCheckBox : true,
		rowHeaders : [{ type: 'rowNum', header: "NO", }],
	},
	plainTree : {
		treeCheckBox : false,
		rowHeaders : [{ type: 'checkbox', header: "", minWidth: 30, },{ type: 'rowNum', header: "NO", }],
	},
	plainTreeNoEmp : {
		treeCheckBox : false,
		rowHeaders : [{ type: 'rowNum', header: "NO", }],
	},
	plainTreeSelOrg : {
		treeCheckBox : false,
		rowHeaders : [{ type: 'rowNum', header: "NO", }],
	},
	search : {
		treeCheckBox : false,
		rowHeaders : [{ type: 'rowNum', header: "NO", }],
	},
}

/**
 * init 
 * 화면 구성 후 초기화 작업
 */
function init(){
	setGridTree();	// orgGrid.js 내의 setGridTree() 실행

	$("input[name=searchType]").change(function(){
		var selectedSearch = $(this).attr("id");
		if(selectedSearch == "memSearch"){
			$("#memberSearchRadio").css("display","");
			$("#deptSearchRadio").css("display","none");
		}else {
			$("#memberSearchRadio").css("display","none");
			$("#deptSearchRadio").css("display","");
		}
	});

	_getList.orgList();
	_getList.tchrMkCDEList();
	
	// 모드에 따른 화면 제거
	switch (_mode){
		case "chkTree" :
			$("#memSearch").closest('div').addClass('d-none');
			$("#employee").closest('li').addClass('d-none');
			$("#searchEmp_chk").closest('div').addClass('d-none');
			$("#searchEmp_selectbox").closest('div').addClass('d-none');

			// 상단 검색 UI변경
			$("#searchBox").children().eq(0).attr("style","width:14%")
			$("#searchBox").children().eq(1).attr("style","width:11%")
			$("#searchBox").children().eq(2).attr("style","width:61%")
			$("#searchBox").children().eq(3).attr("style","width:14%")
			break;
		case "plainTree" : 
			$("#counselSel_btn").addClass('invisible');
			$("#counselDeSel_btn").addClass('invisible');
			$("#counselSend_btn").addClass('invisible');
			break;
		case "plainTreeNoEmp" :
			$("#counselSel_btn").addClass('invisible');
			$("#counselDeSel_btn").addClass('invisible');
			$("#counselSend_btn").addClass('d-none');
			$("#counselClose_btn").addClass('d-none');
			$("#counselSave_btn").attr("style","float:right; margin:0px 1rem 0px 0px;");
			$("#memSearch").closest('div').addClass('d-none');
			$("#employee").closest('li').addClass('d-none');
			$("#searchEmp_chk").closest('div').addClass('d-none');
			$("#searchEmp_selectbox").closest('div').addClass('d-none');

			// 상단 검색 UI변경
			$("#searchBox").children().eq(0).attr("style","width:14%")
			$("#searchBox").children().eq(1).attr("style","width:11%")
			$("#searchBox").children().eq(2).attr("style","width:61%")
			$("#searchBox").children().eq(3).attr("style","width:14%")
			break;
		case "plainTreeSelOrg" :
			$("#counselSel_btn").addClass('invisible');
			$("#counselDeSel_btn").addClass('invisible');
			$("#counselSave_btn").addClass('d-none');
			// $("#counselSend_btn").addClass('invisible');
			$("#memSearch").closest('div').addClass('d-none');
			$("#employee").closest('li').addClass('d-none');
			$("#searchEmp_chk").closest('div').addClass('d-none');
			$("#searchEmp_selectbox").closest('div').addClass('d-none');

			// 상단 검색 UI변경
			$("#searchBox").children().eq(0).attr("style","width:14%")
			$("#searchBox").children().eq(1).attr("style","width:11%")
			$("#searchBox").children().eq(2).attr("style","width:61%")
			$("#searchBox").children().eq(3).attr("style","width:14%")
			break;
		case "search" :
			$("#counselSel_btn").addClass('invisible');
			$("#counselDeSel_btn").addClass('invisible');
			$("#counselSend_btn").addClass('invisible');
			$("#counselSend_btn").addClass('d-none');
			$("#counselSave_btn").removeClass('invisible');
			break;
	}
}


/**
 * wiseNtalk 연동
 */
// 탭 이동시, employeeListGrid가 refresh되어 표의 틀어짐 방지
$("#button12").on("click", function(e) {
	if (! isEmpty($('#PHONE').val()) ) {
		if ( $(this).hasClass('callOn') ) {
			_topWindow.wiseNTalkUtil.callStart('callOn', $('#PHONE').val());
		} else if ( $(this).hasClass('callOff') ) {
			_topWindow.wiseNTalkUtil.callStart('callOff', $('#PHONE').val());
		}
	} else {
		alert("전화번호가 없습니다.\n: 트리에서 본부/사업국/센터를 선택해주세요.");
		return;
	}
		// _topWindow.wiseNTalkUtil.callStart(window)
});


/**
 * API 조회
 */
const _getList = {

	// 본부/사업국/센터 찾기 전체리스트 가져오기
	orgList(){
		var param = {
			userid : _currentUserInfo.external_id,
			menuname : '사업국/센터/구성원',
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ACTIVE_FLAG:"Y"}]
		};
		
		$.ajax({
			url: API_SERVER + '/sys.getDeptLcList.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				// console.log("orgList값 >> ",response.dsRecv);
				var templist = response.dsRecv;
				for(index in templist) {
					templist[index].title = templist[index].DEPT_NAME;
					templist[index].key = templist[index].DEPT_ID;
				}
				_openOrgList = templist;
				_sortList.orgList(templist);
				_isChange = false;
			}, error: function (response) {
			}
		});

		param = {
			userid : _currentUserInfo.external_id,
			menuname : '사업국/센터/구성원',
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ACTIVE_FLAG:"N"}]
		};
		
		$.ajax({
			url: API_SERVER + '/sys.getDeptLcList.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				// console.log("orgList값 >> ",response.dsRecv);
				var templist = response.dsRecv;
				for(index in templist) {
					templist[index].title = templist[index].DEPT_NAME;
					templist[index].key = templist[index].DEPT_ID;
				}
				_closedOrgList = templist;
			}, error: function (response) {
			}
		});
	},

	// 지점 내 구성원 목록 가져오기
	employeeList(dsSend){
		var param = {
			userid : _currentUserInfo.external_id,
			menuname : '사업국/센터/구성원',
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: dsSend
		};

		$.ajax({
			url: API_SERVER + '/sys.getEmployeeList.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				// console.log("employeeList >> ",response.dsRecv);
				_sortList.searchedEmpList(response.dsRecv);
			}, error: function (response) {
			}
		});
	},

	// 교사구분코드
	tchrMkCDEList(){
		var CODE_MK_LIST = ["TCHR_MK_CDE"];
		_tchrMkCDEList = _codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));
	},

	// 관할주소 목록 가져오기
	boundAddrList : function(addr) {
		return new Promise(function(resolve, reject){

			var isYN ;
			if ( $('#includeClosed').prop("checked")==true ) isYN = 'N'; 
			else isYN = 'Y';
			
			var param = {
				userid : _currentUserInfo.external_id,
				menuname : '사업국/센터/구성원',
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{ACTIVE_FLAG:isYN, SEARCH_AREA:"Y", SEARCH_AREA_TXT: addr}]
			};

			$.ajax({
				url: API_SERVER + '/sys.getDeptLcList.do',
				type: 'POST',
				dataType: 'json',
				contentType: "application/json",
				data: JSON.stringify(param),
				success: function (response) {
					// console.log("boundAddrList >> ",response.dsRecv);
					resolve(response.dsRecv);
				}, error: function (response) {
				}
			});
		});
	},

	saveZIPCNTS(prop) {
		return new Promise(function(resolve, reject){
			var param = {
				userid : _currentUserInfo.external_id,
				menuname : '사업국/센터/구성원',
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: prop
			};

			$.ajax({
				url: API_SERVER + '/sys.saveDeptLcCNT.do',
				type: 'POST',
				dataType: 'json',
				contentType: "application/json",
				data: JSON.stringify(param),
				success: function (response) {
					// console.log("saveZIPCNTS >> ");
					resolve();
				}, error: function (response) {
				}
			});
		});
	},

}

/**
 * _sortList
 */
const _sortList = {

	/**
	 * 트리구조 필드 데이터 정렬
	 * @param {*} templist : 본부/사업국/센터 리스트
	 */
	orgList(templist){
		var lv1List = templist.filter(data => data.LV == "1" ); // 본부/본사리스트
		var lv2List = templist.filter(data => data.LV == "2" ); // 사업국/부서리스트
		var lv3List = templist.filter(data => data.LV == "3" ); // 센터/팀 리스트
		var lv4List = templist.filter(data => data.LV == "4" ); // CEO(본사)내 부서리스트

		for(index in lv3List){
			var tempLv4List = lv4List.filter(data=> data.UP_DEPT == lv3List[index].DEPT_ID);
			lv3List[index].children = tempLv4List;
			lv3List[index].folder = true;
		}

		for(index in lv2List){
			var tempLv3List = lv3List.filter(data=> data.UP_DEPT == lv2List[index].DEPT_ID);
			lv2List[index].children = tempLv3List;
			lv2List[index].folder = true;
		}

		for(index in lv1List) {
			var tempLv2List = lv2List.filter(data=> data.UP_DEPT == lv1List[index].DEPT_ID);
			lv1List[index].children = tempLv2List;
			lv1List[index].folder = true;
		}

		// 트리구조 삽입		
		tree.reload(lv1List);

		// 사업국 저장 후 선택한 노드 바로가기
		if ( _isSave == true ) {
			_isSave = false;
			console.log(_selectedNode);
			tree.getNodeByKey(_selectedNode.key).setActive();
		} else if ( _isFirst == true ) {
			/* 첫 화면 진입에 따른 검색 조건 설정 */
				/* 1. 회원 기본정보 조직 설정 검색 */
				if ( opener.name.indexOf('app_CCEM_top_bar') > -1 && hash =="#info" ) {
					var textVal = opener.document.getElementById('custInfo_LC_NAME').value;
					if(! isEmpty(textVal) ) $('#searchOrg_txt').val(textVal);
					else $('#searchOrg_txt').val(opener.document.getElementById('custInfo_DEPT_NAME').value);
					_btn.searchOrg();
				}

				/* 2. 상담등록 사업국/센터 선택 검색 */
				if ( opener.name.indexOf('CCEMPRO022') > -1 && hash =="#disPlayUp" ) {
					$('#searchOrg_txt').val(opener.document.getElementById('textbox6').value);
					_btn.searchOrg();
				} else if ( opener.name.indexOf('CCEMPRO022') > -1 && hash =="#disPlayUpDown" ) {
					$('#searchOrg_txt').val(opener.document.getElementById('textbox9').value);
					_btn.searchOrg();
				}

				/* 3. 상담등록 연계부서 검색 */
				if ( opener.name.indexOf('CCEMPRO022') > -1 && hash =="#disPlayDn" ) {
					var textVal = opener.document.getElementById('textbox26').value;
					if(! isEmpty(textVal) ) {
						$('#searchOrg_txt').val(textVal);
						_btn.searchOrg();
					}
				}
				
				/* 4. 상담연계 검색 */
				if ( opener.name.indexOf('CCEMPRO028') > -1) {
					var textVal = opener.document.getElementById('textbox10').value;
					if(! isEmpty(textVal) ) {
						$('#searchOrg_txt').val(textVal);
						_btn.searchOrg();
					}
				}

				/* 5. 입회등록 검색 */
				if ( opener.name.indexOf('CCEMPRO031') > -1) {
					var textVal = opener.document.getElementById('textbox15').value;
					if(! isEmpty(textVal) ) $('#searchOrg_txt').val(textVal);
					else $('#searchOrg_txt').val(opener.document.getElementById('textbox13').value);
					_btn.searchOrg();
				}
			_isFirst = false;
		}
	},

	/**
	 * 조회된 구성원 리스트 트리구조 클릭시 그리드 필터
	 * @param {*} title : 해당 조직의 이름(DEPT_NAME)
	 */
	selTreeEmpList(title){
		var temp = _searchedEmpList.filter(list => list.ORG_NAME == title );
		if (! isEmpty(temp)){
			var tempGrid = temp.map(el => {
				return {
					NAME : 	el.NAME,
					EMP_ID : el.EMP_ID,
					UP_DEPT_NAME : el.UP_DEPT_NAME,
					PARE_DEPT_NAME : el.PARE_DEPT_NAME,
					DEPT_NAME : el.DEPT_NAME,
					DUTY_NAME : el.DUTY_NAME,
					RANK_NAME : el.RANK_NAME,
					TCHR_MK_NAME : el.TCHR_MK_NAME,
					MOBILNO : el.MOBILNO,
					STS_NAME : el.STS_NAME,
					ZEN_USE_YN : el.ZEN_USE_YN,
					// 앱연계대상 스타일 적용
					_attributes: el.ZEN_USE_YN != 'Y' ? {} : {
						className: {
							column: { 
								NAME:['col_row'],
								EMP_ID:['col_row'], 
								UP_DEPT_NAME:['col_row'], 
								PARE_DEPT_NAME:['col_row'], 
								DEPT_NAME:['col_row'], 
								DUTY_NAME:['col_row'], 
								RANK_NAME:['col_row'], 
								TCHR_MK_NAME:['col_row'], 
								MOBILNO:['col_row'], 
								STS_NAME:['col_row'],  
								ZEN_USE_YN:['col_row'],
							} 
						} 
					}
				};
			});
			employeeListGrid.resetData(tempGrid);
		} else {
			employeeListGrid.resetData([]);
		}
	},

	/**
	 * 트리구조 클릭시 그리드 필터
	 * @param {*} respondeData : 해당 조직의 이름(DEPT_NAME)
	 */
	searchedEmpList(respondeData) {
		/**
		 * 처음 화면 진입 시 오픈된 기관만 검색
		 * _isChange 
		 *         : false = 폐쇄기관포함 미체크됨
		 *         : true  = 폐쇄기관포함 체크됨
		 */
		var treeData = [];
		if ( $('#includeClosed').prop("checked")==true ) {
			treeData = _closedOrgList;
			if ( _isChange == false ) {
				_sortList.orgList(treeData);
				_isChange = true;
			}
		} else {
			treeData = _openOrgList;
			if ( _isChange == true ) {
				_sortList.orgList(treeData);
				_isChange = false;
			}
		}

		// console.log(respondeData);
		var temp = respondeData;
		for ( index in temp ){
			// 구성원의 교사구분 처리
			if (! isEmpty(_tchrMkCDEList.filter(data => data.CODE_ID == temp[index].TCHR_MK_CDE)) ) {
				temp[index].TCHR_MK_NAME = _tchrMkCDEList.filter(data => data.CODE_ID == temp[index].TCHR_MK_CDE)[0].CODE_NAME;
			}

			// 검색하려는 사람의 본부/사업국/센터명 및 ID 처리
			if ( temp[index].LV == '1' ) {//본부
				var chk_name = treeData.filter(data => data.LV == '1' );
				chk_name = chk_name.filter(data => data.DEPT_ID == temp[index].DEPT_ID);
				if(chk_name.length > 0) {
					temp[index].ORG_NAME = chk_name[0].DEPT_NAME;
					temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
					temp[index].UP_DEPT_ID = temp[index].DEPT_ID;
					temp[index].PARE_DEPT_NAME = "-";
					temp[index].DEPT_NAME = "-";
				}
			} else if (temp[index].LV == '2') {//사업국
				var chk_name = treeData.filter(data => data.LV == '2' );
				chk_name = chk_name.filter(data => data.DEPT_ID == temp[index].DEPT_ID);
				if(chk_name.length > 0) {
					// 1레벨이 CEO인 경우
					if ( chk_name[0].UP_DEPT == "T000") {
						temp[index].ORG_NAME = chk_name[0].DEPT_NAME;
						temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
						temp[index].UP_DEPT_ID = temp[index].DEPT_ID;
						temp[index].PARE_DEPT_NAME = "-";
						temp[index].DEPT_NAME = "-";
					} 
					// 아닌경우 (사업국/센터)
					else {
						temp[index].ORG_NAME = chk_name[0].DEPT_NAME;
						temp[index].PARE_DEPT_NAME = chk_name[0].DEPT_NAME;
						temp[index].PARE_DEPT_ID = temp[index].DEPT_ID;
							
						var UP_DEPT_ID = chk_name[0].UP_DEPT;
						chk_name = treeData.filter(data => data.LV == '1' );
						chk_name = chk_name.filter(data => data.DEPT_ID == UP_DEPT_ID);
						if(chk_name.length > 0) temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
						temp[index].UP_DEPT_ID = UP_DEPT_ID;
						temp[index].DEPT_NAME = "-";
					}

				}
				
			} else if (temp[index].LV == '3') {//센터
				var chk_name = treeData.filter(data => data.LV == '3' );
					chk_name = chk_name.filter(data => data.DEPT_ID == temp[index].DEPT_ID);
				
				if(chk_name.length > 0) {
					var temp_chk_name = treeData.filter(data => data.LV == '2' );
						temp_chk_name = temp_chk_name.filter(data => data.DEPT_ID == chk_name[0].UP_DEPT);
					// 1레벨이 CEO인 경우
					if ( temp_chk_name.length > 0 && temp_chk_name[0].UP_DEPT == "T000") {
						temp[index].ORG_NAME = chk_name[0].DEPT_NAME;
						temp[index].PARE_DEPT_NAME = chk_name[0].DEPT_NAME;
						temp[index].PARE_DEPT_ID = temp[index].DEPT_ID;
							
						var UP_DEPT_ID = chk_name[0].UP_DEPT;
						chk_name = treeData.filter(data => data.LV == '2' );
						chk_name = chk_name.filter(data => data.DEPT_ID == UP_DEPT_ID);
						if(chk_name.length > 0) temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
						temp[index].UP_DEPT_ID = UP_DEPT_ID;
						temp[index].DEPT_NAME = "-";
					// 아닌경우 (사업국/센터)
					} else {
						temp[index].ORG_NAME = chk_name[0].DEPT_NAME;
						temp[index].DEPT_NAME = chk_name[0].DEPT_NAME;
	
						var PARE_DEPT_ID = chk_name[0].UP_DEPT;
						var UP_DEPT_ID
						temp[index].PARE_DEPT_ID = PARE_DEPT_ID;
						
						chk_name = treeData.filter(data => data.LV == '2' );
						chk_name = chk_name.filter(data => data.DEPT_ID == PARE_DEPT_ID);
						
						if(chk_name.length > 0) {
							temp[index].PARE_DEPT_NAME = chk_name[0].DEPT_NAME;
							UP_DEPT_ID = chk_name[0].UP_DEPT;
							
							chk_name = treeData.filter(data => data.LV == '1' );
							chk_name = chk_name.filter(data => data.DEPT_ID == UP_DEPT_ID);
							if(chk_name.length > 0) temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
							temp[index].UP_DEPT_ID = UP_DEPT_ID;
						}
					}

				}
			} else if (temp[index].LV == '4') {//센터
				var chk_name = treeData.filter(data => data.LV == '4' );
				chk_name = chk_name.filter(data => data.DEPT_ID == temp[index].DEPT_ID);
				
				if(chk_name.length > 0) {
					temp[index].ORG_NAME = chk_name[0].DEPT_NAME;
					temp[index].DEPT_NAME = chk_name[0].DEPT_NAME;

					var PARE_DEPT_ID = chk_name[0].UP_DEPT;
					var UP_DEPT_ID
					temp[index].PARE_DEPT_ID = PARE_DEPT_ID;
					
					chk_name = treeData.filter(data => data.LV == '3' );
					chk_name = chk_name.filter(data => data.DEPT_ID == PARE_DEPT_ID);
					
					if(chk_name.length > 0) {
						temp[index].PARE_DEPT_NAME = chk_name[0].DEPT_NAME;
						UP_DEPT_ID = chk_name[0].UP_DEPT;
						
						chk_name = treeData.filter(data => data.LV == '2' );
						chk_name = chk_name.filter(data => data.DEPT_ID == UP_DEPT_ID);
						if(chk_name.length > 0) temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
						temp[index].UP_DEPT_ID = UP_DEPT_ID;
					}
				}
			} else if (temp[index].LV == null) { // 레벨구분이 없는 경우
				temp[index].UP_DEPT_ID = temp[index].DEPT_ID;
				temp[index].UP_DEPT_NAME = temp[index].DEPT_NAME;
				temp[index].PARE_DEPT_ID = '-';
				temp[index].PARE_DEPT_NAME = '-';
				temp[index].DEPT_ID = '-';
				temp[index].DEPT_NAME = '-';
			}
		}

		// 그리드에 내용 입력
		_searchedEmpList = temp;
		if (! isEmpty(temp)){
			var tempGrid = temp.map(el => {
				return {
					NAME : 	el.NAME,
					EMP_ID : el.EMP_ID,
					UP_DEPT_NAME : el.UP_DEPT_NAME,
					PARE_DEPT_NAME : el.PARE_DEPT_NAME,
					DEPT_NAME : el.DEPT_NAME,
					DUTY_NAME : el.DUTY_NAME,
					RANK_NAME : el.RANK_NAME,
					TCHR_MK_NAME : el.TCHR_MK_NAME,
					MOBILNO : el.MOBILNO,
					STS_NAME : el.STS_NAME,
					UP_DEPT_ID : el.UP_DEPT_ID,
					PARE_DEPT_ID : el.PARE_DEPT_ID,
					DEPT_ID : el.DEPT_ID,
					ZEN_USE_YN : el.ZEN_USE_YN,
					// 앱연계대상 스타일 적용
					_attributes: el.ZEN_USE_YN != 'Y' ? {} : {
						className: {
							column: { 
								NAME:['col_row'],
								EMP_ID:['col_row'], 
								UP_DEPT_NAME:['col_row'], 
								PARE_DEPT_NAME:['col_row'], 
								DEPT_NAME:['col_row'], 
								DUTY_NAME:['col_row'], 
								RANK_NAME:['col_row'], 
								TCHR_MK_NAME:['col_row'], 
								MOBILNO:['col_row'], 
								STS_NAME:['col_row'],  
								ZEN_USE_YN:['col_row'],
							} 
						} 
					}
				};
			});
			employeeListGrid.resetData(tempGrid);

			// 사업국장 자동 체크
			if (! _isEmpSearch) {
				var REP_EMP_ID = _selectedNode.data.REP_EMP_ID;
				var tempRow = employeeListGrid.findRows((row) => {
					return ( row.EMP_ID == REP_EMP_ID );
				});
				if (tempRow.length > 0) employeeListGrid.check(tempRow[0].rowKey);
			}

			// 첫 대상자 사업국 자동선택
			if(tempGrid.length == 1) {
				// tempGrid.sort(function(a, b) {
				// 	var nameA = a.UP_DEPT_ID.toUpperCase(); // ignore upper and lowercase
				// 	var nameB = b.UP_DEPT_ID.toUpperCase(); // ignore upper and lowercase
				// 	if (nameA < nameB) return 1;
				// 	if (nameA > nameB) return -1;
				// 	return 0;
				// });
				// console.log(tempGrid)
				var checkId = '';
				if (! isEmpty(tempGrid[0].DEPT_ID) ) checkId = tempGrid[0].DEPT_ID
				else if (! isEmpty(tempGrid[0].PARE_DEPT_ID) ) checkId = tempGrid[0].PARE_DEPT_ID
				else checkId = tempGrid[0].UP_DEPT_ID
				tree.getNodeByKey(checkId).setActive();
			}
		} else {
			employeeListGrid.resetData([]);
		}

		// 구성원 검색 시 : 트리구조 필터 적용
		if (_isEmpSearch) {
			var nameTempList = removeDuplicates(temp, "ORG_NAME");
			// console.log(nameTempList);
			var code = '';
			for ( index in nameTempList ) {
				if ( nameTempList[index].LV == "1" ){
					code += 'node.data.DEPT_NAME.indexOf(\''+nameTempList[index].ORG_NAME+'\') > -1 && node.data.LV == \'1\'  || ';
				} else if ( temp[index].LV == "2" ){
					code += 'node.data.DEPT_NAME.indexOf(\''+nameTempList[index].ORG_NAME+'\') > -1 && node.data.LV == \'2\'  || ';
				} else if ( temp[index].LV == "3" ){
					code += 'node.data.DEPT_NAME.indexOf(\''+nameTempList[index].ORG_NAME+'\') > -1 && node.data.LV == \'3\'  || ';
				} else if ( temp[index].LV == "4" ){
					code += 'node.data.DEPT_NAME.indexOf(\''+nameTempList[index].ORG_NAME+'\') > -1 && node.data.LV == \'4\'  || ';
				}
			}
			code = code.slice(0,-3);
			var attr = {mode:"hide", autoExpand : true, leavesOnly: false};
			
			// _openOrgList.filter(data => data.DEPT_NAME == '3' );

			console.log(code);
			tree.filterNodes( 
				function(node) {
					if ( !isEmpty(node.data.DEPT_NAME) ) {
							return eval(code);
					}
				}, attr
			);
			if ( $('#memSearch').prop("checked")==true ) $('#employee').click();
		}
	}
}

/**
 * _btn
 */
const _btn = {
	// deselectAll() : 트리에서 선택된 본부/사업국/센터를 전체 해제
	deselectAll(){
		var node = tree.getSelectedNodes();
		for (index in node) {
			if (isEmpty(node[index].children)) {
				node[index].setSelected( !node[index].isSelected() );
			}
		}
	},
	// deselectAll() : 트리내 본부/사업국/센터를 전체선택
	selectAll(){
		var node = tree.getRootNode().children;
		for (index in node) {
			node[index].setSelected();
		}
	},

	// selectedList() : 
	selectedList(){
		if ( _mode == "chkTree" ) {
			var nodes = tree.getSelectedNodes();
			var tempList = [];
			for ( index in nodes ) {
				var orgList = {};
				if ( nodes[index].data.LV =="4" ) {
					orgList.BRAND_ID = nodes[index].data.BRAND_ID;
					orgList.BRAND_NAME = nodes[index].data.BRAND_NAME;
					orgList.UP_DEPT_ID = nodes[index].parent.parent.data.DEPT_ID;
					orgList.UP_DEPT_NAME = nodes[index].parent.parent.data.DEPT_NAME;
					orgList.UP_DEPT_TEL = nodes[index].parent.parent.data.TELPNO;
					orgList.PARE_DEPT_ID = nodes[index].parent.data.DEPT_ID;
					orgList.PARE_DEPT_NAME = nodes[index].parent.data.DEPT_NAME;
					orgList.PARE_DEPT_TEL = nodes[index].parent.data.TELPNO;
					orgList.LC_DEPT_ID = nodes[index].data.DEPT_ID;
					orgList.LC_DEPT_NAME = nodes[index].data.DEPT_NAME;
					orgList.LC_DEPT_TEL = nodes[index].data.TELPNO;
					orgList.LV = nodes[index].data.LV;
					orgList.AREA_CDE = nodes[index].data.AREA_CDE;
					orgList.AREA_NAME = nodes[index].data.AREA_NAME;
					orgList.REP_EMP_ID = nodes[index].data.REP_EMP_ID;
					orgList.REP_EMP_NAME = nodes[index].data.REP_EMP_NAME;
				} else if ( nodes[index].data.LV =="3" ) {
					orgList.BRAND_ID = nodes[index].data.BRAND_ID;
					orgList.BRAND_NAME = nodes[index].data.BRAND_NAME;
					orgList.UP_DEPT_ID = nodes[index].parent.parent.data.DEPT_ID;
					orgList.UP_DEPT_NAME = nodes[index].parent.parent.data.DEPT_NAME;
					orgList.UP_DEPT_TEL = nodes[index].parent.parent.data.TELPNO;
					orgList.PARE_DEPT_ID = nodes[index].parent.data.DEPT_ID;
					orgList.PARE_DEPT_NAME = nodes[index].parent.data.DEPT_NAME;
					orgList.PARE_DEPT_TEL = nodes[index].parent.data.TELPNO;
					orgList.LC_DEPT_ID = nodes[index].data.DEPT_ID;
					orgList.LC_DEPT_NAME = nodes[index].data.DEPT_NAME;
					orgList.LC_DEPT_TEL = nodes[index].data.TELPNO;
					orgList.LV = nodes[index].data.LV;
					orgList.AREA_CDE = nodes[index].data.AREA_CDE;
					orgList.AREA_NAME = nodes[index].data.AREA_NAME;
					orgList.REP_EMP_ID = nodes[index].data.REP_EMP_ID;
					orgList.REP_EMP_NAME = nodes[index].data.REP_EMP_NAME;
				} else if ( nodes[index].data.LV =="2" ) {
					orgList.BRAND_ID = nodes[index].data.BRAND_ID;
					orgList.BRAND_NAME = nodes[index].data.BRAND_NAME;
					orgList.UP_DEPT_ID = nodes[index].parent.data.DEPT_ID;
					orgList.UP_DEPT_NAME = nodes[index].parent.data.DEPT_NAME;
					orgList.UP_DEPT_TEL = nodes[index].parent.data.TELPNO;
					orgList.PARE_DEPT_ID = nodes[index].data.DEPT_ID;
					orgList.PARE_DEPT_NAME = nodes[index].data.DEPT_NAME;
					orgList.PARE_DEPT_TEL = nodes[index].data.TELPNO;
					orgList.LC_DEPT_ID = "";
					orgList.LC_DEPT_NAME = "";
					orgList.LC_DEPT_TEL = ""
					orgList.LV = nodes[index].data.LV;
					orgList.AREA_CDE = nodes[index].data.AREA_CDE;
					orgList.AREA_NAME = nodes[index].data.AREA_NAME;
					orgList.REP_EMP_ID = nodes[index].data.REP_EMP_ID;
					orgList.REP_EMP_NAME = nodes[index].data.REP_EMP_NAME;
				} else {
					orgList.BRAND_ID = nodes[index].data.BRAND_ID;
					orgList.BRAND_NAME = nodes[index].data.BRAND_NAME;
					orgList.UP_DEPT_ID = nodes[index].data.DEPT_ID;
					orgList.UP_DEPT_NAME = nodes[index].data.DEPT_NAME;
					orgList.UP_DEPT_TEL = nodes[index].data.TELPNO;
					orgList.PARE_DEPT_ID = "";
					orgList.PARE_DEPT_NAME = "";
					orgList.PARE_DEPT_TEL = "";
					orgList.LC_DEPT_ID = "";
					orgList.LC_DEPT_NAME = "";
					orgList.LC_DEPT_TEL = ""
					orgList.LV = nodes[index].data.LV;
					orgList.AREA_CDE = nodes[index].data.AREA_CDE;
					orgList.AREA_NAME = nodes[index].data.AREA_NAME;
					orgList.REP_EMP_ID = nodes[index].data.REP_EMP_ID;
					orgList.REP_EMP_NAME = nodes[index].data.REP_EMP_NAME;
				}
				tempList.push(orgList);
			}
			
			var brandList = removeDuplicates(tempList, 'BRAND_ID') // 브랜드리스트
			var sendBrand = [];
			var sendBrandName = [];
			for ( index in brandList ) {
				sendBrand.push(brandList[index].BRAND_ID);
				sendBrandName.push(brandList[index].BRAND_NAME);
			}
			
			var lv1List = removeDuplicates(tempList,'UP_DEPT_ID') // 본부리스트 
			var sendLv1 = [];
			var sendLv1Name = [];
			for ( index in lv1List ) {
				sendLv1.push(lv1List[index].UP_DEPT_ID);
				sendLv1Name.push(lv1List[index].UP_DEPT_NAME);
			}
	
			var lv2List = tempList.filter(data => data.LV == "2" ); // 사업국리스트
				lv2List = lv2List.concat(tempList.filter(data => data.LV == "3" )); 
				lv2List = removeDuplicates(lv2List, 'PARE_DEPT_ID');
			var sendLv2 = [];
			var sendLv2Name = [];
			for ( index in lv2List ) {
				sendLv2.push(lv2List[index].PARE_DEPT_ID);
				if (lv2List[index].LV != "3") sendLv2Name.push(lv2List[index].PARE_DEPT_NAME);
			}
	
			var lv3List = tempList.filter(data => data.LV == "3" ); // 센터리스트
				lv3List = removeDuplicates(lv3List, 'LC_DEPT_ID')
			var sendLv3 = [];
			var sendLv3Name = [];
			for ( index in lv3List ) {
				sendLv3.push(lv3List[index].LC_DEPT_ID);
				sendLv3Name.push(lv3List[index].LC_DEPT_NAME);
			} 

			var lv4List = tempList.filter(data => data.LV == "4" ); // 센터리스트
				lv4List = removeDuplicates(lv4List, 'LC_DEPT_ID')
			var sendLv4 = [];
			var sendLv4Name = [];
			for ( index in lv4List ) {
				sendLv4.push(lv4List[index].LC_DEPT_ID);
				sendLv4Name.push(lv4List[index].LC_DEPT_NAME);
			} 
				
			var temp = [];
			temp.brand = sendBrand;
			temp.brandName = sendBrandName.join(', ');
			temp.lv1 = sendLv1;
			temp.lv1name = sendLv1Name.join(', ');
			temp.lv2 = sendLv2;
			temp.lv2name = sendLv2Name.join(', ');
			temp.lv3 = sendLv3;
			temp.lv3name = sendLv3Name.join(', ');
			temp.lv4 = sendLv4;
			temp.lv4name = sendLv4Name.join(', ');

			var rootkeys = tree.getSelectedNodes(true);
			var selRootKeys = $.map(rootkeys, function(node){
				return node.key;
			});
			
			if ( nodes.length != selRootKeys.length ) temp.isYN = "Y";
			else temp.isYN = "N";
			/**
			 * 전송할 데이터
			 * @param org    : 선택한 본부/사업국/지점 정보
			 * @param member : 선택된 구성원(직원) 정보 
			 */
			 opener.setTransDisPlay(temp);
			 window.close();

		} else if ( _mode == "plainTree") { //사업국 연계에 전송할 데이터
			var tempGrid = employeeListGrid.getCheckedRows().map(el => {
				return {
					NAME : 	el.NAME,
					EMP_ID : el.EMP_ID,
					UP_DEPT_NAME : el.UP_DEPT_NAME,
					PARE_DEPT_NAME : el.PARE_DEPT_NAME,
					DEPT_NAME : el.DEPT_NAME,
					DUTY_NAME : el.DUTY_NAME,
					RANK_NAME : el.RANK_NAME,
					TCHR_MK_NAME : el.TCHR_MK_NAME,
					MOBILNO : el.MOBILNO,
					STS_NAME : el.STS_NAME,
					UP_DEPT_ID : el.UP_DEPT_ID,
					PARE_DEPT_ID : el.PARE_DEPT_ID,
					DEPT_ID : el.DEPT_ID,
					ZEN_USE_YN : el.ZEN_USE_YN,
					// 앱연계대상 스타일 적용
					_attributes: el.ZEN_USE_YN != 'Y' ? {} : {
						className: {
							column: { 
								NAME:['col_row'],
								EMP_ID:['col_row'], 
								UP_DEPT_NAME:['col_row'], 
								PARE_DEPT_NAME:['col_row'], 
								DEPT_NAME:['col_row'], 
								DUTY_NAME:['col_row'], 
								RANK_NAME:['col_row'], 
								TCHR_MK_NAME:['col_row'], 
								MOBILNO:['col_row'], 
								STS_NAME:['col_row'],  
								ZEN_USE_YN:['col_row'],
							} 
						} 
					}
				};
			});

			/**
			 * 전송할 데이터
			 * @param telArray    : 그리드에서 선택한 사람의 전화(핸드폰) 배열
			 * @param nameArray    : 그리드에서 선택한 사람의 이름 배열
			 * @param idArray      : 그리드에서 선택한 사람의 ID 배열
			 */
			var telArray = [];
			var nameArray = [];
			var idArray = [];

			// 선택한 사람 넣기
			console.log(tempGrid);
			for ( index in tempGrid) {
				idArray[index] = tempGrid[index].EMP_ID;
				nameArray[index] = tempGrid[index].NAME;
				telArray[index] = tempGrid[index].MOBILNO;
			}
			// 선택한 부서의 기본 부서장 입력(없을 경우 입력 없음)
			// if (! isEmpty(_selectedNode.data.REP_EMP_ID) ){
			// 	if (! isEmpty(_selectedNode.data.REP_EMP_ID.trim()) ) {
			// 		if( idArray.filter(data => data == _selectedNode.data.REP_EMP_ID.trim()).length == 0 ) {
			// 			idArray.push(_selectedNode.data.REP_EMP_ID)
			// 			nameArray.push(_selectedNode.data.REP_EMP_NAME);
			// 			telArray.push(_selectedNode.data.REP_EMP_TELPNO);
			// 		}
			// 	}
			// }
			// console.log(telArray);

			/**
			 * 전송할 데이터
			 * @param orgList    : 선택한 본부/사업국/지점 정보
			 */
			var orgList = {};
			/* CCEMPRO028 : 상담연계/입회연계/소개연계 선택 값 전송 */
			if ( opener.name == 'CCEMPRO028' ) {
				if ( _selectedNode.data.LV =="4" ) {
					if( _selectedNode.parent.parent.parent.data.DEPT_ID == "T000" ) {
						orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
						orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
						orgList.LV = _selectedNode.data.LV;
						orgList.DEPT_ID = _selectedNode.data.DEPT_ID;		
						orgList.DEPT_NAME = _selectedNode.data.DEPT_NAME;
						orgList.DEPT_TELNO = _selectedNode.data.TELPNO;
						if (! isEmpty(_selectedNode.data.FAXNO) ){
							orgList.DEPT_FAX_DDD = _selectedNode.data.FAXNO.split('-')[0];
							orgList.DEPT_FAX_NO1 = _selectedNode.data.FAXNO.split('-')[1];
							orgList.DEPT_FAX_NO2 = _selectedNode.data.FAXNO.split('-')[2];
						}
						orgList.LC_ID = "";		
						orgList.LC_NAME = "";
						orgList.LC_TELNO = "";
						orgList.LC_FAX_DDD = "";
						orgList.LC_FAX_NO1 = "";
						orgList.LC_FAX_NO2 = "";
						orgList.DIV_CDE = _selectedNode.parent.data.DEPT_ID;
						orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
						orgList.DEPT_EMP_ID = _selectedNode.data.REP_EMP_ID;
						orgList.LC_EMP_ID = "";
						orgList.EMP_NAME_LIST  = nameArray.join(', ');
						orgList.EMP_ID_LIST = idArray.join(', ');
						orgList.EMP_PHONE_LIST = telArray.join(', ');
					} else {
						orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
						orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
						orgList.LV = _selectedNode.data.LV;
						orgList.DEPT_ID = _selectedNode.parent.data.DEPT_ID;		
						orgList.DEPT_NAME = _selectedNode.parent.data.DEPT_NAME;
						orgList.DEPT_TELNO = _selectedNode.parent.data.TELPNO;
						if (! isEmpty(_selectedNode.parent.data.FAXNO) ){
							orgList.DEPT_FAX_DDD = _selectedNode.parent.data.FAXNO.split('-')[0];
							orgList.DEPT_FAX_NO1 = _selectedNode.parent.data.FAXNO.split('-')[1];
							orgList.DEPT_FAX_NO2 = _selectedNode.parent.data.FAXNO.split('-')[2];
						}
	
						orgList.LC_ID = _selectedNode.data.DEPT_ID;		
						orgList.LC_NAME = _selectedNode.data.DEPT_NAME;
						orgList.LC_TELNO = _selectedNode.data.TELPNO;
						if (! isEmpty(_selectedNode.data.FAXNO) ){
							orgList.LC_FAX_DDD = _selectedNode.data.FAXNO.split('-')[0];
							orgList.LC_FAX_NO1 = _selectedNode.data.FAXNO.split('-')[1];
							orgList.LC_FAX_NO2 = _selectedNode.data.FAXNO.split('-')[2];
						}
						orgList.DEPT_ID = _selectedNode.parent.data.DEPT_ID;
						orgList.DIV_CDE = _selectedNode.parent.parent.data.DEPT_ID;
						orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
						orgList.DEPT_EMP_ID = _selectedNode.parent.data.REP_EMP_ID;
						orgList.LC_EMP_ID = _selectedNode.data.REP_EMP_ID;
						orgList.EMP_NAME_LIST  = nameArray.join(', ');
						orgList.EMP_ID_LIST = idArray.join(', ');
						orgList.EMP_PHONE_LIST = telArray.join(', ');
					}


				} else if ( _selectedNode.data.LV =="3" ) {
					if( _selectedNode.parent.parent.data.DEPT_ID == "T000" ) {
						orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
						orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
						orgList.LV = _selectedNode.data.LV;
						orgList.DEPT_ID = _selectedNode.data.DEPT_ID;		
						orgList.DEPT_NAME = _selectedNode.data.DEPT_NAME;
						orgList.DEPT_TELNO = _selectedNode.data.TELPNO;
						if (! isEmpty(_selectedNode.data.FAXNO) ){
							orgList.DEPT_FAX_DDD = _selectedNode.data.FAXNO.split('-')[0];
							orgList.DEPT_FAX_NO1 = _selectedNode.data.FAXNO.split('-')[1];
							orgList.DEPT_FAX_NO2 = _selectedNode.data.FAXNO.split('-')[2];
						}
						orgList.LC_ID = "";		
						orgList.LC_NAME = "";
						orgList.LC_TELNO = "";
						orgList.LC_FAX_DDD = "";
						orgList.LC_FAX_NO1 = "";
						orgList.LC_FAX_NO2 = "";
						orgList.DIV_CDE = _selectedNode.parent.data.DEPT_ID;
						orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
						orgList.DEPT_EMP_ID = _selectedNode.data.REP_EMP_ID;
						orgList.LC_EMP_ID = "";
						orgList.EMP_NAME_LIST  = nameArray.join(', ');
						orgList.EMP_ID_LIST = idArray.join(', ');
						orgList.EMP_PHONE_LIST = telArray.join(', ');
					} else {
						orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
						orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
						orgList.LV = _selectedNode.data.LV;
						orgList.DEPT_ID = _selectedNode.parent.data.DEPT_ID;		
						orgList.DEPT_NAME = _selectedNode.parent.data.DEPT_NAME;
						orgList.DEPT_TELNO = _selectedNode.parent.data.TELPNO;
						if (! isEmpty(_selectedNode.parent.data.FAXNO) ){
							orgList.DEPT_FAX_DDD = _selectedNode.parent.data.FAXNO.split('-')[0];
							orgList.DEPT_FAX_NO1 = _selectedNode.parent.data.FAXNO.split('-')[1];
							orgList.DEPT_FAX_NO2 = _selectedNode.parent.data.FAXNO.split('-')[2];
						}
	
						orgList.LC_ID = _selectedNode.data.DEPT_ID;		
						orgList.LC_NAME = _selectedNode.data.DEPT_NAME;
						orgList.LC_TELNO = _selectedNode.data.TELPNO;
						if (! isEmpty(_selectedNode.data.FAXNO) ){
							orgList.LC_FAX_DDD = _selectedNode.data.FAXNO.split('-')[0];
							orgList.LC_FAX_NO1 = _selectedNode.data.FAXNO.split('-')[1];
							orgList.LC_FAX_NO2 = _selectedNode.data.FAXNO.split('-')[2];
						}
						orgList.DEPT_ID = _selectedNode.parent.data.DEPT_ID;
						orgList.DIV_CDE = _selectedNode.parent.parent.data.DEPT_ID;
						orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
						orgList.DEPT_EMP_ID = _selectedNode.parent.data.REP_EMP_ID;
						orgList.LC_EMP_ID = _selectedNode.data.REP_EMP_ID;
						orgList.EMP_NAME_LIST  = nameArray.join(', ');
						orgList.EMP_ID_LIST = idArray.join(', ');
						orgList.EMP_PHONE_LIST = telArray.join(', ');
					}

				} else if ( _selectedNode.data.LV =="2" ) {
					orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
					orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
					orgList.LV = _selectedNode.data.LV;
					orgList.DEPT_ID = _selectedNode.data.DEPT_ID;		
					orgList.DEPT_NAME = _selectedNode.data.DEPT_NAME;
					orgList.DEPT_TELNO = _selectedNode.data.TELPNO;
					if (! isEmpty(_selectedNode.data.FAXNO) ){
						orgList.DEPT_FAX_DDD = _selectedNode.data.FAXNO.split('-')[0];
						orgList.DEPT_FAX_NO1 = _selectedNode.data.FAXNO.split('-')[1];
						orgList.DEPT_FAX_NO2 = _selectedNode.data.FAXNO.split('-')[2];
					}
					orgList.LC_ID = "";		
					orgList.LC_NAME = "";
					orgList.LC_TELNO = "";
					orgList.LC_FAX_DDD = "";
					orgList.LC_FAX_NO1 = "";
					orgList.LC_FAX_NO2 = "";
					orgList.DIV_CDE = _selectedNode.parent.data.DEPT_ID;
					orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
					orgList.DEPT_EMP_ID = _selectedNode.data.REP_EMP_ID;
					orgList.LC_EMP_ID = "";
					orgList.EMP_NAME_LIST  = nameArray.join(', ');
					orgList.EMP_ID_LIST = idArray.join(', ');
					orgList.EMP_PHONE_LIST = telArray.join(', ');
				} else if ( _selectedNode.data.LV =="1" )  {
					orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
					orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
					orgList.LV = _selectedNode.data.LV;
					orgList.DEPT_ID = _selectedNode.data.DEPT_ID;		
					orgList.DEPT_NAME = _selectedNode.data.DEPT_NAME;
					orgList.DEPT_TELNO = _selectedNode.data.TELPNO;
					if (! isEmpty(_selectedNode.data.FAXNO) ){
						orgList.DEPT_FAX_DDD = _selectedNode.data.FAXNO.split('-')[0];
						orgList.DEPT_FAX_NO1 = _selectedNode.data.FAXNO.split('-')[1];
						orgList.DEPT_FAX_NO2 = _selectedNode.data.FAXNO.split('-')[2];
					}
					orgList.LC_ID = "";		
					orgList.LC_NAME = "";
					orgList.LC_TELNO = "";
					orgList.LC_FAX_DDD = "";
					orgList.LC_FAX_NO1 = "";
					orgList.LC_FAX_NO2 = "";
					orgList.DIV_CDE = _selectedNode.data.DEPT_ID;
					orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
					orgList.DEPT_EMP_ID = _selectedNode.data.REP_EMP_ID;
					orgList.LC_EMP_ID = "";
					orgList.EMP_NAME_LIST  = nameArray.join(', ');
					orgList.EMP_ID_LIST = idArray.join(', ');
					orgList.EMP_PHONE_LIST = telArray.join(', ');
				}
				// console.log(orgList);
				opener.setTransDisPlay(orgList);
			} 
			/* CCEMPRO022 : 상담등록 _ 연계부서 선택 값 전송 */
			else if ( opener.name == 'CCEMPRO022' ) {
				if ( _selectedNode.data.LV =="1" ) {
					orgList.PROC_DEPT_ID = _selectedNode.data.DEPT_ID;		
				} else if ( _selectedNode.data.LV =="2" ) {
					orgList.PROC_DEPT_ID = _selectedNode.data.DEPT_ID;		
				} else if ( _selectedNode.data.LV =="3" ) {
					if ( _selectedNode.data.DEPT_ID.length != 4 ) {
						alert("센터는 연계부서로 선택할 수 없습니다.\n: 상위 본부/사업국 혹은 부서를 선택해 주세요.");
						return;
					} else {
						orgList.PROC_DEPT_ID = _selectedNode.data.DEPT_ID;		
					}
				} else if ( _selectedNode.data.LV =="4" ) {
					orgList.PROC_DEPT_ID = _selectedNode.data.DEPT_ID;		
				}
				orgList.PROC_DEPT_NAME = _selectedNode.data.DEPT_NAME;
				orgList.EMP_NAME_LIST  = nameArray.join(', ')
				orgList.EMP_ID_LIST = idArray.join(', ')
				opener.setDisPlayDn(orgList);
				// console.log(orgList);
			}
			window.close();

		} else if ( _mode =="plainTreeSelOrg") {
			/**
			 * 전송할 데이터
			 * @param orgList    : 선택한 본부/사업국/지점 정보
			 */
			var orgList = {};
			orgList = getSelOrg();
			/* CCEMPRO022 : 상담등록 _ 본부/사업국/센터 선택 값 전송 */
			if ( opener.name == 'CCEMPRO022' ) {
				opener.setDisPlayUp(orgList);
			} 
			/* CCEMPRO031 : 입회등록 & CCEMPRO032 : 선생님소개 _ 본부/사업국/센터 선택 값 전송 */
			else if ( opener.name == 'CCEMPRO031' || opener.name == 'CCEMPRO032' ) {
				opener.setDisPlay(orgList);
			} else if ( opener.name.indexOf('app_CCEM_top_bar') > -1) {
				opener.document.getElementById('custInfo_UPDEPTNAME').value = orgList.UPDEPTNAME;
				opener.document.getElementById('custInfo_DEPT_ID').value = orgList.DEPT_ID;
				opener.document.getElementById('custInfo_DEPT_NAME').value = orgList.DEPT_NAME;
				opener.document.getElementById('custInfo_TELPNO_DEPT').value = orgList.TELPNO_DEPT;
				opener.document.getElementById('custInfo_LC_NAME').value = orgList.LC_NAME;
				opener.document.getElementById('custInfo_LC_ID').value = orgList.LC_ID;
				opener.document.getElementById('custInfo_TELPNO_LC').value = orgList.TELPNO_LC;
			} else {
				
			}
			window.close();
		}
	},

	// searchOrg() : 조회기능
	searchOrg() {
		_btn.tableReset();

		// 본부/사업국/센터 선택시 검색
		if ( $('#deptSearch').prop("checked")==true ) {
			_isEmpSearch = false;

			var treeData
			/**
			 * 처음 화면 진입 시 오픈된 기관만 검색
			 * _isChange 
			 * false = 폐쇄기관포함 미체크됨
			 * true  = 폐쇄기관포함 체크됨
			 */
			if ( $('#includeClosed').prop("checked")==true ) {
				treeData = _closedOrgList;
				if ( _isChange == false ) {
					_sortList.orgList(treeData);
					_isChange = true;
				}
			} else {
				treeData = _openOrgList;
				if ( _isChange == true ) {
					_sortList.orgList(treeData);
					_isChange = false;
				}
			}
			
			console.log($('#searchOrg_selectbox > option:selected').val());

			// 검색 값 설정
			var searchTxt = $('#searchOrg_txt').val();
			if ( isEmpty(searchTxt) ) {										// 빈 값으로 검색하는 경우 : 전체 트리 표시
				tree.clearFilter();
				tree.expandAll(false);
			} else if ( $('#searchOrg_selectbox > option:selected').val() == '지점명') {
				var txt = $.trim($('#searchOrg_txt').val());
				var code = `node.data.DEPT_NAME.indexOf('`+txt+`') > -1`
				tree.filterNodes( 
					function (node) {
						if ( !isEmpty(node.data.DEPT_NAME) ) {
							return eval(code);
						}
					}, {mode : "hide"}
				)
				if (! isEmpty(tree.findFirst(txt))) { 
					tree.activateKey(tree.findFirst(txt).key);
				} else {
					_btn.resetFilter();
					$('#searchOrg_txt').val("");
					alert(txt+"로 검색된 본부/사업국/센터가 없습니다.\n: 다른 사업국을 선택해 주세요.");
				}
			} else if ( $('#searchOrg_selectbox > option:selected').val() == '지점주소') {
				var match = $.trim($('#searchOrg_txt').val());
				tree.filterNodes( 
					function(node) {
						if ( !isEmpty(node.data.ZIP_ADDR) ) {
							return node.data.ZIP_ADDR.indexOf(match) > -1;
						}
					}, {mode : "hide"}
				);
			} else if ( $('#searchOrg_selectbox > option:selected').val() == '관할주소') {
				var txt = $.trim($('#searchOrg_txt').val());
				_getList.boundAddrList(txt).then(function(resolvedData){
					var code = '';
					for ( index in resolvedData ) {
						if ( index == resolvedData.length-1 ) code += 'node.data.DEPT_ID.indexOf(\''+resolvedData[index].DEPT_ID+'\') > -1'
						else code += 'node.data.DEPT_ID.indexOf(\''+resolvedData[index].DEPT_ID+'\') > -1 || '
					}
					// console.log(code);
					tree.filterNodes( 
						function(node) {
							if ( !isEmpty(node.data.DEPT_ID) ) {
								return eval(code);
							}
						}, {mode : "hide"}
					);
				})
			} 
			
			// 라디오버튼
			// else if ( $('#searchOrg_selectbox').prop("checked")==true ) { 	// 주소명 검색 : (광역시/도, 시/군/구/, 읍/면/동)
			// 	var match = $.trim($('#searchOrg_txt').val());
			// 	tree.filterNodes( 
			// 		function(node) {
			// 			if ( !isEmpty(node.data.ZIP_ADDR) ) {
			// 				return node.data.ZIP_ADDR.indexOf(match) > -1;
			// 			}
			// 		}, {mode : "hide"}
			// 	);
			// } else if ( $('#searchOrg_radio2').prop("checked")==true ) {
			// 	var txt = $.trim($('#searchOrg_txt').val());
			// 	_getList.boundAddrList(txt).then(function(resolvedData){
			// 		var code = '';
			// 		for ( index in resolvedData ) {
			// 			if ( index == resolvedData.length-1 ) code += 'node.data.DEPT_ID.indexOf(\''+resolvedData[index].DEPT_ID+'\') > -1'
			// 			else code += 'node.data.DEPT_ID.indexOf(\''+resolvedData[index].DEPT_ID+'\') > -1 || '
			// 		}
			// 		// console.log(code);
			// 		tree.filterNodes( 
			// 			function(node) {
			// 				if ( !isEmpty(node.data.DEPT_ID) ) {
			// 					return eval(code);
			// 				}
			// 			}, {mode : "hide"}
			// 		);
			// 	})
			// } else {														// 본부/사업국/센터명
			// 	var txt = $.trim($('#searchOrg_txt').val());
			// 	var code = `node.data.DEPT_NAME.indexOf('`+txt+`') > -1`
			// 	tree.filterNodes( 
			// 		function(node) {
			// 			if ( !isEmpty(node.data.DEPT_NAME) ) {
			// 				return eval(code);
			// 			}
			// 		}, {mode : "hide"}
			// 	);
			// }
		} // 구성원 선택시 검색
		else {
			_isEmpSearch = true;
			var param = [{}];
			if ( $('#searchEmpOrgNM_chk').prop("checked")==true && !isEmpty($('#searchEmpOrgNM_input').val()) ) {
				param[0].SEARCH_DEPT_NAME = "Y"
				param[0].SEARCH_DEPT_NAME_TXT = $('#searchEmpOrgNM_input').val();
			}
			if ( $('#searchEmpNM_chk').prop("checked")==true && !isEmpty($('#searchEmpNM_input').val()) ) {
				param[0].SEARCH_EMP_NAME = "Y"
				param[0].SEARCH_EMP_NAME_TXT = $('#searchEmpNM_input').val();
			}
			if ( $('#searchEmp_chk').prop("checked")==true && !isEmpty($('#searchEmp_selectbox').val()) ) {
				// SEARCH_STS_CDE_TXT : 0:퇴직, 1:휴직, 2:대기, 3:사업, 4:해지, 9:재직
				if ($('#searchEmp_selectbox').val()=="전체") {

				} else if ($('#searchEmp_selectbox').val()=="재직") {
					param[0].SEARCH_STS_CDE_TXT = ["9", "2", "1"];
					param[0].SEARCH_STS_CDE = "Y"
				} else if ($('#searchEmp_selectbox').val()=="사업") {
					param[0].SEARCH_STS_CDE_TXT = ["3"];
					param[0].SEARCH_STS_CDE = "Y"
				} else if ($('#searchEmp_selectbox').val()=="해지/퇴직") {
					param[0].SEARCH_STS_CDE_TXT = ["4", "0"];
					param[0].SEARCH_STS_CDE = "Y"
				}	
			} 
			
			// 오픈/폐쇄기관을 확인할 때 
			if ( $('#includeClosed').prop("checked")==true ) param[0].ACTIVE_FLAG = "N";
			else param[0].ACTIVE_FLAG = "Y";

			// console.log(param);
			if ( $('#searchEmpOrgNM_chk').prop("checked")==false && $('#searchEmpNM_chk').prop("checked")==false  ) {
				alert("항목을 체크하고 검색값을 입력해주세요.");
				if  ( isEmpty($('#searchEmpOrgNM_input').val())) $('#searchEmpOrgNM_input').focus();
				else $('#searchEmpNM_input').focus();
				return false;
			}

			if ( _mode =="plainTree" ) {
				// $("#counselSel_btn").addClass('invisible');
				$("#counselSend_btn").addClass('invisible');
			}

			_getList.employeeList(param);
		}
	},

	// resetTree() : 트리 초기화(선택값 초기화)
	resetTree(){
		var treeData
		if ( $('#includeClosed').prop("checked")==true ) treeData = _closedOrgList;
		else treeData = _openOrgList;
		$('#searchOrg_txt').val("");
		$('#searchEmpOrgNM_input').val("");
		$('#searchEmpNM_input').val("");
		$('#searchEmp_selectbox').val("전체");
		$('#deptSearch').click();
		$('#searchOrg_radio3').click();
		$('#searchEmpNM_chk').prop("checked",false);
		$('#searchEmpOrgNM_chk').prop("checked",false);
		$('#searchEmp_chk').prop("checked",true);
		_sortList.orgList(treeData);
		_isEmpSearch = false;
		_btn.tableReset();
		$('#deptCenter').click();
	},

	// resetFilter() : 필터초기화(선택값 유지)
	resetFilter(){
		tree.clearFilter();
		tree.expandAll(false);
		_isEmpSearch = false;
	},

	// saveTxt() : 조직관할구역 저장
	saveTxt() {
		var param = [{}]
		if ( _selectedNode.data.LV == '1') {
			param[0].CHG_DEPT = "Y";
			param[0].DEPT_ID = _selectedNode.data.DEPT_ID;
			param[0].ZIP_CNTS = $('#ZIP_CNTS_input').val();
		} else if ( _selectedNode.data.LV == '2') {
			param[0].CHG_DEPT = "Y";
			param[0].DEPT_ID = _selectedNode.data.DEPT_ID;
			param[0].ZIP_CNTS = $('#ZIP_CNTS_input').val();
		} else if (_selectedNode.data.LV == '3') {
			param[0].CHG_LC = "Y";
			param[0].LC_ID = _selectedNode.data.DEPT_ID;
			param[0].ZIP_CNTS = $('#ZIP_CNTS_input').val();
		} else if (_selectedNode.data.LV == '4') {
			param[0].CHG_LC = "Y";
			param[0].LC_ID = _selectedNode.data.DEPT_ID;
			param[0].ZIP_CNTS = $('#ZIP_CNTS_input').val();
		} else {
			return false;
		}
		var node = tree.getActiveNode();
		_getList.saveZIPCNTS(param).then(function() {
			_getList.orgList();
			_isSave = true;
		});
	},

	// tableReset() : 테이블, 그리드의 값 빈값으로 표기
	tableReset() {
		employeeListGrid.resetData([]);
		$("#HQ_NAME").text("");
		$("#DEPT_NAME").text("");
		$("#LC_NAME").text("");
		$("#HQ_NAME2").text("");
		$("#DEPT_NAME2").text("");
		$("#LC_NAME2").text("");
		$("#POSTNUM").val("");
		$("#POSTADDR").val("");
		$("#ADDR").val("");
		$("#PHONE").val("");
		$("#FAXNUM").val("");
		$("#ZIP_CNTS_input").val("");
		$("#POSTNUM2").val("");
		$("#POSTADDR2").val("");
		$("#ADDR2").val("");
		$("#PHONE2").val("");
		$("#FAXNUM2").val("");
		$("#REP_EMP_NAME").val("");
	}

}


/**
 * 현재 선택한 지점의 정보 가져오기
 * @param 
 */
function getSelOrg() {
	var orgList = {}
	if ( opener.name == 'CCEMPRO022' || opener.name == 'CCEMPRO031' || opener.name.indexOf('app_CCEM_top_bar') > -1) {
		if ( _selectedNode.data.LV =="4" ) {
			// 본사
			if( _selectedNode.parent.parent.parent.data.DEPT_ID == "T000" ) {
				orgList.DIV_KIND_CDE = _selectedNode.parent.parent.data.BRAND_ID;
				orgList.LC_ID = "";
				orgList.LC_EMP_ID = "";
				orgList.DIV_CDE = _selectedNode.parent.data.DEPT_ID;
				orgList.UPDEPTNAME = _selectedNode.parent.data.DEPT_NAME;
				orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
				orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
				orgList.DEPT_ID = _selectedNode.data.DEPT_ID;
				orgList.DEPT_NAME = _selectedNode.data.DEPT_NAME;
				orgList.DEPT_EMP_ID = _selectedNode.data.REP_EMP_ID;
				orgList.TELPNO_DEPT = _selectedNode.data.TELPNO;
				orgList.LC_NAME = "";
				orgList.TELPNO_LC = "";
			}
			// 기타 사업국
			else {
				orgList.DIV_KIND_CDE = _selectedNode.parent.parent.data.BRAND_ID;
				orgList.LC_ID = _selectedNode.data.DEPT_ID;
				orgList.LC_EMP_ID = _selectedNode.data.REP_EMP_ID;
				orgList.DIV_CDE = _selectedNode.parent.parent.data.DEPT_ID;
				orgList.UPDEPTNAME = _selectedNode.parent.parent.data.DEPT_NAME;
				orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
				orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
				orgList.DEPT_ID = _selectedNode.parent.data.DEPT_ID;
				orgList.DEPT_NAME = _selectedNode.parent.data.DEPT_NAME;
				orgList.DEPT_EMP_ID = _selectedNode.parent.data.REP_EMP_ID;
				orgList.TELPNO_DEPT = _selectedNode.parent.data.TELPNO;
				orgList.LC_NAME = _selectedNode.data.DEPT_NAME;
				orgList.TELPNO_LC = _selectedNode.data.TELPNO;
			}
		} else if ( _selectedNode.data.LV =="3" ) {
			// 본사
			if( _selectedNode.parent.parent.data.DEPT_ID == "T000" ) {
				orgList.DIV_KIND_CDE = _selectedNode.parent.data.BRAND_ID;
				orgList.LC_ID = "";
				orgList.LC_EMP_ID = "";
				orgList.DIV_CDE = _selectedNode.parent.data.DEPT_ID;
				orgList.UPDEPTNAME = _selectedNode.parent.data.DEPT_NAME;
				orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
				orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
				orgList.DEPT_ID = _selectedNode.data.DEPT_ID;
				orgList.DEPT_NAME = _selectedNode.data.DEPT_NAME;
				orgList.DEPT_EMP_ID = _selectedNode.data.REP_EMP_ID;
				orgList.TELPNO_DEPT = _selectedNode.data.TELPNO;
				orgList.LC_NAME = "";
				orgList.TELPNO_LC = "";
			}
			// 기타 사업국
			else {
				orgList.DIV_KIND_CDE = _selectedNode.parent.parent.data.BRAND_ID;
				orgList.LC_ID = _selectedNode.data.DEPT_ID;
				orgList.LC_EMP_ID = _selectedNode.data.REP_EMP_ID;
				orgList.DIV_CDE = _selectedNode.parent.parent.data.DEPT_ID;
				orgList.UPDEPTNAME = _selectedNode.parent.parent.data.DEPT_NAME;
				orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
				orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
				orgList.DEPT_ID = _selectedNode.parent.data.DEPT_ID;
				orgList.DEPT_NAME = _selectedNode.parent.data.DEPT_NAME;
				orgList.DEPT_EMP_ID = _selectedNode.parent.data.REP_EMP_ID;
				orgList.TELPNO_DEPT = _selectedNode.parent.data.TELPNO;
				orgList.LC_NAME = _selectedNode.data.DEPT_NAME;
				orgList.TELPNO_LC = _selectedNode.data.TELPNO;
			}
		} else if ( _selectedNode.data.LV =="2" ) {
			// 본사
			if( _selectedNode.parent.data.DEPT_ID == "T000" ) {
				orgList.DIV_KIND_CDE = _selectedNode.data.BRAND_ID;
				orgList.LC_ID = "";
				orgList.LC_EMP_ID = "";
				orgList.DIV_CDE = _selectedNode.data.DEPT_ID;
				orgList.UPDEPTNAME = _selectedNode.data.DEPT_NAME;
				orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
				orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
				orgList.DEPT_ID = _selectedNode.data.DEPT_ID;
				orgList.DEPT_NAME = _selectedNode.data.DEPT_NAME;
				orgList.DEPT_EMP_ID = "";
				orgList.TELPNO_DEPT = _selectedNode.data.TELPNO;
				orgList.LC_NAME = "";
				orgList.TELPNO_LC = "";
			// 사업국	
			} else {
				orgList.DIV_KIND_CDE = _selectedNode.parent.data.BRAND_ID;
				orgList.LC_ID = "";
				orgList.LC_EMP_ID = "";
				orgList.DIV_CDE = _selectedNode.parent.data.DEPT_ID;
				orgList.UPDEPTNAME = _selectedNode.parent.data.DEPT_NAME;
				orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
				orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
				orgList.DEPT_ID = _selectedNode.data.DEPT_ID;
				orgList.DEPT_NAME = _selectedNode.data.DEPT_NAME;
				orgList.DEPT_EMP_ID = _selectedNode.data.REP_EMP_ID;
				orgList.TELPNO_DEPT = _selectedNode.data.TELPNO;
				orgList.LC_NAME = "";
				orgList.TELPNO_LC = "";
			}
		} else if ( _selectedNode.data.LV =="1" )  {
			orgList.DIV_KIND_CDE = _selectedNode.data.BRAND_ID;
			orgList.LC_ID = "";
			orgList.LC_EMP_ID = "";
			orgList.DIV_CDE = _selectedNode.data.DEPT_ID;
			orgList.UPDEPTNAME = _selectedNode.data.DEPT_NAME;
			orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
			orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
			orgList.DEPT_ID = _selectedNode.data.DEPT_ID;
			orgList.DEPT_NAME = _selectedNode.data.DEPT_NAME;
			orgList.DEPT_EMP_ID = "";
			orgList.TELPNO_DEPT = _selectedNode.data.TELPNO;
			orgList.LC_NAME = "";
			orgList.TELPNO_LC = "";
		}
	} else {
		if ( _selectedNode.data.LV =="3" ) {
			orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
			orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
			orgList.UP_DEPT_ID = _selectedNode.parent.parent.data.DEPT_ID;
			orgList.UP_DEPT_NAME = _selectedNode.parent.parent.data.DEPT_NAME;
			orgList.UP_DEPT_TEL = _selectedNode.parent.parent.data.TELPNO;
			orgList.PARE_DEPT_ID = _selectedNode.parent.data.DEPT_ID;
			orgList.PARE_DEPT_NAME = _selectedNode.parent.data.DEPT_NAME;
			orgList.PARE_DEPT_TEL = _selectedNode.parent.data.TELPNO;
			orgList.LC_DEPT_ID = _selectedNode.data.DEPT_ID;
			orgList.LC_DEPT_NAME = _selectedNode.data.DEPT_NAME;
			orgList.LC_DEPT_TEL = _selectedNode.data.TELPNO;
			orgList.LV = _selectedNode.data.LV;
			orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
			orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
			orgList.REP_EMP_ID = _selectedNode.data.REP_EMP_ID;
			orgList.REP_EMP_NAME = _selectedNode.data.REP_EMP_NAME;
		} else if ( _selectedNode.data.LV =="2" ) {
			orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
			orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
			orgList.UP_DEPT_ID = _selectedNode.parent.data.DEPT_ID;
			orgList.UP_DEPT_NAME = _selectedNode.parent.data.DEPT_NAME;
			orgList.UP_DEPT_TEL = _selectedNode.parent.data.TELPNO;
			orgList.PARE_DEPT_ID = _selectedNode.data.DEPT_ID;
			orgList.PARE_DEPT_NAME = _selectedNode.data.DEPT_NAME;
			orgList.PARE_DEPT_TEL = _selectedNode.data.TELPNO;
			orgList.LC_DEPT_ID = "";
			orgList.LC_DEPT_NAME = "";
			orgList.LC_DEPT_TEL = ""
			orgList.LV = _selectedNode.data.LV;
			orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
			orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
			orgList.REP_EMP_ID = _selectedNode.data.REP_EMP_ID;
			orgList.REP_EMP_NAME = _selectedNode.data.REP_EMP_NAME;
		} else {
			orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
			orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
			orgList.UP_DEPT_ID = _selectedNode.data.DEPT_ID;
			orgList.UP_DEPT_NAME = _selectedNode.data.DEPT_NAME;
			orgList.UP_DEPT_TEL = _selectedNode.data.TELPNO;
			orgList.PARE_DEPT_ID = "";
			orgList.PARE_DEPT_NAME = "";
			orgList.PARE_DEPT_TEL = "";
			orgList.LC_DEPT_ID = "";
			orgList.LC_DEPT_NAME = "";
			orgList.LC_DEPT_TEL = ""
			orgList.LV = _selectedNode.data.LV;
			orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
			orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
			orgList.REP_EMP_ID = _selectedNode.data.REP_EMP_ID;
			orgList.REP_EMP_NAME = _selectedNode.data.REP_EMP_NAME;
		}
	}
	return orgList;
}


/**
 * 빈값 확인
 * @param {빈값확인하는 데이터} data 
 */
function isEmpty(data) {
	if (!data || data == "" || data == undefined || Object.keys(data).length === 0 ) return true;
	else return false;
}

/**
 * 중복값을 제거
 * @param {중복값을 제거할 배열} originalArray 
 * @param {기준 값} prop 
 */
function removeDuplicates(originalArray, prop) {
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

// 탭 이동시, employeeListGrid가 refresh되어 표의 틀어짐 방지
$("a[data-toggle='tab']").on("shown.bs.tab", function(e) {
	employeeListGrid.refreshLayout();

	/* _mode에 따른 탭별 기능 */
	switch (_mode){

		/* search */
		case "search" : 
			if ( $(this).attr('id') == 'employee' ) {
				$("#counselSave_btn").addClass('invisible');	// 저장버튼 비활성화
			} else if ( $(this).attr('id') == 'deptCenter') {
				$("#counselSave_btn").removeClass('invisible'); // 저장버튼 활성화
			}
			break;
	}
});

// 본부/사업국/센터 => 주소&관할주소&본부사업국/센터명 input박스 keyup이벤트
$('#searchOrg_txt').keyup(function(){
    if(event.keyCode == 13){
        $('#searchBtn').trigger('click');
    }
});

// 구성원 => 본부/사업국/센터 input박스 keyup이벤트
$('#searchEmpOrgNM_input').keyup(function(){
    if(event.keyCode == 13){
        $('#searchBtn').trigger('click');
	}
	if( isEmpty($('#searchEmpOrgNM_input').val()) ) $('#searchEmpOrgNM_chk').prop("checked",false);
	else  $('#searchEmpOrgNM_chk').prop("checked",true);
});

// 구성원 => 성명 input박스 keyup이벤트
$('#searchEmpNM_input').keyup(function(){
    if(event.keyCode == 13){
        $('#searchBtn').trigger('click');
	}
	if( isEmpty($('#searchEmpNM_input').val()) ) $('#searchEmpNM_chk').prop("checked",false);
	else  $('#searchEmpNM_chk').prop("checked",true);
});

// 구성원 => 재직구분 selectBox Change이벤트
$('#searchEmp_selectbox').on('change', function(){
	$('#searchEmp_chk').prop("checked",true);
});



init();
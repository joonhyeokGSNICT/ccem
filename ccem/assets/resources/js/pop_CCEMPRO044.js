/**
 * 전역변수
 */

var employeeListGrid; 	// 구성원 그리드
var tree;				// 트리구성표

var _tchrMkCDEList;		// 통합코드 TCHR_MK_CDE : 선생님 직책리스트 - 그리드 내 코드 직책 변환

var _closedOrgList; 	// 폐쇄기관 포함된 조직 리스트
var _openOrgList;		// 오픈한 조직 리스트(폐쇄 제외)

var _selectedNode;		// 현재 트리에 선택된 값(선택된 값이 정보로 표기)
var _searchedEmpList;	// 검색한 조직원 리스트(조회 후 트리에 맞게 표기)

var _isChange; 			// 트리구조 내 리스트 변경여부 (기준 폐쇄기관의 체크 변경 확인)
var _isEmpSearch; 		// 구성원 검색 시 (Ajax통신 사용)

let hash = window.location.hash; // 구분처리
/**
 * Mode설정
 * @param _mode 
 * 		  = chkTree         : 트리구조 체크 / 구성원 검색 X / 구성원 체크 X / 선택시 조직  리스트 전송 / 웹설문 페이지에서 활용
 *        = plainTree       : 트리구조 일반 / 구성원 검색 O / 구성원 체크 O / 선택시 구성원리스트 전달 / 현장, 상담, 소개연계 페이지에서 활용
 *        = plainTreeNoEmp  : 트리구조 일반 / 구성원 검색 X / 구성원 체크 X / 선택 버튼 X             / 조직관할구역 페이지 활용
 *        = plainTreeSelOrg : 트리구조 일반 / 구성원 검색 X / 구성원 체크 X / 선택 버튼 O             / 본부/사업국/센터 선택시
 *        = search          : 트리구조 일반 / 구성원 검색 O / 구성원 체크 X / 선택 버튼 X             / 탑바에서 본부/사업국/센터 페이지
 */
var _mode = "plainTree";
console.log("진입 부모 창 >> ",opener.name);
if ( opener.name == 'CCEMPRO022' ) {
	if (hash ==="#disPlayUp") _mode ="plainTreeSelOrg";
	else if (hash ==="#disPlayDn") _mode ="plainTree";
}
else if ( opener.name == 'CCEMPRO028' ) _mode ="plainTree";
else if ( opener.name == 'app_CCEM_top_bar_38e2ab2c-665c-4ac5-be58-65f649da8317') _mode="search";

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
	// 구성원 리스트 grid 설정
	employeeListGrid = new Grid({
		el: document.getElementById('employeeListGrid'),
		bodyHeight: 243,
		rowHeaders: _modeSelect[_mode].rowHeaders,
		columnOptions: { minWidth: 50, resizable: true, frozenCount: 0, frozenBorderWidth: 1, },
		columns: [
			{
				header: '본부',
				name: 'UP_DEPT_NAME',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '사업국',
				name: 'PARE_DEPT_NAME',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '센터',
				name: 'DEPT_NAME',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '성명',
				name: 'NAME',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '사번',
				name: 'EMP_ID',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '핸드폰번호',
				name: 'MOBILNO',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '교사구분',
				name: 'TCHR_MK_NAME',
				width: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '직책',
				name: 'DUTY_NAME',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '직급',
				name: 'RANK_NAME',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '재직구분',
				name: 'STS_NAME',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			}
		],
	});
	employeeListGrid.on('click', (ev) => {
		employeeListGrid.addSelection(ev);
		employeeListGrid.clickSort(ev);
		employeeListGrid.clickCheck(ev);
	});
		
	// 트리구조 설정, 
	$("#tree").fancytree({
		extensions: ["filter"],
		filter: {
			autoApply: true,   // Re-apply last filter if lazy data is loaded
			autoExpand: true, // Expand all branches that contain matches while filtered
			counter: false,     // Show a badge with number of matching child nodes near parent icons
			fuzzy: true,      // Match single characters in order, e.g. 'fb' will match 'FooBar'
			hideExpandedCounter: true,  // Hide counter badge if parent is expanded
			hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
			highlight: false,   // Highlight matches by wrapping inside <mark> tags
			leavesOnly: false,  // Match end nodes only
			nodata: true,      // Display a 'no data' status node if result is empty
			mode: "hide"       // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
		},
		checkbox: _modeSelect[_mode].treeCheckBox,
		selectMode: 3,

		// 본부/사업국/센터 설정 시 해당 정보 표시
		activate: function(event, data) {
			// $("#statusLine").text(event.type + ": " + data.node);
			// console.log(event, data, ", targetType=" + data.targetType);
			_selectedNode = data.node;
			console.log("_selectedNode >> ", _selectedNode)
			// console.log("data.node >> ", data.node)

			// 본부/사업국/센터 정보창 변경
			// 재직구분 확인
			var param = [{}];
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

			// 선택 후 조직 내 구성원 조회
			if(data.node.data.LV == "1"){
				$("#HQ_NAME").text(data.node.title);
				$("#DEPT_NAME").text("");
				$("#LC_NAME").text("");
				$("#HQ_NAME2").text(data.node.title);
				$("#DEPT_NAME2").text("");
				$("#LC_NAME2").text("");

				// 본부내 인원 검색
				switch (_mode){
					case "plainTree" : 
					case "search" :
						if (_isEmpSearch) {
							_sortList.selTreeEmpList(data.node.title);
						} else {
							param[0].SEARCH_DEPT_ID = "Y";
							param[0].SEARCH_DEPT_ID_TXT = data.node.data.UP_DEPT;
							_getList.employeeList(param);
						}
						if (hash ==="#disPlayDn") $("#counselSend_btn").removeClass('invisible');
						else $("#counselSend_btn").addClass('invisible');
						break;
					case "plainTreeSelOrg" : 
						$("#counselSend_btn").addClass('invisible');
						break;
				}
				$("#counselSave_btn").addClass('invisible');
				
			} else if(data.node.data.LV == "2"){
				$("#HQ_NAME").text(data.node.parent.title);
				$("#DEPT_NAME").text(data.node.title);
				$("#LC_NAME").text("");
				$("#HQ_NAME2").text(data.node.parent.title);
				$("#DEPT_NAME2").text(data.node.title);
				$("#LC_NAME2").text("");

				// 사업국 인원 검색
				switch (_mode){
					case "plainTree" : 
					case "search" :
						if (_isEmpSearch) {
							_sortList.selTreeEmpList(data.node.title);
						} else {
							param[0].SEARCH_DEPT_ID = "Y";
							param[0].SEARCH_DEPT_ID_TXT = data.node.data.PARE_DEPT_ID;
							_getList.employeeList(param);
						}

						if (hash ==="#disPlayDn") $("#counselSend_btn").removeClass('invisible');
						else $("#counselSend_btn").removeClass('invisible');
					case "plainTreeNoEmp" : 
						if( _mode == "search" || _mode == "plainTreeNoEmp" ) $('#counselSave_btn').removeClass("invisible");
						break;
					case "plainTreeSelOrg" : 
						$("#counselSend_btn").removeClass('invisible');
						break;
				}
			} else if(data.node.data.LV == "3"){
				$("#HQ_NAME").text(data.node.parent.parent.title);
				$("#DEPT_NAME").text(data.node.parent.title);
				$("#LC_NAME").text(data.node.title);
				$("#HQ_NAME2").text(data.node.parent.parent.title);
				$("#DEPT_NAME2").text(data.node.parent.title);
				$("#LC_NAME2").text(data.node.title);

				// 센터 인원 검색
				switch (_mode){
					case "plainTree" : case "search" :
						if (_isEmpSearch) {
							_sortList.selTreeEmpList(data.node.title); 
						} else {
							param[0].SEARCH_DEPT_ID = "Y";
							param[0].SEARCH_DEPT_ID_TXT = data.node.data.DEPT_ID;
							_getList.employeeList(param);
						}
						if (hash ==="#disPlayDn") $("#counselSend_btn").removeClass('invisible');
						else $("#counselSend_btn").removeClass('invisible');
					case "plainTreeNoEmp" : 
						if( _mode == "search" || _mode == "plainTreeNoEmp" ) $('#counselSave_btn').removeClass("invisible");
						break;
					case "plainTreeSelOrg" : 
						$("#counselSend_btn").removeClass('invisible');
						break;
				}
			}
			$("#POSTNUM").val(data.node.data.ZIPCDE);
			$("#POSTADDR").val(data.node.data.ZIP_ADDR);
			$("#ADDR").val(data.node.data.ADDR);
			$("#PHONE").val(data.node.data.TELPNO);
			$("#FAXNUM").val(data.node.data.FAXNO);
			$("#ZIP_CNTS_input").val(data.node.data.ZIP_CNTS);
			$("#POSTNUM2").val(data.node.data.ZIPCDE);
			$("#POSTADDR2").val(data.node.data.ZIP_ADDR);
			$("#ADDR2").val(data.node.data.ADDR);
			$("#PHONE2").val(data.node.data.TELPNO);
			$("#FAXNUM2").val(data.node.data.FAXNO);
			$("#ZIP_CNTS_input").val(data.node.data.ZIP_CNTS);
		},

	});
	
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
	
	tree = $.ui.fancytree.getTree("#tree");
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
			$("#counselSend_btn").addClass('invisible');
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
			break;
	}

}



/**
 * API 조회
 */
const _getList = {

	// 본부/사업국/센터 찾기 전체리스트 가져오기
	orgList(){
		var param = {
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
				console.log("orgList값 >> ",response.dsRecv);
				var templist = response.dsRecv;
				for(index in templist) {
					templist[index].title = templist[index].DEPT_NAME;
				}
				_openOrgList = templist;
				_sortList.orgList(templist);
				_isChange = false;
			}, error: function (response) {
			}
		});

		param = {
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
				console.log("orgList값 >> ",response.dsRecv);
				var templist = response.dsRecv;
				for(index in templist) {
					templist[index].title = templist[index].DEPT_NAME;
				}
				_closedOrgList = templist;
			}, error: function (response) {
			}
		});
	},

	// 지점 내 구성원 목록 가져오기
	employeeList(dsSend){
			var param = {
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
				console.log("employeeList >> ",response.dsRecv);
				_sortList.searchedEmpList(response.dsRecv);
			}, error: function (response) {
			}
		});
	},

	// 교사구분코드
	tchrMkCDEList(){
		var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{CODE_MK:"TCHR_MK_CDE"}]
		};

		$.ajax({
			url: API_SERVER + '/sys.getCodeBook.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				// console.log("tchrMkCDEList >> ",response.dsRecv);
				_tchrMkCDEList = response.dsRecv;
			}, error: function (response) {
			}
		});
	},

	// 관할주소 목록 가져오기
	boundAddrList : function(addr) {
		return new Promise(function(resolve, reject){

			var isYN ;
			if ( $('#includeClosed').prop("checked")==true ) isYN = 'N'; 
			else isYN = 'Y';
			
			var param = {
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
	}

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
		var lv1List = templist.filter(data => data.LV == "1" ); // 본부리스트
		var lv2List = templist.filter(data => data.LV == "2" ); // 사업국리스트
		var lv3List = templist.filter(data => data.LV == "3" ); // 센터리스트

		for(index in lv2List){
			var tempLv3List = lv3List.filter(data=> data.PARE_DEPT_ID == lv2List[index].PARE_DEPT_ID);
			lv2List[index].children = tempLv3List;
			lv2List[index].folder = true;
		}

		for(index in lv1List) {
			var tempLv2List = lv2List.filter(data=> data.UP_DEPT == lv1List[index].UP_DEPT);
			lv1List[index].children = tempLv2List;
			lv1List[index].folder = true;
		}

		tree.reload(lv1List); // 트리구조 삽입
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
				};
			});
			employeeListGrid.resetData(tempGrid);
		} else {
			employeeListGrid.resetData([]);
		}
	},

	/**
	 * 조회된 구성원 리스트 트리구조 클릭시 그리드 필터
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

		var temp = respondeData;
		for ( index in temp ){
			// 구성원의 교사구분 처리
			if (! isEmpty(_tchrMkCDEList.filter(data => data.CODE_ID == temp[index].TCHR_MK_CDE)) ) {
				temp[index].TCHR_MK_NAME = _tchrMkCDEList.filter(data => data.CODE_ID == temp[index].TCHR_MK_CDE)[0].CODE_NAME;
			}

			// 검색하려는 사람의 본부/사업국/센터명 및 ID 처리
			if ( temp[index].LV == '1' ) {//본부
				var chk_name = treeData.filter(data => data.LV == '1' );
				chk_name = chk_name.filter(data => data.UP_DEPT == temp[index].DEPT_ID);
				
				if(chk_name.length > 0) {
					temp[index].ORG_NAME = chk_name[0].DEPT_NAME;
					temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
					temp[index].UP_DEPT_ID = temp[index].DEPT_ID;
					temp[index].PARE_DEPT_NAME = "-";
					temp[index].DEPT_NAME = "-";
				}
			} else if (temp[index].LV == '2') {//사업국
				var chk_name = treeData.filter(data => data.LV == '2' );
				chk_name = chk_name.filter(data => data.PARE_DEPT_ID == temp[index].DEPT_ID);
				if(chk_name.length > 0) {
					temp[index].ORG_NAME = chk_name[0].DEPT_NAME;
					temp[index].PARE_DEPT_NAME = chk_name[0].DEPT_NAME;
					temp[index].PARE_DEPT_ID = temp[index].DEPT_ID;
						
					var UP_DEPT_ID = chk_name[0].UP_DEPT;
					chk_name = treeData.filter(data => data.LV == '1' );
					chk_name = chk_name.filter(data => data.UP_DEPT == UP_DEPT_ID);
					if(chk_name.length > 0) temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
					temp[index].UP_DEPT_ID = UP_DEPT_ID;
					temp[index].DEPT_NAME = "-";
				}
				
			} else if (temp[index].LV == '3') {//센터
				var chk_name = treeData.filter(data => data.LV == '3' );
				chk_name = chk_name.filter(data => data.DEPT_ID == temp[index].DEPT_ID);
				
				if(chk_name.length > 0) {
					temp[index].ORG_NAME = chk_name[0].DEPT_NAME;
					temp[index].DEPT_NAME = chk_name[0].DEPT_NAME;

					var UP_DEPT_ID = chk_name[0].UP_DEPT;
					var PARE_DEPT_ID = chk_name[0].PARE_DEPT_ID;
					chk_name = treeData.filter(data => data.LV == '1' );
					chk_name = chk_name.filter(data => data.UP_DEPT == UP_DEPT_ID);
					if(chk_name.length > 0) temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
					temp[index].UP_DEPT_ID = UP_DEPT_ID;

					chk_name = treeData.filter(data => data.LV == '2' );
					chk_name = chk_name.filter(data => data.PARE_DEPT_ID == PARE_DEPT_ID);
					
					if(chk_name.length > 0) temp[index].PARE_DEPT_NAME = chk_name[0].DEPT_NAME;
					temp[index].PARE_DEPT_ID = PARE_DEPT_ID;
				}
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
				};
			});
			employeeListGrid.resetData(tempGrid);
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
					if ( index == nameTempList.length-1 ) code += 'node.data.DEPT_NAME.indexOf(\''+nameTempList[index].ORG_NAME+'\') > -1 && node.data.LV == \'1\' ';
					else code += 'node.data.DEPT_NAME.indexOf(\''+nameTempList[index].ORG_NAME+'\') > -1 && node.data.LV == \'1\'  || ';
				} else if ( temp[index].LV == "2" ){
					if ( index == nameTempList.length-1 ) code += 'node.data.DEPT_NAME.indexOf(\''+nameTempList[index].ORG_NAME+'\') > -1 && node.data.LV == \'2\' ';
					else code += 'node.data.DEPT_NAME.indexOf(\''+nameTempList[index].ORG_NAME+'\') > -1 && node.data.LV == \'2\'  || ';
				} else {
					if ( index == nameTempList.length-1 ) code += 'node.data.DEPT_NAME.indexOf(\''+nameTempList[index].ORG_NAME+'\') > -1 && node.data.LV == \'3\' ';
					else code += 'node.data.DEPT_NAME.indexOf(\''+nameTempList[index].ORG_NAME+'\') > -1 && node.data.LV == \'3\'  || ';
				}
			}
			var attr = {mode:"hide", autoExpand : true};
			
			_openOrgList.filter(data => data.DEPT_NAME == '3' );

			// console.log(code);
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

	// selectedList() : 트리에서 선택된 본부/사업국/센터를 팝업이전 화면으로 보내는 버튼
	selectedList(){
		if ( _mode == "chkTree" ) {
			var node = tree.getSelectedNodes();
			var tempList = [];
			for ( index in node ) {
				tempList.push(node[index].data);
			}
	
			var lv1List = removeDuplicates(tempList, 'UP_DEPT') // 본부리스트
			var sendLv1 = [];
			for ( index in lv1List ) {
				sendLv1.push(lv1List[index].UP_DEPT);
			}
	
			var lv2List = tempList.filter(data => data.LV == "2" ); // 사업국리스트
				lv2List = lv2List.concat(tempList.filter(data => data.LV == "3" )); 
				lv2List = removeDuplicates(lv2List, 'PARE_DEPT_ID');
			var sendLv2 = [];
			for ( index in lv2List ) {
				sendLv2.push(lv2List[index].PARE_DEPT_ID);
			}
	
			var lv3List = tempList.filter(data => data.LV == "3" ); // 센터리스트
				lv3List = removeDuplicates(lv3List, 'DEPT_ID')
			var sendLv3 = [];
			for ( index in lv3List ) {
				sendLv3.push(lv3List[index].DEPT_ID);
			} 
				
			// console.log("lv1 List >> ",sendLv1);
			// console.log("lv2 List >> ",sendLv2);
			// console.log("lv3 List >> ",sendLv3);

			

			/**
			 * 전송할 데이터
			 * @param org    : 선택한 본부/사업국/지점 정보
			 * @param member : 선택된 구성원(직원) 정보 
			 */

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
				};
			});

			/**
			 * 전송할 데이터
			 * @param nameArray    : 그리드에서 선택한 사람의 이름 배열
			 * @param idArray      : 그리드에서 선택한 사람의 ID 배열
			 */
			var nameArray = [];
			var idArray = [];

			// 선택한 사람 넣기
			for ( index in tempGrid) {
				idArray[index] = tempGrid[index].EMP_ID;
				nameArray[index] = tempGrid[index].NAME;
			}
			// 선택한 부서의 기본 부서장 입력(없을 경우 입력 없음)
			if (! isEmpty(_selectedNode.data.REP_EMP_ID) ){
				if (! isEmpty(_selectedNode.data.REP_EMP_ID.trim()) ) {
					if( idArray.filter(data => data == _selectedNode.data.REP_EMP_ID.trim()).length == 0 ) {
						idArray.push(_selectedNode.data.REP_EMP_ID)
						nameArray.push(_selectedNode.data.REP_EMP_NAME);
					}
				}
			}

			/**
			 * 전송할 데이터
			 * @param orgList    : 선택한 본부/사업국/지점 정보
			 */
			var orgList = {};
			if ( opener.name == 'CCEMPRO028' ) {
				if ( _selectedNode.data.LV =="3" ) {
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
					orgList.DEPT_ID = _selectedNode.parent.data.PARE_DEPT_ID;
					orgList.DIV_CDE = _selectedNode.parent.parent.data.UP_DEPT;
					orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
					orgList.DEPT_EMP_ID = _selectedNode.parent.data.REP_EMP_ID;
					orgList.LC_EMP_ID = _selectedNode.data.REP_EMP_ID;
					orgList.EMP_ID_NAME  = nameArray.join(', ')
					orgList.EMP_ID_LIST = idArray.join(', ')


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
					orgList.DIV_CDE = _selectedNode.parent.data.UP_DEPT;
					orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
					orgList.DEPT_EMP_ID = _selectedNode.data.REP_EMP_ID;
					orgList.LC_EMP_ID = "";
					orgList.EMP_ID_NAME  = nameArray.join(', ')
					orgList.EMP_ID_LIST = idArray.join(', ')
				} else if ( _selectedNode.data.LV =="1" )  {
					// orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
					// orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
					// orgList.UP_DEPT_ID = _selectedNode.data.UP_DEPT;
					// orgList.UP_DEPT_NAME = _selectedNode.data.DEPT_NAME;
					// orgList.UP_DEPT_TEL = _selectedNode.data.TELPNO;
					// orgList.UP_DEPT_FAX = _selectedNode.data.FAXNO;
					// orgList.PARE_DEPT_ID = "";
					// orgList.PARE_DEPT_NAME = "";
					// orgList.PARE_DEPT_TEL = "";
					// orgList.LC_DEPT_ID = "";
					// orgList.LC_DEPT_NAME = "";
					// orgList.LC_DEPT_TEL = ""
					// orgList.LV = _selectedNode.data.LV;
					// orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
					// orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
					// orgList.REP_EMP_ID = _selectedNode.data.REP_EMP_ID;
					// orgList.REP_EMP_NAME = _selectedNode.data.REP_EMP_NAME;
				}
				opener.setTransDisPlay(orgList);
				console.log(orgList);
			} else if ( opener.name == 'CCEMPRO022' ) {
				if ( _selectedNode.data.LV =="1" ) {
					orgList.PROC_DEPT_ID = _selectedNode.data.UP_DEPT;		
				} else if ( _selectedNode.data.LV =="2" ) {
					orgList.PROC_DEPT_ID = _selectedNode.data.PARE_DEPT_ID;		
				} else if ( _selectedNode.data.LV =="3" ) {
					orgList.PROC_DEPT_ID = _selectedNode.data.DEPT_ID;		
				}
				orgList.PROC_DEPT_NAME = _selectedNode.data.DEPT_NAME;
				orgList.EMP_NAME_LIST  = nameArray.join(', ')
				orgList.EMP_ID_LIST = idArray.join(', ')
				opener.setDisPlayDn(orgList);
				console.log(orgList);
			}
			window.close();

		} else if ( _mode =="plainTreeSelOrg") {
			var orgList = {};
			
			/**
			 * 전송할 데이터
			 * @param orgList    : 선택한 본부/사업국/지점 정보
			 */
			if ( opener.name == 'CCEMPRO022' ) {
				if ( _selectedNode.data.LV =="3" ) {
					orgList.LC_ID = _selectedNode.data.DEPT_ID;
					orgList.LC_EMP_ID = _selectedNode.data.REP_EMP_ID;
					orgList.DIV_CDE = _selectedNode.parent.parent.data.UP_DEPT;
					orgList.UPDEPTNAME = _selectedNode.parent.parent.data.DEPT_NAME;
					orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
					orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
					orgList.DEPT_ID = _selectedNode.parent.data.PARE_DEPT_ID;
					orgList.DEPT_NAME = _selectedNode.parent.data.DEPT_NAME;
					orgList.DEPT_EMP_ID = _selectedNode.parent.data.REP_EMP_ID;
					orgList.TELPNO_DEPT = _selectedNode.parent.data.TELPNO;
					orgList.LC_NAME = _selectedNode.data.DEPT_NAME;
					orgList.TELPNO_LC = _selectedNode.data.TELPNO;
				} else if ( _selectedNode.data.LV =="2" ) {
					orgList.LC_ID = "";
					orgList.LC_EMP_ID = "";
					orgList.DIV_CDE = _selectedNode.parent.data.UP_DEPT;
					orgList.UPDEPTNAME = _selectedNode.parent.data.DEPT_NAME;
					orgList.AREA_CDE = _selectedNode.data.AREA_CDE;
					orgList.AREA_NAME = _selectedNode.data.AREA_NAME;
					orgList.DEPT_ID = _selectedNode.data.PARE_DEPT_ID;
					orgList.DEPT_NAME = _selectedNode.data.DEPT_NAME;
					orgList.DEPT_EMP_ID = _selectedNode.data.REP_EMP_ID;
					orgList.TELPNO_DEPT = _selectedNode.data.TELPNO;
					orgList.LC_NAME = "";
					orgList.TELPNO_LC = "";
				} 
				opener.setDisPlayUp(orgList);
			} else {
				if ( _selectedNode.data.LV =="3" ) {
					orgList.BRAND_ID = _selectedNode.data.BRAND_ID;
					orgList.BRAND_NAME = _selectedNode.data.BRAND_NAME;
					orgList.UP_DEPT_ID = _selectedNode.parent.parent.data.UP_DEPT;
					orgList.UP_DEPT_NAME = _selectedNode.parent.parent.data.DEPT_NAME;
					orgList.UP_DEPT_TEL = _selectedNode.parent.parent.data.TELPNO;
					orgList.PARE_DEPT_ID = _selectedNode.parent.data.PARE_DEPT_ID;
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
					orgList.UP_DEPT_ID = _selectedNode.parent.data.UP_DEPT;
					orgList.UP_DEPT_NAME = _selectedNode.parent.data.DEPT_NAME;
					orgList.UP_DEPT_TEL = _selectedNode.parent.data.TELPNO;
					orgList.PARE_DEPT_ID = _selectedNode.data.PARE_DEPT_ID;
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
					orgList.UP_DEPT_ID = _selectedNode.data.UP_DEPT;
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
	
			// 검색 값 설정
			var searchTxt = $('#searchOrg_txt').val();
			if ( isEmpty(searchTxt) ) {										// 빈 값으로 검색하는 경우 : 전체 트리 표시
				tree.clearFilter();
				tree.expandAll(false);
			} else if ( $('#searchOrg_radio1').prop("checked")==true ) { 	// 주소명 검색 : (광역시/도, 시/군/구/, 읍/면/동)
				var match = $.trim($('#searchOrg_txt').val());
				tree.filterNodes( 
					function(node) {
						if ( !isEmpty(node.data.ZIP_ADDR) ) {
							return node.data.ZIP_ADDR.indexOf(match) > -1;
						}
					}, {mode : "hide"}
				);
			} else if ( $('#searchOrg_radio2').prop("checked")==true ) {
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
			} else {														// 본부/사업국/센터명
				var txt = $.trim($('#searchOrg_txt').val());
				var code = `node.data.DEPT_NAME.indexOf('`+txt+`') > -1`
				tree.filterNodes( 
					function(node) {
						if ( !isEmpty(node.data.DEPT_NAME) ) {
							return eval(code);
						}
					}, {mode : "hide"}
				);
			}
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
		$('#searchOrg_radio1').click();
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
		if ( _selectedNode.data.LV == '2') {
			param[0].CHG_DEPT = "Y";
			param[0].DEPT_ID = _selectedNode.data.PARE_DEPT_ID;
			param[0].ZIP_CNTS = $('#ZIP_CNTS_input').val();
		} else if (_selectedNode.data.LV == '3') {
			param[0].CHG_LC = "Y";
			param[0].LC_ID = _selectedNode.data.DEPT_ID;
			param[0].ZIP_CNTS = $('#ZIP_CNTS_input').val();
		} else {
			return false;
		}
		var node = tree.getActiveNode();
		console.log(param);
		// console.log(node.key);
		_getList.saveZIPCNTS(param).then(function() {
			_getList.orgList();
			// tree.activateKey(node.key);
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
	}

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
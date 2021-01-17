var employeeListGrid; 	// 구성원 그리드
var tree;				// 트리구성표
var _treeSelectedList;	// 선택된 트리 리스트
var _tchrMkCDEList;		// 선생님 직책 리스트

var _closedOrgList; 	// 폐쇄된 조직 포함
var _openOrgList;		// 오픈한 조직만
var _isChange; 			// 선택값 변경여부
var _isEmpSearch; 		// 구성원 검색 시

function init(){
	// 구성원 리스트 grid 설정
	employeeListGrid = new Grid({
		el: document.getElementById('employeeListGrid'),
		bodyHeight: 243,
		rowHeaders: [
			{ type: 'checkbox', header: "", minWidth: 30, },
			{ type: 'rowNum', header: "NO", }
		],
		columnOptions: { minWidth: 50, resizable: true, frozenCount: 0, frozenBorderWidth: 1, },
		columns: [
			{
				header: '교사구분',
				name: 'TCHR_MK_NAME',
				width: 200,
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
				header: '핸드폰번호',
				name: 'MOBILNO',
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
		checkbox: true,
		selectMode: 3,

		// 본부/사업국/센터 설정 시 해당 정보 표시
		activate: function(event, data) {
			// $("#statusLine").text(event.type + ": " + data.node);
			// console.log(event, data, ", targetType=" + data.targetType);
			
			// 본부/사업국/센터 정보창 변경

			
			// 선택 후 조직 내 구성원 조회
			var param = [];
			if(data.node.data.LV == "1"){
				$("#HQ_NAME").text(data.node.title);
				$("#DEPT_NAME").text("");
				$("#LC_NAME").text("");
				$("#HQ_NAME2").text(data.node.title);
				$("#DEPT_NAME2").text("");
				$("#LC_NAME2").text("");

				// 본부내 인원 검색
				if (_isEmpSearch) {

				} else {
					param = [{SEARCH_DEPT_ID:"Y", SEARCH_DEPT_ID_TXT: data.node.data.UP_DEPT }]
					_getList.employeeList(param);
				}
			} else if(data.node.data.LV == "2"){
				$("#HQ_NAME").text(data.node.parent.title);
				$("#DEPT_NAME").text(data.node.title);
				$("#LC_NAME").text("");
				$("#HQ_NAME2").text(data.node.parent.title);
				$("#DEPT_NAME2").text(data.node.title);
				$("#LC_NAME2").text("");

				// 사업국 인원 검색
				if (_isEmpSearch) {

				} else {
					param = [{SEARCH_DEPT_ID:"Y", SEARCH_DEPT_ID_TXT: data.node.data.PARE_DEPT_ID }]
					_getList.employeeList(param);
				}
			} else if(data.node.data.LV == "3"){
				$("#HQ_NAME").text(data.node.parent.parent.title);
				$("#DEPT_NAME").text(data.node.parent.title);
				$("#LC_NAME").text(data.node.title);
				$("#HQ_NAME2").text(data.node.parent.parent.title);
				$("#DEPT_NAME2").text(data.node.parent.title);
				$("#LC_NAME2").text(data.node.title);

				// 센터 인원 검색
				if (_isEmpSearch) {

				} else {
					param = [{SEARCH_DEPT_ID:"Y", SEARCH_DEPT_ID_TXT: data.node.data.DEPT_ID }]
					_getList.employeeList(param);
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
		},

		// 체크박스로 선택된 값들 전역변수에 임시 저장
		select: function(event, data) {
			// _treeSelectedList = data.tree.getSelectedNodes();
		}
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
	
	$('#searchOrg_txt').on("change search", function(e){
	});
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
				var treeData = [];
				// 오픈/폐쇄기관을 확인할 때 
				if ( $('#includeClosed').prop("checked")==true ) treeData = _closedOrgList;
				else treeData = _openOrgList;

				var temp = response.dsRecv;
				console.log(temp);
				for ( index in temp ){
					// 구성원의 교사구분 처리
					if (! isEmpty(_tchrMkCDEList.filter(data => data.CODE_ID == temp[index].TCHR_MK_CDE)) ) {
						temp[index].TCHR_MK_NAME = _tchrMkCDEList.filter(data => data.CODE_ID == temp[index].TCHR_MK_CDE)[0].CODE_NAME;
					}
					// 검색하려는 사람의 본부/사업국/센터명 및 ID 처리
					if ( temp[index].LV == '1' ) {
						var chk_name = treeData.filter(data => data.LV == '1' );
							chk_name = chk_name.filter(data => data.UP_DEPT == temp[index].DEPT_ID);
						if(chk_name.length > 0) {
							temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
							temp[index].UP_DEPT_ID = temp[index].DEPT_ID;
							temp[index].PARE_DEPT_NAME = "-";
							temp[index].DEPT_NAME = "-";
						}
					} else if (temp[index].LV == '2') {
						var chk_name = treeData.filter(data => data.LV == '2' );
						chk_name = chk_name.filter(data => data.PARE_DEPT_ID == temp[index].DEPT_ID);
						
						// 체크용
						// var eee11 = treeData.filter(data => data.LV == '2' );
						// eee11 = chk_name.filter(data => data.DEPT_NAME == "정명숙 BCL");
						// console.log(temp[index].DEPT_ID);
						// console.log(eee11);

						if(chk_name.length > 0) {
							temp[index].PARE_DEPT_NAME = chk_name[0].DEPT_NAME;
							temp[index].PARE_DEPT_ID = temp[index].DEPT_ID;
	
							var UP_DEPT_ID = chk_name[0].UP_DEPT;
							chk_name = treeData.filter(data => data.LV == '1' );
							chk_name = chk_name.filter(data => data.UP_DEPT == UP_DEPT_ID);
							temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
							temp[index].UP_DEPT_ID = UP_DEPT_ID;
							temp[index].DEPT_NAME = "-";
						}
					} else if (temp[index].LV == '3') {
						var chk_name = treeData.filter(data => data.LV == '3' );
						chk_name = chk_name.filter(data => data.DEPT_ID == temp[index].DEPT_ID);
						// console.log("temp[index].DEPT_ID >> ",temp[index].DEPT_ID);
						if(chk_name.length > 0) {
							temp[index].DEPT_NAME = chk_name[0].DEPT_NAME;
	
							var UP_DEPT_ID = chk_name[0].UP_DEPT;
							var PARE_DEPT_ID = chk_name[0].PARE_DEPT_ID;
							chk_name = treeData.filter(data => data.LV == '1' );
							chk_name = chk_name.filter(data => data.UP_DEPT == UP_DEPT_ID);
							if(chk_name.length > 0) temp[index].UP_DEPT_NAME = chk_name[0].DEPT_NAME;
							// console.log("UP_DEPT_ID >> ",UP_DEPT_ID);
							temp[index].UP_DEPT_ID = UP_DEPT_ID;
	
							chk_name = treeData.filter(data => data.LV == '2' );
							chk_name = chk_name.filter(data => data.PARE_DEPT_ID == PARE_DEPT_ID);
							if(chk_name.length > 0) temp[index].PARE_DEPT_NAME = chk_name[0].DEPT_NAME;
							// console.log("PARE_DEPT_ID >> ",PARE_DEPT_ID);
							temp[index].PARE_DEPT_ID = PARE_DEPT_ID
						}
					}
				}
				console.log("구성원정보 >>", temp)
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

				temp = removeDuplicates(temp, "DEPT_NAME");
				// 구성원 검색 시 : 트리구조 필터 적용
				if (_isEmpSearch) {
					var code = '';
					for ( index in temp ) {
						if ( temp[index].LV == "1" ){
							if ( index == temp.length-1 ) code += 'node.data.DEPT_NAME.indexOf(\''+temp[index].UP_DEPT_NAME+'\') > -1'
							else code += 'node.data.DEPT_NAME.indexOf(\''+temp[index].UP_DEPT_NAME+'\') > -1 || '
						} else if ( temp[index].LV == "2" ){
							if ( index == temp.length-1 ) code += 'node.data.DEPT_NAME.indexOf(\''+temp[index].PARE_DEPT_NAME+'\') > -1'
							else code += 'node.data.DEPT_NAME.indexOf(\''+temp[index].PARE_DEPT_NAME+'\') > -1 || '
						} else {
							if ( index == temp.length-1 ) code += 'node.data.DEPT_NAME.indexOf(\''+temp[index].DEPT_NAME+'\') > -1'
							else code += 'node.data.DEPT_NAME.indexOf(\''+temp[index].DEPT_NAME+'\') > -1 || '
						}
					}

					console.log(code);
					tree.filterNodes( 
						function(node) {
							if ( !isEmpty(node.data.DEPT_NAME) ) {
								return eval(code);
							}
						}, {mode : "hide"}
					);
				}
				
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
				console.log("tchrMkCDEList >> ",response.dsRecv);
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
					console.log("boundAddrList >> ",response.dsRecv);
					resolve(response.dsRecv);
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
			
		console.log("lv1 List >> ",sendLv1);
		console.log("lv2 List >> ",sendLv2);
		console.log("lv3 List >> ",sendLv3);
	},

	// searchOrg() : 조회기능
	searchOrg() {
		// 본부/사업국/센터 선택시 검색
		if ( $('#deptSearch').prop("checked")==true ) {
			var treeData
			// 오픈/폐쇄기관을 확인할 때 
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
					console.log(code);
					tree.filterNodes( 
						function(node) {
							if ( !isEmpty(node.data.DEPT_ID) ) {
								return eval(code);
							}
						}, {mode : "hide"}
					);
				})
			} else {														// 본부/사업국/센터명
				// var match = $.trim($('#searchOrg_txt').val());
				// tree.filterNodes(match,{mode:"hide"});

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
		}
		// 구성원 선택시 검색
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
				param[0].SEARCH_STS_CDE = "Y"
				if ($('#searchEmp_selectbox').val()=="재직") param[0].SEARCH_STS_CDE_TXT = "9";
				if ($('#searchEmp_selectbox').val()=="사업") param[0].SEARCH_STS_CDE_TXT = "3";
				if ($('#searchEmp_selectbox').val()=="해지") param[0].SEARCH_STS_CDE_TXT = "4";
				
			}
			
			console.log(param);
			if ( isEmpty(param[0]) ) {
				alert("검색값을 입력해주세요.");
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
		$('#searchOrg_radio1').attr("checked", true);
		_sortList.orgList(treeData);
		_isEmpSearch = false;
	},

	// resetFilter() : 필터초기화(선택값 유지)
	resetFilter(){
		tree.clearFilter();
		tree.expandAll(false);
		_isEmpSearch = false;
	},

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
 * 탭 이동시, employeeListGrid가 refresh되어 표의 틀어짐 방지
 */
$("a[data-toggle='tab']").on("shown.bs.tab", function(e) {
	employeeListGrid.refreshLayout();
});


$('#searchOrg_txt').keyup(function(){
    if(event.keyCode == 13){
        $('#searchBtn').trigger('click');
    }
});


init();
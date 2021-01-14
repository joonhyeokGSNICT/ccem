var employeeListGrid; 	// 구성원 그리드
var tree;				// 트리구성표
var _treeSelectedList;	// 선택된 트리 리스트

var _closedOrgList; 	// 폐쇄된 조직 포함
var _openOrgList;		// 오픈한 조직만


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
				header: '구분',
				name: 'type',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '성명',
				name: 'name',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '사번',
				name: 'emNum',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '본부',
				name: 'hqName',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '사업국',
				name: 'deptName',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '센터',
				name: 'lcName',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '직책',
				name: 'level',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '선생님구분',
				name: 'tType',
				width: 200,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '핸드폰번호',
				name: 'phone',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '재직구분',
				name: 'status',
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
			autoExpand: true,
		},
		checkbox: true,
		selectMode: 3,

		// 본부/사업국/센터 설정 시 해당 정보 표시
		activate: function(event, data) {
			// $("#statusLine").text(event.type + ": " + data.node);
			// console.log(event, data, ", targetType=" + data.targetType);
			
			// 본부/사업국/센터 정보창 변경
			if(data.node.data.LV == "1"){
				$("#HQ_NAME").text(data.node.title);
				$("#DEPT_NAME").text("");
				$("#LC_NAME").text("");
				$("#HQ_NAME2").text(data.node.title);
				$("#DEPT_NAME2").text("");
				$("#LC_NAME2").text("");
			} else if(data.node.data.LV == "2"){
				$("#HQ_NAME").text(data.node.parent.title);
				$("#DEPT_NAME").text(data.node.title);
				$("#LC_NAME").text("");
				$("#HQ_NAME2").text(data.node.parent.title);
				$("#DEPT_NAME2").text(data.node.title);
				$("#LC_NAME2").text("");
			} else if(data.node.data.LV == "3"){
				$("#HQ_NAME").text(data.node.parent.parent.title);
				$("#DEPT_NAME").text(data.node.parent.title);
				$("#LC_NAME").text(data.node.title);
				$("#HQ_NAME2").text(data.node.parent.parent.title);
				$("#DEPT_NAME2").text(data.node.parent.title);
				$("#LC_NAME2").text(data.node.title);
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

			// 선택 후 조직 내 구성원 조회
			_getList.employeeList(data.node.data.DEPT_ID);
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
	employeeList(orgId){
		var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{SEARCH_DEPT_ID:"Y", SEARCH_DEPT_ID_TXT:orgId}]
			// dsSend: [{SEARCH_STS_CDE:"Y", SEARCH_STS_CDE_TXT:"9"}]
			// dsSend: [{}]
		};

		$.ajax({
			url: API_SERVER + '/sys.getEmployeeList.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				// console.log("employeeList >> ",response.dsRecv);
				var templist = response.dsRecv;
				var lv1List = templist.filter(data => data.LV == "1" );
				var lv2List = templist.filter(data => data.LV == "2" );
				var lv3List = templist.filter(data => data.LV == "3" );
				console.log("lv3 List >> ",lv3List);
				console.log("lv2 List >> ",lv2List);
				console.log("lv1 List >> ",lv1List);
			}, error: function (response) {
			}
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
			var tempLv3List = lv3List.filter(data=> data.PARE_DEPT_ID == lv2List[index].DEPT_ID);
			lv2List[index].children = tempLv3List;
			lv2List[index].folder = true;
		}

		for(index in lv1List) {
			var tempLv2List = lv2List.filter(data=> data.UP_DEPT == lv1List[index].DEPT_ID);
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
		var treeData
		if ( $('#includeClosed').prop("checked")==true ) treeData = _closedOrgList;
		else treeData = _openOrgList;

		// 검색 값 설정
		var searchTxt = $('#searchOrg_txt').val();
		console.log(searchTxt);
		if ( $('#searchOrg_radio1').prop("checked")==true ) {
			var match = $.trim($('#searchOrg_txt').val());
			tree.filterNodes( 
				function(node) {
					if ( !isEmpty(node.data.ZIP_ADDR) ) {
						return node.data.ZIP_ADDR.indexOf(match) > -1;
					}
				}, {mode : "hide"}
			);
		} else if ( $('#searchOrg_radio2').prop("checked")==true ) {
			
		} else {
			var n,
			match = $.trim($('#searchOrg_txt').val());
			n = tree.filterNodes(match, { mode: "hide" });
		}
		// console.log(treeData);
		// _sortList.orgList(treeData);
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
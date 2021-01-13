var employeeListGrid;
var tree;

$(function(){
	// 구성원 리스트 grid
	employeeListGrid = new Grid({
	el: document.getElementById('employeeListGrid'),
	bodyHeight: 243,
	rowHeaders: [
    {
		type: 'checkbox',
		header: "",
		minWidth: 30,
	},
	{
        type: 'rowNum',
        header: "NO",
    }],
    columnOptions: {
        minWidth: 50,
        resizable: true,
        frozenCount: 0,
        frozenBorderWidth: 1,
    },
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
				width: 100,
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
		
		// 구성원 끝
	
	var tempEmployee =[{
		level:		"교사",
		emNum:		"21013354",
		name:		"박영운",
		hqName:		"서울서북BCG",
		deptName:	"용산HL",
		lcName:		"",
		type:		"직원",
		tType:		"영업 OFFICER",
		status:		"재직",
		phone:		"010-1234-5678"
	},
	{
		level:		"교육팀장",
		emNum:		"21052160",
		name:		"이인실",
		hqName:		"서울서북BCG",
		deptName:	"용산HL",
		lcName:		"",
		type:		"직원",
		tType:		"영업 MANAGER",
		status:		"재직",
		phone:		"010-1234-5678"
	},
	{
		level:		"팀원",
		emNum:		"21090507",
		name:		"원순이",
		hqName:		"서울서북BCG",
		deptName:	"용산HL",
		lcName:		"",
		type:		"직원",
		tType:		"서무/경리 Support",
		status:		"재직",
		phone:		"010-1234-5678"
	},
	{
		level:		"교육국장",
		emNum:		"22003034",
		name:		"이종필",
		hqName:		"서울서북BCG",
		deptName:	"용산HL",
		lcName:		"",
		type:		"직원",
		tType:		"영업 MANAGER",
		status:		"재직",
		phone:		"010-1234-5678"
	},
	{
		level:		"교사",
		emNum:		"22005509",
		name:		"이윤희",
		hqName:		"서울서북BCG",
		deptName:	"용산HL",
		lcName:		"",
		type:		"직원",
		tType:		"영업 ASSOCIATE",
		status:		"재직",
		phone:		"010-1234-5678"
	}];
	
	employeeListGrid.resetData(tempEmployee);
	
	$("a[data-toggle='tab']").on("shown.bs.tab", function(e) {
		employeeListGrid.refreshLayout();
	});
	
	$("#tree").fancytree({
				click: function(event, data) {
					console.log(event, data, ", targetType=" + data.targetType);
					if(data.node.data.LV == "1"){
						$("#HQ_NAME").text(data.node.title);
						$("#DEPT_NAME").text("");
						$("#LC_NAME").text("");
						$("#POSTNUM").val(data.node.data.ZIPCDE);
						$("#POSTADDR").val(data.node.data.ZIP_ADDR);
						$("#ADDR").val(data.node.data.ADDR);
						$("#PHONE").val(data.node.data.TELPNO);
						$("#FAXNUM").val(data.node.data.FAXNO);
						$("#HQ_NAME2").text(data.node.title);
						$("#DEPT_NAME2").text("");
						$("#LC_NAME2").text("");
						$("#POSTNUM2").val(data.node.data.ZIPCDE);
						$("#POSTADDR2").val(data.node.data.ZIP_ADDR);
						$("#ADDR2").val(data.node.data.ADDR);
						$("#PHONE2").val(data.node.data.TELPNO);
						$("#FAXNUM2").val(data.node.data.FAXNO);
					} else if(data.node.data.LV == "2"){
						$("#HQ_NAME").text(data.node.parent.title);
						$("#DEPT_NAME").text(data.node.title);
						$("#LC_NAME").text("");
						$("#POSTNUM").val(data.node.data.ZIPCDE);
						$("#POSTADDR").val(data.node.data.ZIP_ADDR);
						$("#ADDR").val(data.node.data.ADDR);
						$("#PHONE").val(data.node.data.TELPNO);
						$("#FAXNUM").val(data.node.data.FAXNO);
						$("#HQ_NAME2").text(data.node.parent.title);
						$("#DEPT_NAME2").text(data.node.title);
						$("#LC_NAME2").text("");
						$("#POSTNUM2").val(data.node.data.ZIPCDE);
						$("#POSTADDR2").val(data.node.data.ZIP_ADDR);
						$("#ADDR2").val(data.node.data.ADDR);
						$("#PHONE2").val(data.node.data.TELPNO);
						$("#FAXNUM2").val(data.node.data.FAXNO);
					} else if(data.node.data.LV == "3"){
						$("#HQ_NAME").text(data.node.parent.parent.title);
						$("#DEPT_NAME").text(data.node.parent.title);
						$("#LC_NAME").text(data.node.title);
						$("#POSTNUM").val(data.node.data.ZIPCDE);
						$("#POSTADDR").val(data.node.data.ZIP_ADDR);
						$("#ADDR").val(data.node.data.ADDR);
						$("#PHONE").val(data.node.data.TELPNO);
						$("#FAXNUM").val(data.node.data.FAXNO);
						$("#HQ_NAME2").text(data.node.parent.parent.title);
						$("#DEPT_NAME2").text(data.node.parent.title);
						$("#LC_NAME2").text(data.node.title);
						$("#POSTNUM2").val(data.node.data.ZIPCDE);
						$("#POSTADDR2").val(data.node.data.ZIP_ADDR);
						$("#ADDR2").val(data.node.data.ADDR);
						$("#PHONE2").val(data.node.data.TELPNO);
						$("#FAXNUM2").val(data.node.data.FAXNO);
					}
					_getList.employeeList(data.node.data.DEPT_ID);
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
});



/**
 * API 조회
 */
const _getList = {
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
				// var temp = response.dsRecv;
				// temp = temp.map(el => {
				// 	return {
				// 		ZIPCDE : 	el.ZIPCDE,
				// 		ZIP_ADDR : el.ZIP_ADDR,
				// 		DDD : el.DDD,
				// 		AREA_CDE : el.AREA_CDE,
				// 		AREA_NAME : el.AREA_NAME,
				// 	};
				// });
				// _addrGrid.resetData(temp);
				var templist = response.dsRecv;
				for(index in templist) {
					templist[index].title = templist[index].DEPT_NAME;
				}

				_sortList.orgList(templist);
			}, error: function (response) {
			}
		});
	},
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
				console.log("employeeList >> ",response.dsRecv);
				// var temp = response.dsRecv;
				// temp = temp.map(el => {
				// 	return {
				// 		ZIPCDE : 	el.ZIPCDE,
				// 		ZIP_ADDR : el.ZIP_ADDR,
				// 		DDD : el.DDD,
				// 		AREA_CDE : el.AREA_CDE,
				// 		AREA_NAME : el.AREA_NAME,
				// 	};
				// });
				// _addrGrid.resetData(temp);
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
 * 트리구조 필드 데이터 정렬
 */
const _sortList = {
	orgList(templist){
		var lv1List = templist.filter(data => data.LV == "1" );
		var lv2List = templist.filter(data => data.LV == "2" );
		var lv3List = templist.filter(data => data.LV == "3" );
		console.log("lv3 List >> ",lv3List);
		console.log("lv2 List >> ",lv2List);
		console.log("lv1 List >> ",lv1List);

		// for(index in lv2List) {
		// 	lv3List.filter(data=> data.PARE_DEPT_ID == lv2List[index].DEPT_ID);
		// }
		for(index in lv2List){
			var tempLv3List = lv3List.filter(data=> data.PARE_DEPT_ID == lv2List[index].DEPT_ID);
			// console.log("tempLv3List // "+lv2List[index].DEPT_NAME+" >> ", tempLv3List);
			lv2List[index].children = tempLv3List;
			lv2List[index].folder = true;
		}

		for(index in lv1List) {
			var tempLv2List = lv2List.filter(data=> data.UP_DEPT == lv1List[index].DEPT_ID);
			// console.log("tempLv2List // "+lv1List[index].DEPT_NAME+" >> ", tempLv2List);
			lv1List[index].children = tempLv2List;
			lv1List[index].folder = true;
		}

		tree.reload(lv1List);

	}
}
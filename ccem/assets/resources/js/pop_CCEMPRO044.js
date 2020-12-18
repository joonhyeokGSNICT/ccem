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

					if(data.node.parent != null){
						if(data.node.type == "지점"){
							//alert("dd");
							$("#HQ_NAME").text(data.node.parent.title);
							$("#DEPT_NAME").text(data.node.title);
							//$("#LC_NAME").text(data.node.title);
							$("#POSTNUM").val(data.node.data.POSTNUM);
							$("#POSTADDR").val(data.node.data.POSTADDR);
							$("#ADDR").val(data.node.data.ADDR);
							$("#PHONE").val(data.node.data.PHONE);
							$("#FAXNUM").val(data.node.data.FAXNUM);
							$("#HQ_NAME2").text(data.node.parent.title);
							$("#DEPT_NAME2").text(data.node.title);
							$("#POSTNUM2").val(data.node.data.POSTNUM);
							$("#POSTADDR2").val(data.node.data.POSTADDR);
							$("#ADDR2").val(data.node.data.ADDR);
							$("#PHONE2").val(data.node.data.PHONE);
							$("#FAXNUM2").val(data.node.data.FAXNUM);
							
						}else if(data.node.type == "센터"){
							$("#HQ_NAME").text(data.node.parent.parent.title);
							$("#DEPT_NAME").text(data.node.parent.title);
							$("#LC_NAME").text(data.node.title);
							$("#POSTNUM").val(data.node.data.POSTNUM);
							$("#POSTADDR").val(data.node.data.POSTADDR);
							$("#ADDR").val(data.node.data.ADDR);
							$("#PHONE").val(data.node.data.PHONE);
							$("#FAXNUM").val(data.node.data.FAXNUM);
							$("#HQ_NAME2").text(data.node.parent.parent.title);
							$("#DEPT_NAME2").text(data.node.parent.title);
							$("#LC_NAME2").text(data.node.title);
							$("#POSTNUM2").val(data.node.data.POSTNUM);
							$("#POSTADDR2").val(data.node.data.POSTADDR);
							$("#ADDR2").val(data.node.data.ADDR);
							$("#PHONE2").val(data.node.data.PHONE);
							$("#FAXNUM2").val(data.node.data.FAXNUM);
						}
					}
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
	
	tree.reload([
        {title: "북서울BCG", folder:true, expanded:true, children:[
        	{title: "용산HL", type:"지점", POSTNUM:"04317",POSTADDR:"서울 용산구 효창동",ADDR:"5-86번지 대정빌딩 2층", PHONE:"02-718-2295", FAXNUM:"02-711-2294"},
        	{title: "마포HL"},
        	{title: "은평HL"},
        	{title: "덕양HL"},
        	{title: "일산HL"},
        	{title: "교하HL"},
        	{title: "파주HL"},
        	{title: "도봉HL"},
        	{title: "성북HL"},
        	{title: "노원HL"},
        	{title: "동대문HL"},
        	{title: "성동광진HL"},
        	{title: "최덕규BCL", folder:true, children:[
        		{title: "갈현", type:"센터", POSTNUM:"04317",POSTADDR:"경기 고양시 일산동구 탄중로 323",ADDR:"86-31번지 미주빌딩", PHONE:"02-384-9509", FAXNUM:""},
        		{title: "홍은"},
        		{title: "별빛드림"},
        		{title: "중산중앙"},
        		{title: "장위"},
        		{title: "한신한진"},
        		{title: "무학"},
        		{title: "길음"},
        		{title: "정릉"},
        		{title: "공릉"},
        	]},
        	{title: "홍기연BCL", folder:true, children:[
        		{title: "갈현", type:"센터", POSTNUM:"04317",POSTADDR:"경기 고양시 일산동구 탄중로 323",ADDR:"86-31번지 미주빌딩"},
        		{title: "홍은"},
        		{title: "별빛드림"},
        		{title: "중산중앙"},
        		{title: "장위"},
        		{title: "한신한진"},
        		{title: "무학"},
        		{title: "길음"},
        		{title: "정릉"},
        		{title: "공릉"},
        	]},
        	{title: "황영애BCL", folder:true, children:[
        		{title: "갈현"},
        		{title: "홍은"},
        		{title: "별빛드림"},
        		{title: "중산중앙"},
        		{title: "장위"},
        		{title: "한신한진"},
        		{title: "무학"},
        		{title: "길음"},
        		{title: "정릉"},
        		{title: "공릉"},
        	]},
        	{title: "이은희BCL", folder:true, children:[
        		{title: "갈현"},
        		{title: "홍은"},
        		{title: "별빛드림"},
        		{title: "중산중앙"},
        		{title: "장위"},
        		{title: "한신한진"},
        		{title: "무학"},
        		{title: "길음"},
        		{title: "정릉"},
        		{title: "공릉"},
        	]}
        ]},
        {title: "node2"}
      ]).done(function(){
        //alert("reloaded");
      });
});
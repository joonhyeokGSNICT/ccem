var recordGrid;
var tree;

$(function(){
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
							
						}else if(data.node.type == "센터"){
							$("#HQ_NAME").text(data.node.parent.parent.title);
							$("#DEPT_NAME").text(data.node.parent.title);
							$("#LC_NAME").text(data.node.title);
							$("#POSTNUM").val(data.node.data.POSTNUM);
							$("#POSTADDR").val(data.node.data.POSTADDR);
							$("#ADDR").val(data.node.data.ADDR);
							$("#PHONE").val(data.node.data.PHONE);
							$("#FAXNUM").val(data.node.data.FAXNUM);
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
	
	// 녹취LIST
	recordGrid = new Grid({
		el: document.getElementById('recordGrid'),
		bodyHeight: 322,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
			{
				header: '녹취ID',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '녹취일자',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '시작시간',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '종료시간',
				name: 'name4',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '전화번호',
				name: 'name5',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '상담일자',
				name: 'name6',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '번호',
				name: 'name7',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '고객번호',
				name: 'name8',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '',
				name: 'name9',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '',
				name: 'name10',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
		],
	});
	recordGrid.on('click', (ev) => {
		recordGrid.addSelection(ev);
		recordGrid.clickSort(ev);
		recordGrid.clickCheck(ev);
    });
});
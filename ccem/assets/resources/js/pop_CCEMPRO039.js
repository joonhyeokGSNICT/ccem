let grid
var smsRecvListGrid;

$(function(){

	// 날짜 픽커
	calendarUtil.init('customerSMS_st');
	calendarUtil.init('customerSMS_ed');
	
	// input mask
    $(".calendar").each((i, el) => calendarUtil.init(el.id));

    // create grid
    smsRecvListGrid = new Grid({
        el: document.getElementById("smsRecvListGrid"),
        bodyHeight: 380,
		pageOptions: {
		  perPage: 13,
		},
		rowHeaders: [
			{
				type: 'rowNum',
                header: "NO",
            },
        ],
		columns: [
			{
				header: '수신일자',
				name: 'SMS_DATE',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
			},
			{
				header: '수신시간',
				name: 'SMS_TIME',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.time(columnInfo.value)
			},
			{
				header: '단말번호',
				name: 'MOBIL_ORGNO',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '수신번호',
				name: 'MOBIL_USERNO',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '메시지',
				name: 'MSG',
				width: 600,
				align: "center",
				sortable: true,
				ellipsis: true,
			}
		],
    });
    smsRecvListGrid.on("click", ev => {
    	if(ev.targetType="cell"){
    		smsRecvListGrid.addSelection(ev);
    		smsRecvListGrid.clickSort(ev);
    	}
    });
    
    // === 이벤트
    // 탭 이동시 이벤트
    $("a[data-toggle='tab']").on("shown.bs.tab", function(e) {
		id = $(this).attr('id');
		switch($(this).attr('id')){
		// 고객정보
		case 'recieveTab':
			smsRecvListGrid.refreshLayout();
			break;
		};
    });
    
    $(".ccemBtn").click(function(){
    	id = $(this).attr("id");
    	switch(id){
    	case 'smsSearchBtn' :
    		smsRecvListGrid.refreshLayout();
    		break;
		case 'smsSearchBtn_send' :
		    		
		    		break;
		case 'smsSearchBtn_per' :
			
			break;
		case 'smsSearchBtn' :
    		
    		break;
		case 'smsSearchBtn_send' :
		    		
		    		break;
		case 'smsSearchBtn_per' :
			
			break;
			
    	}
    });
  //검색 input 이벤트 1
	$(".searchInputCheck").keyup(function(e){
		var keyCode = e.which;
		if (keyCode === 13) { // Enter Key
		}
		if($(this).val().length != 0){	// 길이가 0일 경우 체크해제
			$("#"+$(this).attr("id") + "Check").prop("checked",true);
		}else {
			$("#"+$(this).attr("id") + "Check").prop("checked",false);
		}
	});
	
	// 고객, 선생님찾기 input 이벤트 2
	$(".searchInputCheck").change(function(e){
		//$("#"+$(this).attr("id") + "Check").prop("checked",true);
		if($(this).val().length != 0){	// 길이가 0일 경우 체크해제
			$("#"+$(this).attr("id") + "Check").prop("checked",true);
		}else {
			$("#"+$(this).attr("id") + "Check").prop("checked",false);
		}
	});
	
	// 일자 체크 이벤트
	$(".searchInputCheck_dt").keyup(function(e){
		var keyCode = e.which;
		if(keyCode === 13){
		}
		tempId = $(this).attr('id');
		if(($("#"+tempId.split('_')[0]+"_st").val().replace(/_/gi,"").length == 10 && + $("#"+tempId.split('_')[0]+"_ed").val().replace(/_/gi,"").length)){	// 길이가 10이 아닌 경우 체크해제
			$("#"+tempId.split('_')[0] + "DateCheck").prop("checked",true);
		}else {
			$("#"+tempId.split('_')[0] + "DateCheck").prop("checked",false);
		}
	});
});

/**
 * 그리드 리스트 조회
 * @param id	해당 그리드 id
 * @param grid	리스트를 표시 해 줄 그리드 객체
 * @returns
 * 21-01-04 최준혁
 */
function loadList(id, grid, listID) {
	if(currentCustInfo) {
		var param = {
				userid: currentUserInfo.user.external_id,
			    menuname: '',
				senddataids: ["send1"],
				recvdataids: ["recv1"],
				send1: [{}]
		};
		var sendUrl = '';
		
		switch(id){
		case 'getRecvSMS':		// 수신조회 
			param.menuname = "수신조회";
			param.send1[0].CUST_ID = currentCustInfo.CUST_ID;				// 고객번호
			sendUrl = '/cns.getRecvSMS.do';
			break;
		}
		
		$.ajax({
			url: API_SERVER + sendUrl,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				console.log(response);
				if(response.errcode == "0"){
					console.log("DATA ===> :" , response);
					grid.resetData(response.recv1);
					grid.refreshLayout();
				}else {
					loading.out();
					client.invoke("notify", response.errmsg, "error", 60000);
				}
			}, error: function (response) {
			}
		});
	}
}

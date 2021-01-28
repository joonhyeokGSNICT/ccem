let grid1, grid2;
var currentPayInfo;

$(function(){
	$(".calendar").keydown(function(event){
	    if(event.keyCode == '13'){
	    	getCardCharge();
	    };
	});
	
	// input mask
	$(".calendar").each((i, el) => calendarUtil.init(el.id));


	// 기본 조회 날짜 세팅
	$("#calendar2").val(getToday(0));
	$("#calendar1").val(dateFormatWithBar(addMonth(new Date(), -36)));
	
	// create grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '대상년월',
				name: 'FEE_YM',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: function(e){
					var result = e.value;
					if(e.value != null){
						result = e.value.substring(0,4) +"-"+ e.value.substring(4,6);
					}
					return result;
				}
            },
            {
				header: '과목',
				name: 'MATNR_NM',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '입금일',
				name: 'TRS_RCPT_DT',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
            {
				header: '금액',
				name: 'TRS_RCPT_AMT',
				width: 90,
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value != null?columnInfo.value.format():""
            },
            {
				header: '교사명',
				name: 'EMP_NM',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '교사사번',
				name: 'EMP_ID',
				minWidth: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
		],
	});
	grid1.on('click', (ev) => {
		if(ev.targetType=="cell"){
			grid1.addSelection(ev);
			grid1.clickSort(ev);
			currentPayInfo = grid1.getRow(ev.rowKey);
			if(currentPayInfo != null){
				getCardChargeDtl();
			}
		}
	});
	
    grid2 = new Grid({
		el: document.getElementById('grid2'),
        bodyHeight: 150,
        scrollX: false,
		columns: [
			//{Decode(TRS_RCPT_MK,"N","드림스","M","MOS","O","러닝센터","고객직접결제")}
			{
				header: '승인구분',
				name: 'TRS_RCPT_MK',
				width: 130,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: function(e){
					result = "";
					switch(e.value){
					case 'N':result = '드림스'; break;
					case 'M':result = 'MOS'; break;
					case 'O':result = '러닝센터'; break;
					default :result = '고객직접결제'; break;
					}
					return result;
				}
            },
            {
				header: '승인일자',
				name: 'TRS_RCPT_DT',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
            {
				header: '승인번호',
				name: 'TRS_RCPT_NO',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '카드번호',
				name: 'TRS_CARD_NO',
				width: 170,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '카드명',
				name: 'TRS_CARD_NM',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '총금액',
				name: 'TRS_CARD_AMT',
				width: 90,
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value != null?columnInfo.value.format():""
            },
            {
				header: '할부개월',
				name: 'TRS_QUO_MON',
				minWidth: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
		],
	});
	grid2.on('click', (ev) => {
		if(ev.targetType == 'cell'){
			grid2.addSelection(ev);
			grid2.clickSort(ev);
		}
	});
	
	getCardCharge();
});

function getCardCharge(){
	//카드결제 리스트 조회
	$.ajax({
		url: API_SERVER + '/cns.getCardPayMst.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
			menuname: '카드결제',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"MBR_ID"		:opener.currentCustInfo.MBR_ID,				// 회원번호
				"FEE_DT_FROM"	:$("#calendar1").val().replace(/-/gi,""),	// 날짜시작
				"FEE_DT_TO"		:$("#calendar2").val().replace(/-/gi,"")	// 날짜종료
			}]
		}),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				grid1.resetData(response.recv1);
				grid1.addSelection({rowKey:0});
				grid1.clickSort({rowKey:0});
				currentPayInfo = grid1.getRow(0);
				if(currentPayInfo != null){
					getCardChargeDtl();
				}
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
}

function getCardChargeDtl(){
	//카드결제 상세 조회
	$.ajax({
		url: API_SERVER + '/cns.getCardPayDtl.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
			menuname: '카드결제',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"EMP_ID"		:currentPayInfo.EMP_ID,				// 사번
				"EMP_RCPT_NO"	:currentPayInfo.EMP_RCPT_NO,		// 일련번호
			}]
		}),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				grid2.resetData(response.recv1);
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
}
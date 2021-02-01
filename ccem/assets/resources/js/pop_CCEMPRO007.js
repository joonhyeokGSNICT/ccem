let grid1, grid2, grid3;
var currentAccountInfo;
var currentAutoTransferInfo;

// 카드번호 format
function accountFormat(string){
	result = string;
	if(string.length == 15){
		result = string.substring(0,4) + '-****-****-' + string.slice(-3);
	}else if(string.length == 16){
		result = string.substring(0,4) + '-****-****-' + string.slice(-4);
	}
	return result;
}

$(function(){ 

	// input mask
	//calendarUtil.init("calendar1");
	//calendarUtil.init("calendar2", {opens: "left"});
	calendarUtil.monthMask("calendar3");

	// create grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 300,
		scrollX: false,
		columns: [
			{
				header: '대상년월',
				name: 'TRS_REQ_YM',
				align: "center",
				width: 70,
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
				header: '결제금액',
				name: 'TRS_ACCT_AMT',
				align: "right",
				width: 80,
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value.format()
            },
            {
				header: '결제일자',
				name: 'RCPT_DATE',
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
		],
	});
	grid1.on('click', (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
		currentAutoTransferInfo = grid1.getRow(ev.rowKey);
		if(currentAutoTransferInfo != null){
			getAutoTransferDetail();
			getAutoTransferCancel()
		}
	});
	
    grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 300,
		columns: [
			{
				header: '실결제일자',
				name: 'TRS_DATE',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
            {
				header: '대상년월',
				name: 'FEE_YM',
				width: 60,
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
				name: 'PRDT_NM',
				width: 130,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원명',
				name: 'MBR_NAME',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원번호',
				name: 'MBR_ID',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '의뢰금액',
				name: 'REQ_AMT',
				width: 80,
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value.format()
            },
            {
				header: '결과금액',
				name: 'TRS_AMT',
				minWidth: 80,
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value.format()
            },
            {
				header: '선생님',
				name: 'EMP_NM',
				minWidth: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '오류내역',
				name: 'ERR_CDE',
				minWidth: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '제외구분',
				name: 'TRS_EXCL_GB',
				minWidth: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				hidden:true
            },
		],
	});
	grid2.on('click', (ev) => {
		if(ev.targetType=='cell'){
			grid2.addSelection(ev);
			grid2.clickSort(ev);
		}
	});
	
    grid3 = new Grid({
		el: document.getElementById('grid3'),
		bodyHeight: 150,
		scrollX: false,
		columns: [
			{
				header: '신청일',
				name: 'REQ_DT',
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
            {
				header: '과목',
				name: 'PRDT_NM',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원명',
				name: 'MBR_NM',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원번호',
				name: 'MBR_ID',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '신청금액',
				name: 'CREDC_ACCT_AMT',
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value.format()
            },
            {
				header: '선생님',
				name: 'EMP_NM',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '승인취소예정일',
				name: 'TRS_RCPT_DT',
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
		],
	});
	grid3.on('click', (ev) => {
		grid3.addSelection(ev);
		grid3.clickSort(ev);
	});
	
	// GRID 끝
	
	// 카드자동이체 브랜드 계좌 리스트 조회
	$.ajax({
		url: API_SERVER + '/cns.getCardAutoInfo.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '카드자동이체',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"MBR_ID"		:opener.currentCustInfo.MBR_ID,				// 회원번호
			}]
		}),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				for(r of response.recv1){
					console.log(r);
					$("#autoTransfer_TRS_ACCT_ID").append(`<option data-sub='${r.TRS_ACCT_ID}' value='${r.TRS_ACCT_ID}'>${accountFormat(r.TRS_ACCT_ID)}</option>`);
					$("#autoTransfer_BANK_NAME").append(`<option data-sub='${r.TRS_ACCT_ID}' value='${r.BANK_ID}'>${r.BANK_NAME}</option>`);
					$("#autoTransfer_RCPT_NM").append(`<option data-sub='${r.TRS_ACCT_ID}' value='${r.RCPT_MK}'>${r.RCPT_NM}</option>`);
				}
				$("#calendar3").val(getToday(0).substring(0,7));
				getAutoTrasferInfo();
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
	
	// select change Event
	$(".at_select").change(function(){
		setVal = $(this).find('option:selected').index();
		$(".at_select").each(function(e){
			$(".at_select").eq(e).children().each(function(ev){
				$(".at_select").eq(e).children().eq(ev).attr('selected', false);
			});
			$(".at_select").eq(e).children().eq(setVal).attr('selected', true);
		})
		getAutoTrasferInfo();
	});
	
	
});

// 카드자동이체 계좌정보 조회
function getAutoTrasferInfo(){
	$.ajax({
		url: API_SERVER + '/cns.getCardAutoAccount.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '카드자동이체',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"MBR_ID"		:opener.currentCustInfo.MBR_ID,				// 회원번호
				"TRS_ACCT_ID" 	:$("#autoTransfer_TRS_ACCT_ID").val(),
				"BANK_ID"		:$("#autoTransfer_BANK_NAME").val(),
				"RCPT_MK"		:$("#autoTransfer_RCPT_NM").val(),
			}]
		}),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				currentAccountInfo = response.recv1[0];
				if(response.recv1.length > 0){
					$("#autoTransDtl_TRS_RSD_NM").val(response.recv1[0].TRS_RSD_NM);
					$("#autoTransDtl_TRS_CARD_NM").val(response.recv1[0].TRS_CARD_NM);
					$("#autoTransDtl_TRS_CARD_NO").val(accountFormat(response.recv1[0].TRS_CARD_NO));
					$("#autoTransDtl_TRS_ACCT_DT").val(response.recv1[0].TRS_ACCT_DT);
					$("#calendar1").val(FormatUtil.date(response.recv1[0].TRS_ACCT_STDT));
					$("#calendar2").val(FormatUtil.date(response.recv1[0].TRS_ACCT_ENDT));
					
					getAutoTransferAmount(); // 카드 자동이체 금액조회
				}
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
}

// 카드 자동이체 금액조회
function getAutoTransferAmount(){
	$.ajax({
		url: API_SERVER + '/cns.getCardAutoMoney.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '카드자동이체',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"TRS_ACCT_ID" 	:$("#autoTransfer_TRS_ACCT_ID").val(),
				"BANK_ID"		:$("#autoTransfer_BANK_NAME").val(),
				"TRS_YM"		:$("#calendar3").val().replace(/-/gi,""),
			}]
		}),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				grid1.resetData(response.recv1);
				grid1.addSelection({rowKey:0});
				grid1.clickSort({rowKey:0});
				currentAutoTransferInfo = grid1.getRow(0);
				if(currentAutoTransferInfo != null){
					getAutoTransferDetail();
					getAutoTransferCancel()
				}
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
}

// 카드 자동이체 상세조회
function getAutoTransferDetail(){
	$.ajax({
		url: API_SERVER + '/cns.getCardAutoTransDtl.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '카드자동이체',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"TRS_ACCT_ID" 	:$("#autoTransfer_TRS_ACCT_ID").val(),
				"BANK_ID"		:$("#autoTransfer_BANK_NAME").val(),
				"TRS_RCPT_DT"	:currentAutoTransferInfo.RCPT_DATE.replace(/-/gi,""),
				"FEE_YM"		:currentAutoTransferInfo.TRS_REQ_YM.replace(/-/gi,""),
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

// 카드 자동이체 취소 신청내역 조회
function getAutoTransferCancel(){
	$.ajax({
		url: API_SERVER + '/cns.getCardTransCancle.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '카드자동이체',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"MBR_ID"		:opener.currentCustInfo.MBR_ID,							// 회원번호
				"TRS_REQ_YM"	:currentAutoTransferInfo.TRS_REQ_YM.replace(/-/gi,""),	// 대상년월
			}]   
		}),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				grid3.resetData(response.recv1);
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
}
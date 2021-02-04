let grid1, grid2;
var currentAccountInfo;

//계좌번호 format
function accountFormat(string){
	result = string.substring(0,4) + '************';
	return result;
}

$(function(){
	window.onkeydown = (e) => {
		if(e.keyCode == 13){
			getAccInfo();
		};
	}
	
	// input mask
	/*calendarUtil.init("calendar1");
	calendarUtil.init("calendar2", {opens: "left"});*/
	calendarUtil.monthMask("calendar3");

	// create grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 350,
		scrollX: false,
		columns: [
			{
				header: '이체의뢰년월',
				name: 'TRS_YM',
                width: 110,
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
				header: '의뢰금액',
				name: 'TRS_AMT',
                minWidth: 80,
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value.format()
            },
            {
				header: '결제금액',
				name: 'TRS_AMT',
                minWidth: 80,
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value.format()
            },
		],
	});
	grid1.on('click', (ev) => {
		console.log(ev.targetType);
		if(ev.targetType == 'cell'){
			grid1.addSelection(ev);
			grid1.clickSort(ev);
			currentAccountInfo = grid1.getRow(ev.rowKey);
			if(currentAccountInfo != null){
				getAccTransInfoDtl();
			}
		}
	});
	
    grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 350,
		columns: [
			{
				header: '실이체일자',
                name: 'TRS_DATE',
                width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
            {
				header: '과목',
				name: 'PRDT_NM',
                width: 105,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원명',
				name: 'MBR_NAME',
                width: 75,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '회원번호',
				name: 'MBR_ID',
                width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '의뢰금액',
				name: 'REQ_AMT',
                width: 90,
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value.format()
            },
            {
				header: '결과금액',
				name: 'TRS_AMT',
                width: 90,
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value.format()
            },
            {
				header: '선생님',
				name: 'EMP_NM',
                width: 125,
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '오류',
				name: 'ERR_CDE',
                width: 230,
				align: "center",
				sortable: true,
				ellipsis: true,
            }
		],
	});
	grid2.on('click', (ev) => {
		if(ev.targetType=='cell'){
			grid2.addSelection(ev);
			grid2.clickSort(ev);
		}
	});
	
	// 계좌정보 조회
	$.ajax({
		url: API_SERVER + '/cns.getAcctTrans.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '이체정보',
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
					$("#accTransfer_TRS_ACCT_ID").append(`<option data-sub='${r.TRS_ACCT_ID}' value='${r.TRS_ACCT_ID}'>${accountFormat(r.TRS_ACCT_ID)}</option>`);
					$("#accTransfer_BANK_NAME").append(`<option data-sub='${r.TRS_ACCT_ID}' value='${r.BANK_ID}'>${r.BANK_NAME}</option>`);
					$("#accTransfer_RCPT_NM").append(`<option data-sub='${r.TRS_ACCT_ID}' value='${r.RCPT_MK}'>${r.RCPT_NM}</option>`);
				}
				$("#calendar3").val(getToday(0).substring(0,7));
				getAccInfo();
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
		console.log(setVal);
		$(".at_select").each(function(e){
			$(".at_select").eq(e).children().each(function(ev){
				$(".at_select").eq(e).children().eq(ev).attr('selected', false);
			});
			$(".at_select").eq(e).children().eq(setVal).attr('selected', true);
		})
		getAccInfo();
	});
});

// 계좌정보 조회
function getAccInfo(){
	$.ajax({
		url: API_SERVER + '/cns.getAcctTransInfo.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '이체정보',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"MBR_ID"		:opener.currentCustInfo.MBR_ID,				// 회원번호
				"TRS_ACCT_ID" 	:$("#accTransfer_TRS_ACCT_ID").val(),
				"BANK_ID"		:$("#accTransfer_BANK_NAME").val(),
				"RCPT_MK"		:$("#accTransfer_RCPT_NM").val(),
			}]
		}),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				//currentAccountInfo = response.recv1[0];
				if(response.recv1.length > 0){
					$("#accTransferDtl_TRS_ACCT_NAME").val(response.recv1[0].TRS_ACCT_NAME);
					$("#accTransferDtl_BANK_NAME").val(response.recv1[0].BANK_NAME);
					$("#accTransferDtl_TRS_ACCT_ID").val(accountFormat(response.recv1[0].TRS_ACCT_ID));
					$("#accTransferDtl_TRS_ACCT_DAY").val(response.recv1[0].TRS_ACCT_DAY);
					$("#calendar1").val(FormatUtil.date(response.recv1[0].TRS_ACCT_STDATE));
					$("#calendar2").val(FormatUtil.date(response.recv1[0].TRS_ACCT_EDDATE));
					getAccTransInfo();
				}
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
}

// 이체정보 조회
function getAccTransInfo() {
	$.ajax({
		url: API_SERVER + '/cns.getAcctTransMst.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '이체정보',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"TRS_ACCT_ID" 	:$("#accTransfer_TRS_ACCT_ID").val(),
				"BANK_ID"		:$("#accTransfer_BANK_NAME").val(),
				"TRS_YM"		:$("#calendar3").val().replace(/-/gi,""),
			}]
		}),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				grid1.resetData(response.recv1);
				grid1.addSelection({rowKey:0});
				grid1.clickSort({rowKey:0});
				currentAccountInfo = grid1.getRow(0);
				if(currentAccountInfo != null){
					getAccTransInfoDtl();
				}
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
}

// 이체정보 상세조회
function getAccTransInfoDtl() {
	$.ajax({
		url: API_SERVER + '/cns.getAcctTransDtl.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '이체정보',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"TRS_ACCT_ID" 	:$("#accTransfer_TRS_ACCT_ID").val(),
				"BANK_ID"		:$("#accTransfer_BANK_NAME").val(),
				"TRS_RCPT_DT"	:currentAccountInfo.RCPT_DATE.replace(/-/gi,""),
				"FEE_YM"		:currentAccountInfo.TRS_YM.replace(/-/gi,""),
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
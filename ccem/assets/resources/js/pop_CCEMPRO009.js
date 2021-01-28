let grid;

$(function(){
	
	//환불이력 조회
	$.ajax({
		url: API_SERVER + '/cns.getRefundHistInfo.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
			menuname: '환불이력',
			senddataids: ["send1"],
			recvdataids: ["recv1"],
			send1: [{
				"MBR_ID"		:opener.currentCustInfo.MBR_ID,		// 회원번호
			}]
		}),
		success: function (response) {
			if(response.errcode == "0"){
				console.log(response.recv1);
				grid.resetData(response.recv1);
			}else {
				loading.out();
				client.invoke("notify", response.errmsg, "error", 60000);
			}
		}, error: function (response) {
		}
	});
	
	grid = new Grid({
		el: document.getElementById('grid'),
		bodyHeight: 400,
		scrollX: false,
		columns: [
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
				header: '과목',
				name: 'PRDT_NAME',
				align: "center",
				sortable: true,
				ellipsis: true,
            },
            {
				header: '환불대상회비',
				name: 'REQ_AMT',
				width: 100,
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value != null?columnInfo.value.format():""
            },
            {
				header: '실환불금액',
				name: 'AMT_DC',
				width: 100,
				align: "right",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => columnInfo.value != null?columnInfo.value.format():""
            },
            {
				header: '송신일',
				name: 'SNDDATE',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
            {
				header: '실이체일',
				name: 'RCPT_DATE',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
            //Decode(TRIM(ERR_CDE),"GOOD","정상","","","오류")
            {
				header: '결과',
				name: 'ERR_CDE',
				width: 70,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: function(e){
					result = "";
					switch(e.value){
					case 'GOOD' : result='정상'; 	break;
					case ''		: result=''; 		break;
					default 	: result='오류'; 	break;
					}
					return result;
				}
            },
            {
				header: '계좌번호',
				name: 'ACCT_ID',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: function(e){
					result = e.value.substring(0,4) + "************";
					return result;
				}
            },
		],
	});
	grid.on('click', (ev) => {
		if(ev.targetType == 'cell'){
			grid.addSelection(ev);
			grid.clickSort(ev);
		}
	});
});


$(function(){
	// 상담메인 > 직접결제 > 회비관리 grid
		counselMain_directCharge_duesInfo_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_duesInfo_grid'),
			bodyHeight: 200,
			scrollX: false,
			rowHeaders: [{
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
				/* {
	                header: 'NO',
	                name: 'NO',
	                minWidth: 40,
	                width: 40,
	                align: "center",
	                formatter: function (obj) {return obj.row.__storage__.sortKey + 1 },
	            },*/
				{
					header: '청구월',
					name: 'REQ_YM',
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
				//Decode(DEPT_GB,"N","눈높이","S","솔루니","C","차이홍","통신")}</FC>
				{
					header: '브랜드',
					name: 'DEPT_GB',
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result = e.value;
						if(e.value != null){
							switch(e.value){
							case 'N' :
								result = '눈높이';
								break;
							case 'S' :
								result = '솔루니';
								break;
							case 'C' :
								result = '차이홍';
								break;
							default :
								result = '통신';
								break;
							}
						}
						return result;
					}
				},
				{
					header: '청구구분',
					name: 'REQ_NM',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송현황',
					name: 'REQ_STATUS_NM',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '회비금액',
					name: 'REQ_AMT',
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: '결제현황',
					name: 'PAY_STATUS_NM',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '결제구분',
					name: 'APPR_PAY_NM',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '알림톡발송일',
					name: 'REQ_DT',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				}
				],
		});
		counselMain_directCharge_duesInfo_grid.on('click', (ev) => {
			if(ev.targetType == 'cell'){
				counselMain_directCharge_duesInfo_grid.addSelection(ev);
				counselMain_directCharge_duesInfo_grid.clickSort(ev);
				currentDirectChargeInfo = counselMain_directCharge_duesInfo_grid.getRow(ev.rowKey);		// 직접결제 자동조회
				loadList('getCustPayChgKKO', counselMain_directCharge_alimSendList_grid);				// 알림톡 이력
				loadList('getPayLedger', counselMain_directCharge_cancelCharge_grid);					// 결제/취소 이력
				loadList('getCustPayReq', counselMain_directCharge_bill_grid);							// 청구서 이력
			}
	    });
		
		counselMain_directCharge_duesInfo_grid.on('dblclick', (ev) => {
	    });
		// counselMain_directCharge_duesInfo_grid 끝
		
		// 상담메인 > 직접결제 > 알림톡발송이력 grid
		counselMain_directCharge_alimSendList_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_alimSendList_grid'),
			bodyHeight: 300,
			rowHeaders: [{
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
					name: 'REQ_NM',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송일시',
					name: 'REQ_SEND_DT',
					width: 130,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.dateTime(columnInfo.value)
				},
				{
					header: '결제확인일시',
					name: 'PAGE_CHK_DT',
					width: 130,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.dateTime(columnInfo.value)
				},
				{
					header: '시스템',
					name: 'REQ_SYS_NM',
					width: 60,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송방식',
					name: 'REQ_KKO_NM',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송현황',
					name: 'REQ_STATUS_NM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '실패사유',
					name: 'SMS_REPLY_NM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송자',
					name: 'REQ_EMP_NM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '선생님구분',
					name: 'TCHR_MK_NM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '사업국',
					name: 'DEPT_NM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '센터',
					name: 'LC_NM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_directCharge_alimSendList_grid.on('click', (ev) => {
			if(ev.targetType == 'cell'){
				counselMain_directCharge_alimSendList_grid.addSelection(ev);
				counselMain_directCharge_alimSendList_grid.clickSort(ev);
				console.log(counselMain_directCharge_alimSendList_grid.getRow(ev.rowKey));
				counselMain_directCharge_reciverInfo_grid.resetData([counselMain_directCharge_alimSendList_grid.getRow(ev.rowKey)]);
				counselMain_directCharge_reciverInfo_grid.refreshLayout();
			}
	    });
		
		// 알림톡발송이력 끝
	
		// 상담메인 > 직접결제 > 청구서 grid
		counselMain_directCharge_bill_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_bill_grid'),
			bodyHeight: 153,
			scrollX: false,
			rowHeaders: [{
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
					header: '과목',
					name: 'PRDT_NM',
					width: 70,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '항목',
					name: 'FEE_NM',
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '회비',
					name: 'REQ_AMT',
					align: "center",
					width: 70,
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				}
				],
		});
		counselMain_directCharge_bill_grid.on('click', (ev) => {
			counselMain_directCharge_bill_grid.addSelection(ev);
			counselMain_directCharge_bill_grid.clickSort(ev);
	    });
		
		// 청구서 끝
		
		// 상담메인 > 직접결제 > 수신대상자 grid
		counselMain_directCharge_reciverInfo_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_reciverInfo_grid'),
			bodyHeight: 102,
			scrollX: false,
			rowHeaders: [{
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
	        	//{Decode(KKO_RLY,"M","모","F","부","L","법정대리인","I","본인","")}
				{
					header: '관계',
					name: 'KKO_RLY',
					width: 75,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result = "";
						if(e.value != "" && e.value != null){
							console.log(e.value);
							switch(e.value){
							case 'M' : result = '모'; break;
							case 'F' : result = '부'; break;
							case 'L' : result = '법정대리인'; break;
							case 'I' : result = '본인'; break;
							default  : result = ''; break;
							}
						}
						console.log(result);
						return result;
					}
				},
				{
					header: '이름',
					name: 'KKO_NM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '전화번호',
					name: 'MOBILNO',
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_directCharge_reciverInfo_grid.on('click', (ev) => {
			counselMain_directCharge_reciverInfo_grid.addSelection(ev);
			counselMain_directCharge_reciverInfo_grid.clickSort(ev);
	    });
		
		// 수신대상자정보 끝
		
		// 상담메인 > 직접결제 > 결제/취소 이력 grid
		counselMain_directCharge_cancelCharge_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_cancelCharge_grid'),
			bodyHeight: 200,
			scrollX: false,
			rowHeaders: [{
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
	        	//{Decode(GUBUN,"S","결제완료","C","결제취소","파기")}</FC>
				{
					header: '결제현황',
					name: 'GUBUN',
					width: 70,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result = e.value;
						if(e.value != null){
							switch(e.value){
							case 'S' :
								result = '결제완료';
								break;
							case 'C' :
								result = '결제취소';
								break;
							default :
								result = '파기';
								break;
							}
						}
						return result;
					}
				},
				{
					header: '결제/취소일시',
					name: 'APPR_DT',
					width: 130,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.dateTime(columnInfo.value)
				},
				{
					header: '결제금액',
					name: 'APPR_PRICE',
					width: 60,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: '결제구분',
					name: 'APPR_PAY_TYPE',
					width: 60,
					align: "center",
					sortable: true,
					hidden: true,
					ellipsis: true,
				},
				{
					header: '결제구분',
					name: 'APPR_PAY_NM',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '은행/카드명',
					name: 'APPR_ISSUER',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '계좌/카드번호',
					name: 'APPR_ISSUER_NUM',
					width: 110,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '승인번호',
					name: 'APPR_NUM',
					width: 70,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_directCharge_cancelCharge_grid.on('click', (ev) => {
			counselMain_directCharge_cancelCharge_grid.addSelection(ev);
			counselMain_directCharge_cancelCharge_grid.clickSort(ev);
	    });
		
		// 결제/취소 이력 끝
		
});

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
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '브랜드',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '청구구분',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송현황',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '회비금액',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '결제현황',
					name: 'consQustCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '결제구분',
					name: 'consAnsrCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '알림톡발송일',
					name: 'consTyp1Nm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_directCharge_duesInfo_grid.on('click', (ev) => {
			counselMain_directCharge_duesInfo_grid.addSelection(ev);
			counselMain_directCharge_duesInfo_grid.clickSort(ev);
	    });
		
		// counselMain_directCharge_duesInfo_grid 끝
		
		// 상담메인 > 직접결제 > 알림톡발송이력 grid
		counselMain_directCharge_alimSendList_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_alimSendList_grid'),
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
					header: '구분',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송일시',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '결제확인일시',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '시스템',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송방식',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_directCharge_alimSendList_grid.on('click', (ev) => {
			counselMain_directCharge_alimSendList_grid.addSelection(ev);
			counselMain_directCharge_alimSendList_grid.clickSort(ev);
	    });
		
		// 알림톡발송이력 끝
	
		// 상담메인 > 직접결제 > 청구서 grid
		counselMain_directCharge_bill_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_bill_grid'),
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
				{
					header: '과목',
					name: 'custNm',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '항목',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '회비',
					name: 'reserverDtm',
					align: "center",
					sortable: true,
					ellipsis: true,
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
				{
					header: '관계',
					name: 'custNm',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '이름',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '전화번호',
					name: 'reserverDtm',
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
				{
					header: '관계',
					name: 'custNm',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '이름',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '전화번호',
					name: 'reserverDtm',
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

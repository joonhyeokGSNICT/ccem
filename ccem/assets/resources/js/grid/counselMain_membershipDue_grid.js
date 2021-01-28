$(function(){
	var FEE_YM_1 = dateFormatWithBar(addMonth(new Date(), 0)).substring(0,7);
	var FEE_YM_2 = dateFormatWithBar(addMonth(new Date(), -1)).substring(0,7);
	var FEE_YM_3 = dateFormatWithBar(addMonth(new Date(), -2)).substring(0,7);
	var FEE_YM_4 = dateFormatWithBar(addMonth(new Date(), -3)).substring(0,7);
	var FEE_YM_5 = dateFormatWithBar(addMonth(new Date(), -4)).substring(0,7);
	var FEE_YM_6 = dateFormatWithBar(addMonth(new Date(), -5)).substring(0,7);
	var FEE_YM_7 = dateFormatWithBar(addMonth(new Date(), -6)).substring(0,7);
	var FEE_YM_8 = dateFormatWithBar(addMonth(new Date(), -7)).substring(0,7);
	var FEE_YM_9 = dateFormatWithBar(addMonth(new Date(), -8)).substring(0,7);
	var FEE_YM_10 = dateFormatWithBar(addMonth(new Date(), -9)).substring(0,7);
	var FEE_YM_11 = dateFormatWithBar(addMonth(new Date(), -10)).substring(0,7);
	var FEE_YM_12 = dateFormatWithBar(addMonth(new Date(), -11)).substring(0,7);
	
	// 상담메인 > 회비 탭 > 회비목록 grid
	counselMain_membershipDueTab_dueList = new Grid({
		el: document.getElementById('counselMain_membershipDueTab_dueList'),
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
        summary: {
            height: 28,
            position: 'bottom',
            columnContent: {
            	PRDT_NAME: { template: valueMap => "합   계"},
            	TOTAL_FEE: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_1: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_2: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_3: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_4: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_5: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_6: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_7: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_8: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_9: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_10: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_11: { template: valueMap => valueMap.sum.format() },
            	FEE_YM_12: { template: valueMap => valueMap.sum.format() },
            },
        },
        columns: [
				{
					header: '제품',
					name: 'PRDT_NAME',
					width: 130,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '학습상태',
					name: 'STD_STS_NAME',
					width: 70,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '계',
					name: 'TOTAL_FEE',
					width: 70,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_1,
					name: 'FEE_YM_1',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_2,
					name: 'FEE_YM_2',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_3,
					name: 'FEE_YM_3',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_4,
					name: 'FEE_YM_4',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_5,
					name: 'FEE_YM_5',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_6,
					name: 'FEE_YM_6',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_7,
					name: 'FEE_YM_7',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_8,
					name: 'FEE_YM_8',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_9,
					name: 'FEE_YM_9',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_10,
					name: 'FEE_YM_10',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_11,
					name: 'FEE_YM_11',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: FEE_YM_12,
					name: 'FEE_YM_12',
					width: 65,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				}
				],
		});
		counselMain_membershipDueTab_dueList.on('click', (ev) => {
			if(ev.targetType == 'cell'){
				counselMain_membershipDueTab_dueList.addSelection(ev);
				counselMain_membershipDueTab_dueList.clickSort(ev);
				currentDueInfo = counselMain_membershipDueTab_dueList.getRow(ev.rowKey);
				loadList('getCreditPrdt',counselMain_membershipDueTab_subChargeList);
			}
	    });
		
		// 회비리스트 끝
	
		// 상담메인 > 회비 탭 > 과목별 입금내역 grid
		counselMain_membershipDueTab_subChargeList = new Grid({
			el: document.getElementById('counselMain_membershipDueTab_subChargeList'),
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
					header: '입금일자',
					name: 'RCPT_DATE',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '대상년월',
					name: 'FEE_YM',
					width: 70,
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
					header: '구분',
					name: 'RCPT_NAME',
					width: 70,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '입금액',
					name: 'FEE_YM_RCPT_AMT',
					width: 60,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: '상담시각',
					name: 'NAME',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_membershipDueTab_subChargeList.on('click', (ev) => {
			if(ev.targetType == 'cell'){
				counselMain_membershipDueTab_subChargeList.addSelection(ev);
				counselMain_membershipDueTab_subChargeList.clickSort(ev);
				currentSubDueInfo = counselMain_membershipDueTab_subChargeList.getRow(ev.rowKey);
				loadList('getTransHist',counselMain_membershipDueTab_chargeList);
			}
	    });
		
		// 과목별입금내역 끝
		
		// 상담메인 > 회비 탭 > 입금내역 grid
		counselMain_membershipDueTab_chargeList = new Grid({
			el: document.getElementById('counselMain_membershipDueTab_chargeList'),
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
					header: '이체일자',
					name: 'A1',
					width: 88,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '과목',
					name: 'A2',
					width: 60,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '대상년월',
					name: 'A3',
					width: 70,
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
					header: '입금액',
					name: 'A4',
					width: 60,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: '할인액',
					name: 'A5',
					width: 60,
					align: "right",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: '상담시간',
					name: 'A6',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_membershipDueTab_chargeList.on('click', (ev) => {
			counselMain_membershipDueTab_chargeList.addSelection(ev);
			counselMain_membershipDueTab_chargeList.clickSort(ev);
	    });
		
		// 입금내역 끝
});

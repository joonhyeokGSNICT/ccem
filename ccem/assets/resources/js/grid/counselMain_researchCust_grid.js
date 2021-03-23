$(function(){
	// 상담메인 > 고객조사 탭 > 고객조사 grid
	counselMain_researchCust_rsrchCust_grid = new Grid({
		el: document.getElementById('counselMain_researchCust_rsrchCust_grid'),
		bodyHeight: 150,
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
					header: 'TASK명',
					name: 'TASK_NAME',
					width: 260,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '통화일',
					name: 'CTI_CHGDATE',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: 'O/B결과',
					name: 'CALL_RST_MK_NM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담결과',
					name: 'CSEL_RST_MK_NM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '고객반응',
					name: 'CUST_RESP_MK_NM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_researchCust_rsrchCust_grid.on('click', (ev) => {
			if(ev.targetType == "cell"){
				counselMain_researchCust_rsrchCust_grid.addSelection(ev);
				counselMain_researchCust_rsrchCust_grid.clickSort(ev);
				loadList('getTBCALLRST',counselMain_researchCust_rschCallHist_grid, counselMain_researchCust_rsrchCust_grid.getRow(ev.rowKey).LIST_ID);
				counselMain_researchCust_rschCallHist_grid.refreshLayout();
			}
	    });
		
		// 고객조사 끝
	
		// 상담메인 > 고객조사 탭 > 통화이력 grid
		counselMain_researchCust_rschCallHist_grid = new Grid({
			el: document.getElementById('counselMain_researchCust_rschCallHist_grid'),
			bodyHeight: 150,
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
					header: '통화결과',
					name: 'CALL_RST_MK_NM',
					width: 95,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신전화번호',
					name: 'TELPNO',
					width: 115,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '통화일',
					name: 'CALL_DATE',
					width: 140,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '통화시간',
					name: 'CALL_TIME',
					width: 95,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.time(columnInfo.value)
				},
				{
					header: '발신자',
					name: 'USER_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_researchCust_rschCallHist_grid.on('click', (ev) => {
			if(ev.targetType == "cell"){
				counselMain_researchCust_rschCallHist_grid.addSelection(ev);
				counselMain_researchCust_rschCallHist_grid.clickSort(ev);
			}
	    });
		
		// 통화이력 끝
		
		// 상담메인 > 고객조사 탭 > 설문조사 grid
		counselMain_researchCust_surveyList_grid = new Grid({
			el: document.getElementById('counselMain_researchCust_surveyList_grid'),
			bodyHeight: 150,
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
					header: '주제명',
					name: 'SURVEY_NAME',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송일시',
					name: 'SEND_DTM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.dateTime(columnInfo.value)
				},
				{
					header: '참여여부',
					name: 'CMPLY_YN',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '참여일시',
					name: 'CMPLY_DTM',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.dateTime(columnInfo.value)
				},
				{
					header: '비고',
					name: 'SEND_CNTS',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_researchCust_surveyList_grid.on('click', (ev) => {
			if(ev.targetType == "cell"){
				counselMain_researchCust_surveyList_grid.addSelection(ev);
				counselMain_researchCust_surveyList_grid.clickSort(ev);
			}
	    });
		
		// 설문조사 끝
		
		
		// 상담메인 > SMS 탭 > SMS/LMS이력 grid
		counselMain_researchCust_smsLmsHist_grid = new Grid({
			el: document.getElementById('counselMain_researchCust_smsLmsHist_grid'),
			bodyHeight: 230,
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
					name: 'KIND_NM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신일자',
					name: 'RDATE',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '발신시간',
					name: 'RTIME',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.time(columnInfo.value)
				},
				//data="2:성공,4:실패"	</C>	
				{
					header: '발신결과',
					name: 'RESULT',
					width: 110,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result = "";
						switch(e.value){
						case '2':
							result = "성공"
							break;
						case '4':
							result = "실패"
							break;
						}
						return result;
					}
				},
				{
					header: '발신전화번호',
					name: 'RPHONE',
					width: 130,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담원',
					name: 'SENDNAME',
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_researchCust_smsLmsHist_grid.on('click', (ev) => {
			if(ev.targetType =='cell'){
				counselMain_researchCust_smsLmsHist_grid.addSelection(ev);
				counselMain_researchCust_smsLmsHist_grid.clickSort(ev);
				var currentData = counselMain_researchCust_smsLmsHist_grid.getRow(ev.rowKey);
				$("#smsContent").val(currentData.MSG);
			}
	    });
		
		// SMS/LMS 이력 끝
		
});

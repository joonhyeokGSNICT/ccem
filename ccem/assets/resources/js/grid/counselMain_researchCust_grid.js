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
				/* {
	                header: 'NO',
	                name: 'NO',
	                minWidth: 40,
	                width: 40,
	                align: "center",
	                formatter: function (obj) {return obj.row.__storage__.sortKey + 1 },
	            },*/
				{
					header: 'TASK명',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '통화일',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: 'O/B결과',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담결과',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '고객반응',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_researchCust_rsrchCust_grid.on('click', (ev) => {
			counselMain_researchCust_rsrchCust_grid.addSelection(ev);
			counselMain_researchCust_rsrchCust_grid.clickSort(ev);
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
				/* {
	                header: 'NO',
	                name: 'NO',
	                minWidth: 40,
	                width: 40,
	                align: "center",
	            },*/
				{
					header: '통화결과',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신전화번호',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '통화일',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '통화시간',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신자',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_researchCust_rschCallHist_grid.on('click', (ev) => {
			counselMain_researchCust_rschCallHist_grid.addSelection(ev);
			counselMain_researchCust_rschCallHist_grid.clickSort(ev);
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
				/* {
	                header: 'NO',
	                name: 'NO',
	                minWidth: 40,
	                width: 40,
	                align: "center",
	                formatter: function (obj) {return obj.row.__storage__.sortKey + 1 },
	            },*/
				{
					header: '설문명',
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
					header: '참여여부',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '참여일시',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '비고',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_researchCust_surveyList_grid.on('click', (ev) => {
			counselMain_researchCust_surveyList_grid.addSelection(ev);
			counselMain_researchCust_surveyList_grid.clickSort(ev);
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
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신일자',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신시간',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신결과',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신전화번호',
					name: 'consStatNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담원',
					name: 'consStatNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_researchCust_smsLmsHist_grid.on('click', (ev) => {
			counselMain_researchCust_smsLmsHist_grid.addSelection(ev);
			counselMain_researchCust_smsLmsHist_grid.clickSort(ev);
	    });
		
		// SMS/LMS 이력 끝
		
});

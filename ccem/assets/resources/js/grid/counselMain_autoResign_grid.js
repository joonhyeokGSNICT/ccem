$(function(){
	// 상담메인 > 자동퇴회 탭 > 자동퇴회세부 grid
	counselMain_autoResign_resignDetail_grid = new Grid({
		el: document.getElementById('counselMain_autoResign_resignDetail_grid'),
		bodyHeight: 200,
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
					header: '월',
					name: 'custNm',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '과목',
					name: 'custSeq',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '최종회비월',
					name: 'reserverDtm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '최종회비납입일',
					name: 'chprNm',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '미납회비',
					name: 'consStatNm',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '미납개월',
					name: 'consQustCntn',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '자동퇴회여부',
					name: 'consAnsrCntn',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_autoResign_resignDetail_grid.on('click', (ev) => {
			counselMain_autoResign_resignDetail_grid.addSelection(ev);
			counselMain_autoResign_resignDetail_grid.clickSort(ev);
	    });
		
		// 자동퇴회세부 끝
	
		// 상담메인 > 자동퇴회 탭 > 퇴회안내 이력 List grid
		counselMain_autoResign_resignSendList_grid = new Grid({
			el: document.getElementById('counselMain_autoResign_resignSendList_grid'),
			bodyHeight: 200,
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
					header: '월',
					name: 'custNm',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신번호',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송일',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '수신여부',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_autoResign_resignSendList_grid.on('click', (ev) => {
			counselMain_autoResign_resignSendList_grid.addSelection(ev);
			counselMain_autoResign_resignSendList_grid.clickSort(ev);
	    });
		
		// 퇴회안내 이력 끝
		
});

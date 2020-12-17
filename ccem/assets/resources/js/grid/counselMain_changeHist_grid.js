$(function(){
	// 상담메인 > 변경이력 탭 > 현재학습장소이력 grid
	counselMain_changeHist_studySpot_grid = new Grid({
		el: document.getElementById('counselMain_changeHist_studySpot_grid'),
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
				/* {
	                header: 'NO',
	                name: 'NO',
	                minWidth: 40,
	                width: 40,
	                align: "center",
	                formatter: function (obj) {return obj.row.__storage__.sortKey + 1 },
	            },*/
				{
					header: '변경일자',
					name: 'custNm',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '우편번호',
					name: 'custSeq',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '주소',
					name: 'reserverDtm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '전화번호',
					name: 'chprNm',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '핸드폰',
					name: 'consStatNm',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: 'Fax번호',
					name: 'consQustCntn',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '등록자',
					name: 'consAnsrCntn',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_changeHist_studySpot_grid.on('click', (ev) => {
			counselMain_changeHist_studySpot_grid.addSelection(ev);
			counselMain_changeHist_studySpot_grid.clickSort(ev);
	    });
		
		// 학습장소이력 끝
	
		// 상담메인 > 변경이력 탭 > 신상변경이력 grid
		counselMain_changeHist_changeDetail_grid = new Grid({
			el: document.getElementById('counselMain_changeHist_changeDetail_grid'),
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
				/* {
	                header: 'NO',
	                name: 'NO',
	                minWidth: 40,
	                width: 40,
	                align: "center",
	            },*/
				{
					header: '변경일',
					name: 'custNm',
					width: 200,
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
					header: '영문이름',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '성별',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '학년',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '생년월일',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '양/음',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '세대주명',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_changeHist_changeDetail_grid.on('click', (ev) => {
			counselMain_changeHist_changeDetail_grid.addSelection(ev);
			counselMain_changeHist_changeDetail_grid.clickSort(ev);
	    });
		
		// 신상변경이력 끝
		
});

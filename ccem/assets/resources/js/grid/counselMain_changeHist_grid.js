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
					name: 'CHGDT',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '우편번호',
					name: 'ZIPCDE',
					width: 75,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '주소',
					name: 'ADDR',
					width: 270,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '전화번호',
					name: 'TEL',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '핸드폰',
					name: 'MOBILNO',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: 'Fax번호',
					name: 'FAXNO',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '등록자',
					name: 'USER_NAME',
					width: 70,
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
				{
					header: '변경일',
					name: 'CHGD',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.dateTime(columnInfo.value.replace(" ",""))
				},
				{
					header: '이름',
					name: 'NM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '영문이름',
					name: 'NMENG',
					width: 110,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '성별',
					name: 'GND',
					width: 60,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result;
						if(e.value != null){
							if(e.value == '1'){
								result = '남';
							}else if(e.value == '2'){
								result = '여';
							}else {
								result = '';
							}
						}
						return result;
					}
				},
				{
					header: '학년',
					name: 'GRD',
					width: 60,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '생년월일',
					name: 'BIRTH',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '양/음',
					name: 'BIRTH_MK',
					width: 40,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result;
						if(e.value != null){
							if(e.value == '1'){
								result = '양력';
							}else if(e.value == '2'){
								result = '음력';
							}else {
								result = '';
							}
						}
						return result;
					}
				},
				{
					header: '세대주명',
					name: 'FNAME',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '관계',
					name: 'FAT_REL',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: 'Email',
					name: 'REP_EMAIL_ADDR',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '수신',
					name: 'MFLAG',
					width: 40,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '학습장소주소변경',
					name: 'ADDR_CHG_FLAG1',
					width: 160,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '세대주직장주소변경',
					name: 'ADDR_CHG_FLAG2',
					width: 160,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담원',
					name: 'CSLER',
					width: 70,
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

$(function(){
	// 상담메인 > 정보동의 탭 > 개인정보 동의리스트 grid
	counselMain_infoAgree_infoAgreeList_grid = new Grid({
		el: document.getElementById('counselMain_infoAgree_infoAgreeList_grid'),
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
					header: '동의방법',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '입력날짜',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '사업국명',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '센터명',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '선생님명',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '사번',
					name: 'consQustCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '성공여부',
					name: 'consAnsrCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '동의',
					name: 'consTyp1Nm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담교사',
					name: 'consTyp2Nm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '소분류',
					name: 'consTyp3Nm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '세분류',
					name: 'consTyp4Nm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '연락처',
					name: 'custInfo',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '접수채널',
					name: 'acpgChnlNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신번호',
					name: 'incoTlno',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				/*{
	                header: '상세이력',
	                name: 'DETAILCONT',
	                align: "center",
	                sortable: true,
	                ellipsis: true,
	            },*/
				{
					header: '처리방법',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '처리일시',
					name: 'consDspsDttm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_infoAgree_infoAgreeList_grid.on('click', (ev) => {
			counselMain_infoAgree_infoAgreeList_grid.addSelection(ev);
			counselMain_infoAgree_infoAgreeList_grid.clickSort(ev);
	    });
		
		// 개인정보동의 끝
	
		// 상담메인 > 정보동의 탭 > 개인정보 녹취 통화이력 grid
		counselMain_infoAgree_iaRecordList_grid = new Grid({
			el: document.getElementById('counselMain_infoAgree_iaRecordList_grid'),
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
		counselMain_infoAgree_iaRecordList_grid.on('click', (ev) => {
			counselMain_infoAgree_iaRecordList_grid.addSelection(ev);
			counselMain_infoAgree_iaRecordList_grid.clickSort(ev);
	    });
		
		// 개인정보 녹취 통화이력 끝
		
		// 상담메인 > 정보동의 탭 > 약관버전 grid
		counselMain_infoAgree_termsVersion_grid = new Grid({
			el: document.getElementById('counselMain_infoAgree_termsVersion_grid'),
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
					header: '인증방법',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '현황',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '약관배부',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '배부/발송일자',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '동의일',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '약관버전',
					name: 'consQustCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '동의여부',
					name: 'consQustCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_infoAgree_termsVersion_grid.on('click', (ev) => {
			counselMain_infoAgree_termsVersion_grid.addSelection(ev);
			counselMain_infoAgree_termsVersion_grid.clickSort(ev);
	    });
		
		// 약관버전 끝
		
		// 상담메인 > 정보동의 탭 > 약관녹취통화이력 grid
		counselMain_infoAgree_termsRecordList_grid = new Grid({
			el: document.getElementById('counselMain_infoAgree_termsRecordList_grid'),
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
	                formatter: function (obj) {return obj.row.__storage__.sortKey + 1 },
	            },*/
				{
					header: '통화결과',
					name: 'custNm',
					width: 80,
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
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '통화시간',
					name: 'chprNm',
					width: 100,
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
		counselMain_infoAgree_termsRecordList_grid.on('click', (ev) => {
			counselMain_infoAgree_termsRecordList_grid.addSelection(ev);
			counselMain_infoAgree_termsRecordList_grid.clickSort(ev);
	    });
		
		// 약관녹취통화이력 끝
});

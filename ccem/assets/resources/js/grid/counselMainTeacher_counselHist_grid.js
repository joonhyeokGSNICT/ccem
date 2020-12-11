$(function(){
	// 상담메인선생님 > 상담이력 grid
		counselMainTeacher_counselHist_grid = new Grid({
			el: document.getElementById('counselMainTeacher_counselHist_grid'),
			bodyHeight: 400,
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
					header: '상담일자',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '접수',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '정보',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '통화시각',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담시각',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담시간',
					name: 'consQustCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담구분',
					name: 'consAnsrCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '처리구분',
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
		counselMainTeacher_counselHist_grid.on('click', (ev) => {
			counselMainTeacher_counselHist_grid.addSelection(ev);
			counselMainTeacher_counselHist_grid.clickSort(ev);
	    });
		
		// 선생님 상담이력 끝
		
		// 선생님 수업목록 LIST
		counselMainTeacher_asignClassGrid = new Grid({
			el: document.getElementById('counselMainTeacher_asignClassGrid'),
			bodyHeight: 300,
			scrollX: false,
			rowHeaders: [{
	            type: 'rowNum',
	            header: "NO",
	        }],
			columns: [
				{
					header: '분류코드',
					name: 'name1',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 80
	            },
	            {
					header: '제목',
					name: 'name2',
					align: "center",
					sortable: true,
					ellipsis: true,
	            }
			],
		});
		counselMainTeacher_asignClassGrid.on('click', (ev) => {
			counselMainTeacher_asignClassGrid.addSelection(ev);
			counselMainTeacher_asignClassGrid.clickSort(ev);
			counselMainTeacher_asignClassGrid.clickCheck(ev);
	    });
		
		// 교실별 회원정보 LIST
		counselMainTeacher_classMemberGrid = new Grid({
			el: document.getElementById('counselMainTeacher_classMemberGrid'),
			bodyHeight: 300,
			scrollX: false,
			rowHeaders: [{
	            type: 'rowNum',
	            header: "NO",
	        }],
			columns: [
				{
					header: '분류코드',
					name: 'name1',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 80
	            },
	            {
					header: '제목',
					name: 'name2',
					align: "center",
					sortable: true,
					ellipsis: true,
	            }
			],
		});
		counselMainTeacher_classMemberGrid.on('click', (ev) => {
			counselMainTeacher_classMemberGrid.addSelection(ev);
			counselMainTeacher_classMemberGrid.clickSort(ev);
			counselMainTeacher_classMemberGrid.clickCheck(ev);
	    });
});

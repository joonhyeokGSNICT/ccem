$(function(){
	// 상담메인 > 학습이력 > 주간학습현황 grid
		counselMain_studyTab_weeklyStat = new Grid({
			el: document.getElementById('counselMain_studyTab_weeklyStat'),
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
					header: '제품',
					name: 'PRDT_SNAME',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '학습상태',
					name: 'CODE_NAME',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '학습개월수',
					name: 'STD_MONTH',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '마감여부',
					name: 'CLOSE_FLAG',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '입회일자',
					name: 'STD_STDATE',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '사업국',
					name: 'DEPT_NAME',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '사업국코드',
					name: 'XDEPT_ID',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					hidden: true
				},
				{
					header: '센터',
					name: 'LC_NAME',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '선생님',
					name: 'EMP_NAME',
					width: 70,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '선생님사번',
					name: 'EMP_ID',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '교실',
					name: 'CLS_NAME',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '교실코드',
					name: 'CLS_ID',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_studyTab_weeklyStat.on('click', (ev) => {
			counselMain_studyTab_weeklyStat.addSelection(ev);
			counselMain_studyTab_weeklyStat.clickSort(ev);
	    });
		
		counselMain_studyTab_weeklyStat.on('dblclick', (ev) => {
			currentStudyInfo = counselMain_studyTab_weeklyStat.getRow(ev.rowKey);
			loadList('ifsStudyChgInfo', counselMain_studyTab_changeHist);				// 변동이력, 불출교재 조회
			loadList('getShipSTS', counselMain_studyTab_asignStuff);			
	    });
		
		
		// 주간 학습현황 끝
	
		// 상담메인 > 학습이력 > 변동이력 grid
		counselMain_studyTab_changeHist = new Grid({
			el: document.getElementById('counselMain_studyTab_changeHist'),
			bodyHeight: 300,
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
					header: '변동일',
					name: 'MBR_CHG_DATE',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '구분',
					name: 'CODE_NAME',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '학습연기(코로나)',
					name: 'MOTIVE_TXT',
					width: 150,
					align: "center",
					ellipsis: true,
				},
				{
					header: '사업국',
					name: 'DEPT_NAME',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '사업국코드',
					name: 'XDEPT_ID',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					hidden: true
				},
				{
					header: '센터',
					name: 'LC_NAME',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '선생님',
					name: 'EMP_NAME',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '선생님사번',
					name: 'EMP_ID',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '교실',
					name: 'CLS_NAME',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '최종회비',
					name: 'LASTFEE_YM',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '학습개월',
					name: 'STD_MONTH',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '복회가능성',
					name: 'RENEW_POTNNM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '마감여부',
					name: 'CLOSE_FLAG',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: 'L',
					name: 'CON_YM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					hidden: true
				},
				],
		});
		counselMain_studyTab_changeHist.on('click', (ev) => {
			counselMain_studyTab_changeHist.addSelection(ev);
			counselMain_studyTab_changeHist.clickSort(ev);
	    });
		
		// 변동이력 끝
		
		// 상담메인 > 학습이력 > 불출교재 grid
		counselMain_studyTab_asignStuff = new Grid({
			el: document.getElementById('counselMain_studyTab_asignStuff'),
			bodyHeight: 300,
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
				/*{
	                header: '상세이력',
	                name: 'DETAILCONT',
	                align: "center",
	                sortable: true,
	                ellipsis: true,
	                renderer: CustomColumn,
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
		counselMain_studyTab_asignStuff.on('click', (ev) => {
			counselMain_studyTab_asignStuff.addSelection(ev);
			counselMain_studyTab_asignStuff.clickSort(ev);
	    });
		
		// 불출교재 끝
});

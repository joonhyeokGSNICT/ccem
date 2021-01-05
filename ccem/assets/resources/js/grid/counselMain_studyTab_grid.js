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
			if(ev.targetType == 'cell'){
				counselMain_studyTab_weeklyStat.addSelection(ev);
				counselMain_studyTab_weeklyStat.clickSort(ev);
			}
	    });
		
		counselMain_studyTab_weeklyStat.on('dblclick', (ev) => {
			if(ev.targetType == 'cell'){
				currentStudyInfo = counselMain_studyTab_weeklyStat.getRow(ev.rowKey);
				loadList('ifsStudyChgInfo', counselMain_studyTab_changeHist);				// 변동이력, 불출교재 조회
				loadList('getShipSTS', counselMain_studyTab_asignStuff);			
			}
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
			if(ev.targetType == 'cell'){
				counselMain_studyTab_changeHist.addSelection(ev);
				counselMain_studyTab_changeHist.clickSort(ev);
			}
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
				{
					header: '년월',
					name: 'CLSVST_YM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '학습영역',
					name: 'STDAREA_ID',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '1주',
					name: 'TXTCRS_1WK',
					width: 80,
					align: "center",
					ellipsis: true,
				},
				{
					header: '2주',
					name: 'TXTCRS_2WK',
					width: 80,
					align: "center",
					ellipsis: true,
				},
				{
					header: '3주',
					name: 'TXTCRS_3WK',
					width: 80,
					align: "center",
					ellipsis: true,
				},
				{
					header: '4주',
					name: 'TXTCRS_4WK',
					width: 80,
					align: "center",
					ellipsis: true,
				},
				{
					header: '5주',
					name: 'TXTCRS_5WK',
					width: 80,
					align: "center",
					ellipsis: true,
				},
				{
					header: '6주',
					name: 'TXTCRS_6WK',
					width: 80,
					align: "center",
					ellipsis: true,
				},
				{
					header: '년월',
					name: 'APPYM',
					width: 60,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '구분',
					name: 'SHIP_NAME',
					width: 70,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '과정',
					name: 'COUR',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '출고일',
					name: 'REGDT',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '송장번호',
					name: 'TRANS_DOCNO',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '배송주소',
					name: 'FULL_ADDR',
					width: 400,
					align: "center",
					ellipsis: true,
				}
				],
		});
		counselMain_studyTab_asignStuff.on('click', (ev) => {
			if(ev.targetType == 'cell'){
				counselMain_studyTab_asignStuff.addSelection(ev);
				counselMain_studyTab_asignStuff.clickSort(ev);
			}
	    });
		
		// 불출교재 끝
});

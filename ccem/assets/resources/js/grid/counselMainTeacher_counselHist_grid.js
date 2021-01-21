$(function(){
	// 상담메인선생님 > 상담이력 grid
		counselMainTeacher_counselHist_grid = new Grid({
			el: document.getElementById('counselMainTeacher_counselHist_grid'),
			bodyHeight: 400,
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
					name: 'CSEL_DATE',
					width: 85,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '접수번호',
					name: 'CSEL_NO',
					width: 75,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '시작시간',
					name: 'CSEL_STTIME',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.time(columnInfo.value)
				},
				{
					header: '상담시간',
					name: 'CSEL_EDTIME',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.time(columnInfo.value)
				},
				{
					header: '상담구분',
					name: 'CSEL_MK_NAME',
					width: 85,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '분류(대)',
					name: 'CSEL_LTYPE',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '분류(중)',
					name: 'CSEL_MTYPE',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '분류(소)',
					name: 'CSEL_STYPE',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '처리구분',
					name: 'PROC_MK_NAME',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '처리희망일',
					name: 'PROC_HOPE_DATE',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '처리상태',
					name: 'PROC_STS',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '상담원',
					name: 'CSEL_USER',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMainTeacher_counselHist_grid.on('click', (ev) => {
			if(ev.targetType=="cell"){
				counselMainTeacher_counselHist_grid.addSelection(ev);
				counselMainTeacher_counselHist_grid.clickSort(ev);
				currentCounselInfo = counselMainTeacher_counselHist_grid.getRow(ev.rowKey);
				for(key in currentCounselInfo){												// input 자동 기입
					if($("#counselTchrInfo_" + key).length != 0){
						if($("#counselTchrInfo_" + key).hasClass('dateForm')){
							currentCounselInfo[key] = FormatUtil.date(currentCounselInfo[key]);
						}
						switch($("#counselTchrInfo_" + key)[0].localName){
						case "select" :
							$("#counselTchrInfo_" + key).val(currentCounselInfo[key]);
							break;
						case "input" :
							$("#counselTchrInfo_" + key).val(currentCounselInfo[key]);
							break;
						case "span" :
							$("#counselTchrInfo_" + key).text(currentCounselInfo[key]);
							break;
						case "textarea" :
							$("#counselTchrInfo_" + key).val(currentCounselInfo[key]);
							break;
						}
					}
				}
			}
	    });
		
		// 선생님 상담이력 끝
		
		// 선생님 수업목록 LIST
		counselMainTeacher_asignClassGrid = new Grid({
			el: document.getElementById('counselMainTeacher_asignClassGrid'),
			bodyHeight: 300,
			rowHeaders: [{
	            type: 'rowNum',
	            header: "NO",
	        }],
			columns: [
				{
					header: '교실코드',
					name: 'CLS_ID',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 110
	            },
	            {
					header: '교실명',
					name: 'CLS_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 210
	            },
	            {
					header: '출장요일',
					name: 'CODE_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 110
	            },
	            {
					header: '출장주기',
					name: 'CLS_WKCYCLE',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 110
	            },
	            {
					header: '폐지여부',
					name: 'CLS_DISUSE_FLAG',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 110
	            },
	            {
					header: '소속',
					name: 'DEPT_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 190
	            },
	            {
					header: '설립일자',
					name: 'CLS_STDATE',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 110,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
	            }
			],
		});
		counselMainTeacher_asignClassGrid.on('click', (ev) => {
			if(ev.targetType="cell"){
				counselMainTeacher_asignClassGrid.addSelection(ev);
				counselMainTeacher_asignClassGrid.clickSort(ev);
				counselMainTeacher_asignClassGrid.clickCheck(ev);
				currentTchrClassInfo = counselMainTeacher_asignClassGrid.getRow(ev.rowKey);
				loadList('ifsStudentInfoByClass',counselMainTeacher_classMemberGrid);
			}
	    });
		
		// 교실별 회원정보 LIST
		counselMainTeacher_classMemberGrid = new Grid({
			el: document.getElementById('counselMainTeacher_classMemberGrid'),
			bodyHeight: 300,
			rowHeaders: [{
	            type: 'rowNum',
	            header: "NO",
	        }],
			columns: [
				{
					header: '회원명',
					name: 'MBR_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 110
	            },
	            {
					header: '회원번호',
					name: 'MBR_ID',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 130
	            },
	            {
					header: '학년',
					name: 'GRADE_CDE',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 70
	            },
	            {
					header: '과목',
					name: 'PRDT_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 130
	            },
	            {
					header: '상태',
					name: 'CODE_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 130
	            },
	            {
					header: '입회일자',
					name: 'A',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 130,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
	            },
	            {
					header: '최종퇴회',
					name: 'B',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 130,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
	            },
	            {
					header: '최종복회',
					name: 'C',
					align: "center",
					sortable: true,
					ellipsis: true,
					width: 110,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
	            }
			],
		});
		counselMainTeacher_classMemberGrid.on('click', (ev) => {
			if(ev.targetType=='cell'){
				counselMainTeacher_classMemberGrid.addSelection(ev);
				counselMainTeacher_classMemberGrid.clickSort(ev);
				counselMainTeacher_classMemberGrid.clickCheck(ev);
			}
	    });
});

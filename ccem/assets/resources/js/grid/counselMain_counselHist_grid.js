
$(function(){
	// 상담메인 > 학습진행정보 grid
	counselMain_studyProgressList_grid = new Grid({
		el: document.getElementById('counselMain_studyProgressList_grid'),
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
            {
                header: '제품',
                name: 'PRDT_NAME',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '방문요일',
                name: 'CLS_DAY',
                width: 50,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '최종변경일',
                name: 'CHGDATE',
                width: 90,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
            {
                header: '선생님',
                name: 'NAME',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '선생님구분',
                name: 'TCHR_MK_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사업국',
                name: 'DEPT_NAME',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '센터',
                name: 'LC_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
               // renderer: { type: CustomRenderer },
            }
        ],
    });
	counselMain_studyProgressList_grid.on('click', (ev) => {
		if(ev.targetType == 'cell'){
			counselMain_studyProgressList_grid.addSelection(ev);
			counselMain_studyProgressList_grid.clickSort(ev);
		}
    });
	
	// 상담이력 학습진행정보 GRID 끝
	
	// 상담메인 > 상담이력 grid
	counselMain_counselHist_grid = new Grid({
		el: document.getElementById('counselMain_counselHist_grid'),
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
                header: '상담일자',
                name: 'CSEL_DATE',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
            {
                header: '접수',
                name: 'CSEL_NO',
                width: 40,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '정보',
                name: 'OPEN_GBN_NAME',
                width: 60,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '통화시각',
                name: 'CALL_STTIME',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => FormatUtil.time(columnInfo.value)
            },
            {
                header: '상담시각',
                name: 'CSEL_STTIME',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => FormatUtil.time(columnInfo.value)
            },
            {
                header: '상담시간',
                name: 'CSEL_TIME_INTVAL2',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => FormatUtil.time(columnInfo.value)
            },
            {
                header: '상담구분',
                name: 'CSEL_MK_NAME',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '처리구분',
                name: 'PROC_MK_NAME',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '상담교사',
                name: 'CSEL_USER',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '대분류',
                name: 'CSEL_LTYPE',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '중분류',
                name: 'CSEL_MTYPE',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '소분류',
                name: 'CSEL_STYPE',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '처리희망일',
                name: 'PROC_HOPE_DATE',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => FormatUtil.date(columnInfo.value)
            },
            {
                header: '처리상태',
                name: 'PROC_STS',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '녹취ID',
                name: 'RECORD_ID',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            }
        ],
    });
	counselMain_counselHist_grid.on('click', (ev) => {
		if(ev.targetType == 'cell'){
			counselMain_counselHist_grid.addSelection(ev);
			counselMain_counselHist_grid.clickSort(ev);
			currentCounselInfo = counselMain_counselHist_grid.getRow(ev.rowKey);
			for(key in currentCounselInfo){												// input 자동 기입
				if($("#counselInfo_" + key).length != 0){
					if($("#counselInfo_" + key).hasClass('dateForm')){
						currentCounselInfo[key] = FormatUtil.date(currentCounselInfo[key]);
					}
					switch($("#counselInfo_" + key)[0].localName){
					case "select" :
						$("#counselInfo_" + key).val(currentCounselInfo[key]);
						break;
					case "input" :
						$("#counselInfo_" + key).val(currentCounselInfo[key]);
						break;
					case "span" :
						$("#counselInfo_" + key).text(currentCounselInfo[key]);
						break;
					case "textarea" :
						$("#counselInfo_" + key).val(currentCounselInfo[key]);
						break;
					}
				}
			}
			loadList('getCounselSubj', counselMain_studyList_grid);				// 과목정보리스트 조회
			counselMain_studyList_grid.refreshLayout();
		}
    });
	// 상담이력 끝
	
	// 상담메인 > 학습정보 grid
	counselMain_studyList_grid = new Grid({
		el: document.getElementById('counselMain_studyList_grid'),
		bodyHeight: 117,
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
                header: '과목',
                name: 'PRDT_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '선생님',
                name: 'TCHR_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사업팀장',
                name: 'DIV_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            }
        ],
    });
	counselMain_studyList_grid.on('click', (ev) => {
		if(ev.targetType == 'cell'){
			counselMain_studyList_grid.addSelection(ev);
			counselMain_studyList_grid.clickSort(ev);
		}
    });
	
	// 학습정보 GRID 끝
	
});

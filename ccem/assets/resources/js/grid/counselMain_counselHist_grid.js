
$(function(){
	// 상담메인 > 학습진행정보 grid
	counselMain_studyProgressList_grid = new Grid({
		el: document.getElementById('counselMain_studyProgressList_grid'),
		bodyHeight: 200,
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
                header: '제품',
                name: 'custNm',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '방문요일',
                name: 'custSeq',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '최종변경일',
                name: 'reserverDtm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '선생님',
                name: 'chprNm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '선생님구분',
                name: 'consStatNm',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '사업국',
                name: 'consQustCntn',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '센터',
                name: 'consAnsrCntn',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '대분류',
                name: 'consTyp1Nm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '중분류',
                name: 'consTyp2Nm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '소분류',
                name: 'consTyp3Nm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '세분류',
                name: 'consTyp4Nm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '연락처',
                name: 'custInfo',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '접수채널',
                name: 'acpgChnlNm',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            },
            {
                header: '발신번호',
                name: 'incoTlno',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
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
                renderer: { type: CustomRenderer },
            },
            {
                header: '처리일시',
                name: 'consDspsDttm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
                renderer: { type: CustomRenderer },
            }
        ],
    });
	counselMain_studyProgressList_grid.on('click', (ev) => {
		counselMain_studyProgressList_grid.addSelection(ev);
		counselMain_studyProgressList_grid.clickSort(ev);
    });
	
	// 상담이력 학습진행정보 GRID 끝
	
	// 상담메인 > 상담이력 grid
	counselMain_counselHist_grid = new Grid({
		el: document.getElementById('counselMain_counselHist_grid'),
		bodyHeight: 200,
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
	counselMain_counselHist_grid.on('click', (ev) => {
		counselMain_counselHist_grid.addSelection(ev);
		counselMain_counselHist_grid.clickSort(ev);
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
           /* {
                header: 'NO',
                name: 'NO',
                minWidth: 40,
                width: 40,
                align: "center",
                formatter: function (obj) {return obj.row.__storage__.sortKey + 1 },
            },*/
            {
                header: '과목',
                name: 'custNm',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '선생님',
                name: 'custSeq',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사업팀장',
                name: 'reserverDtm',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            }
        ],
    });
	counselMain_studyList_grid.on('click', (ev) => {
		counselMain_studyList_grid.addSelection(ev);
		counselMain_studyList_grid.clickSort(ev);
    });
	
	// 학습정보 GRID 끝
	
});

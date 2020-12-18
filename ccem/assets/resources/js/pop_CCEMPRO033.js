let customerSearchList_grid;
let teacherSearchList_grid;

$(function(){
    
    // select tab
    let hash = window.location.hash;
    if (hash === "#counselMain_customerSearchTab") $("#customerTab").click();
    else if (hash === "#counselMain_teacherSearchTab") $("#teacherTab").click();

    // insert hash
    $('.nav-link').on('click', ev => window.location.hash = ev.target.hash);

    // grid refreshLayout
    $('.nav-link').on('shown.bs.tab', ev => {
        let navid = ev.target.id;
        switch (navid) {
            case "customerTab":
                customerSearchList_grid.refreshLayout();
                break;
            case "teacherTab":
                teacherSearchList_grid.refreshLayout();
                break;
            default:
                customerSearchList_grid.refreshLayout();
                teacherSearchList_grid.refreshLayout();
                break;
        }
    });
    
	// 고객찾기 > 고객찾기 grid
	customerSearchList_grid = new Grid({
		el: document.getElementById('customerSearchList_grid'),
		bodyHeight: 400,
		//scrollX: false,
		pageOptions: {
			perPage: 20,
		},
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
                header: '상태',
                name: 'custNm',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '구분',
                name: 'custSeq',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '고객명',
                name: 'reserverDtm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '학년',
                name: 'chprNm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '회원번호',
                name: 'consStatNm',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '생년월일',
                name: 'consQustCntn',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '자택전화',
                name: 'consAnsrCntn',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '회원모HP',
                name: 'consTyp1Nm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '회원HP',
                name: 'consTyp2Nm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '회원부HP',
                name: 'consTyp3Nm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '우편',
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
	customerSearchList_grid.on('click', (ev) => {
		customerSearchList_grid.addSelection(ev);
		customerSearchList_grid.clickSort(ev);
    });
	
	// 고객찾기 고객찾기 GRID 끝
	
	// 고객찾기 > 선생님조회 grid
	teacherSearchList_grid = new Grid({
		el: document.getElementById('teacherSearchList_grid'),
		bodyHeight: 420,
		pageOptions: {
			perPage: 20,
		},
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
                header: '구분',
                name: 'custNm',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '선생님명',
                name: 'custSeq',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사원번호',
                name: 'reserverDtm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '주민번호',
                name: 'chprNm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '본부',
                name: 'consStatNm',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사업국',
                name: 'consQustCntn',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '센터',
                name: 'consAnsrCntn',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '전화번호',
                name: 'consTyp1Nm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '직책',
                name: 'consTyp2Nm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '선생님구분',
                name: 'consTyp3Nm',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '소속팀',
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
	teacherSearchList_grid.on('click', (ev) => {
		teacherSearchList_grid.addSelection(ev);
		teacherSearchList_grid.clickSort(ev);
    });
	// 선생님조회 끝
	
	
});

$(function(){
	// 고객찾기 > 고객찾기 grid
	customerSearchList_grid = new Grid({
		el: document.getElementById('customerSearchList_grid'),
		bodyHeight: 480,
		pageOptions: {
			perPage: 20,
			useClient: true
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
                name: 'STATUS',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '구분',
                name: 'CUST_MK',
                width: 50,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '고객명',
                name: 'NAME',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '학년',
                name: 'GRADE',
                width: 120,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '회원번호',
                name: 'MBR_ID',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '생년월일',
                name: 'RSDNO',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => FormatUtil.birth(columnInfo.value)
            },
            {
                header: '자택전화',
                name: 'TELPNO',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '회원HP',
                name: 'MOBILNO',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
            	header: '회원모HP',
            	name: 'MOBILNO_MBR',
            	width: 100,
            	align: "center",
            	sortable: true,
            	ellipsis: true,
            },
            {
                header: '회원부HP',
                name: 'MOBILNO_FAT',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '우편',
                name: 'ZIPCDE',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '주소',
                name: 'ADDR',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '본부',
                name: 'UPDEPTNAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
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
                header: '센터',
                name: 'LC_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
        ],
    });
	customerSearchList_grid.on('click', (ev) => {
		customerSearchList_grid.addSelection(ev);
		customerSearchList_grid.clickSort(ev);
    });
	
	customerSearchList_grid.on('dblclick', (ev) => {
		initAll(); 													// 기존 정보 초기화
		custInfo = customerSearchList_grid.getRow(ev.rowKey);
		var param = {
			    senddataids: ["send1"],
			    recvdataids: ["recv1"],
			    send1: [{
			    	"CUST_ID"		:custInfo.CUST_ID,				// 회원번호
			    }]
			};
		
		$.ajax({
		    url: API_SERVER + '/cns.getCustInfo.do',
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(param),
		    success: function (response) {
		        if(response.errcode == "0"){
		        currentCustInfo = response.recv1[0];				// 고객정보 상주
		        loadCustInfoMain();									// 고객정보 로드 함수
		        	$("#customerInfo").click();	// 탭 이동
		        	$("#customerTab").click();	// 탭 이동
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
    });
	
	// 고객찾기 고객찾기 GRID 끝
	
	// 고객찾기 > 선생님조회 grid
	teacherSearchList_grid = new Grid({
		el: document.getElementById('teacherSearchList_grid'),
		bodyHeight: 500,
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
                name: 'CUST_MK',
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

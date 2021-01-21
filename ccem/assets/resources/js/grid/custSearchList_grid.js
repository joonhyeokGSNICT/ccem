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
		if(ev.targetType == "cell"){
			customerSearchList_grid.addSelection(ev);
			customerSearchList_grid.clickSort(ev);
		}
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
            {
                header: '구분',
                name: 'EMP_MK_NAME',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '선생님명',
                name: 'TCHR_NAME',
                width: 90,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사원번호',
                name: 'EMP_ID',
                width: 90,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: function(e){
                	result = "";
                	if(e.value != null){
                		result = e.value.substring(0,1);
                		for(var i = 0; i< e.value.length-1; i++){
                			result += "*";
                		}
                	}
                	return result;
                }
            },
            {
                header: '주민번호',
                name: 'RSDNO',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => FormatUtil.birth(columnInfo.value)
            },
            {
                header: '본부',
                name: 'DIV_NAME',
                width: 110,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사업국',
                name: 'DEPT_NAME',
                width: 120,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '센터',
                name: 'LC_NAME',
                width: 120,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '전화번호',
                name: 'DEPT_TEL',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => {
                	result = "";
                	if(columnInfo.value != null){
                		result = FormatUtil.tel(columnInfo.value.replace(/ /gi,""));
                		}
                	return result;
                	}
            },
            {
                header: '직책',
                name: 'DUTY_NAME',
                width: 80,
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
                header: '소속팀',
                name: 'PART_NAME',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '재직',
                name: 'STS_NAME',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
            }
        ],
    });
	teacherSearchList_grid.on('click', (ev) => {
		if(ev.targetType == "cell"){
			teacherSearchList_grid.addSelection(ev);
			teacherSearchList_grid.clickSort(ev);
		}
    });
	teacherSearchList_grid.on('dblclick', (ev) => {
		if(ev.targetType == "cell"){
			teacherSearchList_grid.addSelection(ev);
			teacherSearchList_grid.clickSort(ev);
			initAll();	// 기존 정보 초기화
			onAutoSearchTeacher(teacherSearchList_grid.getRow(ev.rowKey).EMP_ID);
		}
    });
	
	// 선생님조회 끝
	
	
});

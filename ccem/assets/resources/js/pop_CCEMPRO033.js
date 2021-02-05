let customerSearchList_grid;
let teacherSearchList_grid;

$(function(){
    
	getCodeList();
	getProd();
	
	
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
    
 	//검색 input 이벤트 1
	$(".searchInputCheck").keyup(function(e){
		var keyCode = e.which;
		if (keyCode === 13) { // Enter Key
			$("#"+$(this).parent().parent().parent().parent().parent().attr("id") + "Btn").click();
		}
		if($(this).val().length != 0){	// 길이가 0일 경우 체크해제
			$("#"+$(this).attr("id") + "Check").prop("checked",true);
		}else {
			$("#"+$(this).attr("id") + "Check").prop("checked",false);
		}
	});
	
	// 고객, 선생님찾기 input 이벤트 2
	$(".searchInputCheck").change(function(e){
		//$("#"+$(this).attr("id") + "Check").prop("checked",true);
		if($(this).val().length != 0){	// 길이가 0일 경우 체크해제
			$("#"+$(this).attr("id") + "Check").prop("checked",true);
		}else {
			$("#"+$(this).attr("id") + "Check").prop("checked",false);
		}
	});
    
    // 조회버튼 부
	$(".searchBtn").click(function(){
		var currentDiv = $(this).parent().attr("id");
		customerSearch(currentDiv);
	});
    
	// 고객찾기 > 고객찾기 grid
	customerSearchList_grid = new Grid({
		el: document.getElementById('customerSearchList_grid'),
		bodyHeight: 400,
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
		if(ev.targetType == "cell"){
			const openerNm = opener ? opener.name : "";
			// 상담등록 화면에서 오픈했을때.
			if (openerNm == "CCEMPRO022") {
				const CUST_ID = customerSearchList_grid.getValue(ev.rowKey, "CUST_ID");  // 고객번호                           
				opener.getBaseData("C", CUST_ID, "I");
				window.close();
			// 입회등록 화면에서 오픈했을때.
			} else if (openerNm == "CCEMPRO031") {
				const CUST_ID = customerSearchList_grid.getValue(ev.rowKey, "CUST_ID");  // 고객번호                           
				opener.getCust(CUST_ID, "I");
				window.close();
			}
		}
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
			const openerNm = opener ? opener.name : "";
			// 상담등록 화면에서 오픈했을때.
			if (openerNm == "CCEMPRO022") {
				const EMP_ID = teacherSearchList_grid.getValue(ev.rowKey, "EMP_ID");  // 사원번호                           
				opener.getBaseData("T", EMP_ID, "I");
				window.close();
			// 부모창이 존재하지 않을때.
			} else {
				alert("선생님조회 중 오류가 발생하였습니다. 팝업창을 닫고 다시 실행해 주세요.");
			}
		}
    });
	
	// 선생님조회 끝
	
	
});



/**
 * 고객,선생님 조회 func
 * @param String
 * @returns
 * 20-12-17 최준혁
 */
function customerSearch(currentDiv){
	switch(currentDiv){
	case 'custSearchDiv' : 															// 고객 조회
		var param = {
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{
		    	"CHK_NAME"		:"",				// 고객명 여부
		    	"CHK_TELNO"		:"",				// 전화번호 여부
		    	"CHK_HPNO"		:"",
		    	"CHK_GRADE"		:"",				// 학년 여부
		    	"CHK_CUSTID"	:"",				// 회원번호 여부
		    	"CHK_RSDNO"		:"",				// 생년월일 여부
		    	"CHK_ADDR"		:"",				// 주소 여부
		    	"CHK_PROD"		:"",				// 과목 여부
		    	"CHK_DEPT"		:"",				// 지점 검색 여부 (Y면 조회)
		    	"CHK_UP_DEPT"	:"",				// 본부 검색 여부 (Y면 조회)
		    	"CHK_EDUPIA"	:"",
		    	"CHK_EMAIL"		:"",				// 이메일 여부
		    	"CHK_MACADAMIA"	:"",
		    	"NAME"			:"",
		    	"TELPNO"		:"",
		    	"MOBILNO"		:"",
		    	"GRADE_CDE"		:"",
		    	"MBR_ID"		:"",
		    	"RSDNO"			:"",
		    	"ADDR"			:"",
		    	"PRDT_ID"		:"",
		    	"DEPT_NAME"		:"",
		    	"UPDEPTID"		:"",
		    	"EDUPIA_ID"		:"",
		    	"CHK_CID"		:"Y",
		    	"DDD"			:"",
		    	"TELPNO1"		:"",
		    	"CHL_LCID"		:"",
		    	"LC_NM"			:"",
		    	"CHK_AUTO_CHG"	:"0",
		    	"CUST_MK"		:"",
		    	"EMAIL"			:"",
		    	"MACADAMIA_ID"	:"",
		    }]
		};
		
		if($("#customerNameCheck").is(":checked")){			// 고객명
			param.send1[0].CHK_NAME = "Y";
			param.send1[0].NAME = $("#customerName").val();
		}
		if($("#customerPhoneCheck").is(":checked")){			// 전화번호
			param.send1[0].CHK_TELNO = "Y";
			param.send1[0].TELPNO = $("#customerPhone").val();
		}
		if($("#customerEmailCheck").is(":checked")){			// EMAIL
			param.send1[0].CHK_EMAIL = "Y";
			param.send1[0].EMAIL = $("#customerEmail").val();
		}
		if($("#customerGradeCheck").is(":checked")){			// 학년
			param.send1[0].CHK_GRADE = "Y";
			param.send1[0].GRADE_CDE = $("#customerGrade").val();
		}
		if($("#customerMNumCheck").is(":checked")){			// 회원번호
			param.send1[0].CHK_CUSTID = "Y";
			param.send1[0].MBR_ID = $("#customerMNum").val();
		}
		if($("#customerBirthCheck").is(":checked")){			// 생년월일
			param.send1[0].CHK_RSDNO = "Y";
			param.send1[0].RSDNO = $("#customerBirth").val();
		}
		if($("#customerAddrCheck").is(":checked")){			// 주소
			param.send1[0].CHK_ADDR = "Y";
			param.send1[0].ADDR = $("#customerAddr").val();
		}
		if($("#customerSubjectCheck").is(":checked")){			// 과목
			param.send1[0].CHK_PROD = "Y";
			param.send1[0].PRDT_ID = $("#customerSubject").val();
		}
		if($("#customerSpotCheck").is(":checked")){			// 지점
			param.send1[0].CHK_DEPT = "Y";
			param.send1[0].DEPT_NAME = $("#customerSpot").val();
		}
		if($("#customerDeptCheck").is(":checked")){			// 본부
			param.send1[0].CHK_UP_DEPT = "Y";
			param.send1[0].UPDEPTID = $("#customerDept").val();
		}
		
		$.ajax({
		    url: API_SERVER + '/cns.getCustList.do',
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(param),
		    success: function (response) {
		        console.log(response);
		        if(response.errcode == "0"){
		        	customerSearchList_grid.resetData(response.recv1);
		        	
		        	// 조회된 수가 1명 일 경우 자동 조회
		        	/*if(response.recv1.length == "1"){
		        		initAll(); 													// 기존 정보 초기화
		        		custInfo = customerSearchList_grid.getRow(0);
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
		        		        }else {
		        		        	loading.out();
		        		        	client.invoke("notify", response.errmsg, "error", 60000);
		        		        }
		        		    }, error: function (response) {
		        		    }
		        		});
		        	}*/
		        	
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
		break;
		
		
	case 'teacherSearchDiv' :														// 선생님 조회					
		var param = {
			userid: opener.currentUser.external_id,
		    menuname: '고객찾기(선생님)',
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: 	[
		    			{
		    				"TCHR_NAME": 	"김소라",
		    				"EMP_ID":		"",
		    				"EMP_MK":		"",
		    				"DEPT_NAME":	"",
		    				"DIV_CDE":		"",
		    				"STS_CDE":		"",
		    				"LC_NM":		"",
		    				"CHK_TCHR_NAME":"",
		    				"CHK_EMP_ID":	"",
		    				"CHK_EMP_MK":	"",
		    				"CHK_DEPT_NAME":"",
		    				"CHK_DIV_CDE":	"",
		    				"CHK_STS_CDE":	"",
		    				"CHK_LC_NM":	""
		    			}
		    		]
		};
		
		if($("#teacherNameCheck").is(":checked")){			// 선생님명
			param.send1[0].CHK_TCHR_NAME = "Y";
			param.send1[0].TCHR_NAME = $("#teacherName").val();
		}
		if($("#teacherDNumCheck").is(":checked")){			// 사원번호
			param.send1[0].CHK_EMP_ID = "Y";
			param.send1[0].EMP_ID = $("#teacherDNum").val();
		}
		if($("#teacherStatCheck").is(":checked")){			// 재직구분
			param.send1[0].CHK_STS_CDE = "Y";
			param.send1[0].STS_CDE = $("#teacherStat").val();
		}
		if($("#teacherLCNameCheck").is(":checked")){		// 센터
			param.send1[0].CHK_LC_NM = "Y";
			param.send1[0].LC_NM = $("#teacherLCName").val();
		}
		if($("#teacherDeptNameCheck").is(":checked")){		// 사업국
			param.send1[0].CHK_DEPT_NAME = "Y";
			param.send1[0].DEPT_NAME = $("#teacherDeptName").val();
		}
		if($("#teacherUpDeptNameCheck").is(":checked")){	// 본부
			param.send1[0].CHK_DIV_CDE = "Y";
			param.send1[0].DIV_CDE = $("#teacherUpDeptName").val();
		}
		
		$.ajax({
		    url: API_SERVER + '/cns.getTchrSearchInfo.do',
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(param),
		    success: function (response) {
		        console.log(response);
		        if(response.errcode == "0"){
		        	teacherSearchList_grid.resetData(response.recv1);
		        	teacherSearchList_grid.refreshLayout();
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
		break;
	}
}

/** 
 * 공통코드 조회
 */
const getCodeList = () => {
	
	var jb = $( 'select' ).get();
	var CODE_MK_LIST = [];
	for(dataObj of jb){
		if(dataObj["name"] != "" && dataObj["name"] != null){
			CODE_MK_LIST.push(dataObj["name"]);
		}
	}
	// get code
	const codeList = opener.codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// sorting
	const sortKey = "CODE_ID";
	codeList.sort((a, b) => a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0);

	// create select options
	for (const code of codeList) {

		const codeType = code.CODE_MK;
		const codeNm = code.CODE_NAME;
		const codeVal = code.CODE_ID;

		// filtering
		if (codeType == "DM_TYPE_CDE") { // 지급사유
			if (codeVal == "01" || codeVal == "02" || codeVal == "04" || codeVal == "05") continue;
		}
		if (codeType == "PROC_MK") { // 처리구분
			if (codeVal == "5" || codeVal == "6") continue;
		}

		// set
		$(`select[name='${codeType}']`).append(new Option(codeNm, codeVal));
	}
}

/**
 * 상담 과목 리스트 조회
 */
const getProd = () => {
	const settings = {
		url: `${API_SERVER}/cns.getProd.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}],
		}),
	}
	$.ajax(settings).done(data => {
		prods = data.dsRecv;
		console.log(prods);
		for(p of prods){
			codeNm = p.PRDT_NAME;
			codeVal = p.PRDT_ID;
			$(`select[name='PRDT_ID']`).append(new Option(codeNm, codeVal));
		}
	});
}
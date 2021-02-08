let grid
var codeData = opener.codeData;

$(function(){
	
	getCodeList();
	getProd();
	
	// 날짜 픽커
	calendarUtil.init('calendar_st',calendarUtil.calendarOption,function(){
		if(($("#calendar_st").val().replace(/_/gi,"").length == 10 && $("#calendar_ed").val().replace(/_/gi,"").length == 10)){	// 길이가 10이 아닌 경우 체크해제
			$("#calendarDateCheck").prop("checked",true);
		}else {
			$("#calendarDateCheck").prop("checked",false);
		}
	});
	calendarUtil.init('calendar_ed',calendarUtil.calendarOption,function(){
		if(($("#calendar_st").val().replace(/_/gi,"").length == 10 && $("#calendar_ed").val().replace(/_/gi,"").length == 10)){	// 길이가 10이 아닌 경우 체크해제
			$("#calendarDateCheck").prop("checked",true);
		}else {
			$("#calendarDateCheck").prop("checked",false);
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
	
	//  input 이벤트 2
	$(".searchInputCheck").change(function(e){
		//$("#"+$(this).attr("id") + "Check").prop("checked",true);
		if($(this).val().length != 0){	// 길이가 0일 경우 체크해제
			$("#"+$(this).attr("id") + "Check").prop("checked",true);
		}else {
			$("#"+$(this).attr("id") + "Check").prop("checked",false);
		}
	});
	
	// 일자 체크 이벤트
	$(".searchInputCheck_dt").keyup(function(e){
		var keyCode = e.which;
		if(keyCode === 13){
		}
		tempId = $(this).attr('id');
		if(($("#"+tempId.split('_')[0]+"_st").val().replace(/_/gi,"").length == 10 && $("#"+tempId.split('_')[0]+"_ed").val().replace(/_/gi,"").length == 10)){	// 길이가 10이 아닌 경우 체크해제
			$("#"+tempId.split('_')[0] + "DateCheck").prop("checked",true);
		}else {
			$("#"+tempId.split('_')[0] + "DateCheck").prop("checked",false);
		}
	});
	
    // create grid
    grid = new Grid({
        el: document.getElementById("grid"),
        bodyHeight: 380,
		pageOptions: {
		  perPage: 13,
		},
		rowHeaders: [
			{
				type: 'rowNum',
                header: "NO",
            },
            {
                type: 'checkbox',
                header: `
                    <input id='all-checkbox' type="checkbox" name="_checked">
                    <span onclick='document.getElementById("all-checkbox").click();' style='cursor: default'>FAX</span>
                `,
                width: 50,
			},
        ],
		columns: [
			{
				header: '접수일자',
				name: 'ACPDATE',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '접수번호',
				name: 'ACPNO',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '순번',
				name: 'ACPSEQ',
				width: 60,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '접수채널',
				name: 'ACPCHNL_NM',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '접수시간',
				name: 'ACPTIME',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원명',
				name: 'MBRNAME',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '학년',
				name: 'GRD',
				width: 60,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '입회과목',
				name: 'SUBJ',
				width: 160,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '전화번호',
				name: 'name9',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '주소',
				name: 'ADDRESS',
				width: 300,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '분류(대)',
				name: 'LTYPE',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '분류(중)',
				name: 'MTYPE',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '연계일자',
				name: 'TRANSDATE',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '연계방법',
				name: 'TRANSWAY',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '연계본부',
				name: 'TRANSHDQ',
				width: 130,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '연계사업국',
				name: 'TRANSCNT',
				width: 130,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '연계센터',
				name: 'TRANSLC',
				width: 130,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '접수자',
				name: 'CNTACPUSER',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '결과',
				name: 'ENTERFLAG',
				width: 70,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담원',
				name: 'USERNAME',
				width: 70,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담내용',
				name: 'CNTS',
				width: 510,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '입회경로',
				name: 'ENTCAU',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '입회사유',
				name: 'MOTIVE_NM',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
			}
		],
    });
    grid.on("click", ev => {
        grid.addSelection(ev);
        grid.clickSort(ev);
        grid.clickCheck(ev);
    });
    
});

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
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// sorting
	const sortKey = "CODE_ID";
	codeList.sort((a, b) => a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0);

	// create select options
	for (const code of codeList) {

		const codeType = code.CODE_MK;
		const codeNm = code.CODE_NAME;
		const codeVal = code.CODE_ID;

		// filtering
		if (codeType == "CSEL_LTYPE_CDE" || codeType == "CSEL_MTYPE_CDE") { // 지급사유
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
		if(data.errcode == "0"){
			prods = data.dsRecv;
			console.log(prods);
			for(p of prods){
				codeNm = p.PRDT_NAME;
				codeVal = p.PRDT_ID;
				$(`select[name='PRDT_ID']`).append(new Option(codeNm, codeVal));
			}
		}
	});
}

// 입회 리스트 조회
function onSearch(){
	var param = {
			userid: currentUserInfo.user.external_id,
		    menuname: '입회조회',
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{
		    	"CHK_DATE":				"",
		    	"VAL_STDATE":			"",
		    	"VAL_EDDATE":			"",
		    	"CHK_USER_GRP_CDE":		"",
		    	"VAL_USER_GRP_CDE":		[{}],
		    	"CHK_TB_USER":		"",
		    	"VAL_TB_USER":		"",
		    	"CHK_LC_NM":		"",
		    	"VAL_LC_NM":		"",
		    	"CHK_DEPT_NM":		"",
		    	"VAL_DEPT_NM":		"",
		    	"CHK_DIV_CDE":		"",
		    	"VAL_DIV_CDE":		[{}],
		    	"CHK_RST":		"",
		    	"VAL_RST":		"",
		    	"CHK_FST_CRS":		"",
		    	"VAL_FST_CRS":		"",
		    	"CHK_CSEL_LTYPE":		"",
		    	"VAL_CSEL_LTYPE":		"",
		    	"CHK_CSEL_MTYPE":		"",
		    	"VAL_CSEL_MTYPE":		"",
		    	"CHK_CSEL_CHNL_MK":		"",
		    	"VAL_CSEL_CHNL_MK":		[],
		    	"CHK_PRDT_GRP":		"",
		    	"VAL_PRDT_GRP":		"",
		    	"CHK_TB_PROD":		"",
		    	"VAL_TB_PROD":		"",
		    }]
		};
		var validationBool = false;
		if($("#calendarDateCheck").is(":checked")){					// 입회일자
			param.send1[0].CHK_DATE = "Y";
			param.send1[0].VAL_STDATE = $("#calendar_st").val();
			param.send1[0].VAL_EDDATE = $("#calendar_ed").val();
			validationBool = true;
		}
		if($("#asignList_cselGrpCheck").is(":checked")){			// 상담원그룹 (리스트)
			param.send1[0].CHK_USER_GRP_CDE = "Y";
			param.send1[0].VAL_USER_GRP_CDE = $("#asignList_cselGrp").val();
			validationBool = true;
		}
		if($("#asignList_cselCheck").is(":checked")){				// 상담원
			param.send1[0].CHK_TB_USER = "Y";
			param.send1[0].VAL_TB_USER = $("#asignList_csel").val();
			validationBool = true;
		}
		if($("#asignList_lcCheck").is(":checked")){					// 센터
			param.send1[0].CHK_LC_NM = "Y";
			param.send1[0].VAL_LC_NM = $("#asignList_lc").val();
			validationBool = true;
		}
		if($("#asignList_deptCheck").is(":checked")){				// 사업국
			param.send1[0].CHK_DEPT_NM = "Y";
			param.send1[0].VAL_DEPT_NM = $("#asignList_dept").val();
			validationBool = true;
		}
		if($("#asignList_updeptCheck").is(":checked")){				// 본부 (리스트)
			param.send1[0].CHK_DIV_CDE = "Y";
			param.send1[0].VAL_DIV_CDE = $("#asignList_updept").val();
			validationBool = true;
		}
		if($("#asignList_rsltCheck").is(":checked")){				// 결과
			param.send1[0].CHK_RST = "Y";
			param.send1[0].VAL_RST = $("#asignList_rslt").val();
			validationBool = true;
		}
		if($("#asignList_joinTypeCheck").is(":checked")){			// 입회경로 (리스트)
			param.send1[0].CHK_FST_CRS = "Y";
			param.send1[0].VAL_FST_CRS = $("#asignList_joinType").val();
			validationBool = true;
		}
		if($("#asignList_topPrdtCheck").is(":checked")){			// 대분류
			param.send1[0].CHK_CSEL_LTYPE = "Y";
			param.send1[0].VAL_CSEL_LTYPE = $("#asignList_topPrdt").val();
			validationBool = true;
		}
		if($("#asignList_midPrdtCheck").is(":checked")){			// 중분류
			param.send1[0].CHK_CSEL_MTYPE = "Y";
			param.send1[0].VAL_CSEL_MTYPE = $("#asignList_midPrdt").val();
			validationBool = true;
		}
		if($("#asignList_inChnlCheck").is(":checked")){				// LC 센터
			param.send1[0].CHK_CSEL_CHNL_MK = "Y";
			param.send1[0].VAL_CSEL_CHNL_MK = $("#asignList_inChnl").val();
			validationBool = true;
		}
		if(validationBool == false){
			client.invoke("notify", "조회조건을 하나 선택해야 합니다.", "error", 6000);
			return;
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
		        	customerSearchList_grid.refreshLayout();
		        	// 조회된 수가 1명 일 경우 자동 조회, 전화인입일경우 
		        	if(response.recv1.length == "1" && type == '1'){
		        		initAll(); 													// 기존 정보 초기화
		        		custInfo = customerSearchList_grid.getRow(0);
		        		onAutoSearch(custInfo.CUST_ID);
		        		
		        	}
		        	
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
}
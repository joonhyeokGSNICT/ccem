let grid
var codeData = opener.codeData;
var tempList;
var sourceList;
var weeklyData; // DS_YHR12

var SSInitFlag = false;

$(function(){

	getCodeList();
	getProd();
	getUser();
	
	$(".searchInputCheck_dt").val(getToday(0));
	$("#calendarDateCheck").prop("checked",true);
	// create multipleSelect
	/*// 상담원그룹
	$('#asignList_cselGrp').multipleSelect({
		selectAll: false,
		onClick: (view) => {
			const selects = $("#asignList_cselGrp").val();
			const isCheck = (selects.length > 0);
			filterUser(selects);
			$("#asignList_cselGrpCheck").prop("checked", isCheck);
			$("#asignList_cselGrp").prop("checked", isCheck);
		},
	});
	// 본부
	$('#asignList_updept').multipleSelect({
		selectAll: false,
		onClick: (view) => $("#asignList_updeptCheck").prop("checked", ($("#asignList_updept").val().length > 0)),
	});
	// 상담채널
	$('#asignList_inChnl').multipleSelect({
		selectAll: false,
		onClick: (view) => $("#asignList_inChnlCheck").prop("checked", ($("#asignList_inChnl").val().length > 0)),
	});*/
	
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
		  perPage: 20,
		  useClient: true
		},
		rowHeaders: [
			{
				type: 'rowNum',
                header: "NO",
            },
        ],
		columns: [
			{
				header: '접수일자',
				name: 'CSEL_DATE',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
			},
			{
				header: '접수번호',
				name: 'CSEL_NO',
				width: 70,
				align: "right",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '시작시간',
				name: 'CSEL_STTIME',
				width: 70,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: function(e){
					return e.value.substring(0,2) + ":" + e.value.substring(2,4)
				}
			},
			{
				header: '회원명',
				name: 'MBR_NAME',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원번호',
				name: 'MBR_ID',
				width: 90,
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
				header: '전화번호',
				name: 'TEL_NO',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '입회연계과목',
				name: 'SUBJ',
				width: 140,
				align: "left",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '학습과목',
				name: 'SUBJ',
				width: 160,
				align: "left",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '주소',
				name: 'ADDRESS',
				width: 460,
				align: "left",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '분류(대)',
				name: 'LTYPE_NM',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '분류(중)',
				name: 'MTYPE_NM',
				width: 110,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '연계일자',
				name: 'TRANS_DATE',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
			},
			{
				header: '연계방법',
				name: 'TRANS_CHNL_MK_NM',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '연계본부',
				name: 'TRANS_HDQ',
				width: 160,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '연계사업국',
				name: 'TRANS_CET',
				width: 160,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '연계센터',
				name: 'TRANS_LC',
				width: 160,
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
				name: 'ENTER_RST',
				width: 60,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담원',
				name: 'USER_NAME',
				width: 70,
				align: "center",
				sortable: true,
				ellipsis: true,
			}
		],
    });
    grid.on("click", ev => {
        grid.addSelection(ev);
        grid.clickSort(ev);
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
			if (codeVal.substring(0,1) != "3") continue;
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


/**
 * 상담원 콤보조회
 */
const getUser = () => {
	const settings = {
		url: `${API_SERVER}/cns.getUser.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: opener.currentUserInfo.user.external_id,
			menuname: "입회조회",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ USER_GRP_CDE: "" }],			// 상담원그룹코드
		}),
		errMsg: "상담원 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		users = data.dsRecv;
		users.forEach(el => $("#asignList_csel").append(new Option(`[${el.USER_ID}] ${el.USER_NAME}`, el.USER_ID)));

		// 상담원그룹과 상담원 세팅
		const currentUserGrp = opener.currentUserInfo.user.user_fields.user_grp_cde || "";
		/*const currentUserLvl = currentUser.user_fields.user_lvl_mk || "";
		const isAdmin = (currentUserLvl == "user_lvl_mk_1" || currentUserLvl == "user_lvl_mk_2" || currentUserLvl == "user_lvl_mk_3") ? true : false;
		const isLowLvl = (currentUserLvl != "user_lvl_mk_1" && currentUserLvl != "user_lvl_mk_2" && currentUserLvl != "user_lvl_mk_3" && currentUserLvl != "user_lvl_mk_4") ? true : false;*/
		$("#asignList_cselGrp").val(currentUserGrp);
		filterUser([currentUserGrp]);
		$("#asignList_csel").val(opener.currentUserInfo.user.external_id);
		$("#asignList_cselGrpCheck").prop("checked", true);
		$("#asignList_cselCheck").prop("checked", true);
		/*
		// 사용자권한에 따라 사용여부 결정
		// 권한이 낮은 사용자
		if (isLowLvl) {
			$("#selectbox8").multipleSelect("disable", true);
			$("#checkbox4").prop("disabled", true);
		}
		// 권한이 높은 사용자
		else if (isAdmin) {
			$("#checkbox8").prop("checked", false);
		}
		// 7100 ESL사업부 - 그룹변경 안되게 수정
		if (currentUserGrp == "7100") {
			$("#selectbox8").multipleSelect("disable", true);
			$("#checkbox4").prop("disabled", true);
		}
		// 엑셀버튼 - 사용자레벨이 3이하 가능
		if (isAdmin) {
			$("#button3").prop("disabled", false);
		} else {
			$("#button3").prop("disabled", true);
		}*/
	});
}

/**
 * 상담원 필터링
 * @param {array} selects 
 */
const filterUser = selects => {
	let selectbox = $("#asignList_csel").empty();
	if(selects.length === 0) return;
	let data = users.filter(el => selects.includes(el.USER_GRP_CDE));
	data.forEach(el => selectbox.append(new Option(`[${el.USER_ID}] ${el.USER_NAME}`, el.USER_ID)));
}


//엑셀 다운로드 excelExport(그리드객체, 파일이름, 테이블id) {
function excelExport(gridId, excelfile, tableId){
	var gridAllData = gridId.getData();
	var gridData = gridId.getColumns();
	$("#"+tableId).empty();
	//헤더
	$("#"+tableId).append("<thead><tr></tr></thead>");
	for(dataObj of gridData){
		if(dataObj["hidden"] == false){
			$("#"+tableId+">thead>tr").append("<th>"+dataObj["header"]+"</th>");
		}
	}
	//내용
	$("#"+tableId).append("<tbody>");
	for(gridRow of gridAllData){
		var appendStr ="";
		appendStr += "<tr>";
		for(dataObj of gridData){
			if(dataObj["hidden"] == false){
				var tempD = gridRow[dataObj["name"]] != null? gridRow[dataObj["name"]]:"";
				appendStr += `<td style="mso-number-format:'\@'">${tempD}</td>`;
			}
		}
		appendStr += "</tr>";
		$("#"+tableId+">tbody").append(appendStr);
	}
	$("#"+tableId).append("</tbody>");
	console.log(gridData);
		var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
		tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
		tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
		tab_text = tab_text + '<x:Name>Sheet</x:Name>';
		tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
		tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
		tab_text = tab_text + "<table border='1px'>";
		var exportTable = $("#"+tableId).clone();
		exportTable.find('input').each(function (index, elem) { $(elem).remove(); });
		tab_text = tab_text + exportTable.html();
		tab_text = tab_text + '</table></body></html>';
		var data_type = 'data:application/vnd.ms-excel';
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
	   var fileName = excelfile + '.xls';
	   //Explorer 환경에서 다운로드
	   if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
	      if (window.navigator.msSaveBlob) {
	         var blob = new Blob([tab_text], {
	            type: "application/csv;charset=utf-8;"
	         });
	         navigator.msSaveBlob(blob, fileName);
	      }
	   } else {
	      var blob2 = new Blob([tab_text], {
	         type: "application/csv;charset=utf-8;"
	      });
	      var filename = fileName;
	      var elem = window.document.createElement('a');
	      elem.href = window.URL.createObjectURL(blob2);
	      elem.download = filename;
	      document.body.appendChild(elem);
	      elem.click();
	      document.body.removeChild(elem);
	   }
}

/*****************************************
*	조회버튼 클릭
*****************************************/
function onSearch(){
	var param = {
		userid: opener.currentUserInfo.user.external_id,
	    menuname: '입회조회(성과)',
	    senddataids: ["send1"],
	    recvdataids: ["recv1"],
	    send1: [{
	    	"SEARCH_STDATE":			"",
	    	"SEARCH_EDDATE":			"",
	    	"CHK_USER_GRP_CDE":		"",
	    	"USER_GRP_CDE":		"",
	    	"CHK_USER_ID":		"",
	    	"USER_ID":		"",
	    	"CHK_CSEL_CHNL_MK":		"",
	    	"CSEL_CHNL_MK":		"",
	    	"CHK_CENTER":		"",
	    	"TRANSLC":		"",
	    	"CHK_TRANSCNT":		"",
	    	"TRANSCNT":		"",
	    	"CHK_TRANSHDQ":		"",
	    	"TRANSHDQ":		"",
	    	"CHK_ENTER_RST_FLAG":		"",
	    	"ENTER_RST_FLAG":		"",
	    	"CHK_CSEL_LTYPE_CDE":		"",
	    	"CSEL_LTYPE_CDE":		"",
	    	"CHK_CSEL_MTYPE_CDE":		"",
	    	"CSEL_MTYPE_CDE":		"",
	    }]
	};
	var validationBool = false;
	if($("#calendarDateCheck").is(":checked")){					// 입회일자
		param.send1[0].SEARCH_STDATE = $("#calendar_st").val().replace(/-/gi,"");
		param.send1[0].SEARCH_EDDATE = $("#calendar_ed").val().replace(/-/gi,"");
		validationBool = true;
	}else {
		alert("기간을 확인 해 주세요.");
	}
	if($("#asignList_cselGrpCheck").is(":checked")){			// 상담원그룹 
		param.send1[0].CHK_USER_GRP_CDE = "Y";
		param.send1[0].USER_GRP_CDE = $("#asignList_cselGrp").val();
		validationBool = true;
	}
	if($("#asignList_cselCheck").is(":checked")){				// 상담원
		param.send1[0].CHK_USER_ID = "Y";
		param.send1[0].USER_ID = $("#asignList_csel").val();
		validationBool = true;
	}
	if($("#asignList_lcCheck").is(":checked")){					// 센터
		param.send1[0].CHK_CENTER = "Y";
		param.send1[0].TRANSLC = $("#asignList_lc").val();
		validationBool = true;
	}
	if($("#asignList_deptCheck").is(":checked")){				// 사업국
		param.send1[0].CHK_TRANSCNT = "Y";
		param.send1[0].TRANSCNT = $("#asignList_dept").val();
		validationBool = true;
	}
	if($("#asignList_updeptCheck").is(":checked")){				// 본부
		param.send1[0].CHK_TRANSHDQ = "Y";
		param.send1[0].TRANSHDQ = $("#asignList_updept").val();
		validationBool = true;
	}
	if($("#asignList_rsltCheck").is(":checked")){				// 결과
		param.send1[0].CHK_ENTER_RST_FLAG = "Y";
		param.send1[0].ENTER_RST_FLAG = $("#asignList_rslt").val();
		validationBool = true;
	}
	if($("#asignList_chnlMKCheck").is(":checked")){			// 접수채널 
		param.send1[0].CHK_CSEL_CHNL_MK = "Y";
		param.send1[0].CSEL_CHNL_MK = $("#asignList_chnlMK").val();
		validationBool = true;
	}
	if($("#asignList_topPrdtCheck").is(":checked")){			// 대분류
		param.send1[0].CHK_CSEL_LTYPE_CDE = "Y";
		param.send1[0].CSEL_LTYPE_CDE = $("#asignList_topPrdt").val();
		validationBool = true;
	}
	if($("#asignList_midPrdtCheck").is(":checked")){			// 중분류
		param.send1[0].CHK_CSEL_MTYPE_CDE = "Y";
		param.send1[0].CSEL_MTYPE_CDE = $("#asignList_midPrdt").val();
		validationBool = true;
	}
	if(validationBool == false){
		alert("최소한 하나의 조회 조건이 필요합니다. \n\n하나 이상의 조회 조건을 선택해 주십시오.");
		return;
	}
	if(!confirm("이 작업은 데이터량에 따라 매우 많은 시간을 필요로 합니다.\n\n계속 하시겠습니까?")) return;

	$.ajax({
	    url: API_SERVER + '/cns.getEnterResult.do',
	    type: 'POST',
	    dataType: 'json',
	    contentType: "application/json",
	    data: JSON.stringify(param),
	    success: function (response) {
	        console.log(response);
	        if(response.errcode == "0"){
	        	console.log(response);
	        	grid.resetData(response.recv1);
	        	sourceList = response.recv1;
	        	onDataMove();
	        }else {
	        	loading.out();
	        	alert(response.errmsg);
	        }
	    }, error: function (response) {
	    }
	});
}

/*****************************************
*	데이터 비교 및 이동 : DATA_MOVE()
*****************************************/
const onDataMove = async () => {
	var sCustId = "";
	var bError = false;
	var sPrdtId = "";
	var iRow = 1;
	var Accept_Dt = "";
	var Leave_Dt1 = "";
	var Join_Dt = "";
	var Leave_Dt = "";
	var DT_Result = false;
	var sError = false;
	
	// 우선 컬럼을 모두 복사
	tempList = sourceList;
	for(iRowSource of sourceList){
		// 학습이력 오류 추정건이 보이도록 처리

		/*for(colCnt of tempList){
			DS_CNS4901.ColumnValue(iRow, colCnt) = DS_CNS4907.ColumnValue(iRowSource-1, colCnt);
		}*/
		iRowSource.STDSBJ = "▶학습이력 오류 추정건";			// 학습과목
		iRowSource.FEE = "";									// 회비
		iRowSource.ENTDATE = "";								// 입회일자
		iRowSource.OUTDATE = "";								// 퇴회일자
		iRowSource.TCHNAME = "";								// 담당선생님
		iRowSource.TCHID = "";									// 담당선생님사번				

		bError = false;

		Accept_Dt = iRowSource.CSEL_DATE;
		sCustId = iRowSource.MBR_ID;

		if(sCustId.length > 0) {
			// BW 조회
			if(!(await getSearchRFC(sCustId))){			// 주간 학습이력 있는지?
				bError = true;
			}
			
		}else{
			bError = true;
		}
		console.log(bError);
		if(!bError) {
			// 퇴회일자 찾기
			Leave_Dt1 = getDataDetail1(Accept_Dt);
			
			for(iRowTarget of weeklyData){
				
				sPrdtId = iRowTarget.PRDT_ID;
				
				// 입회일자 찾기
				await getDataDetail(Accept_Dt, sCustId, sPrdtId, iRowTarget);


				// BW : STD_STDATE
				Join_Dt = iRowTarget.STD_STDATE;
				// BW : STD_EDDATE
				Leave_Dt = iRowTarget.STD_EDDATE;
				// BW : PRDT_ID
				sPrdtId = iRowTarget.PRDT_ID;

				// alert(Accept_Dt + "\n" + Join_Dt + "\n========================");

				// DT_Result
				DT_Result = getMonthJudge(Accept_Dt, Join_Dt, 0, 2);

				if(DT_Result){
					SSInitFlag = false;
					//DS_CNS4901.AddRow();
					
					// 기간이 넘으면 입회기간 오류
					if(!getMonthJudge(Accept_Dt, Join_Dt, 0, 1) && $("#radio2").is(':checked')){
						iRowSource.STDSBJ = "입회 기간 오류";
					} else {
						iRowSource.STDSBJ = iRowTarget.PRDT_SNAME;	// 학습과목
					}

					if(DT_Result){
						iRowSource.ENTDATE = iRowTarget.STD_STDATE;	// 입회일자
					} else {
						iRowSource.ENTDATE = "";
					}

					if(Leave_Dt1!="18000101"){
						iRowSource.OUTDATE = Leave_Dt1;
					} else {
						iRowSource.OUTDATE = "";
					}

					iRowSource.TCHNAME = iRowTarget.EMP_NAME;
					iRowSource.TCHID = iRowTarget.EMP_ID;
				}
			}
		} else {
			// 회원번호 오류 추정건
			// 회원번호 추정건 데이터 입력
			iRowSource.STDSBJ = "▶회원번호 오류 추정건";			// 학습과목
			iRowSource.FEE = "";									// 회비
			iRowSource.ENTDATE = "";								// 입회일자
			iRowSource.OUTDATE = "";								// 퇴회일자
			iRowSource.TCHNAME = "";								// 담당선생님
			iRowSource.TCHID = "";									// 담당선생님사번
		}
	}

	if(sourceList.length >= 1) {
		setExEnable();
	} else {
		alert("데이터가 없습니다.");
	}
}

/*****************************************
*	회원 입회일 & 퇴회일을 점검 & 세팅
*****************************************/
async function getDataDetail(sDate, sMemNo, sPrdtId, TargetRow){
		var sGB = "";
		
		TargetRow.STD_STDATE = "18000101";
		TargetRow.STD_EDDATE = "18000101";
		
		if(await getDetailRFC(sMemNo, sPrdtId)){
			for(jRow of changeData){
				if(getMonthJudge(sDate, jRow.MBR_CHG_DATE, 0, 2)){
					sGB = $.trim(jRow.CODE_NAME);
					
					if(sGB=="입회" || sGB=="복회" || sGB=="소개입회" || sGB=="계약" || sGB=="소개복회"){
						TargetRow.STD_STDATE = jRow.MBR_CHG_DATE;
					} else if (sGB=="학습중단" || sGB=="취소" || sGB=="퇴회"){
						TargetRow.STD_EDDATE = jRow.MBR_CHG_DATE;
					}
				}
			}
		}
}

/*****************************************
*	회원 퇴회일 점검
*****************************************/
function getDataDetail1(sDate){
	var edDate = "";
	var detDate = "";	// 리턴value

	edDate = "18000101";
	detDate = "18000101";
	
	for(h of weeklyData){
		if(getMonthJudge(sDate, h.STD_EDDATE.slice(-6))){
			if(gf_getIntervalDay(edDate, h.STD_EDDATE)>0){
				edDate = h.STD_EDDATE;
				detDate = h.STD_EDDATE;
			}
		}
	}

	return detDate;
}


/*****************************************
*	기준일로 판단하여 결과를 Return
*****************************************/
function getMonthJudge(sDTa, sDTb, PreMon, NextMon){
	var Diff_Date_y = 0;
	var Diff_Date_m = 0;
	var Diff_Date_d = 0;

	// sDT1 - sDT0 : yyyy
	Diff_Date_y = Number(sDTb.substring(0,4)) - Number(sDTa.substring(0,4));

	// sDT1 - sDT0 : mm
	Diff_Date_m = Number(sDTb.substring(4,6)) - Number(sDTa.substring(4,6));
	Diff_Date_m = Diff_Date_m + (Diff_Date_y * 12);

	// sDT1 - sDT0 : dd
	Diff_Date_d = Number(sDTb.substr(6,2)) - Number(sDTa.substr(6,2));

	if ((Diff_Date_m > PreMon) && (Diff_Date_m < NextMon)) { return true; }
	if ((Diff_Date_m == PreMon) && (PreMon != NextMon) && (Diff_Date_d >= 0)) { return true; }
	if ((Diff_Date_m == NextMon) && (PreMon != NextMon) && (Diff_Date_d <= 0)) { return true; }
	if ((PreMon == NextMon) && (Diff_Date_m == 0) && (Diff_Date_d ==0)) { return true; }
	return false;
}

/*****************************************
*	BW에서 주간학습현황조회 : f_SearchRFC
*****************************************/
const getSearchRFC = (id) => new Promise((resolve, reject) => {

	const settings = {
		global: false,
		url: `${API_SERVER}/cns.ifsStudyClass.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
				userid: opener.currentUserInfo.user.external_id,
			    menuname: '입회조회(성과)',
				senddataids: ["send1"],
				recvdataids: ["recv1"],
				send1: [{
					"MBR_ID" : id
				}]
		}),
	}
	$.ajax(settings)
		.done(response => {
			if(response.errcode == "0"){
				if(response.recv1.length > 0){
					if(Object.keys(response.recv1[0]).length > 0){
						weeklyData = response.recv1;		// DS_YHR12
						resolve(true);
						console.log(Object.keys(response.recv1[0]).length);
					}else {
						resolve(false);
					}
				} else {
					resolve(false);
				}
			}else {
				//loading.out();
				alert(response.errmsg);
			}
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/*****************************************
*	BW에서 변동이력 조회 : f_DetailRFC
*****************************************/
function getDetailRFC(id,pd){

	return new Promise((resolve) => {
		
		var param = {
				userid: opener.currentUserInfo.user.external_id,
			    menuname: '입회조회(성과)',
				senddataids: ["send1"],
				recvdataids: ["recv1"],
				send1: [{
					"MBR_ID" : id,
					"PRDT_ID": pd
				}]
		};
		
		$.ajax({
			url: API_SERVER + '/cns.ifsStudyChgInfo.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				console.log(response);
				if(response.errcode == "0"){
					if(response.recv1.length > 0){
						changeData = response.recv1;
						resolve(true);
					} else {
						resolve(false);
					}
				}else {
					loading.out();
					alert(response.errmsg);
				}
			}, error: function (response) {
			}
		});
	});
}

//============================================================================
//Funciotn Name : gf_getIntervalDay(fromtime, totime)
//@ param str :   fromtime : 시작일 / totime : 종료일
//@ return : IntervalDay : 날짜의 interval
//작성자 :
//작성일자 : 2006.07.01
//설명 :  From, TO 날짜를 입력해 날짜의 Interval Day을 알아본다.
//변경일(1) : 2006.12.07
//변경사유(1) : Naming Rule에 따름 / valueHandle 통합
//============================================================================
function gf_getIntervalDay(fromtime, totime)
{
	for ( var i =0; i < 8; i++ )
	{
		if((fromtime.charAt(i) == '.') || (fromtime.charAt(i) ==','))
			return false;
		if((totime.charAt(i) =='.') || (fromtime.charAt(i) == ','))
			return false;
	}

	if ( fromtime.length != 8 || totime.length != 8 )
	{
		return false;
	}

	var year = fromtime.substring(0,4);
	var month = fromtime.substring(4,6);
	var day = fromtime.substring(6,8);
	var year2 = totime.substring(0,4);
	var month2 = totime.substring(4,6);
	var day2 = totime.substring(6,8);

	if(isNaN(year) || isNaN(month) || isNaN(day))
		return false;

	if(isNaN(year2) || isNaN(month2) || isNaN(day2))
		return false;

	if((year <= 0) || (year2 <= 0))
		return false;

	if((month <= 0  || month > 12) || (month2 <= 0  || month2 > 12))
		return false;

	var strFromYear = fromtime.substring(0,4);
	var strFromMonth = fromtime.substring(4,6);
	var strFromDay = fromtime.substring(6,8);
	var strToYear = totime.substring(0,4);
	var strToMonth = totime.substring(4,6);
	var strToDay = totime.substring(6,8);

	var from_time = new Date(strFromYear,Number(strFromMonth)-1,strFromDay);
	var to_time = new Date(strToYear,Number(strToMonth)-1,strToDay);
	var fmillsec = from_time.getTime();
	var tmillsec = to_time.getTime();
	var resultday = (tmillsec - fmillsec)/(1000*60*60*24);
	
	return resultday;
}
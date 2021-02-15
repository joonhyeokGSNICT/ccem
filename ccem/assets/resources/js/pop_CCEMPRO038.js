let grid
var codeData = opener.codeData;

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
		  perPage: 13,
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
				name: 'name1',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '접수번호',
				name: 'name2',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '시작시간',
				name: 'name3',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원명',
				name: 'name4',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원번호',
				name: 'name5',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '학년',
				name: 'name6',
				width: 50,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '전화번호',
				name: 'name7',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '입회연계과목',
				name: 'name8',
				width: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '학습과목',
				name: 'name9',
				width: 150,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '주소',
				name: 'name10',
				width: 200,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '',
				name: 'name11',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '',
				name: 'name12',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '',
				name: 'name13',
				width: 100,
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
	var sCond = false;

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
	    	"CHK_TB_USER":		"",
	    	"VAL_TB_USER":		"",
	    	"CHK_LC_NM":		"",
	    	"VAL_LC_NM":		"",
	    	"CHK_DEPT_NM":		"",
	    	"VAL_DEPT_NM":		"",
	    	"CHK_DIV_CDE":		"",
	    	"VAL_DIV_CDE":		[],
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
		param.send1[0].VAL_STDATE = $("#calendar_st").val().replace(/-/gi,"");
		param.send1[0].VAL_EDDATE = $("#calendar_ed").val().replace(/-/gi,"");
		validationBool = true;
	}else {
		alert("기간을 확인 해 주세요.");
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
	if($("#asignList_inChnlCheck").is(":checked")){				// 상담채널 ( 리스트)
		param.send1[0].CHK_CSEL_CHNL_MK = "Y";
		param.send1[0].VAL_CSEL_CHNL_MK.push($("#asignList_inChnl").val());
		validationBool = true;
	}
	if($("#asignList_prdtGrpCheck").is(":checked")){			// 과목군
		param.send1[0].CHK_PRDT_GRP = "Y";
		param.send1[0].VAL_PRDT_GRP = $("#asignList_prdtGrp").val();
		validationBool = true;
	}
	if($("#asignList_prdtCheck").is(":checked")){			// 과목
		param.send1[0].CHK_TB_PROD = "Y";
		param.send1[0].VAL_TB_PROD = $("#asignList_prdt").val();
		validationBool = true;
	}
	if(validationBool == false){
		alert("조회조건을 하나 선택해야 합니다.");
		return;
	}
	if(!sCond) { alert("최소한 하나의 조회 조건이 필요합니다. \n\n하나 이상의 조회 조건을 선택해 주십시오."); return; }

	if(!confirm("이 작업은 데이터량에 따라 매우 많은 시간을 필요로 합니다.\n\n계속 하시겠습니까?")) return;
	//GRD_ENTREF.DataID = "DS_CNS4901";
			
	// 기본 조회 데이터
    TR_CNS4900.Action   = "/cns/cns4900/cns4900V.jsp";
    TR_CNS4900.KeyValue = "JSP(I:SEARCH=DS_CNS4900,O:RESULT=DS_CNS4907)";
	setTimeout("TR_CNS4900.post()",250);
}
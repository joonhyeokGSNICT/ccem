/**
 * 고객직접퇴회 팝업
 * AS-IS : CNS7200
 */

var grid
var codeData = opener.codeData;
var currentMemberData;

// 엔터 이벤트
$(document).keydown(function(e){
	if(e.keyCode === 13){
		onSearch();
	}
});

//현재 창이 꺼지면 자식 창 클로즈
$(window).on('beforeunload', () => {
    PopupUtil.closeAll();
 });

$(function(){
	
	getCodeList();
	getProd();
	getUser();
	setEnableBtn();
	
	$(".searchInputCheck_dt").val(getToday(0));
	$("#calendarDateCheck").prop("checked",true);
	// create multipleSelect
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
        bodyHeight: 540,
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
        columnOptions: {
            minWidth: 50,
            resizable: true,
        },
		columns: [
			{
				header: '회원명',
				name: 'CUST_NAME',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: columnInfo => FormatUtil.date(columnInfo.value)
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
				header: '고객번호',
				name: 'CUST_ID',
				width: 90,
				align: "center",
				sortable: true,
				ellipsis: true,
				hidden: true
			},
			{
				header: '중단과목',
				name: 'PRDT_NAME',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '연락처',
				name: 'MOBILNO',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: function(e){
					return FormatUtil.tel(e.value);
				}
			},
			{
				header: '은행',
				name: 'BANK_NAME',
				width: 80,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '계좌번호',
				name: 'ACCT_ID',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '환불예상금액',
				name: 'REFUND_AMT',
				width: 120,
				align: "center",
				sortable: true,
				ellipsis: true,
				formatter: function(e){
					return e.value.format();
				}
			},
			{
				header: '중단사유',
				name: 'REFUND_NAME',
				width: 160,
				align: "left",
				sortable: true,
				ellipsis: true,
			},
			{
				header: 'I/B생성여부',
				name: 'PROC_GB',
				width: 70,
				align: "left",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '등록일시',
				name: 'CTI_CREDATE',
				width: 100,
				align: "left",
				sortable: true,
				ellipsis: true,
				formatter: function(e){
					return FormatUtil.dateTime(e.value);
				}
			},
			{
				header: '상담원명',
				name: 'USER_NAME',
				width: 100,
				align: "left",
				sortable: true,
				ellipsis: true,
			},
		],
    });
    grid.on("click", ev => {
        grid.addSelection(ev);
        grid.clickSort(ev);
        grid.clickCheck(ev);
        currentMemberData = grid.getRow(ev.rowKey);
    });
    grid.on("dblclick", ev => {
		// 티켓오픈
		if (ev.targetType != "cell") return;
		const ZEN_TICKET_ID = ev.instance.getValue(ev.rowKey, "ZEN_TICKET_ID");
		if (ZEN_TICKET_ID) opener.client.invoke('routeTo', 'ticket', ZEN_TICKET_ID);
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
			userid: opener.currentUserInfo.user.external_id,
		    menuname: '입회조회',
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{
		    	"CHK_DATE":				"",
		    	"VAL_STDATE":			"",
		    	"VAL_EDDATE":			"",
		    	"CHK_USER_GRP_CDE":		"",
		    	"VAL_USER_GRP_CDE":		[],
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
			param.send1[0].STRDATE = $("#calendar_st").val().replace(/-/gi,"");
			param.send1[0].ENDDATE = $("#calendar_ed").val().replace(/-/gi,"");
			validationBool = true;
		}else {
			alert("기간을 확인 해 주세요.");
		}
		if($("#custQuit_mNumCheck").is(":checked")){			// 회원번호여부 
			param.send1[0].CHK_MBR_ID = "Y";
			param.send1[0].MBR_ID = $("#custQuit_mNum").val();
			validationBool = true;
		}
		if($("#custQuit_genTypeCheck").is(":checked")){				// 생성여부
			//param.send1[0].CHK_TB_USER = "Y";
			param.send1[0].PROC_GB = $("#custQuit_genType").val();
			validationBool = true;
		}
		if(validationBool == false){
			alert("조회조건을 하나 선택해야 합니다.");
			return;
		}
		
		$.ajax({
		    url: API_SERVER + '/cns.getEnter.do',
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(param),
		    success: function (response) {
		        console.log(response);
		        if(response.errcode == "0"){
		        	console.log(response);
		        	var tot = 0;
		        	for(d of response.recv1){
		        		if(d.PRDT_NAME.slice(-1) == ','){
		        			tot += d.PRDT_NAME.split(',').length-1;
		        		}else {
		        			tot += d.PRDT_NAME.split(',').length;
		        		}
		        	}
		        	$("#totalCnt").val(tot);
		        	for(d of response.recv1){
		        		d.TELNO = d.TELNO.replace(/ /gi,"");
		        	}
		        	grid.resetData(response.recv1);
		        }else {
		        	loading.out();
		        	alert(response.errmsg);
		        }
		    }, error: function (response) {
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
		$("#asignList_cselGrp").multipleSelect("setSelects", currentUserGrp);
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
*	보내기 버튼 클릭 (FAX전송)
*****************************************/	
function onSendFax(){
	var chkYN = false;
	var chnlMk = "0";

	// 체크
	if(grid.getData().length < 1) { alert("전송할 내역이 없습니다.\n\n 먼저 조회를 수행 해 주십시오."); return;}

	// 조회결과 루프 돌면서 chk된 건들을 FAX데이터로 구성하는데.
	// 구분에 따라 다른 FAX를 보낸다.
	// 1.입회상담의뢰서(OB) : DS_CNS4800FAX
	// 2.입회상담의뢰서(IB) : DS_CNS4800FAX_IB
	// 3.입회상담의뢰서(EDUPIA) : DS_CNS4800FAX_ED
	if(grid.getCheckedRows().length >= 1) {
		
		// 구성된 데이터를 TR에 실어 전송
		if(!confirm("[" + grid.getCheckedRows().length + "]건의 팩스를 전송합니다.\n\n계속하시겠습니까?")) return;
		
		var paramSet = {
				userid: opener.currentUserInfo.user.external_id,
				menuname: '입회조회',
				senddataids: ["send1"],
				recvdataids: ["recv1"],
				send1: []
		};
		for(listData of grid.getCheckedRows()){
			
			var param = {
					"CHNLMK": "",
					"MBRMK": "",
					"ENTER_RST_FLAG": "",
					"TRANS_CHNL_MK":"3",					// 연계방법구분 fax = 3
					"GUBUN":"",
					"FAX_TIME": String(new Date()).split(" ")[4].replace(/:/gi,""),
					"CSEL_DATE": "",
					"CSEL_NO" : "",
					"CSEL_SEQ" : "",
					"DEPT_ID" : "",
					"FAX_TYPE_CDE" : "",
					"CUST_ID": "",
					"FAX_NO": "",
					"USER_ID" : "",
					"MBR_ID" : "",
					"CUST_NAME" : "",
					"GRADE_CDE": "",
					"PRDT_NAME": "",
					"TRNAS_DIV" : "",
					"TRANS_DEPT" : "",
					"TRANS_LC" : "",
					"TRANS_DATE": "",
					"TRANS_NO": ""
				}
			
			chnlMk = listData.CSEL_CHNL_MK;
			// 입회상담의뢰서 (OB) : 상담채널이 발신, TM발신인 경우
			if(chnlMk == "2" || chnlMk == "7"){
				param.CHNLMK = "OB";
				param.FAX_TYPE_CDE = "DS23";
			}
			// 입회상담의뢰서(EDUPIA) : 상담채널이 인터넷, 발신(에듀피아)인 경우
			else if(chnlMk=="3" || chnlMk=="83"){
				param.CHNLMK = "ED";
				param.FAX_TYPE_CDE = "DS26";
			}
			// 입회상담의뢰서(IB) : 상담채널이 나머지 모두 인 경우
			else{
				param.CHNLMK = "IB";
				param.FAX_TYPE_CDE = "DS10";
			}
			
			param.TRANS_DATE = listData.TRANS_DATE?listData.TRANS_DATE:"";
			param.TRANS_CHNL_MK = "3";													// 연계방법구분 fax = 3
			param.TRNAS_DIV = listData.TRNAS_DIV?listData.TRNAS_DIV:"";
			param.TRANS_DEPT = listData.TRANS_DEPT?listData.TRANS_DEPT:"";
			param.TRANS_LC = listData.TRANS_LC?listData.TRANS_LC:"";
			param.TRANS_NO = listData.TRANS_NO?listData.TRANS_NO:"";
			param.FAX_TIME = String(new Date()).split(" ")[4];
			param.CSEL_DATE = listData.CSEL_DATE?listData.CSEL_DATE:"";
			param.CSEL_NO = listData.CSEL_NO?listData.CSEL_NO:"";
			param.CSEL_SEQ = listData.CSEL_SEQ?listData.CSEL_SEQ:"";
			param.DEPT_ID = listData.DEPT_ID?listData.DEPT_ID:"";
			param.CUST_ID = listData.CUST_ID?listData.CUST_ID:"";
			param.FAX_NO = listData.FAX_NO?$.trim(listData.FAX_NO):"";
			param.USER_ID = opener.currentUserInfo.user.external_id;
			param.MBR_ID = listData.MBR_ID?listData.MBR_ID:"";
			param.CUST_NAME = listData.CUST_NAME?listData.CUST_NAME:"";
			param.GRADE_CDE = listData.GRADE_CDE?listData.GRADE_CDE:"";
			param.PRDT_NAME = listData.PRDT_NAME?listData.PRDT_NAME:"";
			
			// 상담채널 구분(에듀피아인 경우)에 따른 추가 데이터 세팅
			if(chnlMk=="3" || chnlMk=="83"){
				param.ENTER_RST_FLAG = listData.ENTER_RST_FLAG?listData.ENTER_RST_FLAG:"";
				param.MBRMK = listData.CSEL_LTYPE_CDE?listData.CSEL_LTYPE_CDE:"";
				param.GUBUN = listData.CSEL_MTYPE_CDE?listData.CSEL_MTYPE_CDE:"";
			} else {
				param.ENTER_RST_FLAG = "";
				param.MBRMK = "";
				param.GUBUN = "";
			}
			
			paramSet.send1.push(param);
		}
		console.log(paramSet);
		
		$.ajax({
			url: API_SERVER + '/cns.addEnterSendFax.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(paramSet),
			success: function (response) {
				console.log(response);
				if(response.errcode == "0"){
					console.log(response);
					alert("요청이 완료 되었습니다.");
				}else {
					loading.out();
					alert(response.errmsg);
				}
			}, error: function (response) {
			}
		});
		
		
	}else {
		alert("팩스전송 체크된 건이 없습니다.\n\n먼저 체크를 해 주십시오."); return;
	}
}

/*****************************************
*	삭제 버튼 클릭
*****************************************/	
function onDelete(){
	var chkNo = false;
	
	
	
	if(currentMemberData != null){
		var date = currentMemberData.CSEL_DATE;
		var no = currentMemberData.CSEL_NO;
		var seq = currentMemberData.CSEL_SEQ;

		if(opener.currentUserInfo.user.userMK > 2){
			alert("삭제권한이 없습니다.");
			return;
		}

		// CSEL_SEQ가 1만 있으면 삭제 가능
		// SEQ가 1이 아닌 건 삭제 가능
		for(data of grid.getData()){
			if(data.CSEL_NO==no && data.CSEL_SEQ!=1){
				chkNo = true;
			}
		}

		if(chkNo && seq==1){
			alert("동일한 접수번호에 접수순번이 2가지 이상 존재합니다.\n\n먼저 접수순번이 1이 아닌건을 삭제해 주십시오.");
			return;
		}
	
		$.ajax({
		    url: API_SERVER + '/cns.getEnterFlag.do',				// 입회여부조회
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(
		    		{
	    				userid: opener.currentUserInfo.user.external_id,
	    			    menuname: '입회조회',
	    			    senddataids: ["send1"],
	    			    recvdataids: ["recv1"],
	    			    send1: [{
	    			    	"CSEL_DATE" : currentMemberData.CSEL_DATE,
	    			    	"CSEL_NO" : currentMemberData.CSEL_NO,
	    			    	"CSEL_SEQ" : currentMemberData.CSEL_SEQ,
	    			    }]
		    		}
		    ),
		    success: function (response) {
		        console.log(response);
		        if(response.errcode == "0"){
		        	if(response.recv1.length > 0){
		        		alert("입회 완료된 상담이력은 삭제 불가능 합니다.");
		        		return;
		        	} else {
		        		onDelProc(date, no, seq);
		        	}
		        }else {
		        	loading.out();
		        	alert(response.errmsg);
		        }
		    }, error: function (response) {
		    }
		});

	} else {
		alert("삭제할 내용이 없습니다.");
		return;
	}
}

/*****************************************
*	삭제 작업 상세
*****************************************/	
function onDelProc(date, no, seq){
	var lsTransDel = "F";
	var tDate = currentMemberData.TRANSDATE;
	var tNo = currentMemberData.TRANSNO;
	var zenID = currentMemberData.ZEN_TICKET_ID;

	if(confirm("상담일자: " + date + "\n접수번호: " + no + "\n접수순번: " + seq +
	   "\n위 항목에 해당하는 상담이력/상담과목/지점연계 삭제하시겠습니까?" +
	   "\n※ 연계된 상담이력이 있으면 지점연계는 삭제되지 않습니다."))
	{		
		lsTransDel = "F";
		
		$.ajax({
		    url: API_SERVER + '/cns.getTransFlag.do',			// 지점연계여부 조회
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(
		    		{
	    				userid: opener.currentUserInfo.user.external_id,
	    			    menuname: '입회조회',
	    			    senddataids: ["send1"],
	    			    recvdataids: ["recv1"],
	    			    send1: [{
	    			    	"CSEL_DATE" : date,
	    			    	"CSEL_NO" : no,
	    			    	"TRANS_DATE" : tDate,
	    			    	"TRANS_NO" : tNo
	    			    }]
		    		}
		    ),
		    success: function (response) {
		        console.log(response);
		        if(response.errcode == "0"){
		        	
		        	if(response.recv1.length < 2){
		        		lsTransDel = "T";
		        	}
		        	
		        	$.ajax({
		    		    url: API_SERVER + '/cns.delEnterInfo.do',			// 입회삭제
		    		    type: 'POST',
		    		    dataType: 'json',
		    		    contentType: "application/json",
		    		    data: JSON.stringify(
		    		    		{
		    	    				userid: opener.currentUserInfo.user.external_id,
		    	    			    menuname: '입회조회',
		    	    			    senddataids: ["send1"],
		    	    			    recvdataids: ["recv1"],
		    	    			    send1: [{
		    	    			    	"CSEL_DATE" : date,
		    	    			    	"CSEL_NO" : no,
		    	    			    	"CSEL_SEQ" : seq,
		    	    			    	"TRANS_DATE" : tDate,
		    	    			    	"TRANS_NO" : tNo,
		    	    			    	"TRANS_DEL_YN" : lsTransDel == "T" ? "Y":"N",		// 연계정보 삭제 여부(삭제 시 Y)
		    	    			    }]
		    		    		}
		    		    ),
		    		    success: function (response) {
		    		        console.log(response);
		    		        if(response.errcode == "0"){
		    		        	opener.client.request({url:`/api/v2/tickets/${zenID}`,type:'DELETE'}).then(function(d){
		    		        		alert("삭제가 완료되었습니다.");
		    		        	}).catch(function(d){
		    		        		alert('젠데스크 티켓을 삭제하는 도중 오류가 발생했습니다. \n 젠데스크에서 직접 티켓을 삭제 해 주세요. TICKET_ID : ' + zenID)
		    		        		});
		    		        	onSearch();
		    		        }else {
		    		        	loading.out();
		    		        	alert(response.errmsg);
		    		        }
		    		    }, error: function (response) {
		    		    }
		    		});
		        	
		        }else {
		        	loading.out();
		        	alert(response.errmsg);
		        }
		    }, error: function (response) {
		    }
		});
	}else{
		alert("삭제가 취소되었습니다.")
		return;
	}
}

/*****************************************
*	수정 버튼 클릭
*****************************************/	
function onEdit(){
	if(grid.getData().length > 0){
	
	// 전달값
	/*var arr = new Array();
	arr[0] = DS_CNS4801.NameValue(getRowPos("DS_CNS4801"),"ACPDATE");
	arr[1] = DS_CNS4801.NameValue(getRowPos("DS_CNS4801"),"ACPNO");
	arr[2] = DS_CNS4801.NameValue(getRowPos("DS_CNS4801"),"ACPSEQ");*/

	// 리턴값
	//var retVal = "";

		// 권한 확인
		if(opener.currentUserInfo.user.userMK < 3){		// 상담관리자 이상 권한인 경우
			//retVal = gf_popupModal("/cns/cns4800/cns4890.jsp",this,1010,628);
			PopupUtil.open('CCEMPRO031', 1220, 610);
		} else {			// 상담관리자 이하의 권한 등급인 경우
			if(currentMemberData.USER_ID != opener.currentUserInfo.user.external_id){
				alert("상담원이 틀립니다. \n수정할 수 없습니다.");
				return;
			} else {
				//retVal = gf_popupModal("/cns/cns4800/cns4890.jsp",this,1010,628);
				PopupUtil.open('CCEMPRO031', 1220, 610);
			}
		}

		// 저장된 경우 재조회
		//if(retVal) onSearch();
	} else {
		alert("수정할 내역이 없습니다.");
		return;
	}
}

/*****************************************
*	버튼 활성화
*****************************************/
function setEnableBtn(){
//	if(l_rank > 2 && chkGroup()){	// 삭제권한 없음 - 기존
	if(opener.currentUserInfo.user.userMK > 2) {				// 삭제권한 없음 - 2007.03.02 김미경과장 요청
		$("#delBtn").prop('disabled', true);
	} else {						// 삭제권한 있음
		$("#delBtn").prop('disabled', false);
	}
}
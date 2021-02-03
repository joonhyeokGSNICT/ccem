var DS_COUNSEL = [];	// 상담정보

$(function () {

	// create calendar
	$(".calendar").each((i, el) => calendarUtil.init(el.id));

	// input mask
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
	$("#textbox26").inputmask("99년99월99일", { autoUnmask: true, });

	onStart();

});

/**
 * 오픈되는 곳에 따라 분기처리
 */
const onStart = async () => {

	const opener_name = parent.opener.name;
	const hash = parent.location.hash;

    // 탑바 > 고객정보 > 고객 > 선생님소개 버튼으로 오픈
	if (opener_name.includes("top_bar") && hash.includes("by_cust")) {	           
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	
		setCodeData();
		
		// 선생님정보 조회
		const sCSEL_CHNL_MK = "1";	// 접수채널구분        
		const sCSEL_TYPE 	= "T";	// 대상구분 ( "C" : 고객, "T" : 선생님 ) 
		const sCUST_ID 		= $("#custInfo_CUST_ID", topbarObject.document).val(); // 고객번호
		getTchInfo(sCUST_ID, sCSEL_TYPE);

		// 오픈된 티켓세팅
		const origin = sidebarClient ? await sidebarClient.get("ticket") : new Object();
		currentTicket = origin?.ticket;
			
	// 탑바 > 고객정보 > 선생님 > 선생님소개 버튼으로 오픈
	} else if (opener_name.includes("top_bar") && hash.includes("by_tchr")) {
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	
		setCodeData();
		
		// 선생님정보 조회
		const sCSEL_CHNL_MK = "1";	//접수채널구분        
		const sCSEL_TYPE 	= "T";	// 대상구분 ( "C" : 고객, "T" : 선생님 ) 
		const sEMP_ID 		= $("#tchrInfo_EMP_ID", topbarObject.document).val(); // 사원번호
		getTchInfo(sEMP_ID, sCSEL_TYPE);

		// 오픈된 티켓세팅
		const origin = sidebarClient ? await sidebarClient.get("ticket") : new Object();
		currentTicket = origin?.ticket;
		
	}
	// 상담조회 > 상담/입회수정 버튼으로 오픈
	else if (opener_name.includes("CCEMPRO035")) {	
		topbarObject  = parent.opener.topbarObject;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;
		setCodeData();

		const counselGrid	= parent.opener.grid1;				// 상담조회 grid
		const rowKey 		= counselGrid.getSelectedRowKey();	// grid rowKey
		
		// 티켓오픈
		const ZEN_TICKET_ID = counselGrid.getValue(rowKey, "ZEN_TICKET_ID");	// 티켓ID
		if (ZEN_TICKET_ID) topbarClient.invoke('routeTo', 'ticket', ZEN_TICKET_ID);  

		// 상담조회
		const sCSEL_DATE 	= counselGrid.getValue(rowKey, "CSEL_DATE");		// 상담일자
		const sCSEL_NO 		= counselGrid.getValue(rowKey, "CSEL_NO");			// 상담번호
		const sCSEL_SEQ 	= counselGrid.getValue(rowKey, "CSEL_SEQ");			// 상담순번
		calendarUtil.setImaskValue("calendar1", sCSEL_DATE);
		$("#textbox6").val(sCSEL_NO);
		onSearch(sCSEL_SEQ);

	}

}

/**
 * 콤보박스 세팅
 * - as-is : clm3110.setCombo()
 */
const setCodeData = () => {

	const CODE_MK_LIST = [
		"CSEL_CHNL_MK",		// 상담채널
		"TRANS_CHNL_MK",	// 연계방법
		"CANCELLATION_CDE",	// 해지사유
		"RE_ACTIVITY_CRS",	// 재사업경로
		"ACTIVITY_MK",		// 사업구분
		"PROC_STS_MK",		// 처리상태
		"CSEL_MK",			// 상담구분
		"PROC_MK",			// 처리구분
		"FAX_TYPE_CDE",		// FAX구분

		"INTEREST_MK",		// 관심부분
		"RE_ACTIVITY_MK",	// 재사업시기
	];

	// get code
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// sorting
	const sortKey = "CODE_ID";
	codeList.sort((a, b) => a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0);

	// create select or radio
	for (const code of codeList) {
		const CODE_MK = code.CODE_MK;
		const CODE_ID = code.CODE_ID;
		const CODE_NAME = code.CODE_NAME;
		if (CODE_MK == "INTEREST_MK" || CODE_MK == "RE_ACTIVITY_MK") {
			$(`div.${CODE_MK}`).append(
				`<div class="form-check mb-2">
					<input class="form-check-input" type="radio" name="${CODE_MK}" id="${CODE_MK}_${CODE_ID}">
					<label class="form-check-label" for="${CODE_MK}_${CODE_ID}">${CODE_NAME}</label>
				</div>`
			);
		} else {
			$(`select[name='${CODE_MK}']`).append(new Option(CODE_NAME, CODE_ID));
		}
	}

	// init setting
	$("#selectbox7").val("01");	// 처리상태 : 접수
	$("#selectbox8").val("9");	// 상담구분 : 교사소개
	$("#selectbox9").val("6");	// 처리구분 : 소개연계

}

/**
 * 조회
 * - as-is : clm3110.onSearch()
 * @param {string|number} sCSEL_SEQ 상담순번
 */
const onSearch = async (sCSEL_SEQ) => {

	// 상담정보 조회
	const sCSEL_DATE = calendarUtil.getImaskValue("calendar1");			
	const sCSEL_NO 	 = $("#textbox6").val();							
	const cselData 	 = await getCselInfo(sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);	
	
	// 선생님정보 조회
	const sCUST_MK 	 = cselData.CUST_MK;								
	const sCSEL_TYPE = (sCUST_MK=="TC" || sCUST_MK=="PE") ? "T" : "C";		// 대상구분 ( "C" : 고객, "T" : 선생님 )
	getTchInfo(cselData.CUST_ID, sCSEL_TYPE);

}

/**
 * 선생님정보 조회
 * @param {string} sCUST_ID 	고객번호 or 사원번호
 * @param {string} sCSEL_TYPE 	고객구분(C:고객, T: 선생님/직원)
 */
const getTchInfo = (sCUST_ID, sCSEL_TYPE) => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/cns.getTchrCselIntro.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend1", "dsSend2"],
			recvdataids: ["dsRecv1", "dsRecv2"],
			dsSend1: [{
				CUST_ID 	: sCUST_ID, 	
				CSEL_TYPE	: sCSEL_TYPE,	
			}],
			dsSend2: [{
				CSEL_DATE : "", 
				CSEL_NO	  : "",	
			}],
		}),
		errMsg: "선생님정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings)
		.done(res => {
			if (!checkApi(res, settings)) return reject(new Error(getApiMsg(data, settings)));

			const DS_TCHR = res.dsRecv1;
			if (DS_TCHR.length == 0) return reject(new Error(settings.errMsg + "\n\n검색 결과가 없습니다."));

			// 선생님정보 세팅
			const tchrData = DS_TCHR[0];
			$("#textbox2").val(EMP_ID);				// 선생님ID		txtEmpId
			$("#textbox1").val(TCHR_NAME);			// 선생님성함	txtTchrName		
			// tchrData.EMP_MK			// 교사직원구분		
			// tchrData.RSDNO			// 주민번호		
			$("#textbox26").val(BIRTHDAY);			// 생년월일		MSK_BIRTHDAY
			// tchrData.SEX				// 성별	
			// tchrData.SEX_NM			// 성별명		
			// tchrData.AGE				// 나이	
			// tchrData.DEPT_ID			// 지점(부서)코드		
			// tchrData.BRCH_ID			// 소속파트코드		
			// tchrData.TCHR_MK_CDE		// 교사코드			
			// tchrData.DUTY_CDE		// 직책코드			
			// tchrData.STS_CDE			// 상태코드		
			// tchrData.PS_PUB_FLAG		// 신상공개여부			
			$("#textbox4").val(ZIPCDE);				// 우편번호		MSK_ZIPCDE
			$("#textbox5").val(ADDR);  				// 주소			txtAddr
			$("#textbox3").val(TELNO);				// 전화번호		txtTelNo
			// tchrData.MOBILNO			// 휴대폰번호		
			// tchrData.DEPT_NAME		// 부서명			
			// tchrData.DEPT_FAX_DDD	// 부서팩스국번				
			// tchrData.DEPT_FAX_NO1	// 부서팩스번호1				
			// tchrData.DEPT_FAX_NO2	// 부서팩스번호2				
			// tchrData.DEPT_TELNO		// 부서전화번호			
			// tchrData.DIV_CDE			// 지점(본부코드)		
			// tchrData.DIV_NAME		// 본부명			
			// tchrData.AREA_CDE		// 지역코드			
			// tchrData.DEPT_EMP_ID		// 지점장사번

		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 상담정보 조회
 * @param {string} sCSEL_DATE 	상담일자
 * @param {string} sCSEL_NO 	상담번호
 * @param {string} sCSEL_SEQ 	상담순번
 */
const getCselInfo = (sCSEL_DATE, sCSEL_NO, sCSEL_SEQ) => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/cns.getTchrCselIntro.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend1", "dsSend2"],
			recvdataids: ["dsRecv1", "dsRecv2"],
			dsSend1: [{
				CUST_ID 	: "", 	
				CSEL_TYPE	: "",	
			}],
			dsSend2: [{
				CSEL_DATE : sCSEL_DATE, 
				CSEL_NO	  : sCSEL_NO,	
			}],
		}),
		errMsg: "상담정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings)
		.done(res => {
			if (!checkApi(res, settings)) return reject(new Error(getApiMsg(data, settings)));
			
			DS_COUNSEL = res.dsRecv2;
			if (DS_COUNSEL.length == 0) return reject(new Error(settings.errMsg + "\n\n검색 결과가 없습니다."));

			// 상담순번 세팅
			createSeq($("#selectbox2"), DS_COUNSEL.length);
			$("#selectbox2").val(sCSEL_SEQ);
			const cselIdx  = $("#selectbox2 option:selected").index();
			const cselData = DS_COUNSEL[cselIdx];

			// 티켓ID가 존재하고, 추가등록/관계회원이 아닌경우에만 티켓오픈.
			if(cselData.ZEN_TICKET_ID && sCSEL_SEQ == 1) topbarClient.invoke('routeTo', 'ticket', cselData.ZEN_TICKET_ID);

			// 상담정보 세팅 
			// cselData.CSEL_DATE			// 상담일자		
			// cselData.CSEL_NO				// 상담번호		
			// cselData.CSEL_SEQ			// 상담수번		
			// cselData.CUST_ID				// 고객번호		
			// cselData.CUST_MK				// 고객구분		
			// cselData.CSEL_USER_ID		// 상담원ID			
			// cselData.CSEL_STTIME			// 상담시작시간(처리시작시간)			
			// cselData.CSEL_EDTIME			// 상담종료시간(처리종료시간)	
			$("#timebox1").val(getIntervalTime(cselData.CSEL_STTIME, cselData.CSEL_EDTIME)); // 상담시간 				MSK_CSEL_TIME
			$("#selectbox3").val(cselData.CSEL_CHNL_MK);									 // 상담채널구분			CMB_CSEL_CHNL_MK
			$("#selectbox8").val(cselData.CSEL_MK);											 // 상담구분				CMB_CSEL_MK
			// cselData.CSEL_LTYPE_CDE		// 상담대분류코드								 						
			// cselData.CSEL_MTYPE_CDE		// 상담중분류코드								 						
			// cselData.CSEL_STYPE_CDE		// 상담소분류코드								 						
			$("#textbox18").val(cselData.CSEL_TITLE);										 // 상담제목				txtTitle
			$("#textbox19").val(cselData.CSEL_CNTS);										 // 상담내용				txtCnts
			// cselData.OCCUR_DATE			// 문제발생일자									 						
			// cselData.LIMIT_MK			// 처리시한구분									 						
			// cselData.PROC_HOPE_DATE		// 처리희망일자									 						
			// cselData.CSEL_MAN_MK			// 내담자구분									 						
			// cselData.CUST_RESP_MK		// 고객반응구분									 						
			// cselData.CALL_RST_MK			// 통화결과구분									 						
			// cselData.CSEL_RST_MK1		// 상담결과구분1								 						
			// cselData.CSEL_RST_MK2		// 상담결과구분2								 						
			$("#selectbox9").val(cselData.PROC_MK);											 // 처리구분				CMB_PROC_MK
			// cselData.DEPT_ID				// 지점(부서)코드								 						
			// cselData.DIV_CDE				// 지점(본부)코드								 						
			// cselData.AREA_CDE			// 지역코드										 						
			// cselData.GRADE_CDE			// 학년코드										 						
			// cselData.MOTIVE_CDE			// 입회사유코드									 						
			// cselData.FST_CRS_CDE			// 첫상담경로코드								 						
			// cselData.MEDIA_CDE			// 매체구분코드									 						
			calendarUtil.setImaskValue("calendar2", cselData.TRANS_DATE);					 // 연계일자				MSK_TRANS_DATE
			// cselData.TRANS_NO			// 연계번호										 						
			$("#selectbox7").val(cselData.PROC_STS_MK);										 // 처리상태구분			CMB_PROC_STS_MK
			// cselData.VENDER_CDE			// 동종업체코드													
			// cselData.PRDT_ID				// 제품(과목)코드												
			// cselData.WORK_STYL_MK		// 근무형태구분													
			// cselData.USER_GRP_CDE		// 상담원그룹코드												
			// cselData.PLURAL_PRDT_ID		// 병행과목(제품)코드											
			// cselData.MBR_ID				// 회원번호														
			// cselData.DEPT_EMP_ID			// 지점장사번													
			// cselData.CTI_CHGDATE			// CTI변경일자													
			// cselData.TO_TEAM_DEPT		// 지점장부서코드												
			// cselData.OPEN_GBN			// 공개여부(1:공개,0:비공개)									
			// cselData.VOC_MK				// VOC여부(Y)													
			// cselData.CSEL_GRD			// 상담등급														
			// cselData.RE_PROC				// 재확인여부													
			// cselData.CALL_STTIME			// 통화시작시간													
			// cselData.CALL_EDTIME			// 통화종료시간													
			// cselData.STD_STS				// 동종업체학습상태												
			// cselData.ERMS_MK				// ERMS업무구분(1:게시판,2:칭찬,3:불만,4:제안,5:숙제고민)		
			$(`#INTEREST_MK_${cselData.INTEREST_MK}`).prop("checked", true);				// 관심부문					RDO_INTEREST_MK
			$(`#RE_ACTIVITY_MK_${cselData.RE_ACTIVITY_MK}`).prop("checked", true);			// 재사업시기				RDO_REACTIVITY_MK
			$("#selectbox4").val(cselData.CANCELLATION_CDE);								// 해지사유					CMB_CANCELLATION
			$("#selectbox5").val(cselData.RE_ACTIVITY_CRS);									// 재사업경로				CMB_REACTIVITYCRS
			$("#selectbox6").val(cselData.ACTIVITY_MK);										// 사업구분					CMB_ACTIVITY_MK
			$("#textbox21").val(cselData.CSEL_LTYPE);										// 상담대분류명				txtCselLTypeName
			$("#textbox23").val(cselData.CSEL_MTYPE);										// 상담중분류명				txtCselMTypeName
			$("#textbox25").val(cselData.CSEL_STYPE);										// 상담소분류명				txtCselSTypeName
			$("#textbox20").val(cselData.CSEL_LTYPE_NO);									// 상담대분류코드			txtCselLType
			$("#textbox22").val(cselData.CSEL_MTYPE_NO);									// 상담중분류코드			txtCselMType
			$("#textbox24").val(cselData.CSEL_STYPE_NO);									// 상담소분류코드			txtCselSType
			$("#textbox17").val(cselData.TRANS_MK_NAME);									// 연계구분명				txtTransMk
			$("#textbox12").val(cselData.DEPT_NAME);										// 지점명					txtTransDept
			$("#textbox14").val(cselData.USER_NAME);										// 상담원명					txtUserName
			$("#textbox8").val(cselData.DEPT_FAX_DDD);										// 팩스지역번호				MSK_DEPT_FAX_NO1
			$("#textbox9").val(cselData.DEPT_FAX_NO1);										// 팩스전화국번				MSK_DEPT_FAX_NO2
			$("#textbox10").val(cselData.DEPT_FAX_NO2);										// 팩스전화번호				MSK_DEPT_FAX_NO3
			$("#textbox7").val(cselData.DEPT_TELNO);										// 전화번호					txtDeptTelNo
			$("#timebox2").val(cselData.TRANS_TIME);										// 연계시간					MSK_TRANS_TIME
			$("#textbox13").val(cselData.DEPT_ACP_NAME);        							// 본부접수자				txtCntAcp

			// setBtnCtrlAtLoadComp();				// TODO 버튼제어

			return resolve(cselData);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 시간간의 차이를 계산하는 함수
 * - as-is : clm3110.getIntervalTime()
 * @param {*} fromTime 
 * @param {*} toTime 
 */
const getIntervalTime = (fromTime, toTime) => {
	if (fromTime == null || toTime == null) {
		return "000000";
	}

	for (var j = 0; j < 6; j++) {
		if ((fromTime.charAt(j) == ':') || (fromTime.charAt(j) == ','))
			return "000000";
		if ((toTime.charAt(j) == ':') || (toTime.charAt(j) == ','))
			return "000000";
	}

	if (fromTime.length != 6 || toTime.length != 6) {
		return "000000";
	}

	var hour = Number(fromTime.substring(0, 2));
	var min = Number(fromTime.substring(2, 4));
	var sec = Number(fromTime.substring(4, 6));

	var hour2 = Number(toTime.substring(0, 2));
	var min2 = Number(toTime.substring(2, 4));
	var sec2 = Number(toTime.substring(4, 6));

	//fromTime이 toTime 보다 큰 값인지 확인
	if (fromTime >= toTime) {
		return "000000";
	}
	// 아니면 시간 차이를 계산함.
	else {
		// 초계산
		if (sec2 < sec) {
			sec2 = sec2 + 60;
			min2 = min2 - 1;
		}
		var resultsec = sec2 - sec;

		// 분계산
		if (min2 < min) {
			min2 = min2 + 60;
			hour2 = hour2 - 1;
		}
		var resultmin = min2 - min;

		// 시간계산
		if (hour2 < hour) {
			hour2 = hour2 + 24;
		}
		var resulthour = hour2 - hour;

		if (resultsec < 10) { resultsec = "0" + resultsec; }
		else { resultsec = "" + resultsec; }

		if (resultmin < 10) { resultmin = "0" + resultmin; }
		else { resultmin = "" + resultmin; }

		if (resulthour < 10) { resulthour = "0" + resulthour; }
		else { resulthour = "" + resulthour; }

		var result = resulthour + resultmin + resultsec;

		return result;
	}
}
$(function () {

	// create calendar
	$(".calendar").each((i, el) => calendarUtil.init(el.id));

	// input mask
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	onStart();

});

/**
 * 오픈되는 곳에 따라 분기처리
 */
const onStart = () => {

	const opener_name = parent.opener.name;
	const hash = parent.location.hash;

    // TODO 탑바 > 고객정보 > 고객 > 선생님소개 버튼으로 오픈
	if (opener_name.includes("top_bar") && hash.includes("by_cust")) {	           
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	
		
		const sCSEL_CHNL_MK = "1";	// 접수채널구분        
		const sTarget 		= "C";	//대상구분 ( "C" : 고객, "T" : 선생님 )
		const sCUST_ID 		= $("#custInfo_CUST_ID", topbarObject.document).val(); // 고객번호

		setCodeData();
		// TODO 고객정보조회
			
	// TODO 탑바 > 고객정보 > 선생님 > 선생님소개 버튼으로 오픈
	} else if (opener_name.includes("top_bar") && hash.includes("by_tchr")) {
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	
		
		const sCSEL_CHNL_MK = "1";	//접수채널구분        
		const sTarget 		= "T";	//대상구분 ( "C" : 고객, "T" : 선생님 )        
		const sEMP_ID 		= $("#tchrInfo_EMP_ID", topbarObject.document).val(); // 사원번호

		setCodeData();
		// TODO 교사정보조회
		
	}
	// TODO 상담조회 > 상담/입회수정 버튼으로 오픈
	else if (opener_name.includes("CCEMPRO035")) {	
		topbarObject  = parent.opener.topbarObject;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;

		const counselGrid	= parent.opener.grid1;	// 상담조회 grid
		const rowKey 		= counselGrid.getSelectedRowKey();
		const sCSEL_DATE 	= counselGrid.getValue(rowKey, "CSEL_DATE");		// 상담일자
		const sCSEL_NO 		= counselGrid.getValue(rowKey, "CSEL_NO");			// 상담번호
		const sCSEL_SEQ 	= counselGrid.getValue(rowKey, "CSEL_SEQ");			// 상담순번
		const sCUST_ID 		= counselGrid.getValue(rowKey, "CUST_ID");			// 고객번호 or 사원번호
		const sCUST_MK 		= counselGrid.getValue(rowKey, "CUST_MK");			// 고객구분

		calendarUtil.setImaskValue("calendar1", sCSEL_DATE);
		$("#textbox6").val(sCSEL_NO);

		setCodeData();
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
	$("#INTEREST_MK_77").prop("checked", true);		// 관심부분 : YC종합
	$("#RE_ACTIVITY_MK_1").prop("checked", true);	// 재사업시기 : 즉시
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

	const sCSEL_DATE = calendarUtil.getImaskValue("calendar1");			
	const sCSEL_NO 	 = $("#textbox6").val();							
	const cselData 	 = await getCounsel(sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);	
	const sCUST_MK 	 = cselData.CUST_MK;								
	const sTarget 	 = (sCUST_MK=="TC" || sCUST_MK=="PE") ? "T" : "C";		// 대상구분 ( "C" : 고객, "T" : 선생님 )

	// TODO 고객 or 교사정보조회
	sTarget, cselData.CUST_ID

}

/**
 * 상담정보 조회
 * @param {string} sCSEL_DATE 상담일자
 * @param {string} sCSEL_NO   상담번호
 * @param {string} sCSEL_SEQ  상담순번
 */
const getCounsel = (sCSEL_DATE, sCSEL_NO, sCSEL_SEQ) => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/cns.getCounsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
				CSEL_DATE : sCSEL_DATE, // 상담일자, 
				CSEL_NO	  : sCSEL_NO,	// 상담번호
			}],
		}),
		errMsg: "상담등록정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings)
		.done(res => {
			if (!checkApi(res, settings)) return reject(new Error(getApiMsg(data, settings)));
			
			const DS_COUNSEL = res.dsRecv;
			if(DS_COUNSEL.length == 0) return reject(new Error(settings.errMsg + "\n\n검색 결과가 없습니다."));

			// 상담순번 세팅
			createSeq($("#selectbox2"), DS_COUNSEL.length);
			$("#selectbox2").val(sCSEL_SEQ);
			const cselIdx  = $("#selectbox2 option:selected").index();
			const cselData = DS_COUNSEL[cselIdx];

			// 티켓ID가 존재하고, 추가등록/관계회원이 아닌경우에만 티켓오픈.
			if(cselData.ZEN_TICKET_ID && sCSEL_SEQ == 1) topbarClient.invoke('routeTo', 'ticket', cselData.ZEN_TICKET_ID);
			 
			// TODO getCounsel 서비스에 없는 컬럼, 확인필요              
			$(`#RE_ACTIVITY_MK_${cselData.RE_ACTIVITY_MK}`).prop("checked", true);     // RDO_REACTIVITY_MK         	// 재사업시기
			$("#selectbox4").val(cselData.CANCELLATION_CDE);     // CMB_CANCELLATION			// 해지사유
			$("#selectbox5").val(cselData.RE_ACTIVITY_CRS);      // CMB_REACTIVITYCRS			// 재사업경로
			$("#selectbox6").val(cselData.ACTIVITY_MK);          // CMB_ACTIVITY_MK				// 사업구분
			$("#textbox20").val(cselData.CSEL_LTYPE_NO);         // txtCselLType				// 분류(대) 코드
			$("#textbox21").val(cselData.CSEL_LTYPE);            // txtCselLTypeName			// 분류(대) 이름
			$("#textbox22").val(cselData.CSEL_MTYPE_NO);         // txtCselMType				// 분류(중) 코드
			$("#textbox23").val(cselData.CSEL_MTYPE);            // txtCselMTypeName			// 분류(중) 이름
			$("#textbox24").val(cselData.CSEL_STYPE_NO);         // txtCselSType				// 분류(소) 코드
			$("#textbox25").val(cselData.CSEL_STYPE);            // txtCselSTypeName			// 분류(소) 이름
			$("#timebox2").val(cselData.TRANS_TIME);             // MSK_TRANS_TIME				// 연계시간
			$("#textbox17").val(cselData.TRANS_MK_NAME);         // txtTransMk					// 연계구분
			$("#textbox13").val(cselData.DEPT_ACP_NAME);         // txtCntAcp					// 본부접수자
			$("#textbox14").val(cselData.USER_NAME);             // txtUserName					// 상담원
			$("#textbox8").val(cselData.DEPT_FAX_DDD);           // MSK_DEPT_FAX_NO1			// 본부FAX1
			$("#textbox9").val(cselData.DEPT_FAX_NO1);           // MSK_DEPT_FAX_NO2			// 본부FAX2
			$("#textbox10").val(cselData.DEPT_FAX_NO2);          // MSK_DEPT_FAX_NO3			// 본부FAX3
			$("#textbox7").val(cselData.DEPT_TELNO);             // txtDeptTelNo				// 본부전화
						 
			// TODO 상담정보 세팅 
			// cselData.CSEL_DATE				// 상담일자				
			// cselData.CSEL_NO					// 상담번호				
			// cselData.CSEL_SEQ				// 상담순번				
			// cselData.CUST_ID					// 고객번호				
			// cselData.CUST_MK					// 고객구분				
			// cselData.CSEL_USER_ID			// 상담원id					
			// cselData.CSEL_STTIME				// 상담시작시간					
			// cselData.CSEL_EDTIME				// 상담종료시간					
			$("#selectbox3").val(cselData.CSEL_CHNL_MK);         // CMB_CSEL_CHNL_MK			// 상담채널구분					
			$("#selectbox8").val(cselData.CSEL_MK);              // CMB_CSEL_MK					// 상담구분				
			// cselData.CSEL_LTYPE_CDE			// 상담대분류코드					
			// cselData.CSEL_MTYPE_CDE			// 상담중분류코드					
			// cselData.CSEL_STYPE_CDE			// 상담소분류코드					
			$("#textbox18").val(cselData.CSEL_TITLE);            // txtTitle  			// 상담제목				
			$("#textbox19").val(cselData.CSEL_CNTS);             // txtCnts				// 상담상세내용				
			// cselData.OCCUR_DATE				// 문제발생일자				
			// cselData.LIMIT_MK				// 처리시한구분				
			// cselData.PROC_HOPE_DATE			// 처리희망일자					
			// cselData.CSEL_MAN_MK				// 내담자구분					
			// cselData.CUST_RESP_MK			// 고객반응구분					
			// cselData.CALL_RST_MK				// 통화결과구분					
			// cselData.CSEL_RST_MK1			// 상담결과구분					
			// cselData.CSEL_RST_MK2			// 상담결과구분2					
			$("#selectbox9").val(cselData.PROC_MK);              // CMB_PROC_MK					// 처리구분				
			// cselData.DEPT_ID					// 관할지점코드				
			// cselData.DIV_CDE					// 관할본부코드				
			// cselData.AREA_CDE				// 관할지역코드				
			// cselData.GRADE_CDE				// 학년코드				
			// cselData.MOTIVE_CDE				// 입회사유코드				
			// cselData.FST_CRS_CDE				// 첫상담경로					
			$("#calendar2").val(cselData.TRANS_DATE);            // MSK_TRANS_DATE				// 연계일자				
			// cselData.TRANS_NO				// 연계번호				
			$("#selectbox7").val(cselData.PROC_STS_MK);          // CMB_PROC_STS_MK				// 처리상태구분					
			// cselData.WORK_STYL_MK			// 근무형태구분					
			// cselData.USER_GRP_CDE			// 상담원그룹코드					
			// cselData.PLURAL_PRDT_ID			// 병행과목코드					
			// cselData.MBR_ID					// 회원번호			
			// cselData.DEPT_EMP_ID				// 지점장사번					
			// cselData.CTI_CHGDATE				// cti변경일자					
			// cselData.TO_TEAM_DEPT			// 지점장부서					
			// cselData.OPEN_GBN				// 공개여부				
			// cselData.VOC_MK					// VOC			
			// cselData.CSEL_GRD				// 상담등급				
			// cselData.RE_PROC					// 재확인여부				
			// cselData.CALL_STTIME				// 통화시작시간					
			// cselData.CALL_EDTIME				// 통화종료시간					
			// cselData.TELPNO					// 지점전화번호			
			$("#textbox12").val(cselData.DEPT_NAME);             // txtTransDept				// 지점명				
			// cselData.UP_DEPT_NAME			// 본부명					
			// cselData.AREA_NAME				// 지역코드				
			// cselData.CSEL_LTYPE_CDE_D		// 분류(대)						
			// cselData.CSEL_MTYPE_CDE_D		// 분류(중)						
			// cselData.CSEL_STYPE_CDE_D		// 분류(소)						
			// cselData.CSEL_LTYPE_NAME			// 분류(대) 명						
			// cselData.CSEL_MTYPE_NAME			// 분류(중) 명						
			// cselData.CSEL_STYPE_NAME			// 분류(소) 명						
			// cselData.PLURAL_PRDT_LIST		// 병행과목코드						
			// cselData.PLURAL_PRDT_NAME		// 병행과목명						
			// cselData.ORG_CSEL_RST_MK1		// ORG상담결과구분						
			// cselData.TASK_ID					// 태스크ID				
			// cselData.LIST_ID					// 리스트ID				
			// cselData.OB_TYPE					// OB_TYPE				
			// cselData.PROC_DEPT_ID			// 직원상담처리지점					
			// cselData.PROC_DEPT_NAME			// 직원상담처리지점명					
			// cselData.LC_ID					// 센터코드			
			// cselData.LC_EMP_ID				// 센터장사번				
			// cselData.LC_NAME					// 센터명				
			// cselData.TELPNO_LC				// 센터전화번호				
			// cselData.ZEN_TICKET_ID			// ZEN_티켓 ID					
			// cselData.EVT_NM					// 이벤트명			
			// cselData.AGE_CDE					// 연령코드				
			// cselData.DEPT_EMP_NAME			// 지점장명					
			// cselData.DEPT_EMP_MOBILE			// 지점장핸드폰번호						
			// cselData.LC_EMP_NAME				// 센터장명					
			// cselData.LC_EMP_MOBILNO			// 센터장핸드폰번호					

			// setBtnCtrlAtLoadComp();				// 버튼제어

			return resolve(cselData);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});
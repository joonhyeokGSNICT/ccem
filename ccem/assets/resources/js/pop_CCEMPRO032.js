var DS_COUNSEL = [];	// 상담정보

$(function () {

	// 창이 닫힐때 발생하는 event
	$(window).on('beforeunload', () => {
		PopupUtil.closeAll();   // 오픈된 모든 자식창 close
		onSaveCallTime();       // 상담 통화시간 저장
	});

	// create calendar
	$(".calendar").each((i, el) => calendarUtil.init(el.id));

	// input mask
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
	$("#textbox26").inputmask("99.99.99", { autoUnmask: true, });

	setEvent();
	onStart();

});

const setEvent = () => {

	// 티켓생성 버튼 
	$("#button4").on("click", ev => {
		const loading = new Loading(getLoadingSet('티켓을 생성 중 입니다.'));
		onNewTicket()
			.then( async (ticket_id) => { 
				if (ticket_id)  {
					await topbarClient.invoke('routeTo', 'ticket', ticket_id);	// 티켓오픈
					alert("티켓생성이 완료되었습니다."); 
				}
			})
			.catch((error) => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`티켓생성 중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

	// 저장 버튼
	$("#button1").on("click", ev => {
		const loading = new Loading(getLoadingSet('상담등록중 입니다.'));
		onSave()
			.catch((error) => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`상담등록중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

}

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

		// 오픈된 티켓세팅
		await setCurrentTicket();

		// 콤보박스 세팅
		await setCodeData();
		
		// 선생님정보 조회
		const sCSEL_CHNL_MK = "1";	// 접수채널구분        
		const sCSEL_TYPE 	= "C";	// 대상구분 ( "C" : 고객, "T" : 선생님 ) 
		const sCUST_ID 		= $("#custInfo_CUST_ID", topbarObject.document).val(); // 고객번호
		getTchInfo(sCUST_ID, sCSEL_TYPE, "I");
			
	// 탑바 > 고객정보 > 선생님 > 선생님소개 버튼으로 오픈
	} else if (opener_name.includes("top_bar") && hash.includes("by_tchr")) {
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	

		// 오픈된 티켓세팅
		await setCurrentTicket();

		// 콤보박스 세팅
		await setCodeData();
		
		// 선생님정보 조회
		const sCSEL_CHNL_MK = "1";	//접수채널구분        
		const sCSEL_TYPE 	= "T";	// 대상구분 ( "C" : 고객, "T" : 선생님 ) 
		const sEMP_ID 		= $("#tchrInfo_EMP_ID", topbarObject.document).val(); // 사원번호
		getTchInfo(sEMP_ID, sCSEL_TYPE, "I");
	
	// 탑바 > 고객정보, 선생님 > 상담수정 버튼으로 오픈
	} else if (opener_name.includes("top_bar") && hash.includes("by_modify")) {	
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	

		// 콤보박스 세팅
		await setCodeData();

		// 티켓오픈
		if (POP_DATA.ZEN_TICKET_ID) topbarClient.invoke('routeTo', 'ticket', POP_DATA.ZEN_TICKET_ID);  

		// 상담정보 조회
		calendarUtil.setImaskValue("calendar1", POP_DATA.CSEL_DATE);
		$("#textbox6").val(POP_DATA.CSEL_NO);
		onSearch(POP_DATA.CSEL_SEQ);
	
	// 상담조회 > 상담/입회수정 버튼으로 오픈
	} else if (opener_name.includes("CCEMPRO035")) {	
		topbarObject  = parent.opener.topbarObject;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;

		// 콤보박스 세팅
		await setCodeData();

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

	// 전화아이콘 상태를 컨트롤 하기위해
	topbarObject?.wiseNTalkUtil.saveWindowObj(window);

}

/**
 * 콤보박스 세팅
 * - as-is : clm3110.setCombo()
 */
const setCodeData = async () => {

	const CODE_MK_LIST = [
		"CSEL_CHNL_MK",		// 상담채널
		"TRANS_CHNL_MK",	// 연계방법
		"CANCELLATION_CDE",	// 해지사유
		"RE_ACTIVITY_CRS",	// 재사업경로
		"ACTIVITY_MK",		// 사업구분
		"PROC_STS_MK",		// 처리상태
		"CSEL_MK",			// 상담구분
		"PROC_MK",			// 처리구분
		"INTEREST_MK",		// 관심부분
		"RE_ACTIVITY_MK",	// 재사업시기
	];

	// get code
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// sorting
	const sortKey = "CODE_ID";
	codeList.sort((a, b) => a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0);

	// create select options or radio
	for (const code of codeList) {
		
		const CODE_MK = code.CODE_MK;
		const CODE_ID = code.CODE_ID;
		const CODE_NAME = code.CODE_NAME;

		// radio
		if (CODE_MK == "INTEREST_MK" || CODE_MK == "RE_ACTIVITY_MK") {
			$(`div.${CODE_MK}`).append(
				`<div class="form-check mb-2">
					<input class="form-check-input" type="radio" name="${CODE_MK}" id="${CODE_MK}_${CODE_ID}" value="${CODE_ID}">
					<label class="form-check-label" for="${CODE_MK}_${CODE_ID}">${CODE_NAME}</label>
				</div>`
			);

		// select options
		} else {
			$(`select[name='${CODE_MK}']`).append(new Option(CODE_NAME, CODE_ID));
		}

	}

	// init setting
	$("#selectbox7").val("01");	// 처리상태 : 접수
	$("#selectbox8").val("9");	// 상담구분 : 교사소개
	$("#selectbox9").val("6");	// 처리구분 : 소개연계

	// 상담채널 초기세팅
	const { sCSEL_CHNL_MK } = getInitChanel();
	if (sCSEL_CHNL_MK) $("#selectbox3").val(sCSEL_CHNL_MK);

}

/**
 * 조회
 * - as-is : clm3110.onSearch()
 * @param {string|number} CSEL_SEQ 상담순번
 */
var onSearch = async (CSEL_SEQ) => {

	// 상담정보 조회
	const sCSEL_DATE = calendarUtil.getImaskValue("calendar1");	// 상담일자
	const sCSEL_NO 	 = $("#textbox6").val();					// 상담번호
	const sCSEL_SEQ	 = CSEL_SEQ || $("#selectbox2").val();	    // 상담순번
	const cselData 	 = await getCselInfo(sCSEL_DATE, sCSEL_NO, sCSEL_SEQ);	
	
	// 선생님정보 조회
	const sCUST_MK 	 = cselData.CUST_MK;								
	const sCSEL_TYPE = (sCUST_MK=="TC" || sCUST_MK=="PE") ? "T" : "C";		// 대상구분 ( "C" : 고객, "T" : 선생님 )
	getTchInfo(cselData.CUST_ID, sCSEL_TYPE, "U");
	
	// 연계정보 조회
	getEnterData(cselData.TRANS_DATE, cselData.TRANS_NO);

}

/**
 * 선생님정보 조회
 * @param {string} sCUST_ID 	고객번호 or 사원번호
 * @param {string} sCSEL_TYPE 	고객구분(C:고객, T: 선생님/직원)
 * @param {string} sJobType 	저장구분(I/U)
 */
const getTchInfo = (sCUST_ID, sCSEL_TYPE, sJobType) => {

	const settings = {
		url: `${API_SERVER}/cns.getTchrCselIntro.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "선생님소개",
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
			if (!checkApi(res, settings)) return;

			const DS_TCHR = res.dsRecv1;
			const tchrData = (DS_TCHR.length > 0) ? DS_TCHR[0] : new Object();

			// 선생님정보 세팅
			$("#textbox2").val(tchrData.EMP_ID);				// 선생님ID		txtEmpId
			$("#textbox1").val(tchrData.TCHR_NAME);				// 선생님성함	txtTchrName		
			// tchrData.EMP_MK			// 교사직원구분		
			// tchrData.RSDNO			// 주민번호		
			$("#textbox26").val(tchrData.BIRTHDAY);				// 생년월일		MSK_BIRTHDAY
			// tchrData.SEX				// 성별	
			// tchrData.SEX_NM			// 성별명		
			// tchrData.AGE				// 나이	
			// tchrData.DEPT_ID			// 지점(부서)코드		
			// tchrData.BRCH_ID			// 소속파트코드		
			// tchrData.TCHR_MK_CDE		// 교사코드			
			// tchrData.DUTY_CDE		// 직책코드			
			// tchrData.STS_CDE			// 상태코드		
			// tchrData.PS_PUB_FLAG		// 신상공개여부			
			$("#textbox4").val(tchrData.ZIPCDE);				// 우편번호		MSK_ZIPCDE
			$("#textbox5").val(tchrData.ADDR);  				// 주소			txtAddr
			$("#textbox3").val(tchrData.TELNO);					// 전화번호		txtTelNo
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
			$("#hiddenbox2").val(sCSEL_TYPE == "T" ? "TC" : "CM"); // 고객구분(선생님인경우: 'TC', 신규선생님인경우: 'CM')

			// 신규일경우 초기값 세팅
			if (sJobType == "I") {
				calendarUtil.setImaskValue("calendar1", getDateFormat());
				$("#timebox1").val(getTimeFormat());
			}

		});
};

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
			userid: currentUser?.external_id,
			menuname: "선생님소개",
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
			if(DS_COUNSEL.length == 0) {
				const errmsg = settings.errMsg + "\n\n상담정보가 존재하지 않습니다.";
				alert(errmsg);
				return reject(new Error(errmsg));
			}

			// 상담순번 세팅
			createSeq($("#selectbox2"), DS_COUNSEL);
			$("#selectbox2").val(sCSEL_SEQ);
			const cselIdx  = $("#selectbox2 option:selected").index();
			const cselData = DS_COUNSEL[cselIdx];

			// 티켓ID가 존재하고, 추가등록/관계회원이 아닌경우에만 티켓오픈.
			if(cselData.ZEN_TICKET_ID && sCSEL_SEQ == 1) topbarClient.invoke('routeTo', 'ticket', cselData.ZEN_TICKET_ID);

			// 상담정보 세팅 
			calendarUtil.setImaskValue("calendar1", cselData.CSEL_DATE); 					// 상담일자	
			// cselData.CSEL_NO				// 상담번호		
			// cselData.CSEL_SEQ			// 상담수번		
			// cselData.CUST_ID				// 고객번호		
			$("#hiddenbox2").val(cselData.CUST_MK);											// 고객구분		
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
			$("#hiddenbox1").val(cselData.ZEN_TICKET_ID);									// 티켓ID
			$("#hiddenbox3").val(cselData.DIV_KIND_CDE);									// 브랜드ID
			$("#textbox16").val(findCodeName("FAX_TYPE_CDE", "DS27"));						// FAX양식 - 교사소개의뢰서
			
			onChangeACTIVITY_MK();	 // 사업구분 change event
			setBtnCtrlAtLoadComp();	 // 버튼제어

			return resolve(cselData);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 연계정보 조회
 * @param {string} TRANS_DATE 연계일자
 * @param {string} TRANS_NO 연계번호
 */
const getEnterData = (TRANS_DATE, TRANS_NO) => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/cns.getEnterData.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "선생님소개",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv1", "dsRecv2"],
			dsSend: [{ TRANS_DATE, TRANS_NO }],
		}),
		errMsg: "연계정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings)
		.done(res => {
			if (!checkApi(res, settings)) return reject(new Error(getApiMsg(data, settings)));
			
			const DS_TRANS 	   = res.dsRecv1;
			const DS_TRANS_EMP = res.dsRecv2;
			
			// 지점연계정보 세팅
			const transData = (DS_TRANS?.length > 0) ? DS_TRANS[0] : new Object();
			calendarUtil.setImaskValue("calendar2", transData.TRANS_DATE); 	// 연계일자
			// transData.TRANS_NO				// 연계번호
			$("#timebox2").val(transData.TRANS_TIME);				    	// 연계일시
			$("#selectbox10").val(transData.TRANS_CHNL_MK);					// 연계방법	
			// transData.TRANS_DEPT_ID		// 지점코드	
			// transData.DEPT_ACP_ID			// 접수자사번
			// transData.DEPT_ACP_NAME		// 접수자	
			// transData.TRANS_CNTS			// 상담내용
			// transData.DEPT_ACP_DATE 		// 접수일자	
			// transData.DEPT_ACP_TIME		// 접수시간	

			// 지점연계대상자정보 세팅
			const empData = (DS_TRANS_EMP?.length > 0) ? DS_TRANS_EMP : new Array();
			const names = empData.map(el => el.TRANS_EMP_NM).join(", ");
			$("#textbox15").val(names);

			return resolve({DS_TRANS, DS_TRANS_EMP});
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

/**
 * 저장
 * - as-is : clm3110.onSave()
 */
const onSave = async () => {

	const cselData = await getCselCondition();
	if (!cselData) return false;
	const customData = await getCustomData();
	if (!customData) return false;
	if (!confirm("저장 하시겠습니까?")) return false;
	
	// CCEM DB 저장
	const resSave = await saveTchrCounsel(cselData);
	$("#textbox6").val(resSave.CSEL_NO);
	cselData.CSEL_NO = resSave.CSEL_NO;

	// 저장성공후
	onSearch();									// 상담 재조회	
	refreshDisplay();							// 오픈된 화면 재조회
	await updateTicket(cselData, customData);	// 티켓 업데이트
	await saveRecData(cselData);				// 녹취정보 저장
	topbarClient.invoke("popover", "hide"); 	// topbar 숨김
	alert("저장 되었습니다.");
	return true;
	
}

/**
 * 저장 validation check
 * - as-is : clm3110.SaveValidCheck(), setDSInit()
 */
const getCselCondition = async () => {

	const data = {
		ROW_TYPE			: "",		 											// 저장구분(I/U)			
		CSEL_DATE			: calendarUtil.getImaskValue("calendar1"), 				// 상담일자(형식 YYYYMMDD, 신규: 현재일)			
		CSEL_NO				: $("#textbox6").val(), 								// 상담번호(신규입력시 '')		
		CSEL_SEQ			: $("#selectbox2").val(), 								// 상담순번(신규입력시 1)			
		CUST_ID				: $("#textbox2").val(), 								// 고객번호		
		CUST_MK				: $("#hiddenbox2").val(), 								// 고객구분
		EXTERNAL_ID			: currentUser.external_id, 								// 상담원ID			
		// CSEL_STTIME			: "", // 상담시작시간
		// CSEL_EDTIME			: "", // 상담종료시간(신규입력시 '')			
		CSEL_CHNL_MK		: $("#selectbox3").val(), 								// 상담채널구분				
		CSEL_MK				: $("#selectbox8").val(), 								// 상담구분
		CSEL_LTYPE_CDE		: $("#textbox20").val(), 								// 상담대분류코드				
		CSEL_MTYPE_CDE		: $("#textbox22").val(), 								// 상담중분류코드				
		CSEL_STYPE_CDE		: $("#textbox24").val(), 								// 상담소분류코드				
		CSEL_TITLE			: $("#textbox18").val().trim(), 						// 상담제목			
		CSEL_CNTS			: $("#textbox19").val().trim(),		// 상담내용			
		PROC_MK				: $("#selectbox9").val(), 								// 처리구분	
		// DEPT_ID			: "", // 지점(부서코드)		
		// DIV_CDE			: "", // 지점(본부코드)		
		// AREA_CDE			: "", // 지역코드			
		PROC_STS_MK			: getProcStsMk(),		 								// 처리상태구분			
		// DEPT_EMP_ID		: "", // 지점장사번			
		// CALL_STTIME		: "", // 통화시작시간			
		// CALL_EDTIME		: "", // 통화종료시간(신규입력시 '')			
		INTEREST_MK			: $("input[name='INTEREST_MK']:checked")[0]?.value, 	// 관심부분 			
		RE_ACTIVITY_MK		: $("input[name='RE_ACTIVITY_MK']:checked")[0]?.value,  // 재사업시기				
		CANCELLATION_CDE	: $("#selectbox4").val(), 								// 해지사유					
		RE_ACTIVITY_CRS		: $("#selectbox5").val(), 								// 재사업경로				
		ACTIVITY_MK			: $("#selectbox6").val(), 								// 사업구분			
		ZEN_TICKET_ID		: $("#hiddenbox1").val(), 								// 티켓ID				
		// WORK_STYL_MK		: "", // 근무형태구분(신규입력시 '')			
		RECORD_ID			: "",													// 녹취키
		ASSIGNEE_ID			: "", 													// 티켓 담당자 : 티켓 담당자가 없으면 현재 로그인 상담사ID로 세팅
	}
	
	// 저장구분 세팅(I: 신규, U: 수정)
	const selectbox = document.getElementById("selectbox2");
	const selectedSeq = selectbox.value;
	const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;
	data.ROW_TYPE = sJobType;
	
	// 상담분류세팅
	data.CSEL_LTYPE_CDE = data.CSEL_MK + data.CSEL_LTYPE_CDE;
	data.CSEL_MTYPE_CDE = data.CSEL_LTYPE_CDE + data.CSEL_MTYPE_CDE;
	data.CSEL_STYPE_CDE = data.CSEL_MTYPE_CDE + data.CSEL_STYPE_CDE;

	// 신규일 경우 상담시간 세팅
	if (sJobType == "I") {
		data.CSEL_STTIME = $("#timebox1").val();
	}
	// 관심부분
	if (!data.INTEREST_MK) {
		alert("관심부분을 선택해 주십시요.");
		return false;
	}
	// 제목
	if (!data.CSEL_TITLE) {
		alert("제목을 입력하여 주십시요.");
		$("#textbox18").focus();
		return false;
	}
	// 기타요구사항
	if (!data.CSEL_CNTS) {
		alert("기타요구사항을 입력하여 주십시요.");
		$("#textbox19").focus();
		return false;
	}
	if (!checkByte(data.CSEL_CNTS, 4000)) {
		alert("기타요구사항은 4000Byte를 초과할 수 없습니다.");
		$("#textbox19").focus();
		return false;
	}
	// 사업구분이 [신규(신임배정)] 가 아닐경우
	if (data.ACTIVITY_MK != "7A") {
		// 재사업시기
		if (!data.RE_ACTIVITY_MK) {
			alert("재사업시기를 선택해 주십시요.");
			return false;
		}
		// 해지사유
		if (!data.CANCELLATION_CDE) {
			alert("해지사유를 선택하여 주십시요.");
			$("#selectbox4").focus();
			return false;
		}
		// 재사업경로
		if (!data.RE_ACTIVITY_CRS) {
			alert("재사업경로를 선택하여 주십시요.");
			$("#selectbox5").focus();
			return false;
		}
	}
	// 사업구분
	if (!data.ACTIVITY_MK) {
		alert("사업구분을 선택하여 주십시요.");
		$("#selectbox6").focus();
		return false;
	}
	// 분류(대)
	if (!$("#textbox20").val()) {
		alert("분류를 입력해 주십시요.");
		$("#textbox21").focus();
		return false;
	}

	// 저장구분에 따라 티켓체크
	// 상담순번이 1이고, 신규저장일떄.
	if (sJobType == "I" && selectedSeq == 1) {

		// 티켓이 유효한지 체크.
		const ticket_id = await checkTicket();
		if (!ticket_id) return false;
		data.ZEN_TICKET_ID = ticket_id;

		// 녹취키세팅
		data.RECORD_ID = getCustomFieldValue(currentTicket, ZDK_INFO[_SPACE]["ticketField"]["RECORD_ID"]);

	// 추가등록/관계회원 신규저장일때.
	} else if (sJobType == "I" && selectedSeq > 1) {

		// 티켓생성
		const ticket_id = await onNewTicket(DS_COUNSEL[0].ZEN_TICKET_ID);
		if (!ticket_id) return false;
		data.ZEN_TICKET_ID = ticket_id;
	
	// 수정저장일떄.
	} else if (sJobType == "U") {

	} else {
		alert(`저장구분이 올바르지 않습니다.[${sJobType}]\n\n관리자에게 문의하기시 바랍니다.`);
		return false;
	}

	// 티켓 담당자가 없으면 현재 로그인 상담사ID로 세팅
	if (data.ZEN_TICKET_ID) {
		const { ticket } = await zendeskShowTicket(data.ZEN_TICKET_ID);
		if (ticket.assignee_id) data.ASSIGNEE_ID = ticket.assignee_id;
		else data.ASSIGNEE_ID = currentUser.id;
	}

	// 특수문자를 전각문자로 replace
	data.CSEL_CNTS = data.CSEL_CNTS.replaceAll("%", "％");
	data.CSEL_CNTS = data.CSEL_CNTS.replaceAll("+", "＋");

	return data;
}

/**
 * 선생님소개 저장
 */
const saveTchrCounsel = (cselData)  => new Promise((resolve, reject) => {

	const settings = {
		global: false,
		url: `${API_SERVER}/cns.saveTchrCounsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "선생님소개",
			senddataids	: ["dsSend"],
			recvdataids	: ["dsRecv"],
			dsSend		: [cselData],
		}),
	}
	
	$.ajax(settings)
		.done(data => {
			if (data.errcode != "0") return reject(new Error(getApiMsg(data, settings)));
			if (data.dsRecv.length == 0) return reject(new Error("저장 결과 데이터가 존재하지 않습니다."));
			return resolve(data.dsRecv[0]);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 티켓정보 value check
 */
const getCustomData = async () => {

    const data = {
	    prdtList 	    : "", // 과목리스트(ex. ["11::2k", "11::k","10::m"])
		deptIdNm 	    : "", // 지점부서명(사업국명)
	    aeraCdeNm 	    : "", // 지역코드명
	    procDeptIdNm    : "", // 연계부서명
        lcName 		    : "", // 러닝센터명(센터명)
		reclCntct 	    : "", // 재통화예약연락처
		brandId			: $("#hiddenbox3").val(), // 브랜드ID
		empList    		: [], // 연계대상자
		requesterId		: undefined, // requester_id
		transMk			: "4",		 // 연계구분 - 소개연계
	}

	// 고객번호가 있을경우에만 requesterId 세팅
	const sCUST_ID = $("#textbox2").val();
	if (sCUST_ID) {
		const { users } = await zendeskUserSearch(sCUST_ID.trim());

		if (users.length === 0) {
			alert("젠데스크 사용자를 생성중입니다.\n\n잠시후 다시 시도해 주세요.");
			return false;
		}

		data.requesterId = users[0].id;
	}
	
	return data;

}

/**
 * 저장이 완료 되었거나, 팝업되어 수정 상황일때 버튼 컨트롤 하는 함수.
 */
const setBtnCtrlAtLoadComp = () => {

	$("#button2").prop("disabled", false);	// 입회연계 활성화
	$("#button4").prop("disabled", true);	// 티켓생성버튼 비활성화

}

/**
 * 티켓생성버튼
 * @param {string|number} parent_id Zendesk ticket id
 */
const onNewTicket = async (parent_id) => {
	
	// 사용자 체크
	const CUST_ID = $("#textbox2").val();
	const CUST_NAME = $("#textbox1").val();
	const CUST_MK = $("#hiddenbox2").val();	// 고객구분
	const target = (CUST_MK == "PE" || CUST_MK == "TC") ? "T" : "C";	// 대상구분(고객 : C, 선생님 : T)
	const user_id = await checkUser(target, CUST_ID, CUST_NAME);
	if (!user_id) return false;

	// 티켓생성
	const origin = await createTicket(user_id, parent_id);
	currentTicket = origin.ticket;
	$("#button4").prop("disabled", true);	// 티켓생성버튼 비활성화

	return currentTicket.id;

}

/**
 * 처리상태구분 반환.
 * @return {string} 처리상태구분 
 */
const getProcStsMk = () => {
	let PROC_STS_MK = "";
	const txtCntAcp = $("#textbox13").val();

	if (txtCntAcp) {
		PROC_STS_MK = "99";	// 완료
	} else {
		PROC_STS_MK = "03"; // 지점으로 전달완료
	}

	return PROC_STS_MK;
}

	
/**
 * 전화걸기
 * - as-is : clm3110.onMakeCall()
 */
 const onMakeCall = (elm) => {

	const status = $(elm).hasClass("callOn") ? "callOn" : "callOff";
	const targetPhone = $("#textbox7").val().trim().replace(/-/gi,''); // 본부 전화번호
	const selectbox = document.getElementById("selectbox2");
	const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;
	const sCselSeq = selectbox.value;
	const ticket_id = $("#hiddenbox1").val();

	// 고객과의 통화시간을 저장하기 위해서
	// 고객과 통화종료후 SEQ=1인것을 저장을 하지 않은상태에서 지점 전화걸기를 막는다.
	if (status == "callOn" && sJobType == "I" && sCselSeq == "1") {
		alert("먼저 선생님소개 정보를 저장하신 후에 \n\n지점으로 전화를 걸기 바랍니다.");
		return;
	}
	
	if (status == "callOn" && targetPhone.length < 4) {
		alert("전화걸기를 할 수 없습니다.\n\n전화번호가 유효하지 않습니다.");
		return;
	}
	
	topbarObject.wiseNTalkUtil.callStart(status, targetPhone, "CCEMPRO032", ticket_id, "1");

}

/**
 * 상담 통화시간 저장
 */
 const onSaveCallTime = async () => {

	// 현재 상담건의 저장구분이 수정(U) 일 경우 상담 통화시간 저장
	if (getJobType("selectbox2") == "U") {

		const ticket_id = $("#hiddenbox1").val();
		if (!ticket_id) return;

		const data = await getCallTimeCondition(topbarClient, ticket_id);
		
		topbarObject.saveCallTime({
			userid			: currentUser?.external_id,
			menuname		: "선생님소개",
			CSEL_NO			: $("#textbox6").val(), 					// 상담번호	
			CSEL_DATE		: calendarUtil.getImaskValue("calendar1"),  // 상담일자		
			CALL_STTIME		: data.CALL_STTIME, 						// 통화시작시간(시분초:172951)
			CALL_EDTIME		: data.CALL_EDTIME, 						// 통화종료시간(시분초:173428)
			RECORD_ID		: data.RECORD_ID, 							// 녹취키(리스트) 없는 경우 []
		});

	}

}

/**
 * 사업구분 change evnet
 * - as-is : clm3110.CMB_ACTIVITY_MK.OnSelChange2();
 */
const onChangeACTIVITY_MK = () => {

	const value = $("#selectbox6").val();
	
	// 신규일경우 = 해지사유, 재사업구분 비활성화
	if (value == "7A") {
		$("#selectbox4 option:eq(0)").prop("selected", true);
		$("#selectbox5 option:eq(0)").prop("selected", true);
		$("#selectbox4").prop("disabled", true);
		$("#selectbox5").prop("disabled", true);
	} else {
		$("#selectbox4").prop("disabled", false);
		$("#selectbox5").prop("disabled", false);
	}

}

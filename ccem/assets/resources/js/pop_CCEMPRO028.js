let currentUser;		// 현재 사용중인 유저의 정보(ZENDESK)
let topbarClient;

let grid1, grid2;

let sPROC_MK 	= "";	// 처리구분
let sCSEL_DATE 	= "";	// 상담일자
let sCSEL_NO 	= "";	// 상담번호

let SEND_PHONE = "";	// SMS발신번호

$(function () {

	// create calendar
	calendarUtil.init("calendar3", { drops: "up" });

	// input mask
	calendarUtil.dateMask("calendar1");
	calendarUtil.timeMask("time1");
    $(".imask-tel").each((i, el) => calendarUtil.telMask(el.id));

	// 앱알림 버튼 event
	$("#button1").on("click", ev => {
		const loading = new Loading(getLoadingSet('앱알림 전송 중 입니다.'));
		onAppSend()
			.then(succ => { if(succ) alert("앱알림이 전송되었습니다."); })
			.catch((error) => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`앱알림 전송중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

	// SMS 버튼 event
	$("#button2").on("click", ev => {
		const loading = new Loading(getLoadingSet('SMS 발송 중 입니다.'));
		onSMSSend()
			.then(succ => { if(succ) alert("SMS가 발송 되었습니다."); })
			.catch(error => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`SMS 발송중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

	// FAX 버튼 event
	$("#button3").on("click", ev => {
		const loading = new Loading(getLoadingSet('FAX 전송 중 입니다.'));
		onFAXSend()
			.then(succ => { if(succ) alert("FAX가 전송되었습니다."); })
			.catch(error => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`FAX 전송중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

	createGrids();
	onStart(opener ? opener.name : "");

});

const createGrids = () => {
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 100,
		rowHeaders: [
            { type: 'checkbox', },
			{ type: 'rowNum', header: "NO", },
		],
		columns: [
			{ header: '고객명',           name: 'TCHR_CUST_NAME',    width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: false, },
			{ header: '학년',             name: 'GRADE',             width: 60,     align: "center",    sortable: false, ellipsis: true, hidden: false, },
			{ header: '회원번호',         name: 'MBR_ID',            width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: false, },
			{ header: 'ID',               name: 'ID',                width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '과목',             name: 'PLURAL_PROD',       width: 150,    align: "center",    sortable: false, ellipsis: true, hidden: false, },
			{ header: '전화번호',         name: 'TELNO',             width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '휴대폰번호',       name: 'MOBILNO',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '세대주명',         name: 'FAT_NAME',          width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '세대주민번호',     name: 'FAT_RSDNO',         width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '우편번호',         name: 'ZIPCDE',            width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '전체주소',         name: 'FULLADDR',          width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '상담일자',         name: 'CSEL_DATE',         width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '상담번호',         name: 'CSEL_NO',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '상담순번',         name: 'CSEL_SEQ',          width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '처리구분',         name: 'PROC_MK',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '상담시간',         name: 'CSEL_STTIME',       width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '회원번호',         name: 'MBR_ID2',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '채널구분',         name: 'CSEL_CHNL_MK',      width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '고객번호',         name: 'CUST_ID',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '상담결과',         name: 'CSEL_RST_MK1',      width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '상담구분',         name: 'CSEL_MK',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '상담제목',         name: 'CSEL_TITLE',        width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '상담내용',         name: 'CSEL_CNTS',         width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '관할지점코드',     name: 'DEPT_ID',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '관할본부코드',     name: 'DIV_CDE',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '관할지역코드',     name: 'AREA_CDE',          width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '지점장부서',       name: 'TO_TEAM_DEPT',    width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '연계일자',         name: 'TRANS_DATE',        width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '연계번호',         name: 'TRANS_NO',          width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '처리상태구분',     name: 'PROC_STS_MK',       width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '회신여부',         name: 'RTN_FLAG',          width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '연계방법구분',     name: 'TRANS_CHNL_MK',     width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '연계구분',         name: 'TRANS_MK',          width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '연계시간',         name: 'TRANS_TIME',        width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '지점명',           name: 'DEPT_NAME',         width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '본부명',           name: 'DIV_NAME',          width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '상담원',           name: 'CSEL_USER',         width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '사용자지점',       name: 'USER_DEPT',         width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '지점전화번호',     name: 'DEPT_TELNO',        width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '지점팩스DDD',      name: 'DEPT_FAX_DDD',      width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '지점팩스1',        name: 'DEPT_FAX_NO1',      width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '지점팩스2',        name: 'DEPT_FAX_NO2',      width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '이메일',           name: 'E_MAIL',            width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '지점장 ID',        name: 'DEPT_EMP_ID',       width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '지점장명',         name: 'DEPT_EMP_NAME',     width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '지점장휴대폰',     name: 'DEPT_EMP_MOBILNO',  width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '회원신상공개여부', name: 'OPEN_GBN',          width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '지점장스마트폰',   name: 'DEPT_EMP_PDANO',    width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '관할센터코드',     name: 'LC_ID',             width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '센터명',           name: 'LC_NAME',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '센터전화번호',     name: 'LC_TELNO',          width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '센터팩스DDD',      name: 'LC_FAX_DDD',        width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '센터팩스1',        name: 'LC_FAX_NO1',        width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '센터팩스2',        name: 'LC_FAX_NO2',        width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '센터장 ID',        name: 'LC_EMP_ID',         width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '센터장명',         name: 'LC_EMP_NAME',       width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '센터장휴대폰',     name: 'LC_EMP_MOBILNO',  	 width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '고객구분',         name: 'CUST_MK',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: '처리희망일',       name: 'PROC_HOPE_DATE',	 width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			{ header: 'TICKET ID',       name: 'ZEN_TICKET_ID',		 width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
			
		],
	});

	grid1.on("focusChange", (ev) => {
		grid1.addSelection(ev);

		// 입회건인 경우 제목 세팅
		if (grid1.getValue(ev.rowKey, "PROC_MK") == "5" && !grid1.getValue(ev.rowKey, "CSEL_TITLE")) {
			grid1.setValue(ev.rowKey, "CSEL_TITLE", "입회상담");
		}

		// 상담정보 세팅
		$("#textbox1").val(grid1.getValue(ev.rowKey, "TELNO"));				// 전화번호
		$("#textbox2").val(grid1.getValue(ev.rowKey, "MOBILNO"));			// 핸드폰
		$("#textbox3").val("");												// 직장전화
		$("#textbox4").val(grid1.getValue(ev.rowKey, "FAT_NAME"));			// 학부모명
		$("#textbox5").val(grid1.getValue(ev.rowKey, "ZIPCDE"));			// 주소1
		$("#textbox6").val(grid1.getValue(ev.rowKey, "FULLADDR"));			// 주소2
		$("#textbox7").val(grid1.getValue(ev.rowKey, "CSEL_TITLE"));		// 제목
		$("#textbox8").val(grid1.getValue(ev.rowKey, "CSEL_CNTS"));			// 상담내용

	});

	grid1.on("click", (ev) => {
		grid1.clickSort(ev);
		grid1.clickCheck(ev);
	});

	grid1.on("onGridUpdated", (ev) => {

	});

	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 100,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", },
		],
		columns: [
			{ header: '상담과목',    name: 'CSEL_PROD',              align: "center", sortable: true, ellipsis: true, hidden: false, },
			{ header: '과목ID',      name: 'PRDT_ID',                align: "center", sortable: true, ellipsis: true, hidden: true,  },
			{ header: '선생님',      name: 'TCHR_NAME',              align: "center", sortable: true, ellipsis: true, hidden: false, },
			{ header: '사업팀장',    name: 'PART_EMP_NAME',          align: "center", sortable: true, ellipsis: true, hidden: false, },
		],
	});

	grid2.on("click", (ev) => {
		grid2.addSelection(ev);
		grid2.clickSort(ev);
	});
}

const onStart = async (openerNm) => {

	// 상담등록 화면에서 오픈했을때.
	if (openerNm.includes("CCEMPRO022")) {
		currentUser = opener.currentUser;
		topbarClient = opener.topbarClient;
		setCodeData(opener.codeData);
		sPROC_MK 	= opener.document.getElementById("selectbox4").value;
		sCSEL_DATE  = opener.calendarUtil.getImaskValue("textbox27");
		sCSEL_NO    = opener.document.getElementById("textbox28").value;
		setDisPlay();
		getCselTrans();
	// 입회등록 화면에서 오픈했을때.
	} else if (openerNm.includes("CCEMPRO031")) {
		currentUser = opener.currentUser;
		topbarClient = opener.topbarClient;
		setCodeData(opener.codeData);
		sPROC_MK 	= "5";
		sCSEL_DATE  = opener.calendarUtil.getImaskValue("calendar3");
		sCSEL_NO    = opener.document.getElementById("textbox7").value;
		setDisPlay();
		getCselTrans();
	// 선생님소개 화면에서 오픈했을때.
	} else if (openerNm.includes("CCEMPRO032")) {
		currentUser = opener.currentUser;
		topbarClient = opener.topbarClient;
		setCodeData(opener.codeData);
		sPROC_MK 	= opener.document.getElementById("selectbox9").value;
		sCSEL_DATE  = opener.calendarUtil.getImaskValue("calendar1");
		sCSEL_NO    = opener.document.getElementById("textbox6").value;
		setDisPlay();
		getCselTrans();
	}

}

/**
 * 콤보박스 세팅
 * - as-is : cns2510.setCombo()
 * @param {object} codeData 
 */
const setCodeData = (codeData) => {

	const CODE_MK_LIST = [
		"RTN_FLAG", 		// 회신여부
		"TRANS_CHNL_MK", 	// 연계방법구분
		"PROC_STS_MK",		// 처리상태구분
		"FAX_TYPE_CDE",		// FAX 구분
	];

	// get code
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// create select options
	for (const code of codeList) {
		$(`select[name='${code.CODE_MK}']`).append(new Option(code.CODE_NAME, code.CODE_ID));
	}

}

/**
 * 처리구분에 따라 화면세팅
 * - as-is : cns2510.setDisPlay()
 */
const setDisPlay = () => {

	if (sPROC_MK == "3") {   // 상담연계
		$("#textbox11").val("상담연계");
		$("#hiddenbox1").val("DS11");
		$("#textbox16").val($("#hiddenbox1 option:selected").text());	// FAX 양식명(상담처리 요청서)
	}
	else if (sPROC_MK == "4") { // 시정처리
		$("#textbox11").val("시정처리");
		$("#hiddenbox1").val("DS12");
		$("#textbox16").val($("#hiddenbox1 option:selected").text()); 	// FAX 양식명(고객불편 시정처리서)
	}
	else if (sPROC_MK == "5") { // 입회연계
		$("#textbox11").val("입회연계");
		$("#hiddenbox1").val("DS10");
		$("#textbox16").val($("#hiddenbox1 option:selected").text());	// FAX 양식명(입회상담 의뢰서)
	}
	else if (sPROC_MK == "6") { // 소개연계
		$("#textbox11").val("소개연계");
		$("#hiddenbox1").val("DS27");
		$("#textbox16").val($("#hiddenbox1 option:selected").text());	// FAX 양식명(교사소개의뢰서)
	}
	else {                // 위의 4가지 경우외에는 연계할 수 없다.
		$("#textbox11").val("연계건이 아닙니다.");
		$("#textbox16").val("연계건이 아닙니다.");
	}
}

/**
 * 연계정보세팅
 * - as-is : cns2510.setTransDisPlay()
 */
var setTransDisPlay = (data) => {

	if (!data.LC_ID) {
		// 사업국 정보 설정
		$("#textbox10").val(data.DEPT_NAME);	// 지점명(연계)
		$("#textbox9").val(data.DEPT_TELNO);	// 지점전화번호(전화)
		$("#textbox12").val(data.DEPT_FAX_DDD);	// 지점팩스DDD(FAX1)
		$("#textbox13").val(data.DEPT_FAX_NO1); // 지점팩스1(FAX2)
		$("#textbox14").val(data.DEPT_FAX_NO2); // 지점팩스2(FAX3)
	} else {
		// 센터 정보 설정
		$("#textbox10").val(data.LC_NAME);		// 센터명(연계)
		$("#textbox9").val(data.LC_TELNO);		// 센터전화번호(전화)
		$("#textbox12").val(data.LC_FAX_DDD);	// 센터팩스DDD(FAX1)
		$("#textbox13").val(data.LC_FAX_NO1); 	// 센터팩스1(FAX2)
		$("#textbox14").val(data.LC_FAX_NO2); 	// 센터팩스2(FAX3)
	}  
	$("#hiddenbox7").val(data.DEPT_ID);			// 관할지점코드
	$("#hiddenbox2").val(data.DIV_CDE);			// 관할본부코드
	$("#hiddenbox3").val(data.AREA_CDE);		// 관할지역코드	
	$("#hiddenbox4").val(data.DEPT_EMP_ID);		// 지점장ID	 	
	$("#hiddenbox5").val(data.LC_ID);			// 센터ID		 
	$("#hiddenbox6").val(data.LC_EMP_ID);		// 센터장ID	
	$("#hiddenbox8").val(data.EMP_ID_LIST);		// 연계대상자ID
	$("#textbox17").val(data.EMP_NAME_LIST);	// 연계대상자이름
	$("#hiddenbox9").val(data.EMP_PHONE_LIST);	// 연계대상자전화번호
	

}

/**
 * 상담/연계 조회
 * - as-is : cns2510.onSearch(), DS_TransInfo.onLoadCompleted(cnt)
 */
const getCselTrans = () => {
	const settings = {
		url: `${API_SERVER}/cns.getCselTrans.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담연계",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv1", "dsRecv2"],
			dsSend: [{ 
				CSEL_DATE	: sCSEL_DATE,	// 상담일자		
				CSEL_NO		: sCSEL_NO, 	// 상담번호	
				PROC_MK		: sPROC_MK,		// 처리구분	
			}],			
		}),
	}
	$.ajax(settings).done(res => {
		if (!checkApi(res, settings)) return;

		const DS_TRANS 		= res.dsRecv1; 	// 상담연계정보
		const DS_TRANS_EMP  = res.dsRecv2;	// 연계대상자정보
		let transData;

		// 조회이력이 없는경우.
		if (!DS_TRANS || DS_TRANS.length == 0) {
			$("#selectbox2").val("3");	// 연계방법: FAX
			$("#selectbox1").val("0");	// 회신여부: 없음
			transData = new Object();
		} else {
			transData = DS_TRANS[0];
		}

		// 처리상태구분 세팅
		if (!transData.PROC_STS_MK || transData.PROC_STS_MK == "01") {
			if (transData.PROC_MK == "5") { // 입회연계인경우
				// 입회건인 경우 무조건 완료로 셋팅한다.
				$("#selectbox3").val("99");		// 처리상태
			} else {
				// 입회건을 제외하고, 연계가 처음인 경우 무조건 지점처리중으로 셋팅한다.
				$("#selectbox3").val("03");		// 처리상태
			}
		}

		// 고객정보 grid
		grid1.resetData(DS_TRANS || []);
		grid1.focus(0);

		// 상담과목 조회
		getCselProd(DS_TRANS || []);	

		// 연계정보 세팅
		$("#selectbox1").val(transData.RTN_FLAG);							// 회신여부
		$("#selectbox2").val(transData.TRANS_CHNL_MK);						// 연계방법
		$("#textbox15").val(transData.CSEL_USER);							// 상담원
		calendarUtil.setImaskValue("calendar1", transData.TRANS_DATE);		// 일시1
		$("#time1").val(transData.TRANS_TIME);								// 일시2
		calendarUtil.setImaskValue("calendar3",  transData.PROC_HOPE_DATE);	// 처리희망일
		setTransDisPlay(transData);

		// 연계대상자 세팅
		let ids; 	
		let names; 	
		let mobilnos; 
		if (!DS_TRANS_EMP || DS_TRANS_EMP.length == 0) {
			ids 	 = "";
			names 	 = "";
			mobilnos = "";
		} else {
			ids 	 = DS_TRANS_EMP.map(el => el.TRANS_EMP_ID).join(", ");
			names 	 = DS_TRANS_EMP.map(el => el.TRANS_EMP_NM).join(", ");
			mobilnos = DS_TRANS_EMP.map(el => el.TRANS_EMP_MOBILNO).join(", ");
		}
		$("#hiddenbox8").val(ids);
		$("#textbox17").val(names);	
		$("#hiddenbox9").val(mobilnos);

	});
}

/**
 * 상담과목 조회
 * - as-is : cns2510.onSearch()
 * @param {array} DS_TRANS 상담/연계정보
 */
const getCselProd = (DS_TRANS) => {

	for (const trans of DS_TRANS) {
		const settings = {
			url: `${API_SERVER}/cns.getCselProd.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				userid: currentUser?.external_id,
				menuname: "상담연계",
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{ 
					CSEL_DATE	: trans.CSEL_DATE, 	// 상담일자
					CSEL_NO		: trans.CSEL_NO,	// 상담번호
					CSEL_SEQ 	: trans.CSEL_SEQ,	// 상담순번
				}],
			}),
		}
		$.ajax(settings).done(res => {
			if (!checkApi(res, settings)) return;

			// 중복체크
			const prdt_ids = grid2.getData().map(el => el.PRDT_ID);
			const addData = res.dsRecv;
			for (const row of addData) {
				if (prdt_ids.includes(row.PRDT_ID)) continue;
				grid2.appendRow(row);
			}

		});
	}
	
}

/**
 * 앱알림 전송
 */
const onAppSend = async () => {

	// get checked rows
	const checkedRows = grid1.getCheckedRows();
	if(checkedRows.length === 0) {
		alert("상담연계를 선택해 주세요.");
		return false;
	}

	// 연계방법 콤보 셋팅 - 앱연계
	$("#selectbox2").val("4");

	// 저장정보 value check
	const transData = new Array();
	const followerData = new Array();
	for (const row of checkedRows) {
		
		const transCondition = getTransCondition(row);
		if (!transCondition) return false;
		transData.push(transCondition);

		const followerCondition = await getFollowerCondition(row);
		if (!followerCondition) return false;
		followerData.push(followerCondition);
	}

	// 저장API 호출
	const saveResult = await saveTrans(transData);
	if (!saveResult) return false;

	// 앱알림API 호출
	return await setFollower(followerData);
}

/**
 * 상담/입회연계 정보 value check
 * - as-is : cns2510.checkSaveData()
 * - as-is : cns2510.setDS_CNS2500_TR()
 * @param {object} row grid row
 * @return {object|boolean} 상담/입회연계 정보
 */
const getTransCondition = (row) => {

	const data = {
		ROW_TYPE		: "", 											// 저장구분(I/U/D)		
		TRANS_DATE		: row.TRANS_DATE || "",     					// 연계일자		
		TRANS_NO		: row.TRANS_NO || "",       					// 연계번호		
		TRANS_MK		: "",     										// 연계구분		
		TRANS_TIME		: row.TRANS_TIME || "", 						// 연계시간		
		TRANS_CHNL_MK	: $("#selectbox2").val(), 						// 연계방법			
		TRANS_TITLE		: row.CSEL_TITLE, 								// 상담제목		
		TRANS_CNTS		: row.CSEL_CNTS, 								// 상담내용		
		PROC_HOPE_DATE	: calendarUtil.getImaskValue("calendar3"),  	// 처리예정일자			
		PROC_STS_MK		: $("#selectbox3").val(), 						// 처리상태구분		
		RTN_FLAG		: $("#selectbox1").val() || "0", 				// 회신여부 - 선택안하면 "없음"
		CSEL_DATE		: row.CSEL_DATE, 								// 상담일자		
		CSEL_NO			: row.CSEL_NO, 									// 상담번호	
		CSEL_SEQ		: row.CSEL_SEQ,									// 상담순번		
		DEPT_ID			: $("#hiddenbox7").val(),						// 관할지점코드		
		DIV_CDE			: $("#hiddenbox2").val(),						// 관할본부코드		
		AREA_CDE		: $("#hiddenbox3").val(),						// 관할지역코드			
		DEPT_EMP_ID		: $("#hiddenbox4").val(),						// 지점장ID			
		DS_TRANS_USER	: [],											// 연계대상자사번
	}

	// 연계방법 유효성 확인
	if (!data.TRANS_CHNL_MK) {
		alert("연계방법을 선택하여 주십시요.");
		$("#selectbox2").focus();
		return false;
	}
	if (!$("#textbox10").val()) {
		alert("연계 사업국/센터를 선택하여 주십시요.");
		$("#textbox10").focus();
		return false;
	}
	if (!$("#hiddenbox8").val()) {
		alert("연계 대상자를 선택하여 주십시요.");
		$("#textbox17").focus();
		return false;
	}

	// 연계대상자 세팅
	const EMP_ID_LIST = $("#hiddenbox8").val().split(",");
	for (let TRANS_EMP_ID of EMP_ID_LIST) {
		TRANS_EMP_ID = TRANS_EMP_ID.trim();
		if (!TRANS_EMP_ID) continue;
		data.DS_TRANS_USER.push({ TRANS_EMP_ID });
	}

	// 상담연계, 시정처리, 입회연계, 소개연계 외에는 연계할수 없다.
	if (row.PROC_MK != "3" && row.PROC_MK != "4" && row.PROC_MK != "5" && row.PROC_MK != "6") {
		alert("지점연계를 할 수 있는 처리구분이 아닙니다.");
		return false;

	// 기존의 연계일자가 없을 경우 INSERT
	} else if (!row.TRANS_DATE || row.TRANS_DATE.length < 8) {
		data.ROW_TYPE = "I";

	// 기존의 연계일자가 있고, 연계번호가 있는 경우 UPDATE
	} else if (row.TRANS_DATE && row.TRANS_DATE.length == 8 && row.TRANS_NO > 0) {
		data.ROW_TYPE = "U";

	// 그 외에는 모두 처리하지 않음
	} else {
		alert("저장할 수 없습니다.");
		return false;
	}

	// 연계구분에 따른 세팅
	// 상담연계
	if (row.PROC_MK == "3") {   
		data.TRANS_MK = "1";

	// 시정처리
	} else if (row.PROC_MK == "4") { 
		data.TRANS_MK = "2";

	// 입회연계
	} else if (row.PROC_MK == "5") { 
		data.TRANS_MK = "3";

	// 소개연계
	} else if (row.PROC_MK == "6") { 
		data.TRANS_MK = "4";
	}

	return data;
}

/**
 * 팔로워 정보 value check
 * @param {object} row grid row
 */
const getFollowerCondition = async (row) => {

	if (!row.ZEN_TICKET_ID) {
		alert("젠데스크 티켓ID가 존재하지 않습니다.");
		return false;
	}
	if (!$("#hiddenbox8").val()) {
		alert("연계 대상자를 선택하여 주십시요.");
		$("#textbox17").focus();
		return false;
	}

	// 팔로워 대상자 세팅
	const followers = new Array();
	const EMP_ID_LIST = $("#hiddenbox8").val().split(",");
	for (let EMP_ID of EMP_ID_LIST) {
		EMP_ID = EMP_ID.trim();
		const { users } = await topbarClient.request(`/api/v2/users/search.json?external_id=${EMP_ID}`);
		if (users.length > 0) followers.push({ user_id: users[0].id, action: "put" });
	}

	if (followers.length === 0) {
		alert("연계대상자의 젠데스트 사용자정보가 존재하지 않습니다. 다시 선택해 주세요.");
		return false;
	}

	return {
		ticket_id: row.ZEN_TICKET_ID,
		followers: followers
	}

}

/**
 * 상담/입회연계 저장
 * @param {array} transData 상담/입회연계 정보
 */
const saveTrans = (transData) => new Promise((resolve, reject) => {
	const settings = {
		global: false,
		url: `${API_SERVER}/cns.saveTrans.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담연계",
			senddataids		: ["DS_TRANS", "DS_TRANS_USER"],
			recvdataids		: ["dsRecv"],
			DS_TRANS		: transData,
		}),
	}

	$.ajax(settings)
		.done(data => {
			if (data.errcode != "0") return reject(new Error(getApiMsg(data, settings)));
			getCselTrans();	// 저장성공후 상담/연계 재조회
			return resolve(true);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 팔로워 등록
 * @param {array} followerData
 */
const setFollower = async (followerData) => {

	for (const el of followerData) {

		await topbarClient.request({
			url: `/api/v2/tickets/${el.ticket_id}`,
			method: 'PUT',
			contentType: "application/json",
			data: JSON.stringify({
				ticket: { followers: el.followers }
			})
		});

	}

	return true;

}

/**
 * SMS 전송
 * - as-is : cns2510.onSMSSend()
 */
const onSMSSend = async () => {

	// get checked rows
	const checkedRows = grid1.getCheckedRows();
	if (checkedRows.length === 0) {
		alert("상담연계를 선택해 주세요.");
		return false;
	}		

	// SMS 수신자 리스트 세팅
	const userData = getSmsUserCondition();
	if (!userData) return false;

	// SMS 전송정보 세팅
	const sendData = new Array();
	let smsCnt = 0
	for (const row of checkedRows) {

		// check send data
		const smsCondition = await getSmsCondition(row);
		if (!smsCondition) return false;
		smsCondition.DS_SMS_USER = userData;
		sendData.push(smsCondition);

		// SMS 여부를 확인하기 위해
		smsCnt += await getSmsCheck(row);

	}

	// before send check
	if (smsCnt > 0) {
		if (!confirm("이미 발송하였습니다. 그래도 발송하시겠습니까?")) return false;
	}

	return await saveTransSms(sendData);
}

/**
 * SMS수신대상자리스트 반환.
 * @return {array}
 */
const getSmsUserCondition = () => {

	const userData = new Array();

	const EMP_ID_LIST    = $("#hiddenbox8").val().split(","); // 연계대상자 사번
	const EMP_NAME_LIST  = $("#textbox17").val().split(",");  // 연계대상자 성명
	const EMP_PHONE_LIST = $("#hiddenbox9").val().split(","); // 연계대상자 전화번호

	for (let i = 0; i < EMP_ID_LIST.length; i++) {
		const destId 	= EMP_ID_LIST[i]?.trim();
		const destName  = EMP_NAME_LIST[i]?.trim();
		const destPhone = EMP_PHONE_LIST[i]?.trim();

		// 전화번호를 분리해서 유효성 체크
		const sDeptMobilNo = FormatUtil.tel(destPhone || "").split("-");
		// DDD확인
		if (!sDeptMobilNo[0] || !gf_chkDDDNumber(sDeptMobilNo[0])) {
			alert("휴대폰 번호가 정확하지 않습니다.");
			return false;
		}
		// 앞번호 확인
		if (!sDeptMobilNo[1] || sDeptMobilNo[1].length < 1) {
			alert("휴대폰 번호가 정확하지 않습니다.");
			return false;
		}
		// 뒷번호 확인
		if (!sDeptMobilNo[2] || sDeptMobilNo[2].length < 4) {
			alert("휴대폰 번호가 정확하지 않습니다.");
			return false;
		}

		userData.push({
			DEST_PHONE	: sDeptMobilNo.join(""), 	// 수신번호(연계대상자 전화번호,'-' 없이 전화번호 전체)	
			DEST_NAME	: destName, 				// 수신자명(연계대상자 성명)	
			CUST_ID		: destId, 					// 고객번호(연계대상자 사번)
			MBR_ID		: destId, 					// 회원번호(연계대상자 사번)
		})

	}

	if (userData.length == 0) {
		alert("연계 대상자를 선택하여 주십시요.");
		$("#textbox17").focus();
		return false;
	}

	return userData;
}

/**
 * SMS 발송 정보 value check
 * @param {object} row grid row
 */
const getSmsCondition = async (row) => {

	SEND_PHONE 	= SEND_PHONE ? SEND_PHONE : (await getBasicList("13", "SMS발신번호 조회")).replace(/[^0-9]/gi, "");	// SMS발신번호(기준값 13, '-'없이)

	// var sDeptMobilNoStr = "";
	// var sDeptMobilNo = new Array();
    // var sEmpName 	 = "";
    // var sEmpId 		 = "";

	// 연계정보 세팅
	// if (!row.LC_ID) {
	// 	// SMS번호를 분리하고, 휴대폰 번호가 있는지 확인함.
	// 	if (!row.DEPT_EMP_MOBILNO) {
	// 		alert("휴대폰 번호가 없습니다.");
	// 		return false;
	// 	}
	// 	sDeptMobilNoStr = row.DEPT_EMP_MOBILNO;
	// 	sEmpName 		= row.DEPT_EMP_NAME;
	// 	sEmpId 			= row.DEPT_EMP_ID;
	// } else {
	// 	// SMS번호를 분리하고, 휴대폰 번호가 있는지 확인함.
	// 	if (!row.LC_EMP_MOBILNO) {
	// 		alert("휴대폰 번호가 없습니다.");
	// 		return false;
	// 	}
	// 	sDeptMobilNoStr = row.LC_EMP_MOBILNO;
	// 	sEmpName 		= row.LC_EMP_NAME;
	// 	sEmpId 			= row.LC_EMP_ID;
	// }

	// sDeptMobilNo = FormatUtil.tel(sDeptMobilNoStr).split("-");
	
	// 분리된 SMS번호를 한번더 확인함.
    // DDD확인
	// if (!sDeptMobilNo[0] || !gf_chkDDDNumber(sDeptMobilNo[0])) {
	// 	alert("휴대폰 번호가 정확하지 않습니다.");
	// 	return false;
	// }
	// // 앞번호 확인
	// if (!sDeptMobilNo[1] || sDeptMobilNo[1].length < 1) {
	// 	alert("휴대폰 번호가 정확하지 않습니다.");
	// 	return false;
	// }
	// // 뒷번호 확인
	// if (!sDeptMobilNo[2] || sDeptMobilNo[2].length < 4) {
	// 	alert("휴대폰 번호가 정확하지 않습니다.");
	// 	return false;
	// }

	// 코드구분을 저장하기 위한 변수
	let sSmsTrgtId = "";
	let sSmsFixId = ""; 
	// 입회연계 인경우
	if (sPROC_MK == "5") {
		sSmsTrgtId = "1";
		sSmsFixId = "1";
	}
	// 시정처리 인경우
	else if (sPROC_MK == "4") {
		sSmsTrgtId = "1";
		sSmsFixId = "2";
	}
	// 상담연계 인경우
	else if (sPROC_MK == "3") {
		sSmsTrgtId = "1";
		sSmsFixId = "3";
	}
	// 소개연계 인경우
	else if (sPROC_MK == "6") {
		sSmsTrgtId = "5";
		sSmsFixId = "1";
	}
	else {
		alert("연계할수 있는 내용이 아닙니다.");
		return false;
	}

	return {
		// DEST_PHONE	: sDeptMobilNo.join(""), 	// 수신번호(연계대상자 전화번호,'-' 없이 전화번호 전체)		
		// DEST_NAME	: sEmpName, 				// 수신자명(연계대상자 성명)		
		// CUST_ID		: sEmpId, 					// 고객번호(연계대상자 사번)	
		// MBR_ID		: sEmpId, 					// 회원번호(연계대상자 사번)	
		DS_SMS_USER	: [],						// SMS수신대상리스트
		CSEL_DATE	: row.CSEL_DATE, 			// 상담일자		
		CSEL_NO		: row.CSEL_NO	, 			// 상담번호	
		CSEL_SEQ	: row.CSEL_SEQ, 			// 상담순번		
		USER_ID		: currentUser.external_id,  // 상담원ID	
		SMS_TRGT_ID : sSmsTrgtId,				// 대상코드	(소개연계 - 5 / 나머지 - 1)
		SMS_FIX_ID	: sSmsFixId, 				// 구분코드	
		SEND_PHONE	: SEND_PHONE,				// 발신번호
		PROC_MK		: row.PROC_MK,				// 처리구분
	}
}

/**
 * SMS 발송전 체크
 * @param {object} row grid row
 */
const getSmsCheck = (row) => new Promise((resolve, reject) => {

	const settings = {
		global: false,
		url: `${API_SERVER}/sys.getSmsCheck.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담연계",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
				CSEL_DATE	: row.CSEL_DATE, 	// 상담일자
				CSEL_NO		: row.CSEL_NO,		// 상담번호
				CSEL_SEQ	: row.CSEL_SEQ,		// 상담순번
			}],
		}),
	}
	$.ajax(settings)
		.done(data => {
			if (data.errcode != "0") return reject(new Error(getApiMsg(data, settings)));
			const recv = data.dsRecv;
			return resolve(recv[0].CNT);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * SMS 발송 처리
 * @param {array} sendData 
 */
const saveTransSms = (sendData) => new Promise((resolve, reject) => {
	const settings = {
		global: false,
		url: `${API_SERVER}/sys.saveTransSms.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담연계",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: sendData,
		}),
	}
	$.ajax(settings)
		.done(data => {
			if (data.errcode != "0") return reject(new Error(getApiMsg(data, settings)));
			return resolve(true);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * FAX 전송
 * - as-is : cns2510.onFAXSend()
 * @return {boolean} 성공여부
 */
const onFAXSend = async () => {

	// get checked rows
	const checkedRows = grid1.getCheckedRows();
	if(checkedRows.length === 0) {
		alert("상담연계를 선택해 주세요.");
		return false;
	}

	// 연계방법 콤보 셋팅 - FAX로 셋팅
	$("#selectbox2").val("3");
	
	// 저장정보 value check
	const transData = new Array();
	const faxData 	= new Array();
	for (const row of checkedRows) {
		const transCondition = getTransCondition(row);
		if (!transCondition) return false;
		transData.push(transCondition);

		const faxCondition = getFaxCondition(row);
		if (!faxCondition) return false;
		faxData.push(faxCondition);
	}

	// 저장API 호출
	const saveResult = await saveTrans(transData);
	if (!saveResult) return false;

	// 팩스발송API 호출
	return await addTransSendFax(faxData);	
}

/**
 * 상담/입회연계 팩스발송 정보 value check
 * @param {object} row grid row
 * @return {object|boolean} 팩스발송 정보
 */
const getFaxCondition = (row) => {

	const data = {
		CSEL_DATE		: row.CSEL_DATE, 			// 상담일자		
		CSEL_NO			: row.CSEL_NO, 				// 상담번호	
		CSEL_SEQ		: row.CSEL_SEQ, 			// 상담순번		
		MK_FAX_YN		: "Y", 						// 저장/팩스발송구분		
		FAX_TYPE_CDE	: "", 						// 팩스발송종류코드			
		CUST_ID			: row.CUST_ID, 				// 고객번호	
		FAX_NO			: $("#textbox12").val(), 	// 팩스번호DDD	
		FAX_SEND_FLAG	: "0", 						// 팩스발송여부 - '0'로만 Insert	
		USER_ID			: currentUser.external_id,  // 상담원ID	
		MBR_ID			: row.MBR_ID, 				// 회원번호	
		FAX_NO1			: $("#textbox13").val(), 	// 팩스번호앞번호	
		FAX_NO2			: $("#textbox14").val(), 	// 팩스번호뒷번호	
		OPEN_GBN		: row.OPEN_GBN, 			// 회원신상 공개여부		
		DEPT_ID			: $("#hiddenbox7").val(), 	// 관할지점코드
		LC_ID			: $("#hiddenbox5").val(), 	// 센터ID
		LC_EMP_ID		: $("#hiddenbox6").val(), 	// 센터장ID
		CUST_MK			: row.CUST_MK, 				// 고객구분	
	}

	// 지점FAX번호 유효성 확인
	if (!gf_chkDDDNumber(data.FAX_NO)) {
		alert("FAX번호를 입력하여 주십시요.");
		$("#textbox12").focus();
		return false;
	}
	if (data.FAX_NO1.length < 2) {
		alert("FAX번호를 입력하여 주십시요.");
		$("#textbox13").focus();
		return false;
	}
	if (data.FAX_NO2.length < 4) {
		alert("FAX번호를 입력하여 주십시요.");
		$("#textbox14").focus();
		return false;
	}

	// 연계구분에 따른 세팅
	// 상담연계
	if (row.PROC_MK == "3") {   
		data.FAX_TYPE_CDE = "DS11"; // 상담처리요청서

	// 시정처리
	} else if (row.PROC_MK == "4") { 
		data.FAX_TYPE_CDE = "DS12"; // 고객불편시정처리서

	// 입회연계
	} else if (row.PROC_MK == "5") { 

		// 착신인 경우
		if (row.CSEL_CHNL_MK == "1") { 
			data.FAX_TYPE_CDE = "DS10"; // 입회상담의뢰서IB
		// 발신인 경우
		} else if (row.CSEL_CHNL_MK == "2") { 
			data.FAX_TYPE_CDE = "DS23"; // 입회상담의뢰서OB
		// 발신(edupia)인 경우
		} else if (row.CSEL_CHNL_MK == "83") { 
			data.FAX_TYPE_CDE = "DS26"; // 입회상담의뢰서IB
		// 그외
		} else {
			data.FAX_TYPE_CDE = "DS23"; // 입회상담의뢰서OB
		}

	// 소개연계
	} else if (row.PROC_MK == "6") {
		data.FAX_TYPE_CDE = "DS27"; // 교사소개의뢰서
	}



	return data;

}

/**
 * 상담/입회연계 - 팩스발송
 * @param {array} faxData 팩스 정보
 */
const addTransSendFax = (faxData) => new Promise((resolve, reject) => {
	const settings = {
		global: false,
		url: `${API_SERVER}/cns.addTransSendFax.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담연계",
			senddataids		: ["DS_FAX"],
			recvdataids		: ["dsRecv"],
			DS_FAX			: faxData 		// 팩스 정보
		}),
	}

	$.ajax(settings)
		.done(data => {
			if (data.errcode != "0") return reject(new Error(getApiMsg(data, settings)));
			return resolve(true);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 사업국/센터/연계부서 팝업
 * @param {number} keyCode 
 */
const openCCEMPRO044 = (keyCode) => {
	if (keyCode == 13) {
		PopupUtil.open("CCEMPRO044", 1145, 475);
	}
}
let grid1, grid2;

$(function () {

	// create calendar
	$(".calendar").each((i, el) => calendarUtil.init(el.id, { drops: "up" }));

	// input mask
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

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
			{ header: '지점장부서',       name: 'TO_TEAM_DEPT  ',    width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
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
			{ header: '고객구분',         name: 'CUST_MK',           width: 100,    align: "center",    sortable: false, ellipsis: true, hidden: true, },
		],
	});

	grid1.on("click", (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
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

const onStart = (openerNm) => {

	// 상담등록 화면에서 오픈했을때.
	if (openerNm.includes("CCEMPRO022")) {
		setCodeData(opener.codeData);
		const PROC_MK 	= opener.document.getElementById("selectbox4").value;
		const CSEL_DATE = opener.calendarUtil.getImaskValue("textbox27");
		const CSEL_NO   = opener.document.getElementById("textbox28").value;
		const CSEL_SEQ  = opener.document.getElementById("selectbox14").value;
		setDisPlay(PROC_MK);
		getCselTrans(CSEL_DATE, CSEL_NO, CSEL_SEQ, PROC_MK);
		getCselProd(CSEL_DATE, CSEL_NO, CSEL_SEQ);
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
 * * - as-is : cns2510.setDisPlay()
 * @param {string} PROC_MK 처리구분
 */
const setDisPlay = (PROC_MK) => {

	if (PROC_MK == "3") {   // 상담연계
		$("#textbox11").val("상담연계");
		$("#hiddenbox1").val("DS11");
		$("#textbox16").val($("#hiddenbox1 option:selected").text());	// FAX 양식명(상담처리 요청서)
	}
	else if (PROC_MK == "4") { // 시정처리
		$("#textbox11").val("시정처리");
		$("#hiddenbox1").val("DS12");
		$("#textbox16").val($("#hiddenbox1 option:selected").text()); 	// FAX 양식명(고객불편 시정처리서)
	}
	else if (PROC_MK == "5") { // 입회연계
		$("#textbox11").val("입회연계");
		$("#hiddenbox1").val("DS10");
		$("#textbox16").val($("#hiddenbox1 option:selected").text());	// FAX 양식명(입회상담 의뢰서)
	}
	else {                // 위의 3가지 경우외에는 연계할 수 없다.
		$("#textbox11").val("연계건이 아닙니다.");
		$("#textbox16").val("연계건이 아닙니다.");
	}
}

/**
 * 상담/연계 조회
 * @param {string} CSEL_DATE 상담일자
 * @param {string} CSEL_NO   상담번호
 * @param {string} CSEL_SEQ  상담순번
 * @param {string} PROC_MK 	 처리구분
 */
const getCselTrans = (CSEL_DATE, CSEL_NO, CSEL_SEQ, PROC_MK) => {
	const settings = {
		url: `${API_SERVER}/cns.getCselTrans.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ CSEL_DATE, CSEL_NO, CSEL_SEQ, PROC_MK }],
		}),
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		
		// as-is : cns2510.DS_TransInfo.onLoadCompleted(cnt)

		grid1.resetData(data.dsRecv);

		// 조회이력이 없는경우.
		if (grid1.getRowCount() == 0) {
			$("#selectbox2").val("3");	// 연계방법: FAX
			$("#selectbox1").val("0");	// 회신여부: 없음
			return;
		}

		// 입회건인 경우 제목 세팅
		if (PROC_MK == "5" && !grid1.getValue(0, "CSEL_TITLE")) {
			// CSEL_TITLE 이 없는경우 "입회상담"으로 넣어준다.
			grid1.setValue(0, "CSEL_TITLE", "입회상담");
		}

		// 처리상태구분 세팅
		if (!grid1.getValue(0, "PROC_STS_MK") || grid1.getValue(0, "PROC_STS_MK") == "01") {
			if (PROC_MK == "5") { // 입회연계인경우
				// 입회건인 경우 무조건 완료로 셋팅한다.
				grid1.setValue(0, "PROC_STS_MK", "99");
			} else {
				// 입회건을 제외하고, 연계가 처음인 경우 무조건 지점처리중으로 셋팅한다.
				grid1.setValue(0, "PROC_STS_MK", "03");
			}
		}

		// 연계정보 셋팅
		if (!grid1.getValue(0, "LC_ID")) {
			// 사업국 정보 설정
			$("#textbox10").val(grid1.getValue(0, "DEPT_NAME"));	// 지점명(연계)
			$("#textbox9").val(grid1.getValue(0, "DEPT_TELNO"));	// 지점전화번호(전화)
			$("#textbox12").val(grid1.getValue(0, "DEPT_FAX_DDD"));	// 지점팩스DDD(FAX1)
			$("#textbox13").val(grid1.getValue(0, "DEPT_FAX_NO1")); // 지점팩스1(FAX2)
			$("#textbox14").val(grid1.getValue(0, "DEPT_FAX_NO2")); // 지점팩스2(FAX3)
		} else {
			// 센터 정보 설정
			$("#textbox10").val(grid1.getValue(0, "LC_NAME"));		// 센터명(연계)
			$("#textbox9").val(grid1.getValue(0, "LC_TELNO"));		// 센터전화번호(전화)
			$("#textbox12").val(grid1.getValue(0, "LC_FAX_DDD"));	// 센터팩스DDD(FAX1)
			$("#textbox13").val(grid1.getValue(0, "LC_FAX_NO1")); 	// 센터팩스1(FAX2)
			$("#textbox14").val(grid1.getValue(0, "LC_FAX_NO2")); 	// 센터팩스2(FAX3)
		}  

		// 나머지 세팅
		$("#textbox1").val(grid1.getValue(0, "TELNO"));				// 전화번호
		$("#textbox2").val(grid1.getValue(0, "MOBILNO"));			// 핸드폰
		$("#textbox3").val("");										// 직장전화
		$("#textbox4").val(grid1.getValue(0, "FAT_NAME"));			// 학부모명
		$("#textbox5").val(grid1.getValue(0, "ZIPCDE"));			// 주소1
		$("#textbox6").val(grid1.getValue(0, "FULLADDR"));			// 주소2
		$("#textbox7").val(grid1.getValue(0, "CSEL_TITLE"));		// 제목
		$("#textbox8").val(grid1.getValue(0, "CSEL_CNTS"));			// 상담내용
		$("#selectbox1").val(grid1.getValue(0, "RTN_FLAG"));		// 회신여부
		$("#selectbox2").val(grid1.getValue(0, "TRANS_CHNL_MK"));	// 연계방법
		$("#textbox15").val(grid1.getValue(0, "CSEL_USER"));		// 상담원
		$("#selectbox3").val(grid1.getValue(0, "PROC_STS_MK"));		// 처리상태
		calendarUtil.setImaskValue("calendar1", grid1.getValue(0, "TRANS_DATE") || "");	// 일시1
		$("#time1").val(grid1.getValue(0, "TRANS_TIME"));								// 일시2

		calendarUtil.setImaskValue("calendar3",  grid1.getValue(0, "PROC_HOPE_DATE") || "");	// 처리희망일	TODO 서비스에 해당컬럼 없음, 확인필요
		$("#textbox17").val("");	// 연계대상자													TODO 확인필요

	});
}

/**
 * 상담과목 조회
 * @param {string} CSEL_DATE 상담일자
 * @param {string} CSEL_NO 상담번호
 * @param {string} CSEL_SEQ 상담순번
 */
const getCselProd = (CSEL_DATE, CSEL_NO, CSEL_SEQ) => {
	const settings = {
		url: `${API_SERVER}/cns.getCselProd.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ CSEL_DATE, CSEL_NO, CSEL_SEQ }],
		}),
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		grid2.resetData(data.dsRecv);
	});
}
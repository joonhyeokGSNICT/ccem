var grid4;	// 입회등록 > 과목 grid
var grid5;	// 입회등록 > 입회과목 grid

$(function () {
	
	createGrids();
	getProd(grid4);

	// create calendar
	$(".calendar").each((i, el) =>  calendarUtil.init(el.id));

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	onStart();

});

/**
 * 상담등록에서 사용하는 모든 Grid를 생성합니다.
 */
const createGrids = () => {
	// 입회등록 > 과목 grid
	grid4 = new Grid({
		el: document.getElementById('grid4'),
		bodyHeight: 310,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum',   header: "NO",   minWidth: 30,},
			{ type: 'checkbox', header: " ",    minWidth: 30,},
		],
		columns: [
			{ header: '제품코드',     name: 'PRDT_ID',      width: 100,  	align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '과목',       name: 'PRDT_NAME',   	minWidth: 142,  align: "left", sortable: true, ellipsis: true, hidden: false    },
			{ header: 'CTI제품코드',  name: 'PRDT_CDE',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군코드',   name: 'PRDT_GRP',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군명',     name: 'PRDT_GRPNM',   width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품순번',     name: 'PRDT_SEQ',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '사용여부',     name: 'USE_FLAG',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '선택',         name: 'USE',          width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
		],
	});
	grid4.on('click', (ev) => {
		grid4.addSelection(ev);
		grid4.clickSort(ev);
		grid4.clickCheck(ev);
	});
	grid4.on("check", ev => {
		checkProd(grid5, grid4.getRow(ev.rowKey));
	});
	grid4.on("uncheck", ev => {
		uncheckProd(grid5, grid4.getRow(ev.rowKey));
	});

	// 입회등록 > 입회과목 grid
	grid5 = new Grid({
		el: document.getElementById('grid5'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", minWidth: 30, },
		],
		columns: [
			{ header: '제품코드',     name: 'PRDT_ID',      align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '입회과목',     name: 'PRDT_NAME',    align: "left", sortable: true, ellipsis: true, hidden: false    },
			{ header: 'CTI제품코드',  name: 'PRDT_CDE',     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군코드',   name: 'PRDT_GRP',     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군명',     name: 'PRDT_GRPNM',   align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품순번',     name: 'PRDT_SEQ',     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '사용여부',     name: 'USE_FLAG',     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '선택',         name: 'USE',          align: "left", sortable: true, ellipsis: true, hidden: true    },
		],
	});
	grid5.on('click', (ev) => {
		grid5.addSelection(ev);
		grid5.clickSort(ev);
	});
}

/**
 * 오픈되는 곳에 따라 분기처리
 */
const onStart = () => {

	const opener_name = parent.opener.name;

	// 탑바 > 고객정보 > 고객 > 상담등록 버튼으로 오픈
	if (opener_name.includes("top_bar")) {	
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	

		const sCUST_ID = topbarObject.document.getElementById("custInfo_CUST_ID").value; // 고객번호
		const sMBR_ID  = topbarObject.document.getElementById("custInfo_MBR_ID").value;	 // 회원번호

		console.debug("onStart by top_bar: ", sCUST_ID, sMBR_ID)

	// 상담조회 > 상담/입회수정 버튼으로 오픈
	} else if (opener_name.includes("CCEMPRO035")) {	
		topbarObject  = parent.opener.topbarObject;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;

		const counselGrid  = parent.opener.grid1;	// 상담조회 grid
		const rowKey 	   = counselGrid.getSelectedRowKey();
		const sCSEL_DATE   = counselGrid.getValue(rowKey, "CSEL_DATE");	// 상담일자
		const CSEL_NO   = counselGrid.getValue(rowKey, "CSEL_NO");	// 상담번호
		const sCSEL_SEQ    = counselGrid.getValue(rowKey, "CSEL_SEQ");	// 상담순번

		console.debug("onStart by CCEMPRO035: ", sCSEL_DATE, CSEL_NO, sCSEL_SEQ)

	}

	setCodeData();
	setDate("con");
	
}

/**
 * TODO 콤보박스 세팅
 * - as-is : cns4700.setCombo()
 */
const setCodeData = () => {

	const CODE_MK_LIST = [
		"PRDT_GRP",			// 과목군
		"CSEL_CHNL_MK",		// 상담채널
		"TRANS_CHNL_MK",	// 연계방법
		"CSEL_PREFACE",		// 안내문구
		"STD_MOTIVE_CDE",	// 입회사유
		"STD_CRS_CDE",		// 입회경로
		"CSEL_MAN_MK",		// 내담자
		"MEDIA_CDE",		// 매체구분
		"SAP_USE_FLAG",		// ?
	];

	// get code
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// sorting
	const sortKey = "CODE_ID";
	codeList.sort((a, b) => Number(a[sortKey]) < Number(b[sortKey]) ? -1 : Number(a[sortKey]) > Number(b[sortKey]) ? 1 : 0);

	// create select options
	for (const code of codeList) {
		$(`select[name='${code.CODE_MK}']`).append(new Option(code.CODE_NAME, code.CODE_ID));
	}

	// init 
	const S_USER_GRP_CDE = currentUser.user_fields.user_grp_cde;
	if(S_USER_GRP_CDE == "7096") $("#selectbox4").val("71");
	else if(S_USER_GRP_CDE == "7100") $("#selectbox4").val("61");
	else $("#selectbox4").val("1");			// 기본값은 "착신" : 2007.03.07
	$("#selectbox9").val("01");	// 내담자: 모
	$("#selectbox5").val("3");	// 연계방법: FAX
}

/**
 * 날짜 및 시간세팅
 * - as-is : cns4700.getDBDate()
 * @param {string} flag 
 */
const setDate = async (flag) => {
	const { CDATE, CTIME } = await getSysdate();
	
	// 연계일자, 시간 
	if (flag == "con") { 
		calendarUtil.setImaskValue("calendar4", CDATE);
		$("#timebox3").val(CTIME);
	} 
	// 상담일자, 시간 
	else { 
		calendarUtil.setImaskValue("calendar3", CDATE);
		$("#timebox2").val(CTIME);
	}	

}

/**
 * DB시간조회
 */
const getSysdate = () => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/sys.getSysdate.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids	: ["dsSend"],
			recvdataids	: ["dsRecv"],
			dsSend		: [{}]
		}),
		errMsg: "DB시간 조회중 오류가 발생하였습니다.",
	}
	
	$.ajax(settings)
		.done(res => {
			if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));

			const sysdate = res.dsRecv;

			if (sysdate.length == 0) {
				alert(settings.errMsg + "\n\n검색 결과가 없습니다.");
				return reject(new Error(settings.errMsg + "\n\n검색 결과가 없습니다."));
			}

			return resolve(sysdate[0]);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 연계일시 조회
 * TODO 필요여부 확인하기
 */
const getWorkDay = () => new Promise((resolve, reject) => {
	const settings = {
		url: `${API_SERVER}/sys.getWorkDay.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids	: ["dsSend"],
			recvdataids	: ["dsRecv"],
			dsSend		: [{}]
		}),
		errMsg: "연계일시 조회중 오류가 발생하였습니다.",
	}
	
	$.ajax(settings)
		.done(res => {
			if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));

			const sysdate = res.dsRecv;

			if (sysdate.length == 0) {
				alert(settings.errMsg + "\n\n검색 결과가 없습니다.");
				return reject(new Error(settings.errMsg + "\n\n검색 결과가 없습니다."));
			}

			return resolve(sysdate[0]);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});
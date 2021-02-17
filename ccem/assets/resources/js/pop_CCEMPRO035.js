window.resizeTo(1110, 853);

var topbarObject;			// topbar window
var topbarClient;			// topbar client
var currentUser;			// 현재 사용중인 유저의 정보(ZENDESK)
var codeData;

var grid1;	// 상담이력 grid
var grid2;	// 상담과목 grid

let prods = [];		// 과목 리스트
let users = [];		// 상담원 리스트
let cselType = {};	// 분류코드

$(function () {

	$(window).on('beforeunload', () => {
		PopupUtil.closeAll();
	});

	// init date
	$(".calendar").val(getDateFormat());

	// create calendar
	$(".calendar").each((i, el) => {
		calendarUtil.init(el.id, null, () => $("#checkbox1").prop("checked", checkDate()));
	});

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));

	onStart();

});

const onStart = () => {
	topbarObject = opener;
	topbarClient = topbarObject.client;
	currentUser = topbarObject.currentUserInfo.user;
	codeData 	= topbarObject.codeData;
	createGrids();
	setCodeData();
	getProd();
	getUser();
}

const createGrids = () => {
	// 상담조회 grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 213,
		pageOptions: {
			useClient: true,
		  	perPage: 100,
		},
		columnOptions: {
            minWidth: 50,
            resizable: true,
            frozenCount: 5,
            frozenBorderWidth: 0
        },
		rowHeaders: [
			{ type: 'rowNum', header: "NO", },
		],
		columns: [
			{ header: '상담일자',                       name: "CSEL_DATE",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   formatter: columnInfo => FormatUtil.date(columnInfo.value)		},
			{ header: '접수',                           name: "CSEL_NO",               width: 60,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   																},
			{ header: '상담순번',                       name: "CSEL_SEQ",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,   																},
			{ header: '상담채널',                       name: "CSEL_CHNL_MK_NM",       width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,  																},
			{ header: '상담구분',                       name: "CSEL_MK_NM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,  																},
			{ header: '회원명',                         name: "NAME",                  width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,  																},
			{ header: '회원번호',                       name: "MBR_ID",                width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,  																},
			{ header: '통화시각',                       name: "CALL_STTIME",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,	  formatter: columnInfo => FormatUtil.time(columnInfo.value)	 },
			{ header: '상담시간',                       name: "CSEL_TIME_NM",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    formatter: columnInfo => FormatUtil.time(columnInfo.value)	},
			{ header: '처리시간',                       name: "PROC_TIME_NM",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 	  formatter: columnInfo => FormatUtil.time(columnInfo.value)	 },
			{ header: '학년',                           name: "GRADE_NM",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '본부',                           name: "UP_DEPT_NAME_NM",       width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '사업국',                         name: "DEPT_NAME_NM",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '센터',                           name: "LC_NAME_NM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '분류(대)',                       name: "CSEL_LTYPE_CDE_NM",     width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '분류(중)',                       name: "CSEL_MTYPE_CDE_NM",     width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '분류(소)',                       name: "CSEL_STYPE_CDE_NM",     width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '상담제목',                       name: "CSEL_TITLE",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '상담실처리',                     name: "PROC_CNTS",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '사업국처리',                     name: "VOC_CNTS",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '해피콜',                         name: "HPCALL_CNTS",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '상담원',                         name: "CSEL_USER_NM",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '내담자',                         name: "CSEL_MAN_MK_NM",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '상담등급',                       name: "CSEL_GRD",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담등급',                       name: "CSEL_GRD_NM",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '고객반응',                       name: "CUST_RESP_MK_NM",       width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '전화번호',                       name: "MOBILNO",       		   width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '핸드폰번호',                     name: "MOBILNO",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: 'ERMS구분',                       name: "ERMS_MK",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	 },
			{ header: '팩스발송일시',                   name: "FAX_DATETIME",          width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '녹취ID',                         name: "RECORD_ID",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 	 renderer: CustomRecRenderer, 									 },
			{ header: '상담입력시각',                   name: "CSEL_STTIME",           width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 	  formatter: columnInfo => FormatUtil.time(columnInfo.value)	  },
			{ header: 'TICKET ID',                      name: "ZEN_TICKET_ID",         width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '상담경로',                       name: "FST_CRS_CDE_NM",        width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '상담제품',                       name: "PRDT_NAME",             width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '업무정직도',                     name: "CNT_NGPROC",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '학습개월',                       name: "STD_MON_NM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '복회가능성',                     name: "RENEW_POTN_NM",         width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '러닝센터',                       name: "LC_MK",                 width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: 'YC',                             name: "YC_MK",                 width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '연계부서',                       name: "PROC_DEPT_NAME_NM",     width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: 'VOC',                            name: "VOC_MK",                width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '발송시간',                      name: "SMS_DATE_TIME",         width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,  																	 },
			{ header: '발송결과',                      name: "SMS_PROC_NM",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,  																	 },
			{ header: '선생님명',                       name: "PRDT_EMP_NM",           width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '고객구분코드',                   name: "CUST_MK",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담원ID',                       name: "CSEL_USER_ID",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담구분코드',                   name: "CSEL_MK",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '처리구분코드',                   name: "PROC_MK",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '처리상태코드',                   name: "PROC_STS_MK",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '지점코드',                       name: "DEPT_ID",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '부서코드',                       name: "DIV_CDE",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '지역코드',                       name: "AREA_CDE",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담분류(대)',                   name: "CSEL_LTYPE_CDE",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담분류(중)',                   name: "CSEL_MTYPE_CDE",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담분류(소)',                   name: "CSEL_STYPE_CDE",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '처리희망일자',                   name: "PROC_HOPE_DATE",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담채널구분',                   name: "CSEL_CHNL_MK",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '근무형태구분',                   name: "WORK_STYL_MK",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '고객번호',                       name: "CUST_ID",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담결과',                       name: "CSEL_RST_MK1",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '첫상담경로',                     name: "FST_CRS_CDE",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담종료시각',                   name: "CSEL_EDTIME",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '통화종료시각',                   name: "CALL_EDTIME",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담내용',                       name: "CSEL_CNTS",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	},
			{ header: '공개여부',                       name: "OPEN_GBN",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '처리시한',                       name: "LIMIT_MK",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: 'O/B결과코드',                    name: "CALL_RST_MK",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '고객반응코드',                   name: "CUST_RESP_MK",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '내담자구분코드',                 name: "CSEL_MAN_MK",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '입회사유코드',                   name: "MOTIVE_CDE",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '매체구분코드',                   name: "MEDIA_CDE",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '연계번호',                       name: "TRANS_NO",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '연계일자',                       name: "TRANS_DATE",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '학년코드',                       name: "GRADE_CDE",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '재확인여부',                     name: "RE_PROC",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '연계구분',                       name: "TRANS_MK",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '환불상태코드',                   name: "REFUND_FLAG",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '처리구분',                       name: "PROC_MK_NM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '처리구분',                       name: "PROC_STS_MK_NM",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '매체구분',                       name: "MEDIA_CDE_NM",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '입회사유',                       name: "MOTIVE_CDE_NM",         width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '상담결과명',                     name: "CSEL_RST_MK1_NM",       width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: 'o/b결과명',                      name: "CALL_RST_MK_NM",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '처리시한명',                     name: "LIMIT_MK_NM",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '근무형태구분',                   name: "WORK_STYL_MK_NM",       width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '정보',                           name: "OPEN_GBN_NM",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	},
			{ header: '환불접수상태명',                 name: "REFUND_FLAG_NM",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '지역코드명',                     name: "AREA_CDE_NM",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '처리일자',                       name: "PROC_DATE",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '삭제FLAG',                       name: "DELETE_FLAG",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '재조회 키',                      name: "REFRESHKEY",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '우편번호',                       name: "ZIPCDE",                width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '우편번호주소',                   name: "ZIP_ADDR",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '주소',                           name: "ADDR",                  width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '지점연계시간 PROC_DATE_TIME',    name: "PROC_DATE_TIME",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: 'VOC처리시간 VOC_DATE_TIME',      name: "VOC_DATE_TIME",         width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '지점처리시간 dept_proc_time',    name: "DEPT_PROC_TIME",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '시간약속',                       name: "TIME_APPO",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '문자발송건수(SMS)',              name: "SMS_CNT",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
		],
	});

	grid1.on("focusChange", ev => {
		const thisGrid = ev.instance;
		thisGrid.addSelection(ev);

		const rowData = thisGrid.getRow(ev.rowKey);
		const selCselUserId = rowData.CSEL_USER_ID;					  // 상담원ID
		const currentUserLvl = currentUser?.user_fields?.user_lvl_mk; // 상담원등급
		const isAdmin = (currentUserLvl == "user_lvl_mk_1" || currentUserLvl == "user_lvl_mk_2" || currentUserLvl == "user_lvl_mk_3") ? true : false; // 관리자유무

		// 녹취매핑 버튼/상담/입회수정 버튼 - 자신의 상담건 or 사용자레벨 3이하 가능
		if (currentUser.external_id == selCselUserId || isAdmin) {
			$("#button4").prop("disabled", false);
			$("#button7").prop("disabled", false);
		} else {
			$("#button4").prop("disabled", true);
			$("#button7").prop("disabled", true);
		}

		// 녹취청취 버튼 - 녹취키가 있고, 자신의 상담건 or 사용자레벨 3이하 가능
		if (rowData.RECORD_ID && (currentUser.external_id == selCselUserId || isAdmin)) {
			$("#button5").prop("disabled", false);
		} else {
			$("#button5").prop("disabled", true);
		}

		// 결과 버튼 disabled 여부
		const proc = rowData.PROC_MK; // 처리구분
		if (proc == "2" || proc == "3" || proc == "4") {	// 2: 상담원처리, 3: 상담연계, 4: 시정처리
			$("#button6").prop("disabled", false);
		} else {
			$("#button6").prop("disabled", true);
		}

		// 삭제 버튼 - 사용자레벨 3이하 가능
		if (isAdmin) $("#button8").prop("disabled", false);
		else $("#button8").prop("disabled", true);

		// 상담상세정보 세팅
		setCselDetail(rowData);

	});

	grid1.on("click", ev => {
		ev.instance.clickSort(ev);
	});

	grid1.on("dblclick", ev => {
		// 티켓오픈
		if (ev.targetType != "cell") return;
		const ZEN_TICKET_ID = ev.instance.getValue(ev.rowKey, "ZEN_TICKET_ID");
		if (ZEN_TICKET_ID) topbarClient.invoke('routeTo', 'ticket', ZEN_TICKET_ID);
	});

	const grid1onFocus = ev => {

		// 현재 페이지의 첫번째 rowKey를 알아내기 위해.
		const pagination = ev.instance.getPagination();
		const perPage = pagination._options.itemsPerPage;
		const currentPage = pagination._currentPage;
		const focusRowKey = (currentPage - 1) * perPage;

		// 선택된 행이 없으면 모두 disabled
		if(!ev.instance.focus(focusRowKey)) {
			$("#button4").prop("disabled", true);	// 녹취매핑
			$("#button5").prop("disabled", true);	// 녹취청취
			$("#button6").prop("disabled", true);	// 결과
			$("#button7").prop("disabled", true);	// 상담/입회수정
			$("#button8").prop("disabled", true);	// 삭제
		}

	}

	grid1.on("onGridUpdated", ev => {
		$("#textbox4").val(ev.instance.getPaginationTotalCount());	// 조회건수
		grid1onFocus(ev);
	});

	grid1.on("beforePageMove", ev => {
		// getCsel(ev.page);
	});

	grid1.on("afterPageMove", ev => {
		grid1onFocus(ev);
	});

	// 상담제품 grid
	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 97,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", },
		],
		columns: [
			{ header: '제품코드', 			 name: "PRDT_ID", 		 align: "center", sortable: true, ellipsis: true, hidden: true,  },
			{ header: '제품명', 			 name: "PRDT_NAME", 	 align: "left", sortable: true, ellipsis: true, hidden: false, },
			{ header: '입회결과여부(1:입회)', name: "ENTER_RST_FLAG", align: "center", sortable: true, ellipsis: true, hidden: true,  },
		],
	});

	grid2.on("focusChange", ev => {
		grid2.addSelection(ev);
	});

	grid2.on("click", ev => {
		grid2.clickSort(ev);
	});
}

/**
 * 과목 필터링
 * @param {string} keyword
 */
const filterProd = keyword => {
	let selectbox = $("#selectbox1").empty();

	keyword = keyword.toUpperCase();
	let data = prods.filter(el => (el.PRDT_GRP.toUpperCase()).includes(keyword));

	data.forEach(el => selectbox.append(new Option(`[${el.PRDT_ID}] ${el.PRDT_NAME}`, el.PRDT_ID)));

}

/**
 * 상담원 필터링
 * @param {array} selects 
 */
const filterUser = selects => {
	let selectbox = $("#selectbox2").empty();
	if(selects.length === 0) return;
	let data = users.filter(el => selects.includes(el.USER_GRP_CDE));
	data.forEach(el => selectbox.append(new Option(`[${el.USER_ID}] ${el.USER_NAME}`, el.USER_ID)));
}

/**
 * 분류 필터링
 * @param {string} flag L, M, S
 * @param {string} value 
 */
const filterCselType = (flag, value) => {
	let typeList, filterList, selectbox;

	switch (flag) {
		case "L":
			$("#checkbox13").prop("checked", false);
			$("#checkbox14").prop("checked", false);
			$("#checkbox15").prop("checked", false);
			$("#selectbox5").empty().append(`<option hidden></option`);
			$("#selectbox4").empty().append(`<option hidden></option`);
			selectbox = $("#selectbox3").empty().append(`<option hidden></option`);
			typeList = cselType.CSEL_LTYPE_CDE;
			break;
		case "M":
			$("#checkbox14").prop("checked", false);
			$("#checkbox15").prop("checked", false);
			$("#selectbox5").empty().append(`<option hidden></option`);
			selectbox = $("#selectbox4").empty().append(`<option hidden></option`);
			typeList = cselType.CSEL_MTYPE_CDE;
			break;
		case "S":
			$("#checkbox15").prop("checked", false);
			selectbox = $("#selectbox5").empty().append(`<option hidden></option`);
			typeList = cselType.CSEL_STYPE_CDE;
			break;
		default:
			break;
	}

	if (typeList && value) {
		filterList = typeList.filter(el => el.CODE_ID.startsWith(value));
		filterList.forEach(el => selectbox.append(new Option(`[${el.CODE_ID}] ${el.CODE_NAME}`, el.CODE_ID)));
	}
}

const checkDate = () => {
	if($("#calendar1").val().replace(/[^0-9]/gi, '').length < 8) return false;
	if($("#calendar2").val().replace(/[^0-9]/gi, '').length < 8) return false;
	return true;
}

/**
 * 콤보박스 세팅
 */
const setCodeData = () => {

	const CODE_MK_LIST = [
		"TRANS_MK", 		// 연계여부
		"PRDT_GRP", 		// 과목군
		"USER_GRP_CDE", 	// 상담원그룹
		"CSEL_MK", 			// 상담구분
		"PROC_MK",			// 처리구분
		"DIV_CDE",			// 본부
		"PROC_STS_MK",		// 처리상태
		"CSEL_RST_MK",		// 상담결과
		"STD_CRS_CDE", 		// 상담경로
		"CSEL_GRD",			// 상담등급
		"CSEL_CHNL_MK", 	// 상담채널
		"CSEL_MAN_GRP_CDE",	// 내담자
		"STD_MON_CDE",		// 학습개월
		"RENEW_POTN", 		// 복습가능성
		"CSEL_LTYPE_CDE",	// 대분류
		"CSEL_MTYPE_CDE",	// 중분류
		"CSEL_STYPE_CDE",	// 소분류
	];

	// get code
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// create select options
	for (const code of codeList) {
		let codeMk = code.CODE_MK;
		let codeNm = code.CODE_NAME;
		let codeId = code.CODE_ID;

		// 상담분류 코드리스트 세팅
		if (codeMk == "CSEL_LTYPE_CDE" || codeMk == "CSEL_MTYPE_CDE" || codeMk == "CSEL_STYPE_CDE") {
			if (!cselType[codeMk]) cselType[codeMk] = new Array();
			cselType[codeMk].push(code);
			continue;
		}

		// filtering
		if (codeMk == "PROC_STS_MK") {	// 처리상태
			if (codeId != "01" && codeId != "02" && codeId != "03" && codeId != "04" && codeId != "15" && codeId != "12" && codeId != "99") continue;
		}

		// create select option
		codeNm = (codeMk == "STD_MON_CDE" || codeMk == "RENEW_POTN" || codeMk == "USER_GRP_CDE") ?
			`[${codeId}] ${codeNm}` : codeNm;
		$(`select[name='${codeMk}']`).append(new Option(codeNm, codeId));
	}

	// create multipleSelect
	// 상담원그룹
	$('#selectbox8').multipleSelect({
		selectAll: false,
		onClick: (view) => {
			const selects = $("#selectbox8").val();
			const isCheck = (selects.length > 0);
			filterUser(selects);
			$("#checkbox4").prop("checked", isCheck);
			$("#checkbox8").prop("checked", isCheck);
		},
	});
	// 상담경로
	$('#selectbox14').multipleSelect({
		selectAll: false,
		onClick: (view) => $("#checkbox17").prop("checked", ($("#selectbox14").val().length > 0)),
	});
	// 본부
	$('#selectbox11').multipleSelect({
		selectAll: false,
		onClick: (view) => $("#checkbox11").prop("checked", ($("#selectbox11").val().length > 0)),
	});
	// 상담채널
	$('#selectbox16').multipleSelect({
		selectAll: false,
		onClick: (view) => $("#checkbox19").prop("checked", ($("#selectbox16").val().length > 0)),
	});
}

/**
 * 과목 콤보조회
 */
const getProd = () => {
	const settings = {
		url: `${API_SERVER}/cns.getProd.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담조회",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}],
		}),
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		prods = data.dsRecv;
		prods.forEach(el => $("#selectbox1").append(new Option(`[${el.PRDT_ID}] ${el.PRDT_NAME}`, el.PRDT_ID)));
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
			userid: currentUser?.external_id,
			menuname: "상담조회",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ USER_GRP_CDE: "" }],	// 상담원그룹코드
		}),
		errMsg: "상담원 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		users = data.dsRecv;
		users.forEach(el => $("#selectbox2").append(new Option(`[${el.USER_ID}] ${el.USER_NAME}`, el.USER_ID)));

		// 상담원그룹과 상담원 세팅
		const currentUserGrp = currentUser.user_fields.user_grp_cde || "";
		const currentUserLvl = currentUser.user_fields.user_lvl_mk || "";
		const isAdmin = (currentUserLvl == "user_lvl_mk_1" || currentUserLvl == "user_lvl_mk_2" || currentUserLvl == "user_lvl_mk_3") ? true : false;
		const isLowLvl = (currentUserLvl != "user_lvl_mk_1" && currentUserLvl != "user_lvl_mk_2" && currentUserLvl != "user_lvl_mk_3" && currentUserLvl != "user_lvl_mk_4") ? true : false;
		$("#selectbox8").multipleSelect("setSelects", currentUserGrp);
		filterUser([currentUserGrp]);
		$("#selectbox2").val(currentUser.external_id);
		$("#checkbox4").prop("checked", true);
		$("#checkbox8").prop("checked", true);
		
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
		}
	});
}

/**
 * 상담조회 value check
 * @return 조회조건
 */
const getCselCondition = (page, perPage) => {

	const checkVal = "Y", uncheckVal = "N";

	let data = {
		QUERY_PAGING		:	page ? "1" : "0", // 페이징여부 (0: 전체 / 1: 페이징)
		QUERY_LIMIT			:	perPage,		  // 데이터 목록 개수
		QUERY_PAGE			:	page,			  // 페이지 번호
		QUERY_START			:	"0",			  // 조회할 번호
		CHK_DATE			:	$("#checkbox1").is(":checked") 	 ? checkVal : uncheckVal,	// 상담일자  - 체크여부				
		CHK_TRANS_MK		:	$("#checkbox2").is(":checked") 	 ? checkVal : uncheckVal,	// 연계여부 - 체크여부					
		CHK_TB_PROD			:	$("#checkbox7").is(":checked") 	 ? checkVal : uncheckVal,	// 과목코드 - 체크여부				
		CHK_USER_GRP_CDE	:	$("#checkbox4").is(":checked") 	 ? checkVal : uncheckVal,	// 상담원그룹 - 체크여부						
		CHK_CSEL_MK			:	$("#checkbox5").is(":checked") 	 ? checkVal : uncheckVal,	// 상담구분 - 체크여부				
		CHK_PROC_MK			:	$("#checkbox6").is(":checked") 	 ? checkVal : uncheckVal,	// 처리구분 - 체크여부				
		CHK_PROC_STS_MK		:	$("#checkbox12").is(":checked")  ? checkVal : uncheckVal,	// 처리상태구분 - 체크여부					
		CHK_TB_USER			:	$("#checkbox8").is(":checked") 	 ? checkVal : uncheckVal,	// 상담원 - 체크여부				
		CHK_DEPT_NM			:	$("#checkbox10").is(":checked")  ? checkVal : uncheckVal,	// 지점명 - 체크여부(사업국)				
		CHK_DIV_CDE			:	$("#checkbox11").is(":checked")  ? checkVal : uncheckVal,	// 본부코드 - 체크여부				
		CHK_CSEL_CHNL_MK	:	$("#checkbox19").is(":checked")  ? checkVal : uncheckVal,	// 상담채널 - 체크여부						
		CHK_CSEL_RST_MK		:	$("#checkbox16").is(":checked")  ? checkVal : uncheckVal,	// 상담결과 - 체크여부					
		CHK_CSEL_LTYPE		:	$("#checkbox13").is(":checked")  ? checkVal : uncheckVal,	// 대분류 콤보 - 체크여부					
		CHK_CSEL_MTYPE		:	$("#checkbox14").is(":checked")  ? checkVal : uncheckVal,	// 중분류 콤보 - 체크여부					
		CHK_CSEL_STYPE		:	$("#checkbox15").is(":checked")  ? checkVal : uncheckVal,	// 소분류 콤보 - 체크여부					
		CHK_REFUND_FLAG		:	$("#checkbox20").is(":checked")  ? checkVal : uncheckVal,	// 환불승인상태 - 체크여부(내담자)				
		CHK_STD_CRS_CDE		:	$("#checkbox17").is(":checked")  ? checkVal : uncheckVal,	// 상담경로 - 체크여부					
		CHK_CSEL_GRD		:	$("#checkbox18").is(":checked")  ? checkVal : uncheckVal,	// 상담등급 - 체크여부					
		CHK_VOC				:	$("#checkbox23").is(":checked")  ? checkVal : uncheckVal,	// VOC - 체크여부			
		CHK_RE_PROC			:	$("#checkbox24").is(":checked")  ? checkVal : uncheckVal,	// 재확인 - 체크여부				
		CHK_STD_MON_CDE		:	$("#checkbox21").is(":checked")  ? checkVal : uncheckVal,	// 학습개월 - 체크여부					
		CHK_RENEW_POTN		:	$("#checkbox22").is(":checked")  ? checkVal : uncheckVal,	// 복회가능성 - 체크여부					
		CHK_LC_MK			: 	$("#checkbox28").is(":checked")  ? checkVal : uncheckVal, 	// 러닝센터 - 체크여부
		CHK_YC_MK			: 	$("#checkbox29").is(":checked")  ? checkVal : uncheckVal, 	// 검색 조건 추가됨
		CHK_HL_MK			: 	$("#checkbox30").is(":checked")  ? checkVal : uncheckVal, 	// 검색 조건 추가됨			
		CHK_PROC_DEPT_NM	:	$("#checkbox26").is(":checked")  ? checkVal : uncheckVal,	// 처리지점명 - 체크여부(연계부서)						
		CHK_SMS				:	$("#checkbox27").is(":checked")  ? checkVal : uncheckVal,	// 문자발송(SMS) - 체크여부			
		CHK_PRDT_GRP		:	$("#checkbox3").is(":checked") 	 ? checkVal : uncheckVal,	// 과목군 - 체크여부	
		CHK_LC_NM			:	$("#checkbox9").is(":checked") 	 ? checkVal : uncheckVal,	// 센터명 - 체크여부(센터)
		CHK_RE_CALL			:	$("#checkbox33").is(":checked")	 ? checkVal : uncheckVal,	// 재통화 - 체크여부(센터)
		VAL_STDATE			:	calendarUtil.getImaskValue("calendar1"),		// 상담일자FROM - 조회조건				
		VAL_EDDATE			:	calendarUtil.getImaskValue("calendar2"),		// 상담일자TO - 조회조건				
		VAL_TRANS_MK		:	$("#selectbox6").val(),		// 연계여부 - 조회조건					
		VAL_TB_PROD			:	$("#selectbox1").val(),		// 과목코드 - 조회조건				
		VAL_USER_GRP_CDE	:	$("#selectbox8").val(),		// 상담원그룹 - 조회조건													
		VAL_CSEL_MK			:	$("#selectbox9").val(),		// 상담구분 - 조회조건			
		VAL_PROC_MK			:	$("#selectbox10").val(),	// 처리구분 - 조회조건			
		VAL_PROC_STS_MK		:	$("#selectbox12").val(),	// 처리상태구분 - 조회조건				
		VAL_TB_USER			:	$("#selectbox2").val(),		// 상담원 - 조회조건			
		VAL_DEPT_NM			:	$("#textbox2").val(),		// 지점명 - 조회조건(사업국)			
		VAL_DIV_CDE			:	$("#selectbox11").val(),	// 본부코드 - 조회조건			
		VAL_CSEL_CHNL_MK	:	$("#selectbox16").val(),	// 상담채널 - 조회조건						
		VAL_CSEL_RST_MK		:	$("#selectbox13").val(),	// 상담결과 - 조회조건					
		VAL_CSEL_LTYPE		:	$("#selectbox3").val(),		// 대분류 콤보 - 조회조건					
		VAL_CSEL_MTYPE		:	$("#selectbox4").val(),		// 중분류 콤보 - 조회조건					
		VAL_CSEL_STYPE		:	$("#selectbox5").val(),		// 소분류 콤보 - 조회조건					
		VAL_CSEL_MAN_MK		:	$("#selectbox17").val(),	// 환불승인상태 - 조회조건(내담자)				
		VAL_STD_CRS_CDE		:	$("#selectbox14").val(),	// 상담경로 - 조회조건					
		VAL_CSEL_GRD		:	$("#selectbox15").val(),	// 상담등급 - 조회조건					
		VAL_VOC				:	$("#selectbox20").val(),	// VOC - 조회조건			
		VAL_STD_MON_CDE		:	$("#selectbox18").val(),	// 학습개월 - 조회조건					
		VAL_RENEW_POTN		:	$("#selectbox19").val(),	// 복회가능성 - 조회조건					
		VAL_PROC_DEPT_NM	:	$("#textbox3").val(),		// 처리지점명 - 조회조건(연계부서)					
		VAL_SMS				:	$("#selectbox21").val(),	// 문자발송(SMS) - 조회조건			
		VAL_PRDT_GRP		:	$("#selectbox7").val(),		// 과목군 - 조회조건					
		VAL_LC_NM			:	$("#textbox1").val(),		// 센터명 - 조회조건		
		VAL_RE_CALL			:	$("#selectbox22").val(),	// 재통화 - 조회조건								
	}

	// 조회조건 데이타가 공백이면, 체크해제한다.
	for(let key in data) {
		if(key === "VAL_STDATE" || key === "VAL_EDDATE") {
			data[key] = data[key].length === 8 ? data[key] : "";
			if(!data[key]) data.CHK_DATE = uncheckVal;
		} else if(key.startsWith("VAL_") && !data[key]) {
			let chkName = `${key.replace("VAL_", "CHK_")}`;
			data[chkName] = uncheckVal;
		}
	}

	// checkbox는 한개 이상 선택되어야 한다.
	let isChecked = false;
	for(let key in data) {
		if(key.startsWith("CHK_") && data[key] == checkVal) {
			isChecked = true;
			break;
		}
	}

	//체크된 항목이 없으면,
	if(!isChecked) {
		alert("조회조건을 선택하세요.");
		return false;
	}

	return data;
}

/**
 * 상담조회
 * @param {number} page 
 */
const getCsel = (page) => {
	
	// 조회데이터 초기화
	// grid1.resetData([]);
	grid2.resetData([]);
	$("#form1")[0].reset();
	calendarUtil.setImaskValue("txtPROC_HOPE_DATE", "");
	calendarUtil.setImaskValue("txtPROC_DATE", "");

	// 조회조건 체크
	const perPage = grid1.getPaginationPerPage();
	// const condition = getCselCondition(page, perPage);
	const condition = getCselCondition();
	if(!condition) return;

	// 상담조회 api call
	const settings = {
		url: `${API_SERVER}/cns.getCsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담조회",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg: "상담조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		const cselData = data.dsRecv;
		const totalCount = (cselData.length > 0) ? cselData[0].TOTALCNT : 0;
		// grid1.resetData(cselData, {
		// 	pageState: {
		// 		page,		 // Target page number.
		// 		totalCount,	 // The total pagination count.
		// 		perPage,	 // Number of rows per page.
		// 	}
		// });
		grid1.resetData(cselData);
	});	
}

/**
 * 상담조회 엑셀저장용
 */
const getCselExcel = () => new Promise((resolve, reject) => {
	// 조회조건 체크
	const condition = getCselCondition();
	if(!condition) return reject("");

	// 상담조회 api call
	const settings = {
		url: `${API_SERVER}/cns.getCselExcel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담조회",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg: "상담조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings)
		.done(data => {
			if (!checkApi(data, settings)) return reject(new Error(getApiMsg(data, settings)));
			return resolve(data.dsRecv || []);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 상담제품 조회
 * @param {string} 		  CSEL_DATE 상담일자
 * @param {string|number} CSEL_NO   상담번호
 * @param {string|number} CSEL_SEQ  상담순번
 */
const getCselSubj = (CSEL_DATE, CSEL_NO, CSEL_SEQ) => {

	const settings = {
		global: false,
		url: `${API_SERVER}/cns.getCselSubj.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담조회",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ CSEL_DATE, CSEL_NO, CSEL_SEQ }],
		}),
		errMsg:  "상담제품 조회 중 오류가 발생하였습니다.",
	}

	$.ajax(settings)
		.done(data => {
			if (!checkApi(data, settings)) return;
			grid2.resetData(data.dsRecv);
		})
		.fail((jqXHR) => alert(settings.errMsg + "\n\n" + getErrMsg(jqXHR.statusText)));
}

/**
 * 상담 상세정보 세팅
 * @param {object} row
 */
const setCselDetail = row => {

	// 상담제품 grid 조회
	getCselSubj(row.CSEL_DATE, row.CSEL_NO, row.CSEL_SEQ);

	// 상세정보 영역 세팅
	$("#txtCSEL_TITLE").val(row.CSEL_TITLE);								// 제목			
	$("#txtCSEL_CNTS").val(row.CSEL_CNTS);									// 상담내용
	$("#txtCSEL_MK_NM").val(row.CSEL_MK_NM);								// 상담구분
	$("#txtCSEL_LTYPE_CDE_NM").val(row.CSEL_LTYPE_CDE_NM);					// 분류(대)
	$("#txtCSEL_MTYPE_CDE_NM").val(row.CSEL_MTYPE_CDE_NM);					// 분류(중)
	$("#txtCSEL_STYPE_CDE_NM").val(row.CSEL_STYPE_CDE_NM);					// 분류(소)
	$("#txtFST_CRS_CDE_NM").val(row.FST_CRS_CDE_NM);						// 상담경로
	$("#txtPROC_MK_NM").val(row.PROC_MK_NM);								// 처리구분
	$("#txtCSEL_RST_MK1_NM").val(row.CSEL_RST_MK1_NM);						// 상담결과
	$("#txtAREA_CDE").val(row.AREA_CDE);									// 지역코드
	$("#txtAREA_CDE_NM").val(row.AREA_CDE_NM);								// 지역명
	$("#txtPROC_STS_MK_NM").val(row.PROC_STS_MK_NM);						// 처리상태
	$("#txtREFUND_FLAG_NM").val(row.REFUND_FLAG_NM);						// 환불접수상태
	$("#txtMEDIA_CDE_NM").val(row.MEDIA_CDE_NM);							// 매체구분
	$("#txtLIMIT_MK_NM").val(row.LIMIT_MK_NM);								// 처리시한
	$("#txtCUST_RESP_MK_NM").val(row.CUST_RESP_MK_NM);						// 고객반응
	$("#txtDIV_CDE").val(row.DIV_CDE);										// 본부코드
	$("#txtUP_DEPT_NAME_NM").val(row.UP_DEPT_NAME_NM);						// 본부명
	$("#txtOPEN_GBN_NM").val(row.OPEN_GBN_NM);								// 정보
	$("#txtMOTIVE_CDE_NM").val(row.MOTIVE_CDE_NM);							// 입회사유
	calendarUtil.setImaskValue("txtPROC_HOPE_DATE", row.PROC_HOPE_DATE);	// 처리희망일
	$("#txtCALL_RST_MK_NM").val(row.CALL_RST_MK_NM);						// O/B결과
	$("#txtDEPT_ID").val(row.DEPT_ID);										// 사업국코드
	$("#txtDEPT_NAME_NM").val(row.DEPT_NAME_NM);							// 사업국명
	$("#txtCSEL_GRD_NM").val(row.CSEL_GRD_NM);								// 상담등급
	$("#txtCSEL_MAN_MK_NM").val(row.CSEL_MAN_MK_NM);						// 내담자
	calendarUtil.setImaskValue("txtPROC_DATE", row.PROC_DATE);				// 처리완료일
	$("#txtCSEL_CHNL_MK_NM").val(row.CSEL_CHNL_MK_NM);						// 상담채널
	$("#txtLC_NAME_NM").val(row.LC_NAME_NM);								// 센터
	$("#checkbox32").prop("checked", row.VOC_MK == "Y");					// VOC가 "Y" 일경우 체크

}

/**
 * 상담조회 엑셀저장용 table 생성
 * @param {array} data 
 * @return table element
 */
const createCselTable = data => {
	const tableEl = $("#cselExcelTable");

	// create thead
	const theadStr = `
		<tr>
			<th>NO</th>
			<th>상담일자</th>
			<th>상담번호</th>
			<th>상담순번</th>
			<th>상담구분</th>
			<th>성명</th>
			<th>회원번호</th>
			<th>학년</th>
			<th>본부명</th>
			<th>지점명</th>
			<th>상담분류(대)</th>
			<th>상담분류(중)</th>
			<th>상담분류(소)</th>
			<th>상담채널명</th>
			<th>상담제목</th>
			<th>상담내용</th>
			<th>상담원명</th>
			<th>내담자</th>
			<th>상담경로</th>
			<th>러닝센터</th>
			<th>VOC여부</th>
			<th>상담제품</th>
			<th>상담제품 교사명</th>
			<th>센터명</th>
			<th>YC</th>
		</tr>`;
	tableEl.find("thead").empty().append(theadStr);

	// create tbody
	tableEl.find("tbody").empty();
	data.forEach((el, i) => {
		const tbodyStr = `
			<tr>
				<td>${(i + 1)}</td>
				<td>${FormatUtil.date(el.CSEL_DATE || "")}</td>
				<td>${el.CSEL_NO || ""}</td>
				<td>${el.CSEL_SEQ || ""}</td>
				<td>${el.CSEL_MK_NM || ""}</td>
				<td>${el.NAME || ""}</td>
				<td>${el.MBR_ID || ""}</td>
				<td>${el.GRADE_NM || ""}</td>
				<td>${el.UP_DEPT_NAME_NM || ""}</td>
				<td>${el.DEPT_NAME_NM || ""}</td>
				<td>${el.CSEL_LTYPE_CDE_NM || ""}</td>
				<td>${el.CSEL_MTYPE_CDE_NM || ""}</td>
				<td>${el.CSEL_STYPE_CDE_NM || ""}</td>
				<td>${el.CSEL_CHNL_MK_NM || ""}</td>
				<td>${el.CSEL_TITLE || ""}</td>
				<td>${el.CSEL_CNTS || ""}</td>
				<td>${el.CSEL_USER_NM || ""}</td>
				<td>${el.CSEL_MAN_MK_NM || ""}</td>
				<td>${el.FST_CRS_CDE_NM || ""}</td>
				<td>${el.LC_MK || ""}</td>
				<td>${el.VOC_MK || ""}</td>
				<td>${el.PRDT_NAME || ""}</td>
				<td>${el.PRDT_EMP_NM || ""}</td>
				<td>${el.LC_NAME_NM || ""}</td>
				<td>${el.YC_MK || ""}</td>
			</tr>`;
		tableEl.find("tbody").append(tbodyStr);
	});

	// delete input 
	tableEl.find('input').each((i, el) => $(el).remove());

	return tableEl;
}

/**
 * 상담조회 엑셀저장
 */
const saveExcelCsel = async () => {
	const fileName = `상담조회(${getDateFormat()}).xls`;
	const cselData = await getCselExcel();
	const tableEl = createCselTable(cselData);
	tableToExcel(tableEl, fileName);
}

/**
 * 녹취청취
 */
const onRecordPlay = () => {
	
	const rowKey = grid1.getSelectedRowKey();
	const rowData = grid1.getRow(rowKey);

	if (!rowData.RECORD_ID) return;

	if (rowData.RECORD_ID == "MOREDATA") {
		PopupUtil.open("CCEMPRO047", 852, 240, "", rowData);
	} else {
		recordPlay(rowData.RECORD_ID);
	}

}

/**
 * 결과
 */
const onResult = () => {
	const rowKey = grid1.getSelectedRowKey();
	const proc = grid1.getValue(rowKey, "PROC_MK");

	switch(proc){
        case "2":       //상담원처리 = 고객의견
			PopupUtil.open("CCEMPRO095", 1110, 603);
            break;
        case "3":       //상담연계 = 결과등록
        case "4":       //시정처리 = 결과등록
			PopupUtil.open("CCEMPRO030", 1098, 810);
            break;
        default:
			break;
	}
	
}

/**
 * 상담/입회수정
 */
const onModify = () => {

	if (!opener) {
		alert("세션정보를 찾을 수 없습니다.\n\n팝업창을 닫고 다시 실행해 주세요.");
		return;
	}

	if (opener.PopupUtil.contains("CSELTOP")) {
		alert("상담등록 또는 입회등록 창을 닫고 작업하셔야 합니다.");
		return;
	}

	const rowKey = grid1.getSelectedRowKey();
	const proc = grid1.getValue(rowKey, "PROC_MK");

	switch (proc) {
		case "6":
			PopupUtil.open("CCEMPRO032", 1220, 610);	// 선생님소개 탭
			break;
		case "5":
			PopupUtil.open("CCEMPRO031", 1220, 610);	// 입회등록 탭
			break;
		default:
			PopupUtil.open("CCEMPRO022", 1220, 610);	// 상담등록 탭
			break;
	}

}

/**
 * 상담이력 삭제 value check
 * @return condition
 */
const delCounselCondition = () => {

	const rowKey = grid1.getSelectedRowKey();
	const cselDate = grid1.getValue(rowKey,"CSEL_DATE");	// 상담일자
	const cselNo = grid1.getValue(rowKey, "CSEL_NO");		// 접수
	const cselSeq = grid1.getValue(rowKey, "CSEL_SEQ");		// 상담순번
	const proc = grid1.getValue(rowKey, "PROC_MK");			// 처리구분코드
	const procSts = grid1.getValue(rowKey, "PROC_STS_MK");  // 처리상태코드
	const refund = grid1.getValue(rowKey, "REFUND_FLAG");	// 환불상태코드
	const enterRst = grid2.getValue(0, "ENTER_RST_FLAG");	// 입회결과여부(1:입회)
	
	// 1. CSEL_SEQ가 1만 있으면 삭제 가능, SEQ가 1이 아닌 건 삭제 가능.
	let isDelete = false;
	const gridData = grid1.getData();
	for (const row of gridData) {
		if (row.CSEL_NO == cselNo && row.CSEL_SEQ != "1") {
			isDelete = true;
			break;
		}
	}
	if (isDelete && cselSeq == "1") {
		alert("동일한 접수번호에 접수순번이 2가지 이상 존재합니다.\n\n먼저 접수순번이 1이 아닌건을 삭제해 주십시오.");
		return false;
	}

	// 2. 결과등록한 상담이력은 삭제할 수 없음.
	if (proc == "3" && (procSts == "04" || procSts == "15" || procSts == "99")) {
		alert("결과등록한 상담이력은 삭제할 수 없습니다.");
		return false;
	}

	// 3. 환불에 대해 승인이 된 상담이력은 삭제할 수 없음.
	if (refund && refund != "0") {
		alert("환불에 대해 승인이 된 상담이력은 삭제할 수 없습니다.");
		return false;
	}

	// 4. 입회완료된 상담이력은 삭제 불가능.
	if (enterRst > 0) {
		alert("입회완료된 상담이력은 삭제할 수 없습니다.");
		return false;
	}

	let sMsg = "";
	sMsg += "\n * 상담일자 : " + cselDate;
	sMsg += "\n * 상담번호 : " + cselNo;
	sMsg += "\n * 상담순번 : " + cselSeq;
	sMsg += "\n\n 위 항목에 해당하는 상담이력/상담과목을 정말로 삭제하시겠습니까?";
	if (confirm(sMsg) == false) return false;

	return {
		CSEL_DATE	:	cselDate,	// 상담일자
		CSEL_NO		:	cselNo,		// 상담번호
		CSEL_SEQ	:	cselSeq,	// 상담순번
	}

}

/**
 * 상담이력 삭제
 */
const delCounsel = () => {
	const condition = delCounselCondition();
	if (!condition) return;

	const settings = {
		url: `${API_SERVER}/cns.delCounsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "상담조회",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg: "상담정보 삭제중 오류가 발생하였습니다.",
	}

	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		alert("정상적으로 삭제 되었습니다.");
		getCsel(1);
	});
}
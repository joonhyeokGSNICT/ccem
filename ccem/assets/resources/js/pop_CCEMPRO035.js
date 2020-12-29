var grid1, grid2;	// TOAST UI Grid
let prods = [];		// 과목 리스트
let users = [];		// 상담원 리스트
let cselType = {};	// 분류코드

$(function () {
	// init date
	$(".calendar").val(getDateFormat());

	// create calendar
	$(".calendar").each((i, el) => {
		calendarUtil.init(el.id, null, () => $("#checkbox1").prop("checked", checkDate()));
	});

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));

	createGrids();
	getCodeList();
	getProd();
	getUser();
	getCselType();
});

const createGrids = () => {
	// 상담조회 grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 213,
		scrollY: false,
		pageOptions: {
			useClient: true,
		  	perPage: 7,
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
			{ header: '상담일자',                       name: "CSEL_DATE",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   formatter: columnInfo => FormatUtil.date(columnInfo.value)},
			{ header: '접수',                           name: "CSEL_NO",               width: 60,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '상담순번',                       name: "CSEL_SEQ",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담채널',                       name: "CSEL_CHNL_MK_NM",       width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '상담구분',                       name: "CSEL_MK_NM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '회원명',                         name: "NAME",                  width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '회원번호',                       name: "MBR_ID",                width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '통화시각',                       name: "CALL_STTIME",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '상담시간',                       name: "CSEL_TIME_NM",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '처리시간',                       name: "PROC_TIME_NM",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '학년',                           name: "GRADE_NM",              width: 60,     align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '본부',                           name: "UP_DEPT_NAME_NM",       width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '사업국',                         name: "DEPT_NAME_NM",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '센터',                           name: "LC_NAME_NM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '분류(대)',                       name: "CSEL_LTYPE_CDE_NM",     width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '분류(중)',                       name: "CSEL_MTYPE_CDE_NM",     width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '분류(소)',                       name: "CSEL_STYPE_CDE_NM",     width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '상담제목',                       name: "CSEL_TITLE",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '상담실처리',                     name: "PROC_CNTS",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '사업국처리',                     name: "VOC_CNTS",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '해피콜',                         name: "HPCALL_CNTS",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '상담원',                         name: "CSEL_USER_NM",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '내담자',                         name: "CSEL_MAN_MK_NM",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '상담등급',                       name: "CSEL_GRD",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담등급',                       name: "CSEL_GRD_NM",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '고객반응',                       name: "CUST_RESP_MK_NM",       width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '전화번호',                       name: "MOBILNO",       		   width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '핸드폰번호',                     name: "MOBILNO",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: 'ERMS구분',                       name: "ERMS_MK",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,   },
			{ header: '팩스발송일시',                   name: "FAX_DATETIME",          width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '녹취ID',                         name: "RECORD_ID",             width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '상담입력시각',                   name: "CSEL_STTIME",           width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: 'TICKET ID',                      name: "TICKET_ID",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '상담경로',                       name: "FST_CRS_CDE_NM",        width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '상담제품',                       name: "PRDT_NAME",             width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '업무정직도',                     name: "CNT_NGPROC",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '학습개월',                       name: "STD_MON_NM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '복회가능성',                     name: "RENEW_POTN_NM",         width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '러닝센터',                       name: "LC_MK",                 width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: 'YC',                             name: "YC_MK",                 width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '연계부서',                       name: "PROC_DEPT_NAME_NM",     width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: 'VOC',                            name: "VOC_MK",                width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '발송시간',                      name: "SMS_DATE_TIME",         width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '발송결과',                      name: "SMS_PROC_NM",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '선생님명',                       name: "PRDT_EMP_NM",           width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false,    },
			{ header: '고객구분코드',                   name: "CUST_MK",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담원ID',                       name: "CSEL_USER_ID",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담구분코드',                   name: "CSEL_MK",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '처리구분코드',                   name: "PROC_MK",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '처리상태코드',                   name: "PROC_STS_MK",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '지점코드',                       name: "DEPT_ID",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '부서코드',                       name: "DIV_CDE",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '지역코드',                       name: "AREA_CDE",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담분류(대)',                   name: "CSEL_LTYPE_CDE",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담분류(중)',                   name: "CSEL_MTYPE_CDE",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담분류(소)',                   name: "CSEL_STYPE_CDE",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '처리희망일자',                   name: "PROC_HOPE_DATE",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담채널구분',                   name: "CSEL_CHNL_MK",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '근무형태구분',                   name: "WORK_STYL_MK",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '고객번호',                       name: "CUST_ID",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담결과',                       name: "CSEL_RST_MK1",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '첫상담경로',                     name: "FST_CRS_CDE",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담종료시각',                   name: "CSEL_EDTIME",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '통화종료시각',                   name: "CALL_EDTIME",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담내용',                       name: "CSEL_CNTS",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,   },
			{ header: '공개여부',                       name: "OPEN_GBN",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '처리시한',                       name: "LIMIT_MK",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: 'O/B결과코드',                    name: "CALL_RST_MK",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '고객반응코드',                   name: "CUST_RESP_MK",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '내담자구분코드',                 name: "CSEL_MAN_MK",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '입회사유코드',                   name: "MOTIVE_CDE",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '매체구분코드',                   name: "MEDIA_CDE",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '연계번호',                       name: "TRANS_NO",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '연계일자',                       name: "TRANS_DATE",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '학년코드',                       name: "GRADE_CDE",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '재확인여부',                     name: "RE_PROC",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '연계구분',                       name: "TRANS_MK",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '환불상태코드',                   name: "REFUND_FLAG",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '이벤트년월',                     name: "CAMP_TG_YM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '이벤트명',                       name: "CAMP_MK_NM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '처리구분',                       name: "PROC_MK_NM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '처리구분',                       name: "PROC_STS_MK_NM",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '매체구분',                       name: "MEDIA_CDE_NM",          width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '입회사유',                       name: "MOTIVE_CDE_NM",         width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '상담결과명',                     name: "CSEL_RST_MK1_NM",       width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: 'o/b결과명',                      name: "CALL_RST_MK_NM",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '처리시한명',                     name: "LIMIT_MK_NM",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '근무형태구분',                   name: "WORK_STYL_MK_NM",       width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '정보',                           name: "OPEN_GBN_NM",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,   },
			{ header: '환불접수상태명',                 name: "REFUND_FLAG_NM",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '지역코드명',                     name: "AREA_CDE_NM",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '처리일자',                       name: "PROC_DATE",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '삭제FLAG',                       name: "DELETE_FLAG",           width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '재조회 키',                      name: "REFRESHKEY",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '우편번호',                       name: "ZIPCDE",                width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '우편번호주소',                   name: "ZIP_ADDR",              width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '주소',                           name: "ADDR",                  width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '지점연계시간 PROC_DATE_TIME',    name: "PROC_DATE_TIME",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: 'VOC처리시간 VOC_DATE_TIME',      name: "VOC_DATE_TIME",         width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '지점처리시간 dept_proc_time',    name: "DEPT_PROC_TIME",        width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '시간약속',                       name: "TIME_APPO",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
			{ header: '문자발송건수(SMS)',              name: "SMS_CNT",               width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,    },
		],
	});
	grid1.on("focusChange", ev => {
		grid1.addSelection(ev);

		// 녹취청취 버튼 disabled 여부
		if (grid1.getValue(ev.rowKey, "RECORD_ID")) {
			$("#button2").prop("disabled", false);
		} else {
			$("#button2").prop("disabled", true);
		}

		setCselDetail(grid1.getRow(ev.rowKey));
	});
	grid1.on("click", ev => {
		grid1.clickSort(ev);
	});
	grid1.on("dblclick", ev => {
		// TODO 해당 고객정보로 탑바 전체 재조회
	});
	grid1.on("onGridUpdated", () => {
		grid1.focus(0);

		const gridCnt = grid1.getPaginationTotalCount();
		$("#textbox4").val(gridCnt);

		// 녹취매핑, 녹취청취 버튼 disabled 여부
		if(gridCnt > 0) {
			$("#button1").prop("disabled", false);
		}else {
			$("#button1").prop("disabled", true);
			$("#button2").prop("disabled", true);
		}

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
			{ header: '상담제품', name: "PRDT_NAME", align: "center", sortable: true, ellipsis: true, hidden: false, },
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
 * @param {string} key 
 */
const filterUser = key => {
	let selectbox = $("#selectbox2").empty();
	let data = users.filter(el => el.USER_GRP_CDE == key);
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
 * 공통코드 조회
 */
const getCodeList = () => {

	let CODE_MK_LIST = [
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
	];

	CODE_MK_LIST.forEach(codeName => {
		let settings = {
			url: `${API_SERVER}/sys.getCommCode.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{ CODE_MK: codeName }],
			}),
		}
		$.ajax(settings).done(data => {
			if (checkApi(data, settings)) {
				let codeList = data.dsRecv;
				codeList.forEach(code => {
					let text = (codeName == "STD_MON_CDE" || codeName == "RENEW_POTN" || codeName == "USER_GRP_CDE") ? 
									`[${code.CODE_ID}] ${code.CODE_NAME}` : code.CODE_NAME;
					let value = code.CODE_ID;
					$(`select[name='${codeName}']`).append(new Option(text, value));
				});
			}
		});
	});

}

/**
 * 과목 콤보조회
 */
const getProd = () => {
	let settings = {
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
		if (!checkApi(data, settings)) return;
		prods = data.dsRecv;
		prods.forEach(el => $("#selectbox1").append(new Option(`[${el.PRDT_ID}] ${el.PRDT_NAME}`, el.PRDT_ID)));
	});
}

/**
 * 상담원 콤보조회
 */
const getUser = () => {
	let settings = {
		url: `${API_SERVER}/cns.getUser.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ USER_GRP_CDE: "" }],	// 상담원그룹코드
		}),
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		users = data.dsRecv;
		users.forEach(el => $("#selectbox2").append(new Option(`[${el.USER_ID}] ${el.USER_NAME}`, el.USER_ID)));
	});
}

/**
 * 분류코드 조회
 */
const getCselType = () => {

	let code_mk_list = [
		"CSEL_LTYPE_CDE",	// 대분류
		"CSEL_MTYPE_CDE",	// 중분류
		"CSEL_STYPE_CDE",	// 소분류
	];

	code_mk_list.forEach(codeName => {
		let settings = {
			url: `${API_SERVER}/sys.getCommCode.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{ CODE_MK: codeName }],
			}),
		}
		$.ajax(settings).done(data => {
			if (checkApi(data, settings)) {
				cselType[codeName] = data.dsRecv;
			}
		});
	});

}

/**
 * 상담 조회조건
 */
const getCselCondition = () => {

	const checkVal = "1", uncheckVal = "0";

	let data = {
		CHK_DATE			:	$("#checkbox1").is(":checked") 		? checkVal : uncheckVal,		// 상담일자  - 체크여부				
		// CHK_FILLER_1		:	$("#checkbox").is(":checked") 		? checkVal : uncheckVal,		// 필러1 - 체크여부					
		CHK_TRANS_MK		:	$("#checkbox2").is(":checked") 		? checkVal : uncheckVal,		// 연계여부 - 체크여부					
		CHK_TB_PROD			:	$("#checkbox7").is(":checked") 		? checkVal : uncheckVal,		// 과목코드 - 체크여부				
		CHK_USER_GRP_CDE	:	$("#checkbox4").is(":checked") 		? checkVal : uncheckVal,		// 상담원그룹 - 체크여부						
		CHK_CSEL_MK			:	$("#checkbox5").is(":checked") 		? checkVal : uncheckVal,		// 상담구분 - 체크여부				
		CHK_PROC_MK			:	$("#checkbox6").is(":checked") 		? checkVal : uncheckVal,		// 처리구분 - 체크여부				
		CHK_PROC_STS_MK		:	$("#checkbox12").is(":checked") 	? checkVal : uncheckVal,		// 처리상태구분 - 체크여부					
		CHK_TB_USER			:	$("#checkbox8").is(":checked") 		? checkVal : uncheckVal,		// 상담원 - 체크여부				
		CHK_DEPT_NM			:	$("#checkbox10").is(":checked") 	? checkVal : uncheckVal,		// 지점명 - 체크여부(사업국)				
		CHK_DIV_CDE			:	$("#checkbox11").is(":checked") 	? checkVal : uncheckVal,		// 본부코드 - 체크여부				
		CHK_CSEL_CHNL_MK	:	$("#checkbox19").is(":checked") 	? checkVal : uncheckVal,		// 상담채널 - 체크여부						
		CHK_CSEL_RST_MK		:	$("#checkbox16").is(":checked") 	? checkVal : uncheckVal,		// 상담결과 - 체크여부					
		CHK_CSEL_LTYPE		:	$("#checkbox13").is(":checked") 	? checkVal : uncheckVal,		// 대분류 콤보 - 체크여부					
		CHK_CSEL_MTYPE		:	$("#checkbox14").is(":checked") 	? checkVal : uncheckVal,		// 중분류 콤보 - 체크여부					
		CHK_CSEL_STYPE		:	$("#checkbox15").is(":checked") 	? checkVal : uncheckVal,		// 소분류 콤보 - 체크여부					
		CHK_REFUND_FLAG		:	$("#checkbox20").is(":checked") 	? checkVal : uncheckVal,		// 환불승인상태 - 체크여부(내담자)				
		CHK_STD_CRS_CDE		:	$("#checkbox17").is(":checked") 	? checkVal : uncheckVal,		// 상담경로 - 체크여부					
		CHK_CSEL_GRD		:	$("#checkbox18").is(":checked") 	? checkVal : uncheckVal,		// 상담등급 - 체크여부					
		CHK_VOC				:	$("#checkbox23").is(":checked") 	? checkVal : uncheckVal,		// VOC - 체크여부			
		CHK_RE_PROC			:	$("#checkbox24").is(":checked") 	? checkVal : uncheckVal,		// 재확인 - 체크여부				
		CHK_NGPROC			:	$("#checkbox25").is(":checked") 	? checkVal : uncheckVal,		// 업무정직도 - 체크여부				
		CHK_STD_MON_CDE		:	$("#checkbox21").is(":checked") 	? checkVal : uncheckVal,		// 학습개월 - 체크여부					
		CHK_RENEW_POTN		:	$("#checkbox22").is(":checked") 	? checkVal : uncheckVal,		// 복회가능성 - 체크여부					
		// CHK_TB_VENDER		:	$("#checkbox").is(":checked") 	? checkVal : uncheckVal,		// LC/YC - 체크여부					TODO LC, YC, HL 체크분리
		// CHK_LC_MK			:	$("#checkbox").is(":checked") 	? checkVal : uncheckVal,		// 러닝센터 - 체크여부				
		CHK_PROC_DEPT_NM	:	$("#checkbox26").is(":checked") 	? checkVal : uncheckVal,		// 처리지점명 - 체크여부(연계부서)						
		CHK_TIME_APPO		:	$("#checkbox31").is(":checked") 	? checkVal : uncheckVal,		// 시간약속 - 체크여부					
		CHK_SMS				:	$("#checkbox27").is(":checked") 	? checkVal : uncheckVal,		// 문자발송(SMS) - 체크여부			
		CHK_PRDT_GRP		:	$("#checkbox3").is(":checked") 		? checkVal : uncheckVal,		// 과목군 - 체크여부	
		CHK_LC_NM			:	$("#checkbox9").is(":checked") 		? checkVal : uncheckVal,		// 센터명 - 체크여부(센터)			
		VAL_STDATE			:	$("#calendar1").val().replace(/[^0-9]/gi, ''),		// 상담일자FROM - 조회조건				
		VAL_EDDATE			:	$("#calendar2").val().replace(/[^0-9]/gi, ''),		// 상담일자TO - 조회조건				
		VAL_TRANS_MK		:	$("#selectbox6").val(),				// 연계여부 - 조회조건					
		VAL_TB_PROD			:	$("#selectbox1").val(),				// 과목코드 - 조회조건				
		VAL_USER_GRP_CDE	:	$("#selectbox8").val(),				// 상담원그룹 - 조회조건													
		VAL_CSEL_MK			:	$("#selectbox9").val(),				// 상담구분 - 조회조건			
		VAL_PROC_MK			:	$("#selectbox10").val(),			// 처리구분 - 조회조건			
		VAL_PROC_STS_MK		:	$("#selectbox12").val(),			// 처리상태구분 - 조회조건				
		VAL_TB_USER			:	$("#selectbox2").val(),				// 상담원 - 조회조건			
		VAL_DEPT_NM			:	$("#textbox2").val(),				// 지점명 - 조회조건(사업국)			
		VAL_DIV_CDE			:	$("#selectbox11").val(),			// 본부코드 - 조회조건			
		VAL_CSEL_CHNL_MK	:	$("#selectbox16").val(),			// 상담채널 - 조회조건						
		VAL_CSEL_RST_MK		:	$("#selectbox13").val(),			// 상담결과 - 조회조건					
		VAL_CSEL_LTYPE		:	$("#selectbox3").val(),				// 대분류 콤보 - 조회조건					
		VAL_CSEL_MTYPE		:	$("#selectbox4").val(),				// 중분류 콤보 - 조회조건					
		VAL_CSEL_STYPE		:	$("#selectbox5").val(),				// 소분류 콤보 - 조회조건					
		VAL_REFUND_FLAG		:	$("#selectbox17").val(),			// 환불승인상태 - 조회조건(내담자)				
		VAL_STD_CRS_CDE		:	$("#selectbox14").val(),			// 상담경로 - 조회조건					
		VAL_CSEL_GRD		:	$("#selectbox15").val(),			// 상담등급 - 조회조건					
		VAL_VOC				:	$("#selectbox20").val(),			// VOC - 조회조건			
		VAL_RE_PROC			:	$("#selectbox").val(),				// 재확인 - 조회조건						TODO 값 확인하기	
		VAL_NGPROC			:	$("#selectbox").val(),				// 업무정직도 - 조회조건					 TODO 값 확인하기			
		VAL_STD_MON_CDE		:	$("#selectbox18").val(),			// 학습개월 - 조회조건					
		VAL_RENEW_POTN		:	$("#selectbox19").val(),			// 복회가능성 - 조회조건					
		// VAL_TB_VENDER		:	$("#selectbox").val(),			// LC_YC - 조회조건							TODO LC, YC, HL 체크분리
		// VAL_LC_MK			:	$("#selectbox").val(),			// 러닝센터 - 조회조건				
		VAL_PROC_DEPT_NM	:	$("#textbox3").val(),				// 처리지점명 - 조회조건(연계부서)					
		VAL_TIME_APPO		:	$("#selectbox").val(),				// 시간약속 - 조회조건						 TODO 값 확인하기				
		VAL_SMS				:	$("#selectbox21").val(),			// 문자발송(SMS) - 조회조건			
		VAL_PRDT_GRP		:	$("#selectbox7").val(),				// 과목군 - 조회조건					
		VAL_LC_NM			:	$("#textbox1").val(),				// 센터명 - 조회조건					
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
 */
const getCsel = () => {

	// 조회데이터 초기화
	grid1.resetData([]);
	grid2.resetData([]);
	$("#form1")[0].reset();
	calendarUtil.setImaskValue("txtPROC_HOPE_DATE", "____-__-__");
	calendarUtil.setImaskValue("txtPROC_DATE", "____-__-__");

	// 조회조건 체크
	let condition = getCselCondition();
	if(!condition) return;

	// 상담조회 api call
	let settings = {
		url: `${API_SERVER}/cns.getCsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		grid1.resetData(data.dsRecv);
	});	
}

/**
 * 상담조회 엑셀저장용
 */
const getCselExcel = () => new Promise((resolve, reject) => {
	// 조회조건 체크
	let condition = getCselCondition();
	if(!condition) return reject("");

	// 상담조회 api call
	let settings = {
		url: `${API_SERVER}/cns.getCselExcel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return reject("");
		return resolve(data.dsRecv);
	});	
});

/**
 * 상담제품 조회
 * @param {object} condition 조회조건
 */
const getCselSubj = condition => {
	if(!condition) return;

	let settings = {
		url: `${API_SERVER}/cns.getCselSubj.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
	}

	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		grid2.resetData(data.dsRecv);

	});	
}

/**
 * 상담 상세정보 세팅
 * @param {object} row
 */
const setCselDetail = row => {

	// 상담제품 grid 조회
	getCselSubj({
		CSEL_DATE	:	row.CSEL_DATE,	// 상담일자
		CSEL_NO		:	row.CSEL_NO,	// 상담번호
		CSEL_SEQ	:	row.CSEL_SEQ,	// 상담순번
	});

	// 상세정보 영역 세팅
	row.PROC_HOPE_DATE = FormatUtil.date(row.PROC_HOPE_DATE || "____-__-__");
	row.PROC_DATE = FormatUtil.date(row.PROC_DATE || "____-__-__");
	grid1.getColumns().forEach(el => $(`#txt${el.name}`).val(row[el.name]));
	calendarUtil.updateImask();

	row.VOC_MK = row.VOC_MK == "1" ? true : false;
	$("#checkbox32").prop("checked", row.VOC_MK);

}

/**
 * 상담조회 엑셀저장용 table 생성
 * @param {object} data 
 * @return table element
 */
const createCselTable = data => {
	const tableEl = $("#cselExcelTable");
	let tableStr = "";

	data.forEach(el => {
		tableStr += `<tr>`;
		tableStr += `<td>${el.CSEL_DATE}</td>`;
		tableStr += `<td>${el.CSEL_NO}</td>`;
		tableStr += `<td>${el.CSEL_SEQ}</td>`;
		tableStr += `<td>${el.CSEL_MK_NM}</td>`;
		tableStr += `<td>${el.NAME}</td>`;
		tableStr += `<td>${el.MBR_ID}</td>`;
		tableStr += `<td>${el.GRADE_NM}</td>`;
		tableStr += `<td>${el.UP_DEPT_NAME_NM}</td>`;
		tableStr += `<td>${el.DEPT_NAME_NM}</td>`;
		tableStr += `<td>${el.CSEL_LTYPE_CDE_NM}</td>`;
		tableStr += `<td>${el.CSEL_MTYPE_CDE_NM}</td>`;
		tableStr += `<td>${el.CSEL_STYPE_CDE_NM}</td>`;
		tableStr += `<td>${el.CSEL_CHNL_MK_NM}</td>`;
		tableStr += `<td>${el.CSEL_TITLE}</td>`;
		tableStr += `<td>${el.CSEL_CNTS}</td>`;
		tableStr += `<td>${el.CSEL_USER_NM}</td>`;
		tableStr += `<td>${el.CSEL_MAN_MK_NM}</td>`;
		tableStr += `<td>${el.FST_CRS_CDE_NM}</td>`;
		tableStr += `<td>${el.LC_MK}</td>`;
		tableStr += `<td>${el.VOC_MK}</td>`;
		tableStr += `<td>${el.PRDT_NAME}</td>`;
		tableStr += `<td>${el.PRDT_EMP_NM}</td>`;
		tableStr += `<td>${el.LC_NAME_NM}</td>`;
		tableStr += `<td>${el.YC_MK}</td>`;
		tableStr += `</tr>`;
	});

	tableEl.find("tbody").empty().append(tableStr);
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
	// const TestRecordId  = "202009101330577815";
	const rowKey = grid1.getFocusedCell().rowKey;
	const recordId = grid1.getFormattedValue(rowKey, "RECORD_ID");
	recordPlay(recordId);
}
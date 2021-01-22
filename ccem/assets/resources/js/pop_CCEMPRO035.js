var topbarObject;

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

	topbarObject = opener;
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
			{ header: '녹취ID',                         name: "RECORD_ID",             width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
			{ header: '상담입력시각',                   name: "CSEL_STTIME",           width: 150,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 	  formatter: columnInfo => FormatUtil.time(columnInfo.value)	  },
			{ header: 'TICKET ID',                      name: "TICKET_ID",             width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: false, 																	  },
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
			{ header: '이벤트년월',                     name: "CAMP_TG_YM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
			{ header: '이벤트명',                       name: "CAMP_MK_NM",            width: 100,    align: "center",    sortable: true,    ellipsis: true,    hidden: true,  																	 },
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
		grid1.addSelection(ev);

		// 녹취매핑 버튼 disabled 여부
		// TODO 자신의 상담건 가능 and 사용자레벨 3이하 가능
		$("#button4").prop("disabled", false);

		// 녹취청취 버튼 disabled 여부
		// TODO 자신의 상담건 가능 and 사용자레벨 3이하 가능
		if (grid1.getValue(ev.rowKey, "RECORD_ID")) {
			$("#button5").prop("disabled", false);
		} else {
			$("#button5").prop("disabled", true);
		}

		// 결과 버튼 disabled 여부
		const proc = grid1.getValue(ev.rowKey, "PROC_MK");
		if(proc == "2" || proc == "3" || proc == "4") {	// 2: 상담원처리, 3: 상담연계, 4: 시정처리
			$("#button6").prop("disabled", false);
		}else {
			$("#button6").prop("disabled", true);
		}

		// 상담/입회수정 버튼 disabled 여부
		// TODO 자신의 상담건 가능 and 사용자레벨 3이하 가능
		$("#button7").prop("disabled", false);

		// 삭제 버튼 disabled 여부
		// TODO 사용자레벨 3이하 가능
		$("#button8").prop("disabled", false);

		setCselDetail(grid1.getRow(ev.rowKey));
	});

	grid1.on("click", ev => {
		grid1.clickSort(ev);
	});

	grid1.on("dblclick", ev => {
		// 해당 고객정보로 탑바 고객정보 재조회
		topbarObject.onAutoSearch(grid1.getValue(ev.rowKey, "CUST_ID"));
	});

	grid1.on("onGridUpdated", () => {

		$("#textbox4").val(grid1.getPaginationTotalCount());	// 조회건수

		// 조회 결과가 없으면 모두 disabled
		if(!grid1.focus(0)) {
			$("#button4").prop("disabled", true);	// 녹취매핑
			$("#button5").prop("disabled", true);	// 녹취청취
			$("#button6").prop("disabled", true);	// 결과
			$("#button7").prop("disabled", true);	// 상담/입회수정
			$("#button8").prop("disabled", true);	// 삭제
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
			{ header: '제품코드', 			 name: "PRDT_ID", 		 align: "center", sortable: true, ellipsis: true, hidden: true,  },
			{ header: '제품명', 			 name: "PRDT_NAME", 	 align: "center", sortable: true, ellipsis: true, hidden: false, },
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
		const settings = {
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
		const settings = {
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
 * 상담조회 value check
 * @return 조회조건
 */
const getCselCondition = () => {

	const checkVal = "Y", uncheckVal = "N";

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
	const condition = getCselCondition();
	if(!condition) return;

	// 상담조회 api call
	const settings = {
		url: `${API_SERVER}/cns.getCsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg: "상담조회중 오류가 발생하였습니다.",
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
	const condition = getCselCondition();
	if(!condition) return reject("");

	// 상담조회 api call
	const settings = {
		url: `${API_SERVER}/cns.getCselExcel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg: "상담조회중 오류가 발생하였습니다.",
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

	const settings = {
		url: `${API_SERVER}/cns.getCselSubj.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg:  "상담조회중 오류가 발생하였습니다.",
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
	// const TestRecordId  = "202009101330577815";
	const rowKey = grid1.getSelectedRowKey();
	const recordId = grid1.getValue(rowKey, "RECORD_ID");
	recordPlay(recordId);
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

	if (opener.PopupUtil.contains("CCEMPRO022")) {
		alert("상담등록 또는 입회등록 창을 닫고 작업하셔야 합니다.");
		return;
	}

	const rowKey = grid1.getSelectedRowKey();
	const proc = grid1.getValue(rowKey, "PROC_MK");

	switch (proc) {
		case "6":
			PopupUtil.open("CCEMPRO022", 1175, 655, "#tchrIntrdTab");	// 선생님소개 탭
			break;
		case "5":
			PopupUtil.open("CCEMPRO022", 1175, 655, "#entrRgtrTab");	// 입회등록 탭
			break;
		default:
			PopupUtil.open("CCEMPRO022", 1175, 655, "#counselRgtrTab");	// 상담등록 탭
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
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg: "상담정보 삭제중 오류가 발생하였습니다.",
	}

	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		alert("정상적으로 삭제 되었습니다.");
		getCsel();
	});
}
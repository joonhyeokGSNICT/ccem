let grid1, grid2, grid3, grid4, grid5;
let prodList;	// 과목리스트

$(function () {

	// select tab
	let hash = window.location.hash;
	if (hash === "#counselRgtrTab") $("#counselRgtrNav").click();
	else if (hash === "#entrRgtrTab") $("#entrRgtrNav").click();
	else if (hash === "#tchrIntrdTab") $("#tchrIntrdNav").click();

	// insert hash
	$('.nav-link').on('click', ev => window.location.hash = ev.target.hash);

	// grid refreshLayout
	$('.nav-link').on('shown.bs.tab', ev => refreshGrid(ev.target.id));

	// create calendar
	$(".calendar").each((i, el) => calendarUtil.init(el.id));
	calendarUtil.init("calendar2", { drops: "up" });
	calendarUtil.init("calendar5", { opens: "center" });

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	// 날짜와 시간 초기값 세팅
	$("#calendar1").val(getDateFormat());
	$("#calendar2").val(getDateFormat());
	$(".imask-date-up").val(getDateFormat());
	$("#time1").val(getTimeFormat());

	createGrids();
	getCodeList()
	getProd();


});

/**
 * 상담등록에서 사용하는 모든 Grid를 생성합니다.
 */
const createGrids = () => {
	// 상담등록 > 과목 grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 283,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
				minWidth: 30,
			},
			{
				type: 'checkbox',
				header: " ",
				minWidth: 30,
			},
		],
		columns: [
			{
				header: '과목',
				name: 'PRDT_NAME',
				minWidth: 142,
				align: "left",
				sortable: true,
				ellipsis: true,
				filter: "text",
			},
			{
				header: '과목군코드',
				name: 'PRDT_GRP',
				width: 50,
				align: "left",
				sortable: true,
				ellipsis: true,
				filter: "text",
			},
		],
	});
	grid1.on('click', (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
		grid1.clickCheck(ev);
	});
	grid1.on("check", ev => {
		checkProd(grid1, grid2);
	});
	grid1.on("uncheck", ev => {
		checkProd(grid1, grid2);
	});

	// 상담등록 > 상담과목 grid
	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
				minWidth: 30,
			}
		],
		columns: [
			{
				header: '상담과목',
				name: 'PRDT_NAME',
				align: "left",
				sortable: true,
				ellipsis: true,
			}
		],
	});
	grid2.on('click', (ev) => {
		grid2.addSelection(ev);
		grid2.clickSort(ev);
	});

	// 상담등록 > 학습중인과목 grid
	grid3 = new Grid({
		el: document.getElementById('grid3'),
		bodyHeight: 80,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
			{
				header: '제품',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '선생님',
				name: 'name2',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '팀장',
				name: 'name3',
				align: "center",
				sortable: true,
				ellipsis: true,
			}
		],
	});
	grid3.on('click', (ev) => {
		grid3.addSelection(ev);
		grid3.clickSort(ev);
	});

	// 입회등록 > 과목 grid
	grid4 = new Grid({
		el: document.getElementById('grid4'),
		bodyHeight: 283,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
				minWidth: 30,
			},
			{
				type: 'checkbox',
				header: " ",
				minWidth: 30,
			},
		],
		columns: [
			{
				header: '과목',
				name: 'PRDT_NAME',
				minWidth: 142,
				align: "left",
				sortable: true,
				ellipsis: true,
				filter: "text",
			},
			{
				header: '과목군코드',
				name: 'PRDT_GRP',
				width: 50,
				align: "left",
				sortable: true,
				ellipsis: true,
				filter: "text",
			},
		],
	});
	grid4.on('click', (ev) => {
		grid4.addSelection(ev);
		grid4.clickSort(ev);
		grid4.clickCheck(ev);
	});
	grid4.on("check", ev => {
		checkProd(grid4, grid5);
	});
	grid4.on("uncheck", ev => {
		checkProd(grid4, grid5);
	});

	// 입회등록 > 입회과목 grid
	grid5 = new Grid({
		el: document.getElementById('grid5'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
				minWidth: 30,
			}
		],
		columns: [
			{
				header: '입회과목',
				name: 'PRDT_NAME',
				align: "left",
				sortable: true,
				ellipsis: true,
			}
		],
	});
	grid5.on('click', (ev) => {
		grid5.addSelection(ev);
		grid5.clickSort(ev);
	});
}

/**
 * 그리드 레이아웃을 새로 고칩니다. 숨겨진 상태에서 그리드를 렌더링 한 경우이 방법을 사용합니다.
 * @param {string} key - nav id
 */
const refreshGrid = (key) => {
	switch (key) {
		case "counselRgtrNav":	// 상담등록
			grid1.refreshLayout();
			grid2.refreshLayout();
			grid3.refreshLayout();
			break;
		case "entrRgtrNav":      // 입회등록
			grid4.refreshLayout();
			grid5.refreshLayout();
			break;
		case "tchrIntrdNav":	 // 선생님소개
			break;
		default:
			grid1.refreshLayout();
			grid2.refreshLayout();
			grid3.refreshLayout();
			grid4.refreshLayout();
			grid5.refreshLayout();
			break;
	}
}

/**
 * key 값에 따라 해당 팝업을 오픈합니다.
 * @param {string} key
 */
const openPopup = (key) => {
	switch (key) {
		case "CCEMPRO023":	// 개인정보동의신청
			PopupUtil.open(key, 594, 670);
			break;
		case "CCEMPRO024":	// 고객직접퇴회
			PopupUtil.open(key, 663, 705);
			break;
		case "CCEMPRO025":	// 재통화예약
			PopupUtil.open(key, 536, 330);
			break;
		case "CCEMPRO028":	// 상담연계
			PopupUtil.open(key, 830, 555);
			break;
		case "CCEMPRO029":	// 관계회원
			PopupUtil.open(key, 728, 410);
			break;
		case "CCEMPRO030":	// 결과등록
			if ($("#selectbox1").val() === "2")
				PopupUtil.open("CCEMPRO095", 1110, 603);
			else
				PopupUtil.open(key, 1098, 810);
			break;
		case "CCEMPRO033":	// 고객조회
			PopupUtil.open(key, 1184, 650);
			break;
		case "CCEMPRO034":	// 선생님조회
			PopupUtil.open("CCEMPRO033", 1184, 650, "#counselMain_teacherSearchTab");
			break;
		case "CCEMPRO042": // 분류
			PopupUtil.open(key, 870, 610);
			break;
		default:
			break;
	}
}

/**
 * 과목검색
 * @param {object} grid grid1, grid4
 * @param {string} column PRDT_NAME, PRDT_GRP
 * @param {string} keyword
 */
const searchProd = (grid, column, keyword) => {

	// grid.unfilter();
	// grid.filter(column, [{ code: 'contain', value: keyword }]);

	// filter
	keyword = keyword.toUpperCase();
	let data = prodList.filter(el => (el[column].toUpperCase()).includes(keyword));

	// delete rowKey
	data = data.map(el => {
		return {
			PRDT_CDE: 	el.PRDT_CDE,
			PRDT_GRP: 	el.PRDT_GRP,
			PRDT_GRPNM: el.PRDT_GRPNM,
			PRDT_ID: 	el.PRDT_ID,
			PRDT_NAME: 	el.PRDT_NAME,
			PRDT_SEQ: 	el.PRDT_SEQ,
			USE: 		el.USE,
			USE_FLAG: 	el.USE_FLAG
		};
	});

	grid.resetData(data);

}

/**
 * 과목선택
 * @param {object} fromGrid grid
 * @param {object} toGrid grid
 */
const checkProd = (fromGrid, toGrid) => {

	// get checked rows
	let data = fromGrid.getCheckedRows();

	// delete rowKey
	data.map(el => {
		return {
			PRDT_CDE: 	el.PRDT_CDE,
			PRDT_GRP: 	el.PRDT_GRP,
			PRDT_GRPNM: el.PRDT_GRPNM,
			PRDT_ID: 	el.PRDT_ID,
			PRDT_NAME: 	el.PRDT_NAME,
			PRDT_SEQ: 	el.PRDT_SEQ,
			USE: 		el.USE,
			USE_FLAG: 	el.USE_FLAG
		};
	});

	toGrid.resetData(data);

}

/**
 * api 오류 체크
 * @param {object} response 
 * @param {object} settings 
 */
const checkApi = (response, settings) => {
	if (response.errcode != "0") {
		if(typeof client != 'undefined') {
			let errMsg = `서버에서 오류가 발생하였습니다.<br><br>오류코드 : ${response.errcode}<br>오류메시지 : ${response.errmsg}<br>호출서비스 : ${settings.url}`;
			client.invoke("notify", errMsg, "error", 60000);
		}
		else {
			let errMsg = `서버에서 오류가 발생하였습니다.\n\n오류코드 : ${response.errcode}\n오류메시지 : ${response.errmsg}\n호출서비스 : ${settings.url}`
			alert(errMsg);
		}
		return false;
	}
	return true;
}

/**
 * 날짜계산 함수
 * @param {string} type year, month, day
 * @param {number} num 
 */
const getDateFormat = (type, num) => {
    let date = new Date();
    if (typeof type == "string" && typeof num == "number") {
        if (type == "year") {
            date.setFullYear(date.getFullYear() + num);
        } else if (type == "month") {
            date.setMonth(date.getMonth() + num);
        } else if (type == "day") {
            date.setDate(date.getDate() + num);
        }
    }
    let y = date.getFullYear();
    let m = ("0" + (date.getMonth() + 1)).slice(-2);
    let d = ("0" + date.getDate()).slice(-2);
    return y + "-" + m + "-" + d;
}

/**
 * 
 */
const getTimeFormat = () => {
	let today = new Date();   
	let hours = today.getHours(); 
	let minutes = today.getMinutes();
	let seconds = today.getSeconds();
	let milliseconds = today.getMilliseconds();
	return `${hours}:${minutes}:${seconds}`;
}

/**
 * 공통코드 조회
 */
const getCodeList = () => {

	let CODE_MK_LIST = ["PRDT_GRP",];	// 과목군

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
					$(`select[name='${codeName}']`).append(new Option(code.CODE_NAME, code.CODE_ID));
				});
			}
		});
	});

}

/**
 * 상담 과목 리스트 조회
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
	$.ajax(settings).done((data) => {
		if (checkApi(data, settings)) {
			prodList = data.dsRecv;
			grid1.resetData(data.dsRecv);
			grid4.resetData(data.dsRecv);
		}
	});
}


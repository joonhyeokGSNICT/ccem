let grid;
let cselGrid, rowKey;	// 상담정보 Grid

$(function () {

	// 초기값 세팅
	if (window.opener) {
		cselGrid = opener.grid1;
		rowKey = cselGrid.getFocusedCell().rowKey;
		$("#calendar1").val(cselGrid.getFormattedValue(rowKey, "CSEL_DATE"));	// 상담일자
		$("#calendar2").val(cselGrid.getFormattedValue(rowKey, "CSEL_DATE"));	// 상담일자
		$("#textbox8").val(cselGrid.getFormattedValue(rowKey, "CSEL_DATE"));	// 상담일자
		$("#textbox1").val(cselGrid.getFormattedValue(rowKey, "CSEL_NO"));	// 상담번호		
		$("#textbox2").val(cselGrid.getFormattedValue(rowKey, "CSEL_SEQ"));	// 상담순번
		$("#textbox3").val(cselGrid.getFormattedValue(rowKey, "NAME"));		// 성명		
		$("#textbox4").val(cselGrid.getFormattedValue(rowKey, "CUST_ID"));	// 고객번호
		$("#textbox5").val(cselGrid.getFormattedValue(rowKey, "RECORD_ID"));	// 녹취키코드					
		$("#textbox6").val(cselGrid.getFormattedValue(rowKey, "CALL_STTIME"));// 통화시작시각				
		$("#textbox7").val(cselGrid.getFormattedValue(rowKey, "CALL_EDTIME"));// 통화종료시각				
	}

	// create calendar
	$(".calendar").each((i, el) => calendarUtil.init(el.id));

	// input mask
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	createGrids();
	getBadRecord();

});

const createGrids = () => {

	// 녹취LIST grid
	grid = new Grid({
		el: document.getElementById('grid'),
		bodyHeight: 322,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", },
		],
		columnOptions: {
			minWidth: 50,
			resizable: true,
			frozenCount: 4,
			frozenBorderWidth: 0
		},
		columns: [
			{ header: "녹취ID",        name: "RECORD_ID",       width: 150,      align: "center",    sortable: true,    ellipsis: true,   																}, 
			{ header: "녹취일자",       name: "RECORD_STDATE",   width: 100,      align: "center",    sortable: true,    ellipsis: true,    formatter: columnInfo => FormatUtil.date(columnInfo.value)	},
			{ header: "시작시간",       name: "RECORD_STTIME",   width: 100,      align: "center",    sortable: true,    ellipsis: true,  	formatter: columnInfo => FormatUtil.time(columnInfo.value)	},
			{ header: "종료시간",       name: "RECORD_EDTIME",   width: 100,      align: "center",    sortable: true,    ellipsis: true,  	formatter: columnInfo => FormatUtil.time(columnInfo.value)	},
			{ header: "전화번호",       name: "TELPNO",          width: 100,      align: "center",    sortable: true,    ellipsis: true,  																},
			{ header: "상담일자",       name: "CSEL_DATE",       width: 100,      align: "center",    sortable: true,    ellipsis: true,  	formatter: columnInfo => FormatUtil.date(columnInfo.value)	},
			{ header: "번호",           name: "CSEL_NO",         width: 100,      align: "right",     sortable: true,    ellipsis: true,  																},
			{ header: "고객번호",        name: "CUST_ID",        width: 100,      align: "center",    sortable: true,    ellipsis: true,  																},
			{ header: "고객명",          name: "NAME",           minWidth: 100,   align: "center",    sortable: true,    ellipsis: true,  																},
		],					
	});
	grid.on("focusChange", ev => {
		grid.addSelection(ev);
	});
	grid.on('click', ev => {
		grid.clickSort(ev);
	});
	grid.on("dblclick", ev => {

		// 녹취ID 더블클릭시 녹취청취 실행
		if(ev.columnName == "RECORD_ID") {
			const recordId = grid.getFormattedValue(ev.rowKey, "RECORD_ID");
			recordPlay(recordId);
			return;
		}
		
		// 현 상담정보 세팅
		$("#textbox5").val(grid.getFormattedValue(ev.rowKey, "RECORD_ID"));
		$("#textbox6").val(grid.getFormattedValue(ev.rowKey, "RECORD_STTIME"));
		$("#textbox7").val(grid.getFormattedValue(ev.rowKey, "RECORD_EDTIME"));
		$("#textbox6").prop("readonly", $("#textbox6").val().length != 0);
		$("#textbox7").prop("readonly", $("#textbox7").val().length != 0);
		$("#button3").prop("disabled", false);	// 저장버튼 활성화

	});
	grid.on("onGridUpdated", () => {
		grid.focus(0);
	});
}

/**
 * 녹취 정보 조회
 */
const getBadRecord = () => {
	let sdate = $("#calendar1").val().replace(/[^0-9]/gi, '');
	let edate = $("#calendar2").val().replace(/[^0-9]/gi, '');
	sdate = sdate.length === 8 ? sdate : "";
	edate = edate.length === 8 ? edate : "";
	let userId = cselGrid ? cselGrid.getFormattedValue(rowKey, "CSEL_USER_ID") : "";
	let dateExist = $("#checkbox1").is(":checked") ? "1" : "0";

	let settings = {
		url: `${API_SERVER}/cns.getBadRecord.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
				RECORD_STDATE_FROM	: sdate, 		// 조회 시작 일자
				RECORD_STDATE_TO	: edate, 		// 조회 종료 일자
				USER_ID				: userId, 		// 상담원ID
				CHK_DATE_EXIST		: dateExist,	// 비 매핑 조회 여부(0:조회, 1:미조회)
			}],
		}),
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		grid.resetData(data.dsRecv);
	});
}

/**
 * 녹취청취
 */
const onRecordPlay = () => {
	// const TestRecordId  = "202009101330577815";
	const rowKey = grid.getFocusedCell().rowKey;
	const recordId = grid.getFormattedValue(rowKey, "RECORD_ID");
	recordPlay(recordId);
}

/**
 * 녹취매핑정보 저장 value check
 */
const upBadRecordCondition = () => {

	let data = {
		RECORD_ID	:	$("#textbox5").val(), 		// 녹취키번호
		CALL_STTIME	:	$("#textbox6").val().replace(/[^0-9]/gi, ''), // 녹취시작시간
		CALL_EDTIME	:	$("#textbox7").val().replace(/[^0-9]/gi, ''), // 녹취종료시간
		CSEL_DATE	:	$("#textbox8").val().replace(/[^0-9]/gi, ''), // 상담일자
		CSEL_NO		:	$("#textbox1").val(), 		// 상담번호
	};

	// validation check
	if (data.CSEL_DATE.length != 8) {
		alert("상담일자가 올바르지 않습니다.");
		return;
	}
	if (data.CALL_STTIME.length != 6) {
		alert("통화시작시간을 입력하세요.");
		$("#textbox6").focus();
		return false;
	}
	if (data.CALL_EDTIME.length != 6) {
		alert("통화종료시간을 입력하세요.");
		$("#textbox7").focus();
		return false;
	}
	if (data.CALL_STTIME > data.CALL_EDTIME) {
		alert("통화종료시간이 통화시작시간보다 이전입니다.");
		$("#textbox7").focus();
		return false;
	}

	return data;
}

/**
 * 녹취매핑정보 저장
 */
const upBadRecord = () => {
	let condition = upBadRecordCondition();
	if(!condition) return;

	let settings = {
		url: `${API_SERVER}/cns.upBadRecord.do`,
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
		alert("정상적으로 저장 되었습니다.");
	});
}
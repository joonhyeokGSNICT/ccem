let grid1, grid2;
let prods = [];		// 과목리스트
let cselType = {};	// 분류코드

$(function(){

	// create calendar
	$(".calendar").each((i, el) => calendarUtil.init(el.id));

	// 상담조회 > 상담조회 리스트 grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 200,
		pageOptions: {
		  perPage: 7,
		},
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
			{
				header: '상담일자',
				name: 'name1',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '접수',
				name: 'name2',
				width: 60,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담채널',
				name: 'name3',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담구분',
				name: 'name4',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원명',
				name: 'name5',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '회원번호',
				name: 'name6',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '통화시각',
				name: 'name7',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '상담시간',
				name: 'name8',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '처리시간',
				name: 'name9',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '학년',
				name: 'name10',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '본부',
				name: 'name11',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '사업국',
				name: 'name12',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			},
			{
				header: '센터',
				name: 'name13',
				width: 100,
				align: "center",
				sortable: true,
				ellipsis: true,
			}
		],
	});
	grid1.on("click", (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
	});

	// 상담조회 > 상담제품 리스트 grid
	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 97,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
			{
				header: '상담제품',
				name: 'name1',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
		],
	});
	grid2.on("click", (ev) => {
		grid2.addSelection(ev);
		grid2.clickSort(ev);
	});

	getCodeList();	
	getProd();
	// getUser(); // TODO 조회데이터 없음
	getCselType();

});

/**
 * 과목검색
 * @param {string} keyword
 */
const filterProd = keyword => {

	keyword = keyword.toUpperCase();
	let data = prods.filter(el => (el.PRDT_GRP.toUpperCase()).includes(keyword));

	$("#selectbox1").empty();
	data.forEach(el => $("#selectbox1").append(new Option(`[${el.PRDT_ID}] ${el.PRDT_NAME}`, el.PRDT_ID)));

}

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
					let text = (codeName == "STD_MON_CDE" || codeName == "RENEW_POTN") ? 
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

		let users = data.dsRecv;
		users.forEach(el => $("#selectbox2").append(new Option(el.USER_NAME, el.USER_ID)));
		
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
 * 상담조회
 */
const getCsel = () => {
	let settings = {
		url: `${API_SERVER}/cns.getCsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
				CHK_DATE			:	"",	// 상담일자  - 체크여부				
				CHK_FILLER_1		:	"",	// 필러1 - 체크여부					
				CHK_TRANS_MK		:	"",	// 연계여부 - 체크여부					
				CHK_TB_PROD			:	"",	// 과목코드 - 체크여부				
				CHK_USER_GRP_CDE	:	"",	// 상담원그룹 - 체크여부						
				CHK_CSEL_MK			:	"",	// 상담구분 - 체크여부				
				CHK_PROC_MK			:	"",	// 처리구분 - 체크여부				
				CHK_PROC_STS_MK		:	"",	// 처리상태구분 - 체크여부					
				CHK_TB_USER			:	"",	// 상담원 - 체크여부				
				CHK_DEPT_NM			:	"",	// 지점명 - 체크여부				
				CHK_DIV_CDE			:	"",	// 본부코드 - 체크여부				
				CHK_CSEL_CHNL_MK	:	"",	// 상담채널 - 체크여부						
				CHK_CSEL_RST_MK		:	"",	// 상담결과 - 체크여부					
				CHK_CSEL_LTYPE		:	"",	// 대분류 콤보 - 체크여부					
				CHK_CSEL_MTYPE		:	"",	// 중분류 콤보 - 체크여부					
				CHK_CSEL_STYPE		:	"",	// 소분류 콤보 - 체크여부					
				CHK_REFUND_FLAG		:	"",	// 환불승인상태 - 체크여부					
				CHK_STD_CRS_CDE		:	"",	// 상담경로 - 체크여부					
				CHK_CSEL_GRD		:	"",	// 상담등급 - 체크여부					
				CHK_VOC				:	"",	// VOC - 체크여부			
				CHK_RE_PROC			:	"",	// 재확인 - 체크여부				
				CHK_NGPROC			:	"",	// 업무정직도 - 체크여부				
				CHK_STD_MON_CDE		:	"",	// 학습개월 - 체크여부					
				CHK_RENEW_POTN		:	"",	// 복회가능성 - 체크여부					
				CHK_TB_VENDER		:	"",	// LC/YC - 체크여부					
				CHK_LC_MK			:	"",	// 러닝센터 - 체크여부				
				CHK_PROC_DEPT_NM	:	"",	// 처리지점명 - 체크여부						
				CHK_TIME_APPO		:	"",	// 시간약속 - 체크여부					
				CHK_SMS				:	"",	// 문자발송(SMS) - 체크여부			
				CHK_PRDT_GRP		:	"",	// 과목군 - 체크여부					
				VAL_STDATE			:	"",	// 상담일자FROM - 조회조건				
				VAL_EDDATE			:	"",	// 상담일자TO - 조회조건				
				VAL_TRANS_MK		:	"",	// 연계여부 - 조회조건					
				VAL_TB_PROD			:	"",	// 과목코드 - 조회조건				
				VAL_USER_GRP_CDE	:	"",	// 상담원그룹 - 조회조건													
				VAL_CSEL_MK			:	"",	// 상담구분 - 조회조건			
				VAL_PROC_MK			:	"",	// 처리구분 - 조회조건			
				VAL_PROC_STS_MK		:	"",	// 처리상태구분 - 조회조건				
				VAL_TB_USER			:	"",	// 상담원 - 조회조건			
				VAL_DEPT_NM			:	"",	// 지점명 - 조회조건			
				VAL_DIV_CDE			:	"",	// 본부코드 - 조회조건			
				VAL_CSEL_CHNL_MK	:	"",	// 상담채널 - 조회조건						
				VAL_CSEL_RST_MK		:	"",	// 상담결과 - 조회조건					
				VAL_CSEL_LTYPE		:	"",	// 대분류 콤보 - 조회조건					
				VAL_CSEL_MTYPE		:	"",	// 중분류 콤보 - 조회조건					
				VAL_CSEL_STYPE		:	"",	// 소분류 콤보 - 조회조건					
				VAL_REFUND_FLAG		:	"",	// 환불승인상태 - 조회조건					
				VAL_STD_CRS_CDE		:	"",	// 상담경로 - 조회조건					
				VAL_CSEL_GRD		:	"",	// 상담등급 - 조회조건					
				VAL_VOC				:	"",	// VOC - 조회조건			
				VAL_RE_PROC			:	"",	// 재확인 - 조회조건				
				VAL_NGPROC			:	"",	// 업무정직도 - 조회조건				
				VAL_STD_MON_CDE		:	"",	// 학습개월 - 조회조건					
				VAL_RENEW_POTN		:	"",	// 복회가능성 - 조회조건					
				VAL_TB_VENDER		:	"",	// LC_YC - 조회조건					
				VAL_LC_MK			:	"",	// 러닝센터 - 조회조건				
				VAL_PROC_DEPT_NM	:	"",	// 처리지점명 - 조회조건						
				VAL_TIME_APPO		:	"",	// 시간약속 - 조회조건					
				VAL_SMS				:	"",	// 문자발송(SMS) - 조회조건			
				VAL_PRDT_GRP		:	"",	// 과목군 - 조회조건					
				CHK_LC_NM			:	"",	// 센터명 - 체크여부				
				VAL_LC_NM			:	"",	// 센터명 - 조회조건					
			 }],
		}),
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		

	});	
}
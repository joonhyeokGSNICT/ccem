var topbarObject;		// tobar window
var topbarClient;		// tobar client
var sidebarClient;		// sidebar client
var currentUser;		// 현재 사용중인 유저의 정보(ZENDESK)
var codeData = [];		// 공통코드-전체
var prods	 = [];		// 과목리스트

/**
 * 상담 과목 리스트 조회
 * @param {object} grid grid1, grid4
 */
const getProd = (grid) => {
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
		errMsg: "상담과목 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		prods = data.dsRecv;
		grid.resetData(data.dsRecv);
	});
}

/**
 * 과목검색
 * @param {object} grid grid1, grid4
 * @param {string} column PRDT_NAME, PRDT_GRP
 * @param {string} keyword
 */
const searchProd = (grid, column, keyword) => {

	// filter
	keyword = keyword.toUpperCase();
	let data = prods.filter(el => (el[column].toUpperCase()).includes(keyword));

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

	// checked check
	let checkedGrid;
	if (grid.el.id === "grid1") checkedGrid = grid2;
	else if (grid.el.id === "grid4") checkedGrid = grid5;

	if (checkedGrid) {
		let checkedData = checkedGrid.getData();
		checkedData = checkedData.map(el => el.PRDT_ID);
		
		const gridData = grid.getData();
		gridData.forEach(el => {
			if(checkedData.includes(el.PRDT_ID)) {
				grid.check(el.rowKey);
			}
		});
	}

}

/**
 * 과목선택
 * @param {object} grid 
 * @param {object} data 
 */
const checkProd = (grid, data) => {

	// 중복체크
	let gridData = grid.getData();
	for(let row of gridData) {
		if(data.PRDT_ID == row.PRDT_ID) return;
	}
	
	grid.appendRow(data);
	
	// sort
	let sortKey = "PRDT_SEQ";
	gridData = grid.getData();
	gridData.sort((a, b) => {
		return a[sortKey] < b[sortKey] ? -1 :
					a[sortKey] > b[sortKey] ? 1 : 0;
	});

	// delete rowKey
	gridData = gridData.map(el => {
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

	grid.resetData(gridData);
}

/**
 * 과목선택 해제
 * @param {object} grid 
 * @param {object} data 
 */
const uncheckProd = (grid, data) => {

	let id = data.PRDT_ID;
	let gridData = grid.getData();

	for (let row of gridData) {
		if (row.PRDT_ID == id) {
			grid.removeRow(row.rowKey);
			break;
		}
	}

}

/**
 * 병행과목코드의 PLURAL_PRDT_LIST로 grid 체크하는 함수
 * - as-is : comm.js.gf_setPlProd()
 * @param {object} grid grid1, grid4
 * @param {string} data PLURAL_PRDT_LIST
 */
const setPlProd = (grid, data) => {
	const checkeds = data ? data.split("_") : "";
	const gridData = grid.getData();

	if(checkeds.length == 0) {
		gridData.forEach(el => grid.uncheck(el.rowKey));
		return;
	}

	gridData.forEach(el => {
		if (checkeds.includes(el.PRDT_ID)) {
			grid.check(el.rowKey);
		} else {
			grid.uncheck(el.rowKey);
		}
	});
}

/**
 * 선택된 과목들을 과목코드로 sorting하여 병행과목리스트 반환. 
 * - as-is : com.js.gf_getPlProd()
 * @param {object} grid grid2, grid5
 * @returns {object} { ids, names }
 */
const getPlProd = (grid) => {
	const ids = new Array();
	const names = new Array();
	
	const data = grid.getData();

	// sort
	data.sort((a, b) => a.PRDT_ID < b.PRDT_ID ? -1 : a.PRDT_ID > b.PRDT_ID ? 1 : 0);

	data.forEach(el => {
		ids.push(el.PRDT_ID);	  // 제품id
		names.push(el.PRDT_NAME); //제품명
	});

	return { ids, names };
}

/**
 * 해당코드의 NAME을 반환.
 * @param {string} mk 코드구분 
 * @param {string} id 코드ID
 */
const findCodeName = (mk, id) => {
	const code = codeData.find(el => el.CODE_MK == mk && el.CODE_ID == id);
	return code ? code.CODE_NAME : "";
}

/**
 * key 값에 따라 해당 팝업을 오픈합니다.
 * @param {string} key
 */
const openPopup = (key) => {
	switch (key) {
		case "CCEMPRO028":	// 상담연계
			PopupUtil.open(key, 830, 555);
			break;
		case "CCEMPRO029":	// 관계회원
			PopupUtil.open(key, 728, 410);
			break;
		case "CCEMPRO030":	// 결과등록
			const PROC_MK = $("#selectbox4").val();
			if (PROC_MK == "3" || PROC_MK == "4") PopupUtil.open(key, 1098, 810);
			else if (PROC_MK == "2") PopupUtil.open("CCEMPRO095", 1110, 603);
			break;
		case "CCEMPRO033":	// 고객조회
			PopupUtil.open(key, 1184, 650);
			break;
		case "CCEMPRO034":	// 선생님조회
			PopupUtil.open("CCEMPRO033", 1184, 650, "#counselMain_teacherSearchTab");
			break;
		default:
			break;
	}
}

/**
 * 사업국/센터/연계부서 팝업
 * - as-is : cns5810.openCOM1300(), openCOM1620(), openCOM1030()
 * @param {number} keyCode 
 */
const openCCEMPRO044 = (keyCode, hash) => {
	if (keyCode == 13) {
		PopupUtil.open("CCEMPRO044", 1145, 475, hash);
	}
}

/**
 * 주소 팝업
 * - as-is : cns5810.openCNS6610()
 * @param {number} keyCode 
 */
function openCCEMPRO043(keyCode){
    if(keyCode == 13){
		PopupUtil.open("CCEMPRO043", 1100, 700);
    }
}

/**
 * 상담 분류 팝업
 * - as-is : cns5810.onCselTypePopUp()
 * @param {number} keyCode 
 */
const openCCEMPRO042 = (keyCode) => {
	if (keyCode == 13) {
		PopupUtil.open("CCEMPRO042", 870, 610);
	}
}
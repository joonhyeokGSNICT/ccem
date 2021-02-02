var grid1;	// 상담등록 > 과목 grid
var grid2;	// 상담등록 > 상담과목 grid
var grid3;	// 상담등록 > 학습중인과목 grid

var DS_COUNSEL = [];	// 상담정보

var DS_DM_RECEIPT  = {};		// DM 사은품 접수 정보 저장 data
var DS_DROP_TEMP2  = {};		// 개인정보동의 정보 저장 data
var DS_DROP_CHG    = {};		// 고객직접퇴회 정보 저장 data
var DS_SCHEDULE	   = {};		// 재통화예약 정보 저장 data

$(function () {
	
	createGrids();
	getProd(grid1);

	// 티켓생성 버튼 
	$("#button10").on("click", ev => {
		loading = new Loading(getLoadingSet('티켓을 생성 중 입니다.'));
		onNewTicket()
			.then( async (data) => { 
				if (data)  {
					await topbarClient.invoke('routeTo', 'ticket', data.ticket.id);	// 티켓오픈
					alert("티켓생성이 완료되었습니다."); 
				}
			})
			.catch((error) => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`티켓생성 중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

	// 저장 버튼
	$("#button8").on("click", ev => {
		loading = new Loading(getLoadingSet('상담정보 저장 중 입니다.'));
		onSave()
			.then((succ) => { if (succ) alert("저장 되었습니다."); })
			.catch((error) => {
				console.error(error);
				const errMsg = error.responseText || error;
				alert(`상담정보 저장중 오류가 발생하였습니다.\n\n${errMsg}`);
			})
			.finally(() => loading.out());
	});

	// 날짜와 시간 초기값 세팅
	$("#textbox27").val(getDateFormat());
	$("#textbox29").val(getTimeFormat());
	$("#calendar2").val(getDateFormat());

	// create calendar
	$(".calendar").each((i, el) => {
		if(el.id === "calendar2") calendarUtil.init(el.id, { drops: "up" });
		else if(el.id === "calendar5") calendarUtil.init(el.id, { opens: "center" });
		else calendarUtil.init(el.id);
	});

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	onStart();

});

/**
 * 상담등록에서 사용하는 모든 Grid를 생성합니다.
 */
const createGrids = () => {
	// 상담등록 > 과목 grid
	grid1 = new Grid({
		el: document.getElementById('grid1'),
		bodyHeight: 310,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum',   header: "NO",   minWidth: 30,},
			{ type: 'checkbox', header: " ",    minWidth: 30,},
		],
		columns: [
			{ header: '제품코드',     name: 'PRDT_ID',      width: 100,  	align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '과목',         name: 'PRDT_NAME',    minWidth: 142,  align: "left", sortable: true, ellipsis: true, hidden: false    },
			{ header: 'CTI제품코드',  name: 'PRDT_CDE',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군코드',   name: 'PRDT_GRP',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군명',     name: 'PRDT_GRPNM',   width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품순번',     name: 'PRDT_SEQ',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '사용여부',     name: 'USE_FLAG',     width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '선택',         name: 'USE',          width: 100,     align: "left", sortable: true, ellipsis: true, hidden: true    },
		],
	});
	grid1.on('click', (ev) => {
		grid1.addSelection(ev);
		grid1.clickSort(ev);
		grid1.clickCheck(ev);
	});
	grid1.on("check", ev => {
		checkProd(grid2, grid1.getRow(ev.rowKey));
	});
	grid1.on("uncheck", ev => {
		uncheckProd(grid2, grid1.getRow(ev.rowKey));
	});

	// 상담등록 > 상담과목 grid
	grid2 = new Grid({
		el: document.getElementById('grid2'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{ type: 'rowNum', header: "NO", minWidth: 30, },
		],
		columns: [
			{ header: '제품코드',     name: 'PRDT_ID',     align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '상담과목',     name: 'PRDT_NAME',   align: "left", sortable: true, ellipsis: true, hidden: false    },
			{ header: 'CTI제품코드',  name: 'PRDT_CDE',    align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군코드',   name: 'PRDT_GRP',    align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품군명',     name: 'PRDT_GRPNM',  align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '제품순번',     name: 'PRDT_SEQ',    align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '사용여부',     name: 'USE_FLAG',    align: "left", sortable: true, ellipsis: true, hidden: true    },
			{ header: '선택',         name: 'USE',         align: "left", sortable: true, ellipsis: true, hidden: true    },
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
			{ type: 'rowNum', header: "NO", },
		],
		columns: [
			{ header: '등록여부', 	    name: 'REG_YN',         align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                    
			{ header: '과목코드', 	    name: 'PRDT_ID',        align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '사번', 	        name: 'EMP_ID',         align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                
			{ header: '제품', 	        name: 'PRDT_NAME',      align: "center", sortable: false,  ellipsis: true,      hidden: false,  },                                                                                                                                                                                        
			{ header: '선생님', 	    name: 'TCHR',           align: "center", sortable: true,   ellipsis: true,      hidden: false,  },                                                                                                                                                                                    
			{ header: '전화번호', 	    name: 'TELPNO',         align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                    
			{ header: '팀장', 	        name: 'TCHR_PART',      align: "center", sortable: false,  ellipsis: true,      hidden: false,  },                                                                                                                                                                                        
			{ header: 'CTI과목코드', 	name: 'PRDT_CDE',       align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                            
			{ header: '핸드폰번호', 	name: 'MOBILNO',        align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                            
			{ header: '본부명', 	    name: 'DIV_NAME',       align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '지점명', 	    name: 'DEPT_NAME',      align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '지역명', 	    name: 'AREA_NAME',      align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '지점코드', 	    name: 'DEPT_ID',        align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '지점 전화번호 ', name: 'TELNO',          align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                 	                                                                                        
			{ header: '본부코드', 	    name: 'DIV_CDE',        align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '지역코드', 	    name: 'AREA_CDE',       align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '교사구분', 	    name: 'TCHR_MK_CDE',    align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                            
			{ header: '지점장사번', 	name: 'DEPT_EMP_ID',    align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                                
			{ header: '센터ID', 	    name: 'LC_ID',          align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                    
			{ header: '센터명', 	    name: 'LC_NAME',        align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                        
			{ header: '센터전화번호', 	name: 'TELPNO_LC',      align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                            
			{ header: '센터장사번', 	name: 'LC_EMP_ID',      align: "center", sortable: false,  ellipsis: true,      hidden: true,   },                                                                                                                                                                                            
			{ header: 'YC여부', 	    name: 'YC_MK',          align: "center", sortable: false,  ellipsis: true,      hidden: true,   },   
		],
	});
	grid3.on('click', (ev) => {
		grid3.addSelection(ev);
		grid3.clickSort(ev);
	});
}

/**
 * 오픈되는 곳에 따라 분기처리
 */
const onStart = () => {

	// init
	$("#selectbox6").val("2");				// 고객반응
	$("#selectbox10").val("99");			// 처리상태
	$("#button4").prop("disabled", true);	// 상담연계
	$("#button5").prop("disabled", true);	// 추가등록
	$("#button6").prop("disabled", true);	// 관계회원
	$("#button7").prop("disabled", true);	// 결과등록

	const opener_name = parent.opener.name;
	const hash = parent.location.hash;

	// 탑바 > 고객정보 > 고객 > 상담등록 버튼으로 오픈
	if (opener_name.includes("top_bar") && hash.includes("by_cust")) {	
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	
		setCodeData();

		// 고객기본정보 조회
		const custId = topbarObject.document.getElementById("custInfo_CUST_ID").value;	// 고객번호
		getBaseData("C", custId);

	}
	// 탑바 > 고객정보 > 선생님 > 상담등록 버튼으로 오픈
	else if (opener_name.includes("top_bar") && hash.includes("by_tchr")) {	
		topbarObject  = parent.opener;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;	
		setCodeData();

		// 고객기본정보 조회
		const empId = topbarObject.document.getElementById("tchrInfo_EMP_ID").value;	// 사원번호
		getBaseData("T", empId);

	} 
	// 상담조회 > 상담/입회수정 버튼으로 오픈
	else if (opener_name.includes("CCEMPRO035")) {	
		topbarObject  = parent.opener.topbarObject;
		topbarClient  = topbarObject.client;
		sidebarClient = topbarObject.sidebarClient;
		currentUser   = topbarObject.currentUserInfo.user;
		codeData 	  = topbarObject.codeData;
		setCodeData();

		const counselGrid = parent.opener.grid1;	// 상담조회 grid
		const rowKey 		= counselGrid.getSelectedRowKey();
		const cselDate 		= counselGrid.getValue(rowKey, "CSEL_DATE");	// 상담일자
		const cselNo 		= counselGrid.getValue(rowKey, "CSEL_NO");		// 상담번호
		const cselSeq 		= counselGrid.getValue(rowKey, "CSEL_SEQ");		// 상담순번
		const ZEN_TICKET_ID = counselGrid.getValue(rowKey, "ZEN_TICKET_ID");	// 티켓ID
		if (ZEN_TICKET_ID) topbarClient.invoke('routeTo', 'ticket', ZEN_TICKET_ID);  // 티켓오픈

		// 상담정보 조회
		calendarUtil.setImaskValue("textbox27", cselDate);
		$("#textbox28").val(cselNo);
		getCounsel(cselSeq);

	}
}

/**
 * 콤보박스 세팅
 * - as-is : cns5810.setCodeData()
 */
const setCodeData = () => {

	const CODE_MK_LIST = [
		"PRDT_GRP",			// 과목군
		"OPEN_GBN",			// 개인정보
		"CSEL_MAN_MK",		// 내담자
		"CSEL_MK",			// 상담구분
		"PROC_MK",			// 처리구분
		"LIMIT_MK",			// 처리시한
		"CUST_RESP_MK", 	// 고객반응
		"CSEL_RST_MK",		// 상담결과
		"STD_CRS_CDE", 		// 상담경로
		"PROC_STS_MK",		// 처리상태
		"CSEL_GRD",			// 상담등급
		"CSEL_CHNL_MK",		// 상담채널
		"GRADE_CDE",		// 학년
		"DM_TYPE_CDE",		// 지급사유
	];

	// get code
	const codeList = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));

	// sorting
	const sortKey = "CODE_ID";
	codeList.sort((a, b) => a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0);

	// create select options
	for (const code of codeList) {

		const codeType = code.CODE_MK;
		const codeNm = code.CODE_NAME;
		const codeVal = code.CODE_ID;

		// filtering
		if (codeType == "DM_TYPE_CDE") { // 지급사유
			if (codeVal == "01" || codeVal == "02" || codeVal == "04" || codeVal == "05") continue;
		}
		if (codeType == "PROC_MK") { // 처리구분
			if (codeVal == "5" || codeVal == "6") continue;
		}

		// set
		$(`select[name='${codeType}']`).append(new Option(codeNm, codeVal));
	}
}

/**
 * 상담등록 기본정보 조회 and 학습중인 제품 조회
 * - as-is : cns5810.onSearchBaseData()
 * @param {string} target 대상구분 ( "C" : 고객, "T" : 선생님 )
 * @param {string} targetId 고객번호 or 사번
 */
var getBaseData = (target, targetId) => {

	let service, condition;

	if (target == "C") {
		service = "/cns.getCust.do";
		condition = { CUST_ID: targetId };
	} else if (target == "T") {
		service = "/cns.getTchr.do";
		condition = { EMP_ID: targetId };
	}

	const settings = {
		url: `${API_SERVER + service}`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [condition],
		}),
		errMsg: "상담등록 기본정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;

		const baseData = data.dsRecv;
		if (baseData.length > 0) {

			const row = baseData[0];
			$("#textbox21").val(row.NAME);			// 고객명, 선생님명
			$("#textbox22").val(row.ID);			// 회원번호, 사원번호
			$("#textbox23").val(row.TELPNO);		// 고객전화번호
			$("#textbox24").val(row.ZIPCDE);		// 고객주소
			$("#textbox25").val(row.ADDR);			// 고객상세주소
			$("#textbox3").val(row.AREA_CDE);		// 지역코드
			$("#textbox4").val(row.AREA_NAME);		// 지역명
			$("#textbox5").val(row.DEPT_ID);   		// 지점코드
			$("#textbox6").val(row.DEPT_NAME);  	// 지점명
			$("#textbox1").val(row.UP_DEPT_ID); 	// 본부코드
			$("#textbox2").val(row.UPDEPTNAME); 	// 본부명
			$("#textbox7").val(row.TELPNO_DEPT);	// 지점전화
			$("#textbox9").val(row.LC_NAME);   		// 센터명
			$("#textbox10").val(row.TELPNO_LC); 	// 센터전화
			$("#selectbox13").val(row.GRADE_CDE);	// 학년코드
			$("#hiddenbox1").val(row.LC_ID);   		// 센터코드		
			$("#hiddenbox2").val(row.MK); 			// 고객구분코드
			$("#hiddenbox3").val(row.DEPT_EMP_ID); 	// 사업국장    
			$("#hiddenbox4").val(row.LC_EMP_ID); 	// 센터장
			$("#hiddenbox6").val(targetId); 		// 고객번호
			$("#hiddenbox11").val("");				// 연계담당자ID
			$("#hiddenbox12").val("");				// 연계담당자이름
			$("#hiddenbox13").val(row.AGE_CDE);		// 연령코드
			$("#hiddenbox14").val(row.DIV_KIND_CDE);// 브랜드ID
			
			setInitCselRstMkDS();	// 상담결과 저장정보 초기화
			onDmReceiptChange();	// DM 사은품접수 저장정보 세팅

			setLable(target);
			getStudy(row.ID);
		}
	});

}

/**
 * 학습중인 제품 조회
 * - as-is : cns5810.onSearchDS_STUDY_NOW()
 * @param {string} id 회원번호
 */
const getStudy = (id) => {
	const settings = {
		url: `${API_SERVER}/cns.getStudy.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ MBR_ID: id }],
		}),
		errMsg: "학습중인 과목 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(data => {
		if (!checkApi(data, settings)) return;
		
		const studyList = data.dsRecv;
		grid3.resetData(studyList);

		// 신규상담일 경우 학습중인 과목을 좌측 상담과목 선택
		const selectSeq = document.getElementById("selectbox14")
		const jobType = selectSeq.options[selectSeq.selectedIndex].dataset.jobType;
		if(jobType == "I") {
			const study_id_arr = studyList.map(el => el.PRDT_ID);
			const study_id_str = study_id_arr.join("_");
			setPlProd(grid1, study_id_str);
		}
	});
}

/**
 * 상담등록 기존 데이타 조회 for update
 * - as-is : cns5810.onSearchDS_COUNSEL()
 * @param {string} sCSEL_SEQ 상담순번
 */
const getCounsel = (sCSEL_SEQ) => {

	const settings = {
		url: `${API_SERVER}/cns.getCounsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
				CSEL_DATE : calendarUtil.getImaskValue("textbox27"), // 상담일자
				CSEL_NO   : $("#textbox28").val(),			     	 // 상담번호
			}],
		}),
		errMsg: "상담등록정보 조회중 오류가 발생하였습니다.",
	}
	$.ajax(settings).done(res => {
		if (!checkApi(res, settings)) return;

		DS_COUNSEL = res.dsRecv; // 상담정보

		if (DS_COUNSEL.length >= 1) {
			
			// 상담순번 세팅
			createSeq($("#selectbox14"), DS_COUNSEL.length);
			$("#selectbox14").val(sCSEL_SEQ);
			const rowIdx  = $("#selectbox14 option:selected").index();
			const rowData = DS_COUNSEL[rowIdx];

			// 티켓ID가 존재하고 추가등록/관계회원이 아닌경우에만 티켓오픈.
			if(rowData.ZEN_TICKET_ID && sCSEL_SEQ == 1) topbarClient.invoke('routeTo', 'ticket', rowData.ZEN_TICKET_ID);

			// 상담과목 선택
			setPlProd(grid1, rowData.PLURAL_PRDT_LIST);	
			
			// 상담정보 세팅
			$("#textbox29").val(rowData.CSEL_STTIME);										// 상담시간
			$("#selectbox15").val(rowData.CSEL_CHNL_MK);		                			// 상담채널구분
			$("#textbox11").val(rowData.PROC_DEPT_ID);										// 직원상담처리지점 (연계부서코드)
			$("#textbox26").val(rowData.PROC_DEPT_NAME);									// 직원상담처리지점명 (연계부서이름)      
			$("#checkbox1").prop("checked", rowData.LC_MK == "Y" ? true : false);			// 러닝센터(LC)  
			$("#checkbox2").prop("checked", rowData.YC_MK == "Y" ? true : false);			// YC
			$("#checkbox3").prop("checked", rowData.HL_MK == "Y" ? true : false);			// HL
			$("#textbox12").val(rowData.CSEL_TITLE);										// 상담제목
			$("#textbox13").val(rowData.CSEL_CNTS);											// 상담상세내용    
			$("#selectbox1").val(rowData.OPEN_GBN);											// 공개여부  (개인정보)    
			$("#selectbox2").val(rowData.CSEL_MAN_MK);										// 내담자구분      
			$("#textbox14").val(rowData.CSEL_LTYPE_CDE);									// 상담대분류코드
			$("#textbox16").val(rowData.CSEL_MTYPE_CDE);			                		// 상담중분류코드
			$("#textbox18").val(rowData.CSEL_STYPE_CDE);									// 상담소분류코드
			$("#textbox15").val(rowData.CSEL_LTYPE_NAME);									// 분류(대) 명
			$("#textbox17").val(rowData.CSEL_MTYPE_NAME);									// 분류(중) 명
			$("#textbox19").val(rowData.CSEL_STYPE_NAME);									// 분류(소) 명
			$("#selectbox3").val(rowData.CSEL_MK);											// 상담구분
			$("#selectbox4").val(rowData.PROC_MK);											// 처리구분
			$("#selectbox5").val(rowData.LIMIT_MK);											// 처리시한구분
			$("#selectbox6").val(rowData.CUST_RESP_MK);										// 고객반응구분
			calendarUtil.setImaskValue("calendar2", rowData.PROC_HOPE_DATE);				// 처리희망일자
			$("#selectbox8").val(rowData.CSEL_RST_MK1);				                		// 상담결과구분
			$("#selectbox9").val(rowData.FST_CRS_CDE);										// 첫상담경로
			$("#selectbox10").val(rowData.PROC_STS_MK);					            		// 처리상태구분
			$("#selectbox11").val(rowData.CSEL_GRD);				                		// 상담등급
			$("#checkbox4").prop("checked", rowData.RE_PROC == "1" ? true : false);			// 재확인여부
			$("#checkbox5").prop("checked", rowData.VOC_MK == "Y" ? true : false);			// VOC
			$("#checkbox6").prop("checked", rowData.RE_CALL_CMPLT == "Y" ? true : false);	// 재통화완료여부
			$("#selectbox16").val(rowData.DM_TYPE_CDE);										// DM종류	(지급사유)
			$("#hiddenbox10").val(rowData.ZEN_TICKET_ID);									// 티켓ID
			$("#hiddenbox5").val(rowData.CSEL_RST_MK1);										// 상담결과구분코드
			$("#hiddenbox9").val(rowData.PROC_STS_MK);					            		// 처리상태구분
			$("#hiddenbox7").val(rowData.DM_MATCHCD);										// DM매치코드
			$("#hiddenbox8").val(rowData.DM_LIST_ID);										// DM목록ID

			setBtnCtrlAtLoadComp();
			
			// 고객 기본정보조회
			const CUST_MK	= rowData.CUST_MK;			// 고객구분
			const target 	= (CUST_MK == "PE" || CUST_MK == "TC") ? "T" : "C"; // C : 고객, T : 선생님
			getBaseData(target, rowData.CUST_ID);

		}

	});
}

/**
 * 고객/선생님에 따른 레이블 설정
 * - as-is : cns5810.setLable()
 * @param {string} target 대상구분 ( "C" : 고객, "T" : 선생님 )
 */
const setLable = (target) => {
	if (target == "T") {
		$("#thNAME").text("선생님명");
		$("#thID").text("사원번호");
	} else {
		$("#thNAME").text("회원명");
		$("#thID").text("회원번호");
	}
}

/**
 * 신규버튼 선택시에 고객 기본정보 초기화
 * - as-is : cns5810.onNewCustInit()
 */
const onNewCustInit = () => {
	$("#textbox21").val("");		// 고객명, 선생님명
	$("#textbox22").val("");		// 회원번호, 사원번호
	$("#textbox23").val("");		// 고객전화번호
	$("#textbox24").val("");		// 고객주소
	$("#textbox25").val("");		// 고객상세주소
	$("#textbox3").val("");   		// 지역코드
	$("#textbox4").val("");   		// 지역명 
	$("#textbox5").val("");   		// 사업국코드 
	$("#textbox6").val("");   		// 사업국명
	$("#textbox1").val("");   		// 본부코드
	$("#textbox2").val("");   		// 본부명
	$("#textbox7").val("");   		// 지점전화
	$("#textbox9").val("");   		// 센터명
	$("#textbox10").val("");  		// 센터전화
	$("#selectbox13").val("00");	// 학년
	$("#hiddenbox1").val(""); 		// 센터코드		
	$("#hiddenbox2").val(""); 		// 고객구분코드
	$("#hiddenbox3").val(""); 		// 지점장번호
	$("#hiddenbox4").val("")  		// 센터장사번
	$("#hiddenbox6").val(""); 		// 고객번호
	$("#checkbox1").prop("checked", false);   	// LC
	$("#checkbox2").prop("checked", false);		// YC
	$("#checkbox3").prop("checked", false);		// HL 
    $("#selectbox9").val("");   	// 상담경로
    $("#textbox11").val("");		// 연계부서코드
	$("#textbox26").val("");		// 연계부서명  
	$("#hiddenbox11").val("");		// 연계담당자ID
	$("#hiddenbox12").val("");		// 연계담당자이름
	$("#hiddenbox13").val("");		// 연령코드
	$("#hiddenbox14").val("");		// 브랜드ID
	setInitCselRstMkDS();			// 상담결과 저장정보
	grid3.clear();			  		// 학습중인 과목
}

/**
 * 추가등록
 */
const addCsel = () => {
	  
	// 상담내용을 초기화.
	$("#textbox13").val("");

	// 상담순번 설정
	const newIdx = $("#selectbox14 option").length + 1;
	const option = new Option(newIdx, newIdx);
	option.dataset.jobType = "I";
	$("#selectbox14").append(option);
	$("#selectbox14").val(newIdx);

	//버튼 비활성화
	$("#button4").prop("disabled", true); // 상담연계
	$("#button5").prop("disabled", true); // 추가등록
	$("#button6").prop("disabled", true); // 관계회원
	$("#button7").prop("disabled", true); // 결과등록

}

/**
 * 추가등록 by 관계회원
 * - as-is : cns5810.onAddCsel()
 * @param {object} data
 */
var addCselByFamily = (data) => {

	const target = "C";		// 대상구분 ( "C" : 고객, "T" : 선생님 )
	const custId = data.CUST_ID;	// 고객번호

	if(custId){
		setLable(target);
		getBaseData(target, custId);
		addCsel();
	}else{
		alert("고객번호가 존재하지 않는 고객입니다.\n\n먼저 고객 정보 등록을 하시기 바랍니다.");
	}
	
}

/**
 * 저장
 * - as-is : cns5810.onSave()
 */
const onSave = async () => {

	// 과목군을 전체로 변경하여 filter 초기화
	$("#selectbox12").val("").trigger("change");

	// 저장구분(I: 신규, U: 수정)
	const selectbox = document.getElementById("selectbox14");
	const selectedSeq = selectbox.value;
	const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;	

	// 상담정보 value check
	const cselData = await getCounselCondition(sJobType);
	if (!cselData) return false;
	const addData = getAddInfoCondition();
	if (!addData) return false;
	const customData  = getCustomData();
	const empData = $("#hiddenbox11").val().split(",");

	let resSave;	// CCEM저장 결과

	// 추가등록 또는 관계회원 신규
	if (sJobType == "I" && selectedSeq > 1) {
		
		// 티켓생성
		const { ticket } = await onNewTicket(DS_COUNSEL[0].ZEN_TICKET_ID);
		if (!ticket) return false;

		// ccem 저장
		cselData.ZEN_TICKET_ID = ticket.id;
		const obData = await getObCondition(cselData.ZEN_TICKET_ID);
		resSave = await saveCounsel(cselData, addData, obData);
	
		// 티켓 업데이트
		cselData.CSEL_NO = resSave.CSEL_NO;
		await updateTicket(cselData, customData, empData);

	// 추가등록 또는 관계회원 수정
	} else if (sJobType == "U" && selectedSeq > 1) {

		// ccem 저장
		const obData = await getObCondition(cselData.ZEN_TICKET_ID);
		resSave = await saveCounsel(cselData, addData, obData);

		// 티켓 업데이트
		await updateTicket(cselData, customData, empData);
		
	// 상담순번이 1이고, 신규 또는 수정일떄.
	} else if (sJobType == "I" || sJobType == "U") {

		// 티켓이 유효한지 체크.
		const ticketCondition = await checkTicket(sJobType, cselData.ZEN_TICKET_ID);
		if (!ticketCondition) return false;

		// ccem 저장
		cselData.ZEN_TICKET_ID = ticketCondition;
		const obData = await getObCondition(cselData.ZEN_TICKET_ID);
		resSave = await saveCounsel(cselData, addData, obData);

		// 티켓필드 입력
		cselData.CSEL_NO = resSave.CSEL_NO;
		await setTicket(cselData, customData, empData);

	} else {
		alert(`저장구분이 올바르지 않습니다.[${sJobType}]\n\n관리자에게 문의하기시 바랍니다.`);
		return false;
	}
	
	// 저장성공후
	$("#textbox28").val(resSave.CSEL_NO); 	// 접수번호 세팅
	getCounsel(selectedSeq);				// 상담 재조회

	return true;

}

/**
 * 상담저장 정보 value check
 * - as-is : cns5810.onValueCheck()
 * @param {string} sJobType 저장구분(I/U/D)
 */
const getCounselCondition = async (sJobType) => {

	const data = {
		ROW_TYPE         : sJobType,             // 저장구분(I/U/D)    
		CSEL_DATE        : calendarUtil.getImaskValue("textbox27"),             // 상담일자           
		CSEL_NO          : $("#textbox28").val(),    							// 상담번호           
		CSEL_SEQ         : $("#selectbox14").val(),  							// 상담순번           
		CUST_ID          : $("#hiddenbox6").val(),   							// 고객번호           
		CUST_MK          : $("#hiddenbox2").val(),   							// 고객구분           
		CSEL_USER_ID     : currentUser.external_id,      				// 상담원id           
		CSEL_STTIME      : $("#textbox29").val(),               				// 상담시작시간       
		CSEL_EDTIME      : "",             // 상담종료시간       
		CSEL_CHNL_MK     : $("#selectbox15").val(),      						// 상담채널구분       
		CSEL_MK          : $("#selectbox3").val(),       						// 상담구분           
		CSEL_LTYPE_CDE   : $("#textbox14").val(),        						// 상담대분류코드     
		CSEL_MTYPE_CDE   : $("#textbox16").val(),        						// 상담중분류코드     
		CSEL_STYPE_CDE   : $("#textbox18").val(),        						// 상담소분류코드     
		CSEL_TITLE       : $("#textbox12").val().trim(),        				// 상담제목           
		CSEL_CNTS        : $("#textbox13").val().trim(),        				// 상담상세내용       
		// OCCUR_DATE       : "",             // 문제발생일자       
		LIMIT_MK         : $("#selectbox5").val(),              				// 처리시한구분       
		PROC_HOPE_DATE   : calendarUtil.getImaskValue("calendar2"),             // 처리희망일자       
		CSEL_MAN_MK      : $("#selectbox2").val(),             					// 내담자구분         
		CUST_RESP_MK     : $("#selectbox6").val(),             					// 고객반응구분       
		// CALL_RST_MK      : "",             // 통화결과구분      (O/B결과) 		
		CSEL_RST_MK1     : $("#selectbox8").val(),             					// 상담결과구분       
		CSEL_RST_MK2     : "",             // 상담결과구분2      
		PROC_MK          : $("#selectbox4").val(),              				// 처리구분           
		DEPT_ID          : $("#textbox5").val(),                				// 관할지점코드   (사업국코드)    
		DIV_CDE          : $("#textbox1").val(),                				// 관할본부코드   (본부코드)
		AREA_CDE         : $("#textbox3").val(),                				// 관할지역코드   (지역코드)
		GRADE_CDE        : $("#selectbox13").val(),             				// 학년코드           
		MOTIVE_CDE       : "",             // 입회사유코드       
		FST_CRS_CDE      : $("#selectbox9").val(),             					// 첫상담경로         
		// MEDIA_CDE     : "",                // 매체구분코드    
		TRANS_DATE       : "",             // 연계일자           
		TRANS_NO         : "",             // 연계번호           
		PROC_STS_MK      : $("#selectbox10").val(),             				// 처리상태구분       
		// VENDER_CDE    : "",                // 동종업체코드    (타학습지)
		// PRDT_ID       : "",                // 동종업체제품코드(제품명)
		WORK_STYL_MK     : "",             // 근무형태구분       
		USER_GRP_CDE     : currentUser.user_fields.user_grp_cde,         // 상담원그룹코드     
		PLURAL_PRDT_ID   : "",             // 병행과목리스트     
		MBR_ID           : $("#textbox22").val(),              					// 회원번호           
		DEPT_EMP_ID      : $("#hiddenbox3").val(),             					// 지점장사번         
		CTI_CHGDATE      : "",             // cti변경일자        
		TO_TEAM_DEPT     : "",             // 지점장부서         
		OPEN_GBN         : $("#selectbox1").val(),             					// 공개여부  (개인정보)         
		VOC_MK           : $("#checkbox5").is(":checked") ? "Y" : "",           // VOC                
		CSEL_GRD         : $("#selectbox11").val(),             				// 상담등급           
		RE_PROC          : $("#checkbox4").is(":checked") ? "1" : "0",          // 재확인여부         
		CALL_STTIME      : "",             // 통화시작시간       
		CALL_EDTIME      : "",             // 통화종료시간       
		// STD_STS       : "",                // 타학습이력학습상
		// STD_MON_CDE   : "",                // 학습개월        
		// RENEW_POTN    : "",                // 복회가능여부    
		LC_MK            : $("#checkbox1").is(":checked") ? "Y" : "",           // 러닝센터(LC)           
		PROC_DEPT_ID     : $("#textbox11").val(),             					// 직원상담 처리지점  (연계부서코드)
		// TIME_APPO     : "",                // 시간약속        
		LC_ID            : $("#hiddenbox1").val(),             					// 센터ID             
		LC_EMP_ID        : $("#hiddenbox4").val(),             					// 센터장사번         
		YC_MK            : $("#checkbox2").is(":checked") ? "Y" : "",           // YC                 
		ZEN_TICKET_ID    : $("#hiddenbox10").val(),             				// 티켓ID             
		HL_MK            : $("#checkbox3").is(":checked") ? "Y" : "",           // HL                 
		PLURAL_PRDT_LIST : "",  			// 병행과목코드리스트 
		PLURAL_PRDT_NAME : "",				// 병행과목코드명     
		ORG_CSEL_RST_MK1 : "",              // ORG상담결과구분    
		RE_CALL_CMPLT    : $("#checkbox6").is(":checked") ? "Y" : "",           // 재통화완료여부     
	}

	// 날짜 및 시간 유효성 체크
	data.CSEL_DATE 		= data.CSEL_DATE.length != 8 ? "" : data.CSEL_DATE;
	data.PROC_HOPE_DATE = data.PROC_HOPE_DATE.length != 8 ? "" : data.PROC_HOPE_DATE;
	data.CSEL_STTIME	= data.CSEL_STTIME.length != 6 ? "" : data.CSEL_STTIME;

	// 병행과목코드리스트 세팅
	const plProd = getPlProd(grid2);
	data.PLURAL_PRDT_LIST = plProd.ids.join("_");
	data.PLURAL_PRDT_NAME = plProd.names.join(",");

	const sLtype = data.CSEL_LTYPE_CDE;
    const sMtype = data.CSEL_MTYPE_CDE;
    const sStype = data.CSEL_STYPE_CDE;
	const sMan_mk = data.CSEL_MAN_MK;

	if (!data.CSEL_TITLE) {
		alert("상담제목으로 입력하여 주십시요.");
		return false;
	}
	if (!data.CSEL_CNTS) {
		alert("상담내용을 입력하여 주십시요.");
		$("#textbox13").focus();
		return false;
	}
	if (data.PLURAL_PRDT_LIST.length > 100) {
		alert("상담제품의 수가 너무 많습니다.");
		return false;
	}
	if (data.PLURAL_PRDT_NAME.length > 1000) {
		alert("상담제품의 수가 너무 많습니다.");
		return false;
	}
	if (data.CSEL_TITLE.length > 100) {
		alert("상담제목은 100Byte를 초과할 수 없습니다.");
		return false;
	}
	if (data.CSEL_CNTS.length > 4000) {
		alert("상담내용은 4000Byte를 초과할 수 없습니다.");
		$("#textbox13").focus();
		return false;
	}
	if (!data.CSEL_LTYPE_CDE) {
		alert("상담분류(대)를 선택하여 주십시요.");
		$("#textbox14").focus();
		return false;
	}
	if (!data.CSEL_MTYPE_CDE) {
		alert("상담분류(중)를 선택하여 주십시요.");
		$("#textbox16").focus();
		return false;
	}
	if (!data.CSEL_STYPE_CDE) {
		alert("상담분류(소)를 선택하여 주십시요.");
		$("#textbox18").focus();
		return false;
	}
	if (!data.CUST_RESP_MK && bIsOB == "N") {
		alert("고객반응을 선택해 주십시요.");
		$("#selectbox6").focus();
		return false;
	}
	if (!data.PROC_STS_MK) {
		alert("처리상태를 선택해 주십시요.");
		$("#selectbox10").focus();
		return false;
	}
	if ((sMan_mk == "04" || sMan_mk == "05" || sMan_mk == "06" || sMan_mk == "07" || sMan_mk == "08" || sMan_mk == "09") && !data.PROC_DEPT_ID) {
		// 내담자가 직원인 경우에는 처리지점 입력
		alert("연계부서를 입력해 주십시요.");
		$("#textbox26").focus();
		return false;
	}
	if ((sMtype == "20508" || sMtype == "40508") && data.RE_PROC == "0") {
		// 연말정산관련 요청 및 문의시에는 재확인 필수 체크
		alert("재확인을 선택해 주십시요.");
		$("#checkbox4").focus();
		return false;
	}

	//상담제품 선택여부 체크
    if (data.PLURAL_PRDT_LIST.length == 0) {

        //시정처리 일때 필수
		if (data.PROC_MK == "4") {
			alert("상담제품을 선택하여 주십시요.");
			return false;
		}

		//상담분류체크-소분류만으로 체크할 경우
		if (sStype == "1010100" || sStype == "1010101" || sStype == "4010100" || sStype == "4010101") {
			alert("상담제품을 선택하여 주십시요.");
			return false;
		}

		//중분류로 체크할경우
		if (sMtype == "10301" ||
			sMtype == "10806" ||
			sMtype == "11508" ||
			sMtype == "20302" ||
			sMtype == "20303" ||
			sMtype == "20305" ||
			sMtype == "20806" ||
			sMtype == "20601" ||
			sMtype == "20808" ||
			sMtype == "21508" ||
			sMtype == "41508" ||
			sMtype == "81508") {
			alert("상담제품을 선택하여 주십시요.");
			return false;
		}

		//대분류로 체크할경우
		switch (sLtype) {
			case "101":
				//중분류가 10102~10121일경우 체크
				if (sMtype >= "10102" && sMtype <= "10121") {
					if (sMtype != "10112" && sStype != "1010401") {
						alert("상담제품을 선택하여 주십시요.");
						return false;
					}
				}
				break;
			case "104":
				//중분류가 10402~10408일경우 체크
				if (sMtype >= "10402" && sMtype <= "10408") {
					if (sMtype != "10406" && sMtype != "10407" && sStype != "1040503") {
						alert("상담제품을 선택하여 주십시요.");
						return false;
					}
				}
				break;
			case "204":
				//중분류가 20402~20408일경우 체크
				if (sMtype >= "20402" && sMtype <= "20408") {
					if (sMtype != "20406" && sMtype != "20407" && sStype != "2040504") {
						alert("상담제품을 선택하여 주십시요.");
						return false;
					}
				}
				break;
			case "201":
				if (sMtype != "20104" && sMtype != "20111" && sMtype != "20199") {
					alert("상담제품을 선택하여 주십시요.");
					return false;
				}
				break;
		}

	}

	//교구재(30),전집류(40),전집(50)등과 같은 박사와 관련된 제품을 선택한 경우
    //prdt_grp:30,40,50군에 포함되지 않으면 상담과목을 잘못 선택했다는 메세지를 뿌리도록
    //20151005 과목군의 소빅스군(22)으로 교구재, 전집류, 전집이 편집됨(이혜진실장)
    if (data.PLURAL_PRDT_LIST.length > 0) {

        //종합교재/전집류(09)
        if (sLtype == "109" || sLtype == "209") {

			//상담과목의 제품군을 뽑아내 30,40,50군에 포함되어있는지 체크한다.
			const checkData = grid2.getData();
            for (const prodId of plProd.ids) {
				const checkRow = checkData.find(el => el.PRDT_ID == prodId);
                if (checkRow && checkRow.PRDT_GRP != "22") {
					alert("상담과목을 잘못 선택했습니다.");
					return false;
                }
			}
			
        }
	}
	
	// 수정일때,
    if (sJobType == "U") {
        //상담연계(3)이고,
        if (data.CSEL_MK == "3" && $("#hiddenbox9").val() != "01") {
			alert("결과등록 한 상담이력은 수정할 수 없습니다.");
			return false;
        }
	}
	
	// 당월에 시정처리 등록건이 있는지 조회
    // 당월에 시정처리건이 등록되어 있으면, 또 등록할 것인지를 물어본다.
	if (data.PROC_MK == "4") {
		const saveChkRes = await getSaveChk(sCustId);
		if(saveChkRes && saveChkRes[0] && saveChkRes[0].CNT_SIJUNG > 0) {
			if (!confirm("동일한 월에 이미 시정처리한 내역이 존재 합니다.\n\n그래도 등록하시겠습니까?")) return;
		}
	}
	
	//지점정보 없을때, 값 설정
    if (!data.DEPT_ID) {
        data.DEPT_ID = "000Z";
		$("#textbox5").val("000Z");
		$("#textbox6").val("000Z");
	}
	
	//지역정보 없을때, 값 설정
    if (!data.AREA_CDE) {
		data.AREA_CDE = "000";
		$("#textbox3").val("000");
	}
	
	//INSERT시,
    if (sJobType == "I") {

        // TODO CTI사용여부가 Y이면, 통화시간정보를 셋팅한다.
        //듀얼 모니터 사용으로 세션중복이 생겨서 CTI사용여부 변경     
        // if (objSys1100.objSysCALL != "") {
        //     // 통화시작시간과 통화종료시간을 가져온다.
        //     if (isCall == "Y") {
        //         try {
        //             var arrCallTimes = objSys1100.gf_getCallTimes();
        //             DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "CALL_STTIME") = arrCallTimes[0];
        //             DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "CALL_EDTIME") = arrCallTimes[1];
        //         } catch (e) { }
        //     }
        // }

        //"I"이고, 상담일자가 없을경우, (추가등록,관계회원등록 일때)
        if (!data.CSEL_DATE) {
            data.CSEL_DATE = getDateFormat().replace(/[^0-9]/gi, '');
        }
       
        // TODO O/B통화결과에서 팝업되었을때,
        // if (objOpener.document.URL.indexOf("cns0000.jsp") > 0) {
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "TASK_ID") = sTaskId; // [ 3] task_id        [ 13] 태스크ID
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "LIST_ID") = sListId; // [ 4] list_id        [ 17] 리스트ID
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "SEQ") = sSeq;    // [ 6] seq            [  3] 순번
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "OB_TYPE") = sObType; // [ 4] ob_type        [  1] OB/고객Care 구분 :[ 1.pv || 2.고객Care || 3.인바운드재통화 || 4.MOL학습관리 ]                
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "STD_DATE") = sStdDate; //[ 8] STD_DATE       [  8] 관리일자                                
        // }

        // TODO MOL학습관리에서 팝업되었을때,
        // if (objOpener.document.URL.indexOf("mol1100.jsp") > 0) {
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "TASK_ID") = sTaskId; // [ 3] task_id        [ 20] 주문번호
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "LIST_ID") = sListId; // [ 4] list_id        [ 15] 상품코드
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "SEQ") = sSeq;    // [ 6] seq            [  3] 순번
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "OB_TYPE") = sObType; // [ 4] ob_type        [  1] OB/고객Care 구분 :[ 1.pv || 2.고객Care || 3.인바운드재통화 || 4.MOL학습관리 ]                
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "STD_DATE") = sStdDate; //[ 8] STD_DATE       [  8] 관리일자                                
        // }

        // TODO O/B PV에서 팝업되었을때,
        // if (objOpener.document.URL.indexOf("clm2900.jsp") > 0 || objOpener.document.URL.indexOf("clm1100.jsp") > 0) {
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "TASK_ID") = sTaskId; // [ 3] task_id        [ 13] 태스크ID
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "LIST_ID") = sListId; // [ 4] list_id        [ 17] 리스트ID
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "SEQ") = sSeq;    // [ 6] seq            [  3] 순번
        //     DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition, "OB_TYPE") = sObType; // [ 4] ob_type        [  1] OB/고객Care 구분 :[ 1.pv || 2.고객Care || 3.인바운드재통화 || 4.MOL학습관리 ]                
        //     //DS_COUNSEL.nameValue(DS_COUNSEL.rowPosition,"STD_DATE")= sStdDate; //[ 8] STD_DATE       [  8] 관리일자                                
        // }
    } else {
        // 상담결과 변경여부 체크를 위하여, 조회되었던 상담결과코드를 설정한다.
        data.ORG_CSEL_RST_MK1 = $("#hiddenbox5").val();
	}

	return data;
}

/**
 * 상담결과 구분에 따라 저장 data 선택
 */
const getAddInfoCondition = () => {

	const cselRstMk = $("#selectbox8").val();	// 상담결과 구분
	
	// DM 사은품 접수
	if (cselRstMk == "12") {		
		return DS_DM_RECEIPT;
	} 
	// 개인정보동의
	else if (cselRstMk == "19") {	
		return DS_DROP_TEMP2;
	} 
	// 고객직접퇴회
	else if (cselRstMk == "20") {	
		return DS_DROP_CHG;
	} 
	// 기타
	else {
		return {};
	}
}

/**
 * OB관련 데이터 value check
 * @param {string|number} ticket_id
 */
const getObCondition = async (ticket_id) => {

	const data = {
		OBLIST_CDE		: "", // OB리스트구분	
		LIST_CUST_ID	: "", // 리스트_고객_ID(OBLIST_CDE = '60' 외 나머지 경우 셋팅)
		CSEL_DATE		: calendarUtil.getImaskValue("textbox27"),  // 상담일자	
		CSEL_NO			: $("#textbox28").val(), 					// 상담번호
		CALLBACK_ID		: "", // CALLBACK_ID(OBLIST_CDE = '60'일 경우 셋팅)
	}
	
	// 티켓필드에서 필요한정보를 가져온다.
	if (!ticket_id) return new Object();
	const { ticket } = await topbarClient.request(`/api/v2/tickets/${ticket_id}`);
	if (!ticket || !ticket.custom_fields || ticket.custom_fields.length == 0) return new Object();

	const fOB_MK 		= ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["OB_MK"]);
	const fLIST_CUST_ID = ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["LIST_CUST_ID"]);
	const fCALLBACK_ID 	= ticket.custom_fields.find(el => el.id == ZDK_INFO[_SPACE]["ticketField"]["CALLBACK_ID"]);

	// OB리스트구분에 따라 값세팅
	data.OBLIST_CDE = fOB_MK?.value?.split("_")[2] || ""; // oblist_cde_${OBLIST_CDE}
	if (data.OBLIST_CDE == "60") {
		data.CALLBACK_ID = fCALLBACK_ID?.value || "";
	} else {
		data.LIST_CUST_ID = fLIST_CUST_ID?.value || "";
	}

	return data;
}

/**
 * CCEM 저장
 * @param {object} counselData 상담정보
 * @param {obejct} addInfoData DM 사은품 접수/개인정보동의/고객직접퇴회
 * @param {obejct} obData OB관련 데이터
 */
const saveCounsel = async (counselData, addInfoData, obData) => new Promise((resolve, reject) => {

	const settings = {
		global: false,
		url: `${API_SERVER}/cns.saveCounsel.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids	: ["DS_COUNSEL", "DS_ADDINFO", "DS_OB"],
			recvdataids	: ["dsRecv"],
			DS_COUNSEL	: [counselData],			// 상담정보
			DS_ADDINFO	: [addInfoData], 			// DM 사은품 접수 정보, 개인정보동의 정보, 고객직접퇴회 정보 저장 data
			DS_OB		: [obData],					// OB관련 데이터
		}),
	}
	
	$.ajax(settings)
		.done(data => {
			if (data.errcode != "0") return reject(new Error(getApiMsg(data, settings)));

			if (data.dsRecv.length == 0) return reject(new Error("저장 결과 데이터가 존재하지 않습니다."));

			return resolve(data.dsRecv[0]);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 시정처리건 조회
 * @param {string} custId 고객번호
 */
const getSaveChk = (custId) => new Promise((resolve, reject) => {
	const settings = {
		global: false,
		url: `${API_SERVER}/cns.getSaveChk.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{ CUST_ID: custId }],
		}),
	}
	$.ajax(settings)
		.done(data => {
			if (data.errcode != "0") return reject(new Error(getApiMsg(data, settings)));

			return resolve(data.dsRecv);
		})
		.fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));
});

/**
 * 상담결과 selectbox change 이벤트
 * - as-is : cns5810.onCselRstMkPopUp()
 * @param {string} code 상담결과 구분
 */
const openCselRst = code => {

	const mbrId = $("#textbox22").val();	// 회원번호
	const custId = $("#hiddenbox6").val();	// 고객번호

	// 고객정보가 있는지 체크
	if (!custId) {
		alert("상담대상이 없습니다.\n\n[고객조회]또는[선생님조회]를 먼저 하고, 처리 하시기 바랍니다.");
		$("#selectbox8").val("");
		return;
	}

	// 저장 data 초기화
	setInitCselRstMkDS();

	// 지급사유 selectbox 비활성화
	$("#selectbox16").prop("disabled", true);
	$("#selectbox16").val("");

	switch (code) {
		case "01":	// 재통화예약
			PopupUtil.open("CCEMPRO025", 500, 330);
			break;
		case "06":	// TODO 상담성공
			
			break;
		case "07":	// TODO 상담실패
			
			break;
		case "12":	// 사은품접수
			$("#selectbox16").prop("disabled", false); // 지급사유 selectbox 활성화
			break;
		case "19":	// 개인정보동의신청
			PopupUtil.open("CCEMPRO023", 594, 670);
			break;
		case "20":	// 고객직접퇴회
			if (mbrId == "") {
				alert("회원번호가 없습니다.\n\n고객직접퇴회 신청을 할 수 없습니다.");
				return;
			}
			PopupUtil.open("CCEMPRO024", 670, 800);
			break;
		case "MOS문의답변":		// TODO MOS문의답변
			PopupUtil.open("CCEMPRO094", 570, 720);
			break;
		case "MOS(커뮤니티)":	// TODO MOS커뮤니티
			
			break;
		default:
			break;
	}
}

/**
 * 결과등록
 */
const onResult = () => {
	const PROC_MK = $("#selectbox4").val();

	switch(PROC_MK){
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
 * 상담결과 팝업 저장 data를 초기화한다.
 * - as-is : cns5810.setInitCselRstMkDS()
 */
const setInitCselRstMkDS = () => {
	DS_DM_RECEIPT  = {};		// DM 사은품 접수 정보 저장 data
	DS_DROP_TEMP2  = {};		// 개인정보동의 정보 저장 data
	DS_DROP_CHG    = {};		// 고객직접퇴회 정보 저장 data
	DS_SCHEDULE	   = {};		// 재통화예약 정보 저장 data
}

/**
 * 지급사유 selectbox change 이벤트
 */
const onDmReceiptChange = () => {

	dmTypeText = $("#selectbox16 option:selected").text();
	dmTypeValue = $("#selectbox16 option:selected").val();

	if (!dmTypeValue) {
		DS_DM_RECEIPT = {};
		return;
	}

	DS_DM_RECEIPT.CSEL_DATE   =	calendarUtil.getImaskValue("textbox27");	// 상담일자		
	DS_DM_RECEIPT.CSEL_NO     =	$("#textbox28").val();						// 상담번호
	DS_DM_RECEIPT.CSEL_SEQ    =	$("#selectbox14").val();					// 상담순번
	DS_DM_RECEIPT.CUST_ID     =	$("#hiddenbox6").val();						// 고객번호
	DS_DM_RECEIPT.CUST_NAME   =	$("#textbox21").val();						// 고객명
	DS_DM_RECEIPT.DM_MATCHCD  =	$("#hiddenbox7").val();						// DM매치코드
	DS_DM_RECEIPT.DM_LIST_ID  =	$("#hiddenbox8").val();						// DM목록ID
	DS_DM_RECEIPT.DM_TYPE_CDE =	dmTypeValue;								// DM종류코드
	DS_DM_RECEIPT.DMLABEL	  = dmTypeText;									// DM종류
	DS_DM_RECEIPT.DM_ZIPCDE   =	$("#textbox24").val();						// 우편번호
	DS_DM_RECEIPT.DM_ADDR     =	$("#textbox25").val();						// 주소
	DS_DM_RECEIPT.DM_REQ_DATE =	getDateFormat().replace(/[^0-9]/gi, '');	// 요청일자
	DS_DM_RECEIPT.REQ_USER_ID =	currentUser.external_id;				// 요청자ID	

}

/**
 * 상담구분, 상담채널 변경시 호출되는 함수
 * - as-is : cns5810.onCloseUpCMB_CSEL_MK()
 */
const changeCselType =() => {
    
    //상담분류 초기화
	$("#textbox14").val("");
	$("#textbox15").val("");
	$("#textbox16").val("");
	$("#textbox17").val("");
	$("#textbox18").val("");
	$("#textbox19").val("");

    //상담구분이 문의(1)일 경우
	if ($("#selectbox3").val() == "1") {
		$("#selectbox5").val("");						// 처리시한
		calendarUtil.setImaskValue("calendar2", "");	// 처리희망일
		$("#selectbox6").val("2");						// 고객반응 (보통)
		$("#selectbox2").focus();
	} else {
		$("#selectbox5").val("");	// 처리시한           
		$("#selectbox6").val("");	// 고객반응                  
	}
    
    //처리구분이 변경되면,
	//신규(I)일때 처리상태를 접수(01)로 선택한다.
	const selectSeq = document.getElementById("selectbox14")
	const jobType = selectSeq.options[selectSeq.selectedIndex].dataset.jobType;
	if (jobType == "I") $("#selectbox10").val("01");

}

/**
 * 저장이 완료 되었거나, 팝업되어 수정 상황일때 버튼 컨트롤 하는 함수.
 * - as-is : cns5810.setBtnCtrlAtLoadComp()
 */
const setBtnCtrlAtLoadComp = () => {
	$("#button5").prop("disabled", false);	// 추가등록
	$("#button6").prop("disabled", false);	// 관계회원

	// 처리구분에 따른 상담연계/결과등록버튼 제어
	switch ($("#selectbox4").val()) {
		case "2":       //상담원처리 = 고객의견
			$("#button4").prop("disabled", true);	// 상담연계
			$("#button7").prop("disabled", false);	// 결과등록
			break;
		case "3":       //상담연계 = 결과등록
			$("#button4").prop("disabled", false);	// 상담연계
			$("#button7").prop("disabled", false);	// 결과등록
			break;
		case "4":       //시정처리 = 결과등록
			$("#button4").prop("disabled", true);	// 상담연계
			$("#button7").prop("disabled", false);	// 결과등록
			break;
		default:
			$("#button4").prop("disabled", true);	// 상담연계
			$("#button7").prop("disabled", true);	// 결과등록
			break;
	}

	// 상담결과 구분이 DM 사은품접수일 경우.
	if ($("#selectbox8").val() == "12") {
		$("#selectbox16").prop("disabled", false); // 지급사유 selectbox 활성화
	} else {
		$("#selectbox16").prop("disabled", true); // 지급사유 selectbox 비활성화
		$("#selectbox16").val("");
	}

}

/**
 * 상담내용 현재 입력 bytes 체크하기
 * - as-is : cns5810.onTextAreaKeyUp()
 */
const checkTextLengh = () => {

	const el = $("#textbox13");
	const value = el.val();
	const sCnt = value.length + (escape(value) + "%u").match(/%u/g).length - 1;
	if (sCnt > 4000) {
		alert("상담 내용은 4000Byte이상 저장할 수 없습니다.\n\n다시 입력해 주십시요.");
		el.focus();
	}

}

/**
 * 지역/사업국/센터 선택시 호출.
 * @param {object} data 
 */
var setDisPlayUp = (data) => {
	$("#hiddenbox1").val(data.LC_ID);			// 센터코드
	$("#hiddenbox4").val(data.LC_EMP_ID);		// 센터장
	$("#textbox1").val(data.DIV_CDE);			// 본부코드
	$("#textbox2").val(data.UPDEPTNAME);		// 본부이름
	$("#textbox3").val(data.AREA_CDE);			// 지역코드
	$("#textbox4").val(data.AREA_NAME);			// 지역이름
	$("#textbox5").val(data.DEPT_ID);			// 사업국코드
	$("#textbox6").val(data.DEPT_NAME);			// 사업국이름
	$("#textbox7").val(data.TELPNO_DEPT);		// 사업국전화번호
	$("#textbox9").val(data.LC_NAME);			// 센터이름
	$("#textbox10").val(data.TELPNO_LC);		// 센터전화번호
}

/**
 * 연계부서 선택시 호출.
 * @param {object} data 
 */
var setDisPlayDn = (data) => {
	$("#textbox11").val(data.PROC_DEPT_ID);		// 연계부서코드
	$("#textbox26").val(data.PROC_DEPT_NAME);	// 연계부서이름
	$("#hiddenbox11").val(data.EMP_ID_LIST);	// 연계담당자ID
	$("#hiddenbox12").val(data.EMP_NAME_LIST);	// 연계담당자이름
}

/**
 * 티켓필드에 들어갈 내용 반환.
 */
const getCustomData = () => {
    return {
	    prdtList 	    : grid2.getData().map(el => `${el.PRDT_GRP}::${el.PRDT_ID}`.toLowerCase()), // 과목리스트(ex. ["11::2k", "11::k","10::m"])
	    deptIdNm 	    : $("#textbox6").val(),		// 지점부서명(사업국명)
	    aeraCdeNm 	    : $("#textbox4").val(),		// 지역코드명
	    procDeptIdNm    : $("#textbox26").val(),	// 연계부서명
        lcName 		    : $("#textbox9").val(),		// 러닝센터명(센터명)
		reclCntct 	    : $("#selectbox8").val() == "01" ? DS_SCHEDULE.TELNO : "", // 상담결과 구분이 재통화예약일경우
		ageCde 			: $("#hiddenbox13").val().trim(),	// 연령코드
		brandId			: $("#hiddenbox14").val(),			// 브랜드ID
    }
}

/**
 * 티켓생성버튼
 * @param {string|number} parent_id Zendesk ticket id
 */
const onNewTicket = async (parent_id) => {
	const CUST_ID = $("#hiddenbox6").val();
	const CUST_NAME = $("#textbox21").val();
	const CUST_MK = $("#hiddenbox2").val();	// 고객구분
	const target = (CUST_MK == "PE" || CUST_MK == "TC") ? "T" : "C";	// 대상구분(고객 : C, 선생님 : T)

	const user_id = await checkUser(target, CUST_ID, CUST_NAME);
	if (!user_id) return false;

	return await createTicket(user_id, parent_id);
}
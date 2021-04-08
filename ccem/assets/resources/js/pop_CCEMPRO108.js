/**
 * 전역변수
 */
var grid;
var topbarObject;
var topbarClient;
var currentUser = {};
var codeData = [];
var users = [];

/**
 * document ready
 */
$(function () {

    // 창이 닫힐때 발생하는 event
	$(window).on('beforeunload', () => {
        PopupUtil.closeAll();
    });

    // Create calendar
    calendarUtil.init("calendar1");
    calendarUtil.init("calendar2");

    // init date
    calendarUtil.setImaskValue("calendar1", getDateFormat());
    calendarUtil.setImaskValue("calendar2", getDateFormat());

    createGrid();
    onStart();

});

/**
 * grid 생성
 */
const createGrid = () => {
    
    // 조회내역
    grid = new Grid({
        el: document.getElementById("grid"),
        bodyHeight: 500,
        pageOptions: { useClient: true, perPage: 100, },
		columns: [
			{ header: '접수일자',           name: "CSEL_DATE",        width: 100,  align: "center", sortable: true, ellipsis: true, hidden: false, 
                formatter: columnInfo => FormatUtil.date(columnInfo.value) },
			{ header: '번호',               name: "CSEL_NO",          width: 50,  align: "center", sortable: true, ellipsis: true, hidden: false, },
			{ header: '순번',               name: "CSEL_SEQ",         width: 50,  align: "center", sortable: true, ellipsis: true, hidden: false, },
			{ header: '구분',               name: "QNA_DV",           width: 100,  align: "center", sortable: true, ellipsis: true, hidden: false, 
                formatter: columnInfo => findCodeName("WEB_QNA_DV", columnInfo.value) },
			{ header: '세부구분',           name: "QNA_TYPE",         width: 100,  align: "center", sortable: true, ellipsis: true, hidden: false, 
                formatter: columnInfo => findCodeName("WEB_QNA_TYPE", columnInfo.value) },
			{ header: '고객명',             name: "CUST_NM",          width: 100,  align: "center", sortable: true, ellipsis: true, hidden: false, },
			{ header: '제목',               name: "TITLE",            width: 150,  align: "left",   sortable: true, ellipsis: true, hidden: false, },
			{ header: '상담원',             name: "ANSWER_USER_NM",   width: 100,  align: "center", sortable: true, ellipsis: true, hidden: false, },
			{ header: '작성일시',           name: "WK_DTM",           width: 150,  align: "center", sortable: true, ellipsis: true, hidden: false, },
            { header: "QNA SEQ",            name: "QNA_SEQ",          width: 100,  align: "center", sortable: true, ellipsis: true, hidden: true, },
            { header: "고객ID(교사사번)",    name: "CUST_ID",          width: 100,  align: "center", sortable: true, ellipsis: true, hidden: true, },
            { header: "이메일주소",          name: "EMAIL_ADDR",       width: 100,  align: "center", sortable: true, ellipsis: true, hidden: true, },
            { header: "질문",                name: "QUESTION",         width: 100,  align: "center", sortable: true, ellipsis: true, hidden: true, },
            { header: "답변자ID",            name: "ANSWER_USER_ID",   width: 100,  align: "center", sortable: true, ellipsis: true, hidden: true, },
            { header: "답변내용",            name: "ANSWER",           width: 100,  align: "center", sortable: true, ellipsis: true, hidden: true, },
            { header: "답변일시",            name: "ANSWER_DTM",       width: 100,  align: "center", sortable: true, ellipsis: true, hidden: true, },
		],
    });

    grid.on("focusChange", ev => {
        const thisGrid = ev.instance;
        thisGrid.addSelection(ev);

        // 선택 행 상세정보 세팅
        setDetail(thisGrid.getRow(ev.rowKey));

    });

    grid.on("click", ev => {
        const thisGrid = ev.instance;
        thisGrid.clickSort(ev);
    });

    grid.on("afterPageMove", ev => {
        const thisGrid = ev.instance;

		// 현재 페이지의 첫번째 행 focusing.
		const pagination  = thisGrid.getPagination();
		const perPage 	  = pagination._options.itemsPerPage;
		const currentPage = pagination._currentPage;
		const currentRowKey = (currentPage - 1) * perPage;
		thisGrid.focus(currentRowKey);

	});

}

/**
 * 오픈되는 곳에 따라 분기처리
 */
const onStart = async () => {

    const opener_name = opener?.name || "";

    // 탑바 메인화면에서 오픈
    if (opener_name.includes("top_bar")) {
        topbarObject = opener;
        topbarClient = topbarObject.client;
        currentUser = topbarObject.currentUserInfo.user;
        codeData = topbarObject.codeData;
        await setCodeData();

    // 상담등록 화면에서 오픈
    } else if (opener_name == "CCEMPRO022") {
        topbarObject = opener.topbarObject;
        topbarClient = topbarObject.client;
        currentUser = topbarObject.currentUserInfo.user;
        codeData = topbarObject.codeData;
        await setCodeData();

        // 질문/답변 정보 조회
        const CSEL_DATE = opener.calendarUtil.getImaskValue("textbox27");     // 상담일자
        const CSEL_NO   = $("#textbox28", opener.document).val();             // 상담번호
        const CSEL_SEQ  = $("#selectbox14", opener.document).val();           // 상담순번
        if (CSEL_DATE && CSEL_NO && CSEL_SEQ) onSearch({ CSEL_DATE, CSEL_NO, CSEL_SEQ });

    }

}

/**
 * 콤보박스 세팅
 */
const setCodeData = async () => {

    const QNA_CODE = [
        { CODE_MK: "WEB_QNA_DV",    CODE_NAME: "MOS",         CODE_ID: "MOS" },
        { CODE_MK: "WEB_QNA_DV",    CODE_NAME: "고객의소리",   CODE_ID: "WEB" },
    ];

    const CODE_MK_LIST = [
        "WEB_QNA_DV",       // 구분
        "WEB_QNA_TYPE",     // 세부구분
		"USER_GRP_CDE", 	// 상담원그룹
	];



	/**
	 * get code
	 */
    const findCodeData = codeData.filter(el => CODE_MK_LIST.includes(el.CODE_MK));
    const codeList = [...findCodeData, ...QNA_CODE];

    users = await getUser();    // 상담원



    /**
	 * create select options
	 */
	for (const code of codeList) {
        let codeMk = code.CODE_MK;
		let codeNm = code.CODE_NAME;
		let codeId = code.CODE_ID;
        codeNm = (codeMk == "USER_GRP_CDE") ? `[${codeId}] ${codeNm}` : codeNm;
		$(`select[name='${codeMk}']`).append(new Option(codeNm, codeId));
	}

    users.forEach(el => {
        $("#selectbox4").append(new Option(`[${el.USER_ID}] ${el.USER_NAME}`, el.USER_ID));
    });



    /**
	 * create multipleSelect
	 */
    const formatSelectAll = () => "[전체]";
    const formatAllSelected = () => "전체";

    // 상담원그룹
    const selectbox3CheckEvent = () => {
        const selectedValues = $("#selectbox3").val();
        const isCheck = selectedValues.length > 0 ? true : false;
        filterUser(selectedValues);
        $("#checkbox4").prop("checked", isCheck);
        $("#checkbox5").prop("checked", isCheck);
    }
	$('#selectbox3').multipleSelect({
		formatSelectAll,
		formatAllSelected,
		onCheckAll: () => setTimeout(selectbox3CheckEvent, 1),
		onUncheckAll: () => setTimeout(selectbox3CheckEvent, 1),
		onClick: selectbox3CheckEvent,
	});



    /**
     * 상담원그룹과 상담원 세팅
     */
    const currentUserGrp = currentUser.user_fields.user_grp_cde || "";
    const currentUserLvl = currentUser.user_fields.user_lvl_mk || "";
    const isAdmin = (currentUserLvl == "user_lvl_mk_1" || currentUserLvl == "user_lvl_mk_2" || currentUserLvl == "user_lvl_mk_3");
    const isLowLvl = (currentUserLvl != "user_lvl_mk_1" && currentUserLvl != "user_lvl_mk_2" && currentUserLvl != "user_lvl_mk_3" && currentUserLvl != "user_lvl_mk_4");
	
    // 상담원그룹
    $("#selectbox3").multipleSelect("setSelects", currentUserGrp);
    $("#checkbox4").prop("checked", true);
    
    // 상담원
    filterUser([currentUserGrp]);
    $("#selectbox4").val(currentUser.external_id);
    $("#checkbox5").prop("checked", true);

    // 권한이 낮은 사용자
    if (isLowLvl) {
        $("#selectbox3").multipleSelect("disable", true);
        $("#checkbox4").prop("disabled", true);

    // 권한이 높은 사용자
    } else if (isAdmin) {
        $("#checkbox5").prop("checked", false);
    }

    // 7100 ESL사업부 - 그룹변경 안되게 수정
    if (currentUserGrp == "7100") {
        $("#selectbox3").multipleSelect("disable", true);
        $("#checkbox4").prop("disabled", true);
    }

    /**
     * 비활성화
     * @TODO 세부구분(WEB_QNA_TYPE) 코드 추가되면 삭제
     */
    $("#checkbox2").prop("disabled", true);
    $("#selectbox2").prop("disabled", true);
    $("#checkbox1").prop("checked", true);
    $("#checkbox1").prop("disabled", true);
    $("#selectbox1").prop("disabled", true);
    $("#selectbox1").val("MOS");

}

/**
 * 상담원 조회
 * @returns {array} users
 */
const getUser = () => new Promise((resolve, reject) => {

    const settings = {
		url: `${API_SERVER}/cns.getUser.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "고객의소리",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [{}],
		}),
		errMsg: "상담원 조회중 오류가 발생하였습니다.",
	}

	$.ajax(settings)
        .done(res => {
		    if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));
            return resolve(res.dsRecv);
        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 상담원 필터링
 * @param {array} selectedValues 
 */
 const filterUser = selectedValues => {
    const $userSelectbox = $("#selectbox4").empty().append("<option hidden></option>");
    users.filter(el => selectedValues.includes(el.USER_GRP_CDE))
         .forEach(el => $userSelectbox.append(new Option(`[${el.USER_ID}] ${el.USER_NAME}`, el.USER_ID)));
}

/**
 * 조회
 */
const onSearch = async (condition) => {
    
     // 조회조건으로 조회
    if (!condition) {

        condition = {
            CHK_QNA_DV        : $("#checkbox1").is(":checked") ? "Y" : "N",  // 구분 조회여부
            QNA_DV            : $("#selectbox1").val(),                      // 구분
            CHK_QNA_TYPE      : $("#checkbox2").is(":checked") ? "Y" : "N",  // 세부구분 조회여부
            QNA_TYPE          : $("#selectbox2").val(),                      // 세부구분
            CHK_DATE          : "Y",                                         // 상담일자 체크여부
            VAL_STDATE        : calendarUtil.getImaskValue("calendar1"),     // 상담조회 시작일자
            VAL_EDDATE        : calendarUtil.getImaskValue("calendar2"),     // 상담조회 종료일자
            CHK_USER_GRP_CDE  : $("#checkbox4").is(":checked") ? "Y" : "N",  // 상담원그룹 조회여부
            VAL_USER_GRP_CDE  : $("#selectbox3").val(),                      // 상담원그룹
            CHK_TB_USER       : $("#checkbox5").is(":checked") ? "Y" : "N",  // 상담원 조회여부
            VAL_TB_USER       : $("#selectbox4").val(),                      // 상담원
        }

        // validation check
        if (condition.VAL_STDATE.length != 8) {
            alert("상담일자를 입력해 주세요.");
            $("#calendar1").focus();
            return;
        }
        if (condition.VAL_EDDATE.length != 8) {
            alert("상담일자를 입력해 주세요.");
            $("#calendar2").focus();
            return;
        }

    } 

    const data = await getMosWebQnaInfo(condition);
    grid.resetData(data);

    // 첫번째 행 focusing.
    if (!grid.focus(0)) setDetail(new Object());
    
}

/**
 * 상세정보 세팅
 * @param {object} data 
 */
const setDetail = (data) => {
    $("#textbox4").val(data.CUST_NM);         // 고객명       
    $("#textbox10").val(data.EMAIL_ADDR);     // 이메일
    $("#textbox8").val(data.WK_DTM);          // 작성일시
    $("#textbox3").val(data.TITLE);           // 제목
    $("#textbox5").val(data.QUESTION);        // 질문내용
    $("#textbox9").val(data.ANSWER_DTM);      // 답변일시
    $("#textbox6").val(data.ANSWER_USER_NM);  // 상담사
    $("#textbox7").val(data.ANSWER);          // 답변내용
    $("#textbox1").val(findCodeName("WEB_QNA_DV", data.QNA_DV));       // 구분
    $("#textbox2").val(findCodeName("WEB_QNA_TYPE", data.QNA_TYPE));   // 세부구분
}

/**
 * 질문/답변 정보 조회
 * @param {object} condition 조회조건
 * @returns {array} 질문/답변 정보
 */
const getMosWebQnaInfo = (condition) => new Promise((resolve, reject) => {

    const settings = {
		url: `${API_SERVER}/cns.getMosWebQnaInfo.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			userid: currentUser?.external_id,
			menuname: "고객의소리",
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
            dsSend: [condition],
		}),
		errMsg: "질문/답변 정보 조회중 오류가 발생하였습니다.",
	}

    $.ajax(settings)
        .done(res => {
            if (!checkApi(res, settings)) return reject(new Error(getApiMsg(res, settings)));
            return resolve(res.dsRecv);
        })
        .fail((jqXHR) => reject(new Error(getErrMsg(jqXHR.statusText))));

});

/**
 * 해당코드의 CODE_NAME 반환.
 * @param {string} CODE_MK 코드구분 
 * @param {string} CODE_ID 코드ID
 */
const findCodeName = (CODE_MK, CODE_ID) => {
    const code = codeData.find(el => el.CODE_MK == CODE_MK && el.CODE_ID == CODE_ID);
    return code ? code.CODE_NAME : CODE_ID;
}

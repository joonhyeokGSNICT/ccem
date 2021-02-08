
//=== GRID DEFINITION === //
var counselMain_studyProgressList_grid = null; 			// 상담메인 > 학습진행정보 grid
var counselMain_counselHist_grid = null;   				// 상담메인 > 상담이력 grid
var counselMain_studyTab_weeklyStat = null; 			// 상담메인 > 학습이력 > 주간학습현황 grid
var counselMain_studyTab_changeHist = null; 			// 상담메인 > 학습이력 > 변동이력 grid
var counselMain_studyTab_asignStuff = null; 			// 상담메인 > 학습이력 > 불출교재 grid
var counselMain_studyTab_asignStuff2 = null; 			// 상담메인 > 학습이력 > 불출교재2 grid
var counselMain_studyList_grid = null;  				// 상담메인	> 학습과목정보 grid
var counselMain_directCharge_duesInfo_grid = null; 		// 상담메인	> 직접결제 > 회비관리현황 grid
var counselMain_directCharge_alimSendList_grid = null; 	// 상담메인	> 직접결제 > 알림톡발송이력 grid
var counselMain_directCharge_cancelCharge_grid = null; 	// 상담메인	> 직접결제 > 결제/취소 grid
var counselMain_directCharge_bill_grid = null;			// 상담메인	> 직접결제 > 청구서 grid
var counselMain_directCharge_reciverInfo_grid = null;	// 상담메인	> 직접결제 > 알림톡수신대상자정보 grid
var counselMain_changeHist_studySpot_grid = null;		// 상담메인	> 변경이력 > 현재 학습장소 grid
var counselMain_changeHist_changeDetail_grid = null;	// 상담메인	> 변경이력 > 신상변경이력 grid
var counselMain_infoAgree_infoAgreeList_grid = null;	// 상담메인	> 정보동의 > 개인정보동의 grid
var counselMain_infoAgree_termsVersion_grid = null;		// 상담메인	> 정보동의 > 약관버젼 grid
var counselMain_infoAgree_iaRecordList_grid= null;		// 상담메인	> 정보동의 > 개인정보녹취통화이력 grid
var counselMain_infoAgree_termsRecordList_grid= null;	// 상담메인	> 정보동의 > 약관녹취통화이력 grid
var counselMain_autoResign_resignDetail_grid = null;	// 상담메인	> 자동퇴회 > 자동퇴회 세부 grid
var counselMain_autoResign_resignSendList_grid = null;	// 상담메인	> 자동퇴회 > 퇴회안내발송이력 grid
var counselMain_researchCust_rsrchCust_grid = null;		// 상담메인	> 고객조사 > 고객조사 grid
var counselMain_researchCust_rschCallHist_grid = null;	// 상담메인	> 고객조사 > 통화이력 grid
var counselMain_researchCust_smsLmsHist_grid = null;	// 상담메인	> 고객조사 > 설문조사 grid
var counselMain_membershipDueTab_dueList = null;		// 상담메인 > 회비	   > 회비정보 grid
var counselMain_membershipDueTab_subChargeList = null;	// 상담메인 > 회비	   > 과목별 입금내역 grid
var counselMain_membershipDueTab_chargeList = null;		// 상담메인 > 회비	   > 입금내역 grid


var counselMainTeacher_counselHist_grid = null; 	// 상담메인 선생님 > 상담이력 grid
var counselMainTeacher_asignClassGrid = null; 		// 상담메인 선생님 > 교실정보 > 선생님 수업목록 grid
var counselMainTeacher_classMemberGrid = null; 		// 상담메인 선생님 > 교실정보 > 교실별 회원정보 grid

var currentPop = { name : null };
var currentUnPop = { name : null };

var codeData;									// 전체 공통코드 정보
var tableList;									// 전체 통합코드 정보
var faxUrl = "";								// FAX URL

var currentUserInfo;							// 현재 사용중인 유저의 정보(ZENDESK)
var currentCustInfo = {
		CUST_ID			   : "",
		CUST_MK            : "",
		CUST_CGNT_NO       : "",
		MBR_ID             : "",
		NAME               : "",
		NAME_ENG           : "",
		GND                : "",
		RSDNO              : "",
		BIRTH_MK           : "",
		BIRTH_YMD          : "",
		BLOOD              : "",
		SCHL_NAME          : "",
		GRADE_CDE          : "",
		FNL_EDUHIST_CDE    : "",
		FAT_RSDNO          : "",
		FAT_NAME           : "",
		FAT_REL            : "",
		EMPCHILD_FLAG      : "",
		TASTE_CDE          : "",
		TASTE_CDE2         : "",
		HOPE               : "",
		RELIGION_CDE       : "",
		JOB_CDE            : "",
		DUTY_NAME          : "",
		WED_FLAG           : "",
		WED_DAY            : "",
		BANK_ID            : "",
		TRS_ACCT_ID        : "",
		REP_EMAIL_ADDR     : "",
		MAIL_RCV_FLAG      : "",
		DM_RCV_MK          : "",
		DM_RETURN_DATE     : "",
		MAIN_NSPAPER1      : "",
		PCTYPE_CDE         : "",
		ZIPCDE             : "",
		ADDR               : "",
		DDD                : "",
		TELPNO1            : "",
		TELPNO2            : "",
		MOBILNO            : "",
		DEPT_ID            : "",
		EDUPIA_NO          : "",
		EDUPIA_ID          : "",
		FST_CRS_CDE        : "",
		MEDIA_CDE          : "",
		TM_RCV_MK          : "",
		IVY_FLAG           : "",
		IVY_POINT          : "",
		FML_RANK           : "",
		WEIGHT             : "",
		MOTTO              : "",
		CHG_USER_ID        : "",
		UPDDATE            : "",
		MIDAS_CHGDATE      : "",
		CTI_CHGDATE        : "",
		SMS_FLAG           : "",
		MOBILNO3           : "",
		MOBILNO_MBR        : "",
		MOBILNO_FAT        : "",
		MOBILNO3_MBR       : "",
		MOBILNO3_FAT       : "",
		BANK_NAME          : "",
		FAT_DEPT_NAME      : "",
		ZIP_ADDR           : "",
		BL_BLACK_YN        : "",
		DEPT_NAME          : "",
		UP_DEPT_ID         : "",
		UPDEPTNAME         : "",
		ZIPCDE_DEPT        : "",
		ADDR_DEPT          : "",
		ZIP_ADDR_DEPT      : "",
		TELPNO_DEPT        : "",
		FAXNO_DEPT         : "",
		FAT_CO_DDD         : "",
		FAT_CO_TELPNO1     : "",
		FAT_CO_TELPNO2     : "",
		CASH_NO            : "",
		STD_PRDT_CNT       : "",
		STD_TOT_MONTH      : "",
		VIP_CDE            : "",
		VIP_CDE_NAME       : "",
		FAXNO              : "",
		EMPCHILD_NAME      : "",
		BLACK_CUST_MK_NAME : "",
		BL_DEL_YN          : "",
		DEL_CUST_MK_NAME   : "",
		INFO_YN_NAME       : "",
		SMS_YN_NAME        : "",
		SMS_SAVE_YN_NAME   : "",
		ZPOST_DT           : "",
		RDATE              : "",
		RPHONE             : "",
		THIRD_YN_NAME      : "",
		DNC_YN_NAME        : "",
		DNC_DT             : "",
		MOBILNO_LAW        : "",
		MOBILNO3_LAW       : "",
		CERT_GB            : "",
		SMS_SEND_DT        : "",
		SMS_REV_DT         : "",
		APPRV_GB           : "",
		APPRV_NAME         : "",
		LC_ID              : "",
		TELPNO_NAME        : "",
		TELPNO_LC          : "",
		EMAIL              : "",
		ONLINEID           : ""
};							// 현재 선택된 고객의 정보
var currentCounselInfo; 						// 현재 선택된 상담의 정보
var currentStudyInfo; 							// 현재 선택된 주간학습의 정보
var currentDirectChargeInfo;					// 현재 선택된 회비관리의 정보
var currentDueInfo;								// 현재 선택된 회비정보
var currentSubDueInfo;							// 현재 선택된 과목별입금내역 정보
var currentTchrInfo;							// 현재 선택된 선생님의 정보

var tempCustInfo;

var currentTicketInfo;							// 현재 열려있는 티켓의 정보

var existCustInfo;								// 기존 존재하는 고객의 정보
var existCustName;								// 기존 존재하는 고객의 이름
var existCustTelNo;								// 기존 존재하는 고객의 전화번호
var sOrgFAT_RSDNO;								//학부모 주민번호 변경여부 체크 하기 위한 변수

var sFAT_NAME;									// 현재고객 부모 명
var sFAT_RSDNO;									// 현재고객 부모 관계번호
var sFAT_REL;									// 현재고객 부모 관계

var deptData;									// 현재 고객의 사업국 리스트
var lcData;										// 현재 고객의 센터 리스트

var topBarClient = null;						// 탑바 클라이언트 (ZAF CLIENT // TopBar)
var sidebarClient = null;						// 사이드바 클라이언트 (ZAF CLIENT // SideBar)
var backgroundClient = null;					// 백그라운드 클라이언트 (ZAF CLIENT // Background)

// 고객 조회 상태 // 1: 신규, 아무것도 없는 상태. 2: 고객조회된 상태. 3: 관계회원 조회된 상태
var custInfoStatus;

// === === === === === === === === === === === === === === TRIGGER === === === === === === === === === === === === === === ===
//sideBar client 받기
client.on("getSidebarClient", function(sidebarClient_d) {
	sidebarClient = client.instance(sidebarClient_d);
	initAll();															// 전체 초기화
	setTimeout(function(){
		sidebarClient.get('ticket').then(function(data){				// 티켓 정보 불러오기
			console.log(data);
			currentTicketInfo = data;
			userSearch();												// 고객 검색
			if(data.ticket.externalId == null){								// 티켓의 externalId 가 null - > 신규 전화 인입
				if(data.ticket.status == 'open'){							// 티켓 상태가 open 인 경우,
					if(currentTicketInfo.ticket.tags.includes("in")){
						topBarClient.invoke("popover");					// 탑바 열기
					}
				};
			}
		});
	}, 500);
});
// 티켓이 열림
client.on("ticketReady", function(){
	
});
client.on("getCodeData", function(d){
	codeData = d;
	console.log(codeData);
	
	// selectBox 공통 코드 불러오기
	getCodeList();
	getProd();
	$("#custInfo_CUST_MK").val("CM");
});
//=== === === === === === === === === === === === === === TRIGGER === === === === === === === === === === === === === === ===

/** 
 * 젠데스크에서 티켓 열린 후 고객 조회 부분
 * @returns
 */
function userSearch() {
	sidebarClient.get('ticket').then(function(data){
	var phone = "";
		client.request(`/api/v2/users/${data['ticket'].requester.id}.json`).then(function(reqUser){
			if(currentTicketInfo.ticket.externalId == null && (currentTicketInfo.ticket.tags.includes("in") || currentTicketInfo.ticket.tags.includes("zopim_chat"))){
				console.log(reqUser);
				$("#customerSearchTab").click();												// 고객조회 탭 이동
				$("#custSearchDiv").find(".form-check-input").prop("checked",false);			// 검색 조건 초기화
				$("#custSearchDiv").find("input[type=text]").val("");
				$("#custSearchDiv").find("select").val("");
				for(d of data['ticket'].requester.identities){
					if(d.type == 'phone_number'){
						phone = d.value;
					}
				}
				if(phone == ""){
					phone = reqUser.user.phone;
				}
				setTimeout(function(){
					if(phone != '' && phone != null){
						$("#customerPhone").val(phone);
						$("#customerPhoneCheck").prop('checked',true);
					}
					customerSearch("custSearchDiv","1");
				}, 500);
			}else {
				if(reqUser.user.user_fields.cust_mk == "교사"){
					$("#teacherSearchTab").click();													// 선생님 탭 이동
					$("#teacherSearchDiv").find(".form-check-input").prop("checked",false);			// 검색 조건 초기화
					$("#teacherSearchDiv").find("input[type=text]").val("");
					$("#teacherSearchDiv").find("select").val("");
					setTimeout(function(){
						console.log(reqUser);
						if(reqUser.user.external_id != null){
							$("#teacherDNum").val(reqUser.user.external_id);
							$("#teacherDNumCheck").prop('checked',true);
						}
						customerSearch("teacherSearchDiv","1");
					}, 500);
				}else {
					console.log(reqUser);
					$("#customerSearchTab").click();												// 고객조회 탭 이동
					$("#custSearchDiv").find(".form-check-input").prop("checked",false);			// 검색 조건 초기화
					$("#custSearchDiv").find("input[type=text]").val("");
					$("#custSearchDiv").find("select").val("");
					setTimeout(function(){
						$("#customerMNum").val(reqUser.user.external_id);
						$("#customerMNumCheck").prop('checked',true);
						customerSearch("custSearchDiv","1");
					}, 500);
				}
			}
		});
	});
}
/**
 * 페이지의 모든 요소 초기화
 * @returns
 */
function initAll() {
	currentCustInfo = {
			CUST_ID			   : "",
			CUST_MK            : "",
			CUST_CGNT_NO       : "",
			MBR_ID             : "",
			NAME               : "",
			NAME_ENG           : "",
			GND                : "",
			RSDNO              : "",
			BIRTH_MK           : "",
			BIRTH_YMD          : "",
			BLOOD              : "",
			SCHL_NAME          : "",
			GRADE_CDE          : "",
			FNL_EDUHIST_CDE    : "",
			FAT_RSDNO          : "",
			FAT_NAME           : "",
			FAT_REL            : "",
			EMPCHILD_FLAG      : "",
			TASTE_CDE          : "",
			TASTE_CDE2         : "",
			HOPE               : "",
			RELIGION_CDE       : "",
			JOB_CDE            : "",
			DUTY_NAME          : "",
			WED_FLAG           : "",
			WED_DAY            : "",
			BANK_ID            : "",
			TRS_ACCT_ID        : "",
			REP_EMAIL_ADDR     : "",
			MAIL_RCV_FLAG      : "",
			DM_RCV_MK          : "",
			DM_RETURN_DATE     : "",
			MAIN_NSPAPER1      : "",
			PCTYPE_CDE         : "",
			ZIPCDE             : "",
			ADDR               : "",
			DDD                : "",
			TELPNO1            : "",
			TELPNO2            : "",
			MOBILNO            : "",
			DEPT_ID            : "",
			EDUPIA_NO          : "",
			EDUPIA_ID          : "",
			FST_CRS_CDE        : "",
			MEDIA_CDE          : "",
			TM_RCV_MK          : "",
			IVY_FLAG           : "",
			IVY_POINT          : "",
			FML_RANK           : "",
			WEIGHT             : "",
			MOTTO              : "",
			CHG_USER_ID        : "",
			UPDDATE            : "",
			MIDAS_CHGDATE      : "",
			CTI_CHGDATE        : "",
			SMS_FLAG           : "",
			MOBILNO3           : "",
			MOBILNO_MBR        : "",
			MOBILNO_FAT        : "",
			MOBILNO3_MBR       : "",
			MOBILNO3_FAT       : "",
			BANK_NAME          : "",
			FAT_DEPT_NAME      : "",
			ZIP_ADDR           : "",
			BL_BLACK_YN        : "",
			DEPT_NAME          : "",
			UP_DEPT_ID         : "",
			UPDEPTNAME         : "",
			ZIPCDE_DEPT        : "",
			ADDR_DEPT          : "",
			ZIP_ADDR_DEPT      : "",
			TELPNO_DEPT        : "",
			FAXNO_DEPT         : "",
			FAT_CO_DDD         : "",
			FAT_CO_TELPNO1     : "",
			FAT_CO_TELPNO2     : "",
			CASH_NO            : "",
			STD_PRDT_CNT       : "",
			STD_TOT_MONTH      : "",
			VIP_CDE            : "",
			VIP_CDE_NAME       : "",
			FAXNO              : "",
			EMPCHILD_NAME      : "",
			BLACK_CUST_MK_NAME : "",
			BL_DEL_YN          : "",
			DEL_CUST_MK_NAME   : "",
			INFO_YN_NAME       : "",
			SMS_YN_NAME        : "",
			SMS_SAVE_YN_NAME   : "",
			ZPOST_DT           : "",
			RDATE              : "",
			RPHONE             : "",
			THIRD_YN_NAME      : "",
			DNC_YN_NAME        : "",
			DNC_DT             : "",
			MOBILNO_LAW        : "",
			MOBILNO3_LAW       : "",
			CERT_GB            : "",
			SMS_SEND_DT        : "",
			SMS_REV_DT         : "",
			APPRV_GB           : "",
			APPRV_NAME         : "",
			LC_ID              : "",
			TELPNO_NAME        : "",
			TELPNO_LC          : "",
			EMAIL              : "",
			ONLINEID           : ""
	};						// 현재 선택된 고객의 정보 초기화
	
	currentCounselInfo = null; 					// 현재 선택된 상담의 정보 초기화
	currentStudyInfo = null; 					// 현재 선택된 주간학습의 정보 초기화  
	currentDueInfo = null;
	currentDirectChargeInfo = null;				// 현재 선택된 회비관리 정보 초기화
	currentTchrInfo = null;						// 현재 선택된 선생님 정보 초기화
	
	initSemi();	// 인풋 초기화
	
};
// 인풋만 초기화
function initSemi(){
	
	$("#blackAndVipArea").css("display", "none");		// 정성회원 배너 안보이게
	
	// 양력 음력 초기화
	$("#solar").css('display','');
	$("#lunar").css('display','none');
	$("#lunarSolarInput").val("1");
	
	
	// input 내용 삭제
	$("#customerInfoTab").find("input:text").each( function () {
        $(this).val('');
    });
	// select 첫번째 옵션 선택
	$("#customerInfoTab").find('select').each(function(){
		$(this).find('option:first').prop('selected','true');
	});
	
	// 상담이력 탭 이동
	$("#customerCounselHist").click();
	$("#teacher_counselHist").click();
	
	// 고객구분 초기세팅
	$("#custInfo_CUST_MK").val("CM");
	
	// 기본 조회 날짜 세팅
	$(".defaultDate_ed").val(getToday(0).substring(0,7));
	$(".defaultDate_bf").val(dateFormatWithBar(addMonth(new Date(), -36)).substring(0,7));
	
	// disabled false
	$("#custInfo_FAT_RSDNO").attr('disabled',false);
	$("#custInfo_FAT_NAME").attr('disabled',false);
	$("#custInfo_FAT_REL").attr('disabled',false);
	
	setStatus(1);								// 신규 상태로 변경
	gridReset();								// 그리드 리셋
}

/**
 * 그리드 리셋 func
 * @returns
 * 21-01-14 최준혁
 */
function gridReset(){
	try{
		counselMain_counselHist_grid.clear();					// 상담이력
		counselMain_studyProgressList_grid .clear();			// 학습진행정보
		counselMain_studyTab_weeklyStat.clear();				// 주간학습현황
		counselMain_studyTab_changeHist.clear();				// 변동이력
		counselMain_studyTab_asignStuff.clear();				// 불출교재1
		counselMain_studyTab_asignStuff2.clear();				// 불출교재2
		counselMain_studyList_grid.clear();						// 학습과목
		counselMain_directCharge_duesInfo_grid.clear();			// 회비관리
		counselMain_directCharge_alimSendList_grid.clear();		// 알림톡발송이력
		counselMain_directCharge_cancelCharge_grid.clear();		// 결제/취소
		counselMain_directCharge_bill_grid.clear();				// 청구서
		counselMain_directCharge_reciverInfo_grid.clear();		// 알림톡수신대상자
		counselMain_changeHist_studySpot_grid.clear();			// 학습장소 변동이력
		counselMain_changeHist_changeDetail_grid.clear();		// 신상변경이력
		counselMain_infoAgree_infoAgreeList_grid.clear();		// 개인정보동의
		counselMain_infoAgree_termsVersion_grid.clear();		// 약관버젼
		counselMain_infoAgree_iaRecordList_grid.clear(); 		// 개인정보녹취통화이력
		counselMain_infoAgree_termsRecordList_grid.clear();		// 약관녹취통화이력
		counselMain_autoResign_resignDetail_grid.clear();		// 자동퇴회 세부
		counselMain_autoResign_resignSendList_grid.clear();		// 퇴회안내발송이력
		counselMain_researchCust_rsrchCust_grid.clear();	 	// 고객조사 grid
		counselMain_researchCust_rschCallHist_grid.clear();		// 통화이력 grid
		counselMain_researchCust_smsLmsHist_grid.clear();		// 설문조사 grid
		counselMain_membershipDueTab_dueList.clear();			// 상담메인 > 회비	   > 회비정보 grid
		counselMain_membershipDueTab_subChargeList.clear();		// 상담메인 > 회비	   > 과목별 입금내역 grid
		counselMain_membershipDueTab_chargeList.clear();		// 상담메인 > 회비	   > 입금내역 grid
		
		counselMainTeacher_counselHist_grid.clear();			// 선생님 상담이력 리스트
		counselMainTeacher_asignClassGrid.clear();				// 상담메인 선생님 > 교실정보 > 선생님 수업목록 grid
		counselMainTeacher_classMemberGrid.clear();				// 상담메인 선생님 > 교실정보 > 교실별 회원정보 grid
	}catch(e){
		
	}
}

/**
 * 상태에 따른 화면 변경 세팅
 * @param num
 * @returns
 * 21-01-07
 * 최준혁
 */
function setStatus(num){
	custInfoStatus = num;
	switch(num){								// 고객 조회 상태 // 1: 신규, 아무것도 없는 상태. 2: 고객조회된 상태. 3: 관계회원 등록 상태
	case 1 :
		$("#custInfo_refBtn").prop('disabled',true);				// 관계회원 버튼 	disable
		$("#custInfo_blackBtn").prop('disabled', true);				// 정성회원 버튼 	disable
		if(currentCustInfo){										// 기존 고객정보가 있을때만 취소
			$("#custInfo_cancelBtn").prop('disabled', '');			// 취소 버튼 		enable
		}
		$("#custInfo_DEPT_NAME_study").parent().css("display","none");	// 복수학습 최적화
		$("#custInfo_LC_NM_study").parent().css("display","none");
		$("#custInfo_multipleStudy").css("display","none");
		$("#custInfo_UPDEPTNAME").parent().attr('colspan', '3');
		break;
	case 2 :
		$("#custInfo_refBtn").prop('disabled','');					// 관계회원 버튼 	enable
		$("#custInfo_blackBtn").prop('disabled', '');				// 정성회원 버튼 	enable
		$("#custInfo_cancelBtn").prop('disabled', true);			// 취소 버튼 		disable
		break;
	case 3 :
		$("#custInfo_FAT_NAME").prop('disabled', true);				// 부모 영역 disabled
		$("#custInfo_FAT_REL").prop('disabled', true);				// ``
		$("#custInfo_FAT_RSDNO").prop('disabled', true);			// 관계번호 disabled
		$("#custInfo_cancelBtn").prop('disabled', '');				// 취소 버튼 		enable
		break;
	}
	
}

var mask;

/**
 * 신규 고객 등록
 * @returns
 * 21-01-07 최준혁
 */
function newCustomerInsert(){
	tempCustInfo = currentCustInfo;								// 고객정보 임시저장
	initAll();														// 전체 초기화
	setStatus(1);													// 신규 상태로 다시한번 변경 ( 고객정보 유무 체크 )
}

/**
 * 초기화 취소 버튼
 * @returns
 * 21-01-07 최준혁
 */
function cancelCustInfo(){
	initSemi();
	currentCustInfo = tempCustInfo;									// 임시저장된 고객정보를 다시 세팅
	if(currentCustInfo.CUST_ID != ""){
		loadCustInfoMain();												// 고객 정보 재 조회
	}else {
		ModalUtil.modalPop("알림","고객이 존재 하지 않아 조회 할 수 없습니다.");
	}
}

$(function(){
	
	var settings = {
			url: `${API_SERVER}/sys.getList.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{CD_TBL : "TB_PROGRAM"}],
			}),
		}

		$.ajax(settings)
			.done(data => {
				tableList = data.dsRecv;
				faxUrl = tableList.filter(el => ["ETC2000"].includes(el.PGM_ID))[0].PATH;		// fax url 가져오기
			})
			.fail(error => {
				
			});
	
	// === === === === === === === === === === === === === === === === === === === //// INITIALIZING //// === === === === === === === === === === === === === === === === === === === 
	initAll();
	
	// 탑바 클라이언트 저장
	topBarClient = client;
	
	// 현재 사용자 정보 객체로 저장
	getCurrentUserInfo();
	
	// 사이드바 클라이언트 저장
	client.get('instances').then(function(instancesData) {
		var instances = instancesData.instances;
		//console.log('client instances : ', instances);
		for ( var instanceGuid in instances) {
			if (instances[instanceGuid].location === 'ticket_sidebar') {
				sidebarClient = client.instance(instanceGuid);
			}else if(instances[instanceGuid].location === 'background'){
				backgroundClient = client.instance(instanceGuid);
				backgroundClient.trigger('getCodeList', client._instanceGuid);			// background에서 공통 코드를 가져온다.
			}
		}
	});
	
	// input mask
	$(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
	
	var maskOptions = {
	  mask: '*00000-0000000'
	};
	var mask = IMask(document.getElementById('custInfo_FAT_RSDNO'), maskOptions);
	
	setTimeout(function(){
		$('.multiSelect').multipleSelect();
	}, 5000);
	// === === === === === === === === === === === === === === === === === === === //// EVENT //// === === === === === === === === === === === === === === === === === === === 
	
	// 주소창 팝업 EVENT INPUT ENTER KEY BIND
	$(".addressPop").keyup(function(e){
		var keyCode = e.which;
		if(keyCode === 13){
			PopupUtil.open('CCEMPRO043', 1100, 700);
		}
	});
	// 사업국 팝업 EVENT INPUT ENTER KEY BIND
	$(".deptPop").keyup(function(e){
		var keyCode = e.which;
		if(keyCode === 13){
			PopupUtil.open('CCEMPRO044', 1145, 475);
		}
	});
	// 센터 팝업 EVENT INPUT ENTER KEY BIND
	$(".LCPop").keyup(function(e){
		var keyCode = e.which;
		if(keyCode === 13){
			PopupUtil.open('CCEMPRO044', 1145, 475);
		}
	});
	
	// 음력,양력 전환
	$(".birthLunar").click(function(){
		if($(this).attr('id') == "solar"){
			$("#lunar").css('display','');
			$("#solar").css('display','none');
			$("#lunarSolarInput").val("2");
		}else {
			$("#solar").css('display','');
			$("#lunar").css('display','none');
			$("#lunarSolarInput").val("1");
		}
	});
	
	// === === === === === === === === === === === === === === === === === === === === === === === === === === 고객찾기 선생님찾기 검색
	//검색 input 이벤트 1
	$(".searchInputCheck").keyup(function(e){
		var keyCode = e.which;
		if (keyCode === 13) { // Enter Key
			$("#"+$(this).parent().parent().parent().parent().parent().attr("id") + "Btn").click();
		}
		if($(this).val().length != 0){	// 길이가 0일 경우 체크해제
			$("#"+$(this).attr("id") + "Check").prop("checked",true);
		}else {
			$("#"+$(this).attr("id") + "Check").prop("checked",false);
		}
	});
	
	// 고객, 선생님찾기 input 이벤트 2
	$(".searchInputCheck").change(function(e){
		//$("#"+$(this).attr("id") + "Check").prop("checked",true);
		if($(this).val().length != 0){	// 길이가 0일 경우 체크해제
			$("#"+$(this).attr("id") + "Check").prop("checked",true);
		}else {
			$("#"+$(this).attr("id") + "Check").prop("checked",false);
		}
	});
	
	// 조회버튼 부
	$(".searchBtn").click(function(){
		var currentDiv = $(this).parent().attr("id");
		customerSearch(currentDiv);
	});
	// === === === === === === === === === === === === === === === === === === === === === === === === === === /검색
	
	// 오른쪽 DIV 컨테이터 스크롤 상단 이동
	$("#goToTop").click(function(){
		$('.rightSideScroll').scrollTop(0);
	});
	
	// 탭 이동시 이벤트
	$("a[data-toggle='tab']").on("shown.bs.tab", function(e) {
		id = $(this).attr('id');
		if(custInfoStatus == 1 && 
				(id == 'customerStudyHist' || id == 'membershipDue' || id == 'payCheck' || id == 'changeHist' || id == 'infoAgree' || id == 'autoQuit' || id == 'custInv' || id == 'smsList') && 
				currentCustInfo.CUST_ID != "") {	// 신규 작성 중일 시
			cancelCustInfo();
			ModalUtil.modalPop('알림', '신규 등록이 취소 되었습니다.');
			return;
		}
		switch($(this).attr('id')){
		// 고객정보
		case 'customerInfo':
			counselMain_counselHist_grid.refreshLayout();
			counselMain_studyProgressList_grid.refreshLayout();
			counselMainTeacher_counselHist_grid.refreshLayout();
			break;
		// 고객정보 - 고객, 선생님
		case 'customerTab':
			$("#assignMemberbtn").css("display","");
			$("#transferCallbtn").css("display","none");
			$("#csel_cust").css("display","");
			$("#csel_tchr").css("display","none");
			$("#csel_t_cust").css("display","");
			$("#csel_t_tchr").css("display","none");
			break;
		case 'teacherTab':
			$("#csel_cust").css("display","none");
			$("#csel_tchr").css("display","");
			$("#csel_t_cust").css("display","none");
			$("#csel_t_tchr").css("display","");
			$("#assignMemberbtn").css("display","none");
			$("#transferCallbtn").css("display","");
			counselMainTeacher_counselHist_grid.refreshLayout();
			break;
		// 고객찾기
		case 'customerSearch':
			customerSearchList_grid.refreshLayout();
			teacherSearchList_grid.refreshLayout();
			$("#customerName").focus();
			break;
			
		// 상담이력
		case 'customerCounselHist':
			counselMain_counselHist_grid.refreshLayout();
			counselMain_studyProgressList_grid.refreshLayout();
			break;
			
		// 학습이력
		case 'customerStudyHist':
			if(currentCustInfo.MBR_ID != "" && currentCustInfo.MBR_ID != null){
				loadList('ifsStudyClass', counselMain_studyTab_weeklyStat);
			}
			counselMain_studyTab_weeklyStat.refreshLayout();
			break;
		// 변동이력
		case 'studyTab_changeHist':
			counselMain_studyTab_changeHist.refreshLayout();
			break;
		// 불출교재
		case 'studyTab_asignStuff':
			counselMain_studyTab_asignStuff.refreshLayout();
			counselMain_studyTab_asignStuff2.refreshLayout();
			break;
		// 회비
		case 'membershipDue':
			if(currentCustInfo.MBR_ID != "" && currentCustInfo.MBR_ID != null){
				$("#memberCashReceipt").attr('disabled', false);
				$("#memberAutoTransfer").attr('disabled', false);
				$("#memberCardCharge").attr('disabled', false);
				$("#memberRefund").attr('disabled', false);
				$("#memberTransferInfo").attr('disabled', false);
				loadList('getFeeInfo',counselMain_membershipDueTab_dueList);
				var param = {
						userid: currentUserInfo.user.external_id,
					    menuname: '회비',
					    senddataids: ["send1"],
					    recvdataids: ["recv1"],
					    send1: 	[
					    			{
					    				"MBR_ID": 	currentCustInfo.MBR_ID,
					    			}
					    		]
					};
				// 현금영수증 증빙번호 조회
				$.ajax({
					url: API_SERVER + '/cns.getCashNo.do',
					type: 'POST',
					dataType: 'json',
					contentType: "application/json",
					data: JSON.stringify(param),
					success: function (response) {
						console.log(response);
						if(response.errcode == "0"){
							if(response.recv1.length > 0){
								$("#memDue_cashNo").text(response.recv1[0].BILL_NUM);
							}
						}
					}
				});
				/*$.ajax({
					url: API_SERVER + '/cns.getAcctTrans.do',
					type: 'POST',
					dataType: 'json',
					contentType: "application/json",
					data: JSON.stringify(param),
					success: function (response) {
						if(response.errcode == "0"){
							if(response.recv1.length != 0){
								$("#memDue_accountNum").text(response.recv1[0].TRS_ACCT_ID.substring(0,4) + "**********");	// 계좌번호
								$.ajax({
									url: API_SERVER + '/cns.getAcctTransInfo.do',
									type: 'POST',
									dataType: 'json',
									contentType: "application/json",
									data: JSON.stringify({
										userid: currentUserInfo.user.external_id,
										menuname: '회비',
										senddataids: ["send1"],
										recvdataids: ["recv1"],
										send1: 	[
											{
												"MBR_ID": 		currentCustInfo.MBR_ID,				// 회원번호
												"TRS_ACCT_ID":	response.recv1[0].TRS_ACCT_ID,		// 계좌번호
												"BANK_ID":		response.recv1[0].BANK_ID,			// 은행코드
												"RCPT_MK":		currentDueInfo.RCPT_MK,				// 입금제품구분
											}
											]
									}),
									success: function (response) {
										console.log(response);
										if(response.errcode == "0"){
											$("#memDue_ACCT_DAY").text(response.recv1[0].TRS_ACCT_DAY + "일");					// 이체일자
											$("#memDue_BANK_NAME").text(response.recv1[0].BANK_NAME);							// 은행명
											$("#memDue_ACCT_STDATE").text(FormatUtil.date(response.recv1[0].TRS_ACCT_STDATE));	// 이체신청일자
											$("#memDue_ACCT_EDDATE").text(FormatUtil.date(response.recv1[0].TRS_ACCT_EDDATE));	// 이체해지일자
											$("#memDue_ACCT_NAME").text(response.recv1[0].TRS_ACCT_NAME);						// 예금주
										}
									}
								});
							}
						}else {
							client.invoke("notify", "계좌번호를 불러오지 못했습니다.", "error", 60000);
						}
					}
				});*/
			}else {
				$("#memberCashReceipt").attr('disabled', true);
				$("#memberAutoTransfer").attr('disabled', true);
				$("#memberCardCharge").attr('disabled', true);
				$("#memberRefund").attr('disabled', true);
				$("#memberTransferInfo").attr('disabled', true);
			}
			
			counselMain_membershipDueTab_dueList.refreshLayout();			// 상담메인 > 회비	   > 회비정보 grid
			counselMain_membershipDueTab_subChargeList.refreshLayout();		// 상담메인 > 회비	   > 과목별 입금내역 grid
			counselMain_membershipDueTab_chargeList.refreshLayout();
		// 직접결제
		case 'payCheck':
			if(currentCustInfo.MBR_ID != "" && currentCustInfo.MBR_ID != null){
				loadList('getCustPayMst', counselMain_directCharge_duesInfo_grid);
			}
			counselMain_directCharge_duesInfo_grid.refreshLayout();
			counselMain_directCharge_reciverInfo_grid.refreshLayout();
			break;
		// 변경이력
		case 'changeHist':
			if(currentCustInfo.CUST_ID != ""){
				loadList('getDet', counselMain_changeHist_studySpot_grid);
				loadList('getChgCustInfoHist', counselMain_changeHist_changeDetail_grid);
			}
			counselMain_changeHist_studySpot_grid.refreshLayout();
			counselMain_changeHist_changeDetail_grid.refreshLayout();
			break;
		// 개인정보동의
		case 'infoAgree':
			if(currentCustInfo.MBR_ID != "" && currentCustInfo.MBR_ID != null){
				loadList('getErrNewMBR', counselMain_infoAgree_infoAgreeList_grid);
				loadList('getErrEntInfo', counselMain_infoAgree_termsVersion_grid);
			}
			counselMain_infoAgree_infoAgreeList_grid.refreshLayout();
			counselMain_infoAgree_termsVersion_grid.refreshLayout();
			break;
		// 자동퇴회
		case 'autoQuit':
			if(currentCustInfo.MBR_ID != "" && currentCustInfo.MBR_ID != null){
				loadList('getDropDtl', counselMain_autoResign_resignDetail_grid);
				loadList('getDropMsg', counselMain_autoResign_resignSendList_grid);
			}
			counselMain_autoResign_resignDetail_grid.refreshLayout();
			counselMain_autoResign_resignSendList_grid.refreshLayout();
			break;
		// 고객조사
		case 'custInv':
			if(currentCustInfo.CUST_ID != ""){
				loadList('getTBLISTbyCUSTID', counselMain_researchCust_rsrchCust_grid);
			}
			counselMain_researchCust_rsrchCust_grid.refreshLayout();
			//counselMain_directCharge_reciverInfo_grid.refreshLayout();
			/*var counselMain_researchCust_rsrchCust_grid = null;		// 상담메인	> 고객조사 > 고객조사 grid
			var counselMain_researchCust_rschCallHist_grid = null;		// 상담메인	> 고객조사 > 통화이력 grid
			var counselMain_researchCust_smsLmsHist_grid = null;		// 상담메인	> 고객조사 > 설문조사 grid
			*/
			break;
		// SMS/LMS 이력
		case 'smsList':
			if(currentCustInfo.CUST_ID != ""){
				loadList('getTB_SMSDATA', counselMain_researchCust_smsLmsHist_grid);
			}
			counselMain_researchCust_smsLmsHist_grid.refreshLayout();
			break;
			
		// 고객찾기
		case 'customerSearchTab' :
			customerSearchList_grid.refreshLayout();
			break;
		// 선생님찾기
		case 'teacherSearchTab' :
			teacherSearchList_grid.refreshLayout();
			$("#teacherName").focus();
			break;
		// 교실정보
		case 'teacher_class' :
			counselMainTeacher_asignClassGrid.refreshLayout();
			counselMainTeacher_classMemberGrid.refreshLayout();
			loadList('ifsClassInfo',counselMainTeacher_asignClassGrid);
			break;
		}
		
		
	});
	
	// 복수학습 select 변경이벤트
	$(".studyCombo").change(function() {
		var currentSelect = $(this).attr('id').split("_")[1];
		if(currentSelect == 'DEPT'){
			$("#custInfo_DEPT_ID").val($(this).val());
			$("#custInfo_DEPT_NAME").val($(this).find('option:selected').text());
			$("#custInfo_TELPNO_DEPT").val($(this).find('option:selected').attr('tel'));
			//$("#custInfo_LC_NM_study").find('option:selected').text();
			$("#custInfo_LC_NM_study").empty();
			lcData.forEach(d => {
				if($("#custInfo_DEPT_NAME_study").find('option:selected').val() == d.DEPT_ID){
					$("#custInfo_LC_NM_study").append(`<option value=${d.LC_ID} tel=${d.TELPNO}>${d.LC_NM}</option>`);
				}
			});
			
			$("#custInfo_LC_NAME").val($("#custInfo_LC_NM_study").find('option:selected').text());
			$("#custInfo_TELPNO_LC").val($("#custInfo_LC_NM_study").find('option:selected').attr('tel'));
			/*$("#custInfo_LC_NAME").val("");
			$("#custInfo_TELPNO_LC").val("");*/
			
			
		}else {
			$("#custInfo_LC_NAME").val($(this).find('option:selected').text());
			$("#custInfo_TELPNO_LC").val($(this).find('option:selected').attr('tel'));
		}
	});
	
	/*$("#custInfo_FAMILY_CMB").change(function() {
		relCustChange();
	});*/
	
	// 관계회원 콤보 change 이벤트
	$('#custInfo_FAMILY_CMB').click(function(){
	    var $this = $(this);
	    
	    if ($this.hasClass('openSelect')) {
	        relCustChange();
	        $this.removeClass('openSelect');
	    }else {
	        $this.addClass('openSelect');
	    }  
	})

	$(document).click(function(e){
	    var $select = $('#custInfo_FAMILY_CMB');

	    if (!$select.is(e.target)){
	        $select.removeClass('openSelect');
	    }
	});
	
	// 팝업 버튼
	/*$(".popup-btn").click(function() {
		var popDepth = $(this).attr('id').split('_').length;
		if(popDepth == '2'){
			var popName = $(this).attr('id').split('_')[0];
			w = 1154;
			h = 680;
			if(currentPop.name != "" && currentPop.name != null){
				currentPop.focus();
				//currentPop.exitAlert(popName,w,h);
			}else {
				openPop(popName,w,h);
			}
			openPop(popName,w,h);
		}else if(popDepth == '3'){		// 팝업 안의 팝업
			var popName = $(this).attr('id').split('_')[0]+'_'+$(this).attr('id').split('_')[1];
			w = 500;
			h = 660;
			console.log(currentUnPop);
			if(currentUnPop.name != "" && currentUnPop.name != null){
				currentUnPop.focus();
				currentUnPop.exitAlert(popName,w,h);
			}else {
				openUnPop(popName,w,h);
			}
		}
	});*/
	
	// 관계번호 생성 이벤트
	$("#custInfo_FAT_RSDNO").keyup(function(e){
		var keyCode = e.which;
		if(keyCode === 13){
			if($("#custInfo_DDD").val().length != 0 && $("#custInfo_TELPNO1").val().length != 0 && $("#custInfo_TELPNO2").val().length == 4){
				var tempRSDNO = "C" + $.trim($("#custInfo_DDD").val()) + $.trim($("#custInfo_TELPNO1").val()) + $.trim($("#custInfo_TELPNO2").val());
				if(tempRSDNO.length < 13){
					var fullLength = tempRSDNO.length;
					console.log(13 - fullLength);
					for(var i = 0; i < 13 - fullLength; i++){
						tempRSDNO += "0";
					}
				}
				$("#custInfo_FAT_RSDNO").val(tempRSDNO.substring(0,6) + "-" + tempRSDNO.substring(6,13));
			}else {
				ModalUtil.modalPop('알림', '자택 전화번호를 입력 후 가능합니다.');
				$("#custInfo_FAT_RSDNO").focus();
			}
		}
	});
// ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  === EVENT  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  === 
});

// document.ready 끝

/**
 * 현재 사용자 정보 불러오기
 * @returns
 */
function getCurrentUserInfo(){
	client.request('/api/v2/users/me.json').then(function(d){
		currentUserInfo = d;
	});
};

/**
 * 고객,선생님 조회 func
 * @param Stringd
 * @returns
 * 20-12-17 최준혁
 */
function customerSearch(currentDiv, type){
	switch(currentDiv){
	case 'custSearchDiv' : 															// 고객 조회
		var param = {
			userid: currentUserInfo.user.external_id,
		    menuname: '고객찾기(고객)',
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{
		    	"CHK_NAME"		:"",				// 고객명 여부
		    	"CHK_TELNO"		:"",				// 전화번호 여부
		    	"CHK_HPNO"		:"",
		    	"CHK_GRADE"		:"",				// 학년 여부
		    	"CHK_CUSTID"	:"",				// 회원번호 여부
		    	"CHK_RSDNO"		:"",				// 생년월일 여부
		    	"CHK_ADDR"		:"",				// 주소 여부
		    	"CHK_PROD"		:"",				// 과목 여부
		    	"CHK_DEPT"		:"",				// 지점 검색 여부 (Y면 조회)
		    	"CHK_UP_DEPT"	:"",				// 본부 검색 여부 (Y면 조회)
		    	"CHL_LCID"		:"",				// 센터검색 여부(Y면 조회)
		    	"CHK_EDUPIA"	:"",
		    	"CHK_EMAIL"		:"",				// 이메일 여부
		    	"CHK_MACADAMIA"	:"",
		    	"NAME"			:"",
		    	"TELPNO"		:"",
		    	"MOBILNO"		:"",
		    	"GRADE_CDE"		:"",
		    	"MBR_ID"		:"",
		    	"RSDNO"			:"",
		    	"ADDR"			:"",
		    	"PRDT_ID"		:"",
		    	"DEPT_NAME"		:"",
		    	"UPDEPTID"		:"",
		    	"EDUPIA_ID"		:"",
		    	"CHK_CID"		:"Y",
		    	"DDD"			:"",
		    	"TELPNO1"		:"",
		    	"CHL_LCID"		:"",
		    	"LC_NM"			:"",
		    	"CHK_AUTO_CHG"	:"0",
		    	"CUST_MK"		:"",
		    	"EMAIL"			:"",
		    	"MACADAMIA_ID"	:"",
		    }]
		};
		var validationBool = false;
		if($("#customerNameCheck").is(":checked")){				// 고객명
			param.send1[0].CHK_NAME = "Y";
			param.send1[0].NAME = $("#customerName").val();
			validationBool = true;
		}
		if($("#customerPhoneCheck").is(":checked")){			// 전화번호
			param.send1[0].CHK_TELNO = "Y";
			param.send1[0].TELPNO = $("#customerPhone").val();
			validationBool = true;
		}
		if($("#customerEmailCheck").is(":checked")){			// EMAIL
			param.send1[0].CHK_EMAIL = "Y";
			param.send1[0].EMAIL = $("#customerEmail").val();
			validationBool = true;
		}
		if($("#customerGradeCheck").is(":checked")){			// 학년
			param.send1[0].CHK_GRADE = "Y";
			param.send1[0].GRADE_CDE = $("#customerGrade").val();
			validationBool = true;
		}
		if($("#customerMNumCheck").is(":checked")){				// 회원번호
			param.send1[0].CHK_CUSTID = "Y";
			param.send1[0].MBR_ID = $("#customerMNum").val();
			validationBool = true;
		}
		if($("#customerBirthCheck").is(":checked")){			// 생년월일
			param.send1[0].CHK_RSDNO = "Y";
			param.send1[0].RSDNO = $("#customerBirth").val();
			validationBool = true;
		}
		if($("#customerAddrCheck").is(":checked")){				// 주소
			param.send1[0].CHK_ADDR = "Y";
			param.send1[0].ADDR = $("#customerAddr").val();
			validationBool = true;
		}
		if($("#customerSubjectCheck").is(":checked")){			// 과목
			param.send1[0].CHK_PROD = "Y";
			param.send1[0].PRDT_ID = $("#customerSubject").val();
			validationBool = true;
		}
		if($("#customerSpotCheck").is(":checked")){				// 사업국
			param.send1[0].CHK_DEPT = "Y";
			param.send1[0].DEPT_NAME = $("#customerSpot").val();
			validationBool = true;
		}
		if($("#customerDeptCheck").is(":checked")){				// 본부
			param.send1[0].CHK_UP_DEPT = "Y";
			param.send1[0].UPDEPTID = $("#customerDept").val();
			validationBool = true;
		}
		if($("#customerLCCheck").is(":checked")){				// LC 센터
			param.send1[0].CHL_LCID = "Y";
			param.send1[0].LC_NM = $("#customerLC").val();
			validationBool = true;
		}
		if(validationBool == false){
			client.invoke("notify", "조회조건을 하나 선택해야 합니다.", "error", 6000);
			return;
		}
		
		$.ajax({
		    url: API_SERVER + '/cns.getCustList.do',
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(param),
		    success: function (response) {
		        console.log(response);
		        if(response.errcode == "0"){
		        	customerSearchList_grid.resetData(response.recv1);
		        	customerSearchList_grid.refreshLayout();
		        	// 조회된 수가 1명 일 경우 자동 조회, 전화인입일경우 
		        	if(response.recv1.length == "1" && type == '1'){
		        		initAll(); 													// 기존 정보 초기화
		        		custInfo = customerSearchList_grid.getRow(0);
		        		onAutoSearch(custInfo.CUST_ID);
		        		
		        	}
		        	
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
		break;
		
		
	case 'teacherSearchDiv' :														// 선생님 조회					
		var param = {
			userid: currentUserInfo.user.external_id,
		    menuname: '고객찾기(선생님)',
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: 	[
		    			{
		    				"TCHR_NAME": 	"김소라",
		    				"EMP_ID":		"",
		    				"EMP_MK":		"",
		    				"DEPT_NAME":	"",
		    				"DIV_CDE":		"",
		    				"STS_CDE":		"",
		    				"LC_NM":		"",
		    				"CHK_TCHR_NAME":"",
		    				"CHK_EMP_ID":	"",
		    				"CHK_EMP_MK":	"",
		    				"CHK_DEPT_NAME":"",
		    				"CHK_DIV_CDE":	"",
		    				"CHK_STS_CDE":	"",
		    				"CHK_LC_NM":	""
		    			}
		    		]
		};
		var validationBool = false;
		if($("#teacherNameCheck").is(":checked")){			// 선생님명
			param.send1[0].CHK_TCHR_NAME = "Y";
			param.send1[0].TCHR_NAME = $("#teacherName").val();
			validationBool = true;
		}
		if($("#teacherDNumCheck").is(":checked")){			// 사원번호
			param.send1[0].CHK_EMP_ID = "Y";
			param.send1[0].EMP_ID = $("#teacherDNum").val();
			validationBool = true;
		}
		if($("#teacherStatCheck").is(":checked")){			// 재직구분
			param.send1[0].CHK_STS_CDE = "Y";
			param.send1[0].STS_CDE = $("#teacherStat").val();
			validationBool = true;
		}
		if($("#teacherLCNameCheck").is(":checked")){		// 센터
			param.send1[0].CHK_LC_NM = "Y";
			param.send1[0].LC_NM = $("#teacherLCName").val();
			validationBool = true;
		}
		if($("#teacherDeptNameCheck").is(":checked")){		// 사업국
			param.send1[0].CHK_DEPT_NAME = "Y";
			param.send1[0].DEPT_NAME = $("#teacherDeptName").val();
			validationBool = true;
		}
		if($("#teacherUpDeptNameCheck").is(":checked")){	// 본부
			param.send1[0].CHK_DIV_CDE = "Y";
			param.send1[0].DIV_CDE = $("#teacherUpDeptName").val();
			validationBool = true;
		}
		if(validationBool == false){
			client.invoke("notify", "조회조건을 하나 선택해야 합니다.", "error", 6000);
			return;
		}
		
		$.ajax({
		    url: API_SERVER + '/cns.getTchrSearchInfo.do',
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(param),
		    success: function (response) {
		        console.log(response);
		        if(response.errcode == "0"){
		        	teacherSearchList_grid.resetData(response.recv1);
		        	teacherSearchList_grid.refreshLayout();
		        	// 조회된 수가 1명 일 경우 자동 조회, 전화인입일경우 
		        	if(response.recv1.length == "1" && type == '1'){
		        		initAll(); 													// 기존 정보 초기화
		        		tchrInfo = teacherSearchList_grid.getRow(0);
		        		onAutoSearchTeacher(tchrInfo.EMP_ID);
		        		
		        	}
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
		break;
	}
}

/**
 * 고객정보 상세 조회
 * @param sCustId
 * @returns
 * 21-01-11 최준혁
 */
function onAutoSearch(sCustId, type){
	if(sCustId != ""){
		var param = {
				userid: currentUserInfo.user.external_id,
			    menuname: '고객정보(고객)',
				senddataids: ["send1"],
				recvdataids: ["recv1"],
				send1: [{
					"CUST_ID"		:sCustId,				// 회원번호
				}]
		};
		$.ajax({
			url: API_SERVER + '/cns.getCustInfo.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				if(response.errcode == "0"){
					currentCustInfo = response.recv1[0];				// 고객정보 상주
					if(type != '1'){
						loadCustInfoMain();									// 고객정보 로드 함수
					}
					// 젠데스크 고객 검색 ( requester id 를 구하기 위함 )
					/*client.request(`https://daekyo-ccm.zendesk.com/api/v2/search.json?query=type:user ${currentCustInfo.CUST_ID}`).then(function(d){
						console.log(d);
						if(d.count >= 1){					
							if(currentTicketInfo.ticket.externalId == null){
								// 신규 인입 티켓이며, 기존 젠데스크에 고객이 있는 경우 기존고객과 임시 end-user merge
								var option = {
									url: `https://daekyo-ccm.zendesk.com/api/v2/users/${currentTicketInfo.ticket.requester.id}/merge.json`,
									type: 'PUT',
									dataType: 'json',
									contentType: "application/json",
									data: JSON.stringify({
										"user": {
											"id": d.results[0].id,
										}
									})
								}
								client.request(option).then(function(d) {
									client.invoke("notify", "해당 고객이 기존 고객과 통합 되었습니다.", "notice", 5000);
								});
							}else {
								updateUserforZen();
							}
						}else {
							updateUserforZen();
						}
					});*/
					sOrgFAT_RSDNO = currentCustInfo.FAT_RSDNO; 			// 학부모 주민번호 변경여부 체크 변수
					updateUserforZen();
				}else {
					loading.out();
					client.invoke("notify", response.errmsg, "error", 60000);
				}
			}, error: function (response) {
			}
		});
	}else {
		ModalUtil.modalPop("알림","고객이 존재 하지 않아 조회 할 수 없습니다.");
	}
}

/**
 * 선생님정보 상세 조회
 * @param tchrId
 * @returns
 * 21-01-19 최준혁
 */
function onAutoSearchTeacher(sEmpId, type){
	if(sEmpId != ""){
		var param = {
				userid: currentUserInfo.user.external_id,
			    menuname: '고객정보(선생님)',
				senddataids: ["send1"],
				recvdataids: ["recv1"],
				send1: [{
					"EMP_ID"		:sEmpId,				// 회원번호
				}]
		};
		$.ajax({
			url: API_SERVER + '/cns.getTchrInfoDtl.do',
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				if(response.errcode == "0"){
					currentTchrInfo = response.recv1[0];				// 선생님정보 상주
					console.log(currentTchrInfo);
					if(type != "1"){
						loadTeacherInfoMain();									// 선생님정보 로드 함수
					}
					// 젠데스크 고객 검색 ( requester id 를 구하기 위함 )
					/*client.request(`https://daekyo-ccm.zendesk.com/api/v2/search.json?query=type:user ${currentTchrInfo.EMP_ID}`).then(function(d){
						console.log(d);
						if(d.count >= 1){					
							if(currentTicketInfo.ticket.externalId == null && (currentTicketInfo.ticket.tags.includes("in") || currentTicketInfo.ticket.tags.includes("zopim_chat"))){
								// 신규 인입 티켓이며, 기존 젠데스크에 고객이 있는 경우 기존고객과 임시 end-user merge
								var option = {
										url: `https://daekyo-ccm.zendesk.com/api/v2/users/${currentTicketInfo.ticket.requester.id}/merge.json`,
										type: 'PUT',
										dataType: 'json',
										contentType: "application/json",
										data: JSON.stringify({
											"user": {
												"id": d.results[0].id,
											}
										})
									}
									client.request(option).then(function(d) {
										client.invoke("notify", "해당 고객이 기존 고객과 통합 되었습니다.", "notice", 5000);
									});
							}else {
								updateTchrforZen();
							}
						}else {
							updateTchrforZen();
						}
					});*/
					updateTchrforZen();
				}else {
					loading.out();
					client.invoke("notify", response.errmsg, "error", 60000);
				}
			}, error: function (response) {
			}
		});
	}else {
		ModalUtil.modalPop("알림","사원번호가 존재 하지 않아 조회 할 수 없습니다.");
	}
}
function openPop(popName,w,h){
	console.log(popName);
	currentPop = window.open('pop_'+popName+'.html',popName,'width='+w+', height='+h+', toolbar=no, menubar=no, scrollbars=no, resizable=no');
};
function openUnPop(popName,w,h){
	console.log(popName);
	currentUnPop = window.open('pop_'+popName+'.html',popName,'width='+w+', height='+h+', toolbar=no, menubar=no, scrollbars=no, resizable=no');
};

/** 
 * 공통코드 조회
 */
const getCodeList = () => {
	
	var jb = $( 'select' ).get();
	var CODE_MK_LIST = [];
	for(dataObj of jb){
		if(dataObj["name"] != "" && dataObj["name"] != null){
			CODE_MK_LIST.push(dataObj["name"]);
		}
	}
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
	/*CODE_MK_LIST.forEach(codeName => {
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
			$("#custInfo_CUST_MK").val("CM");		// 임시 .. 잠재회원으로 기본설정
		});
	});*/
}

/**
 * 상담 과목 리스트 조회
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
		console.log(prods);
		for(p of prods){
			codeNm = p.PRDT_NAME;
			codeVal = p.PRDT_ID;
			$(`select[name='PRDT_ID']`).append(new Option(codeNm, codeVal));
		}
	});
}

/**
 * 인증&동의방법 설정 함수
 * @returns
 * 21-01-06 최준혁
 */
function setCertData(){
	
    // 인증방법
    if(currentCustInfo.CERT_GB == "S") {
    	$("#custInfo_CERT_GB").text("SMS");    	    	    	
    }else if(currentCustInfo.CERT_GB == "R") {	
    	$("#custInfo_CERT_GB").text("녹취");
    }else{
    	$("#custInfo_CERT_GB").text("");    	
    }    
    
    //인증상태
    // 4, 8 동의실패
    // 2, 6, 7 동의완료
    // 9 요청취소
    // 1 나머지는 빈값
    var sApprv_gb = currentCustInfo.APPRV_GB;
    if(sApprv_gb == "4" || sApprv_gb == "8") {
    	$("#custInfo_APPRV_GB").text("동의실패");
    }else if(sApprv_gb == "2" || sApprv_gb == "6" || sApprv_gb == "7") {	
    	$("#custInfo_APPRV_GB").text("동의완료");    	    	    	
	}else if(sApprv_gb == "9") {	
		$("#custInfo_APPRV_GB").text("요청취소");    	    	    	
    }else{
    	$("#custInfo_APPRV_GB").text("");    	    	    	
    } 
        
    // 정보동의 
    $("#custInfo_SMS_SEND_DT").text(FormatUtil.dateTime(currentCustInfo.SMS_SEND_DT));
    $("#custInfo_SMS_REV_DT").text(FormatUtil.dateTime(currentCustInfo.SMS_REV_DT));
    //txtCERT_SEND_DT.value = gf_formatToTime(DS_CUST.nameValue(1,"SMS_SEND_DT"), 'KRDT-TM:');        
    //txtCERT_REV_DT.value = gf_formatToTime(DS_CUST.nameValue(1,"SMS_REV_DT"), 'KRDT-TM:');	
}

/**
 * 회원정보 조회, 화면 로드
 * @returns
 * 2020-12-30 최준혁
 */
function loadCustInfoMain() {
	$("#customerInfo").click();	// 탭 이동
	$("#customerTab").click();	// 탭 이동
	for(key in currentCustInfo){												// input 자동 기입
		if($("#custInfo_" + key).length != 0){
			switch($("#custInfo_" + key)[0].localName){
			case "select" :
				$("#custInfo_" + key).val(currentCustInfo[key]);
				break;
			case "input" :
				$("#custInfo_" + key).val(currentCustInfo[key]);
				break;
			case "span" :
				$("#custInfo_" + key).text(currentCustInfo[key]);
				break;
			}
		}
	}
	
	$("#custInfo_BIRTH_YMD").val(FormatUtil.date(currentCustInfo.BIRTH_YMD));	// 생일 포멧 
	
	var tempMobileNo = FormatUtil.tel(currentCustInfo.MOBILNO);
	if(tempMobileNo){
		$("#custInfo_MOBILNO1").val(tempMobileNo.split("-")[0]);					// 회원 휴대폰
		$("#custInfo_MOBILNO2").val(tempMobileNo.split("-")[1]);
		$("#custInfo_MOBILNO3").val(tempMobileNo.split("-")[2]);
	}
	
	tempMobileNo = FormatUtil.tel(currentCustInfo.MOBILNO_LAW);
	if(tempMobileNo){
		$("#custInfo_MOBILNO_LAW1").val(tempMobileNo.split("-")[0]);				// 대리인 휴대폰
		$("#custInfo_MOBILNO_LAW2").val(tempMobileNo.split("-")[1]);
		$("#custInfo_MOBILNO_LAW3").val(tempMobileNo.split("-")[2]);
	}
	tempMobileNo = FormatUtil.tel(currentCustInfo.MOBILNO_MBR);
	if(tempMobileNo){
		$("#custInfo_MOBILNO_MBR1").val(tempMobileNo.split("-")[0]);				// 학부모 휴대폰
		$("#custInfo_MOBILNO_MBR2").val(tempMobileNo.split("-")[1]);
		$("#custInfo_MOBILNO_MBR3").val(tempMobileNo.split("-")[2]);
	}
	var maskOptions = {
			mask: '*00000-0000000'
	};
	IMask(document.getElementById('custInfo_FAT_RSDNO'), maskOptions);
	
	/*if(currentCustInfo.FAT_RSDNO){													// 관계번호
		$("#custInfo_FAT_RSDNO").val(currentCustInfo.FAT_RSDNO.substring(0,7)+ "-"+currentCustInfo.FAT_RSDNO.substring(6,13));
	}*/
	
	if(currentCustInfo.BIRTH_MK == "1"){
		$("#solar").css('display','');
		$("#lunar").css('display','none');
		$("#lunarSolarInput").val("1");
	}else {
		$("#lunar").css('display','');
		$("#solar").css('display','none');
		$("#lunarSolarInput").val("2");
	}
	
	if(currentCustInfo.BL_BLACK_YN == "Y"){
		$("#blackAndVipArea").css("display","");
		$("#blackAndVipDT").text(currentCustInfo.BLACK_CUST_MK_NAME);
	}else {
		$("#blackAndVipArea").css("display","none");
	}
	
		
	familyInfoLoad();												// 관계회원정보 불러오기
	studyInfoLoad();												// 복수학습정보 불러오기
	setCertData();													// 정보동의 NAME 맵핑
	
	loadList('counselHist', counselMain_counselHist_grid);			// 상담이력 목록 불러오기				//OLD >> counselHistLoad();		// 상담이력 목록 불러오기
	loadList('currentStudy', counselMain_studyProgressList_grid);	// 학습진행정보 목록 불러오기			//OLD >> currentStudyLoad();	// 학습진행정보 목록 불러오기

	setStatus(2);													// 조회 상태로 변경
}

// === === === ZENDESK
// 젠데스크에 사용자 정보 저장 ccem과의 데이터 무결성을 위해 조회시마다 젠데스크 user Update.
function updateUserforZen(){
	var option = {
			url: '/api/v2/users/create_or_update.json',
			method: 'POST',
			contentType: "application/json",
			data: JSON.stringify({
				"user": {
					"external_id": currentCustInfo.CUST_ID,
					//"email": $("#custInfo_REP_EMAIL_ADDR").val(),
					"phone": currentCustInfo.MOBILNO,
					"user_fields": 
					{
						"bonbu": currentCustInfo.UPDEPTNAME,
						"dept" : currentCustInfo.DEPT_NAME,
						"center" : currentCustInfo.LC_NAME,
						"grade" : $("#custInfo_GRADE_CDE").find("option[value="+ currentCustInfo.GRADE_CDE +"]").text(),
						"mobilno_mother" : currentCustInfo.MOBILNO_MBR,
						"mobilno_father" : "",
						"mobile_legal" : currentCustInfo.MOBILNO_LAW?currentCustInfo.MOBILNO_LAW.replace(/-/gi,""):"",
						"home_tel" : currentCustInfo.DDD+currentCustInfo.TELPNO1+currentCustInfo.TELPNO2,
						"custom_no" : currentCustInfo.MBR_ID,
						"fml_connt_cde" : $("#custInfo_FAT_REL").find("option[value="+ currentCustInfo.FAT_REL +"]").text(),
						"fml_seq" : currentCustInfo.FAT_RSDNO,
						"cust_mk" : $("#custInfo_CUST_MK").find("option[value="+ currentCustInfo.CUST_MK +"]").text(),
						"tchr_mk_cde" : "",
						"sts_cde" : "",
					},
					"name": currentCustInfo.NAME,
					 "role": "end-user"
				}
			}),
	}
	client.request(option).then(function() {
		client.invoke("notify", "젠데스크 사용자 업데이트 완료.", "notice", 5000);
	});		// 사용자 생성
}
function updateTchrforZen(){
	var option = {
			url: '/api/v2/users/create_or_update.json',
			method: 'POST',
			contentType: "application/json",
			data: JSON.stringify({
				"user": {
					"external_id": currentTchrInfo.EMP_ID,
					//"email": $("#custInfo_REP_EMAIL_ADDR").val(),
					"phone": currentTchrInfo.MOBILNO,
					"user_fields": 
					{
						"bonbu": currentTchrInfo.DIV_NM,
						"dept" : currentTchrInfo.DEPT_NM,
						"center" : currentTchrInfo.LC_NM,
						"grade" : "",
						"home_tel" : currentTchrInfo.HOME_TEL,
						"custom_no" : "",
						"fml_connt_cde" : "",
						"fml_seq" : currentTchrInfo.RSDNO,
						"cust_mk" : "",
						"tchr_mk_cde" : currentTchrInfo.TCHR_MK_NM == null?"선생님":currentTchrInfo.TCHR_MK_NM,
						"sts_cde" : "",
					},
					"name": currentTchrInfo.NAME,
					 "role": "end-user"
				}
			}),
	}
	client.request(option).then(function() {
		client.invoke("notify", "젠데스크 사용자 업데이트 완료.", "notice", 5000);
	});		// 사용자 생성
}

/**
 * 가족관계회원 조회
 * @returns
 * 20-12-30 최준혁
 */
function familyInfoLoad() {
	
	$("#custInfo_FAMILY_CMB").empty();
	
	var param = {
			userid: currentUserInfo.user.external_id,
		    menuname: '고객정보(가족관계회원 조회)',
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{
		    	"CUST_ID"		: currentCustInfo.CUST_ID,				// 고객번호
		    }]
		};
	
	$.ajax({
	    url: API_SERVER + '/cns.getFamilyInfo.do',
	    type: 'POST',
	    dataType: 'json',
	    contentType: "application/json",
	    data: JSON.stringify(param),
	    success: function (response) {
	        console.log(response);
	        if(response.errcode == "0"){
	        	console.log("fam DATA ===> :" , response);
	        	if(response.recv1.length != 0){
	        		$("#custInfo_FAMILY_CMB").attr("disabled",false);
	        		for(d of response.recv1){
	        			custId = d.CUST_ID;
	        			custWhere = d.CNT_WHERE;
	        			custName = d.FML_NAME;
	        			custRel = d.FAT_REL_NAME ? d.FAT_REL_NAME:'&nbsp;';
	        			custGrade = d.GRADE_NAME;
	        			custMbr = d.MBR_ID != null ? d.MBR_ID:"&nbsp;";
        				$("#custInfo_FAMILY_CMB").prepend(`<option value='${custId}' data-FML_NAME='${custName}'>${custWhere} ${custName} ${custRel} ${custGrade} ${custMbr} ${custId}</option>`);
	        		}
	        		$("#custInfo_FAMILY_CMB option:eq(0)").prop("selected", true);
	        		$("#custInfo_FAMILY_CMB option:eq(0)").addClass('openSelect');
	        	}
	        }else {
	        	loading.out();
	        	client.invoke("notify", response.errmsg, "error", 60000);
	        }
	    }, error: function (response) {
	    }
	});
}

function relCustChange(){
    if($("#custInfo_FAMILY_CMB").find("option:selected").data("fml_name").length > 0){
        onAutoSearch($("#custInfo_FAMILY_CMB").find("option:selected").val());
    }else{
        //cust_id가 없을때
    	//txtNAME.value = DS_FAMILY_CMB.nameValue(DS_FAMILY_CMB.rowPosition,"FML_NAME");
        onAutoSearchByTELPNO($("#custInfo_FAMILY_CMB").find("option:selected").data("fml_name"));
    }
}

/**
 * 학습중인사업국/센터 조회
 * @returns
 * 21-01-06 최준혁
 */
function studyInfoLoad() {
	
	$("#custInfo_DEPT_NAME_study").empty();
	$("#custInfo_LC_NM_study").empty();
	
	var param = {
			userid: currentUserInfo.user.external_id,
		    menuname: '고객정보(학습중인 사업국/센터)',
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{
		    	"MBR_ID"		: currentCustInfo.MBR_ID,				// 회원번호
		    }]
		};
	
	$.ajax({
	    url: API_SERVER + '/cns.getStudyDataLc.do',
	    type: 'POST',
	    dataType: 'json',
	    contentType: "application/json",
	    data: JSON.stringify(param),
	    success: function (response_lc) {
	        if(response_lc.errcode == "0"){
	        	console.log("LC DATA ===> :" , response_lc);
	        	
	        	$.ajax({
	        		url: API_SERVER + '/cns.getStudyDataDept.do',
	        		type: 'POST',
	        		dataType: 'json',
	        		contentType: "application/json",
	        		data: JSON.stringify(param),
	        		success: function (response_dept) {
	        			if(response_dept.errcode == "0"){
	        				console.log("dept DATA ===> :" , response_dept);
        					
	        				deptData = response_dept.recv1;
	        				lcData = response_lc.recv1;
	        				
	        				deptData.forEach(d => {
	        					$("#custInfo_DEPT_NAME_study").append(`<option value=${d.DEPT_ID} tel=${d.TELPNO}>${d.DEPT_NAME}</option>`);
	        				});
	        				lcData.forEach(d => {
	        					if($("#custInfo_DEPT_NAME_study").find('option:selected').val() == d.DEPT_ID){
	        						$("#custInfo_LC_NM_study").append(`<option value=${d.LC_ID} tel=${d.TELPNO}>${d.LC_NM}</option>`);
	        					}
	        				});
	        				
	        				if(response_lc.recv1.length < 2){								// 센터 2개 미만
        						if(response_dept.recv1.length < 2){								// 사업국 2개 미만
        							$("#custInfo_DEPT_NAME_study").parent().css("display","none");
        							$("#custInfo_LC_NM_study").parent().css("display","none");
        							$("#custInfo_multipleStudy").css("display","none");
        							$("#custInfo_UPDEPTNAME").parent().attr('colspan', '3');
        						}else{															// 사업국 2개 이상
        							$("#custInfo_DEPT_NAME_study").parent().css("display","");
        							$("#custInfo_LC_NM_study").parent().css("display","");
        							$("#custInfo_multipleStudy").css("display","");
        							$("#custInfo_UPDEPTNAME").parent().attr('colspan', '1');
        						}
        		        	}else {															// 센터 2개 이상
        		        		$("#custInfo_DEPT_NAME_study").parent().css("display","");
    							$("#custInfo_LC_NM_study").parent().css("display","");
    							$("#custInfo_multipleStudy").css("display","");
    							$("#custInfo_UPDEPTNAME").parent().attr('colspan', '1');
        		        	}
	        			}else {
	        				loading.out();
	        				client.invoke("notify", response.errmsg, "error", 60000);
	        			}
	        		}, error: function (response) {
	        		}
	        	});
	        	
	        }else {
	        	loading.out();
	        	client.invoke("notify", response.errmsg, "error", 60000);
	        }
	    }, error: function (response) {
	    }
	});
}

/**
 * 그리드 리스트 조회
 * @param id	해당 그리드 id
 * @param grid	리스트를 표시 해 줄 그리드 객체
 * @returns
 * 21-01-04 최준혁
 */
function loadList(id, grid, listID) {
	if(currentCustInfo) {
		var param = {
				userid: currentUserInfo.user.external_id,
			    menuname: '',
				senddataids: ["send1"],
				recvdataids: ["recv1"],
				send1: [{}]
		};
		var sendUrl = '';
		
		switch(id){
		case 'counselHist':		// 상담이력 
			param.menuname = "상담이력";
			param.send1[0].CUST_ID = currentCustInfo.CUST_ID;				// 고객번호
			sendUrl = '/cns.getCounselHist.do';
			break;
		case 'currentStudy':	// 학습진행정보
			param.menuname = "상담이력";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			sendUrl = '/cns.getStudyData.do';
			break;
		case 'ifsStudyClass':	// 주간학습현황
			param.menuname = "학습이력";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			sendUrl = '/cns.ifsStudyClass.do';
			break;
		case 'ifsStudyChgInfo':	// 변동이력
			param.menuname = "학습이력";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			param.send1[0].PRDT_ID = currentStudyInfo.PRDT_ID				// 제품(과목)번호
			sendUrl = '/cns.ifsStudyChgInfo.do';
			break;
		case 'ifsShipHist':		// 불출교재
			param.menuname = "학습이력";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			param.send1[0].PRDT_ID = currentStudyInfo.PRDT_ID				// 제품(과목)번호
			if(currentStudyInfo.PRDT_ID == "PR" || currentStudyInfo.PRDT_ID == "QR" || currentStudyInfo.PRDT_ID == "QR2"){		//prdtId 가 PR, QR, QR2 로 시작하는 경우 getShipSTS
				sendUrl = '/cns.getShipSTS.do';
				$("#counselMain_studyTab_asignStuff").css("display","");
				$("#counselMain_studyTab_asignStuff2").css("display","none");
			}else {
				sendUrl = '/cns.ifsShipHist.do';
				$("#counselMain_studyTab_asignStuff2").css("display","");
				$("#counselMain_studyTab_asignStuff").css("display","none");
			}
			break;
		case 'getCounselSubj':		// 상담과목
			param.menuname = "상담이력";
			param.send1[0].CSEL_DATE = currentCounselInfo.CSEL_DATE			// 상담일자
			param.send1[0].CSEL_NO = currentCounselInfo.CSEL_NO				// 상담번호
			param.send1[0].CSEL_SEQ = currentCounselInfo.CSEL_SEQ			// 상담순번
			sendUrl = '/cns.getCounselSubj.do';
			break;
		case 'getFeeInfo':			// 회비정보
			param.menuname = "회비";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			sendUrl = '/cns.getFeeInfo.do';
			break;
		case 'getCreditPrdt':		// 과목별 입금내역
			param.menuname = "회비";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			param.send1[0].PRDT_ID = currentDueInfo.PRDT_ID					// 제품코드
			sendUrl = '/cns.getCreditPrdt.do';
			break;
		case 'getTransHist': 		// 입금내역
			param.menuname = "회비";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			param.send1[0].RCPT_DATE = currentSubDueInfo.RCPT_DATE			// 제품코드
			sendUrl = '/cns.getTransHist.do';
			break;
		case 'getCustPayMst' : 		// 직접결제 - 회비관리 현황
			param.menuname = "직접결제";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			param.send1[0].FEE_YM_FROM = $(".defaultDate_bf").val().replace(/-/gi,"").substring(0,6);
			param.send1[0].FEE_YM_TO = $(".defaultDate_ed").val().replace(/-/gi,"").substring(0,6);
			sendUrl = '/cns.getCustPayMst.do';
			break;
		case 'getCustPayChgKKO' : 	// 직접결제 - 알림톡 발송이력
			param.menuname = "직접결제";
			param.send1[0].CUST_PAY_ID = currentDirectChargeInfo.CUST_PAY_ID// 고객결제 ID
			sendUrl = '/cns.getCustPayChgKKO.do';
			break;
		case 'getPayLedger' : 		// 직접결제 - 결제/취소이력
			param.menuname = "직접결제";
			param.send1[0].CUST_PAY_ID = currentDirectChargeInfo.CUST_PAY_ID// 고객결제 ID
			sendUrl = '/cns.getPayLedger.do';
			break;
		case 'getCustPayReq' : 		// 직접결제 - 청구서 조회
			param.menuname = "직접결제";
			param.send1[0].BILL_TX_ID = currentDirectChargeInfo.BILL_TX_ID	// 트랜잭션ID
			sendUrl = '/cns.getCustPayReq.do';
			break;
		case 'temp' : 				// 직접결제 - 알림톡 수신자정보
			param.menuname = "직접결제";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			param.send1[0].FEE_YM_FROM = $(".defaultDate_bf").val().replace(/-/gi,"").substring(0,6);
			param.send1[0].FEE_YM_TO = $(".defaultDate_ed").val().replace(/-/gi,"").substring(0,6);
			sendUrl = '/cns.getCustPayMst.do';
			break;
			
		case 'getDet' : 			// 변경이력 - 현재학습장소
			param.menuname = "변경이력";
			param.send1[0].CUST_ID = currentCustInfo.CUST_ID				// 고객번호
			param.send1[0].PERSON_MK = currentCustInfo.CUST_MK				// 고객구분
			param.send1[0].ADDR_MK = "1";									// 주소구분 (1로고정);
			sendUrl = '/cns.getDetDtl.do';
			break;
		case 'getChgCustInfoHist' : // 변경이력 - 신상변경이력
			param.menuname = "변경이력";
			param.send1[0].CUST_ID = currentCustInfo.CUST_ID				// 고객번호
			sendUrl = '/cns.getChgCustInfoHist.do';
			break;
			
		case 'getErrNewMBR' : // 정보동의 - 개인정보동의
			param.menuname = "정보동의";
			param.send1[0].CUST_ID = currentCustInfo.CUST_ID				// 고객번호
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			sendUrl = '/cns.getErrNewMBR.do';
			break;
		case 'getErrEntInfo' : // 정보동의 - 개인정보동의
			param.menuname = "정보동의";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			sendUrl = '/cns.getErrEntInfo.do';
			break;
			
		case 'getDropDtl' : 	// 자동퇴회 - 자동퇴회 세부 이력조회
			param.menuname = "자동퇴회";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			sendUrl = '/cns.getDropDtl.do';
			break;
		case 'getDropMsg' : 	// 자동퇴회 - 퇴회안내발송 이력조회
			param.menuname = "자동퇴회";
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			sendUrl = '/cns.getDropMsg.do';
			break;
			
		case 'getTBLISTbyCUSTID' : 	// 고객조사 - 고객조사
			param.menuname = "고객조사";
			param.send1[0].CUST_ID = currentCustInfo.CUST_ID				// 고객번호
			sendUrl = '/cns.getTBLISTbyCUSTID.do';
			break;
			
		case 'getTB_SMSDATA' : 	// SMS - SMS/LMS 이력
			param.menuname = "SMS이력";
			param.send1[0].CUST_ID = currentCustInfo.CUST_ID				// 고객번호
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			sendUrl = '/cns.getTB_SMSDATA.do';
			break;
			
			// 콜리스트 공통
		case 'getTBCALLRST' : // 콜리스트 이력조회
			param.menuname = "콜 리스트 조회";
			param.send1[0].CUST_ID = currentCustInfo.CUST_ID				// 고객번호
			param.send1[0].LIST_ID = listID;								// 콜리스트ID
			sendUrl = '/cns.getTBCALLRST.do';
			break;
			
			//=== === === === === === === === === === === === === === 고객 끝 선생님 시작
			
		case 'getCselHistList' : // 선생님 상담이력 상세 조회
			param.menuname = "선생님 상담이력";
			param.send1[0].EMP_ID = currentTchrInfo.EMP_ID					// 선생님사번
			sendUrl = '/cns.getCselHistList.do';
			break;
		case 'getTchrCselHistInfo' : // 선생님 상담이력 상세 조회
			param.menuname = "선생님 상담이력";
			param.send1[0].CUST_ID = currentTchrInfo.EMP_ID					// 선생님사번 	// CUST_ID 에 EMP_ID 를 보낸다.
			sendUrl = '/cns.getTchrCselHistInfo.do';
			break;
		case 'ifsClassInfo': 	// 선생님 수업목록
			param.menuname = "선생님 교실정보";
			param.send1[0].EMP_ID = currentTchrInfo.EMP_ID					// 선생님사번
			sendUrl = '/cns.ifsClassInfo.do';
			break;
		case 'ifsStudentInfoByClass' : // 교실별 회원정보
			param.menuname = "선생님 교실정보";
			param.send1[0].CLS_ID = currentTchrClassInfo.CLS_ID					// 교실 ID
			sendUrl = '/cns.ifsStudentInfoByClass.do';
		}
		
		$.ajax({
			url: API_SERVER + sendUrl,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(param),
			success: function (response) {
				console.log(response);
				if(response.errcode == "0"){
					console.log("DATA ===> :" , response);
					grid.resetData(response.recv1);
					grid.refreshLayout();
					
					// 후처리
					switch(id){
					case 'ifsStudyClass':
						counselMain_studyTab_weeklyStat.addSelection({rowKey:0});
						counselMain_studyTab_weeklyStat.clickSort({rowKey:0});
						currentStudyInfo = counselMain_studyTab_weeklyStat.getRow(0);		// 변동이력, 불출교재 자동조회
						
						var totalCntParam = {
								userid: currentUserInfo.user.external_id,
							    menuname: '학습이력',
								senddataids: ["send1"],
								recvdataids: ["recv1"],
								send1: [{'MBR_ID' : currentCustInfo.MBR_ID}]
						};
						$.ajax({
							url: API_SERVER + '/cns.ifsStudyTotalMonth.do',
							type: 'POST',
							dataType: 'json',
							contentType: "application/json",
							data: JSON.stringify(totalCntParam),
							success: function (response) {
								console.log(response);
								if(response.errcode == "0"){
									$("#totalStudyCnt").val(response.recv1[0].STD_MONTH);
								}else {
									loading.out();
									client.invoke("notify", response.errmsg, "error", 60000);
								}
							}, error: function (response) {
							}
						});
						
						loadList('ifsStudyChgInfo', counselMain_studyTab_changeHist);				
						if(currentStudyInfo.PRDT_ID == "PR" || currentStudyInfo.PRDT_ID == "QR" || currentStudyInfo.PRDT_ID == "QR2"){
							loadList('ifsShipHist', counselMain_studyTab_asignStuff);	
						}else {
							loadList('ifsShipHist', counselMain_studyTab_asignStuff2);
						}
						break;
					case 'getCustPayMst':
						counselMain_directCharge_duesInfo_grid.addSelection({rowKey:0});
						counselMain_directCharge_duesInfo_grid.clickSort({rowKey:0});
						currentDirectChargeInfo = counselMain_directCharge_duesInfo_grid.getRow(0);		// 직접결제 자동조회
						if(currentDirectChargeInfo != null){
							loadList('getCustPayChgKKO', counselMain_directCharge_alimSendList_grid);		// 알림톡 이력
							loadList('getPayLedger', counselMain_directCharge_cancelCharge_grid);			// 결제/취소 이력
							loadList('getCustPayReq', counselMain_directCharge_bill_grid);					// 청구서 이력
						}
						break;
					case 'getFeeInfo':
						counselMain_membershipDueTab_dueList.addSelection({rowKey:0});
						counselMain_membershipDueTab_dueList.clickSort({rowKey:0});
						currentDueInfo = counselMain_membershipDueTab_dueList.getRow(0);				// 과목별 입금내역 자동조회
						if(currentDueInfo != null){
							loadList('getCreditPrdt', counselMain_membershipDueTab_subChargeList);		// 과목별 입금내역 이력
						}
						break;
					case 'getCreditPrdt':
						counselMain_membershipDueTab_subChargeList.addSelection({rowKey:0});
						counselMain_membershipDueTab_subChargeList.clickSort({rowKey:0});
						currentSubDueInfo = counselMain_membershipDueTab_subChargeList.getRow(0);			// 입금내역 자동조회
						if(currentSubDueInfo != null){
							loadList('getTransHist',counselMain_membershipDueTab_chargeList);				//  입금내역 이력
						}

						// 계좌번호 조회
						$.ajax({
							url: API_SERVER + '/cns.getAccountInfo.do',
							type: 'POST',
							dataType: 'json',
							contentType: "application/json",
							data: JSON.stringify({
								userid: currentUserInfo.user.external_id,
								menuname: '회비',
								senddataids: ["send1"],
								recvdataids: ["recv1"],
								send1: 	[
									{
										"MBR_ID": 		currentCustInfo.MBR_ID,				// 회원번호
										"RCPT_MK":		currentDueInfo.RCPT_MK,				// 입금제품구분
									}
									]
							}),
							success: function (response) {
								if(response.errcode == "0"){
									if(response.recv1.length != 0){
										$("#memDue_accountNum").text(response.recv1[0].ACCT_ID.substring(0,4) + "**********");	// 계좌번호
										$("#memDue_ACCT_DAY").text(response.recv1[0].TRS_ACCT_DAY + "일");						// 이체일자
										$("#memDue_BANK_NAME").text(response.recv1[0].BANK_NAME);								// 은행명
										$("#memDue_ACCT_STDATE").text(FormatUtil.date(response.recv1[0].TRS_ACCT_STDATE));		// 이체신청일자
										$("#memDue_ACCT_EDDATE").text(FormatUtil.date(response.recv1[0].TRS_ACCT_EDDATE));		// 이체해지일자
										$("#memDue_ACCT_NAME").text(response.recv1[0].TRS_ACCT_NAME);							// 예금주
									}
								}else {
									client.invoke("notify", "계좌번호를 불러오지 못했습니다.", "error", 60000);
								}
							}
						});
						
						// 과목별 회비현황 조회
						$.ajax({
							url: API_SERVER + '/cns.getFeeInfoPrdt.do',
							type: 'POST',
							dataType: 'json',
							contentType: "application/json",
							data: JSON.stringify({
								userid: currentUserInfo.user.external_id,
								menuname: '회비',
								senddataids: ["send1"],
								recvdataids: ["recv1"],
								send1: 	[
									{
										"MBR_ID": 		currentCustInfo.MBR_ID,				// 회원번호
										"PRDT_ID":		currentDueInfo.PRDT_ID,				// 제품(과목)코드
									}
									]
							}),
							success: function (response) {
								if(response.errcode == "0"){
									if(response.recv1.length != 0){
										$("#finalDue_LASTFEE_YM").text(response.recv1[0].LASTFEE_YM.substring(0,4)+"-"+response.recv1[0].LASTFEE_YM.substring(4,6));
										$("#finalDue_LASTFEE_DATE").text(FormatUtil.date(response.recv1[0].LASTFEE_DATE));
										$("#finalDue_LASTFEE_OVERAMT").text(response.recv1[0].LASTFEE_OVERAMT.format());
										$("#finalDue_NEW_TXTQTY").text(response.recv1[0].NEW_TXTQTY);
										$("#finalDue_END_TXTQTY").text(response.recv1[0].END_TXTQTY);
										if(response.recv1[0].NEWFEE_PAY_FLAG == "Y"){
											$("#finalDue_NEWFEE_PAY_FLAG").text(response.recv1[0].NEWFEE_PAY_FLAG);
										}else {
											$("#finalDue_NEWFEE_PAY_FLAG").text("N");
										}
										if(response.recv1[0].NEWFEE_FLAG == "Y"){
											$("#finalDue_NEWFEE_FLAG").text(response.recv1[0].NEWFEE_FLAG);
										}else {
											$("#finalDue_NEWFEE_FLAG").text("N");
										}
										
									}
								}else {
								}
							}
						});
						break;
					}
					
				}else {
					loading.out();
					client.invoke("notify", response.errmsg, "error", 60000);
				}
			}, error: function (response) {
			}
		});
	}else {
		console.log('고객정보 없음!');
	}
}

/**
 * 관계회원 버튼 클릭 / 관계회원 신규 등록
 * @returns
 * 21-01-06 최준혁
 */
function onFamilyBtnClick(){
	if($("#custInfo_FAT_RSDNO").val().length-1 != 13){
		client.invoke('notify','관계번호를 입력하신 후에 관계회원으로 등록하시기 바랍니다.', 'alert', 5000);
		return;
	}
	
	 //변경된 정보가 존재하는지 체크
    if(isCustDataChanged() == true) {
    	client.invoke('notify',"고객정보를 변경하셨습니다. <br>먼저 저장을 하시고 관계회원 등록을<br> 하시기 바랍니다.", 'alert', 5000);
        return;
    }
    
    $("#custInfo_NAME").focus();
    
    // 관계회원 관련 항목 초기화
    $("#custInfo_CUST_ID").val("");			/* 고객번호      */
    $("#custInfo_MBR_ID").val("");			/* 회원번호      */
    $("#custInfo_NAME").val(""); 			/* 고객명        */
    $("#custInfo_GND").val("1");			/* 성별구분      */
	$("#custInfo_BIRTH_YMD").val("");		/* 출생년도+일자 */
	$("#custInfo_GRADE_CDE").val("");		/* 학년코드      */
	$("#custInfo_MOBILNO_MBR1").val("");	/*핸드폰번호_회원1*/
	$("#custInfo_MOBILNO_MBR2").val("");		/*핸드폰번호_회원2*/
	$("#custInfo_MOBILNO_MBR3").val("");		/*핸드폰번호_회원3*/
	
	// 양력 음력 초기화
	$("#solar").css('display','');
	$("#lunar").css('display','none');
	$("#lunarSolarInput").val("1");
	
    //txtREP_EMAIL_ADDR.value   = ""; 		 /* 대표E-MAIL주소*/
    //DS_CUST.nameValue(1,"MOBILNO_MBR") = ""; /*핸드폰번호_회원 */
    
    
    setStatus(3);
}

/**
 * 고객정보 수정 유무 확인
 * @returns
 * 21-01-06 최준혁
 */
function isCustDataChanged() {
	if($("#custInfo_NAME").val() != currentCustInfo.NAME){										// 고객명
		console.log(currentCustInfo.NAME);
		return true;
	}
	if(currentCustInfo.FML_RANK != null){
		if($("#custInfo_FML_RANK").val() != currentCustInfo.FML_RANK){							// 형제서열
			console.log(currentCustInfo.NAME);
			return true;
		}
	}else if($("#custInfo_FML_RANK").val() != ""){
		return true;
	}
	
	if(currentCustInfo.GND != null){
		if($("#custInfo_GND").val() != currentCustInfo.GND){									// 성별
			console.log(currentCustInfo.GND);
			return true;
		}
	}
	if(currentCustInfo.BIRTH_YMD != null){
		if($("#custInfo_BIRTH_YMD").val().replace(/-/gi,"") != currentCustInfo.BIRTH_YMD){		// 생년월일
			console.log(currentCustInfo.BIRTH_YMD);
			return true;
		}
	}
	if(currentCustInfo.BIRTH_MK != null){
		if($("#lunarSolarInput").val() != currentCustInfo.BIRTH_MK){							// 양력,음력
			console.log(currentCustInfo.BIRTH_MK);
			return true;
		}
	}
	if(currentCustInfo.GRADE_CDE != null){
		if($("#custInfo_GRADE_CDE").val() != currentCustInfo.GRADE_CDE){						// 학년
			console.log(currentCustInfo.GRADE_CDE);
			return true;
		}
	}
	if(currentCustInfo.DDD != null){
		if($("#custInfo_DDD").val() != currentCustInfo.DDD){									// 자택전화
			console.log(currentCustInfo.DDD);
			return true;
		}
		if($("#custInfo_TELPNO1").val() != currentCustInfo.TELPNO1){
			console.log(currentCustInfo.TELPNO1);
			return true;
		}
		if($("#custInfo_TELPNO2").val() != currentCustInfo.TELPNO2){
			console.log(currentCustInfo.TELPNO2);
			return true;
		}
	}
	if(currentCustInfo.MOBILNO != null){
		if($("#custInfo_MOBILNO1").val()+$("#custInfo_MOBILNO2").val()+$("#custInfo_MOBILNO3").val() != currentCustInfo.MOBILNO.replace(/-/gi,"")){						// 회원전화번호
			console.log(currentCustInfo.MOBILNO);
			return true;
		}
	}
	if(currentCustInfo.ZIPCDE != null){
		if($("#custInfo_ZIPCDE").val() != currentCustInfo.ZIPCDE){								// 우편번호
			console.log(currentCustInfo.ZIPCDE);
			return true;
		}
	}
	if(currentCustInfo.ZIP_ADDR != null){
		if($("#custInfo_ZIP_ADDR").val() != currentCustInfo.ZIP_ADDR){							// 기본주소
			console.log(currentCustInfo.ZIP_ADDR);
			return true;
		}
	}
	if(currentCustInfo.ADDR != null){
		if($("#custInfo_ADDR").val() != currentCustInfo.ADDR){									// 상세주소
			console.log(currentCustInfo.ADDR);
			return true;
		}
	}
	if(currentCustInfo.MOBILNO_LAW != null){
		if($("#custInfo_MOBILNO_LAW1").val()+$("#custInfo_MOBILNO_LAW2").val()+$("#custInfo_MOBILNO_LAW3").val() != currentCustInfo.MOBILNO_LAW.replace(/-/gi,"")){			// 대리인 전화번호
			console.log(currentCustInfo.MOBILNO_LAW);
			return true;
		}
	}
	if(currentCustInfo.MOBILNO_MBR != null){
		if($("#custInfo_MOBILNO_MBR1").val()+$("#custInfo_MOBILNO_MBR2").val()+$("#custInfo_MOBILNO_MBR3").val() != currentCustInfo.MOBILNO_MBR.replace(/-/gi,"")){			// 학부모 전화번호
			console.log(currentCustInfo.MOBILNO_MBR);
			return true;
		}
	}
	if(currentCustInfo.FAT_NAME != null){
		if($("#custInfo_FAT_NAME").val() != currentCustInfo.FAT_NAME){							// 대리인명
			console.log(currentCustInfo.FAT_NAME);
			return true;
		}
	}
	if(currentCustInfo.FAT_REL != null){
		if($("#custInfo_FAT_REL").val() != currentCustInfo.FAT_REL){							// 대리인관계
			console.log(currentCustInfo.FAT_REL);
			return true;
		}
	}else if($("#custInfo_FAT_REL").val() != ""){
		console.log(currentCustInfo.FAT_REL);
		return true;
	}
	if(currentCustInfo.FAT_RSDNO != null){
		if($("#custInfo_FAT_RSDNO").val().replace(/-/gi, "") != currentCustInfo.FAT_RSDNO){		// 관계번호
			console.log(currentCustInfo.FAT_RSDNO);
			return true;
		}
	}else {
		if($("#custInfo_FAT_RSDNO").val().replace(/-/gi, "") != ""){							// 관계번호
			console.log(currentCustInfo.FAT_RSDNO);
			return true;
		}
	}
	if(currentCustInfo.UPDEPTNAME != null){
		if($("#custInfo_UPDEPTNAME").val() != currentCustInfo.UPDEPTNAME){						// 본부
			console.log(currentCustInfo.UPDEPTNAME);
			return true;
		}
	}
	if(currentCustInfo.DEPT_ID != null){
		if($("#custInfo_DEPT_ID").val() != currentCustInfo.DEPT_ID){							// 사업국
			console.log(currentCustInfo.DEPT_ID);
			return true;
		}
		if($("#custInfo_DEPT_NAME").val() != currentCustInfo.DEPT_NAME){						// 사업국명
			console.log(currentCustInfo.DEPT_NAME);
			return true;
		}
	}
	if(currentCustInfo.TELPNO_DEPT != null){
		if($("#custInfo_TELPNO_DEPT").val() != currentCustInfo.TELPNO_DEPT){					// 사업국 번호
			console.log(currentCustInfo.TELPNO_DEPT);
			return true;
		}
	}
	if(currentCustInfo.LC_NAME != null){
		if($("#custInfo_LC_NAME").val() != currentCustInfo.LC_NAME){							// 센터
			console.log(currentCustInfo.LC_NAME);
			return true;
		}
	}
	if(currentCustInfo.TELPNO_LC != null){
		if($("#custInfo_TELPNO_LC").val() != currentCustInfo.TELPNO_LC){						// 센터번호
			console.log(currentCustInfo.TELPNO_LC);
			return true;
		}
	}
	
	return false;
}

function onSaveBtnClick(){
	if(custInfoStatus == 2){		// 2 : 고객조회 된 상태
		//변경된 정보가 존재하는지 체크
		if(isCustDataChanged() == false){
			client.invoke('notify','변경된 정보가 없습니다.', 'alert', 5000);
			return;
		}
	}
    
    //유효성 체크
    if(onValueCheck()==false) return;
    
    //수정시 확인한다.
    if(custInfoStatus == 2){
        ModalUtil.confirmPop("확인 메세지", "정말로 수정 하시겠습니까?", function(e){
        	onAutoSearchByTELPNO("ONSAVE");
        });
    }else {
    	onAutoSearchByTELPNO("ONSAVE");
    }
    
}

/**
 * 저장시 필수 항목 유효성체크
 * @returns
 * 21-01-08 최준혁
 */
function onValueCheck(){
    var sMsg = "";
    var sFocusObj = "";
    if($.trim($("#custInfo_NAME").val()) == ""){
        sMsg = "성명을 입력해 주십시요.";
        sFocusObj = $("#custInfo_NAME");
    }else if( $.trim($("#custInfo_GRADE_CDE").val()) == ""){
        sMsg = "학년을 선택하세요.";
        sFocusObj = $("#custInfo_GRADE_CDE");            
    }else if($.trim($("#custInfo_DDD").val()) == ""){
        sMsg = "전화번호(지역번호)를 입력하세요.";
        sFocusObj = $("#custInfo_DDD");
    }else if( $.trim($("#custInfo_TELPNO1").val()) == "" ){
        sMsg = "전화번호(국번)을 입력하세요.";
        sFocusObj = $("#custInfo_TELPNO1");
    }else if( gf_chkDDDNumber($.trim($("#custInfo_TELPNO1").val())) ){
        sMsg = "전화번호(국번)이 올바르지 않습니다.\n\n 다시 입력하세요.";
        sFocusObj = $("#custInfo_TELPNO1");
    }else if( $.trim($("#custInfo_TELPNO2").val()) == "" || $.trim($("#custInfo_TELPNO2").val()).length < 4){
        sMsg = "전화번호(뒷4자리)를 입력하세요.";
        sFocusObj = $("#custInfo_TELPNO2");
        
    //신규 회원일때만 학부모 관계번호를 체크한다.
    }else if(currentCustInfo.CUST_ID == 0 ) {
        if( $.trim($("#custInfo_FAT_RSDNO").val()) == "" ){
            sMsg = "관계번호를 입력하세요.";
            sFocusObj = $("#custInfo_FAT_RSDNO");
        }else if($.trim($("#custInfo_FAT_RSDNO").val()).replace(/-/gi,"") < 13){
            sMsg = "관계번호가 잘못되었습니다.";
            sFocusObj = $("#custInfo_FAT_RSDNO");
        }else{
            return true;
        }
        
    }else{
        return true;
    }                

    //메세지 출력하기
    client.invoke('notify',sMsg, 'alert', 5000);
    //포커스 옮기기.
    if(sFocusObj != ""){
       sFocusObj.focus();
    }
    return false;
}
/**
 * 중복 고객, 중복 부모 존재 여부 조회
// (성명, 학습장소 전화번호로 판단한다.)
// (저장시:"ONSAVE"
//  전화번호입력시:"ONTELPNO"
//  관계회원등록때 이름입력시:"ONNAME"
//  관계회원콤보선택시 비회원일때: "ONRELCMB"
 * @param sFlag
 * @param sName
 * @returns
 */
function onAutoSearchByTELPNO(sFlag,sName){
    if((custInfoStatus == 1 && sFlag == "ONTELPNO") ||			// 신규 상태고 전화번호 입력시
       (custInfoStatus == 3 && sFlag == "ONNAME"  ) ||			// 관계회원등록 상태이고 순서대로 이름입력일시
                               sFlag == "ONSAVE"    ||			// 저장일 시
                               sFlag == "ONRELCMB"  ){			// 관계회원등록일 시

        if( $.trim($("#custInfo_NAME").val()).length > 0 &&
    		$.trim($("#custInfo_TELPNO1").val()).length > 0 &&
    		$.trim($("#custInfo_TELPNO2").val()).length > 3){

        	//관계회원("ONRELCMB")일 때는 파라미터 이름(sName)을 사용하고, 다른경우는 새로 입력한 이름을 사용한다.
        	var custName_dp = ""; 
        	if(sFlag == "ONRELCMB"){
        		custName_dp = sName;
        	}else {
        		custName_dp = $.trim($("#custInfo_NAME").val());
        	}
        	
        	existCustName = custName_dp;								// 기존 존재하는 고객의 이름
        	existCustTelNo = $("#custInfo_TELPNO2").val();
        	
        	var param = {
        			userid: currentUserInfo.user.external_id,
    			    menuname: '고객정보(중복고객조회)',
        		    senddataids: ["send1"],
        		    recvdataids: ["recv1"],
        		    send1: [{
        		    	"TELPNO2"		: $("#custInfo_TELPNO2").val(),				// 학습장소 전화 뒷자리
        		    	"TELPNO1"		: $("#custInfo_TELPNO1").val(),				// 학습장소 전화 국번
        		    	"NAME"			: custName_dp,								// 고객명
        		    	"FAT_RSDNO"		: $("#custInfo_FAT_RSDNO").val(),			// 학부모 관계번호
        		    }]
        		};
        	
        	$.ajax({
        	    url: API_SERVER + '/cns.getDupliChecking.do',
        	    type: 'POST',
        	    dataType: 'json',
        	    contentType: "application/json",
        	    data: JSON.stringify(param),
        	    success: function (response) {
        	        if(response.errcode == "0"){
        	        	console.log("DUPLE DATA ===> :" , response);
        	        	existCustInfo = response.recv1[0];
        	        	//(저장시:"ONSAVE", 전화번호입력시:"ONTELPNO", 관계회원등록때 이름입력시:"ONNAME")
        	            //저장시:"ONSAVE"
        	            if(sFlag == "ONSAVE"){
        	                onSave();
        	            }else if(sFlag == "ONTELPNO" || sFlag == "ONNAME"){	//전화번호입력시:"ONTELPNO",관계회원등록때 이름입력시:"ONNAME"
        	            	if (existCustInfo.CUST_ID == "MOREDATAFOUND"){
        	            		var sConfMsg = "해당 성명,전화번호와 동일한 고객이 이미 존재합니다.<br>고객찾기로 조회 하시겠습니까?";
        	            		var tempName = $("#custInfo_NAME").val();
        	            		var tempTelNum = $("#custInfo_TELPNO2").val();
        	            		ModalUtil.confirmPop("확인 메세지", sConfMsg, function(){
        	            			function d(tempName, tempTelNum){
        	            				$("#customerSearch").click();
        	            				$("#customerName").val(tempName);
        	            				$("#customerNameCheck").prop('checked',true);
        	            				$("#customerPhone").val(tempTelNum);
        	            				$("#customerPhoneCheck").prop('checked',true);
        	            			}
        	            			d(tempName,tempTelNum);
        	            			$("#custSearchDivBtn").click();
        	            		}, function() {
        	            			ModalUtil.modalPop("알림","성명, 전화번호 중 한 가지가 달라야 <br>새로운 고객으로 등록됩니다.");
        	            		});
        	            		
        	            	}else if(existCustInfo.CUST_ID != "NODATAFOUND"){
        	            		var sConfMsg = "고객번호 ["+ existCustInfo.CUST_ID +"]인 고객이 이미 존재합니다.<br>위 고객으로 조회하시겠습니까?";
        	            		
        	            		ModalUtil.confirmPop("확인 메세지", sConfMsg, function() {
        	            			//관계회원이면, 학부모정보를 저장해 둔다.
        	            			if(custInfoStatus == 3){
        	            				sFAT_NAME  = $("#custInfo_FAT_NAME").val();
        	            				sFAT_RSDNO = $("#custInfo_FAT_RSDNO").val().replace(/-/gi,"");
        	            				sFAT_REL   = $("#custInfo_FAT_REL").val();
        	            			}
        	            			onAutoSearch(existCustInfo.CUST_ID);
        	            		}, function() {
        	            			ModalUtil.modalPop("알림","성명, 전화번호 중 한 가지가 달라야 <br>새로운 고객으로 등록됩니다.");
        	            		})
        	            	}
        	            	
        	            	//관계회원콤보선택시 비회원일때:"ONRELCMB"
        	            }else if(sFlag == "ONRELCMB"){
        	            	if(existCustInfo.CUST_ID == "MOREDATAFOUND") {
        	            		//고객번호가 여러개일때, 고객찾기로 넘기자.
        	            		$("#customerSearch").click();
        	            		$("#customerName").val(existCustName);
        	            		$("#customerNameCheck").prop('checked',true);
        	            		$("#customerPhone").val(existCustTelNo);
        	            		$("#customerPhoneCheck").prop('checked',true);
        	            	}else if(existCustInfo.CUST_ID == "NODATAFOUND"){
        	            		ModalUtil.modalPop("알림","학부모이거나 고객번호가 없어<br> 조회 할수 없는 관계회원입니다.");
        	            	}else{
        	            		onAutoSearch(existCustInfo.CUST_ID);
        	            	}
        	            }
    	            }
        	    }
        	});
        }
    }
}

/**
 * 저장 하는 함수
 * 유효성 체크가 끝나면 호출된다.(onSaveBtnClicked() --> onValueCheck() --> onSave())
 * @returns
 * 21-01-11 최준혁
 */
function onSave(){
    //custInfoStatus가 2 : 고객조회된 상태// "UPDATE"가 아닌데, 고객이 이미 존재할 경우,
   if(custInfoStatus != 2 && existCustInfo.CUST_ID != "NODATAFOUND"){

        var sConfMsg = "고객번호 ["+ existCustInfo.CUST_ID +"]인 고객이 이미 존재합니다.<br>위 고객으로 조회하시겠습니까?";
        
        ModalUtil.confirmPop("확인 메세지", sConfMsg, function() {
        	//관계회원이면, 학부모정보를 저장해 둔다.
            if(custInfoStatus == 3){
                sFAT_NAME  = $("#custInfo_FAT_NAME").val();
                sFAT_RSDNO = $("#custInfo_FAT_RSDNO").val().replace(/-/gi,"");
                sFAT_REL   = $("#custInfo_FAT_REL").val();
            }
            onAutoSearch(existCustInfo.CUST_ID);
            return;
        }, function() {
        	ModalUtil.modalPop("알림","성명, 전화번호 중 한 가지가 달라야 <br>새로운 고객으로 등록됩니다.");
        	return;
        });

    //custInfoStatus가 3 : 관계회원 조회, "RELINSERT"가 아니고, 이전 학부모 주민번호가 다를때, 학부모가 존재할 경우,
    }
    if(custInfoStatus != 3 &&
    		existCustInfo.FAT_RSDNO != "NODATAFOUND" &&
//             DS_CUST.nameValue(1,"FAT_RSDNO") != DS_CUST.OrgNameValue(1,"FAT_RSDNO")){
    		existCustInfo.FAT_RSDNO != currentCustInfo.FAT_RSDNO){

        //학부모가 존재하는데 관계회원 등록안하면, [C+전화번호]일 경우에는 사용자에게 물어보고 등록한다.
        if(existCustInfo.FAT_RSDNO.substring(0,1).toUpperCase() == "C"){
            if(confirm("학부모번호가 이미 존재 하여 관계회원으로 등록됩니다.<br>관계회원으로 저장 하시겠습니까?")){
            	custInfoStatus = 3;
            }else{
            	ModalUtil.confirmPop("확인 메세지", "관계회원으로 저장하지 않으면, 학부모정보를 저장 할 수 없습니다.<br>계속하시겠습니까?", function() {
            		custInfoStatus = 4//"RELINSERTNOT";
                    //학부모정보를 모두 지운다.
                    $("#MSK_FAT_RSDNO").val("");    		//세대주관계번호
                    $("#custInfo_FAT_NAME").val("");    	//세대주명
                    $("#custInfo_FAT_REL").val("");			//관계
                });
            }
        //학부모가 존재하는데 관계회원 등록안하면, 실주민번호일 경우에는 자동 등록한다.
        }else{
        	custInfoStatus = 3;// "RELINSERT";
        }
    }
    //저장 데이터 설정 : IsUpdated 영향을 끼치는 항목 설정
    //E-mail수신여부 = 0:허용 1:수신거부
    /*
    DS_CUST.nameValue(1,"MAIL_RCV_FLAG") = DS_CUST.nameValue(1,"MAIL_RCV_FLAG") == "0" ? "Y" : "N";
    DS_CUST.nameValue(1,"CHG_USER_ID") = "nw008"; //수정자ID

    DS_ADDR.nameValue(1,"PERSON_MK")   = "FM";
    DS_ADDR.nameValue(1,"CUST_CGNT_NO")= DS_CUST.nameValue(1,"FAT_RSDNO");
    DS_ADDR.nameValue(1,"ADDR_MK")     = "2";
    DS_ADDR.nameValue(1,"REG_USER_ID") = "nw008"; //등록자ID
     */
    // 고객정보 변경전,변경후 여부 객체
    var chgYn = setCustChangeData();
	
	// 세대주 주민번호 없이 주소만 변경하는 경우에 return		
	if(chgYn.ADDR_CHG_FLAG2 == "Y" && $.trim(currentCustInfo.FAT_RSDNO).length == 0){
		ModalUtil.modalPop("알림","세대주 주민번호를 입력후 저장하세요.");
		return;
	}
	
    //DS_ADDR.UseChangeInfo = false;
	
	var param = {
			userid: currentUserInfo.user.external_id,
		    menuname: '고객정보 등록/수정',
		    senddataids: ["DS_DATA","DS_CUST","DS_CUST_CHG"],
		    recvdataids: ["recv1"],
		    DS_DATA: [{}],
		    DS_CUST: [{}],
		    DS_CUST_CHG: [{}]
		};
	
	if(custInfoStatus == 1 || custInfoStatus == 3 || custInfoStatus == 4){
		param.DS_DATA[0].ROW_TYPE = "I";
		switch(custInfoStatus){
		case 1 :
			param.DS_DATA[0].JOBKIND = 'NEW'; 
			break;
		case 3 :
			param.DS_DATA[0].JOBKIND = 'REL'; 
			break;
		case 4 :
			param.DS_DATA[0].JOBKIND = 'NUP'; 
			break;
		default:
			param.DS_DATA[0].JOBKIND = ''; 
		break;
		}
		param.DS_CUST[0].CUST_ID = 		"";
		param.DS_CUST[0].CUST_MK = 		$("#custInfo_CUST_MK").val();
		param.DS_CUST[0].CUST_CGNT_NO = 	"";
		param.DS_CUST[0].MBR_ID = 			"";
		param.DS_CUST[0].NAME = 			$("#custInfo_NAME").val();
		param.DS_CUST[0].NAME_ENG = 		"";
		param.DS_CUST[0].GND = 			$("#custInfo_GND").val();
		param.DS_CUST[0].BIRTH_MK = 		$("#lunarSolarInput").val();
		param.DS_CUST[0].BIRTH_YR =		$("#custInfo_BIRTH_YMD").val().split("-")[0];
		param.DS_CUST[0].BIRTH_MD = 		$("#custInfo_BIRTH_YMD").val().split("-")[1]+$("#custInfo_BIRTH_YMD").val().split("-")[2];
		param.DS_CUST[0].GRADE_CDE = 		$("#custInfo_GRADE_CDE").val();
		param.DS_CUST[0].FAT_RSDNO = 		$("#custInfo_FAT_RSDNO").val().replace(/-/gi,"");
		param.DS_CUST[0].FAT_NAME = 		$("#custInfo_FAT_NAME").val();
		param.DS_CUST[0].FAT_REL = 		$("#custInfo_FAT_REL").val();
		param.DS_CUST[0].ZIPCDE = 			$("#custInfo_ZIPCDE").val();
		param.DS_CUST[0].ADDR = 			$("#custInfo_ADDR").val();
		param.DS_CUST[0].DDD = 			$("#custInfo_DDD").val();
		param.DS_CUST[0].TELPNO1 = 		$("#custInfo_TELPNO1").val();
		param.DS_CUST[0].TELPNO2 = 		$("#custInfo_TELPNO2").val();
		param.DS_CUST[0].DEPT_ID = 		$("#custInfo_DEPT_ID").val();
		param.DS_CUST[0].FML_RANK = 		$("#custInfo_FML_RANK").val();
		param.DS_CUST[0].MOBILNO = 		$("#custInfo_MOBILNO1").val() + $("#custInfo_MOBILNO2").val() + $("#custInfo_MOBILNO3").val();
		param.DS_CUST[0].MOBILNO_MBR =		$("#custInfo_MOBILNO_MBR1").val() + $("#custInfo_MOBILNO_MBR2").val() + $("#custInfo_MOBILNO_MBR3").val();
		param.DS_CUST[0].MOBILNO_FAT =		"",
		param.DS_CUST[0].MOBILNO3 = 		$("#custInfo_MOBILNO3").val();
		param.DS_CUST[0].MOBILNO3_MBR =	$("#custInfo_MOBILNO_MBR3").val();
		param.DS_CUST[0].MOBILNO3_FAT =	"",
		param.DS_CUST[0].ZIP_ADDR = 		$("#custInfo_ZIP_ADDR").val();
		param.DS_CUST[0].FAT_CO_DDD = 		"",
		param.DS_CUST[0].FAT_CO_TELPNO1 =	"",
		param.DS_CUST[0].FAT_CO_TELPNO2 = 	"",
		param.DS_CUST[0].MOBILNO_LAW = 	$("#custInfo_MOBILNO_LAW1").val() + $("#custInfo_MOBILNO_LAW2").val() + $("#custInfo_MOBILNO_LAW3").val();
		param.DS_CUST[0].MOBILNO3_LAW = 	$("#custInfo_MOBILNO_LAW3").val();
		param.DS_CUST[0].LC_ID = 			$("#custInfo_LC_ID").val();
		param.DS_CUST[0].CHG_USER_ID = 	currentUserInfo.external_id;
		
	}else {
		param.DS_DATA[0].ROW_TYPE 				= "U";
		param.DS_DATA[0].JOBKIND 				= 'UPD'; 
		
		param.DS_CUST[0].CUST_ID = 		$("#custInfo_CUST_ID").val();
		param.DS_CUST[0].CUST_MK = 		$("#custInfo_CUST_MK").val();
		param.DS_CUST[0].CUST_CGNT_NO = 	"";
		param.DS_CUST[0].MBR_ID = 			"";
		param.DS_CUST[0].NAME = 			$("#custInfo_NAME").val();
		param.DS_CUST[0].NAME_ENG = 		"";
		param.DS_CUST[0].GND = 			$("#custInfo_GND").val();
		param.DS_CUST[0].BIRTH_MK = 		$("#lunarSolarInput").val();
		param.DS_CUST[0].BIRTH_YR =		$("#custInfo_BIRTH_YMD").val().split("-")[0];
		param.DS_CUST[0].BIRTH_MD = 		$("#custInfo_BIRTH_YMD").val().split("-")[1]+$("#custInfo_BIRTH_YMD").val().split("-")[2];
		param.DS_CUST[0].GRADE_CDE = 		$("#custInfo_GRADE_CDE").val();
		param.DS_CUST[0].FAT_RSDNO = 		$("#custInfo_FAT_RSDNO").val().replace(/-/gi,"");
		param.DS_CUST[0].FAT_NAME = 		$("#custInfo_FAT_NAME").val();
		param.DS_CUST[0].FAT_REL = 		$("#custInfo_FAT_REL").val();
		param.DS_CUST[0].ZIPCDE = 			$("#custInfo_ZIPCDE").val();
		param.DS_CUST[0].ADDR = 			$("#custInfo_ADDR").val();
		param.DS_CUST[0].DDD = 			$("#custInfo_DDD").val();
		param.DS_CUST[0].TELPNO1 = 		$("#custInfo_TELPNO1").val();
		param.DS_CUST[0].TELPNO2 = 		$("#custInfo_TELPNO2").val();
		param.DS_CUST[0].DEPT_ID = 		$("#custInfo_DEPT_ID").val();
		param.DS_CUST[0].FML_RANK = 		$("#custInfo_FML_RANK").val();
		param.DS_CUST[0].MOBILNO = 		$("#custInfo_MOBILNO1").val() + $("#custInfo_MOBILNO2").val() + $("#custInfo_MOBILNO3").val();
		param.DS_CUST[0].MOBILNO_MBR =		$("#custInfo_MOBILNO_MBR1").val() + $("#custInfo_MOBILNO_MBR2").val() + $("#custInfo_MOBILNO_MBR3").val();
		param.DS_CUST[0].MOBILNO_FAT =		"",
		param.DS_CUST[0].MOBILNO3 = 		$("#custInfo_MOBILNO3").val();
		param.DS_CUST[0].MOBILNO3_MBR =	$("#custInfo_MOBILNO_MBR3").val();
		param.DS_CUST[0].MOBILNO3_FAT =	"",
		param.DS_CUST[0].ZIP_ADDR = 		$("#custInfo_ZIP_ADDR").val();
		param.DS_CUST[0].FAT_CO_DDD = 		"",
		param.DS_CUST[0].FAT_CO_TELPNO1 =	"",
		param.DS_CUST[0].FAT_CO_TELPNO2 = 	"",
		param.DS_CUST[0].MOBILNO_LAW = 	$("#custInfo_MOBILNO_LAW1").val() + $("#custInfo_MOBILNO_LAW2").val() + $("#custInfo_MOBILNO_LAW3").val();
		param.DS_CUST[0].MOBILNO3_LAW = 	$("#custInfo_MOBILNO_LAW3").val();
		param.DS_CUST[0].LC_ID = 			$("#custInfo_LC_ID").val();
		param.DS_CUST[0].CHG_USER_ID = 	currentUserInfo.external_id;
		
		param.DS_CUST_CHG[0].CUST_ID 				= $("#custInfo_CUST_ID").val();
		param.DS_CUST_CHG[0].NAME 					= $("#custInfo_NAME").val();
		param.DS_CUST_CHG[0].NAME_ENG 				= "";
		param.DS_CUST_CHG[0].GND 					= $("#custInfo_GND").val();
		param.DS_CUST_CHG[0].RSDNO 				= "";
		param.DS_CUST_CHG[0].GRADE_CDE 			= $("#custInfo_GRADE_CDE").val();
		param.DS_CUST_CHG[0].BIRTH_MK 				= $("#lunarSolarInput").val();
		param.DS_CUST_CHG[0].BIRTH_YR 				= $("#custInfo_BIRTH_YMD").val().split("-")[0];
		param.DS_CUST_CHG[0].BIRTH_MD 				= $("#custInfo_BIRTH_YMD").val().split("-")[1]+$("#custInfo_BIRTH_YMD").val().split("-")[2];
		param.DS_CUST_CHG[0].FAT_RSDNO 			= $("#custInfo_FAT_RSDNO").val().replace(/-/gi,"");
		param.DS_CUST_CHG[0].FAT_NAME 				= $("#custInfo_FAT_NAME").val();
		param.DS_CUST_CHG[0].FAT_REL 				= $("#custInfo_FAT_REL").val();
		param.DS_CUST_CHG[0].MAIL_RCV_FLAG 		= "";
		param.DS_CUST_CHG[0].REP_EMAIL_ADDR 		= "";
		param.DS_CUST_CHG[0].NAME_OLD				= currentCustInfo.NAME != null ? currentCustInfo.NAME:"";
		param.DS_CUST_CHG[0].NAME_ENG_OLD			= currentCustInfo.NAME_ENG != null ? currentCustInfo.NAME_ENG:"";
		param.DS_CUST_CHG[0].GND_OLD				= currentCustInfo.GND != null ? currentCustInfo.GND:"";
		param.DS_CUST_CHG[0].RSDNO_OLD				= currentCustInfo.RSDNO != null ? currentCustInfo.RSDNO:"";
		param.DS_CUST_CHG[0].GRADE_CDE_OLD			= currentCustInfo.GRADE_CDE != null ? currentCustInfo.GRADE_CDE:"";
		param.DS_CUST_CHG[0].BIRTH_MK_OLD			= currentCustInfo.BIRTH_MK != null ? currentCustInfo.BIRTH_MK:"";
		param.DS_CUST_CHG[0].BIRTH_YR_OLD			= currentCustInfo.BIRTH_YMD != null ? currentCustInfo.BIRTH_YMD.substring(0,4):"";
		param.DS_CUST_CHG[0].BIRTH_MD_OLD			= currentCustInfo.BIRTH_YMD != null ? currentCustInfo.BIRTH_YMD.substring(4,8):"";
		param.DS_CUST_CHG[0].FAT_RSDNO_OLD			= currentCustInfo.FAT_RSDNO != null ? currentCustInfo.FAT_RSDNO:"";
		param.DS_CUST_CHG[0].FAT_NAME_OLD			= currentCustInfo.FAT_NAME != null ? currentCustInfo.FAT_NAME:"";
		param.DS_CUST_CHG[0].FAT_REL_OLD			= currentCustInfo.FAT_REL != null ? currentCustInfo.FAT_REL:"";
		param.DS_CUST_CHG[0].REP_EMAIL_ADDR_OLD		= currentCustInfo.REP_EMAIL_ADDR != null ? currentCustInfo.REP_EMAIL_ADDR:"";
		param.DS_CUST_CHG[0].MAIL_RCV_FLAG_OLD		= currentCustInfo.MAIL_RCV_FLAG_OLD != null ? currentCustInfo.MAIL_RCV_FLAG_OLD:"";
		param.DS_CUST_CHG[0].ADDR_CHG_FLAG1		= chgYn.isCustChanged;
		param.DS_CUST_CHG[0].ADDR_CHG_FLAG2		= chgYn.isFatAddrChanged;
		param.DS_CUST_CHG[0].ADDR_CHG_FLAG3		= chgYn.isMbrMobilChanged;
		param.DS_CUST_CHG[0].CHG_USER_ID 			= currentUserInfo.external_id;
	}
	
	$.ajax({
	    url: API_SERVER + '/cns.saveCust.do',
	    type: 'POST',
	    dataType: 'json',
	    contentType: "application/json",
	    data: JSON.stringify(param),
	    success: function (response) {
	    	console.log(response);
	    	if(response.errcode == "0"){
	    		
	    		// 젠데스크에 사용자 정보 저장
	    		var option = {
	    				url: '/api/v2/users/create_or_update.json',
	    				method: 'POST',
	    				contentType: "application/json",
	    				data: JSON.stringify({
	    					  "user": {
	    						  	"external_id": response.recv1[0].CUST_ID,
	    						    "email": $("#custInfo_REP_EMAIL_ADDR").val(),
	    						    "phone": $("#custInfo_MOBILNO1").val() + $("#custInfo_MOBILNO2").val() + $("#custInfo_MOBILNO3").val(),
	    						    "user_fields": 
								    {
								      "bonbu": $("#custInfo_UPDEPTNAME").val(),
								      "dept" : $("#custInfo_DEPT_NAME").val(),
								      "center" : $("#custInfo_LC_NAME").val(),
								      "grade" : $("#custInfo_GRADE_CDE").find("option:selected").text(),
								      "mobilno_mother" : $("#custInfo_MOBILNO_MBR1").val()+$("#custInfo_MOBILNO_MBR2").val()+$("#custInfo_MOBILNO_MBR3").val(),
								      "mobilno_father" : "",
								      "mobile_legal" : $("#custInfo_MOBILNO_LAW1").val()+$("#custInfo_MOBILNO_LAW2").val()+$("#custInfo_MOBILNO_LAW3").val(),
								      "home_tel" : $("#custInfo_MOBILNO_LAW1").val()+$("#custInfo_MOBILNO_LAW2").val()+$("#custInfo_MOBILNO_LAW3").val(),
								      "custom_no" : $("#custInfo_CUST_ID").val(),
								      "fml_connt_cde" : $("#custInfo_FAT_REL").val(),
								      "fml_seq" : $("#custInfo_FAT_RSDNO").val().replace(/-/gi,""),
								      "cust_mk" : $("#custInfo_CUST_MK").find("option:selected").text(),
								      "tchr_mk_cde" : "",
								      "sts_cde" : "",
								    },
/*	    						    "identities": [
	    						      {
	    						    	  "type": "phone_number",
	    						    	  "value": $("#custInfo_MOBILNO1").val() + $("#custInfo_MOBILNO2").val() + $("#custInfo_MOBILNO3").val()
	    						    		  
	    						      }
	    						    ],
*/	    						    "name": $("#custInfo_NAME").val(),
	    						    "role": "end-user"
	    						  }
	    						}),
	    			}
	    			client.request(option).then(function() {
	    				client.invoke("notify", "저장 되었습니다.", "notice", 5000);
	    				onAutoSearch(response.recv1[0].CUST_ID);
	    			});		// 사용자 생성
  		
	    	}else {
	    		client.invoke("notify", response.errmsg, "error", 60000);
	    	}
	    }
	});
	
	
	/*DS_SAP_USE_FLAG.UserStatus(2) = 1;
    TR_CUST.Action   = "/cns/cns5400/cns5400T.jsp";
    TR_CUST.KeyValue = "JSP(I:CUST=DS_CUST,I:ADDR=DS_ADDR,I:CUST_CHG=DS_CUST_CHG,I:SAP=DS_SAP_USE_FLAG,O:CUST_ID=DS_CUST_ID)";
    TR_CUST.parameters = "sJobKind="+sJobKind;
    setTimeout("TR_CUST.post()",250);*/

}

/**
 * // 고객정보 변경전,변경후 여부 객체 생성
 * @returns
 * 21-01-12 최준혁
 */
function setCustChangeData(){
    var isCustChanged    = "N";  //학습장소주소변경여부
    var isFatAddrChanged = "N";  //학부모직장주소변경여부
    var isMbrMobilChanged = "N"; //회원모핸드폰번호변경여부

    //학습장소주소변경여부 판단한다.
    if($("#custInfo_ZIPCDE").val() != currentCustInfo.ZIPCDE) isCustChanged = "Y";   	/* [34] 우편번호                  */
    if($("#custInfo_ADDR").val() != currentCustInfo.ADDR) isCustChanged = "Y";   		/* [35] 주소                      */
    if($("#custInfo_DDD").val() != currentCustInfo.DDD) isCustChanged = "Y";   		/* [36] 지역번호                  */
    if($("#custInfo_TELPNO1").val() != currentCustInfo.TELPNO1) isCustChanged = "Y";   	/* [37] 전화국번                  */
    if($("#custInfo_TELPNO2").val() != currentCustInfo.TELPNO2) isCustChanged = "Y";   	/* [38] 전화번호                  */
    if($("#custInfo_MOBILNO").val() != currentCustInfo.MOBILNO) isCustChanged = "Y";   	/* [39] 핸드폰번호_회원         */
    if($("#custInfo_MOBILNO3").val() != currentCustInfo.MOBILNO3) isCustChanged = "Y";   	/* [56] 핸드폰번호3_회원        */

    //학부모직장주소변경여부 판단한다.
    if($("#custInfo_MOBILNO_FAT").val() != currentCustInfo.MOBILNO_FAT) isFatAddrChanged = "Y";   /* [58] 핸드폰번호_회원부         */
    if($("#custInfo_MOBILNO3_FAT").val() != currentCustInfo.MOBILNO3_FAT) isFatAddrChanged = "Y";   /* [60] 핸드폰번호3_회원부        */
    if($("#custInfo_FAT_CO_DDD").val() != currentCustInfo.FAT_CO_DDD) isFatAddrChanged = "Y";   /* [73] 직장지역번호              */
    if($("#custInfo_FAT_CO_TELPNO1").val() != currentCustInfo.FAT_CO_TELPNO1) isFatAddrChanged = "Y";   /* [74] 직장국번                  */
    if($("#custInfo_FAT_CO_TELPNO2").val() != currentCustInfo.FAT_CO_TELPNO2) isFatAddrChanged = "Y";   /* [75] 직장뒷자리                */
    if($("#custInfo_FAT_RSDNO").val() != currentCustInfo.FAT_RSDNO) isFatAddrChanged = "Y";   /* 학부모 주민번호 변경시         */
	
	//회원모핸드폰변경여부 판단한다.
    if(currentCustInfo.MOBILNO_MBR != null){
    	if($("#custInfo_MOBILNO_MBR1").val() + $("#custInfo_MOBILNO_MBR2").val() + $("#custInfo_MOBILNO_MBR3").val() != currentCustInfo.MOBILNO_MBR.replace(/-/gi,"")) isMbrMobilChanged = "Y";   /* [57] 핸드폰번호_회원모           */
    }

    //고객변경정보를 셋팅한다.
	var returnObject = {
			"isCustChanged" : isCustChanged,
			"isFatAddrChanged" : isFatAddrChanged,
			"isMbrMobilChanged" : isMbrMobilChanged,
	} 
    /*DS_CUST_CHG.nameValue(1,"FAT_RSDNO_OLD"      ) = sOrgFAT_RSDNO;//DS_CUST.OrgNameValue(1, "FAT_RSDNO"       );
    DS_CUST_CHG.nameValue(1,"FAT_NAME_OLD"       ) = DS_CUST.OrgNameValue(1, "FAT_NAME"        );
    DS_CUST_CHG.nameValue(1,"FAT_REL_OLD"        ) = DS_CUST.OrgNameValue(1, "FAT_REL"         );
    DS_CUST_CHG.nameValue(1,"REP_EMAIL_ADDR_OLD" ) = DS_CUST.OrgNameValue(1, "REP_EMAIL_ADDR"  );
    DS_CUST_CHG.nameValue(1,"MAIL_RCV_FLAG_OLD"  ) = (DS_CUST.OrgNameValue(1, "MAIL_RCV_FLAG"  )== "0" ? "Y" : "N");*/
    return returnObject;
}

/**
 * 선생님정보 상세조회
 * @returns
 * 21-01-21
 */
function loadTeacherInfoMain() {
	$("#customerInfo").click();	// 탭 이동
	$("#teacherTab").click();	// 탭 이동
	for(key in currentTchrInfo){												// input 자동 기입
		if($("#tchrInfo_" + key).length != 0){
			switch($("#tchrInfo_" + key)[0].localName){
			case "select" :
				$("#tchrInfo_" + key).val(currentTchrInfo[key]);
				break;
			case "input" :
				$("#tchrInfo_" + key).val(currentTchrInfo[key]);
				break;
			case "span" :
				$("#tchrInfo_" + key).text(currentTchrInfo[key]);
				break;
			}
		}
	}
	
	$("#tchrInfo_BIRTH_DATE").val(FormatUtil.date(currentTchrInfo.BIRTH_DATE));	// 생일 포멧 
	$("#tchrInfo_WORK_STDATE").val(FormatUtil.date(currentTchrInfo.WORK_STDATE));	// 입사일 포멧 
	$("#tchrInfo_WORK_EDDATE").val(FormatUtil.date(currentTchrInfo.WORK_EDDATE));	// 퇴직일 포멧 
	
	loadList('getTchrCselHistInfo', counselMainTeacher_counselHist_grid);			// 상담이력 조회
}

function smsOnClick(){
	if(currentCustInfo.CUST_ID == null || currentCustInfo.CUST_ID == ""){
		ModalUtil.modalPop("알림","고객조회를 먼저 해 주세요.");
		return;
	}
	var user_grp = "";
	
	for(d of currentUserInfo.user.tags){
		if(d.length == 4){
			user_grp = d;
		}
	}
	// MOL상담원 SMS사용금지
	if(user_grp == '7096'){
		return;
	};
	var arrInData = new Array();
	arrInData[0] = currentCustInfo.CUST_ID;                                                                      	// 회원번호
	arrInData[1] = currentCustInfo.NAME;                                                                      		// 회원명
	arrInData[2] = currentCustInfo.MOBILNO != null?currentCustInfo.MOBILNO.replace(/-/gi,""):"";  					// 회원휴대폰
	arrInData[3] = currentCustInfo.MOBILNO_MBR != null?currentCustInfo.MOBILNO_MBR.replace(/-/gi,""):""; 			// 회원/모 휴대폰
	arrInData[4] = currentCustInfo.MOBILNO_FAT != null?currentCustInfo.MOBILNO_FAT.replace(/-/gi,""):""; 			// 회원/부 휴대폰
	arrInData[5] = "2";            																					// 휴대폰 디폴트 선택값 [ 1:회원 || 2:회원모 || 3:회원부 ]
	arrInData[6] = currentCustInfo.MBR_ID; 																			// 회원번호
	arrInData[7] = "";              // 상담일자
	arrInData[8] = "";              // 상담번호
	arrInData[9] = "";              // 상담순번
	PopupUtil.open('CCEMPRO046', 1000, 600 ,"", arrInData);
};

/******************************************************
 * 현금영수증 팝업
 ******************************************************/
 function onFeeReceipt(){
    /*
    var zsite = "ES";
    var sAddress = "<%=cb.getBasicCodeData("10")%>";
    var sUserId = "<%=S_USER_ID%>";
	var sUserpwd = "<%=S_USER_ID%>";
	var sPageName = "[cns1300] 현금영수증";
	var sParam = sAddress+"?zsite="+zsite+"&zlogin_id="+sUserId+"&zpasswd="+sUserpwd;
	gf_popup(sParam,sPageName,1000,600);
    */
	var surl = "";           //현금영수증 드림스 url
	var zsite = "ES";
	var slogin_id = currentUserInfo.user.external_id;
	var zpasswd = currentUserInfo.user.external_id;
	var name = "[cns1300] 현금영수증";

	getBasicList("10").then(function(d){	// 드림스 url 가져오기
		surl = d;
		var param = surl + "?zsite="+zsite+"&zlogin_id="+slogin_id+"&zpasswd="+zpasswd;
		window.open(param,'cashBill','width=1000', 'height=600', 'toolbar=no, menubar=no, scrollbars=no, resizable=no');
	});				
 }
 
 /******************************************************
  * 태블릿 배송조회 팝업
  ******************************************************/     
  function onIOCSPopup(){
  	var sMbrId = currentCustInfo.MBR_ID; // 회원번호를 가져옴     	
     	if(sMbrId == "" || sMbrId == null){        	       		        
     		client.invoke("notify", "회원번호가 없습니다.", "error", 5000);
      	return;
 	}
	var surl = "http://web.iocs.co.kr:8080/daekyo/popup/member/"+sMbrId;           //태블릿 url				
	var param = surl;
	window.open(param,'tabletDelPop','width=1000', 'height=600', 'toolbar=no, menubar=no, scrollbars=no, resizable=no');        
  }


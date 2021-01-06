
//=== GRID DEFINITION === //
var counselMain_studyProgressList_grid = null; 	// 상담메인 > 학습진행정보 grid
var counselMain_counselHist_grid = null;   		// 상담메인 > 상담이력 grid
var counselMain_studyTab_weeklyStat = null; 	// 상담메인 > 학습이력 > 주간학습현황 grid
var counselMain_studyTab_changeHist = null; 	// 상담메인 > 학습이력 > 변동이력 grid
var counselMain_studyTab_asignStuff = null; 	// 상담메인 > 학습이력 > 불출교재 grid
var counselMain_studyList_grid = null;  		// 상담메인	> 학습과목정보 grid
var counselMainTeacher_counselHist_grid = null; // 상담메인 선생님 > 상담이력 grid

var currentPop = { name : null };
var currentUnPop = { name : null };

var codeData;									// 전체 공통코드 정보

var currentUserInfo;							// 현재 사용중인 유저의 정보(ZENDESK)
var currentCustInfo;							// 현재 선택된 고객의 정보
var currentCounselInfo; 						// 현재 선택된 상담의 정보
var currentStudyInfo; 							// 현재 선택된 주간학습의 정보

var deptData;									// 현재 고객의 사업국 리스트
var lcData;										// 현재 고객의 센터 리스트

var topBarClient = null;						// 탑바 클라이언트 (ZAF CLIENT // TopBar)
var sideBarClient = null;						// 사이드바 클라이언트 (ZAF CLIENT // SideBar)
var backgroundClient = null;					// 백그라운드 클라이언트 (ZAF CLIENT // Background)


// TRIGGER
//sideBar client 받기
client.on("getSidebarClient", function(sideBarClient_d) {
	sideBarClient = sideBarClient_d;
});
client.on("getCodeData", function(d){
	codeData = d;
	console.log(codeData);
});

/**
 * 페이지의 모든 요소 초기화
 * @returns
 */
function initAll() {
	currentCustInfo = null;						// 현재 선택된 고객의 정보 초기화
	currentCounselInfo = null; 					// 현재 선택된 상담의 정보 초기화
	currentStudyInfo = null; 					// 현재 선택된 주간학습의 정보 초기화  
	
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
};

$(function(){
	
	// === === === === === === === === === === === === === === === === === === === //// INITIALIZING //// === === === === === === === === === === === === === === === === === === === 
	
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
				sideBarClient = client.instance(instanceGuid);
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
	  mask: '000000-0000000'
	};
	var mask = IMask(document.getElementById('custInfo_FAT_RSDNO'), maskOptions);
	
	// selectBox 공통 코드 불러오기
	getCodeList();
	
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
		switch($(this).attr('id')){
		// 고객정보
		case 'customerInfo':
			counselMain_counselHist_grid.refreshLayout();
			counselMain_studyProgressList_grid.refreshLayout();
			break;
		// 고객정보 - 고객, 선생님
		case 'customerTab':
			$("#assignMemberbtn").css("display","");
			$("#transferCallbtn").css("display","none");
			break;
		case 'teacherTab':
			$("#assignMemberbtn").css("display","none");
			$("#transferCallbtn").css("display","");
			break;
		// 고객찾기
		case 'customerSearch':
			customerSearchList_grid.refreshLayout();
			$("#customerName").focus();
			break;
			
		// 상담이력
		case 'customerCounselHist':
			counselMain_counselHist_grid.refreshLayout();
			counselMain_studyProgressList_grid.refreshLayout();
			break;
			
		// 학습이력
		case 'customerStudyHist':
			loadList('ifsStudyClass', counselMain_studyTab_weeklyStat);
			counselMain_studyTab_weeklyStat.refreshLayout();
			break;
		// 변동이력
		case 'studyTab_changeHist':
			counselMain_studyTab_changeHist.refreshLayout();
			break;
		// 불출교재
		case 'studyTab_asignStuff':
			counselMain_studyTab_asignStuff.refreshLayout();
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
	
	// 팝업 버튼
	$(".popup-btn").click(function() {
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
	});
	
});

// ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  === EVENT  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  === 

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
 * @param String
 * @returns
 * 20-12-17 최준혁
 */
function customerSearch(currentDiv){
	switch(currentDiv){
	case 'custSearchDiv' : 															// 고객 조회
		var param = {
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
		
		if($("#customerNameCheck").is(":checked")){			// 고객명
			param.send1[0].CHK_NAME = "Y";
			param.send1[0].NAME = $("#customerName").val();
		}
		if($("#customerPhoneCheck").is(":checked")){			// 전화번호
			param.send1[0].CHK_TELNO = "Y";
			param.send1[0].TELPNO = $("#customerPhone").val();
		}
		if($("#customerEmailCheck").is(":checked")){			// EMAIL
			param.send1[0].CHK_EMAIL = "Y";
			param.send1[0].EMAIL = $("#customerEmail").val();
		}
		if($("#customerGradeCheck").is(":checked")){			// 학년
			param.send1[0].CHK_GRADE = "Y";
			param.send1[0].GRADE_CDE = $("#customerGrade").val();
		}
		if($("#customerMNumCheck").is(":checked")){			// 회원번호
			param.send1[0].CHK_CUSTID = "Y";
			param.send1[0].MBR_ID = $("#customerMNum").val();
		}
		if($("#customerBirthCheck").is(":checked")){			// 생년월일
			param.send1[0].CHK_RSDNO = "Y";
			param.send1[0].RSDNO = $("#customerBirth").val();
		}
		if($("#customerAddrCheck").is(":checked")){			// 주소
			param.send1[0].CHK_ADDR = "Y";
			param.send1[0].ADDR = $("#customerAddr").val();
		}
		if($("#customerSubjectCheck").is(":checked")){			// 과목
			param.send1[0].CHK_PROD = "Y";
			param.send1[0].PRDT_ID = $("#customerSubject").val();
		}
		if($("#customerSpotCheck").is(":checked")){			// 지점
			param.send1[0].CHK_DEPT = "Y";
			param.send1[0].DEPT_NAME = $("#customerSpot").val();
		}
		if($("#customerDeptCheck").is(":checked")){			// 본부
			param.send1[0].CHK_UP_DEPT = "Y";
			param.send1[0].UPDEPTID = $("#customerDept").val();
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
		        	
		        	// 조회된 수가 1명 일 경우 자동 조회
		        	if(response.recv1.length == "1"){
		        		initAll(); 													// 기존 정보 초기화
		        		custInfo = customerSearchList_grid.getRow(0);
		        		var param = {
		        			    senddataids: ["send1"],
		        			    recvdataids: ["recv1"],
		        			    send1: [{
		        			    	"CUST_ID"		:custInfo.CUST_ID,				// 회원번호
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
		        		        loadCustInfoMain();									// 고객정보 로드 함수
		        		        	$("#customerInfo").click();	// 탭 이동
		        		        	$("#customerTab").click();	// 탭 이동
		        		        }else {
		        		        	loading.out();
		        		        	client.invoke("notify", response.errmsg, "error", 60000);
		        		        }
		        		    }, error: function (response) {
		        		    }
		        		});
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
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{"TCHR_NAME": "김소라"}]
		};
		$.ajax({
		    url: API_SERVER + '/cns.getTchrPdaInfo.do',
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(param),
		    success: function (response) {
		        console.log(response);
		        if(response.errcode == "0"){
		        	teacherSearchList_grid.resetData(response.recv1);
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
	console.log(CODE_MK_LIST);
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
	
	if(currentCustInfo.BIRTH_MK == "1"){
		$("#solar").css('display','');
		$("#lunar").css('display','none');
		$("#lunarSolarInput").val("1");
	}else {
		$("#lunar").css('display','');
		$("#solar").css('display','none');
		$("#lunarSolarInput").val("2");
	}
	
	familyInfoLoad();												// 관계회원정보 불러오기
	studyInfoLoad();												// 복수학습정보 불러오기
	setCertData();													// 정보동의 NAME 맵핑
	
	loadList('counselHist', counselMain_counselHist_grid);			// 상담이력 목록 불러오기				//OLD >> counselHistLoad();		// 상담이력 목록 불러오기
	loadList('currentStudy', counselMain_studyProgressList_grid);	// 학습진행정보 목록 불러오기			//OLD >> currentStudyLoad();	// 학습진행정보 목록 불러오기

}

/**
 * 가족관계회원 조회
 * @returns
 * 20-12-30 최준혁
 */
function familyInfoLoad() {
	
	$("#custInfo_FAMILY_CMB").empty();
	
	var param = {
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
	        			custMbr = d.MBR_ID;
        				$("#custInfo_FAMILY_CMB").prepend(`<option value='${custId}'>${custWhere} ${custName} ${custRel} ${custGrade} ${custMbr} ${custId}</option>`);
	        		}
	        		$("#custInfo_FAMILY_CMB option:eq(0)").prop("selected", true);
	        	}
	        }else {
	        	loading.out();
	        	client.invoke("notify", response.errmsg, "error", 60000);
	        }
	    }, error: function (response) {
	    }
	});
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
function loadList(id, grid) {
	if(currentCustInfo) {
		var param = {
				senddataids: ["send1"],
				recvdataids: ["recv1"],
				send1: [{}]
		};
		var sendUrl = '';
		
		switch(id){
		case 'counselHist':		// 상담이력 
			param.send1[0].CUST_ID = currentCustInfo.CUST_ID;				// 고객번호
			sendUrl = '/cns.getCounselHist.do';
			break;
		case 'currentStudy':	// 학습진행정보
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			sendUrl = '/cns.getStudyData.do';
			break;
		case 'ifsStudyClass':	// 주간학습현황
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			sendUrl = '/cns.ifsStudyClass.do';
			break;
		case 'ifsStudyChgInfo':	// 변동이력
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			param.send1[0].PRDT_ID = currentStudyInfo.PRDT_ID				// 제품(과목)번호
			sendUrl = '/cns.ifsStudyChgInfo.do';
			break;
		case 'getShipSTS':		// 불출교재
			param.send1[0].MBR_ID = currentCustInfo.MBR_ID					// 회원번호
			param.send1[0].PRDT_ID = currentStudyInfo.PRDT_ID				// 제품(과목)번호
			sendUrl = '/cns.getShipSTS.do';
			break;
		case 'getCounselSubj':	// 상담과목
			param.send1[0].CSEL_DATE = currentCounselInfo.CSEL_DATE			// 상담일자
			param.send1[0].CSEL_NO = currentCounselInfo.CSEL_NO				// 상담번호
			param.send1[0].CSEL_SEQ = currentCounselInfo.CSEL_SEQ			// 상담순번
			sendUrl = '/cns.getCounselSubj.do';
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
					grid.refreshLayout()
					
					// 후처리
					switch(id){
					case 'ifsStudyClass':
						counselMain_studyTab_weeklyStat.addSelection({rowKey:0});
						counselMain_studyTab_weeklyStat.clickSort({rowKey:0});
						currentStudyInfo = counselMain_studyTab_weeklyStat.getRow(0);		// 변동이력, 불출교재 자동조회
						loadList('ifsStudyChgInfo', counselMain_studyTab_changeHist);				
						loadList('getShipSTS', counselMain_studyTab_asignStuff);	
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
	if($("#custInfo_FAT_RSDNO").length-1 != 13){
		client.invoke('notify','관계번호를 입력하신 후에 관계회원으로 등록하시기 바랍니다.', 'alert', 5000);
		return;
	}
	
	 //변경된 정보가 존재하는지 체크
    if(isCustDataChanged()) {
        alert("고객정보를 변경하셨습니다. \n\n먼저 저장을 하시고 관계회원 등록을 하시기 바랍니다.");
        return;
    }
}

/**
 * 고객정보 수정 유무 확인
 * @returns
 * 21-01-06 최준혁
 */
function isCustDataChanged() {
	if($("#custInfo_NAME").val() != currentCustInfo.NAME){										// 고객명
		return false;
	}
	if(currentCustInfo.FML_RANK != null){
		if($("#custInfo_FML_RANK").val() != currentCustInfo.FML_RANK){							// 형제서열
			return false;
		}
	}
	if(currentCustInfo.GND != null){
		if($("#custInfo_GND").val() != currentCustInfo.GND){									// 성별
			return false;
		}
	}
	if(currentCustInfo.BIRTH_YMD != null){
		if($("#custInfo_BIRTH_YMD").val().replace(/-/gi,"") != currentCustInfo.BIRTH_YMD){		// 생년월일
			return false;
		}
	}
	if(currentCustInfo.BIRTH_MK != null){
		if($("#lunarSolarInput").val() != currentCustInfo.BIRTH_MK){							// 양력,음력
			return false;
		}
	}
	if(currentCustInfo.GRADE_CDE != null){
		if($("#custInfo_GRADE_CDE").val() != currentCustInfo.GRADE_CDE){						// 학년
			return false;
		}
	}
	if(currentCustInfo.DDD != null){
		if($("#custInfo_DDD").val() != currentCustInfo.DDD){									// 자택전화
			return false;
		}
		if($("#custInfo_TELPNO1").val() != currentCustInfo.TELPNO1){
			return false;
		}
		if($("#custInfo_TELPNO2").val() != currentCustInfo.TELPNO2){
			return false;
		}
	}
	if(currentCustInfo.MOBILNO != null){
		if($("#custInfo_MOBILNO1").val()+$("#custInfo_MOBILNO2").val()+$("#custInfo_MOBILNO3").val() != currentCustInfo.MOBILNO){						// 회원전화번호
			return false;
		}
	}
	if(currentCustInfo.ZIPCDE != null){
		if($("#custInfo_ZIPCDE").val() != currentCustInfo.ZIPCDE){								// 우편번호
			return false;
		}
	}
	if(currentCustInfo.ZIP_ADDR != null){
		if($("#custInfo_ZIP_ADDR").val() != currentCustInfo.ZIP_ADDR){							// 기본주소
			return false;
		}
	}
	if(currentCustInfo.ADDR != null){
		if($("#custInfo_ADDR").val() != currentCustInfo.ADDR){									// 상세주소
			return false;
		}
	}
	
	return true;
}

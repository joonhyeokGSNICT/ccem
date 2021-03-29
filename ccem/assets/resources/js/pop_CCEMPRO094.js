var currentMosData;
var currentProcData;
var userMK;
var overseerCode;

$(function(){
	
	getBasicList("28").then(function(d){	// 특정 아이디 베이직 코드 호출
		overseerCode = d;
		onSearch();
	});	

	if(opener.currentUser.tags.includes("user_lvl_mk_1")){
		userMK = 1;
	}else if(opener.currentUser.tags.includes("user_lvl_mk_2")){
		userMK = 2;
	}else if(opener.currentUser.tags.includes("user_lvl_mk_3")){
		userMK = 3;
	}else if(opener.currentUser.tags.includes("user_lvl_mk_4")){
		userMK = 4;
	}
	
	// input mask
	$(".imask-date").each((i, el) => calendarUtil.init(el.id,{ drops: "up" }));
});

/**
 * MOS 조회
 * @returns
 */
function onSearch(){
	var settings = {
			url: `${API_SERVER}/cns.getMosInfo.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{
							"CSEL_DATE"	: POP_DATA.CSEL_DATE,			// 상담 날짜
							"CSEL_NO"	: POP_DATA.CSEL_NO,				// 상담 번호
							"CSEL_SEQ"	: POP_DATA.CSEL_SEQ,			// 상담 순번
						}],
			}),
		}

	$.ajax(settings)
		.done(data => {
			// console.log("정보내용->:",data);
			currentMosData = data.dsRecv[0];
			if(currentMosData == undefined){
				$("#tempSave").prop('disabled',true);
				$("#procSave").prop('disabled',true);
				$("#finalSave").prop('disabled',true);
				return;
			}
			
			if(currentMosData.ANSWER_YN == 'Y'){
				setDisableAns();
			}else {
				
			}
			$("#mos_TITLE").val(currentMosData.TITLE);
			$("#mos_EMP_ID").val(currentMosData.EMP_ID);
			$("#mos_EMP_NM").val(currentMosData.EMP_NM);
			$("#mos_DEPT_NM").val(currentMosData.DEPT_NM);
			$("#mos_ZERDAT").val(FormatUtil.dateTime(currentMosData.ZERDAT));
			$("#mos_QUESTION").val(currentMosData.QUESTION);
			$("#mos_ANSWER").val(currentMosData.ANSWER);
		})
		.fail(error => {
		});
	
	var settingsProc = {
			url: `${API_SERVER}/cns.getCselProc.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{
							"CSEL_DATE"	: POP_DATA.CSEL_DATE,			// 상담 날짜
							"CSEL_NO"	: POP_DATA.CSEL_NO,				// 상담 번호
							"CSEL_SEQ"	: POP_DATA.CSEL_SEQ,			// 상담 순번
							"CUST_ID"	: POP_DATA.CUST_ID,				// 고객 번호
							"CUST_MK"	: POP_DATA.CUST_MK,				// 고객 구분
						}],
			}),
		}
	
	$.ajax(settingsProc)
	.done(data => {
		// console.log("처리내용->:",data);
		if(data.errcode == 0){
			currentProcData = data.dsRecv[0];
			if(currentProcData == undefined){
				$("#tempSave").prop('disabled',true);
				$("#procSave").prop('disabled',true);
				$("#finalSave").prop('disabled',true);
				return;
			}
			setActiveControl();
			$("#mos_PROC_DATE").val(FormatUtil.date(currentProcData.PROC_DATE));
			$("#mos_PROC_CNTS").val(currentProcData.PROC_CNTS);
			$("#mos_PROC_USER_NM").val(currentProcData.PROC_USER_NM);
			
		}
	})
	.fail(error => {
	});
}

//============================================================================
// 항목 비활성 제어 함수
//============================================================================
function setActiveControl(PROC_STS_MK){
    switch(PROC_STS_MK){
        case "01": //접수
        case "03": //지점처리중                
            if($("#mos_PROC_USER_NM").val() == "") {
            	$("#mos_PROC_USER_NM").val(opener.currentUser.name);
            	currentProcData.PROC_USER_ID = opener.currentUser.external_id;
            }
            if($("#mos_PROC_DATE").val().replace(/-|_/gi,"") == ""){
                $("#mos_PROC_DATE").val(getToday(0));
            }
            break;

        case "04": //지점처리완료(i/b해피콜 대상)
        case "15": //해피콜완료                
        	$("#happyCallChk").prop('checked',true);
        case "99": //완료                   
            //지점처리자 설정-자신과 관리자만 수정 가능함.
            //상담결과_상담원처리 예외 권한 사용자번호[cb.getBasicCodeData("28")] - 2007.03.03 김미경과장 요청사항
            if(currentProcData.PROC_USER_ID == opener.currentUser.external_id 	||
               currentProcData.CSEL_USER_ID == opener.currentUser.external_id 	||
               currentProcData.PROC_USER_ID == null               				||
               opener.currentUser.external_id == ""                            	||
               userMK <= 3                                  ){

                //수정가능함.

            //다른사람일경우 비활성화
            }else{
                if(overseerCode == opener.currentUser.external_id){
                    switch(currentProcData.CSEL_STYPE_CDE){
                        case "1050201":
                        case "1050202":
                            break;
                        default:
                        	$("#mos_PROC_DATE").attr('disabled',true);
                        	$("#mos_PROC_CNTS").attr('disabled',true);
                        	break
                    }

                }else{
                	$("#mos_PROC_DATE").attr('disabled',true);
                	$("#mos_PROC_CNTS").attr('disabled',true);
                }
            }               
            break;
    }
    
}	
//============================================================================
//답변내역 비활성
//============================================================================
function setDisableAns(){       
	$("#tempSave").prop('disabled',true);
	$("#finalSave").prop('disabled',true);
	$("#mos_ANSWER").prop('readonly',true);        
}     

//============================================================================
//처리내역 비활성
//============================================================================
function setDisableProc(){
	$("#mos_PROC_CNTS").prop('readonly',true);  
    $("#mos_PROC_DATE").prop('readonly',true);  
}    

//============================================================================
// 버튼 클릭시(1:답변임시저장,2:답변저장,3:처리내역저장)
//============================================================================
function onBtnClick(iIdx){
	onSave(iIdx);
	onProcSave();
}	

//============================================================================
// 답변 저장버튼 클릭시(1:답변임시저장,2:답변저장)
//============================================================================
function onSave(sVal){
    //if(gf_isWorking()) return;
	
	var param = {
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{
						"ANSWER_YN"	: "",			// 답변여부
					}],
		};
	
     
    // 최종제출시에 처리내역만 저장
    if(currentMosData.ANSWER_YN == "Y") return;        
                                   
    // 1: 답변임시저장, 2:답변저장        		
    if(sVal=="2"){
    	// 답변내역이 없을때 저장 안함
    	if(!onChkAns()) return;        	    	
    	
    	if(!confirm("MOS에 답변내역을 제출하시겠습니까?")) 
    	return;
    	param.dsSend[0].ANSWER_YN = "Y";
    	param.dsSend[0].XI_YN = "N";
    	// 버튼 처리
    	setDisableAns();        	        	
    }		
    
    param.dsSend[0].ANSWER_USER_ID = opener.currentUser.external_id;
    param.dsSend[0].ANSWER_USER_NM = opener.currentUser.name;  
    param.dsSend[0].QNA_SEQ = currentMosData.QNA_SEQ;
    param.dsSend[0].ANSWER = $("#mos_ANSWER").val();
    
    $.ajax({
			url: `${API_SERVER}/cns.upMosInfo.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify(param),
		})
	.done(data => {
		// console.log("답변저장->:",data);
	})
	.fail(error => {
	});
    
    //window.returnValue = true;        
}	

//============================================================================
// 처리내역 저장버튼 클릭시
//============================================================================
function onProcSave(){
    //if(gf_isWorking()) return;
    			
    var isOk = "N";
    var param = {
    		senddataids: ["DS_CHKDATA","DS_PROC","DS_HPCALL","DS_GIFT"],
			recvdataids: ["dsRecv"],
			DS_CHKDATA: [{
							"PROC_STS_MK"	: "",			// 처리상태
						}],
			DS_PROC: [{}],
			DS_HPCALL: [{}],
			DS_GIFT: [{}],
		};
    
    switch(currentProcData.PROC_STS_MK){
        case "01" :
        case "03" :
            if(onChkProc()) {
                isOk = "Y";
                param.DS_CHKDATA[0].PROC_STS_MK = "03";
                param.DS_PROC[0].PROC_STS_MK = "03";
            }

            break;

        case "04" :
            //해피콜여부 체크시는 해피콜내용 체크함.
            //해피콜여부 체크후에도 지점처리 수정 가능하게 작업
            if( $("#happyCallChk").is(':checked') ){
                if(onChkProc()){
                    isOk = "Y";
                    //해피콜 입력 검사
                    if(onChkHpCall()){
                    	param.DS_CHKDATA[0].PROC_STS_MK = "15";
                    	param.DS_PROC[0].PROC_STS_MK = "15";
                    	$("#happyCallChk").prop('checked',false);
                    }
                }    
            }else{
                //해피콜여부 체크해제시는 다시 03으로 돌아감
                if(onChkProc()) {
                    isOk = "Y";
                    param.DS_CHKDATA[0].PROC_STS_MK = "03";
                    param.DS_PROC[0].PROC_STS_MK = "03";
                }
            }
            
            break;

        case "15" :
        case "99" :
            if(onChkProc()){
                isOk = "Y";
            }

        default   :
    }

    if( isOk == "Y" ){
        //해피콜대상 체크되어 있으면
        if($("#happyCallChk").is(':checked')) {
            if(param.DS_CHKDATA[0].PROC_STS_MK != "15" &&
        		param.DS_CHKDATA[0].PROC_STS_MK != "99" ){
            	param.DS_CHKDATA[0].PROC_STS_MK = "04";
            	param.DS_PROC[0].PROC_STS_MK = "04";
            }
        }
        
        // DS_CHKDATA -  상담결과 저장 체크데이터
        param.DS_CHKDATA[0].CSEL_DATE = currentProcData.CSEL_DATE;
        param.DS_CHKDATA[0].CSEL_NO = currentProcData.CSEL_NO;
        param.DS_CHKDATA[0].CSEL_SEQ = currentProcData.CSEL_SEQ;
        param.DS_CHKDATA[0].CUST_ID = currentProcData.CUST_ID;
        
        // DS_PROC - 처리내역 데이터
        if(currentProcData.PROC_USER_ID == null) {param.DS_PROC[0].ROW_TYPE = 'I'}else{param.DS_PROC[0].ROW_TYPE = 'U'};
        param.DS_PROC[0].CSEL_DATE = currentProcData.CSEL_DATE;
        param.DS_PROC[0].CSEL_DATE = currentProcData.CSEL_DATE;
        param.DS_PROC[0].CSEL_NO = currentProcData.CSEL_NO;
        param.DS_PROC[0].CSEL_SEQ = currentProcData.CSEL_SEQ;
        param.DS_PROC[0].PROC_DATE = $("#mos_PROC_DATE").val().replace(/(-|_)/g,"");
        param.DS_PROC[0].PROC_USER_ID = opener.currentUser.external_id;
        param.DS_PROC[0].PROC_CNTS = $("#mos_PROC_CNTS").val();
        
        $.ajax({
			url: `${API_SERVER}/cns.saveCselProc.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify(param),
		})
		.done(data => {
			// console.log("처리저장->:",data);
			alert("저장 되었습니다.");
		})
		.fail(error => {
		});
        //window.returnValue = true;

    }

}   

//============================================================================
//답변 조건 체크
//============================================================================
function onChkAns(){
    if( $.trim($("#mos_ANSWER").val()) != "" &&
    	currentMosData.ANSWER != null && 
    	currentMosData.ANSWER != ""){
        return true;
    }else{
        alert("답변내역을 입력하세요.");
        return false;
    }
}       

//============================================================================
//지점처리 조건 체크
//============================================================================
function onChkProc(){
    if( opener.currentUser.external_id != "" &&
        $.trim($("#mos_PROC_CNTS").val()).length > 0    ){
        return true;
    }else{
        alert("지점 처리 내용을 입력하세요.");
        return false;
    }
}    

//============================================================================
//해피콜 조건 체크
//============================================================================
function onChkHpCall(){
    
    //처리사용자가 존재하고,
    //처리내용,해피콜제목,해피콜내용이 존재하면,
    if( currentProcData.PROC_USER_ID != ""   && currentProcData.PROC_USER_ID != null &&
        $.trim($("#mos_PROC_CNTS").val()).length > 0      &&
        currentProcData.HPCALL_TITLE != null && currentProcData.HPCALL_TITLE != "" &&
        currentProcData.HPCALL_CNTS != null && currentProcData.HPCALL_CNTS != ""){            	            	
        return true;
    }else{
        //alert("제목 또는 내용을 입력하세요");
        //return false;
    }
}       


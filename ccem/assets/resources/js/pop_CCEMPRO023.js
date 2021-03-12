/**
 * 전역변수
 */

var topbarObject = opener.topbarObject; // tobar window
var callClient                          // wiseNtalk window

var sJobType // 저장구분
var deptInfo // 사업국정보
var lcInfo // 센터정보
var attorneyInfo // 대리인정보
var tempData // 개인정보동의 정보 값
var codeData = opener.codeData;

var currentSelectedNum = '';

var currentUserInfo = topbarObject.currentUserInfo;

var transData;  // wiseNtalk리턴값

/**
 * 초기로드
 */
function init(){
	topbarObject.wiseNTalkUtil.saveWindowObj(window);
    setCodeData();
    sJobType = openInfo.save();
    var dept_ID = opener.$('#textbox5').val();
    var lc_ID = opener.$('#hiddenbox1').val();
    var cust_ID = opener.$('#hiddenbox6').val();
    // var cust_ID = opener.$('#textbox22').val();
    var tempArray = {}; // 

    // 사업국 정보 입력
    if(dept_ID != ""){
    	api.getOrgInfo( { "DEPT_ID" : dept_ID }, '/cns.getDeptInfo.do', ["dsRecv"] ).then( function(data){
    		// console.log(data);
    		deptInfo = data.dsRecv[0];
    		$('#textbox1').val(deptInfo.DEPT_NAME); // 사업국 삽입
    		$('#textbox2').val(deptInfo.DEPT_EMP_NAME ? deptInfo.DEPT_EMP_NAME : ""); // 사업국 국장 삽입
    		$('#textbox3').val(deptInfo.DEPT_REP_EMP_HP ? deptInfo.DEPT_REP_EMP_HP : ""); // 사업국장 핸드폰 삽입
    	})
    }
    
    // 센터 정보 입력
    if(lc_ID != ""){
    	if (! isEmpty(lc_ID) ){
    		api.getOrgInfo( { "LC_ID" : lc_ID }, '/cns.getLCInfo.do', ["dsRecv"] ).then( function(data){
    			// console.log(data);
    			lcInfo = data.dsRecv[0];
    			$('#textbox4').val(lcInfo.LC_NAME); // 센터 삽입
    			$('#textbox5').val(lcInfo.LC_EMP_NAME ? lcInfo.LC_EMP_NAME : ""); // 센터장 삽입
    			$('#textbox6').val(lcInfo.LC_REP_EMP_HP ? lcInfo.LC_REP_EMP_HP : ""); // 센터장 핸드폰 삽입
    		})
    	}
    }
    
    // 대리인 정보 입력
    api.getOrgInfo( { "CUST_ID" : cust_ID }, '/cns.getCustFatInfo.do', ["dsRecv"] ).then( function(data){
        // console.log(cust_ID);
        // console.log(data);
        attorneyInfo = data.dsRecv[0];
        if ( data.dsRecv.length > 0 ) {
            $('#textbox7').val(attorneyInfo.FAT_NAME ? attorneyInfo.FAT_NAME : "" ); // 대리인명 삽입
            $("#selectbox1").val(attorneyInfo.FAT_REL ? attorneyInfo.FAT_REL : "" ); // 대리인 관계 설정
    
            tempArray.FAT_NAME = attorneyInfo.FAT_NAME ? attorneyInfo.FAT_NAME : ""; //	대리인명
            tempArray.FAT_REL = attorneyInfo.FAT_REL ? attorneyInfo.FAT_REL : ""; //	대리인관계
        }
    })

    // 저장구분에 따라 값 가져오기
    if(sJobType == 'U') {
        api.getOrgInfo( {   "CUST_ID" : cust_ID, 
                            "CSEL_DATE": opener.calendarUtil.getImaskValue("textbox27"),
                            "CSEL_NO" : opener.$('#textbox28').val(),
                            "CSEL_SEQ" : opener.$('#selectbox14').val() }, 
                         '/cns.getInfoAgree.do', 
                         ["dsRecv2", "dsRecv1"] ).then( function(data){
            // console.log(data);
            tempArray.MBR_ID = cust_ID; //	고객번호
            if ( data.dsRecv1.length > 0 ) {
                tempArray.CSEL_DATE = data.dsRecv1[0].CSEL_DATE; // 상담일자
                tempArray.CSEL_NO = data.dsRecv1[0].CSEL_NO;	// 상담번호
                tempArray.CSEL_SEQ = data.dsRecv1[0].CSEL_SEQ; //	상담순번
                tempArray.CUST_ID = data.dsRecv1[0].CUST_ID; //	고객번호
                tempArray.RST_MK = data.dsRecv1[0].RST_MK; //	동의결과
                tempArray.ENT_YN = data.dsRecv1[0].ENT_YN; //	회원입회약관
                tempArray.INFO_YN = data.dsRecv1[0].INFO_YN; //	개인정보수집이용동의
                tempArray.SMS_YN = data.dsRecv1[0].SMS_YN; //	마케팅동의
                tempArray.SMS_SAVE_YN = data.dsRecv1[0].SMS_SAVE_YN; //	보존및마케팅
                tempArray.CSEL_CNTS = data.dsRecv1[0].CSEL_CNTS //	메모
                tempArray.THIRD_YN = data.dsRecv1[0].THIRD_YN; //	제3자제공동의
            } 
            tempArray.CTI_CHGDATE = ""; //	변경일

            // 화면에 보이기
            $('#selectbox2').val(tempArray.RST_MK); // 동의결과
            $('#selectbox3').val(tempArray.ENT_YN); // 약관안내
            $('#selectbox4').parent().prev().children().eq(0).val(tempArray.INFO_YN); // 필수
            $('#selectbox4').val(tempArray.INFO_YN); 
            $('#selectbox5').parent().prev().children().eq(0).val(tempArray.SMS_YN); // 마케팅동의
            $('#selectbox5').val(tempArray.SMS_YN);
            $('#selectbox6').parent().prev().children().eq(0).val(tempArray.SMS_SAVE_YN); // 보존 및 마케팅
            $('#selectbox6').val(tempArray.SMS_SAVE_YN);
            $('#selectbox7').parent().prev().children().eq(0).val(tempArray.THIRD_YN); // 제3자 제공동의
            $('#selectbox7').val(tempArray.THIRD_YN);
            $('#textbox8').val(tempArray.CSEL_CNTS); // 메모
        });
        tempData = tempArray;
    }
};

const openInfo = {
    /**
     * 상담 저장구분 조회(I:신규, U:수정)
     */
    save() {
        const selectbox = opener.document.getElementById("selectbox14");
        const selectedSeq = selectbox.value;
        const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;	
        return sJobType;
    },
    getWiseNtalk() {
        topbarObject.get('instances').then(function(instancesData) {
            var instances = instancesData.instances;
            for ( var instanceGuid in instances) {
                if (instances[instanceGuid].location === 'WiseN Talk') {
                    callClient = client.instance(instanceGuid);
                    // callClient.trigger("getSidebarClient", client._instanceGuid);
                }
            }
        });
    }
}

const api = {
    /**
     * 사업국, 센터 정보 조회
     * @param {string} orgId 사업국/센터ID
     * @param {string} apiURL 사업국/센터조회 API전송 
     * @param {string} recv recv파일그룹 설정 
     */
    getOrgInfo(orgId, apiURL, recv) {
        return new Promise(function(resolve, reject){
            const settings = {
                global: false,
                url: `${API_SERVER}`+apiURL,
                method: 'POST',
                contentType: "application/json; charset=UTF-8",
                dataType: "json",
                data: JSON.stringify({
                    senddataids: ["dsSend"],
                    recvdataids: recv,
                    dsSend: [orgId],
                }),
                success: function (response) {
                    // console.log("getOrgInfo >> ",response.dsRecv);
                    resolve(response);
                }, error: function (response) {
                }
            }
            $.ajax(settings); 
		});
    },
}

var btn = {
     /*****************************************
	*	CCEMPRO002에 개인정보동의 배열 전송
	*****************************************/	
    sendOpener(prop) {
        var sConfMsg = "";
        if ( ( $('#selectbox4 option:selected').val() == '' ) && $('#selectbox2 option:selected').val() == '2' ) {
            sConfMsg = "필수 동의를 받으셔야 저장하실 수 있습니다.";
            ModalUtil.modalPop("알림",sConfMsg);
            return;
        } else if ( $('#selectbox4 option:selected').val() == 'N' && $('#selectbox2 option:selected').val() == '2' ) {
            sConfMsg = "필수동의가 '거부'이면 동의결과는<br>[동의실패] 혹은 [동의요청취소]로<br>변경되어야 합니다.";
            ModalUtil.modalPop("알림",sConfMsg);
            $('#selectbox2').focus();
            $('#selectbox2').val('');
            return;
        }

        if(! isEmpty($('#selectbox2 option:selected').text()) ) {
            sConfMsg = "[ "+$('#selectbox2 option:selected').text()+" ] 로 저장하시겠습니까?";
            ModalUtil.confirmPop("확인 메세지", sConfMsg, function(){
                var tempArray = {};
    
                tempArray.CSEL_DATE = opener.calendarUtil.getImaskValue("textbox27"); // 상담일자
                tempArray.CSEL_NO = opener.$('#textbox28').val();	// 상담번호
                tempArray.CSEL_SEQ = opener.$('#selectbox14').val(); //	상담순번
                tempArray.CUST_ID = opener.$('#hiddenbox6').val(); //	고객번호
                tempArray.RST_MK = $('#selectbox2').val(); //	동의결과
                tempArray.ENT_YN = $('#selectbox3').val(); //	회원입회약관
                tempArray.INFO_YN = $('#selectbox4').val() ? $('#selectbox4').val() : "N"; //	개인정보수집이용동의
                tempArray.SMS_YN = $('#selectbox5').val() ? $('#selectbox5').val() : "N"; //	마케팅동의
                tempArray.SMS_SAVE_YN = $('#selectbox6').val() ? $('#selectbox6').val() : "N"; //	보존및마케팅
                tempArray.THIRD_YN = $('#selectbox7').val() ? $('#selectbox7').val() : "N"; //	제3자제공동의
                tempArray.CSEL_CNTS = $('#textbox8').val(); //	메모
                tempArray.FAT_NAME = $('#textbox7').val() ? $('#textbox7').val() : ""; //	대리인명
                tempArray.FAT_REL = $('#selectbox1').val(); //	대리인관계
                tempArray.CTI_CHGDATE = opener.calendarUtil.getImaskValue("textbox27"); //	변경일
                
                opener.DS_DROP_TEMP2 = tempArray;
                opener.document.getElementById('textbox13').value = $('#textbox8').val() + '\n' + opener.document.getElementById('textbox13').value
    
                window.close();
            }, function() {
                return;
            });
        } else {
            sConfMsg = "동의결과가 선택되어 있지 않습니다.";
            ModalUtil.modalPop("알림",sConfMsg);
            $('#selectbox2').focus();
            return;
        }
        
        var sendTalkData = $("#essential_Ag").val() + '&' + $("#marketing_Ag").val() + '&' + $("#conserve_Ag").val() + '&' + $("#thirdPerson_Ag").val() + "&";
        
        // wiseNtalk에 데이터 송신
        topbarObject.client.request({
		      url:'/api/v2/apps/notify.json',
		      method: 'POST',
		      headers: { "Content-Type": "application/json" },
		      data: JSON.stringify({"event": "conferenceStr", "app_id": topbarObject.WiseNTalk_ID, "agent_id": topbarObject.currentUserInfo.user.id, "body":sendTalkData})
		   }).then(function(d){
		   }).catch(function(d){
		      console.log(d);
		   });
    },
    
    /*****************************************
	*	닫기 버튼 클릭시
	*****************************************/	
    onClose(){
        var sConfMsg = "저장하지 않고 창을 닫으시겠습니까?";
        ModalUtil.confirmPop("확인 메세지", sConfMsg, function(){
            window.close();
        }, function() {
            return;
        });
    },

    //============================================================================
    // IVR을 통해 주민번호를 가져오는 함수
    //============================================================================    
    onIVRCertify(cs){
        // window // 현재 윈도우 값
    	currentSelectedNum = cs;
        // if( callClient.isWorking() ) return; // Wise N talk에서 현재 통화중인지 확인        
        var sConfMsg = "IVR을 통해 증빙번호를 가져오시겠습니까?"
        ModalUtil.confirmPop("확인 메세지", sConfMsg, function(){
            // callClient.setBlock(true); // ???
            
            //============================================================================
            // IVR과 3자통화하는 함수(AS-IS)
            //============================================================================
            // param1(cs) : 1 = 6111(주민번호 입력)
            //              2 = 6112(현금영수증 증빙번호 입력)
            //              3 = 6113(MOL 전화결재)
            //              4 = 6114(강원심층수 전화결재)
            //              5 = 6115(개인정보 동의 전체1~4)
            //              6 = 6116(개인정보 동의 전체2~4)
            //              7 = 6117(개인정보 동의 전체3~4)
            //              8 = 6118(필수동의)
            //              9 = 6119(마케팅동의)
            //             10 = 6120(보존동의)
            //             11 = 6121(제3자 제공동의)
            // param2(window) : 호출한 윈도우의 객체
            //============================================================================

            // callClient.onIVRCertify(cs,window); // wiseNtalk으로 전환 확인
            console.log("onIVRCertify >> ",cs);
            var requestNum = '0';
            switch(cs){
            case '1':
            	requestNum = '6111';
            	break;
            case '2':
            	requestNum = '6112';
            	break;
            case '3':
            	requestNum = '6113';
            	break;
            case '4':
            	requestNum = '6114';
            	break;
            case '5':
            	requestNum = '6115';
            	break;
            case '6':
            	requestNum = '6116';
            	break;
            case '7':
            	requestNum = '6117';
            	break;
            case '8':
            	requestNum = '6118';
            	break;
            case '9':
            	requestNum = '6119';
            	break;
            case '10':
            	requestNum = '6120';
            	break;
            case '11':
            	requestNum = '6121';
            	break;
            }
            if(topbarObject.CTI_STATUS.state != 'ACTIVE'){
            	alert('연결 할 수 없는 상태입니다. \n 전화 연결 후에 시도 해 주세요.');
            	return;
            }
            
            loading = new Loading(getLoadingSet('전화 연결 중 입니다..'));
            
            topbarObject.wiseNTalkUtil.requestTransfer(requestNum);
            
        }, function() {
            return;
        });

        // ces-top에 넣은 내용
        // function testtop(window){
        // 	console.log("ccem-top");
        // 	window.testtop();
        // }
    },

    //============================================================================
    // IVR을 통해 호전환 중단 요청
    //============================================================================    
    cancelTran() {
        // callClient.cancelTran(); // wiseNtalk로 호전환중단 요청
    	//loadAgreement();
    },

    //============================================================================
    // sms버튼 클릭 이벤트
    //============================================================================    
    smsOnClick(prop){
        var arrInData = new Array();
        arrInData[0] = "";  // 회원번호
        if ( prop == 'dept' ) {
            // if ( isEmpty( $('#textbox2').val() ) ) return;
            arrInData[1] = $('#textbox2').val();  // 사업국장
            arrInData[2] = $('#textbox3').val();  // 휴대폰번호    
        } else if ( prop == 'lc') {
            // if ( isEmpty( $('#textbox5').val() ) ) return;
            arrInData[1] = $('#textbox5').val();  // 센터장
            arrInData[2] = $('#textbox6').val();  // 휴대폰번호
        } else {
            arrInData[1] = "";  // 회원명
            arrInData[2] = "";  // 회원휴대폰
        }
        arrInData[3] = "";  // 회원/모 휴대폰
        arrInData[4] = ""; // 회원/부 휴대폰
        arrInData[5] = "1";   // 휴대폰 디폴트 선택값 [ 1:회원 || 2:회원모 || 3:회원부 ]
        arrInData[6] = opener.$('#hiddenbox6').val(); //	고객번호
        arrInData[7] = opener.calendarUtil.getImaskValue("textbox27"); // 상담일자
        arrInData[8] = opener.$('#textbox28').val();   // 상담번호
        arrInData[9] = opener.$('#selectbox14').val(); //	상담순번

        console.log(arrInData);
        PopupUtil.open('CCEMPRO046', 1000, 600 ,"", arrInData);
    }
}

/**
 * 콤보박스 세팅
 * - as-is : cns5810.setCodeData()
 */
const setCodeData = () => {

	const CODE_MK_LIST = [
		"FAT_REL",		// 내담자
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
		// if (codeType == "FAT_REL") { // 지급사유
		// 	if (codeVal == "04" || codeVal == "05" || codeVal == "06" || codeVal == "07" || codeVal == "08"|| codeVal == "09" || codeVal == "10" || codeVal == "11" || codeVal == "12" || codeVal == "13") continue;
		// }

		// set
		$(`select[name='${codeType}']`).append(new Option(codeNm, codeVal));
	}
}

function changeVal(temp) {
    temp.parentNode.previousSibling.previousSibling.firstChild.value = temp.value;
}

/**
 * 개인정보이용동의 정보 조회
 * @returns
 */
function loadAgreement(){
	var param = {
			userid: currentUserInfo.user.external_id,
		    menuname: '개인정보동의',
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: 	[
		    			{
		    				"CALLKEY": 	currentUserInfo.user.user_fields.extension_number,
		    			}
		    		]
		};
	// 개인정보이용동의 정보 조회
	$.ajax({
		url: API_SERVER + '/cns.getIvrCertify.do',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(param),
		global: false,
		success: function (response) {
			console.log(response);
			if(response.errcode == "0"){
				if(response.recv1.length > 0){
					/*$("#selectbox4").val(response.recv1[0].CERTIFY_NO.substring(0,1));
					$("#essential_Ag").val($("#selectbox4").val());
					$("#selectbox5").val(response.recv1[0].CERTIFY_NO.substring(1,2));
					$("#marketing_Ag").val($("#selectbox5").val());
					$("#selectbox6").val(response.recv1[0].CERTIFY_NO.substring(2,3));
					$("#conserve_Ag").val($("#selectbox6").val());
					$("#selectbox7").val(response.recv1[0].CERTIFY_NO.substring(3,4));
					$("#thirdPerson_Ag").val($("#selectbox7").val());
					*/
					switch(currentSelectedNum){
		            case '5':
		            	$("#selectbox4").val(response.recv1[0].CERTIFY_NO.substring(0,1));
						$("#essential_Ag").val($("#selectbox4").val());
						$("#selectbox5").val(response.recv1[0].CERTIFY_NO.substring(1,2));
						$("#marketing_Ag").val($("#selectbox5").val());
						$("#selectbox6").val(response.recv1[0].CERTIFY_NO.substring(2,3));
						$("#conserve_Ag").val($("#selectbox6").val());
						$("#selectbox7").val(response.recv1[0].CERTIFY_NO.substring(3,4));
						$("#thirdPerson_Ag").val($("#selectbox7").val());
		            	break;
		            case '6':
		            	$("#selectbox5").val(response.recv1[0].CERTIFY_NO.substring(0,1));
						$("#marketing_Ag").val($("#selectbox5").val());
						$("#selectbox6").val(response.recv1[0].CERTIFY_NO.substring(1,2));
						$("#conserve_Ag").val($("#selectbox6").val());
						$("#selectbox7").val(response.recv1[0].CERTIFY_NO.substring(2,3));
						$("#thirdPerson_Ag").val($("#selectbox7").val());
		            	break;
		            case '7':
		            	$("#selectbox6").val(response.recv1[0].CERTIFY_NO.substring(0,1));
						$("#conserve_Ag").val($("#selectbox6").val());
						$("#selectbox7").val(response.recv1[0].CERTIFY_NO.substring(1,2));
						$("#thirdPerson_Ag").val($("#selectbox7").val());
		            	break;
		            case '8':
		            	$("#selectbox4").val(response.recv1[0].CERTIFY_NO.substring(0,1));
						$("#essential_Ag").val($("#selectbox4").val());
		            	break;
		            case '9':
		            	$("#selectbox5").val(response.recv1[0].CERTIFY_NO.substring(0,1));
						$("#marketing_Ag").val($("#selectbox5").val());
		            	break;
		            case '10':
		            	$("#selectbox6").val(response.recv1[0].CERTIFY_NO.substring(0,1));
						$("#conserve_Ag").val($("#selectbox6").val());
		            	break;
		            case '11':
		            	$("#selectbox7").val(response.recv1[0].CERTIFY_NO.substring(0,1));
						$("#thirdPerson_Ag").val($("#selectbox7").val());
		            	break;
		            }
					
				}
			}
		}
	});
}

init();
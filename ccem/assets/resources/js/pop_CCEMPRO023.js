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

/**
 * 초기로드
 */
function init(){
    setCodeData();
    sJobType = openInfo.save();
    // sJobType = 'U';
    var dept_ID = opener.$('#textbox5').val();
    var lc_ID = opener.$('#hiddenbox1').val();
    var cust_ID = opener.$('#hiddenbox6').val();
    // console.log(cust_ID);

    // 저장구분에 따라 값 가져오기
    if(sJobType == 'U') {
        api.getOrgInfo( {   "CUST_ID" : cust_ID, 
                            "CSEL_DATE": opener.calendarUtil.getImaskValue("textbox27"),
                            "CSEL_NO" : opener.$('#textbox28').val(),
                            "CSEL_SEQ" : opener.$('#selectbox14').val() }, 
                         '/cns.getInfoAgree.do', 
                         ["dsRecv1", "dsRecv2"] ).then( function(data){

            console.log(data);
            var tempArray = {};

            // tempArray.CSEL_DATE = data.CUST_ID; // 상담일자
            // tempArray.CSEL_NO = "";	// 상담번호
            // tempArray.CSEL_SEQ = ""; //	상담순번
            // tempArray.MBR_ID = data.MBR_ID; //	고객번호
            // tempArray.CUST_ID = cust_ID; //	고객번호
            // tempArray.RST_MK = ""; //	동의결과
            // tempArray.ENT_YN = data.ENT_YN; //	회원입회약관
            // tempArray.INFO_YN = data.INFO_YN; //	개인정보수집이용동의
            // tempArray.SMS_YN = data.SMS_YN; //	마케팅동의
            // tempArray.SMS_SAVE_YN = data.SMS_SAVE_YN; //	보존및마케팅
            // tempArray.THIRD_YN = data.THIRD_YN; //	제3자제공동의
            // tempArray.CSEL_CNTS = $('#textbox8').val(); //	메모
            // tempArray.FAT_NAME = $('#textbox7').val(); //	대리인명
            // tempArray.FAT_REL = $('#selectbox1').val(); //	대리인관계
            // tempArray.CTI_CHGDATE = ""; //	변경일
        });
    }

    // 사업국 정보 입력
    api.getOrgInfo( { "DEPT_ID" : dept_ID }, '/cns.getDeptInfo.do', ["dsRecv"] ).then( function(data){
        console.log(data);
        deptInfo = data.dsRecv[0];
        $('#textbox1').val(deptInfo.DEPT_NAME); // 사업국 삽입
        $('#textbox2').val(deptInfo.DEPT_EMP_NAME ? deptInfo.DEPT_EMP_NAME : ""); // 사업국 국장 삽입
        $('#textbox3').val(deptInfo.DEPT_REP_EMP_HP ? deptInfo.DEPT_REP_EMP_HP : ""); // 사업국장 핸드폰 삽입
    })
    
    // 센터 정보 입력
    if (! isEmpty(lc_ID) ){
        api.getOrgInfo( { "LC_ID" : lc_ID }, '/cns.getLCInfo.do', ["dsRecv"] ).then( function(data){
            console.log(data);
            lcInfo = data.dsRecv[0];
            $('#textbox4').val(lcInfo.LC_NAME); // 센터 삽입
            $('#textbox5').val(lcInfo.LC_EMP_NAME ? lcInfo.LC_EMP_NAME : ""); // 센터장 삽입
            $('#textbox6').val(lcInfo.LC_REP_EMP_HP ? lcInfo.LC_REP_EMP_HP : ""); // 센터장 핸드폰 삽입
        })
    }
    
    // 대리인 정보 입력
    api.getOrgInfo( { "CUST_ID" : cust_ID }, '/cns.getCustFatInfo.do', ["dsRecv"] ).then( function(data){
        console.log(data);
        attorneyInfo = data.dsRecv[0];
        $('#textbox7').val(attorneyInfo.FAT_NAME ? attorneyInfo.FAT_NAME : "" ); // 대리인명 삽입
        $("#selectbox1").val(attorneyInfo.FAT_REL ? attorneyInfo.FAT_REL : "" ); // 대리인 관계 설정
    })
};

const openInfo = {
    
    /**
     * 상담 저장구분 조회(I:신규, U:수정)
     */
    save() {
        const selectbox = opener.document.getElementById("selectbox14");
        const selectedSeq = selectbox.value;
        const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;	
        console.log(sJobType);
        return sJobType;
    },
    getWiseNtalk() {
        topbarObject.get('instances').then(function(instancesData) {
            var instances = instancesData.instances;
            for ( var instanceGuid in instances) {
                if (instances[instanceGuid].location === 'WiseN Talk') {
                    callClient =  client.instance(instanceGuid);
                    callClient.trigger("getSidebarClient", client._instanceGuid);
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
     * @param {string} apiURL 사업국/센터조회 API전송 
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
    sendOpener(prop) {
        // CCEMPRO022에 보낼 값 정보
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
        // console.log(tempArray);
        opener.DS_DROP_TEMP2 = tempArray;
        // console.log(opener.DS_DROP_TEMP2);
        window.close();
    },
    
    /*****************************************
	*	닫기 버튼 클릭시
	*****************************************/	
    onClose(){
    	var sConfMsg = "동의결과를 저장하지 않고 닫으시겠습니까?";
        if (confirm(sConfMsg)== false) return;    	
        
		if( sJobType=="U" ){
			btn.sendOpener("C");
		}else{
			// window.returnValue = "N"; // 'Y' 인경우 유효함, 'N'인경우는 안유효함.
		    window.close();
		}
    },

    //============================================================================
    // IVR을 통해 주민번호를 가져오는 함수
    //============================================================================    
    onIVRCertify(cs){
        topbarObject.testtop(window);
        // if(gf_isWorking()) return;        
        // if( confirm("IVR을 통해 증빈번호를 가져오시겠습니까?") ){               	
        //     gf_setBlock(true);
        //     objCNS5810.objSys1100.gf_onIVRCertify(cs+"",this);
        //     // IVR 상태값
        //     sIVR = cs+"";
        // }        

        // ces-top에 넣은 내용
        // function testtop(window){
        // 	console.log("ccem-top");
        // 	window.testtop();
        // }
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

function testtop(){
    console.log("ccem-pro-023");
}

init();
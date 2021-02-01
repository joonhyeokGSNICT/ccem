/**
 * 전역변수
 */

var sJobType // 저장구분
var deptInfo // 사업국정보
var lcInfo // 센터정보
var attorneyInfo // 대리인정보

/**
 * 초기로드
 */
function init(){
    sJobType = openInfo.save();
    var dept_ID = opener.$('#textbox5').val();
    var lc_ID = opener.$('#hiddenbox1').val();
    var cust_ID = opener.opener.$('#custInfo_CUST_ID').val();
    console.log(cust_ID);
    // 사업국 정보 입력
    api.getOrgInfo( { "DEPT_ID" : dept_ID }, '/cns.getDeptInfo.do' ).then( function(data){
        // console.log(data);
        deptInfo = data[0];
        $('#textbox1').val(data[0].DEPT_NAME); // 사업국 삽입
        $('#textbox2').val(data[0].DEPT_EMP_NAME ? data[0].DEPT_EMP_NAME : ""); // 사업국 국장 삽입
        $('#textbox3').val(data[0].DEPT_REP_EMP_HP ? data[0].DEPT_REP_EMP_HP : ""); // 사업국장 핸드폰 삽입
    })
    
    // 센터 정보 입력
    api.getOrgInfo( { "LC_ID" : lc_ID }, '/cns.getLCInfo.do' ).then( function(data){
        // console.log(data);
        lcInfo = data[0];
        $('#textbox4').val(data[0].LC_NAME); // 센터 삽입
        $('#textbox5').val(data[0].LC_EMP_NAME ? data[0].LC_EMP_NAME : ""); // 센터장 삽입
        $('#textbox6').val(data[0].LC_REP_EMP_HP ? data[0].LC_REP_EMP_HP : ""); // 센터장 핸드폰 삽입
    })
    
    // 대리인 정보 입력
    api.getOrgInfo( { "CUST_ID" : cust_ID }, '/cns.getCustFatInfo.do' ).then( function(data){
        console.log(data);
        attorneyInfo = data[0];
        // $('#textbox4').val(data[0].LC_NAME); // 센터 삽입
        // $('#textbox5').val(data[0].LC_EMP_NAME ? data[0].LC_EMP_NAME : ""); // 센터장 삽입
        // $('#textbox6').val(data[0].LC_REP_EMP_HP ? data[0].LC_REP_EMP_HP : ""); // 센터장 핸드폰 삽입
    })
};

const openInfo = {
    
    /**
     * 상담 저장구분 조회(I:신규, U:수정)
     * @param {string} orgId 사업국/센터ID
     * @param {string} apiURL 사업국/센터조회 API전송 
     */
    save() {
        const selectbox = opener.document.getElementById("selectbox14");
        const selectedSeq = selectbox.value;
        const sJobType = selectbox.options[selectbox.selectedIndex].dataset.jobType;	
        console.log(sJobType);
        return sJobType;
    }
}

const api = {
    /**
     * 사업국, 센터 정보 조회
     * @param {string} orgId 사업국/센터ID
     * @param {string} apiURL 사업국/센터조회 API전송 
     */
    getOrgInfo(orgId, apiURL) {
        return new Promise(function(resolve, reject){
            const settings = {
                global: false,
                url: `${API_SERVER}`+apiURL,
                method: 'POST',
                contentType: "application/json; charset=UTF-8",
                dataType: "json",
                data: JSON.stringify({
                    senddataids: ["dsSend"],
                    recvdataids: ["dsRecv"],
                    dsSend: [orgId],
                }),
                success: function (response) {
                    // console.log("getOrgInfo >> ",response.dsRecv);
                    resolve(response.dsRecv);
                }, error: function (response) {
                }
            }
            $.ajax(settings); 
		});
    }   
}

var btn = {
    sendOpener() {
        // CCEMPRO022에 보낼 값 정보
        var tempArray = {};
        tempArray.CSEL_DATE = ""; // 상담일자
        tempArray.CSEL_NO = "";	// 상담번호
        tempArray.CSEL_SEQ = ""; //	상담순번
        tempArray.CUST_ID = ""; //	고객번호
        tempArray.RST_MK = ""; //	동의결과
        tempArray.ENT_YN = ""; //	회원입회약관
        tempArray.INFO_YN = ""; //	개인정보수집이용동의
        tempArray.SMS_YN = ""; //	마케팅동의
        tempArray.SMS_SAVE_YN = ""; //	보존및마케팅
        tempArray.THIRD_YN = ""; //	제3자제공동의
        tempArray.CSEL_CNTS = ""; //	메모
        tempArray.FAT_NAME = ""; //	대리인명
        tempArray.FAT_REL = ""; //	대리인관계
        tempArray.CTI_CHGDATE = ""; //	변경일
    }
}


init();
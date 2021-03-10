var currentUser = opener.currentUserInfo;

function init() {
    // display
    $('.IVRcount>.numbers').text('0');
    $('.Resignation>.numbers').text('0');
    $('.TelephoneSurvey>.numbers').text('0');
    $('.RequestConsult>.numbers').text('0');
    $('.InfoAgreement>.numbers').text('0');

    // 미니전광판 값 가져오기    
    ccemApi.getStatusBoard();
    ccemApi.getCselStypeTop5();
}

var _insert = {
    status(response) {
        var initList = response;

        // console.log(response.recv1);
        // 상단통화건수 설정
        $('#IB_CNT').text(response.recv1[0].IB_CNT+'건');
        $('#OB_CNT').text(response.recv1[0].OB_CNT+'건');

        var str = response.recv1[0].OB_TIME.replace(/(.{2})/g,"$1:")
        str = '('+str.slice(0,-1)+')';
        $('#OB_TIME').text(str);
        
        var str = response.recv1[0].IB_TIME.replace(/(.{2})/g,"$1:")
        str = '('+str.slice(0,-1)+')';
        $('#IB_TIME').text(str);

        // OB현황건수 설정
        if ( response.recv2.length != 0 ){
            $('.IVRcount>.numbers').text(response.recv2[0].UNCMPLT_CNT_60);        //IVR콜백건수
            $('.Resignation>.numbers').text(response.recv2[0].UNCMPLT_CNT_30);     //고객직접퇴회
            $('.TelephoneSurvey>.numbers').text(response.recv2[0].UNCMPLT_CNT_20); //전화설문
            $('.RequestConsult>.numbers').text(response.recv2[0].UNCMPLT_CNT_40);  //전화상담신청
            $('.InfoAgreement>.numbers').text(response.recv2[0].UNCMPLT_CNT_10);   //정보이용동의
        } else {
            $('.IVRcount>.numbers').text('0');
            $('.Resignation>.numbers').text('0');
            $('.TelephoneSurvey>.numbers').text('0');
            $('.RequestConsult>.numbers').text('0');
            $('.InfoAgreement>.numbers').text('0');
        }

        // 현황판 업데이트

        // var tempArray3 = []
        // tempArray3.push( {MESSAGE : "금융결제원 카드 결제 이슈 해결", RECV_DATE: '1550'} )
        // tempArray3.push( {MESSAGE : "상담프로그램 업데이트(3/2예정)", RECV_DATE: '1450'} )
        // tempArray3.push( {MESSAGE : "금융결제원 카드 결제 이슈 처리 중", RECV_DATE: '1015'} )
        // tempArray3.push( {MESSAGE : "금융결제원 카드 결제 이슈 발생", RECV_DATE: '1000'} )
        // tempArray3.push( {MESSAGE : "상담 시, 오류가 발생할 경우 관리자에게 문의하세요! 관리자 전화번호는 010-XXXX-XXXX입니다.", RECV_DATE: '0900'} )
        // if ( tempArray3.length != 0 ){     
        //     for( index in tempArray3 ) {
        //         var str = tempArray3[index].RECV_DATE.replace(/(.{2})/g,"$1:")
        //             str = '('+str.slice(0,-1)+')';
        //         $('#txtAppend').append("<tr><td>"+tempArray3[index].MESSAGE+"</td><td class='cntRows' style='padding-right:6px;'>"+str+"</td>")
        //     }


        // console.log(response.recv3);
        if ( response.recv3.length != 0 ){ 
            for( index in response.recv3 ) {
                var str = response.recv3[index].RECV_DATE.replace(/(.{2})/g,"$1:")
                    str = '('+str.slice(0,-1)+')';
                $('#txtAppend').append("<tr><td>"+response.recv3[index].MESSAGE+"</td><td class='cntRows' style='padding-right:6px;'>"+str+"</td>")
            }
        }
    },
    top5(response) {
        var initList = response;
        
        if ( initList.recv1.length != 0 ) initList.recv1 = initList.recv1.sort( function(a, b){ return a["RANK"] - b["RANK"]; });
        if ( initList.recv2.length != 0 ) initList.recv2 = initList.recv2.sort( function(a, b){ return a["RANK"] - b["RANK"]; });
        if ( initList.recv3.length != 0 ) initList.recv3 = initList.recv3.sort( function(a, b){ return a["RANK"] - b["RANK"]; });
        
        
        for ( index in initList.recv1 ){
            $('#complain_'+index).text(initList.recv1[index].RANK);
            $('#complain_'+index).next().text(initList.recv1[index].TITLE);
            $('#complain_'+index).next().next().text(initList.recv1[index].CNT+'건');
        }
        for ( index in initList.recv2 ){
            $('#request_'+index).text(initList.recv2[index].RANK);
            $('#request_'+index).next().text(initList.recv2[index].TITLE);
            $('#request_'+index).next().next().text(initList.recv2[index].CNT+'건');
        }
        for ( index in initList.recv3 ){
            $('#question_'+index).text(initList.recv3[index].RANK);
            $('#question_'+index).next().text(initList.recv3[index].TITLE);
            $('#question_'+index).next().next().text(initList.recv3[index].CNT+'건');
        }
    }
}

/**
 * 탑바를 다시 띄울 경우 값들 다시 가져오기
 */
playAlert = setInterval(function() {
    ccemApi.getStatusBoard();
    ccemApi.getCselStypeTop5();
    console.log(new Date());
 }, 30000);

/**
 * 빈값 확인
 * @param {빈값확인하는 데이터} data 
 */
function isEmpty(data) {
	if (!data || data == "" || data == undefined || Object.keys(data).length === 0 ) return true;
	else return false;
}

var ccemApi = {
    getStatusBoard() {
      var param = {
              userid: currentUser.external_id,
              menuname: '미니전광판',
              senddataids: ["send"],
              recvdataids: ["recv1","recv2","recv3"],
        send: [{USER_ID:currentUser.external_id}]
      };
      // console.log("param >>",param);
      
      $.ajax({
              url: API_SERVER + '/sta.getStatusBoard.do',
              type: 'POST',
              dataType: 'json',
              contentType: "application/json",
              data: JSON.stringify(param),
              success: function (response) {
          // console.log("getStatusBoard >> ",response);
          _insert.status(response);
              }, error: function (response) {
              }
          });
    },
    getCselStypeTop5() {
      var param = {
              userid: currentUser.external_id,
              menuname: '미니전광판',
              senddataids: ["send"],
              recvdataids: ["recv1","recv2","recv3"],
              send: [{}]
      };
      // console.log("param >>",param);
      
      $.ajax({
              url: API_SERVER + '/sta.getCselStypeTop5.do',
              type: 'POST',
              dataType: 'json',
              contentType: "application/json",
              data: JSON.stringify(param),
              success: function (response) {
          // console.log("getCselStypeTop5 >> ",response);
  
          // 임시 데이터 테스트용
          // response.recv1 = complainList;
          // response.recv2 = requestList;
          // response.recv3 = questionList;
  
          _insert.top5(response);
              }, error: function (response) {
              }
          });
    }
  }

/******************************************************
 * _styleChanger : 화면 내 스타일 변경사항처리 JS
 ******************************************************/
var _styleChanger = {
    /* 화면 크기 수정 */
    resize(){
        var widthSize = 550;
        var heightSize = $('body').outerHeight()+75;
        window.resizeTo(widthSize,heightSize);
    }
}

/******************************************************
 * document ready function모음
 ******************************************************/
$( document ).ready(function() {
    /* 윈도우 크기에 따라 그리드 크기 조정 */ 
	$(window).resize(function() {
		_styleChanger.resize();
	});
});


  init();
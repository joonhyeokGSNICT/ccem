
/******************************************************
 * 녹취 grid 설정
 ******************************************************/ 
recordGrid = new Grid({
    el: document.getElementById('recordGrid'),
    bodyHeight: 200,
    rowHeaders: [{ type: 'rowNum' }],
    columns: [
        {
            header: '녹취ID',
            name: 'RECORD_ID',
            width: 220,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
        {
            header: '저장일자',
            name: 'RECORD_STDATE',
            width: 120,
            align: "left",
            sortable: true,
            ellipsis: true
        },
        {
            header: '저장일시',
            name: 'RECORD_STTIME',
            width: 100,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
        {
            header: '사용자',
            name: 'USER_NAME',
            width: 120,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
		{
            header: '전화번호',
            name: 'TELPNO',
            width: 150,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
		{
            header: '녹취청취',
            name: 'RECORD_ID',
            width: 100,
            align: "center",
            sortable: true,
            ellipsis: true,
            formatter: function(data){
                // console.log(data);
				text += `<button style="padding: 0px;" class="btn btn-sm navBtn" type="button"><span>청취</span></button>`
            }
        },
    ],
});
recordGrid.on('click', (ev) => {

});



/******************************************************
 * 전역변수
 ******************************************************/
var data 	// 부모창에서 받은 값 

/******************************************************
 * 초기 화면 로드 
 ******************************************************/ 
async function init(){
	data = POP_DATA;
	var param = {
		senddataids : ["dsSend"],
		recvdataids : ["dsRecv"],
		dsSend : [{
			CSEL_DATE : data.CSEL_DATE,
			CSEL_NO : data.CSEL_NO+""
		}]
	}
	url = '/cns.getRecord.do';
	
	// 중복 녹취 값 가져오기
	var tempArr = await ajax( param, url );
	console.log(tempArr);
	
}


/******************************************************
 * _styleChanger : 화면 내 스타일 변경사항처리 JS
 ******************************************************/
var _styleChanger = {
	/* 그리드 가로 수정 */
	resizeWidth(){
		var widthSize = window.innerWidth - 24;
		if (window.innerWidth <= 200) {
			widthSize = 176;
        }
        recordGrid.setWidth(widthSize);
	},
	/* 그리드 세로 수정 */
	resizeHeight(){
		var heightSize = window.innerHeight - 60;
		if (window.innerHeight <= 200) {
			heightSize = 140;
        }
		recordGrid.setHeight(heightSize);
	}
}

/******************************************************
 * document ready function모음
 ******************************************************/
$( document ).ready(function() {
	/* 윈도우 크기에 따라 그리드 크기 조정 */ 
	$(window).resize(function() {
		_styleChanger.resizeWidth();
		_styleChanger.resizeHeight();
    });
    _styleChanger.resizeWidth();
    _styleChanger.resizeHeight();
});


/************************************************************************************************************
 * API호출
 * @param param 		api로 호출할 때 필요한 값 설정
 * @param serviceUrl 	api호출할 url 설정
 * 
 * @return response 	API결과 값  
 ************************************************************************************************************/
function ajax(param,serviceUrl) {
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: API_SERVER + serviceUrl,
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: JSON.stringify(param),
		    success: function (response) {
				resolve(response);
			}, error: function (response) {
				console.error('getToken error response ::: ', response);
			}
		});	
	});
	
}

init();
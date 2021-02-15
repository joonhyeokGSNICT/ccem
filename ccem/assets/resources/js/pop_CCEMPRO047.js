
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
            width: 200,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
        {
            header: '저장일자',
            name: 'RECORD_STDATE',
            width: 120,
            align: "center",
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
            width: 100,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
		{
            header: '전화번호',
            name: 'TELPNO',
            width: 150,
            align: "left",
            sortable: true,
            ellipsis: true,
        },
		{
            header: '녹취청취',
            name: 'RECORD_ID_text',
            width: 100,
            align: "center",
            sortable: true,
            ellipsis: true,
            formatter: function(data){
                // console.log(data);
				var text = `<button style="padding: 0px;" class="btn btn-sm navBtn" type="button"><span>청취</span></button>`;
                return text;
            }
        },
        {
            header: '사용자ID_HIDE',
            name: 'USER_ID',
            width: 120,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
    ],
});
/* 그리드 컬럼 숨김처리 */
recordGrid.hideColumn("USER_ID"); // user_id 설정

/******************************************************
 * 그리드 단일 클릭 시 기능
 ******************************************************/ 
recordGrid.on('click', (ev) => {
    recordGrid.uncheckAll();
    recordGrid.addSelection(ev);
    recordGrid.clickSort(ev);
    recordGrid.clickCheck(ev);
    if ( ev.columnName == "RECORD_ID_text" ) {
        const tempArr = {
            RECORD_ID : recordGrid.getRow(ev.rowKey).RECORD_ID
        }
        recordPlay(tempArr.RECORD_ID);
    } 
});

/******************************************************
 * 그리드 더블 클릭 시 기능
 ******************************************************/ 
recordGrid.on("dblclick", (ev) => {
    if (recordGrid.getCheckedRows().length > 0){
        const tempArr = {
            RECORD_ID : recordGrid.getCheckedRows()[0].RECORD_ID
        }
        recordPlay(tempArr.RECORD_ID);
    }
});

/******************************************************
 * 녹취청취 버튼 클릭
 ******************************************************/ 
function listenBtn() {
    if (recordGrid.getCheckedRows().length > 0){
        const tempArr = {
            RECORD_ID : recordGrid.getCheckedRows()[0].RECORD_ID
        }
        recordPlay(tempArr.RECORD_ID);
    }
}

/******************************************************
 * 전역변수
 ******************************************************/
var data 	// 부모창에서 받은 값 

/******************************************************
 * 초기 화면 로드 
 ******************************************************/ 
function init(){
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
	ajax( param, url ).then( function(data){
        var tempArr = data.dsRecv;
        console.log(tempArr);
        if ( tempArr.length > 0 ) {
            temp = tempArr.map(el => {
                return {
                    RECORD_ID : el.RECORD_ID,
                    RECORD_STDATE : el.RECORD_STDATE,
                    RECORD_STTIME : el.RECORD_STTIME,
                    TELPNO : el.TELPNO,
                    USER_ID : el.USER_ID,
                    USER_NAME : el.USER_NAME,
                    RECORD_ID_text : el.RECORD_ID,
                };
            });
            recordGrid.resetData([]);
            recordGrid.resetData(temp);
        } else {

        }
    });
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
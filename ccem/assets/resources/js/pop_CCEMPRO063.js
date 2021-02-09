/******************************************************
 * 전역변수
 ******************************************************/ 
var client = opener.topBarClient;
var articleList;                // 게시글 리스트
var boardWindow;

// const ZD_TYPE = 'SANDBOX';   // 샌드박스 반영 시 
const ZD_TYPE = 'OPS';          // 운영 반영시 'OPS'

const ZD = {
    SANDBOX : {
        article_section : { notice : 900001503523 } // pdi의 KC_APP 섹션
    },
    OPS : {
        article_section : { notice : 360012577353 } // pdi의 KC_APP 섹션
    }
}

/******************************************************
 * 게시판 grid 설정
 ******************************************************/ 
boardGrid = new Grid({
    el: document.getElementById('boardGrid'),
    bodyHeight: 350,
    rowHeaders: [{ type: 'rowNum' }],
    columnOptions: { minWidth: 50, resizable: true, frozenCount: 0, frozenBorderWidth: 1, },
    pageOptions: {
        useClient: true,
        perPage: 15 // 페이지 당 보여줄 게시글 숫자
    },
    columns: [
        {
            header: '작성자',
            name: 'author_name',
            width: 120,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
        {
            header: '제목',
            name: 'title',
            width: 448,
            align: "left",
            sortable: true,
            ellipsis: true,
            formatter: function(data){
                console.log(data);
                var text = ``;
                    text += `<a href="#">`+data.value+`</a>`
                return text;
            }
        },
        {
            header: '첨부자료',
            name: 'files_url',
            width: 100,
            align: "center",
            sortable: true,
            ellipsis: true,
            formatter: function(data){
                // console.log(data);
                var text = ``;
                if ( data.value.length > 0 ) {
                    var tempList = data.value;
                    for( var i=0; i<tempList.length; i++ ) {
                        text += `<a href="#" onclick="fileDownload(this)" content_type="`+tempList[i].content_type+`" file_name="`+tempList[i].file_name+`" content_url="`+tempList[i].content_url+`" url="`+tempList[i].url+`">
                                 <img src="../img/download.png" style="width:18px; height:16px"></a>`
                    }
                    // console.log(text);
                    return text;
                } else {
                    return text;
                } 
            }
        },
        {
            header: '작성일',
            name: 'updated_at',
            width: 150,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
        {
            header: 'body_hide',
            name: 'body',
            width: 150,
            align: "center",
            sortable: true,
            ellipsis: true,
        }
    ],
});
/* 그리드 컬럼 숨김처리 */
boardGrid.hideColumn("body"); // 게시글 내용 및 태그

/******************************************************
 * 그리드 단일 클릭 시 기능
 ******************************************************/ 
boardGrid.on('click', (ev) => {
    /* 타이틀을 클릭 할 경우 게시글 팝업 호출 */
    if (ev.columnName == 'title') {
        var sendData = boardGrid.getRow(ev.rowKey);
        PopupUtilboard.open("CCEMPRO063_1", 900, 600, "", sendData);
    }
});
/******************************************************
 * 그리드 더블 클릭 시 기능
 ******************************************************/ 
boardGrid.on('dblclick', (ev) => {
    /* 위치에 상관없이 게시글 팝업 호출 */
    var sendData = boardGrid.getRow(ev.rowKey);
    PopupUtilboard.open("CCEMPRO063_1", 900, 600, "", sendData);
});


/******************************************************
 * 초기 진입시 실행
 ******************************************************/ 
function init() {
    articles.get();
}

/******************************************************
 * 게시글 리스트 가져오기
 * => 게시글 첨부파일 가져오기(상세포함) 
 * => 게시글 작성자 이름 가져오기(상세포함)
 ******************************************************/ 
var getArticles = function () {
	return new Promise(function (resolve, reject) {	
		client.request(`/api/v2/help_center/sections/${ZD[ZD_TYPE]['article_section']['notice']}/articles`).then(function(result) {
            console.log(result.articles);
            getFileFunction(result.articles).then(function(){
                getNameFunction().then(function(){
                    resolve("");
                });
            });
		});
	});
}


/* 게시글 첨부파일 가져오기 */
var getFileFunction = function (data) {
    return new Promise(function (resolve, reject) {	
        articleList = data;
        tempArr = [];
        for ( index in articleList ) {
            tempArr.push( getFile(articleList[index].id) );
        }
        Promise.all(tempArr).then((values) => {
            console.log(values);
            for ( index in values ) {
                articleList[index].files_url = values[index];
            }
            resolve("");
        });
    });
}

/* 게시글 작성자 이름 가져오기 */
var getNameFunction = function () {
    return new Promise(function (resolve, reject) {
        tempArr = [];
        for ( index in articleList ) {
            tempArr.push( getUserName(articleList[index].author_id) );
        }
        Promise.all(tempArr).then((values) => {
            console.log(values);
            for ( index in values ) {
                articleList[index].author_name = values[index];
            }
            resolve("");
        });
    });
}

/* 첨부파일 가져오기 상세내역 promise */
var getUserName = function (userId) {
    return new Promise(function (resolve, reject) {	
        client.request(`/api/v2/users/`+userId+`.json`).then(function(temp) {
            // console.log(temp);
            resolve(temp.user.name);
        });
    });
}

/* 첨부파일 가져오기 상세내역 promise */
var getFile = function (id) {
    return new Promise(function (resolve, reject) {	
        client.request(`/api/v2/help_center/articles/`+id+`/attachments`).then(function(result) {
            // console.log(result);
            resolve(result.article_attachments);
        });
    });
}


/******************************************************
 * 게시글 리스트 그리드 넣기
 * => 게시글 첨부파일 가져오기(상세포함) 
 * => 게시글 작성자 이름 가져오기(상세포함)
 ******************************************************/ 
var articles = {
    list : null,
    get : function(){
        console.log('articles.get() >>> ');
        getArticles().then(function(){
            console.log(articleList);
            articles.list = articleList;
            if ( articles.list.length > 0 ) {
                temp = articles.list.map(el => {
                    return {
                        author_name : el.author_name,
                        title : el.title,
                        files_url : el.files_url,
                        body : el.body,
                        updated_at : formatDateTime(el.updated_at)
                    };
                });
                boardGrid.resetData(temp);
            } else {

            }
        });
    }
}


/******************************************************
 * 파일 다운로드
 * @param me : 현재 클릭한 아이콘의 위치
 ******************************************************/ 
var fileDownload = function (me) {
    var fileInfo = {};
    fileInfo.content_type = me.getAttribute('content_type');    // 파일의 타입
    fileInfo.file_name = me.getAttribute('file_name');          // 파일의 이름
    fileInfo.content_url = me.getAttribute('content_url');      // 파일의 url
    fileInfo.url = me.getAttribute('url');                      // 파일의 json url
    console.log(fileInfo);

    var file_name = getExtensionOfFilename(fileInfo.file_name);
    
    /* 크롬의 경우 이미지인 경우 새로운 윈도우 팝업, 파일은 다운로드 */
    if ( file_name == '.jpg' || file_name == '.gif' || file_name == '.png' || file_name == '.jpeg'|| file_name == '.bmp' ) window.open(fileInfo.content_url);
    else window.location.assign(fileInfo.content_url);
}



/******************************************************
 * 날짜 형식 변경
 * @param date : 변경할 날짜 양식
 ******************************************************/ 
var formatDateTime = function(date){
    return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss');
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
    
    $('.tui-pagination.tui-grid-pagination').attr('style','margin-top:10px; margin-bottom:0px;');	// 그리드 페이징 높이 조절
    $('.tui-grid-layer-state').attr('style','border-left: 1px solid #dddddd;display: block;top: 24px;height: 416px;left: 0px;right: 18px;');
    
    _styleChanger.resizeWidth();
    _styleChanger.resizeHeight();
});

/******************************************************
 * _styleChanger : 화면 내 스타일 변경사항처리 JS
 ******************************************************/
var _styleChanger = {
	/* 그리드 가로 수정 */
	resizeWidth(){
		var widthSize = window.innerWidth - 24;
		if (window.innerWidth <= 600) {
			widthSize = 576;
        }
        boardGrid.setWidth(widthSize);
	},
	/* 그리드 세로 수정 */
	resizeHeight(){
		var heightSize = window.innerHeight - 110;
		if (window.innerHeight <= 350) {
			heightSize = 240;
        }
		boardGrid.setHeight(heightSize);
	}
}

/******************************************************
 * 빈값 확인
 * @param {빈값확인하는 데이터} data 
 ******************************************************/
function isEmpty(data) {
	if (!data || data == "" || data == undefined || Object.keys(data).length === 0 ) return true;
	else return false;
}


/******************************************************
 * 파일명에서 확장자명 추출
 * @param filename   파일명
 * @returns _fileExt 확장자명
 ******************************************************/
function getExtensionOfFilename(filename) {
    var _fileLen = filename.length;
    var _lastDot = filename.lastIndexOf('.');
    var _fileExt = filename.substring(_lastDot, _fileLen).toLowerCase(); 
    return _fileExt;
}

/******************************************************
 * 게시판에만 적용되는 팝업 유틸
 ******************************************************/
var PopupUtilboard = {
    /**
     * 오픈된 팝업
     */
    pops: {},
    /**
     * 팝업오픈여부
     * @param {string} name 
     */
    contains(name) {
        if(this.pops[name] && this.pops[name].name) return true;
        else return false;
    },
    /**
     * 팝업 오픈
     * @param {string} name 
     * @param {number} width 
     * @param {number} height 
     * @param {string} hash 
     * @param {object} param 
     */
    open(name, width, height, hash, param) {
        if(this.contains(name)) {
            boardWindow.focus();
            boardWindow.POP_DATA = param
            boardWindow.windowReload();
        }else {
            this.pops[name] = window.open(`pop_${name}.html${hash||""}`, name, `width=${width}, height=${height}`, false);
        }
        this.pops[name].POP_DATA = param;
    },
}

init();
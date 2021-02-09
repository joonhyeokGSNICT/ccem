var POP_DATA;


function init() {
    if(POP_DATA != undefined){
        console.log(POP_DATA);
        var files = POP_DATA.files_url;
        var text = ``;
        if ( files.length > 0 ) {
            for ( var i=0; i<files.length; i++) {
                text += `<a href="#" onclick="fileDownload(this)" content_type="`+files[i].content_type+`" file_name="`+files[i].file_name+`" content_url="`+files[i].content_url+`" url="`+files[i].url+`">
                        <img src="../img/download.png" style="width:18px; height:16px">&nbsp;`+files[i].display_file_name+`</a>`
                if ( i+1 != files.length ) text += `<br>`
            }
        } else {
            text = '첨부된 파일이 없습니다.';
        }

        $('#text1').text(POP_DATA.title);               // 제목
        $('#text2').text(POP_DATA.author_name);         // 작성자
        $('#text3').text(POP_DATA.updated_at);          // 작성일
        $('#text4').append(POP_DATA.body);              // 게시내용
        $('#text5').append(text);                       // 첨부파일
    }

    _styleChanger.resize();

    opener.boardWindow = window;
    POP_DATA = POP_DATA;
}

function windowReload() {
    var files = POP_DATA.files_url;
    var text = ``;
    if ( files.length > 0 ) {
        for ( var i=0; i<files.length; i++) {
            text += `<a href="#" onclick="fileDownload(this)" content_type="`+files[i].content_type+`" file_name="`+files[i].file_name+`" content_url="`+files[i].content_url+`" url="`+files[i].url+`">
                    <img src="../img/download.png" style="width:18px; height:16px">&nbsp;`+files[i].display_file_name+`</a>`
            if ( i+1 != files.length ) text += `<br>`
        }
    } else {
        text = '첨부된 파일이 없습니다.';
    }

    $('#text4').empty(); 
    $('#text5').empty();

    $('#text1').text(POP_DATA.title);               // 제목
    $('#text2').text(POP_DATA.author_name);         // 작성자
    $('#text3').text(POP_DATA.updated_at);          // 작성일
    $('#text4').append(POP_DATA.body);              // 게시내용
    $('#text5').append(text);                       // 첨부파일
    _styleChanger.resize();
}

var fileDownload = function (me) {
    var fileInfo = {};
    fileInfo.content_type = me.getAttribute('content_type');
    fileInfo.file_name = me.getAttribute('file_name');
    fileInfo.content_url = me.getAttribute('content_url');
    fileInfo.url = me.getAttribute('url');
    console.log(fileInfo);

    var file_name = getExtensionOfFilename(fileInfo.file_name);
    
    /* 크롬의 경우 이미지인 경우 새로운 윈도우 팝업, 파일은 다운로드 */
    if ( file_name == '.jpg' || file_name == '.gif' || file_name == '.png' || file_name == '.jpeg'|| file_name == '.bmp' ) window.open(fileInfo.content_url);
    else window.location.assign(fileInfo.content_url);
}


/**
 * 파일명에서 확장자명 추출
 * @param filename   파일명
 * @returns _fileExt 확장자명
 */
function getExtensionOfFilename(filename) {
    var _fileLen = filename.length;
    var _lastDot = filename.lastIndexOf('.');
    var _fileExt = filename.substring(_lastDot, _fileLen).toLowerCase(); 
    return _fileExt;
}


//반응형
// #02 document ready function모음
$( document ).ready(function() {
    // #01_윈도우 크기에 따라 그리드 크기 조정
	$(window).resize(function() {
		_styleChanger.resize();
	});
});

// #03 _styleChanger : 화면 내 스타일 변경사항처리 JS
var _styleChanger = {
    // #03_01 그리드 가로 수정
    resize(){
        var widthSize = 850;
        var heightSize = $('#tableHeight').outerHeight()+90;
        window.resizeTo(widthSize,heightSize);
    }
}

init();
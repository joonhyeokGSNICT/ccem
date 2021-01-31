var _styleChanger = {
	// 프레임 세로 수정
	resizeHeight(){
		var heightSize = window.innerHeight - 40;
		if (window.innerHeight <= 300) {
			heightSize = 260;
		}
        var selectedItem = $('.iframeContent')
        for (var i = 0; i < selectedItem.length; i++) {
            selectedItem.eq(i).attr('style',"width:100%;height:"+heightSize+"px;");
        }
	}
}

$( document ).ready(function() {
	$(window).resize(function() {
		_styleChanger.resizeHeight();
	});
});

_styleChanger.resizeHeight();

function linkto(prop) {
    // src = API_SERVER + 'resources/doc/'+prop+'.htm';
    src = 'http://localhost:8080/ccem/resources/doc/'+prop+'.htm';
    $('#iframeContent').attr('src',src);
}
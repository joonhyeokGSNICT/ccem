$(function () {

	// TODO 녹취키 저장API 호출
	$(window).on('beforeunload', () => {
		opener.console.debug("beforeunload");
	});

	// grid refreshLayout
	$('.nav-link').on('shown.bs.tab', refreshGrid);
	
	// set ifram src
	$('.nav-link').on('click', ev => {
		const navId = ev.target.id;
		if (navId == "entrRgtrNav") {
			if (!$("#CCEMPRO031").attr("src")) $("#CCEMPRO031").attr("src", "./pop_CCEMPRO031.html");
		} else if (navId == "tchrIntrdNav") {
			if (!$("#CCEMPRO032").attr("src")) $("#CCEMPRO032").attr("src", "./pop_CCEMPRO032.html");
		} else {
			if (!$("#CCEMPRO022").attr("src")) $("#CCEMPRO022").attr("src", "./pop_CCEMPRO022.html");
		} 
	});

	// select tab
	let hash = window.location.hash;
	if (hash.includes("#entr_by")) $("#entrRgtrNav").click();
	else if (hash.includes("#tchr_by")) $("#tchrIntrdNav").click();
	else $("#counselRgtrNav").click();

});

/**
 * 그리드 레이아웃을 새로 고칩니다. 숨겨진 상태에서 그리드를 렌더링 한 경우이 방법을 사용합니다.
 */
const refreshGrid = () => {
	if (document.CCEMPRO022?.grid1?.store) document.CCEMPRO022.grid1.refreshLayout();
	if (document.CCEMPRO022?.grid2?.store) document.CCEMPRO022.grid2.refreshLayout();
	if (document.CCEMPRO022?.grid3?.store) document.CCEMPRO022.grid3.refreshLayout();
	if (document.CCEMPRO031?.grid4?.store) document.CCEMPRO031.grid4.refreshLayout();
	if (document.CCEMPRO031?.grid5?.store) document.CCEMPRO031.grid5.refreshLayout();
}


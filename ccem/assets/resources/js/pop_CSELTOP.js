$(function () {

	// grid refreshLayout
	$('.nav-link').on('shown.bs.tab', refreshGrid);
	
	// insert hash
	$('.nav-link').on('click', ev => window.location.hash = ev.target.hash);

	// select tab by hash
	let hash = window.location.hash;
	if (hash === "#counselRgtrTab") $("#counselRgtrNav").click();
	else if (hash === "#entrRgtrTab") $("#entrRgtrNav").click();
	else if (hash === "#tchrIntrdTab") $("#tchrIntrdNav").click();

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
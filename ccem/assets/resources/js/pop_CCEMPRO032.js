$(function () {

	// create calendar
	$(".calendar").each((i, el) =>  calendarUtil.init(el.id));

	// input mask
	$(".imask-date").each((i, el) => calendarUtil.dateMask(el.id));
	$(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

	onStart();

});

/**
 * 오픈되는 곳에 따라 분기처리
 */
const onStart = () => {

}

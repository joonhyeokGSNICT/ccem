
$(function() {

    // input mask
    $(".imask-date").each((i, el) => calendarUtil.init(el.id));
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id, "hh:mm"));

});
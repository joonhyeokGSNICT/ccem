
$(function () {

    // input mask
    $(".imask-date").each((i, el) => calendarUtil.init(el.id));
    $(".imask-date-up").each((i, el) => calendarUtil.init(el.id, { drops: "up", opens: "left"}));
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));

});
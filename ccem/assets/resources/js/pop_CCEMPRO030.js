
$(function(){

    // input mask
    $(".imask-date").each((i, el) => calendarUtil.init(el.id));
    $(".imask-date-up").each((i, el) => calendarUtil.init(el.id, {drops: "up"}));
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
    
});
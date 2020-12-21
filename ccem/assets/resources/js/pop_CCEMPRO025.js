
$(function() {

    // create calendar
    $(".calendar").each((i, el) => calendarUtil.init(el.id));
    
    // input mask
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id, "hh:mm"));

});
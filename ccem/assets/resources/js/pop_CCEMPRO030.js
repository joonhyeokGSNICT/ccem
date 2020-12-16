
$(function(){

    // input mask
    $(".imask-date").each((i, el) => calendarUtil.init(el.id));
    calendarUtil.init("calendar8", {drops: "up", opens: "right"});
    calendarUtil.init("calendar9", {drops: "up", opens: "left"});
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
    
});

$(function(){

    // create calendar
    $(".calendar").each((i, el) => {
        if(el.id === "calendar8") calendarUtil.init(el.id, {drops: "up", opens: "right"});
        else if(el.id === "calendar9") calendarUtil.init(el.id, {drops: "up", opens: "left"});
        else calendarUtil.init(el.id);
    });
    
    // input mask
    $(".imask-time").each((i, el) => calendarUtil.timeMask(el.id));
    
});
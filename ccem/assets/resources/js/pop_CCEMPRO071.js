
client.on("api_notification.ob_result_modal_on", function (data) {
    console.log('[CCEM TOPBAR] api_notification.ob_result_modal_on 진입 >>> ', data.body);
    client.invoke('popover', 'show').then(function () {
        $('#obResultModal').modal('show');
    })
});

var save_call_rst = function(){
    // ccem에 ob결과 저장 후, 모달 hide
    console.log('[CCEM TOPBAR] OB결과 저장 클릭!');
    $('#obResultModal').modal('hide');
}

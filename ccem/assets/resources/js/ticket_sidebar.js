var topBarClient;
var navBarClient;

const init = async function () {

	// get instances
	const { instances } = await client.get('instances');

	// send sidebar client
	for (const instanceGuid in instances) {
		if (instances[instanceGuid].location === 'top_bar') {
			topBarClient = client.instance(instanceGuid);
			topBarClient.trigger("getSidebarClient", client._instanceGuid);
		} else if (instances[instanceGuid].location === 'nav_bar') {
			navBarClient = client.instance(instanceGuid);
			navBarClient.trigger("getSidebarClient", client._instanceGuid);
		}
	}

	ticketFieldDisable();

}

/**
 * 티켓필드 비활성화
 */
const ticketFieldDisable = function () {

	// 비활성화 티켓필드 목록
	const field_ids = [
		ZDK_INFO[_SPACE]["ticketField"]["CSEL_DATE_NO_SEQ"],	// 상담번호
	];

	// 비활성화
	field_ids.forEach(el => client.invoke(`ticketFields:custom_field_${el}.disable`));
	
}

/**
 * 티켓사이드바 활성화 이벤트
 */
client.on('app.activated', function () {
	topBarClient.trigger("getSidebarClient", client._instanceGuid);
});

/**
 * 티켓양식 변경 이벤트
 */
client.on("ticket.form.id.changed", ticketFieldDisable);


init();

var topBarClient;
var navBarClient;

client.on('app.activated', function(){
	topBarClient.trigger("getSidebarClient", client._instanceGuid);
});

client.get('instances').then(function (instancesData) {
	var instances = instancesData.instances;
	for (var instanceGuid in instances) {
		if (instances[instanceGuid].location === 'top_bar') {
			topBarClient = client.instance(instanceGuid);
			topBarClient.trigger("getSidebarClient", client._instanceGuid);
		} else if (instances[instanceGuid].location === 'nav_bar') {
			navBarClient = client.instance(instanceGuid);
			navBarClient.trigger("getSidebarClient", client._instanceGuid);
		}
	}
});

// 티켓필드 disabled
client.invoke(`ticketFields:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["CSEL_DATE_NO_SEQ"]}.disable`);
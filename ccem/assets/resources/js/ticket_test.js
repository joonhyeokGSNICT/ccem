var topBarClient;
var navBarClient;

client.on('app.activated', function(){
	topBarClient.trigger("getSidebarClient", client._instanceGuid);
	topBarClient.invoke('popover','hide');								// 탑바 열기
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
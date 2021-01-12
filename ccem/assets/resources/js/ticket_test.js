var topBarClient;

$(function(){
	
	client.get('instances').then(function(instancesData) {
		var instances = instancesData.instances;
		for ( var instanceGuid in instances) {
			if (instances[instanceGuid].location === 'top_bar') {
				topBarClient =  client.instance(instanceGuid);
				topBarClient.trigger("getSidebarClient", client._instanceGuid);
			}
		}
	});
	
});
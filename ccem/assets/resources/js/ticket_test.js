var topBarClient;
var navBarClient;

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
	
	client.get('instances').then(function(instancesData) {
		var instances = instancesData.instances;
		for ( var instanceGuid in instances) {
			if (instances[instanceGuid].location === 'nav_bar') {
				navBarClient = client.instance(instanceGuid);
				navBarClient.trigger("getSidebarClient", client._instanceGuid);
			}
		}
	});

});
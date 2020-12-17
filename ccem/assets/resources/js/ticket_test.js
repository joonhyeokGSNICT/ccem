var sideBarClient;
var topBarClient;

//topbar is Ready
client.on("topBarisReady", function(sideBarClient_d) {
	sideBarClient = sideBarClient_d;
});

$(function(){
	sidebarClient = client;
	console.log(sideBarClient);
	
	client.get('instances').then(function(instancesData) {
		var instances = instancesData.instances;
		console.log('client instances : ', instances);
		for ( var instanceGuid in instances) {
			if (instances[instanceGuid].location === 'top_bar') {
				//console.log('topbar instanceGuid : ', instanceGuid);
				topBarClient =  client.instance(instanceGuid);
			}
		}
	});
	
});
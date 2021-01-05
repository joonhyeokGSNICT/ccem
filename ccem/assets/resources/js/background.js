var sideBarClient;
var topBarClient;

var codeData;

//topbar is Ready
client.on("topBarisReady", function(sideBarClient_d) {
	sideBarClient = sideBarClient_d;
});

client.on("getCodeList", function(topBarClient_d) {
	//topBarClient = topBarClient_d;
	topBarClient = client.instance(topBarClient_d);
	//console.log(topBarClient);
	topBarClient.trigger('getCodeData', codeData);
});

$(function(){
	/*sidebarClient = client;
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
	});*/
	let settings = {
			url: `${API_SERVER}/sys.getCommCode.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{ CODE_MK: "" }],
			}),
		}
	$.ajax(settings).done(data => {
		codeData = data.dsRecv;
	});
});
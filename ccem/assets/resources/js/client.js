var client = ZAFClient.init();

var topBarClientPromise = client.get('instances').then(function (instancesData) {
    var instances = instancesData.instances;
    for (var instanceGuid in instances) {
        if (instances[instanceGuid].location === 'top_bar') {
            return client.instance(instanceGuid);
        }
    }
});


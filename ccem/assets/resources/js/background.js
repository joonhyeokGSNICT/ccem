var codeData;

$(async function () {
	codeData = await getCommCode();
	tobbarPreloadPane();
	navbarPreloadPane();
});

client.on("getCodeList", function (target_guid) {
	const target = client.instance(target_guid);
	target.trigger('getCodeData', codeData);
});

/**
 * 공통코드 조회
 */
const getCommCode = () => new Promise((resolve, reject) => {
	
	const settings = {
		url: `${API_SERVER}/sys.getCommCode.do`,
		method: 'POST',
		contentType: "application/json; charset=UTF-8",
		dataType: "json",
		data: JSON.stringify({
			senddataids: ["dsSend"],
			recvdataids: ["dsRecv"],
			dsSend: [{}],
		}),
	}

	$.ajax(settings)
		.done(data => {
			if(!checkApi(data, settings)) return reject(data.errmsg);
			return resolve(data.dsRecv);
		})
		.fail(error => {
			console.error(error);
			return reject(error);
		});
});

/**
 * 탑바를 미리로드함.
 */
const tobbarPreloadPane = async () => {
	const { instances } = await client.get('instances');
	for (const instanceGuid in instances) {
		if (instances[instanceGuid].location === 'top_bar') {
			const topbarClient = client.instance(instanceGuid);
			await topbarClient.invoke('preloadPane');
			console.debug("topbar preloadPane success!");
			break;
		}
	}
}

/**
 * nav-bar를 미리로드함.
 */
const navbarPreloadPane = async () => {
	const { instances } = await client.get('instances');
	for (const instanceGuid in instances) {
		if (instances[instanceGuid].location === 'nav_bar') {
			const navClient = client.instance(instanceGuid);
			await navClient.invoke('preloadPane');
			console.debug("navbar preloadPane success!");
			break;
		}
	}
}

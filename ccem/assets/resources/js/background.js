var codeData;

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
 * Client instances preloadPane
 * @param {array} instanceNames 
 */
 const instancesPreloadPane = async (instanceNames) => {
	const { instances } = await client.get('instances');

	for (const instanceGuid in instances) {

		const location = instances[instanceGuid].location;

		if (instanceNames.includes(location)) {
			const target = client.instance(instanceGuid);
			await target.invoke('preloadPane');
			console.debug(`${location} preloadPane success!`);
		}

	}

}

/**
 * 익명함수 실행
 */
(async function () {
	codeData = await getCommCode();
	instancesPreloadPane(["top_bar", "nav_bar"]);
})();

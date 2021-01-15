var codeData;

$(function () {
	getCommCode();
	tobbarPreloadPane();
});

client.on("getCodeList", function (target_guid) {
	const target = client.instance(target_guid);
	target.trigger('getCodeData', codeData);
});

/**
 * 공통코드 조회
 */
const getCommCode = () => {
	let settings = {
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
	$.ajax(settings).done(data => {
		codeData = data.dsRecv;
	});
}

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

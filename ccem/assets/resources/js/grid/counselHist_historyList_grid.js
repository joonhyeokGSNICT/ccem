$(function(){
	// 상담조회 > 상담조회 리스트 grid
		counselHist_historyList_grid = new Grid({
			el: document.getElementById('counselHist_historyList_grid'),
			header: GRID_PRPRT.header,
			minBodyHeight: GRID_PRPRT.minBodyHeight,
			bodyHeight: 150,
			minRowHeight: GRID_PRPRT.rowHeight,
			rowHeight: GRID_PRPRT.rowHeight,
			width: 'auto',
			scrollX: false,
			scrollY: true,
			showDummyRows: false,
			heightResizable: false,
			usageStatistics: false,
			data: {
				api: {
					readData: { 
						url: API_SERVER + '/srch/IPCCList', 
						method: 'GET',
						headers:{
							"Content-Type": "application/json",
						},
						initParams: { param: 'param' }, 
					},
				},
				initialRequest: false, // set to true by default
			},
			copyOptions: {
				useFormattedValue: true,
			},
			// rowHeaders: ['checkbox'],
			rowHeaders: [{
				type: 'rowNum',
				header: "NO",
			},
			],
			columnOptions: {
				minWidth: 50,
				resizable: true,
				frozenCount: 0,
				frozenBorderWidth: 1,
			},
			columns: [
				{
					header: '상담일자',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '접수',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '상담채널',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '상담구분',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '회원명',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '회원번호',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '통화시각',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '상담시간',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '처리시간',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '학년',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '본부',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '사업국',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '센터',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				}
				],
		});
		counselHist_historyList_grid.on('click', (ev) => {
			GridUtil.sortByHeader(counselHist_historyList_grid, ev);
			GridUtil.selection(counselHist_historyList_grid, ev);
		});
		
		counselHist_historyList_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselHist_historyList_grid.getRow(ev.rowKey);
				var settings = {
						url: API_SERVER + "/srch/IPCCInfo",
						method: "GET",
						dataType : "json",
						crossDomain : "true",
						contentType: "application/json; charset=utf-8",
						beforeSend: function (xhr) {
							xhr.setRequestHeader("Content-Type","application/json");
							xhr.setRequestHeader("Authorization", "Basic "+ btoa(AUTHUSERID + ":" + AUTHTOKEN));
						},
						data: {
							reqUserId : USEROBJECT.id,
							reqUserTeam : USEROBJECT.team,
							consno : rowData["consno"],
							custSeq : rowData["custSeq"]
						}
				};
				$.ajax(settings).done(function (response) {
					console.log(response);
					if(response.resultCode == "S"){
						$("#ipcc_hls_detail_custNm").text(response.info.custNm);
						$("#ipcc_hls_detail_custSeq").text(response.info.custSeq);
						$("#ipcc_hls_detail_custInfo").text(response.info.custInfo);
						$("#ipcc_hls_detail_incoTlno").text(response.info.incoTlno);
						$("#ipcc_hls_detail_requestConts").text(response.info.requestConts);
						$("#ipcc_hls_detail_councelConts").text(response.info.councelConts);
					}else {
						client.invoke('notify', '오류가 발생했습니다. : ' + response.resultMessage, 'alert');
					}
				});
			}
		});
		
		// 상담조회 리스트 응답 결과 수신
		counselHist_historyList_grid.on('response', ev => {
			const {response} = ev.xhr;
			const responseObj = JSON.parse(response);
			console.log('data : ', responseObj.result);
			console.log('data : ', responseObj.data);
			console.log('data : ', responseObj);
			if(responseObj.resultCode == "S"){
				$("#ipcc_hls_count").text(responseObj.data.pagination.totalCount);
				client.invoke('notify', '총 ' + responseObj.data.pagination.totalCount + " 건의 데이터가 조회 되었습니다.");
			}else {
				client.invoke('notify', '오류가 발생했습니다. : ' + responseObj.resultDtlMessage, 'alert');
			}
		});
		
		// 상담조회 끝
	
		// 상담조회 > 상담제품 리스트 grid
		counselHist_counselProduct_grid = new Grid({
			el: document.getElementById('counselHist_counselProduct_grid'),
			header: GRID_PRPRT.header,
			minBodyHeight: GRID_PRPRT.minBodyHeight,
			bodyHeight: 100,
			minRowHeight: GRID_PRPRT.rowHeight,
			rowHeight: GRID_PRPRT.rowHeight,
			width: 'auto',
			scrollX: false,
			scrollY: true,
			showDummyRows: false,
			heightResizable: false,
			usageStatistics: false,
			data: {
				api: {
					readData: { 
						url: API_SERVER + '/srch/IPCCList', 
						method: 'GET',
						headers:{
							"Content-Type": "application/json",
						},
						initParams: { param: 'param' }, 
					},
				},
				initialRequest: false, // set to true by default
			},
			copyOptions: {
				useFormattedValue: true,
			},
			// rowHeaders: ['checkbox'],
			rowHeaders: [{
				type: 'rowNum',
				header: "NO",
			},
			],
			columnOptions: {
				minWidth: 50,
				resizable: true,
				frozenCount: 0,
				frozenBorderWidth: 1,
			},
			columns: [
				{
					header: '상담일자',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '접수',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '상담채널',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '상담구분',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '회원명',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '회원번호',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '통화시각',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '상담시간',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '처리시간',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '학년',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '본부',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '사업국',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '센터',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(counselHist_counselProduct_grid, obj, "name", true),
				}
				],
		});
		counselHist_counselProduct_grid.on('click', (ev) => {
			GridUtil.sortByHeader(counselHist_counselProduct_grid, ev);
			GridUtil.selection(counselHist_counselProduct_grid, ev);
		});
		
		counselHist_counselProduct_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselHist_counselProduct_grid.getRow(ev.rowKey);
				var settings = {
						url: API_SERVER + "/srch/IPCCInfo",
						method: "GET",
						dataType : "json",
						crossDomain : "true",
						contentType: "application/json; charset=utf-8",
						beforeSend: function (xhr) {
							xhr.setRequestHeader("Content-Type","application/json");
							xhr.setRequestHeader("Authorization", "Basic "+ btoa(AUTHUSERID + ":" + AUTHTOKEN));
						},
						data: {
							reqUserId : USEROBJECT.id,
							reqUserTeam : USEROBJECT.team,
							consno : rowData["consno"],
							custSeq : rowData["custSeq"]
						}
				};
				$.ajax(settings).done(function (response) {
					console.log(response);
					if(response.resultCode == "S"){
						$("#ipcc_hls_detail_custNm").text(response.info.custNm);
						$("#ipcc_hls_detail_custSeq").text(response.info.custSeq);
						$("#ipcc_hls_detail_custInfo").text(response.info.custInfo);
						$("#ipcc_hls_detail_incoTlno").text(response.info.incoTlno);
						$("#ipcc_hls_detail_requestConts").text(response.info.requestConts);
						$("#ipcc_hls_detail_councelConts").text(response.info.councelConts);
					}else {
						client.invoke('notify', '오류가 발생했습니다. : ' + response.resultMessage, 'alert');
					}
				});
			}
		});
		
		// 상담제품 리스트 응답 결과 수신
		counselHist_counselProduct_grid.on('response', ev => {
			const {response} = ev.xhr;
			const responseObj = JSON.parse(response);
			console.log('data : ', responseObj.result);
			console.log('data : ', responseObj.data);
			console.log('data : ', responseObj);
			if(responseObj.resultCode == "S"){
				$("#ipcc_hls_count").text(responseObj.data.pagination.totalCount);
				client.invoke('notify', '총 ' + responseObj.data.pagination.totalCount + " 건의 데이터가 조회 되었습니다.");
			}else {
				client.invoke('notify', '오류가 발생했습니다. : ' + responseObj.resultDtlMessage, 'alert');
			}
		});
		
		// 상담제품 끝
});

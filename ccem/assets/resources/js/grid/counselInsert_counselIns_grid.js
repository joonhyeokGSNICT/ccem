$(function(){
	// 상담등록 > 상담등록 > 과목 grid
		counselInsert_subject_grid = new Grid({
			el: document.getElementById('counselInsert_subject_grid'),
			header: GRID_PRPRT.header,
			minBodyHeight: GRID_PRPRT.minBodyHeight,
			bodyHeight: 340,
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
			'checkbox' ],
			columnOptions: {
				minWidth: 50,
				resizable: true,
				frozenCount: 0,
				frozenBorderWidth: 1,
			},
			columns: [
				{
					header: '과목',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				}
				],
		});
		counselInsert_subject_grid.on('click', (ev) => {
			GridUtil.sortByHeader(counselInsert_subject_grid, ev);
			GridUtil.selection(counselInsert_subject_grid, ev);
		});
		
		counselInsert_subject_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselInsert_subject_grid.getRow(ev.rowKey);
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
		
		// 상담등록 과목 리스트 응답 결과 수신
		counselInsert_subject_grid.on('response', ev => {
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
		
		// 과목 끝
	
		// 상담등록 > 상담등록 > 선택한과목 grid
		counselInsert_subjectSelected_grid = new Grid({
			el: document.getElementById('counselInsert_subjectSelected_grid'),
			header: GRID_PRPRT.header,
			minBodyHeight: GRID_PRPRT.minBodyHeight,
			bodyHeight: 120,
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
			}],
			columnOptions: {
				minWidth: 50,
				resizable: true,
				frozenCount: 0,
				frozenBorderWidth: 1,
			},
			columns: [
				/* {
	                header: 'NO',
	                name: 'NO',
	                minWidth: 40,
	                width: 40,
	                align: "center",
	                formatter: function (obj) {return obj.row.__storage__.sortKey + 1 },
	            },*/
				{
					header: '상담과목',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				}
				],
		});
		counselInsert_subjectSelected_grid.on('click', (ev) => {
			GridUtil.sortByHeader(counselInsert_subjectSelected_grid, ev);
			GridUtil.selection(counselInsert_subjectSelected_grid, ev);
		});
		
		counselInsert_subjectSelected_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselInsert_subjectSelected_grid.getRow(ev.rowKey);
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
		
		// 선택한과목 리스트 응답 결과 수신
		counselInsert_subjectSelected_grid.on('response', ev => {
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
		
		// 선택한과목 끝
		
		// 상담등록 > 상담등록 > 학습중인과목 grid
		counselInsert_currentSubject_grid = new Grid({
			el: document.getElementById('counselInsert_currentSubject_grid'),
			header: GRID_PRPRT.header,
			minBodyHeight: GRID_PRPRT.minBodyHeight,
			bodyHeight: 80,
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
					header: '제품',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '선생님',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '팀장',
					name: 'custNm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				}
				],
		});
		counselInsert_currentSubject_grid.on('click', (ev) => {
			GridUtil.sortByHeader(counselInsert_currentSubject_grid, ev);
			GridUtil.selection(counselInsert_currentSubject_grid, ev);
		});
		
		counselInsert_currentSubject_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselInsert_currentSubject_grid.getRow(ev.rowKey);
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
		
		// 학습중인과목 리스트 응답 결과 수신
		counselInsert_currentSubject_grid.on('response', ev => {
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
		
		// 학습중인과목 끝
});

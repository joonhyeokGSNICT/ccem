$(function(){
	// 상담메인 > 직접결제 > 회비관리 grid
		counselMain_directCharge_duesInfo_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_duesInfo_grid'),
			header: GRID_PRPRT.header,
			minBodyHeight: GRID_PRPRT.minBodyHeight,
			bodyHeight: 150,
			minRowHeight: GRID_PRPRT.rowHeight,
			rowHeight: GRID_PRPRT.rowHeight,
			width: 'auto',
			scrollX: true,
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
					header: '청구월',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn
				},
				{
					header: '브랜드',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '청구구분',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '발송현황',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '회비금액',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '결제현황',
					name: 'consQustCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '결제구분',
					name: 'consAnsrCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '알림톡발송일',
					name: 'consTyp1Nm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				}
				],
		});
		counselMain_directCharge_duesInfo_grid.on('click', (ev) => {
			GridUtil.sortByHeader(counselMain_directCharge_duesInfo_grid, ev);
			GridUtil.selection(counselMain_directCharge_duesInfo_grid, ev);
		});
		
		counselMain_directCharge_duesInfo_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselMain_directCharge_duesInfo_grid.getRow(ev.rowKey);
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
		
		// 회비관리 리스트 응답 결과 수신
		counselMain_directCharge_duesInfo_grid.on('response', ev => {
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
		
		// counselMain_directCharge_duesInfo_grid 끝
		
		// 상담메인 > 직접결제 > 알림톡발송이력 grid
		counselMain_directCharge_alimSendList_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_alimSendList_grid'),
			header: GRID_PRPRT.header,
			minBodyHeight: GRID_PRPRT.minBodyHeight,
			bodyHeight: 257,
			minRowHeight: GRID_PRPRT.rowHeight,
			rowHeight: GRID_PRPRT.rowHeight,
			width: 'auto',
			scrollX: true,
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
					header: '구분',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn
				},
				{
					header: '발송일시',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '결제확인일시',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '시스템',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '발송방식',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				}
				],
		});
		counselMain_directCharge_alimSendList_grid.on('click', (ev) => {
			GridUtil.sortByHeader(counselMain_directCharge_alimSendList_grid, ev);
			GridUtil.selection(counselMain_directCharge_alimSendList_grid, ev);
		});
		
		counselMain_directCharge_alimSendList_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselMain_directCharge_alimSendList_grid.getRow(ev.rowKey);
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
		
		// ipcc 리스트 응답 결과 수신
		counselMain_directCharge_alimSendList_grid.on('response', ev => {
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
		
		// 알림톡발송이력 끝
	
		// 상담메인 > 직접결제 > 청구서 grid
		counselMain_directCharge_bill_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_bill_grid'),
			header: GRID_PRPRT.header,
			minBodyHeight: GRID_PRPRT.minBodyHeight,
			bodyHeight: 130,
			minRowHeight: GRID_PRPRT.rowHeight,
			rowHeight: GRID_PRPRT.rowHeight,
			width: 'auto',
			scrollX: true,
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
				{
					header: '과목',
					name: 'custNm',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn
				},
				{
					header: '항목',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '회비',
					name: 'reserverDtm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				}
				],
		});
		counselMain_directCharge_bill_grid.on('click', (ev) => {
			GridUtil.sortByHeader(counselMain_directCharge_bill_grid, ev);
			GridUtil.selection(counselMain_directCharge_bill_grid, ev);
		});
		
		counselMain_directCharge_bill_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselMain_directCharge_bill_grid.getRow(ev.rowKey);
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
		
		// 청구서 리스트 응답 결과 수신
		counselMain_directCharge_bill_grid.on('response', ev => {
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
		
		// 청구서 끝
		
		// 상담메인 > 직접결제 > 수신대상자 grid
		counselMain_directCharge_reciverInfo_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_reciverInfo_grid'),
			header: GRID_PRPRT.header,
			minBodyHeight: GRID_PRPRT.minBodyHeight,
			bodyHeight: 80,
			minRowHeight: GRID_PRPRT.rowHeight,
			rowHeight: GRID_PRPRT.rowHeight,
			width: 'auto',
			scrollX: true,
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
				{
					header: '관계',
					name: 'custNm',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn
				},
				{
					header: '이름',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '전화번호',
					name: 'reserverDtm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				}
				],
		});
		counselMain_directCharge_reciverInfo_grid.on('click', (ev) => {
			GridUtil.sortByHeader(counselMain_directCharge_reciverInfo_grid, ev);
			GridUtil.selection(counselMain_directCharge_reciverInfo_grid, ev);
		});
		
		counselMain_directCharge_bill_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselMain_directCharge_reciverInfo_grid.getRow(ev.rowKey);
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
		
		// 수신대상자정보 리스트 응답 결과 수신
		counselMain_directCharge_reciverInfo_grid.on('response', ev => {
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
		
		// 수신대상자정보 끝
		
		// 상담메인 > 직접결제 > 결제/취소 이력 grid
		counselMain_directCharge_cancelCharge_grid = new Grid({
			el: document.getElementById('counselMain_directCharge_cancelCharge_grid'),
			header: GRID_PRPRT.header,
			minBodyHeight: GRID_PRPRT.minBodyHeight,
			bodyHeight: 230,
			minRowHeight: GRID_PRPRT.rowHeight,
			rowHeight: GRID_PRPRT.rowHeight,
			width: 'auto',
			scrollX: true,
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
				{
					header: '관계',
					name: 'custNm',
					width: 50,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn
				},
				{
					header: '이름',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '전화번호',
					name: 'reserverDtm',
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				}
				],
		});
		counselMain_directCharge_cancelCharge_grid.on('click', (ev) => {
			GridUtil.sortByHeader(counselMain_directCharge_cancelCharge_grid, ev);
			GridUtil.selection(counselMain_directCharge_cancelCharge_grid, ev);
		});
		
		counselMain_directCharge_bill_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselMain_directCharge_cancelCharge_grid.getRow(ev.rowKey);
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
		
		// 결제/취소 이력 리스트 응답 결과 수신
		counselMain_directCharge_cancelCharge_grid.on('response', ev => {
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
		
		// 결제/취소 이력 끝
		
});

$(function(){
	// 상담메인 > 회비 탭 > 회비목록 grid
	counselMain_membershipDueTab_dueList = new Grid({
			el: document.getElementById('counselMain_membershipDueTab_dueList'),
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
				/* {
	                header: 'NO',
	                name: 'NO',
	                minWidth: 40,
	                width: 40,
	                align: "center",
	                formatter: function (obj) {return obj.row.__storage__.sortKey + 1 },
	            },*/
				{
					header: '제품',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '학습상태',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '계',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '통화시각',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '상담시각',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '상담시간',
					name: 'consQustCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '상담구분',
					name: 'consAnsrCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '처리구분',
					name: 'consTyp1Nm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '상담교사',
					name: 'consTyp2Nm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '소분류',
					name: 'consTyp3Nm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '세분류',
					name: 'consTyp4Nm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '연락처',
					name: 'custInfo',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer:CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "tel"),
				},
				{
					header: '접수채널',
					name: 'acpgChnlNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '발신번호',
					name: 'incoTlno',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				/*{
	                header: '상세이력',
	                name: 'DETAILCONT',
	                align: "center",
	                sortable: true,
	                ellipsis: true,
	                renderer: CustomColumn,
	            },*/
				{
					header: '처리방법',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '처리일시',
					name: 'consDspsDttm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				}
				],
		});
	counselMain_membershipDueTab_dueList.on('click', (ev) => {
			GridUtil.sortByHeader(counselMain_membershipDueTab_dueList, ev);
			GridUtil.selection(counselMain_membershipDueTab_dueList, ev);
		});
		
		counselMain_counselHist_grid.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselMain_membershipDueTab_dueList.getRow(ev.rowKey);
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
		counselMain_membershipDueTab_dueList.on('response', ev => {
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
		
		// 회비리스트 끝
	
		// 상담메인 > 회비 탭 > 과목별 입금내역 grid
		counselMain_membershipDueTab_subChargeList = new Grid({
			el: document.getElementById('counselMain_membershipDueTab_subChargeList'),
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
				/* {
	                header: 'NO',
	                name: 'NO',
	                minWidth: 40,
	                width: 40,
	                align: "center",
	                formatter: function (obj) {return obj.row.__storage__.sortKey + 1 },
	            },*/
				{
					header: '입금일자',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '대상년월',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '구분',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '입금액',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '상담시각',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				}
				],
		});
		counselMain_membershipDueTab_subChargeList.on('click', (ev) => {
			GridUtil.sortByHeader(counselMain_membershipDueTab_subChargeList, ev);
			GridUtil.selection(counselMain_membershipDueTab_subChargeList, ev);
		});
		
		counselMain_membershipDueTab_subChargeList.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselMain_membershipDueTab_subChargeList.getRow(ev.rowKey);
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
		
		// 변동이력 리스트 응답 결과 수신
		counselMain_membershipDueTab_subChargeList.on('response', ev => {
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
		
		// 과목별입금내역 끝
		
		// 상담메인 > 회비 탭 > 입금내역 grid
		counselMain_membershipDueTab_chargeList = new Grid({
			el: document.getElementById('counselMain_membershipDueTab_chargeList'),
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
				/* {
	                header: 'NO',
	                name: 'NO',
	                minWidth: 40,
	                width: 40,
	                align: "center",
	                formatter: function (obj) {return obj.row.__storage__.sortKey + 1 },
	            },*/
				{
					header: '이체일자',
					name: 'custNm',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
					formatter: (obj) => GridUtil.customMask(ipcc_hls_grid, obj, "name", true),
				},
				{
					header: '과목',
					name: 'custSeq',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '대상년월',
					name: 'reserverDtm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '입금액',
					name: 'chprNm',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '할인액',
					name: 'consStatNm',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				},
				{
					header: '상담시간',
					name: 'consQustCntn',
					width: 200,
					align: "center",
					sortable: true,
					ellipsis: true,
					renderer: CustomColumn,
				}
				],
		});
		counselMain_membershipDueTab_chargeList.on('click', (ev) => {
			GridUtil.sortByHeader(counselMain_membershipDueTab_chargeList, ev);
			GridUtil.selection(counselMain_membershipDueTab_chargeList, ev);
		});
		
		counselMain_membershipDueTab_chargeList.on('dblclick', (ev) => {
			if (ev["targetType"] == "cell") {
				var rowData = 	counselMain_membershipDueTab_chargeList.getRow(ev.rowKey);
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
		
		// 입금내역 리스트 응답 결과 수신
		counselMain_membershipDueTab_chargeList.on('response', ev => {
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
		
		// 입금내역 끝
});

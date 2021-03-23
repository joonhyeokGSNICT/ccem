$(function(){
	// 고객찾기 > 고객찾기 grid
	customerSearchList_grid = new Grid({
		el: document.getElementById('customerSearchList_grid'),
		bodyHeight: 480,
		pageOptions: {
			perPage: 20,
			useClient: true
		},
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
                header: '상태',
                name: 'STATUS',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '구분',
                name: 'CUST_MK',
                width: 50,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '고객명',
                name: 'NAME',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '학년',
                name: 'GRADE',
                width: 120,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '회원번호',
                name: 'MBR_ID',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '생년월일',
                name: 'RSDNO',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => FormatUtil.birth(columnInfo.value)
            },
            {
                header: '자택전화',
                name: 'TELPNO',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '회원HP',
                name: 'MOBILNO',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
            	header: '회원모HP',
            	name: 'MOBILNO_MBR',
            	width: 100,
            	align: "center",
            	sortable: true,
            	ellipsis: true,
            },
            {
                header: '대리인HP',
                name: 'MOBILNO_LAW',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '우편',
                name: 'ZIPCDE',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '주소',
                name: 'ADDR',
                width: 200,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '본부',
                name: 'UPDEPTNAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사업국',
                name: 'DEPT_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '센터',
                name: 'LC_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
        ],
    });
	customerSearchList_grid.on('click', (ev) => {
		if(ev.targetType == "cell"){
			customerSearchList_grid.addSelection(ev);
			customerSearchList_grid.clickSort(ev);
		}
    });
	
	customerSearchList_grid.on('dblclick', (ev) => {
		initAll(); 													// 기존 정보 초기화
		custInfo = customerSearchList_grid.getRow(ev.rowKey);
		if(sidebarClient != null && sidebarClient != undefined){
			sidebarClient.get('ticket').then(function(data){				// 티켓 정보 불러오기
				currentTicketInfo = data;
				sidebarClient.get(`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["OB_MK"]}`).then(function (d){// OB구분
					currentOBMK = d[`ticket.customField:custom_field_${ZDK_INFO[_SPACE]["ticketField"]["OB_MK"]}`]?.split('_')[2];
					var param = {
							senddataids: ["send1"],
							recvdataids: ["recv1"],
							send1: [{
								"CUST_ID"		:custInfo.CUST_ID,				// 회원번호
								"OBLIST_CDE"	:currentOBMK,					// OB구분
								"ZEN_TICKET_ID" :(currentTicketInfo?.ticket?.id)!=undefined?currentTicketInfo?.ticket?.id:""
							}]
					};
					
					$.ajax({
						url: API_SERVER + '/cns.getCustInfo.do',
						type: 'POST',
						dataType: 'json',
						contentType: "application/json",
						data: JSON.stringify(param),
						success: function (response) {
							if(response.errcode == "0"){
								currentCustInfo = response.recv1[0];				// 고객정보 상주
								loadCustInfoMain();									// 고객정보 로드 함수
								// 젠데스크 고객 검색 ( requester id 를 구하기 위함 )
								client.request(`/api/v2/search.json?query=type:user ${currentCustInfo.CUST_ID}`).then(function(d){
									console.log(d);
									if(d.count >= 1){					
										// console.log(d.results[0].id);
										if(currentTicketInfo != undefined && currentTicketInfo != null && currentTicketInfo?.ticket != undefined){
											if(currentTicketInfo.ticket.requester.externalId != d.results[0].external_id){
												ModalUtil.confirmPop("확인 메세지", "티켓의 고객과 현재 CCEM에 조회된 고객이 다릅니다. <br> 티켓에 업데이트 하시겠습니까?", function(e){
													if(currentTicketInfo.ticket.requester.externalId == null && currentTicketInfo.ticket.requester.role == 'end-user'){
														client.request({
															url:`/api/v2/tickets/${currentTicketInfo.ticket.id}`, 
															type: 'PUT', 
															dataType: 'json',
															contentType: "application/json",
															data:JSON.stringify({ticket:{requester_id: d.results[0].id, comment:'현재 티켓의 요청자를 ' + currentTicketInfo.ticket.requester.name + '(' + currentTicketInfo.ticket.requester.externalId + ') 에서 ' + d.results[0].name + '(' + d.results[0].external_id + ') (으)로 변경하였습니다.'}})}).then(function(response){
																client.invoke("notify", "티켓 요청자를 업데이트 했습니다.", "notice", 5000);
																// 젠데스크에 고객이 있는 경우 기존고객과 임시 end-user merge
																var option = {
																		url: `/api/v2/users/${currentTicketInfo.ticket.requester.id}/merge.json`,
																		type: 'PUT',
																		dataType: 'json',
																		contentType: "application/json",
																		data: JSON.stringify({
																			"user": {
																				"id": d.results[0].id,
																			}
																		})
																}
																client.request(option).then(function(d) {
																	client.invoke("notify", "임시 고객이 기존 고객과 통합 되었습니다.", "notice", 5000);
																});
															});
													}else {
														client.request({
															url:`/api/v2/tickets/${currentTicketInfo.ticket.id}`, 
															type: 'PUT', 
															dataType: 'json',
															contentType: "application/json",
															data:JSON.stringify({ticket:{requester_id: d.results[0].id, comment:'현재 티켓의 요청자를 ' + currentTicketInfo.ticket.requester.name + '(' + currentTicketInfo.ticket.requester.externalId + ') 에서 ' + d.results[0].name + '(' + d.results[0].external_id + ') (으)로 변경하였습니다.'}})}).then(function(response){
																// console.log(response);
																client.invoke("notify", "티켓 요청자를 업데이트 했습니다.", "notice", 5000);
															});
													}
												});
											}
										}
									}
								});
								updateUserforZen();
								$("#customerInfo").click();	// 탭 이동
								$("#customerTab").click();	// 탭 이동
							}else {
								loading.out();
								client.invoke("notify", response.errmsg, "error", 60000);
							}
						}, error: function (response) {
						}
					});
				});
			})
		}else {
			var param = {
					senddataids: ["send1"],
					recvdataids: ["recv1"],
					send1: [{
						"CUST_ID"		:custInfo.CUST_ID,				// 회원번호
					}]
			};
			
			$.ajax({
				url: API_SERVER + '/cns.getCustInfo.do',
				type: 'POST',
				dataType: 'json',
				contentType: "application/json",
				data: JSON.stringify(param),
				success: function (response) {
					if(response.errcode == "0"){
						currentCustInfo = response.recv1[0];				// 고객정보 상주
						loadCustInfoMain();									// 고객정보 로드 함수
						updateUserforZen();
						$("#customerInfo").click();	// 탭 이동
						$("#customerTab").click();	// 탭 이동
					}else {
						loading.out();
						client.invoke("notify", response.errmsg, "error", 60000);
					}
				}, error: function (response) {
				}
			});
		}
	});
	
	// 고객찾기 고객찾기 GRID 끝
	
	// 고객찾기 > 선생님조회 grid
	teacherSearchList_grid = new Grid({
		el: document.getElementById('teacherSearchList_grid'),
		bodyHeight: 500,
		pageOptions: {
			perPage: 20,
			useClient: true
		},
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
                header: '구분',
                name: 'EMP_MK_NAME',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '선생님명',
                name: 'TCHR_NAME',
                width: 90,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사원번호',
                name: 'EMP_ID',
                width: 90,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: function(e){
                	result = "";
                	if(e.value != null){
                		result = e.value.substring(0,1);
                		for(var i = 0; i< e.value.length-1; i++){
                			result += "*";
                		}
                	}
                	return result;
                }
            },
            {
                header: '주민번호',
                name: 'RSDNO',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => FormatUtil.birth(columnInfo.value)
            },
            {
                header: '본부',
                name: 'DIV_NAME',
                width: 110,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사업국',
                name: 'DEPT_NAME',
                width: 120,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '센터',
                name: 'LC_NAME',
                width: 120,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '전화번호',
                name: 'DEPT_TEL',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                formatter: columnInfo => {
                	result = "";
                	if(columnInfo.value != null){
                		result = FormatUtil.tel(columnInfo.value.replace(/ /gi,""));
                		}
                	return result;
                	}
            },
            {
                header: '직책',
                name: 'DUTY_NAME',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '선생님구분',
                name: 'TCHR_MK_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '소속팀',
                name: 'PART_NAME',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '재직',
                name: 'STS_NAME',
                width: 70,
                align: "center",
                sortable: true,
                ellipsis: true,
            }
        ],
    });
	teacherSearchList_grid.on('click', (ev) => {
		if(ev.targetType == "cell"){
			teacherSearchList_grid.addSelection(ev);
			teacherSearchList_grid.clickSort(ev);
		}
    });
	teacherSearchList_grid.on('dblclick', (ev) => {
		if(ev.targetType == "cell"){
			teacherSearchList_grid.addSelection(ev);
			teacherSearchList_grid.clickSort(ev);
			initAll();	// 기존 정보 초기화
			onAutoSearchTeacher(teacherSearchList_grid.getRow(ev.rowKey).EMP_ID);
		}
    });
	
	// 선생님조회 끝
	
	
});

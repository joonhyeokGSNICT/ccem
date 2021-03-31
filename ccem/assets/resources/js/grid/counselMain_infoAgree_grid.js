$(function(){
	// 상담메인 > 정보동의 탭 > 개인정보 동의리스트 grid
	counselMain_infoAgree_infoAgreeList_grid = new Grid({
		el: document.getElementById('counselMain_infoAgree_infoAgreeList_grid'),
		bodyHeight: 100,
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
					header: '동의방법',
					name: 'CERT_NM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '입력날짜',
					name: 'SMS_SEND_DT',
					width: 130,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.dateTime(columnInfo.value?.replace(" ",""))
				},
				{
					header: '사업국명',
					name: 'DEPT_NM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '센터명',
					name: 'LC_NM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '선생님명',
					name: 'EMP_NM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '사번',
					name: 'EMP_ID',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '성공여부',
					name: 'APPRV_GB',
					width: 70,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e) {
						var result = "";
						if(e.value != null){
							if(e.value == 'S'){
								result = "성공";
							}else if(e.value =='F'){
								result = '실패';
							}else {
								result = "";
							}
						}
						return result;
					}
				},
				{
					header: '동의상태',
					name: 'APPRV_NM',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '동의번호',
					name: 'NEWMEM_NO',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '순번',
					name: 'CHG_SEQ',
					width: 60,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_infoAgree_infoAgreeList_grid.on('click', (ev) => {
			if(ev.targetType == 'cell'){
				counselMain_infoAgree_infoAgreeList_grid.addSelection(ev);
				counselMain_infoAgree_infoAgreeList_grid.clickSort(ev);
				loadList('getTBCALLRST',counselMain_infoAgree_iaRecordList_grid, counselMain_infoAgree_infoAgreeList_grid.getRow(ev.rowKey).LIST_ID);
				counselMain_infoAgree_iaRecordList_grid.refreshLayout();
			}
			
	    });
		
		// 개인정보동의 끝
	
		// 상담메인 > 정보동의 탭 > 개인정보 녹취 통화이력 grid
		counselMain_infoAgree_iaRecordList_grid = new Grid({
			el: document.getElementById('counselMain_infoAgree_iaRecordList_grid'),
			bodyHeight: 100,
			scrollX: false,
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
					header: '통화결과',
					name: 'CALL_RST_MK_NM',
					width: 95,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신전화번호',
					name: 'TELPNO',
					width: 115,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '통화일',
					name: 'CALL_DATE',
					width: 140,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '통화시간',
					name: 'CALL_TIME',
					width: 95,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.time(columnInfo.value)
				},
				{
					header: '발신자',
					name: 'USER_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_infoAgree_iaRecordList_grid.on('click', (ev) => {
			counselMain_infoAgree_iaRecordList_grid.addSelection(ev);
			counselMain_infoAgree_iaRecordList_grid.clickSort(ev);
	    });
		
		// 개인정보 녹취 통화이력 끝
		
		// 상담메인 > 정보동의 탭 > 약관버전 grid
		counselMain_infoAgree_termsVersion_grid = new Grid({
			el: document.getElementById('counselMain_infoAgree_termsVersion_grid'),
			bodyHeight: 100,
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
					header: '인증방법',
					name: 'CERT_NM',
					width: 70,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				//{decode(APPRV_GB,"1","대기","2","발송완료","3","녹취약관배부","4","발송실패","7","동의완료","")}</C>
				{
					header: '현황',
					name: 'APPRV_GB',
					width: 130,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result = "";
						if(e.value!="" && e.value != null){
							switch(e.value){
							case '1' :
								result = '대기';
								break;
							case '2' :
								result = '발송완료';
								break;
							case '3' :
								result = '녹취약관배부';
								break;
							case '4' :
								result = '발송실패';
								break;
							case '7' :
								result = '동의완료';
								break;
							default :
								result = '';
								break;
							}
						}
						return result;
					}
				},
				{
					header: '약관배부',
					name: 'ENT_DIST',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '배부/발송일자',
					name: 'ENT_DIST_DT',
					width: 130,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '동의일',
					name: 'ENT_DATE',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '약관버전',
					name: 'ENT_VS',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '동의여부',
					name: 'ENT_YN',
					width: 70,
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_infoAgree_termsVersion_grid.on('click', (ev) => {
			if(ev.targetType == 'cell'){
				counselMain_infoAgree_termsVersion_grid.addSelection(ev);
				counselMain_infoAgree_termsVersion_grid.clickSort(ev);
				loadList('getTBCALLRST',counselMain_infoAgree_termsRecordList_grid, counselMain_infoAgree_termsVersion_grid.getRow(ev.rowKey).LIST_ID);
				counselMain_infoAgree_termsRecordList_grid.refreshLayout();
			}
	    });
		
		// 약관버전 끝
		
		// 상담메인 > 정보동의 탭 > 약관녹취통화이력 grid
		counselMain_infoAgree_termsRecordList_grid = new Grid({
			el: document.getElementById('counselMain_infoAgree_termsRecordList_grid'),
			bodyHeight: 100,
			scrollX: false,
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
					header: '통화결과',
					name: 'CALL_RST_MK_NM',
					width: 95,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발신전화번호',
					name: 'TELPNO',
					width: 115,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '통화일',
					name: 'CALL_DATE',
					width: 140,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '통화시간',
					name: 'CALL_TIME',
					width: 95,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.time(columnInfo.value)
				},
				{
					header: '발신자',
					name: 'USER_NAME',
					align: "center",
					sortable: true,
					ellipsis: true,
				}
				],
		});
		counselMain_infoAgree_termsRecordList_grid.on('click', (ev) => {
			counselMain_infoAgree_termsRecordList_grid.addSelection(ev);
			counselMain_infoAgree_termsRecordList_grid.clickSort(ev);
	    });
		
		// 약관녹취통화이력 끝
});

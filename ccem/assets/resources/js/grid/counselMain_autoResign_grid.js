$(function(){
	// 상담메인 > 자동퇴회 탭 > 자동퇴회세부 grid
	counselMain_autoResign_resignDetail_grid = new Grid({
		el: document.getElementById('counselMain_autoResign_resignDetail_grid'),
		bodyHeight: 200,
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
					header: '월',
					name: 'ZRCD_YM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result = e.value;
						if(e.value != null){
							result = e.value.substring(0,4) +"-"+ e.value.substring(4,6);
						}
						return result;
					}
				},
				{
					header: '과목',
					name: 'PRDT_NM',
					width: 130,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '최종회비월',
					name: 'ZLASTFEE_YM',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result = e.value;
						if(e.value != null){
							result = e.value.substring(0,4) +"-"+ e.value.substring(4,6);
						}
						return result;
					}
				},
				{
					header: '최종회비납입일',
					name: 'ZLASTFEE_DT',
					width: 120,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '미납회비',
					name: 'NOPAY_AMT',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => columnInfo.value.format()
				},
				{
					header: '미납개월',
					name: 'MONTH_CAL',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				//{decode(APPRV_GB,"1","퇴회예정","2","퇴회대상","3","교사퇴회","4","퇴회불가","7","자동퇴회","")}
				{
					header: '자동퇴회여부',
					name: 'APPRV_GB',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result = e.value;
						if(e.value != null){
							switch(e.value){
							case '1' :
								result = '퇴회예정';
								break;
							case '2' :
								result = '퇴회대상';
								break;
							case '3' :
								result = '교사퇴회';
								break;
							case '4' :
								result = '퇴회불가';
								break;
							case '7' :
								result = '자동퇴회';
								break;
							default :
								result = '';
								break;
							}
						}
						return result;
					}
				}
				],
		});
		counselMain_autoResign_resignDetail_grid.on('click', (ev) => {
			counselMain_autoResign_resignDetail_grid.addSelection(ev);
			counselMain_autoResign_resignDetail_grid.clickSort(ev);
	    });
		
		// 자동퇴회세부 끝
	
		// 상담메인 > 자동퇴회 탭 > 퇴회안내 이력 List grid
		counselMain_autoResign_resignSendList_grid = new Grid({
			el: document.getElementById('counselMain_autoResign_resignSendList_grid'),
			bodyHeight: 200,
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
					header: '월',
					name: 'ZRCD_YM',
					width: 80,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: function(e){
						var result = e.value;
						if(e.value != null){
							result = e.value.substring(0,4) +"-"+ e.value.substring(4,6);
						}
						return result;
					}
				},
				{
					header: '발신번호',
					name: 'MOBILE',
					width: 130,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '발송일',
					name: 'SEND_DATE',
					width: 100,
					align: "center",
					sortable: true,
					ellipsis: true,
					formatter: columnInfo => FormatUtil.date(columnInfo.value)
				},
				{
					header: '수신여부',
					name: 'SMS_STATUS',
					width: 150,
					align: "center",
					sortable: true,
					ellipsis: true,
				},
				{
					header: '동의일',
					name: 'MSG',
					width: 90,
					align: "center",
					sortable: true,
					ellipsis: true,
					hidden: true
				}
				],
		});
		counselMain_autoResign_resignSendList_grid.on('click', (ev) => {
			counselMain_autoResign_resignSendList_grid.addSelection(ev);
			counselMain_autoResign_resignSendList_grid.clickSort(ev);
			if(ev.targetType == 'cell'){
				var currentData = counselMain_autoResign_resignSendList_grid.getRow(ev.rowKey);
				$("#autoResign_MSG").val(currentData.MSG);
			}
	    });
		
		// 퇴회안내 이력 끝
		
});

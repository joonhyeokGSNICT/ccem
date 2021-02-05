
$(function(){
	// input mask
	$(".imask-date").each((i, el) => calendarUtil.init(el.id));
});

/**
 * MOS 조회
 * @returns
 */
function onSearch(){
	var settings = {
			url: `${API_SERVER}/sys.getMosInfo.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{
							"CSEL_DATE"	: POP_DATA.CSEL_DATE,			// 상담 날짜
							"CSEL_NO"	: POP_DATA.CSEL_NO,				// 상담 번호
							"CSEL_SEQ"	: POP_DATA.CSEL_SEQ,			// 상담 순번
						}],
			}),
		}

	$.ajax(settings)
		.done(data => {
			console.log("정보내용->:",data);
		})
		.fail(error => {
		});
	
	var settingsProc = {
			url: `${API_SERVER}/sys.getCselProc.do`,
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			dataType: "json",
			data: JSON.stringify({
				senddataids: ["dsSend"],
				recvdataids: ["dsRecv"],
				dsSend: [{
							"CSEL_DATE"	: POP_DATA.CSEL_DATE,			// 상담 날짜
							"CSEL_NO"	: POP_DATA.CSEL_NO,				// 상담 번호
							"CSEL_SEQ"	: POP_DATA.CSEL_SEQ,			// 상담 순번
							"CUST_ID"	: POP_DATA.CUST_ID,				// 고객 번호
							"CUST_MK"	: POP_DATA.CUST_MK,				// 고객 구분
						}],
			}),
		}
	
	$.ajax(settingsProc)
	.done(data => {
		console.log("처리내용->:",data);
	})
	.fail(error => {
	});
}

var smsContentsListGrid;

$(function(){
	
	$(".specialCharacter").click(function(){
		insertText($(this).text());
		bytesHandler($("#smsContentArea"));
		checkByte();
	});
	
	$("#smsContentArea").keyup(function(){
		bytesHandler(this);
		checkByte();
	});
	
	// 문자메세지 컨텐츠 LIST
	smsContentsListGrid = new Grid({
		el: document.getElementById('smsContentsListGrid'),
		bodyHeight: 200,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
            {
				header: '구분',
				name: 'gubun',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 100
            },
            {
				header: '메시지',
				name: 'name10',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
		],
	});
	smsContentsListGrid.on('click', (ev) => {
		smsContentsListGrid.addSelection(ev);
		smsContentsListGrid.clickSort(ev);
		smsContentsListGrid.clickCheck(ev);
    });
	
	// 발신번호 LIST
	contactNumberGrid = new Grid({
		el: document.getElementById('contactNumberGrid'),
		bodyHeight: 120,
		scrollX: false,
		rowHeaders: [
			{
				type: 'rowNum',
				header: "NO",
			},
		],
		columns: [
            {
				header: '구분',
				name: 'gubun',
				align: "center",
				sortable: true,
				ellipsis: true,
				width: 100
            },
            {
				header: '발신번호',
				name: 'name10',
				align: "center",
				sortable: true,
				ellipsis: true,
			},
		],
	});
	contactNumberGrid.on('click', (ev) => {
		contactNumberGrid.addSelection(ev);
		contactNumberGrid.clickSort(ev);
		contactNumberGrid.clickCheck(ev);
    });
});

function checkByte(){
	if(Number($("#calByte").text()) > 90){
		$("#lmsBadge").css("display","");
		$("#smsBadge").css("display","none");
	}else{
		$("#smsBadge").css("display","");
		$("#lmsBadge").css("display","none");
	}
};

function getTextLength(str) {
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		if (escape(str.charAt(i)).length == 6) {
			len++;
		}
		len++;
	}
	return len;
}

function bytesHandler(obj){
	var text = $(obj).val();
	$('#calByte').text(getTextLength(text));
}

function insertText(addChar){
	console.log(addChar);
	 var txtArea = document.getElementById('smsContentArea');
	 var txtValue = txtArea.value;
	 var selectPos = txtArea.selectionStart; // 커서 위치 지정
	 var beforeTxt = txtValue.substring(0, selectPos);  // 기존텍스트 ~ 커서시작점 까지의 문자
	 var afterTxt = txtValue.substring(txtArea.selectionEnd, txtValue.length);   // 커서끝지점 ~ 기존텍스트 까지의 문자
	 var addTxt = addChar; // 추가 입력 할 텍스트

	 txtArea.value = beforeTxt + addTxt + afterTxt;

	 selectPos = selectPos + addTxt.length;
	 txtArea.selectionStart = selectPos; // 커서 시작점을 추가 삽입된 텍스트 이후로 지정
	 txtArea.selectionEnd = selectPos; // 커서 끝지점을 추가 삽입된 텍스트 이후로 지정
	 txtArea.focus();
}

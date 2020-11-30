
//=== GRID DEFINITION === //

$(function(){
	
	//=== === === === === === === === === === === === === === === 초기 grid 초기화 === === === === === === === === === === === === === === ===
	
	//// EVENT ////
	$(".popup-btn").click(function() {
		var popDepth = $(this).attr('id').split('_').length;
		if(popDepth == '2'){
			
		}else if(popDepth == '3'){		// 팝업 안의 팝업
			var popName = $(this).attr('id').split('_')[0]+'_'+$(this).attr('id').split('_')[1];
			w = 500;
			h = 660;
			console.log(counselInsertPop);
			if(counselInsertPop.name != "" && counselInsertPop.name != null){
				counselInsertPop.focus();
				counselInsertPop.exitAlert(popName,w,h);
			}else {
				openUnPop(popName,w,h);
			}
		}
	});
	
	$(".btn").click(function() {
		var btnName = $(this).attr('id').split('_')[0];			// 버튼의 func 아이디를 가져옵니다.
		console.log(btnName);
		switch(btnName){
		case 'close': window.close(); break;					// 창 닫기
		}
	});
	
});

function openUnPop(popName,w,h){
	console.log(popName);
	counselInsertPop = window.open('pop_'+popName+'.html',popName,'width='+w+', height='+h+', toolbar=no, menubar=no, scrollbars=no, resizable=no');
};
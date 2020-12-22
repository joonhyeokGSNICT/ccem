
//=== GRID DEFINITION === //
var counselMain_studyProgressList_grid = null; 	// 상담메인 > 학습진행정보 grid
var counselMain_counselHist_grid = null;   		// 상담메인 > 상담이력 grid
var counselMain_studyTab_weeklyStat = null; 	// 상담메인 > 학습이력 > 주간학습현황 grid
var counselMain_studyTab_changeHist = null; 	// 상담메인 > 학습이력 > 변동이력 grid
var counselMain_studyTab_asignStuff = null; 	// 상담메인 > 학습이력 > 불출교재 grid
var counselMain_studyList_grid = null;  		// 상담메인	> 학습정보 grid
var counselMainTeacher_counselHist_grid = null; // 상담메인 선생님 > 상담이력 grid

var currentPop = { name : null };
var currentUnPop = { name : null };

var topBarClient = null;
var sideBarClient = null;
// TRIGGER
//sideBar client 받기
client.on("getSidebarClient", function(sideBarClient_d) {
	sideBarClient = sideBarClient_d;
});

$(function(){
	
	topBarClient = client;
	console.log(client);
	
	client.get('instances').then(function(instancesData) {
		var instances = instancesData.instances;
		console.log('client instances : ', instances);
		for ( var instanceGuid in instances) {
			if (instances[instanceGuid].location === 'ticket_sidebar') {
				//console.log('topbar instanceGuid : ', instanceGuid);
				sideBarClient =  client.instance(instanceGuid);
			}
		}
	});
	
	//// EVENT //// === === === === === === === === === === === === === === === === === === === 
	$("#goToTop").click(function(){
		$('.rightSideScroll').scrollTop(0);
	});
	
	// 탭 이동시 이벤트
	$("a[data-toggle='tab']").on("shown.bs.tab", function(e) {
		switch($(this).attr('id')){
		// 고객정보 - 고객, 선생님
		case 'customerTab':
			$("#assignMemberbtn").css("display","");
			$("#transferCallbtn").css("display","none");
			break;
		case 'teacherTab':
			$("#assignMemberbtn").css("display","none");
			$("#transferCallbtn").css("display","");
			break;
		// 고객찾기
		case 'customerSearch':
			customerSearchList_grid.refreshLayout();
			break;
		}
	});
	
	// 조회버튼 부
	$(".searchBtn").click(function(){
		var currentDiv = $(this).parent().attr("id");
		console.log(currentDiv);
		customerSearch(currentDiv);
	});
	
	$(".popup-btn").click(function() {
		var popDepth = $(this).attr('id').split('_').length;
		if(popDepth == '2'){
			var popName = $(this).attr('id').split('_')[0];
			w = 1154;
			h = 680;
			if(currentPop.name != "" && currentPop.name != null){
				currentPop.focus();
				//currentPop.exitAlert(popName,w,h);
			}else {
				openPop(popName,w,h);
			}
			openPop(popName,w,h);
		}else if(popDepth == '3'){		// 팝업 안의 팝업
			var popName = $(this).attr('id').split('_')[0]+'_'+$(this).attr('id').split('_')[1];
			w = 500;
			h = 660;
			console.log(currentUnPop);
			if(currentUnPop.name != "" && currentUnPop.name != null){
				currentUnPop.focus();
				currentUnPop.exitAlert(popName,w,h);
			}else {
				openUnPop(popName,w,h);
			}
		}
	});
	
});

/**
 * 고객,선생님 조회 func
 * @param String
 * @returns
 * 20-12-17 최준혁
 */
function customerSearch(currentDiv){
	switch(currentDiv){
	case 'custSearchDiv' : 
		var param = {
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{"CHK_NAME":"Y","CHK_TELNO":"Y", "NAME": "김소라" , "TELPNO2":"2557"}]
		};
		$.ajax({
		    url: API_SERVER + '/cns.getCustList.do',
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(param),
		    success: function (response) {
		        console.log(response);
		        if(response.errcode == "0"){
		        	customerSearchList_grid.resetData(response.recv1);
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
		break;
	case 'teacherSearchDiv' :
		var param = {
		    senddataids: ["send1"],
		    recvdataids: ["recv1"],
		    send1: [{"TCHR_NAME": "김소라"}]
		};
		$.ajax({
		    url: API_SERVER + '/cns.getTchrPdaInfo.do',
		    type: 'POST',
		    dataType: 'json',
		    contentType: "application/json",
		    data: JSON.stringify(param),
		    success: function (response) {
		        console.log(response);
		        if(response.errcode == "0"){
		        	teacherSearchList_grid.resetData(response.recv1);
		        }else {
		        	loading.out();
		        	client.invoke("notify", response.errmsg, "error", 60000);
		        }
		    }, error: function (response) {
		    }
		});
		break;
	}
}

function openPop(popName,w,h){
	console.log(popName);
	currentPop = window.open('pop_'+popName+'.html',popName,'width='+w+', height='+h+', toolbar=no, menubar=no, scrollbars=no, resizable=no');
};
function openUnPop(popName,w,h){
	console.log(popName);
	currentUnPop = window.open('pop_'+popName+'.html',popName,'width='+w+', height='+h+', toolbar=no, menubar=no, scrollbars=no, resizable=no');
};
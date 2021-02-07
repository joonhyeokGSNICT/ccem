var client = opener.topBarClient;
// const ZD_TYPE = 'SANDBOX';   // 샌드박스 반영 시 
const ZD_TYPE = 'OPS';   // 운영 반영시 'OPS'

const ZD = {
    SANDBOX : {
        formID : {
            counsel		: '',	// 상담양식

        },
        ticketfield : {
            field1		: '',	// 
            field2		: '',	// 
        },
        article_section : {
            notice : 900001503523   // pdi의 KC_APP 섹션
        },
        setting : {}
    },
    OPS : {
        formID : {
            counsel		: '',	// 상담양식

        },
        ticketfield : {
            field1		: '',	// 
            field2		: '',	// 
        }, 
        article_section : {
            notice : 360012577353   // pdi의 KC_APP 섹션
        },
        setting : {}
    }
}


// 구성원 리스트 grid 설정
boardGrid = new Grid({
    el: document.getElementById('boardGrid'),
    bodyHeight: 350,
    rowHeaders: [{ type: 'rowNum' }],
    columnOptions: { minWidth: 50, resizable: true, frozenCount: 0, frozenBorderWidth: 1, },
    pageOptions: {
        useClient: true,
        perPage: 5
    },
    columns: [
        {
            header: '작성자',
            name: 'author_name',
            width: 120,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
        {
            header: '제목',
            name: 'title',
            width: 120,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
        {
            header: '첨부자료',
            name: 'files',
            width: 100,
            align: "center",
            sortable: true,
            ellipsis: true,
        },
        {
            header: '작성일',
            name: 'updated_at',
            width: 140,
            align: "center",
            sortable: true,
            ellipsis: true,
        }
    ],
});
boardGrid.on('dblclick', (ev) => {
    console.log()
});


var app = {
    name : 'ccem',
    id : '900001439303',
    articleCount : 0,
    getList : function(){
        return new Promise(function (resolve, reject) {	
            client.request(`/api/v2/apps.json`).then(function(result) {
                resolve(result.apps.filter(data=>data.name == this.name)[0]);
            });
        });
    },
    update_installation : function(count){
        var options = {
            url : `/api/v2/apps/installations/${app.id}.json`,
            method : 'PUT',
            ContentType : 'application/json',
            data : {"settings": {"articleCount": count}}
        }
        client.request(options).then(function(result) {
            console.log('update_installation >>> ',result);
            ZD[ZD_TYPE]['setting']['articleCount'] = result.settings.articleCount;
            console.log('setting >>> ', ZD[ZD_TYPE]['setting']);
        });
    },
    get_installation : function(){
        return new Promise(function (resolve, reject) {	
            client.request(`/api/v2/apps/installations/${app.id}.json`).then(function(result) {
                resolve(result.settings);
            });
        });
    },
    get_articleCount : function(){
        return new Promise(function (resolve, reject) {	
            app.get_installation().then(function(data){
                console.log('get_articleCount() >>> ', data);
                resolve(data.articleCount);
            });
        });
    }
}

var getArticles = function () {
	return new Promise(function (resolve, reject) {	
		client.request(`/api/v2/help_center/sections/${ZD[ZD_TYPE]['article_section']['notice']}/articles`).then(function(result) {
            resolve(result.articles);
            for(item of result.articles) getUserName(item.author_id);

		});
	});
}

var getUserName = function (userId) {
    client.request(`/api/v2/users/${userId}.json`).then(function(result) {
        var arr = articles.list.filter(data=>data.author_id == result.user.id);
        for(index in arr){
            arr[index]['author_name'] = result.user.name;
            $(`td.${result.user.id}`).text(result.user.name);
        }
    });
}

var articles = {
    list : null,
    get : function(){
        console.log('articles.get() >>> ');
        getArticles().then(function(result){
            console.log(result);
            articles.list = result;
            
        });
    },
    set: function (page) {
        
    }
}

// 날짜형식 만들기
var formatDateTime = function(date){
    return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss');
}

$(function() {
    client.metadata().then(function(metadata) {
        console.log(metadata);
        ZD[ZD_TYPE]['setting'] = metadata.settings;
        articles.get();
        // 10분마다 아티클 재조회
        // var timer = setInterval(()=>articles.get(), 600000);
    });
});


//반응형
// #02 document ready function모음
$( document ).ready(function() {
	// #01_윈도우 크기에 따라 그리드 크기 조정
	$(window).resize(function() {
		_styleChanger.resizeWidth();
		_styleChanger.resizeHeight();
	});
});
// #03 _styleChanger : 화면 내 스타일 변경사항처리 JS
var _styleChanger = {
	// #03_01 그리드 가로 수정
	resizeWidth(){
		var widthSize = window.innerWidth - 24;
		if (window.innerWidth <= 600) {
			widthSize = 576;
        }
        boardGrid.setWidth(widthSize);
	},
	// #03_02 그리드 세로 수정
	resizeHeight(){
		var heightSize = window.innerHeight - 110;
		if (window.innerHeight <= 350) {
			heightSize = 240;
        }
		boardGrid.setHeight(heightSize);
	}
}
_styleChanger.resizeWidth();
_styleChanger.resizeHeight();
$('.tui-pagination.tui-grid-pagination').attr('style','margin-top:10px; margin-bottom:0px;');	// 그리드 페이징 높이 조절
$('.tui-grid-layer-state').attr('style','border-left: 1px solid #dddddd;display: block;top: 24px;height: 416px;left: 0px;right: 18px;');
/*****************************************************
 * API서버구분
 * - ops : 운영서버
 * - dev : 개발서버
*************************************************** */
const _ACTIVE = "dev";

/*****************************************************
 * 젠데스크구분
 * - ops : 운영젠데스크
 * - sandbox : 샌드박스
*************************************************** */
const _SPACE = "ops";
/*************************************************** */

/**
 * API 접속 정보
 */
const API_INFO = {
    ops: {
        url: "",
        recPlayer: "http://20.100.2.81/player/player.jsp",
    },
    dev: {
        url: "https://devccem.daekyo.co.kr",
        recPlayer: 'http://20.100.2.81/player/player.jsp'
    },
}

/**
 * 젠데스크 요소 정보
 */
const ZDK_INFO = {
    ops: {
        ticketForm: {

        },
        ticketField: {
            list_cust_id: "360055210094",   // 리스트ID_고객번호
        },
        userField: {

        },
        brand: {

        },
    },
    sandbox: {
        ticketForm: {

        },
        ticketField: {
            list_cust_id: "360055210114",   // 리스트ID_고객번호
        },
        userField: {

        },
        brand: {

        },
    },
}

const API_SERVER = API_INFO[_ACTIVE]["url"];
const REC_SERVER = API_INFO[_ACTIVE]["recPlayer"];
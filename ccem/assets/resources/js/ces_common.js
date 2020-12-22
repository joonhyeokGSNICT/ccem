/**
 * api 오류 체크
 * @param {object} response 
 * @param {object} settings 
 */
const checkApi = (response, settings) => {
	if (response.errcode != "0") {
		if(typeof client != 'undefined') {
			let errMsg = `서버에서 오류가 발생하였습니다.<br><br>오류코드 : ${response.errcode}<br>오류메시지 : ${response.errmsg}<br>호출서비스 : ${settings.url}`;
			client.invoke("notify", errMsg, "error", 60000);
		}
		else {
			let errMsg = `서버에서 오류가 발생하였습니다.\n\n오류코드 : ${response.errcode}\n오류메시지 : ${response.errmsg}\n호출서비스 : ${settings.url}`
			alert(errMsg);
		}
		return false;
	}
	return true;
}

/**
 * 날짜계산 함수
 * @param {string} type year, month, day
 * @param {number} num 
 */
const getDateFormat = (type, num) => {
    let date = new Date();
    if (typeof type == "string" && typeof num == "number") {
        if (type == "year") {
            date.setFullYear(date.getFullYear() + num);
        } else if (type == "month") {
            date.setMonth(date.getMonth() + num);
        } else if (type == "day") {
            date.setDate(date.getDate() + num);
        }
    }
    let y = date.getFullYear();
    let m = ("0" + (date.getMonth() + 1)).slice(-2);
    let d = ("0" + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
}

/**
 * 시간
 */
const getTimeFormat = () => {
	let today = new Date();   
	let h = ("0"+today.getHours()).slice(-2); 
	let m = ("0" + today.getMinutes()).slice(-2);
	let s = ("0" + today.getSeconds()).slice(-2);
	return `${h}:${m}:${s}`;
}
/**
 * TOAST UI Grid Settings
 */
const GridSettings = {
    language: {
        localeCode: "ko",   // en, ko
        data: {
            display: { 
                noData: "검색 결과가 없습니다.", 
            },
        }
    },
    theme: {
        presetName: "clean", // default, striped, clean
        extOptions: {
	        outline: {
	            border: 'rgb(205,205,205)',
	            showVerticalBorder: true,
	        },
	        selection: {
	            background: 'white',
	            border: '#bbbbbb',
	        },
	        scrollbar: {
	            border: 'rgb(205,205,205)',
	            background: 'rgb(238,238,238)',
	            emptySpace: 'rgb(238,238,238)',
	            thumb: 'white',
	        },
	        frozenBorder: {
	            border: '#bbbbbb',
	        },
	        area: {
	            header: {
	                background: '#f1f5ff',
	                border: '#bbbbbb',
	            },
	            body: {
                    background: 'white',
                },
	        },
	        row: {
	            hover: {
	                background: 'rgb(205,205,205)',
	            },
	            dummy: {
	                background: 'rgb(238,238,238)',
	            },
	        },
	        cell: {
	            normal: {
	                border: '#bbbbbb',
	                text: 'black',
	                showVerticalBorder: true,
	                showHorizontalBorder: true,
	            },
	            header: {
	                background: '#f1f5ff',
	                border: '#bbbbbb',
	                text: 'black',
	                showVerticalBorder: true,
	                showHorizontalBorder: true,
	            },
	            selectedHeader: {
	                background: 'rgb(238,238,238)',
	            },
	            rowHeader: {
	                background: '#f1f5ff',
	                border: '#bbbbbb',
	                text: 'black',
	                showVerticalBorder: true,
	                showHorizontalBorder: true,
	            },
	            selectedRowHeader: {
	                background: 'rgb(238,238,238)',
	            },
	            focused: {
	                border: "#bbbbbb",
	            },
	        },
	    },
    },
    defaultOptions: {
        header: { 
            height: 23,
        },
        minRowHeight: 30,
        rowHeight: 30,
        minBodyHeight: 48,
        bodyHeight: 500,
        width: "auto",
        heightResizable: false,
        usageStatistics: false,
        scrollX: true,
        scrollY: true,
        copyOptions: {
            useFormattedValue: true,
        },
        columnOptions: {
            minWidth: 50,
            resizable: true,
        },
    },
}

/**
 * Customizing TOAST UI Grid
 * https://nhn.github.io/tui.grid/latest/Grid
 */
class Grid extends tui.Grid {
    #selectedRowKey;
    constructor(props) {
        const options = { ...GridSettings.defaultOptions, ...props };
        super(options);
        this.#selectedRowKey = 0;
    }
    /**
    * Add style when selecting row
    * @param {object} ev 
    */
    addSelection(ev = {}) {
        if (ev.targetType != "cell" && ev.targetType != "rowHeader") return;
        this.removeRowClassName(this.#selectedRowKey, "cell-selection");
        this.addRowClassName(ev.rowKey, "cell-selection");
        this.#selectedRowKey = ev.rowKey;
    }
    /**
     * Sort by clicking column header
     * @param {object} ev 
     */
    clickSort(ev = {}) {
        if (ev.targetType != "columnHeader") return;
        if (!ev.nativeEvent.target.className.includes("tui-grid-cell-header")) return;
        let sortingBtn = ev.nativeEvent.target.children[0];
        if (!sortingBtn || !sortingBtn.className.includes("tui-grid-btn-sorting")) return;
        sortingBtn.click();
    }
    /**
     * Check by clicking row
     * @param {object} ev 
     * @param {boolean} onlyOne 
     */
    clickCheck(ev = {}, onlyOne = false) {
        if (ev.targetType != "cell" && ev.targetType != "rowHeader") return;
        let rowData = this.getRow(ev.rowKey);
        let checked = rowData._attributes.checked;
        if (onlyOne) this.uncheckAll();
        if (checked) this.uncheck(ev.rowKey);
        else this.check(ev.rowKey)
    }
    /**
     * @param {number} rowCount 
     */
    resetDummyData(rowCount = 0) {
        const rows = [];
        const columns = this.getColumns();
        for (let i = 0; i < rowCount; i++) {
            const row = {};
            columns.forEach(col => {
                row[col.name] = (Math.random() * 10000000000).toFixed();
            });
            rows.push(row);
        }
        this.resetData(rows);
    }
}

/**
 * https://nhn.github.io/tui.grid/latest/Grid#applyTheme
 */
Grid.applyTheme(GridSettings.theme.presetName, GridSettings.theme.extOptions); 

/**
 * https://nhn.github.io/tui.grid/latest/Grid#setLanguage
 */
Grid.setLanguage(GridSettings.language.localeCode, GridSettings.language.data);


const FormatUtil = {
    /**
     * 전화번호 포맷 : XXX-XXXX-XXXX | 02-XXXX-XXXX
     * @param {string} str : 원 문자열
     */
    tel: function (str) {
        if(str) {
            return str.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
        }else {
            return str;
        }
    },
    /**
     * 사업자등록번호 포맷 : XXX-XX-XXXXX
     * @param {string} str : 원 문자열
     * @param {boolean} mask : 마스킹처리 여부
     */
    bizno: function(str, mask) {
        var formatNum = '';

        if (str && str.length == 10) {
           try {
              if (mask) {
                 formatNum = str.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-*****');
              } else {
                 formatNum = str.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
              }
           } catch (e) {
              formatNum = str;
            //   console.debug("bizNoFormatter error: ", e);
           }
        } else {
           formatNum = str;
           // console.debug("bizNoFormatter error: ", "사업자등록번호 형식이 아닙니다.");
        }
     
        return formatNum;
    },
    /**
     * 날짜 포맷 : yyyy-dd-mm
     * @param {string} str 
     */
    date: function(str) {
        let result = "";
        if(typeof str == "object") {        /** [Obejct Date] */
            result = str.getFullYear() + "-" + ("0"+(str.getMonth()+1)).slice(-2) + "-" + ("0"+str.getDate()).slice(-2);
        }else if(typeof str == "string") {
            if(str.length == 8) {
                result = str.substr(0,4) + "-" + str.substr(4,2) + "-" + str.substr(6,2);
            }else if(str.length == 6){
                result = str.substr(0,2) + "-" + str.substr(2,2) + "-" + str.substr(4,2);
            }else {
                result = str;
            }
        }else {
            result = str;
        }
        return result;
    },
}

/**
 * grid 데이터 상세 INSERT
 * @param {object} ev 이벤트정보
 * @param {object} rowData 선택 행 데이터
 */
function insertDetail(ev, rowData){
	var detailTableId = ev.instance.el.id.replace("grid","detail");
	var headerArr = ev.instance.getColumns();
	for(dataObj of headerArr){
		if($("#"+detailTableId).find("th:contains("+dataObj.header+")").next().children().length != 0){
			if($("#"+detailTableId).find("th:contains("+dataObj.header+")").next().children().eq(0)[0].localName == "textarea" || $("#"+detailTableId).find("th:contains("+dataObj.header+")").next().children().eq(0)[0].localName == "input"){
				$("#"+detailTableId).find("th:contains("+dataObj.header+")").next().children().eq(0).val(rowData[dataObj.name]);
			}else {
				$("#"+detailTableId).find("th:contains("+dataObj.header+")").next().children().eq(0).text(rowData[dataObj.name]);
			}
		}else {
			$("#"+detailTableId).find("th:contains("+dataObj.header+")").next().text(rowData[dataObj.name]);
		}
	}
}

//오늘 날짜 구하는 function
function getToday(year,month,day) {
	var date = new Date();
	return date.getFullYear()+ year + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" + ("0"+date.getDate()).slice(-2);
}

//날짜 월로 증감
function addMonth(date, month) {
	  // month달 후의 1일
	  let addMonthFirstDate = new Date(
	    date.getFullYear(),
	    date.getMonth() + month,
	    1
	  );

	  // month달 후의 말일
	  let addMonthLastDate = new Date(
	    addMonthFirstDate.getFullYear(),
	    addMonthFirstDate.getMonth() + 1
	    , 0
	  );

	  let result = addMonthFirstDate;
	  if(date.getDate() > addMonthLastDate.getDate())
	  {
	    result.setDate(addMonthLastDate.getDate());
	  }
	  else
	  {
	    result.setDate(date.getDate());
	  }

	  return result;
}

// 날짜포맷 설정
function dateFormatWithBar(date) {
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var output = date.getFullYear() +"-"+ (month < 10 ? '0' : '') + month +"-"+ (day < 10 ? '0' : '') + day;
	return output;
}

/**
 * 팝업용 경고 function
 * @param id
 * @returns
 */

function exitAlert(id,w,h){
	var alert = confirm('새로운 창을 열면 현재 창이 닫히게 됩니다. 진행 하시겠습니까?');
	if(alert){
		window.close();
		if(id.split('_').length == '2'){
			opener.openUnPop(id,w,h);
		}else {
			opener.openPop(id,w,h);
		}
	}
};

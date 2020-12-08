var counselListPop = { name:null };
var counselInsertPop = { name:null };
/*
const GRID_PRPRT = {
    header: { height: 23 },
    rowHeight: 30,
    minBodyHeight: 48,
    theme: {
        outline: {
            border: 'rgb(205,205,205)',
            showVerticalBorder: true
        },
        selection: {
            background: 'white',
            border: '#bbbbbb'
        },
        scrollbar: {
            border: 'rgb(205,205,205)',
            background: 'rgb(238,238,238)',
            emptySpace: 'rgb(238,238,238)',
            thumb: 'white',
            // active: 'red',
        },
        frozenBorder: {
            border: '#bbbbbb'
        },
        area: {
            header: {
                background: '#f1f5ff',
                border: '#bbbbbb'
            },
            body: {background: 'white'}
        },
        row: {
            hover: {
                background: 'rgb(205,205,205)'
            },
            dummy: {
                background: 'rgb(238,238,238)'
            }
        },
        cell: {
            normal: {
                border: '#bbbbbb',
                text: 'black',
                showVerticalBorder: true,
                showHorizontalBorder: true
            },
            header: {
                background: '#fff8f8',
                border: '#bbbbbb',
                text: 'black',
                showVerticalBorder: true,
                showHorizontalBorder: true
            },
            selectedHeader: {
                background: 'rgb(238,238,238)'
            },
            rowHeader: {
                background: '#ffdee1',
                border: '#bbbbbb',
                text: 'black',
                showVerticalBorder: true,
                showHorizontalBorder: true
            },
            selectedRowHeader: {
                background: 'rgb(238,238,238)'
            },
            focused: {
                border: "#bbbbbb"
            }
        }
    },
};
*/
const GRID_PRPRT = {
	    header: { height: 23 },
	    rowHeight: 30,
	    minBodyHeight: 48,
	    theme: {
	        outline: {
	            border: 'rgb(205,205,205)',
	            showVerticalBorder: true
	        },
	        selection: {
	            background: 'white',
	            border: '#bbbbbb'
	        },
	        scrollbar: {
	            border: 'rgb(205,205,205)',
	            background: 'rgb(238,238,238)',
	            emptySpace: 'rgb(238,238,238)',
	            thumb: 'white',
	            // active: 'red',
	        },
	        frozenBorder: {
	            border: '#bbbbbb'
	        },
	        area: {
	            header: {
	                background: '#f1f5ff',
	                border: '#bbbbbb'
	            },
	            body: {background: 'white'}
	        },
	        row: {
	            hover: {
	                background: 'rgb(205,205,205)'
	            },
	            dummy: {
	                background: 'rgb(238,238,238)'
	            }
	        },
	        cell: {
	            normal: {
	                border: '#bbbbbb',
	                text: 'black',
	                showVerticalBorder: true,
	                showHorizontalBorder: true
	            },
	            header: {
	                background: '#f1f5ff',
	                border: '#bbbbbb',
	                text: 'black',
	                showVerticalBorder: true,
	                showHorizontalBorder: true
	            },
	            selectedHeader: {
	                background: 'rgb(238,238,238)'
	            },
	            rowHeader: {
	                background: '#f1f5ff',
	                border: '#bbbbbb',
	                text: 'black',
	                showVerticalBorder: true,
	                showHorizontalBorder: true
	            },
	            selectedRowHeader: {
	                background: 'rgb(238,238,238)'
	            },
	            focused: {
	                border: "#bbbbbb"
	            }
	        }
	    },
	};

const Grid = (typeof tui == 'undefined') ? null :
                (typeof tui.Grid == 'undefined') ? null : tui.Grid;

const USEROBJECT = {
		id : "",
		team : ""
}

if (Grid) {
    // TOAST Grid 테마설정
    // Grid.applyTheme('default');
    // Grid.applyTheme('default');
    // Grid.applyTheme('striped');
    Grid.applyTheme('clean', GRID_PRPRT.theme);

    // TOAST Grid 언어설정
    Grid.setLanguage('ko', { display: { noData: '검색 결과가 없습니다.', }, }); 
}

var GridUtil = {
    /**
     * selected row 스타일 추가
     * @param {tui.Grid} grid TOAST 그리드
     * @param {object} ev 이벤트정보
     */
    selection(grid, ev) {
        if(ev["targetType"] == "cell" || ev["targetType"] == "rowHeader") {
            if (typeof grid == "object" && typeof ev.rowKey == "number") {
               grid.getData().forEach(row => {
                  grid.removeRowClassName(row.rowKey, "cell-selection");
               });
               grid.addRowClassName(ev.rowKey, "cell-selection");
      
            }
        }
    },
    /**
     * row checkbox 체크
     * @param {tui.Grid} grid TOAST 그리드
     * @param {object} ev 이벤트정보
     */
    check(grid, ev) {
        if(ev["targetType"] == "cell" || ev["targetType"] == "rowHeader") {
            if (typeof grid == "object" && typeof ev.rowKey == "number") {
                var rowData = grid.getRow(ev.rowKey);
                var checked = rowData["_attributes"]["checked"];
                if (checked) {
                   grid.uncheck(ev.rowKey);
                } else {
                   grid.check(ev.rowKey);
                }
             }
        }
    },
    /**
     * row checkbox 체크 한개만
     * @param {tui.Grid} grid TOAST 그리드
     * @param {object} ev 이벤트정보
     */
    checkOne(grid, ev) {
        if(ev["targetType"] == "cell" || ev["targetType"] == "rowHeader") {
            if (typeof grid == "object" && typeof ev.rowKey == "number") {
                var rowData = grid.getRow(ev.rowKey);
                var checked = rowData["_attributes"]["checked"];
                if (checked) {
                     grid.uncheck(ev.rowKey);
                } else {
                     grid.uncheckAll();
                     grid.check(ev.rowKey);
                }
             }
        }
     },
    /**
     * header 클릭시 sort
     * @param {tui.Grid} grid TOAST 그리드
     * @param {object} ev 이벤트정보
     */
    sortByHeader(grid, ev) {
        if(ev["targetType"] == "columnHeader") {
            if (typeof grid == "object" && ev["targetType"] == "columnHeader") {
               var columnName = ev["columnName"];
               var sortState = grid.getSortState();
               var currentRowSortState = sortState.columns.find(obj => obj.columnName == columnName);
      
               if (typeof currentRowSortState == "undefined") {
                 grid.sort(columnName, true, false);
               } else {
                  if (currentRowSortState.ascending) {
                     grid.sort(columnName, false, false);
                  } else {
                     grid.unsort(columnName);
                  }
               }
      
            }
        }
    },
    /**
     * 특정 컬럼을 조건에 따라 마스킹처리한다.
     * - 조회 건수가 2건 이상일때 고객명, 고객Email, 고객ID 마스킹처리.
     * - 고객명은 법인일 경우 마스킹 안함.
     * - 참조 : 안랩_조회앱화면설계_20201004.pptx 4page
     * @param {object} grid - TOAST UI Grid 
     * @param {object} obj - formatter argument
     * @param {string} typ
     * @param {boolean} chkB2B - 법인 체크여부
     */
    customMask(grid, obj, type, chkB2B) {
        let value = obj.value || "";
        if (grid.getRowCount() >= 2) {
            if (chkB2B) {
                let custTypeCd = obj.row.custTypeCd;
                if (!custTypeCd || custTypeCd == CUST_TYPE_CD.prsn.cd) {
                    value = FormatUtil.masking(value, type);
                }
            } else {
                value = FormatUtil.masking(value, type);
            }
        }
        return value;
    },
 }

var FormatUtil = {
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
    /**
     * 부분마스킹 : ab***
     * @param {string} value : 원 문자열
     * @param {string} type : 마스킹 타입
     */
    masking: function(value, type) {
        let result = "";
        switch (type) {
            case "name":
                if(value) {
                    if(value.length == 1) {
                        result = "*";
                    }else if(value.length == 2) {
                        result = value[0] + "*";
                    }else if(value.length >= 3) {
                        result = value[0] + StringUtil.rpad("", value.length-2, "*") + value[value.length-1];
                    }else {
                        result = value;
                    }
                }
                break;
            case "mail":
                if(value) {
                    let arr1 = value.split("@");
                    if(arr1.length == 2) {
                        let arr2 = arr1[1].split(".");
                        if(arr2.length >= 2) {
                            result = FormatUtil.masking(arr1[0], "id") + "@" + FormatUtil.masking(arr2[0], "id") + "." + arr2.slice(1).join(".");
                        }else {
                            result = value;
                        }
                    }else {
                        result = value;
                    }
                }
                break;
            case "id":
                if(value) {
                    if(value.length == 1) {
                        result = "*";
                    }else if(value.length == 2) {
                        result = value[0] + "*";
                    }else if(value.length >= 3) {
                        result = StringUtil.rpad(value.substr(0,2), value.length, "*");
                    }else {
                        result = value;
                    }
                }
                break;
            case "tel":
                if(value) {
                    if(value.length == 1) {
                        result = "*";
                    }else if(value.length == 2) {
                        result = value[0] + "*";
                    }else if(value.length >= 3) {
                    	var tempArr = value.split("-");
                        result = StringUtil.rpad(value.substr(0,(tempArr[0].length+1)+tempArr[1].length+1), value.length, "*");
                    }else {
                        result = value;
                    }
                }
                break;
            default:
                result = value;
                break;
        }
        return result;
    },
}

var StringUtil = {
    /**
     * 좌측문자열채우기
     * @params
     *  - str : 원 문자열
     *  - padLen : 최대 채우고자 하는 길이
     *  - padStr : 채우고자하는 문자(char)
     */
    lpad: function (str, padLen, padStr) {
        if (typeof padLen != "number" || padStr.length > padLen) {
            return str;
        }
        str += ""; // 문자로
        padStr += ""; // 문자로
        while (str.length < padLen)
            str = padStr + str;
        str = str.length >= padLen ? str.substring(0, padLen) : str;
        return str;
    },
    /**
    * 우측문자열채우기
    * @params
    *  - str : 원 문자열
    *  - padLen : 최대 채우고자 하는 길이
    *  - padStr : 채우고자하는 문자(char)
    */
    rpad: function (str, padLen, padStr) {
        if (typeof padLen != "number" || padStr.length > padLen) {
            return str + "";
        }
        str += ""; // 문자로
        padStr += ""; // 문자로
        while (str.length < padLen)
            str += padStr;
        str = str.length >= padLen ? str.substring(0, padLen) : str;
        return str;
    },
}

class CustomColumn {
	constructor(props) {
        const el = document.createElement('div');
        el.className = props.className || "tui-grid-cell-content";
        el.style.textOverflow = props.columnInfo.ellipsis ? "ellipsis":"";
        this.el = el;
        this.render(props);
    }

    getElement() {
        return this.el;
    }

    render(props) {
        let value = props.formattedValue;
        this.el.innerHTML = value;  // 화면에 표시.
        this.el.title = value;      // 마우스 갖다대면 말풍선으로 전체 텍스트 표시.
    }
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


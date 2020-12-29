var loading;

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
                summary: {
                    background: '#f1f5ff',
                    border: '#bbbbbb',
                    text: 'black',
                    showVerticalBorder: true,
                    showHorizontalBorder: true,
                },
	        },
	    },
    },
    defaultOptions: {
        header: { 
            height: 23,
        },
        minRowHeight: 28,
        rowHeight: 28,
        minBodyHeight: 50,
        bodyHeight: 100,
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
 * customRenderer
 * @param {object}
 */
class CustomRenderer {
  constructor(props) {
    const el = document.createElement('div');
    el.style.fontSize = '11px';
    el.style.padding = '0';

    this.el = el;
    console.log(el);
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    this.el.innerHTML = String(props.value);
  }
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
        if (typeof ev.rowKey != "number") return;
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
        this.removeRowClassName(this.#selectedRowKey, "cell-selection");
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
        if (typeof ev.rowKey != "number") return;
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
    /**
     * @param {string} fileName 
     */
    exportExcel(fileName) {
        fileName = `${fileName || "excel"}.xls`;
        const gridData = this.getData();
        const gridColumns = this.getColumns();
        let tableStr = "";

        //헤더
        tableStr += "<thead><tr>";
        for (let col of gridColumns) {
            if (col["hidden"] == false) {
                tableStr += `<th>${col["header"]}</th>`;
            }
        }
        tableStr += "</tr></thead>";

        //내용
        tableStr += "<tbody>";
        for (let gridRow of gridData) {
            tableStr += "<tr>";
            for (let col of gridColumns) {
                if (col["hidden"] == false) {
                    tableStr += `<td style="mso-number-format:'\@'">${gridRow[col["name"]]}</td>`;
                }
            }
            tableStr += "</tr>";
        }
        tableStr += "</tbody>";

        const tableEl = $("<table></table>").html(tableStr);
        tableEl.find('input').each((index, elem) => $(elem).remove());

        tableToExcel(tableEl, fileName);
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
     * @param {Date | string} str 
     */
    date(str) {

        /** Date */
        if (typeof str == "object" && !isNaN(str.getTime())) {
            y = str.getFullYear();
            m = ("0" + (str.getMonth() + 1)).slice(-2);
            d = ("0" + str.getDate()).slice(-2);
            return `${y}-${m}-${d}`;
        }

        /** string */
        if (typeof str == "string") {                    
            if (str.length == 8) {
                return `${str.substr(0, 4)}-${str.substr(4, 2)}-${str.substr(6, 2)}`;
            }
            if (str.length == 6) {
                return `${str.substr(0, 2)}-${str.substr(2, 2)}-${str.substr(4, 2)}`;
            }
        }
        
        return str;
    },
    /**
     * 시간 포맷 : yyyy-dd-mm
     * @param {string} str 
     */
    time(str) {
        if(typeof str == "string" && str.length == 6) {
            return `${str.substr(0, 2)}:${str.substr(2, 2)}:${str.substr(4, 2)}`;
        }
        return str
    },
}

const calendarUtil = {
    imasks: {},
    calendarOption: {
        autoUpdateInput: false,
        autoApply: true,
        showDropdowns: true,
        minYear: 1900,
        maxYear: 2100,
        singleDatePicker: true,
        opens: "right", // left, center, right
        drops: "down",  // down, up
        locale: {
            format: "YYYY-MM-DD",
            daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
            monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
        }
    },
    timeOption: {
        placeholder: "__:__:__", 
        insertMode: false, 
        showMaskOnHover: false,
        hourFormat: "24"
    },
    /**
     * @param {string} id element id
     * @param {object} newOption
     */
    init(id, newOption, applyCallBack, cancelCallBack) {
        let option = { ...calendarUtil.calendarOption, ...newOption };
        $("#" + id).daterangepicker(option);
        let imask = calendarUtil.dateMask(id);

        $("#" + id).on("apply.daterangepicker", (ev, picker) => {
            $("#" + id).val(picker.startDate.format("YYYY-MM-DD"));
            imask.updateValue();
            if (applyCallBack) applyCallBack();
        });

        $("#" + id).on("cancel.daterangepicker", (ev, picker) => {
            $("#" + id).val("____-__-__");
            imask.updateValue();
            if (cancelCallBack) cancelCallBack();
        });
    },
    /**
     * date mask : YYYY-MM-DD
     * @param {string} id element id
     */
    dateMask(id) {
        let imask = IMask(document.getElementById(id), {
            mask: Date,  // enable date mask

            // other options are optional
            pattern: 'Y-`m-`d',  // Pattern mask with defined blocks, default is 'd{.}`m{.}`Y'
            // you can provide your own blocks definitions, default blocks for date mask are:
            blocks: {
                d: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 31,
                    maxLength: 2,
                },
                m: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12,
                    maxLength: 2,
                },
                Y: {
                    mask: IMask.MaskedRange,
                    from: 1900,
                    to: 2100,
                }
            },
            // define date -> str convertion
            format(date) {
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();

                if (day < 10) day = "0" + day;
                if (month < 10) month = "0" + month;

                return [year, month, day].join('-');
            },
            // define str -> date convertion
            parse(str) {
                let yearMonthDay = str.split('-');
                return new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2]);
            },

            // optional interval options
            min: new Date(100, 01, 01),  // defaults to `1900-01-01`
            max: new Date(2100, 12, 31),  // defaults to `9999-01-01`

            autofix: true,  // defaults to `false`

            // also Pattern options can be set(____-__-__)
            lazy: false,

            // and other common options
            overwrite: true  // defaults to `false`
        });
        calendarUtil.imasks[id] = imask;
        return imask;
    },
    /**
     * month mask : YYYY-MM
     * @param {string} id element id
     */
    monthMask(id) {
        let imask = IMask(document.getElementById(id), {
            mask: Date,  // enable date mask

            // other options are optional
            pattern: 'Y-`m',  // Pattern mask with defined blocks, default is 'd{.}`m{.}`Y'
            // you can provide your own blocks definitions, default blocks for date mask are:
            blocks: {
                m: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12,
                    maxLength: 2,
                },
                Y: {
                    mask: IMask.MaskedRange,
                    from: 1900,
                    to: 2100,
                }
            },
            // define date -> str convertion
            format(date) {
                let month = date.getMonth() + 1;
                let year = date.getFullYear();

                if (month < 10) month = "0" + month;

                return [year, month].join('-');
            },
            // define str -> date convertion
            parse(str) {
                let yearMonthDay = str.split('-');
                return new Date(yearMonthDay[0], yearMonthDay[1] - 1, 1);
            },

            // optional interval options
            min: new Date(100, 01, 01),  // defaults to `1900-01-01`
            max: new Date(2100, 12, 31),  // defaults to `9999-01-01`

            autofix: true,  // defaults to `false`

            // also Pattern options can be set(____-__-__)
            lazy: false,

            // and other common options
            overwrite: true  // defaults to `false`
        });
        calendarUtil.imasks[id] = imask;
        return imask;
    },
    /**
     * time mask : hh:mm:ss
     * @param {string} id element id
     * @param {string} format 
     * @param {object} newOption 
     */
    timeMask(id, format, newOption) {
        $("#" + id).inputmask(format || "hh:mm:ss", {...calendarUtil.timeOption, newOption});
    },
    /**
     * 외부에서 imask 변경시 updateValue() 호출.
     * @param {string} id 
     */
    updateImask(id) {
        if (id) {
            calendarUtil.imasks[id].updateValue();
        } else {
            for (let id in calendarUtil.imasks) {
                calendarUtil.imasks[id].updateValue();
            }
        }
    },
    /**
     * @param {string} id 
     * @param {string} value 
     */
    setImaskValue(id, value) {
        calendarUtil.imasks[id].value = value;
    }
}

const PopupUtil = {
    pops: {},
    open(name, width, height, hash) {
        if(this.pops[name] && this.pops[name].name) {
            this.pops[name].focus();
        }else {
            this.pops[name] = window.open(`pop_${name}.html${hash||""}`, name, `width=${width}, height=${height}`);
        }
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

// Global Ajax Event Handlers
$(this).ajaxStart(function () {
	loading = new Loading({
		title: 					'데이터를 불러오는 중입니다.',
		titleColor: 			'gray',
		discription: 			'Loading...',
		discriptionColor: 		'rgb(77, 150, 223)',
		animationOriginColor: 	'#123f8a',
		mask: 					true,
		loadingPadding: 		'20px 20px',
		loadingBgColor: 		'rgb(255 255 255)',
		animationOut: false,
		animationDuration: 20,
    	defaultApply: 	true,
	});
});

 $(this).ajaxStop(function () {
	 loading.out();
});

$(this).ajaxError((event, jqxhr, settings, thrownError) => {
    let statusText = jqxhr.statusText;
    let url = settings.url;
    let errMsg = "";

    if(statusText === "timeout") errMsg = "API서버 통신이 원활하지 않습니다. 잠시 후에 다시 시도해 주세요.";
    else errMsg = "API서버에 연결할 수 없습니다. 사용자 네트워크 연결이 불안정 하거나, 방화벽 등에 의해 API사용이 차단된 환경일 수 있습니다. 이 오류가 반복되면 네트워크 관리자에게 문의하세요.";
    
    if(typeof client != "undefined") client.invoke("notify", `${errMsg}<br><br>${url}`, "error", 60000);
    else alert(`${errMsg}\n\n${url}`);
});
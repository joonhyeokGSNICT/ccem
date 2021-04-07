/**
 * orgGrid : 구성원 그리드 및 Tree구조 설정
 */

// 구성원 리스트 grid 설정
function setGridTree() {
    employeeListGrid = new Grid({
        el: document.getElementById('employeeListGrid'),
        bodyHeight: 243,
        rowHeaders: _modeSelect[_mode].rowHeaders,
        columnOptions: { minWidth: 50, resizable: true, frozenCount: 1, frozenBorderWidth: 1, },
        columns: [
            {
                header: '성명',
                name: 'NAME',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '본부',
                name: 'UP_DEPT_NAME',
                width: 120,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사업국',
                name: 'PARE_DEPT_NAME',
                width: 120,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '센터',
                name: 'DEPT_NAME',
                width: 120,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '사번',
                name: 'EMP_ID',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '핸드폰번호',
                name: 'MOBILNO',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                // formatter: function(data){
                //     // console.log(data);
                //     var text = ``;
                //     if( data.value != null ) text += `<a href="#">`+data.value+`</a>`;
                //     return text;
                // }
            },
            {
                header: '교사구분',
                name: 'TCHR_MK_NAME',
                width: 150,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '직책',
                name: 'DUTY_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '직급',
                name: 'RANK_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '재직구분',
                name: 'STS_NAME',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
            },
            {
                header: '본부_ID',
                name: 'UP_DEPT_ID',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                hidden : true
            },
            {
                header: '사업국_ID',
                name: 'PARE_DEPT_ID',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                hidden : true
            },
            {
                header: '사업국_ID',
                name: 'DEPT_ID',
                width: 100,
                align: "center",
                sortable: true,
                ellipsis: true,
                hidden : true
            },
            {
                header: '앱연계',
                name: 'ZEN_USE_YN',
                width: 80,
                align: "center",
                sortable: true,
                ellipsis: true
            },
        ],
    });
    employeeListGrid.on('click', (ev) => {
        if (ev.columnName != 'MOBILNO') {
            employeeListGrid.addSelection(ev);
            employeeListGrid.clickSort(ev);
            employeeListGrid.clickCheck(ev);
        } 
        /* 전화번호를 더블클릭 할 경우 전화번호 wiseNtalk 호출 */
        else if (ev.columnName == 'MOBILNO') {
            var sendData = employeeListGrid.getRow(ev.rowKey);
            console.log("callme!", sendData.MOBILNO);
            // PopupUtilboard.open("CCEMPRO063_1", 900, 600, "", sendData);
        }
    });

    // 트리구조 설정, 
    $("#tree").fancytree({
        extensions: ["filter"],
        filter: {
            autoApply: true,            // Re-apply last filter if lazy data is loaded
            autoExpand: true,           // Expand all branches that contain matches while filtered
            counter: false,             // Show a badge with number of matching child nodes near parent icons
            fuzzy: true,                // Match single characters in order, e.g. 'fb' will match 'FooBar'
            hideExpandedCounter: true,  // Hide counter badge if parent is expanded
            hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
            highlight: false,           // Highlight matches by wrapping inside <mark> tags
            leavesOnly: false,          // Match end nodes only
            nodata: true,               // Display a 'no data' status node if result is empty
            mode: "hide"                // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
        },
        checkbox: _modeSelect[_mode].treeCheckBox,
        focusOnSelect: false,
        clickFolderMode: 1,
        selectMode: 3,
        click: function(event, data) {
            // if ( data.targetType == 'title') {}
            // console.log("test1");
            // console.log(data);
        },

        // plainTreeSelOrg 모드에서 더블클릭 시 선택
        dblclick: function (event, data) {
            switch (_mode){
                case "plainTreeSelOrg" : 
                    data.node.setSelected(true);
                    _btn.selectedList();
                    break;
            }
        },

        // 본부/사업국/센터 설정 시 해당 정보 표시
        focus: function(event, data) {
            // $("#statusLine").text(event.type + ": " + data.node);
            _selectedNode = data.node;
            console.log("targetType=" + data.targetType);
            console.log("_selectedNode >> ", _selectedNode)
            // console.log("data.node >> ", data.node)
    
            // 본부/사업국/센터 정보창 변경
            // 재직구분 확인
            
                var param = [{}];
                if ( $('#searchEmp_chk').prop("checked")==true && !isEmpty($('#searchEmp_selectbox').val()) ) {
                    // SEARCH_STS_CDE_TXT : 0:퇴직, 1:휴직, 2:대기, 3:사업, 4:해지, 9:재직
                    if ($('#searchEmp_selectbox').val()=="전체") {
                    } else if ($('#searchEmp_selectbox').val()=="재직") {
                        param[0].SEARCH_STS_CDE_TXT = ["9", "2", "1"];
                        param[0].SEARCH_STS_CDE = "Y"
                    } else if ($('#searchEmp_selectbox').val()=="사업") {
                        param[0].SEARCH_STS_CDE_TXT = ["3"];
                        param[0].SEARCH_STS_CDE = "Y"
                    } else if ($('#searchEmp_selectbox').val()=="해지/퇴직") {
                        param[0].SEARCH_STS_CDE_TXT = ["4", "0"];
                        param[0].SEARCH_STS_CDE = "Y"
                    }	
                } 
        
                // 선택 후 조직 내 구성원 조회
                if (data.node.data.LV == "1"){
                    $("#HQ_NAME").text(data.node.title);
                    $("#DEPT_NAME").text("");
                    $("#LC_NAME").text("");
                    $("#HQ_NAME2").text(data.node.title);
                    $("#DEPT_NAME2").text("");
                    $("#LC_NAME2").text("");
        
                    // 본부내 인원 검색
                    switch (_mode){
                        case "search" :
                            if (_isEmpSearch) {
                                _sortList.selTreeEmpList(data.node.title);
                            } else {
                                param[0].SEARCH_DEPT_ID = "Y";
                                param[0].SEARCH_DEPT_ID_TXT = data.node.data.DEPT_ID;
                                _getList.employeeList(param);
                            }
                            break;
    
                        case "plainTree" : 
                            if (_isEmpSearch) {
                                _sortList.selTreeEmpList(data.node.title);
                            } else {
                                param[0].SEARCH_DEPT_ID = "Y";
                                param[0].SEARCH_DEPT_ID_TXT = data.node.data.DEPT_ID;
                                _getList.employeeList(param);
                            }
                            if (hash ==="#disPlayDn") $("#counselSend_btn").removeClass('invisible');
                            else if ( opener.name == 'CCEMPRO028' ) $("#counselSend_btn").removeClass('invisible');
                            else $("#counselSend_btn").addClass('invisible');
                            $("#counselSave_btn").addClass('invisible');
                            break;
    
                        case "plainTreeSelOrg" : 
                            // $("#counselSend_btn").addClass('invisible');
                            // $("#counselSave_btn").addClass('invisible');
                            break;
                    }
                    
                    
                } else if(data.node.data.LV == "2"){
                    // 1레벨이 CEO인 경우
                    if ( data.node.parent.data.DEPT_ID == "T000" ) {
                        $("#HQ_NAME").text(data.node.title);
                        $("#DEPT_NAME").text("");
                        $("#LC_NAME").text("");
                        $("#HQ_NAME2").text(data.node.title);
                        $("#DEPT_NAME2").text("");
                        $("#LC_NAME2").text("");
                    }  else {
                        $("#HQ_NAME").text(data.node.parent.title);
                        $("#DEPT_NAME").text(data.node.title);
                        $("#LC_NAME").text("");
                        $("#HQ_NAME2").text(data.node.parent.title);
                        $("#DEPT_NAME2").text(data.node.title);
                        $("#LC_NAME2").text("");
                    }
        
                    // 사업국 인원 검색
                    switch (_mode){
                        case "search" :
                            if (_isEmpSearch) {
                                _sortList.selTreeEmpList(data.node.title);
                            } else {
                                param[0].SEARCH_DEPT_ID = "Y";
                                param[0].SEARCH_DEPT_ID_TXT = data.node.data.DEPT_ID;
                                _getList.employeeList(param);
                            }
                            break;
    
                        case "plainTree" : 
                            if (_isEmpSearch) {
                                _sortList.selTreeEmpList(data.node.title);
                            } else {
                                param[0].SEARCH_DEPT_ID = "Y";
                                param[0].SEARCH_DEPT_ID_TXT = data.node.data.DEPT_ID;
                                _getList.employeeList(param);
                            }
                            if (hash ==="#disPlayDn") $("#counselSend_btn").removeClass('invisible');
                            else $("#counselSend_btn").removeClass('invisible');
                        case "plainTreeNoEmp" : 
                            if( _mode == "search" || _mode == "plainTreeNoEmp" ) $('#counselSave_btn').removeClass("invisible");
                            break;
                        case "plainTreeSelOrg" : 
                            // $("#counselSend_btn").removeClass('invisible');
                            break;
                    }
                } else if(data.node.data.LV == "3"){
                    if ( data.node.parent.parent.data.DEPT_ID == "T000" ) {
                        $("#HQ_NAME").text(data.node.parent.title);
                        $("#DEPT_NAME").text(data.node.title);
                        $("#LC_NAME").text("");
                        $("#HQ_NAME2").text(data.node.parent.title);
                        $("#DEPT_NAME2").text(data.node.title);
                        $("#LC_NAME2").text("");
                    }  else {
                        $("#HQ_NAME").text(data.node.parent.parent.title);
                        $("#DEPT_NAME").text(data.node.parent.title);
                        $("#LC_NAME").text(data.node.title);
                        $("#HQ_NAME2").text(data.node.parent.parent.title);
                        $("#DEPT_NAME2").text(data.node.parent.title);
                        $("#LC_NAME2").text(data.node.title);
                    }
                    // 센터 인원 검색
                    switch (_mode){
                        case "search" :
                            if (_isEmpSearch) {
                                _sortList.selTreeEmpList(data.node.title); 
                            } else {
                                param[0].SEARCH_DEPT_ID = "Y";
                                param[0].SEARCH_DEPT_ID_TXT = data.node.data.DEPT_ID;
                                _getList.employeeList(param);
                            }
                            break;
                        case "plainTree" : 
                            if (_isEmpSearch) {
                                _sortList.selTreeEmpList(data.node.title); 
                            } else {
                                param[0].SEARCH_DEPT_ID = "Y";
                                param[0].SEARCH_DEPT_ID_TXT = data.node.data.DEPT_ID;
                                _getList.employeeList(param);
                            }
                            if (hash ==="#disPlayDn") {
                                // 선택한 값이 센터인 경우
                                if ( data.node.data.DEPT_ID.length != 4 ) {
                                    alert("센터는 연계부서로 선택할 수 없습니다.\n: 상위 본부/사업국 혹은 부서를 선택해 주세요.");
                                    $("#counselSend_btn").addClass('invisible');
                                } else {
                                    $("#counselSend_btn").removeClass('invisible');
                                }
                            } else $("#counselSend_btn").removeClass('invisible');
                            break;
                        case "plainTreeNoEmp" : 
                            if( _mode == "search" || _mode == "plainTreeNoEmp" ) $('#counselSave_btn').removeClass("invisible");
                            break;
                        case "plainTreeSelOrg" : 
                            // $("#counselSend_btn").removeClass('invisible');
                            break;
                    }
                } else if(data.node.data.LV == "4"){
                    $("#HQ_NAME").text(data.node.parent.parent.title);
                    $("#DEPT_NAME").text(data.node.parent.title);
                    $("#LC_NAME").text(data.node.title);
                    $("#HQ_NAME2").text(data.node.parent.parent.title);
                    $("#DEPT_NAME2").text(data.node.parent.title);
                    $("#LC_NAME2").text(data.node.title);
        
                    // 센터 인원 검색
                    switch (_mode){
                        case "search" :
                            if (_isEmpSearch) {
                                _sortList.selTreeEmpList(data.node.title); 
                            } else {
                                param[0].SEARCH_DEPT_ID = "Y";
                                param[0].SEARCH_DEPT_ID_TXT = data.node.data.DEPT_ID;
                                _getList.employeeList(param);
                            }
                            break;
                        case "plainTree" : 
                            if (_isEmpSearch) {
                                _sortList.selTreeEmpList(data.node.title); 
                            } else {
                                param[0].SEARCH_DEPT_ID = "Y";
                                param[0].SEARCH_DEPT_ID_TXT = data.node.data.DEPT_ID;
                                _getList.employeeList(param);
                            }
                            if (hash ==="#disPlayDn") $("#counselSend_btn").removeClass('invisible');
                            else $("#counselSend_btn").removeClass('invisible');
                        case "plainTreeNoEmp" : 
                            if( _mode == "search" || _mode == "plainTreeNoEmp" ) $('#counselSave_btn').removeClass("invisible");
                            break;
                        case "plainTreeSelOrg" : 
                            // $("#counselSend_btn").removeClass('invisible');
                            break;
                    }
                }
                $("#POSTNUM").val(data.node.data.ZIPCDE);
                $("#POSTADDR").val(data.node.data.ZIP_ADDR);
                $("#ADDR").val(data.node.data.ADDR);
                $("#PHONE").val(data.node.data.TELPNO);
                $("#FAXNUM").val(data.node.data.FAXNO);
                $("#ZIP_CNTS_input").val(data.node.data.ZIP_CNTS);
                $("#POSTNUM2").val(data.node.data.ZIPCDE);
                $("#POSTADDR2").val(data.node.data.ZIP_ADDR);
                $("#ADDR2").val(data.node.data.ADDR);
                $("#PHONE2").val(data.node.data.TELPNO);
                $("#FAXNUM2").val(data.node.data.FAXNO);
                $("#REP_EMP_NAME").val(data.node.data.REP_EMP_NAME);
                $("#ZIP_CNTS_input").val(data.node.data.ZIP_CNTS);

                // 사업국장 및 센터장 보임 처리
                if(data.node.data.LV == '2'){
                	$("#empTitle").text('사업국장');
                	$("#post_td").attr('colspan', '3');
                	$(".empTitle_cl").css('display','');
                }else if(data.node.data.LV >= 3){
                	$("#empTitle").text('센터장');
                	$("#post_td").attr('colspan', '3');
                	$(".empTitle_cl").css('display','');
                }else {
                	$("#empTitle").text('');
                	$("#post_td").attr('colspan', '5');
                	$(".empTitle_cl").css('display','none');
                }
        }
    });
    tree = $.ui.fancytree.getTree("#tree");
}
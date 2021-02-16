/**
 * orgGrid : 구성원 그리드 및 Tree구조 설정
 */

// 구성원 리스트 grid 설정
function setGridTree() {
    employeeListGrid = new Grid({
        el: document.getElementById('employeeListGrid'),
        bodyHeight: 243,
        rowHeaders: _modeSelect[_mode].rowHeaders,
        columnOptions: { minWidth: 50, resizable: true, frozenCount: 0, frozenBorderWidth: 1, },
        columns: [
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
                header: '성명',
                name: 'NAME',
                width: 80,
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
            }
        ],
    });
    employeeListGrid.on('click', (ev) => {
        employeeListGrid.addSelection(ev);
        employeeListGrid.clickSort(ev);
        employeeListGrid.clickCheck(ev);
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
        selectMode: 3,
    
        // 본부/사업국/센터 설정 시 해당 정보 표시
        activate: function(event, data) {
            // $("#statusLine").text(event.type + ": " + data.node);
            // console.log(event, data, ", targetType=" + data.targetType);
            _selectedNode = data.node;
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
                    case "plainTree" : 
                    case "search" :
                        if (_isEmpSearch) {
                            _sortList.selTreeEmpList(data.node.title);
                        } else {
                            param[0].SEARCH_DEPT_ID = "Y";
                            param[0].SEARCH_DEPT_ID_TXT = data.node.data.DEPT_ID;
                            _getList.employeeList(param);
                        }
                        if (hash ==="#disPlayDn") $("#counselSend_btn").removeClass('invisible');
                        else $("#counselSend_btn").addClass('invisible');
                        break;
                    case "plainTreeSelOrg" : 
                        $("#counselSend_btn").addClass('invisible');
                        break;
                }
                $("#counselSave_btn").addClass('invisible');
                
            } else if(data.node.data.LV == "2"){
                $("#HQ_NAME").text(data.node.parent.title);
                $("#DEPT_NAME").text(data.node.title);
                $("#LC_NAME").text("");
                $("#HQ_NAME2").text(data.node.parent.title);
                $("#DEPT_NAME2").text(data.node.title);
                $("#LC_NAME2").text("");
    
                // 사업국 인원 검색
                switch (_mode){
                    case "plainTree" : 
                    case "search" :
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
                        $("#counselSend_btn").removeClass('invisible');
                        break;
                }
            } else if(data.node.data.LV == "3"){
                $("#HQ_NAME").text(data.node.parent.parent.title);
                $("#DEPT_NAME").text(data.node.parent.title);
                $("#LC_NAME").text(data.node.title);
                $("#HQ_NAME2").text(data.node.parent.parent.title);
                $("#DEPT_NAME2").text(data.node.parent.title);
                $("#LC_NAME2").text(data.node.title);
    
                // 센터 인원 검색
                switch (_mode){
                    case "plainTree" : case "search" :
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
                        $("#counselSend_btn").removeClass('invisible');
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
                    case "plainTree" : case "search" :
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
                        $("#counselSend_btn").removeClass('invisible');
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
            $("#ZIP_CNTS_input").val(data.node.data.ZIP_CNTS);
        },
    });
    tree = $.ui.fancytree.getTree("#tree");
}
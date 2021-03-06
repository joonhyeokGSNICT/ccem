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
const _SPACE = "sandbox";
/*************************************************** */

/**
 * API 접속 정보
 */
const API_INFO = {
    ops: {
        ccem: "https://ccm.daekyo.co.kr",
        rec: "https://ccm-rec.daekyo.co.kr/player/player.jsp",
    },
    dev: {
        ccem: "https://devccem.daekyo.co.kr",
        rec: "https://ccm-rec.daekyo.co.kr/player/player.jsp",
    },
}

/**
 * 젠데스크 요소 정보
 */
const ZDK_INFO = {
    ops: {
        ticketForm: {
            CNSLT_INQRY                 :   "360003019934",     // 상담문의
            GNGWN_CRFL_NEW              :   "360006660233",     // 강원심층수(신규)
            GNGWN_CRFL_LNG              :   "1500000129041",    // 강원심층수(장기)
            GNGWN_CRFL_RVC              :   "1500000134662",    // 강원심층수(해지)
            SRVY                        :   "1500000043241",    // 설문조사
        },
        ticketField: {
            CSEL_DATE_NO_SEQ           :    "360054933374",     // 상담번호                                                
            CSEL_LTYPE_CDE             :    "360055869953",     // 상담분류(대)                                            
            CSEL_MTYPE_CDE             :    "360055869973",     // 상담분류(중)                                            
            CSEL_STYPE_CDE             :    "360054867374",     // 상담분류(소)                                            
            CSEL_MK                    :    "360054867694",     // 상담구분                                    
            CSEL_CHNL_MK               :    "360055870153",     // 상담채널                                            
            CUST_RESP_MK               :    "360055870173",     // 고객반응                                                       
            CALL_RST_MK                :    "360055870193",     // 통화결과                                        
            CSEL_RST_MK                :    "360055870213",     // 상담결과                                        
            PROC_MK                    :    "360054867854",     // 처리구분                                    
            CUST_MK                    :    "360055870333",     // 고객구분                                    
            PROC_STS_MK                :    "360055870633",     // 처리상태                                        
            MOTIVE_CDE                 :    "360055870933",     // 입회사유                                        
            AGE_GRADE_CDE              :    "360055933613",     // 학년                                        
            PRDT                       :    "360054933354",     // 과목                                    
            DEPT_IDNM                  :    "360055933633",     // 지점부서명                                        
            DIV_CDE                    :    "360056838353",     // 지점본부                                    
            DIV_CDENM                  :    "360054933394",     // 지점본부명
            AREA_CDENM                 :    "360055933653",     // 지역코드명                                        
            FST_CRS_CDE                :    "360055933673",     // 입회경로 (첫상담경로 => 입회경로 변경)
            VOC_MK                     :    "360055933693",     // VOC여부                                    
            CSEL_GRD                   :    "360054933634",     // 상담등급                                        
            PROC_DEPT_IDNM             :    "360054933654",     // 연계부서명                                            
            TRANS_CHNL_MK              :    "360055933873",     // 현장연계 연계방법                                            
            RTN_FLAG                   :    "360054934854",     // 회신여부                                        
            TRANS_MK                   :    "360055934833",     // 현장연계 연계구분                                        
            TRANS_DEPT_IDNM            :    "360054934874",     // 현장연계 지점명                                            
            LC_IDNM                    :    "360054935054",     // 현장연계 러닝센터명                                    
            PROC_CTI_CHGDATE_TIME      :    "360054935074",     // 현장연계 지점처리시간                                                    
            PROC_CTI_CHGDATE_MS        :    "360055003054",     // 현장연계 지점처리시간(ms)                                                
            TRANS_DATE_TIME            :    "360054935374",     // 현장연계 일시                                                
            PROC_CTI_CHGDATE           :    "360054941874",     // 현장처리 일시
            PROC_EMP_IDNM              :    "360055935573",     // 현장처리 처리자명                                            
            HPCALL_DATE1_TIME1         :    "360054935414",     // 1차 해피콜 일시                                                
            HPCALL_CNTS1               :    "360054935634",     // 1차 해피콜 내용                                            
            HPCALL_CHNL_MKNM1          :    "360054935814",     // 1차 해피콜 경로                                                
            HPCALL_USER_IDNM1          :    "360054935834",     // 1차 해피콜 상담원명                                                
            SATIS_CDENM1               :    "360054935854",     // 1차 해피콜 고객만족도                                            
            HPCALL_DATE2_TIME2         :    "360054935874",     // 2차 해피콜 일시                                                
            HPCALL_CNTS2               :    "360055935893",     // 2차 해피콜 내용                                            
            HPCALL_CHNL_MKNM2          :    "360055935913",     // 2차 해피콜 경로                                                
            HPCALL_USER_IDNM2          :    "360055942713",     // 2차 해피콜 상담원명                                                
            SATIS_CDENM2               :    "360055935933",     // 2차 해피콜 고객만족도                                            
            GIFT_NAME                  :    "360055936133",     // 사은품명                                        
            GIFT_PRICE                 :    "360055936153",     // 사은품 가격                                        
            SEND_DATE                  :    "360055936173",     // 사은품 발송일자                                        
            GIFT_CHNL_MKNM             :    "360055936193",     // 사은품 발송경로                                            
            PASS_USER                  :    "360054936054",     // 사은품 전달자명                                        
            INVOICENUM                 :    "360054936074",     // 사은품 송장번호                                        
            CSEL_PROC_DATE             :    "360055936213",     // 상담원처리 처리일시                                            
            CSEL_PROC_USER_NAME        :    "360055936233",     // 상담원처리 처리자명                                                
            CSEL_PROC_CNTS             :    "360054936234",     // 상담원처리 처리내용                                            
            OB_MK                      :    "360054936254",     // OB구분                                    
            DEPT_ACP_DATE_TIME         :    "1500000155421",    // 현장연계 접수일시                                                
            DEPT_ACP_NAME              :    "1500000155441",    // 현장연계 접수자명                                            
            LIST_CUST_ID               :    "360055210094",     // 리스트ID_고객번호                                            
            IS_HPCALL                  :    "360055092234",     // 해피콜 여부                                        
            FIN_YN                     :    "1500000188642",    // 통화여부                                    
            CALLBACK_ID                :    "360055244354",     // 콜백번호                                        
            LIST_MK                    :    "360056252613",     // 리스트구분                                    
            LC_NAME                    :    "1500000314422",    // 러닝센터명                                    
            LC_MK                      :    "360055940753",     // LC여부                                    
            HL_MK                      :    "1500000315202",    // HL여부                                    
            YC_MK                      :    "360055368434",     // YC여부                                    
            VISIT_CHNL                 :    "1500000316162",    // 방문채널                                        
            TCH_NM                     :    "360055368974",     // 교사명                                    
            TCH_NO                     :    "360056370613",     // 교사사번                                    
            TCH_WRK_MNT                :    "360055370494",     // 교사근무개월수                                        
            RE_PROC                    :    "1500000343402",    // 재확인여부                                    
            RECL_CNTCT                 :    "1500000369381",    // 재통화 연락처                                        
            RECL_CMPLT                 :    "1500000377001",    // 재통화 완료                                        
            OFCL_RSPN                  :    "360056748453",     // 직책                                        
            JOB                        :    "1500000699922",    // 직무                                
            DIV_KIND_CDE               :    "1500000767781",    // 브랜드                                            
            CSEL_RST_MK_OB             :    "1500001206841",    // 상담결과OB
            CHNL                       :    "360057398093",     // 채널
            AREA                       :    "1500001339021",    // 관할지역
            CANCEL_CUST_MK             :    "1500001339461",    // 해지고객구분
            MEMBERSHIP_GRP             :    "1500001389402",    // 멤버십등급
            GND                        :    "360057398433",     // 성별
            AGE_GRP                    :    "360056397974",     // 연령구분
            AGE                        :    "1500001339801",    // 연령
            PRDT_NAME                  :    "360056398014",     // 제품명
            SURVEY_CUST_MK             :    "360057398713",     // 고객구분(설문)
            STD_MONTH                  :    "1500001340641",    // 학습/음용개월
            CSEL_TELNO                 :    "360056795354",     // 상담전화번호
            CALL_EDTIME                :    "360056795674",     // 통화종료시각
            CALL_STTIME                :    "1500001725741",    // 통화시작시각
            RECORD_ID                  :    "1500001725761",    // 녹취키
            RECORD_ID_HIS              :    "360057792133",     // 녹취키 History    
            CALL_RST_MK_OB             :    "360054868214",     // OB결과
            OB_PRESET                  :    "1500003677161",    // OB구분(고정)
            OB_TEL                     :    "1500003042642",    // OB전화번호
            CSEL_MAN_MK                :    "1500004210762",    // 내담자
        },
        defaultUser : '',                             // 운영서버 이민형대리님 ID
    },
    sandbox: {
        ticketForm: {
            CNSLT_INQRY                 :   "360005566214",    // 상담문의
            GNGWN_CRFL_NEW              :   "360006660253",    // 강원심층수(신규)
            GNGWN_CRFL_LNG              :   "",// 강원심층수(장기)
            GNGWN_CRFL_RVC              :   "",// 강원심층수(해지)
            SRVY                        :   "1500000047222",   // 설문조사
        },
        ticketField: {
            CSEL_DATE_NO_SEQ           :    "360056190833",     // 상담번호                                                
            CSEL_LTYPE_CDE             :    "1500000133262",    // 상담분류(대)                                            
            CSEL_MTYPE_CDE             :    "1500000133302",    // 상담분류(중)                                            
            CSEL_STYPE_CDE             :    "1500000126901",    // 상담분류(소)                                            
            CSEL_MK                    :    "360054438214",     // 상담구분                                    
            CSEL_CHNL_MK               :    "360056191633",     // 상담채널                                            
            CUST_RESP_MK               :    "1500000133182",    // 고객반응                                                       
            CALL_RST_MK                :    "1500000126421",    // 통화결과                                        
            CSEL_RST_MK                :    "1500000133202",    // 상담결과                                        
            PROC_MK                    :    "360055449473",     // 처리구분                                    
            CUST_MK                    :    "360055182114",     // 고객구분                                    
            PROC_STS_MK                :    "1500000126441",    // 처리상태                                        
            MOTIVE_CDE                 :    "360055182134",     // 입회사유                                        
            AGE_GRADE_CDE              :    "360054446674",     // 학년                                        
            PRDT                       :    "360054444474",     // 과목                                    
            DEPT_IDNM                  :    "360055456433",     // 지점부서명                                        
            DIV_CDE                    :    "1500000768281",    // 지점본부                                   
            DIV_CDENM                  :    "360054444514",     // 지점본부명 
            AREA_CDENM                 :    "1500000125881",    // 지역코드명                                        
            FST_CRS_CDE                :    "360055182014",     // 입회경로 (첫상담경로 => 입회경로 변경)                                     
            VOC_MK                     :    "360055456453",     // VOC여부                                    
            CSEL_GRD                   :    "360056190873",     // 상담등급                                        
            PROC_DEPT_IDNM             :    "1500000125901",    // 연계부서명                                            
            TRANS_CHNL_MK              :    "1500000125921",    // 현장연계 연계방법                                            
            RTN_FLAG                   :    "360055182034",     // 회신여부                                        
            TRANS_MK                   :    "1500000125941",    // 현장연계 연계구분                                        
            TRANS_DEPT_IDNM            :    "360056191053",     // 현장연계 지점명                                            
            LC_IDNM                    :    "360056191073",     // 현장연계 러닝센터명                                    
            PROC_CTI_CHGDATE_TIME      :    "1500000125961",    // 현장연계 지점처리시간                                                    
            PROC_CTI_CHGDATE_MS        :    "1500000132742",    // 현장연계 지점처리시간(ms)                                                
            TRANS_DATE_TIME            :    "1500000125981",    // 현장연계 일시                                                
            PROC_CTI_CHGDATE           :    "360057751273",     // 현장처리 일시                                              
            PROC_EMP_IDNM              :    "1500000132762",    // 현장처리 처리자명                                            
            HPCALL_DATE1_TIME1         :    "1500000132782",    // 1차 해피콜 일시                                                
            HPCALL_CNTS1               :    "1500000132802",    // 1차 해피콜 내용                                            
            HPCALL_CHNL_MKNM1          :    "1500000126001",    // 1차 해피콜 경로                                                
            HPCALL_USER_IDNM1          :    "1500000126021",    // 1차 해피콜 상담원명                                                
            SATIS_CDENM1               :    "1500000132822",    // 1차 해피콜 고객만족도                                            
            HPCALL_DATE2_TIME2         :    "1500000126041",    // 2차 해피콜 일시                                                
            HPCALL_CNTS2               :    "1500000126061",    // 2차 해피콜 내용                                            
            HPCALL_CHNL_MKNM2          :    "360056191093",     // 2차 해피콜 경로                                                
            HPCALL_USER_IDNM2          :    "360056191113",     // 2차 해피콜 상담원명                                                
            SATIS_CDENM2               :    "1500000132842",    // 2차 해피콜 고객만족도                                            
            GIFT_NAME                  :    "360055182054",     // 사은품명                                        
            GIFT_PRICE                 :    "360056191133",     // 사은품 가격                                        
            SEND_DATE                  :    "1500000132862",    // 사은품 발송일자                                        
            GIFT_CHNL_MKNM             :    "1500000132882",    // 사은품 발송경로                                            
            PASS_USER                  :    "360056191153",     // 사은품 전달자명                                        
            INVOICENUM                 :    "360056191173",     // 사은품 송장번호                                        
            CSEL_PROC_DATE             :    "1500000126081",    // 상담원처리 처리일시                                            
            CSEL_PROC_USER_NAME        :    "360055182074",     // 상담원처리 처리자명                                                
            CSEL_PROC_CNTS             :    "1500000126101",    // 상담원처리 처리내용                                            
            OB_MK                      :    "360055182094",     // OB구분                                    
            DEPT_ACP_DATE_TIME         :    "1500000155621",    // 현장연계 접수일시                                                
            DEPT_ACP_NAME              :    "360056218493",     // 현장연계 접수자명                                            
            LIST_CUST_ID               :    "360055210114",     // 리스트ID_고객번호                                            
            IS_HPCALL                  :    "1500000181062",    // 해피콜 여부                                        
            FIN_YN                     :    "1500000283662",    // 통화여부                                    
            CALLBACK_ID                :    "1500000280901",    // 콜백번호                                        
            LIST_MK                    :    "360056253093",     // 리스트구분                                    
            LC_NAME                    :    "360056368333",     // 러닝센터명                                    
            LC_MK                      :    "360054444534",     // LC여부                                    
            HL_MK                      :    "1500000314001",    // HL여부                                    
            YC_MK                      :    "1500000315782",    // YC여부                                    
            VISIT_CHNL                 :    "360056371173",     // 방문채널                                        
            TCH_NM                     :    "360056371193",     // 교사명                                    
            TCH_NO                     :    "360055369754",     // 교사사번                                    
            TCH_WRK_MNT                :    "1500000316181",    // 교사근무개월수                                        
            RE_PROC                    :    "360055394894",     // 재확인여부                                    
            RECL_CNTCT                 :    "1500000374822",    // 재통화 연락처                                        
            RECL_CMPLT                 :    "360056434293",     // 재통화 완료                                        
            OFCL_RSPN                  :    "1500000699902",    // 직책                                        
            JOB                        :    "1500000668861",    // 직무                                
            DIV_KIND_CDE               :    "1500000801342",    // 브랜드   
            CSEL_RST_MK_OB             :    "360056259394",     // 상담결과OB
            CHNL                       :    "1500001388502",    // 채널
            AREA                       :    "1500001339001",    // 관할지역
            CANCEL_CUST_MK             :    "360056397954",     // 해지고객구분
            MEMBERSHIP_GRP             :    "1500001339481",    // 멤버십등급
            GND                        :    "1500001339501",    // 성별
            AGE_GRP                    :    "360056397994",     // 연령구분
            AGE                        :    "1500001389702",    // 연령
            PRDT_NAME                  :    "1500001389722",    // 제품명
            SURVEY_CUST_MK             :    "360057398733",     // 고객구분(설문)
            STD_MONTH                  :    "360056398594",     // 학습/음용개월
            CSEL_TELNO                 :    "360057791693",     // 상담전화번호
            CALL_EDTIME                :    "1500001787222",    // 통화종료시각
            CALL_STTIME                :    "1500001725701",    // 통화시작시각
            RECORD_ID                  :    "1500001787242",    // 녹취키
            RECORD_ID_HIS              :    "1500001725721",    // 녹취키 History
            CALL_RST_MK_OB             :    "1500000133222",    // OB결과 
            OB_PRESET                  :    "1500003757682",    // OB구분(고정)
            OB_TEL                     :    "1500003043022",    // OB전화번호
            CSEL_MAN_MK                :    "1500004136281",    // 내담자
        },
        defaultUser : 426505541054,                             // 개발서버 이민형대리님 ID
    },
}

const API_SERVER = API_INFO[_ACTIVE]["ccem"];
const REC_SERVER = API_INFO[_ACTIVE]["rec"];

const GLOBAL_VARIABLE = {
    ops: {
        api: "",
    },
    dev: {
        api: "https://devccem.daekyo.co.kr",
    },
    local: {
        api: "",
    }
}
const ACTIVE = "dev";
const API_SERVER = GLOBAL_VARIABLE[ACTIVE]["api"];
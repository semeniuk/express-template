import Vue from "vue";
//import options from "options";

export default function(vueApp) {
    // handle errors
    Vue.config.errorHandler = function(error, vm, info) {
        if (error.isAxiosError && error.response) {
            let response = error.response;
            switch (response.status) {
                case 400:
                    if (typeof response.data === "string") {
                        vueApp.$toast.warning(response.data);
                    } else if (
                        typeof response.data === "object" &&
                        response.data.message
                    ) {
                        vueApp.$toast.warning(response.data.message);
                    } else {
                        vueApp.$toast.error("Unknown error");
                        console.error(error);
                    }
                    return;

                case 401:
                    window.location =
                        process.env.VUE_APP_SIGNIN_URL +
                        location.pathname +
                        location.search;
                    return;

                default:
                    vueApp.$toast.error("Request completed with error");
                    return;
            }
        }

        vueApp.$toast.error("Unknown error occurred");

        {
            //if (options.env === "development") {
            console.log("Vue.config.errorHandler");
            console.dir(error);
            console.log(vm);
            console.log(info);
        }
    };

    window.onerror = function(msg, url, line, col, error) {
        vueApp.$toast.error("Unknown error occurred");
        {
            //if (options.env === "development") {
            console.log("window.onerror");
            console.log(msg);
            console.log(url);
            console.log(line);
            console.log(col);
            console.error(error);
        }
    };

    window.addEventListener("unhandledrejection", function(event) {
        vueApp.$toast.error("Unknown error occurred");
        {
            //if (options.env === "development") {
            console.log("unhandledrejection");
            console.error(event);
        }
    });
}

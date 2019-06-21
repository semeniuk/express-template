var logger = require("./lib/logger");

module.exports = function (express) {
    logger.info("Init Router");
    
    var signinRequired = function (req, res, next) {
        if (!req.isAuthenticated()) {
            logger.info("Signin is required");
            if (req.xhr) {
                return res.status(401).json({}).end();
            } else {
                var url = require("url"),
                    querystring = require("querystring"),
                    redirectUrl = "/signin",
                    path = url.parse(req.originalUrl).path;

                if (/^\s*$/.test(path)) {
                    redirectUrl += "?return=" + querystring.escape(path);
                }

                return res.redirect(redirectUrl);
            }
        }
        next();
    };

    var xhrOnly = function(req, res, next){            
        if (!req.xhr) {
            return res.error(404);
        }
        next();
    };

    express.use("/api", signinRequired, xhrOnly, require("./controllers/api"));
    express.use("/dashboard", signinRequired, require("./controllers/dashboard"));
    express.use("/", require("./controllers/index"));

    // handle 404
    express.use(function (req, res) {
        var options = {};
        if (!req.isAuthenticated()) {
            options.layout = "welcome/_layout";
        }
        return res.error(404, options);
    });

    // handle 500
    // eslint-disable-next-line no-unused-vars
    // next parameter is required to work correctly
    express.use(function (err, req, res, next) {

        var options = {};
        /*if (!req.isAuthenticated()) {
            options.layout = "welcome/_layout";
        }*/

        if (err.code == "MODULE_NOT_FOUND") {
            return res.error(404, options);
        }

        logger.error("Express Error Middleware");
        logger.error(err);
        
        return res.error(500, options);
    });
};
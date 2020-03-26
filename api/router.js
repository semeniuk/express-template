const config = require("@config"),
    logger = require("@logger");

module.exports = function (express) {
    logger.info("Init Router");

    // eslint-disable-next-line no-unused-vars
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

                if (path) {
                    redirectUrl += "?return=" + querystring.escape(path);
                }
                console.log("redirectUrl", path);
                return res.redirect(redirectUrl);
            }
        }
        next();
    };

    var xhrOnly = function (req, res, next) {
        if (!req.xhr) {
            return res.error(404);
        }
        next();
    };

    var facadeOnly = function (req, res, next) {
        if (req.headers.authorization !== "Bearer " + config.facadeToken) {
            return res.sendStatus(401);
        }
        next();
    };

    express.use(xhrOnly);
    
    express.use("/profile", signinRequired, require("./routes/profile"));
    express.use("/gallery", signinRequired, require("./routes/gallery"));
    express.use("/facade", facadeOnly, require("./routes/facade"));
    express.use("/", signinRequired, require("./routes"));

    // handle 404
    express.use(function (req, res) {
        return res.error(404);
    });

    // handle 500
    // eslint-disable-next-line no-unused-vars
    // next parameter is required to work correctly
    // eslint-disable-next-line no-unused-vars
    express.use(function (err, req, res, next) {
        if (err.code == "MODULE_NOT_FOUND") {
            return res.error(404);
        }

        logger.error("Express Error Middleware");
        logger.error(err);

        return res.error(500);
    });
};

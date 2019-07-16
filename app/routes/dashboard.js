var express = require("express"),
    router = express.Router(),
    logger = require("./../lib/logger"),
    config = require("./../lib/config");


router.get("/*", function (req, res) {
    res.locals.model = {};
    return res.renderPage("dashboard/index", { layout: "dashboard/_layout" });
});

module.exports = router;
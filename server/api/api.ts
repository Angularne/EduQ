import express = require("express");
import mongoose = require("mongoose");
import {Auth} from "./routes/auth";

let router = express.Router();

/** Pupluc routes */
router.use(require("./routes/public"));

/** Authentication */
router.use(Auth.router);

/** User */
router.use("/user", require("./routes/user"));

/** Subject */
router.use("/subject", require("./routes/subject"));

/** Location */
router.use("/location", require("./routes/location"));





module.exports = router;

var express = require('express');
var router = express.Router();
const statusCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const resUtil = require('../module/responseUtil');
const pool = require('../module/pool');

router.get('/', async (req, res)=> {
    const getMainQuery = "SELECT * FROM recipes ORDER BY createAt";
    let result = await pool.queryParam_None(getMainQuery);
    res.status(statusCode.OK).send(resUtil.successTrue(resMsg.GET_MAIN_COMPLETE, result));
})

/***
 * "URI" : "/main"
 * "METHOD" : "GET"
 */
// ss
// ju

module.exports = router;
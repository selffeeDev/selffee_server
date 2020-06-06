var express = require('express');
var router = express.Router();
const statusCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const resUtil = require('../module/responseUtil');
const pool = require('../module/pool'); 
/***
 *  "URI" : "/search?keyword={keyword}"
 *  "METHOD" : "GET"
 */
router.get('/', async (req, res) => {
    try {
        let keyword = decodeURI(req.query.keyword);
        const searchQuery = `SELECT * FROM recipes WHERE recipeHashtags LIKE '%${keyword}%'`
        let result = await pool.queryParam_None(searchQuery);
        if (result.length === 0) {
            res.status(statusCode.BAD_REQUEST).send(resUtil.successFalse(resMsg.NO_SEARCH_RESULT));
            throw "NO_SEARCH_RESULT"
        }
        res.status(statusCode.OK).send(resUtil.successTrue(resMsg.SEARCH_COMPLETE, result));
    }
    catch(exception) {
        console.log(exception)
    }
})

module.exports = router;
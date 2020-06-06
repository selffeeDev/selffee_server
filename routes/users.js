var express = require('express');
var router = express.Router();
const statusCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const resUtil = require('../module/responseUtil');
const pool = require('../module/pool'); 
/***
 *  "URI" : "/users/myRecipe?recipeIdx={recipeIdx}"
 *  "METHOD" "GET"
 *  
 */
router.get('/myRecipe', async (req, res)=> {
    let recipeIdx = req.query.recipeIdx;
    let query = 'SELECT * FROM recipes WHERE recipeIdx=?';
    let result = await pool.queryParam_Arr(query, [recipeIdx]);
    console.log(result);
    if (result.length === 0) {
        res.status(statusCode.BAD_REQUEST).send(resUtil.successFalse(resMsg.NO_MY_RECIPE));
        throw "NO_MY_RECIPE"
    }
    res.status(statusCode.OK).send(resUtil.successTrue(resMsg.SEARCH_COMPLETE, result));
})

/***
 *  "URI" : "/users/myPage?category={category}"
 *  "METHOD" : "GET"
 */

router.get('/myPage', async (req, res)=>{
    let category = req.query.category;
    if(category == 1) { //내가 쓴 레시피

    }
    else if(cateogry == 2) { //좋아요 한 레시피

    }
    else { //찜한 레시피

    }
})
module.exports = router;
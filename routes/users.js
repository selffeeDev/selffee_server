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

//내가 쓴 레시피 불러오기
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


//마이페이지 불러오기
router.get('/myPage', async (req, res)=>{
    let category = req.query.category;
    
    if(category == 1) { //내가 쓴 레시피
        let userWritedRecipeQuery = 'SELECT * FROM userWritedRecipes'
        let userWritedReciperesult = await pool.queryParam_Arr(userWritedRecipeQuery);
        console.log(userWritedReciperesult);
        
        if (userWritedReciperesult.length === 0) {
            res.status(statusCode.BAD_REQUEST).send(resUtil.successFalse(resMsg.NO_MY_RECIPE));
            throw "NO_MY_RECIPE"
        }
        res.status(statusCode.OK).send(resUtil.successTrue(resMsg.SEARCH_COMPLETE, userWritedReciperesult));

    }
    else if(category == 2) { //좋아요 한 레시피
        let userLikedRecipeQuery = 'SELECT * FROM userLikedRecipes'
        let userLikedresult = await pool.queryParam_Arr( userLikedRecipeQuery);
        console.log(userLikedresult);
        
        if (userLikedresult.length === 0) {
            res.status(statusCode.BAD_REQUEST).send(resUtil.successFalse(resMsg.NO_LIKE_RECIPE));
            throw "NO_LIKE_RECIPE"
        }
        res.status(statusCode.OK).send(resUtil.successTrue(resMsg.SEARCH_COMPLETE, userLikedresult));

    }
    else { //찜한 레시피
        let userScrapedRecipeQuery = 'SELECT * FROM userScrapedRecipes'
        let userScrapedReciperesult = await pool.queryParam_Arr(userScrapedRecipeQuery);
        console.log(userScrapedReciperesult);


        if (userScrapedReciperesult.length === 0) {
            res.status(statusCode.BAD_REQUEST).send(resUtil.successFalse(resMsg.NO_SCRAP_RECIPE));
            throw "NO_SCRAP_RECIPE"
        }

        res.status(statusCode.OK).send(resUtil.successTrue(resMsg.SEARCH_COMPLETE, userScrapedReciperesult));

    }
})

module.exports = router;
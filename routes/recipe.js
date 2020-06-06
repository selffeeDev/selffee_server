var express = require('express');
var router = express.Router();
let statusCode = require('../module/statusCode');
let resMsg = require('../module/resMsg');
const resUtil = require('../module/responseUtil');
const pool = require('../module/pool');
const upload = require('../config/multer');
const singleUpload = upload.single('recipeThumbnail');
const moment = require('moment')

/***
 *  "URI" : "/recipe/like?recipeIdx={recipeIdx}"
 *  "METHOD" : "POST"
 */
router.get('/', async (req, res)=>{
    let recipeIdx = req.query.recipeIdx;
    let query = 'SELECT * FROM recipes WHERE recipeIdx=?';
    let result = await pool.queryParam_Arr(query, [recipeIdx]);
    console.log(result);
    if (result.length === 0) {
        res.status(statusCode.BAD_REQUEST).send(resUtil.successFalse(resMsg.GET_RECIPE_OK));
        throw "NO_MY_RECIPE"
    }
    res.status(statusCode.OK).send(resUtil.successTrue(resMsg.SEARCH_COMPLETE, result));
})

router.put('/like', async (req, res) => {
    const targetRecipe = req.query.recipeIdx

    const recipeAddLike = 'UPDATE recipes SET likes = likes + 1 WHERE recipeIdx = ?';
    await pool.queryParam_Arr('UPDATE users SET userLikes=userLikes+1');
    const getThumbnail = "SELECT recipeThumbnail FROM recipes WHERE recipeIdx= ?";
    const addRecipeToLiked = 'INSERT INTO userLikedRecipes (userIdx, recipeIdx, recipeThumbnail)VALUES (1,?,?)'
    let recipeLikeResult = await pool.queryParam_Arr(recipeAddLike, [targetRecipe]);
    let thumbnail = (await pool.queryParam_Arr(getThumbnail, [targetRecipe]))[0].recipeThumbnail;
    let addRecipeToLikedResult = await pool.queryParam_Arr(addRecipeToLiked, [targetRecipe, thumbnail]);

    console.log(recipeLikeResult, thumbnail, addRecipeToLikedResult);
    //recipelikeResult가 undefined일 경우 err 
    if (recipeLikeResult === undefined) {
        res.status(statusCode.BAD_REQUEST)
            .send(resUtil.successFalse(statusCode.BAD_REQUEST, resMsg.RECIPE_LIKE_FAIL));
            return;
    }
    res.status(statusCode.OK).send(resUtil.successTrue(resMsg.RECIPE_LIKE_OK));

});

router.put('/cancelLike', async (req, res) => {
    const targetRecipe = req.query.recipeIdx

    const recipeDeleteLike = 'UPDATE recipes SET likes = likes + 1 WHERE recipeIdx = ?';
    await pool.queryParam_Arr('UPDATE users SET userLikes=userLikes-1');
    const deleteRecipeFromLiked = 'DELETE FROM userLikedRecipes WHERE recipeIdx = ?'
    let recipeDeleteLikeResult = await pool.queryParam_Arr(recipeDeleteLike, [targetRecipe]);
    let deleteRecipeFromLikedResult = await pool.queryParam_Arr(deleteRecipeFromLiked, [targetRecipe]);

    console.log(recipeDeleteLikeResult, deleteRecipeFromLikedResult);
    //recipelikeResult가 undefined일 경우 err 
    if (recipeDeleteLikeResult === undefined) {
        res.status(statusCode.BAD_REQUEST)
            .send(resUtil.successFalse(statusCode.BAD_REQUEST, resMsg.RECIPE_LIKE_CANCEL_FAIL));
            return;
    }
    res.status(statusCode.OK).send(resUtil.successTrue(resMsg.RECIPE_LIKE_CANCEL_OK));

});
/***
 *  "URI" : "/recipe/scrap"
 *  "METHOD" : "UPDATE"
 */

//scrap기능
router.put('/scrap', async (req, res) => {
    const targetScrapRecipe = req.query.recipeIdx

    const recipeAddScrap = 'UPDATE recipes SET scraps = scraps + 1 WHERE recipeIdx = ?';
    const getThumbnail = "SELECT recipeThumbnail FROM recipes WHERE recipeIdx= ?";
    const addRecipeToScraped = 'INSERT INTO userScrapedRecipes VALUES (1,?,?)'

    let recipeScrapResult = await pool.queryParam_Arr(recipeAddScrap, [targetScrapRecipe]);
    await pool.queryParam_Arr('UPDATE users SET userScraps=userScraps+1');
    let thumbnail = (await pool.queryParam_Arr(getThumbnail, [targetScrapRecipe]))[0].recipeThumbnail;
    let addRecipeToScrapedResult = await pool.queryParam_Arr(addRecipeToScraped, [targetScrapRecipe, thumbnail]);
    console.log(addRecipeToScrapedResult)
    //recipelikeResult가 undefined일 경우 err 
    if (recipeScrapResult === undefined) {
        res.status(statusCode.BAD_REQUEST)
            .send(resUtil.successFalse(statusCode.BAD_REQUEST, resMsg.RECIPE_SCRAP_FAIL));
            return;
    }
    res.status(statusCode.OK).send(resUtil.successTrue(resMsg.RECIPE_SCRAP_OK));

});

router.put('/cancelScrap', async (req, res) => {
    const targetScrapRecipe = req.query.recipeIdx

    const recipeDeleteScrap = 'UPDATE recipes SET scraps = scraps - 1 WHERE recipeIdx = ?';
    const deleteRecipeFromScraped = 'DELETE FROM userScrapedRecipes WHERE recipeIdx = ?'
    let recipeDeleteScrapResult = await pool.queryParam_Arr(recipeDeleteScrap, [targetScrapRecipe]);
    await pool.queryParam_Arr('UPDATE users SET userScraps=userScraps-1');
    let deleteRecipeFromScrapedResult = await pool.queryParam_Arr(deleteRecipeFromScraped, [targetScrapRecipe]);
    console.log(deleteRecipeFromScrapedResult)
    //recipelikeResult가 undefined일 경우 err 
    if (deleteRecipeFromScrapedResult === undefined) {
        res.status(statusCode.BAD_REQUEST)
            .send(resUtil.successFalse(statusCode.BAD_REQUEST, resMsg.RECIPE_SCRAP_CANCEL_FAIL));
            return
    }
    res.status(statusCode.OK).send(resUtil.successTrue(resMsg.RECIPE_SCRAP_CANCEL_OK));

});

/*
 "URI" : "/recipe"
 "METHOD" : "POST"
*/
router.post('/', singleUpload, async (req, res) => {

    //body에 넣은 것 저장 
    const {
        recipeTitle, //제목
        recipeTime, //소요시간
        recipeHashtags, //해쉬태그 배열 
        recipeDesc, //레시피 상세정보
        recipeDoc,   //자유로운 글쓰기
    } = req.body

    //이미지도 req 추가 필요 

    //빈 str
    let hashtag_str = "";
    let recipeThumbnail = req.file.location
    console.log(req.file.location);

    //req값이 전부 존해자지 않는다면 NULL_VALUE를 반환한다.
    if (!recipeTitle || !recipeHashtags || !recipeTime || !recipeDesc || !recipeDoc) {
        res.status(statusCode.BAD_REQUEST)
            .send(resUtil.successFalse(resMsg.NULL_VALUE));
        return;
    }

    // //str에 hashtag배열의 내용을 추가 
    // for (var i = 0; i < recipeHashtags.length; i += 1) {
    //     hashtag_str += recipeHashtags[i];
    // }
    hashtag_str = recipeHashtags

    //추가로 생각해야 할 확인 사항 

    const recipeAddQuery = 'INSERT INTO recipes (recipeTitle, recipeTime, recipeHashtags, recipeDesc, recipeDoc, recipeThumbnail,createAt) VALUES (?,?,?,?,?,?,?)';
    let recipeAddResult = await pool.queryParam_Arr(recipeAddQuery, [recipeTitle, recipeTime, hashtag_str, recipeDesc, recipeDoc, recipeThumbnail, moment().format("YYYY-MM-DD HH:mm:ss")]);
    await pool.queryParam_Arr('INSERT INTO userWritedRecipes VALUES (?,?,?)', [1, recipeAddResult.insertId, recipeThumbnail])
    console.log(recipeAddResult);
    res.status(statusCode.OK).send(resUtil.successTrue(resMsg.RECIPE_ADD_OK));

});


module.exports = router;

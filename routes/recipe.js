var express = require('express');
var router = express.Router();
let statusCode = require('../module/statusCode');
let resMsg = require('../module/resMsg');
const resUtil = require('../module/responseUtil');
const pool = require('../module/pool');
const upload = require('../config/multer');
const singleUpload = upload.single('recipeThumbnail'); 

/***
 *  "URI" : "/recipe/like?recipeIdx={recipeIdx}"
 *  "METHOD" : "POST"
 */


router.put('/like', async(req, res) => {
  const targetRecipe = req.query.recipeIdx
  
  const recipeAddlike = 'UPDATE recipes SET likes = likes + 1 WHERE recipeIdx = ?';
  let recipelikeResult = await pool.queryParam_Arr(recipeAddlike, [targetRecipe]);
  console.log(recipelikeResult);

  //recipelikeResult가 undefined일 경우 err 
  if(recipelikeResult === undefined ){
    res.status(statusCode.BAD_REQUEST)
    .send(resUtil.successFalse(statusCode.BAD_REQUEST, resMsg.RECIPE_LIKE_FAIL));
  }
  res.status(statusCode.OK).send(resUtil.successTrue(resMsg.RECIPE_LIKE_OK));

}); 


/***
 *  "URI" : "/recipe/scrap"
 *  "METHOD" : "UPDATE"
 */

//scrap기능
router.post('/scrap', async(req, res) => {
  const targetScrapRecipe = req.query.recipeIdx
  
  const recipeAddscrap = 'UPDATE recipes SET scraps = scraps + 1 WHERE recipeIdx = ?';
  let recipescrapResult = await pool.queryParam_Arr(recipeAddscrap, [targetScrapRecipe]);
  console.log(recipescrapResult);

  //recipelikeResult가 undefined일 경우 err 
  if(recipescrapResult === undefined ){
    res.status(statusCode.BAD_REQUEST)
    .send(resUtil.successFalse(statusCode.BAD_REQUEST, resMsg.RECIPE_LIKE_FAIL));
  }
  res.status(statusCode.OK).send(resUtil.successTrue(resMsg.RECIPE_SCRAP_OK));

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

  //str에 hashtag배열의 내용을 추가 
  for(var i = 0; i < recipeHashtags.length; i += 1 ){
    hashtag_str += recipeHashtags[i];
  }

  
  //추가로 생각해야 할 확인 사항 
  
  const recipeAddQuery = 'INSERT INTO recipes (recipeTitle, recipeTime, recipeHashtags, recipeDesc, recipeDoc, recipeThumbnail) VALUES (?,?,?,?,?,?)';         
  let recipeAddResult = await pool.queryParam_Arr(recipeAddQuery, [recipeTitle, recipeTime, hashtag_str, recipeDesc, recipeDoc, recipeThumbnail]);
  console.log(recipeAddResult);
  res.status(statusCode.OK).send(resUtil.successTrue(resMsg.RECIPE_ADD_OK, ));
  
});



/***
 * "URI" : "/recipe?recipeIdx={recipeIdx}"
 * "METHOD" : "GET"
 */

router.post('/like', async(req, res) => {

}); 



module.exports = router;

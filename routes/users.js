var express = require('express');
var router = express.Router();
const getUser = require('./modules/users');

/***
 *  "URI" : "/users/myRecipe?recipeIdx={recipeIdx}"
 *  "METHOD" "GET"
 *  
 */
router.get('/', async (req, res)=> {
    
})

/***
 *  "URI" : "/users/postRecipe"
 *  "METHOD" : "POST"
 */

/***
 *  "URI" : "/users/myPage?category={category}"
 *  "METHOD" : "GET"
 */
module.exports = router;
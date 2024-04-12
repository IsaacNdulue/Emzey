const express = require('express')
const { signUp, login, logOut} = require('../controller/userController')
const { postMerch } = require('../controller/adminController')
const upload = require('../utility/multer')
const router = express.Router()

router.post('/signup',signUp)
router.post('/login',login)
router.post('/logout',logOut)
router.post('/postMerch',upload.array('images',2), postMerch)


module.exports = router
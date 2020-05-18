const { userDetail, userEdit, userUpdate } = require("../../controllers/serverControllers/userController");
const express = require("express");
const router = express.Router();

router.get("", userDetail); // profile 보기
router.get("/edit", userEdit); //profile 수정 페이지
router.post("/edit",userUpdate);//profile 수정

module.exports = router;

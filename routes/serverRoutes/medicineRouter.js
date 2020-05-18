const {
    medicineList,
    addForm,
    medicineDetail,
    insertSchedule,
    updateMedicine,
    deleteMedicine
} = require("../../controllers/serverControllers/medicineController");
const express = require("express");
const router = express.Router();

router.get("", medicineList); //약 목록
router.get("/addForm", addForm);
router.get("/:scheID", medicineDetail); //약 자세한 정보

router.post("/insert", insertSchedule); //알람 추가 -> 약을 하나하나 받는 게 아니라, 여러개를 한꺼번에 알람별로 받는 거라 id를 쓸 수가 없어!
router.post("/:id/update", updateMedicine); //약 정보 수정
router.post("/:id/delete", deleteMedicine); //약 삭제

module.exports = router;

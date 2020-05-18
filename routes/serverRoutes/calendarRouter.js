const { calendar, calendarDetail, alarmDetail, alarmRecord } = require("../../controllers/serverControllers/calendarController");

const express = require("express");
const router = express.Router();

router.get("", calendar);//기본 캘린더 페이지
router.get("/:date", calendarDetail); //해당 일자에 해당하는 알람 리스트 보여줌. req.params.date로 처리
router.get("/:date/:scheID", alarmDetail); //해당일 개별 알람에 대한 복용 여부 페이지 보여줌. scheID는 알람 id
router.post("/alarmRecord", alarmRecord); //해당일 개별 알람에 대한 복용 여부 저장. id는 알람 id

module.exports = router;

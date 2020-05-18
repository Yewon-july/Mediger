//Proxy-Controllers
const {alarmList} = require("../controllers/proxyControllers/askAlarmList");
const { whatToTake, medicationYes } = require("../controllers/proxyControllers/askWhatToTake");
const { updateEndDate, updateAlarmTime, updateMedicineName } = require("../controllers/proxyControllers/changeMedicationInfo");
const { selectAlarmList, updateIntake } = require("../controllers/proxyControllers/checkMedicineTaken")
const {findAlarmInfo, deleteAlarm} = require("../controllers/proxyControllers/deleteMedicationInfo");
const {insertAlarm} = require("../controllers/proxyControllers/inputMedicationInfo");

const express = require("express");

//Server-Routers
const authRouter = require("./serverRoutes/authRouter");
const calendarRouter = require("./serverRoutes/calendarRouter");
const userRouter = require("./serverRoutes/userRouter");
const medicineRouter = require("./serverRoutes/medicineRouter");

const router = express.Router();

//Server-Repository
//---start----
router.use("/", authRouter);
router.use("/calendar", calendarRouter);
router.use("/user", userRouter);
router.use("/medicines", medicineRouter);


//Proxy-Repository
//---start---

//Answer-alarmList
router.post('/Answer-alarmList', alarmList);

//Ask-whatToTake
router.post('/Answer-whatToTake', whatToTake);
router.post('/Confirm-medication', medicationYes);

//Change-medicationInfo
router.post('/Check-endDate', updateEndDate);
router.post('/Check-alarmTime', updateAlarmTime);
router.post('/Check-medicineName', updateMedicineName);

//Check-MedicineTaken
router.post('/Check-alarmTaken', selectAlarmList);
router.post('/Check-allNotTaken-intake', updateIntake)
router.post('/Check-someNotTaken-missing', updateIntake);

//Delete-MedicationInfo
router.post('/Ask-alarmNameToDelete', findAlarmInfo);
router.post('/Check-delete', deleteAlarm);

//Input-MedicationInfo  
router.post('/Check-alarmInfo', insertAlarm);

module.exports = router;

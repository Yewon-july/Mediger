const { Schedule, Medicine, MediSchedule } = require("../../models");

const momenttz = require('moment-timezone');
const moment = require('moment');
const json = require('./responseController');

const insertAlarm = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);
    //알람 정보를 유저가 확인하지 않았을 경우
    if(!(req.body.action.parameters).hasOwnProperty('Yes_alarmInfo')){
        //RESPONSE SAMPLE 형식에 맞춤
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.No_alarmInfo = req.body.action.parameters.No_alarmInfo.value;
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }
    //NUGU SPEAKER에서는 시간을 하나만 입력받음    
    const month = parseInt(req.body.action.parameters.endDate_month.value) >= 10 ? req.body.action.parameters.endDate_month.value : '0' + req.body.action.parameters.endDate_month.value;
    const day = parseInt(req.body.action.parameters.endDate_day.value) >= 10 ? req.body.action.parameters.endDate_day.value : '0' + req.body.action.parameters.endDate_day.value;
    const dateFormat =  req.body.action.parameters.endDate_year.value + month + day;
    const endDate = moment(dateFormat).format('YYYY-MM-DD');

    const startDate = momenttz().tz('Asia/Seoul').format('YYYY-MM-DD');

    console.log("startDate: ", startDate);
    console.log("endDate: ", endDate);

    let hour = req.body.action.parameters.alarmTime_duration.value === 'PM' ? parseInt(req.body.action.parameters.alarmTime_hour.value) + 12 : parseInt(req.body.action.parameters.alarmTime_hour.value);
    hour = hour >= 24 ? hour-24 : hour;
    let min = (req.body.action.parameters).hasOwnProperty('alarmTime_min') === true ? parseInt(req.body.action.parameters.alarmTime_min.value) : 0;

    if(startDate>endDate){
        throw new Error("시작일이 종료일보다 큽니다.");
    }

    let num = moment(endDate).diff(moment(startDate), 'days');
    console.log("num: ", num);

    for(i = 0; i <= num ; i++){
        let tempDate = moment(startDate).add(i, 'd');
        tempDate = moment(tempDate).format('YYYY-MM-DD');

        await Schedule.create({
            userID: parseInt(req.body.action.parameters.userID_7.value),
            scheName: req.body.action.parameters.alarmName_input.value,
            scheDate: tempDate,
            scheHour: hour,
            scheMin: min,
            startDate: startDate,
            endDate: endDate
        }).then(async(schedule) => {
            await Medicine.findOrCreate({
                where: { medicineName: req.body.action.parameters.medicineName_input.value },
                attributes: ["medicineID", "medicineName"]
            }).spread(async (medicine) => {
                var dose = (req.body.action.parameters).hasOwnProperty('dosage_input') === true ? req.body.action.parameters.dosage_input.value : null; 
                
                await MediSchedule.create({
                    medicineID: medicine.dataValues.medicineID,
                    scheID: schedule.dataValues.scheID,
                    dose: dose,
                    medicineName: medicine.dataValues.medicineName,
                }).catch(err => {
                    console.error(err);
                    next(err);
                });

            }).catch(error => {
                console.error(error);
                next(error);
            });
        }).catch(e=>{
            console.error(e);
            next(e);
        });
    }

    //RESPONSE SAMPLE 형식에 맞춤
    let resObj = json.resObj();
    resObj.version = req.body.version;
    console.log(resObj);
    res.json(resObj);
    res.end();
    return;
}

module.exports = { insertAlarm };
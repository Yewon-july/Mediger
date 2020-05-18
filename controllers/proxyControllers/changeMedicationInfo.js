const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const {Schedule, MediSchedule, Medicine} = require('../../models')

const json = require('./responseController');
const moment = require('moment');

const updateEndDate = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);
    
    if(!(req.body.action.parameters).hasOwnProperty('Yes_changeEndDate')){
        //RESPONSE SAMPLE 형식에 맞춤
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.No_changeEndDate = req.body.action.parameters.No_changeEndDate.value;
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }

    var query = "" + 
    "SELECT SCHEDULES.scheID, SCHEDULES.scheName, SCHEDULES.scheHour, SCHEDULES.scheMin, SCHEDULES.startDate, SCHEDULES.endDate, MEDISCHEDULES.medicineID, MEDISCHEDULES.medicineName, MEDISCHEDULES.dose " + 
    "FROM SCHEDULES JOIN MEDISCHEDULES ON SCHEDULES.scheID=MEDISCHEDULES.scheID " + 
    "WHERE SCHEDULES.userID=:userID AND SCHEDULES.scheName=:scheName";

    await sequelize.query(query, 
            {replacements: {userID: parseInt(req.body.action.parameters.userID_3.value), scheName: req.body.action.parameters.AlarmName.value}, type: Sequelize.QueryTypes.SELECT}
    ).then(async (schedule) => {
        console.log(schedule);

        //누구스피커로부터 날짜 받음
        const prevEndDate = moment(schedule[0].endDate).format('YYYY-MM-DD');
        const month = parseInt(req.body.action.parameters.newEndDate_month.value) >= 10 ? req.body.action.parameters.newEndDate_month.value : '0' + req.body.action.parameters.newEndDate_month.value;
        const day = parseInt(req.body.action.parameters.newEndDate_day.value) >= 10 ? req.body.action.parameters.newEndDate_day.value : '0' + req.body.action.parameters.newEndDate_day.value;
        const dateFormat = req.body.action.parameters.newEndDate_year.value + month + day;
        
        const newEndDate = moment(dateFormat).format('YYYY-MM-DD');
        console.log("prevEndDate: ", prevEndDate);
        console.log("newEndDate: ", newEndDate);
        
        //변경할 종료날짜가 기존 종료날짜보다 클 경우
        if(prevEndDate > newEndDate){
            let tempDate = moment(newEndDate).add(1, 'd');
            tempDate = moment(tempDate).format('YYYY-MM-DD');

            var secondQuery = "" + 
            "DELETE FROM SCHEDULES " +
            "WHERE userID=:userID AND scheName=:scheName AND scheDate>DATE(:endDate)";

            sequelize.query(secondQuery, {
                replacements: {
                    userID: parseInt(req.body.action.parameters.userID_3.value), 
                    scheName: req.body.action.parameters.AlarmName.value,
                    endDate : newEndDate
                }, 
                type: Sequelize.QueryTypes.SELECT
            }).catch(e => {
                console.error(e);
                next(e);
            });

            Schedule.update({ endDate: new Date(newEndDate)},{
                where: {
                    scheName: req.body.action.parameters.AlarmName.value,
                    userID: parseInt(req.body.action.parameters.userID_3.value)
                }
            }).catch(error => {
                console.error(error);
                next(error);
                return;
            }); 
        }
        
        //변경할 종료날짜가 기존 날짜보다 작을 경우
        else if(prevEndDate < newEndDate){
            try{
                //기존 알람의 종료일자 업데이트
                await Schedule.update({ endDate: newEndDate },{
                    where: {
                        scheName: req.body.action.parameters.AlarmName.value,
                        userID: parseInt(req.body.action.parameters.userID_3.value)
                    }
                }).catch(error => {
                    console.error(error);
                    next(error);
                });

                let num = moment(newEndDate).diff(moment(prevEndDate), 'days');
                console.log("num: ", num);

                //알람 추가
                for(i = 0; i <= num ; i++){
                    //변경할 종료날짜
                    let tempDate = moment(prevEndDate).add(i, 'd');
                    tempDate = moment(tempDate).format('YYYY-MM-DD');
                    //create Schedule
                    await Schedule.create({
                        userID: parseInt(req.body.action.parameters.userID_3.value),
                        scheName: schedule[0].scheName,
                        scheDate: tempDate,
                        scheHour: schedule[0].scheHour,
                        scheMin: schedule[0].scheMin,
                        startDate: schedule[0].startDate,
                        endDate: newEndDate
                    }).then(async(tempSchedule) => {
                        //create MediSchedule
                        await MediSchedule.create({
                            medicineID: schedule[0].medicineID,
                            scheID: tempSchedule.dataValues.scheID,
                            dose: schedule[0].dose,
                            medicineName: schedule[0].medicineName,
                        }).catch(err => {
                            console.error(err);
                            next(err);
                        });
                    }).catch(error => {
                        console.error(error);
                        next(error);
                    });
                }//for문 종료
            } catch(ce){
                console.error(ce);
                next(ce);
            }
        } //else if문 종료

        //RESPONSE
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.Yes_changeEndDate = req.body.action.parameters.Yes_changeEndDate.value;
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }).catch(e => {
        console.error(e);
        next(e);
    });
}

const updateAlarmTime = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);

    if(!(req.body.action.parameters).hasOwnProperty('Yes_changedAlarmTime')){
        //RESPONSE SAMPLE 형식에 맞춤
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.No_changedAlarmTime = req.body.action.parameters.No_changedAlarmTime.value;
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }

    let hour = req.body.action.parameters.newAlarmTime_duration.value === 'PM' ? parseInt(req.body.action.parameters.newAlarmTime_hour.value) + 12 : parseInt(req.body.action.parameters.newAlarmTime_hour.value);
    hour = hour >= 24 ? hour-24 : hour;
    const min = (req.body.action.parameters).hasOwnProperty('alarmTime_min') === true ? parseInt(req.body.action.parameters.newAlarmTime_min.value) : 0;

    await Schedule.update({
        scheHour : hour,
        scheMin: min
    },{
        where: {
            scheName: req.body.action.parameters.AlarmName.value,
            userID: parseInt(req.body.action.parameters.userID_3.value)
        }
    }).then(()=>{
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.Yes_changedAlarmTime = req.body.action.parameters.Yes_changedAlarmTime.value;
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }).catch(err => {
        console.error(err);
        next(err);
    });
}

const updateMedicineName = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);

    if(!(req.body.action.parameters).hasOwnProperty('Yes_changedMedicineName')){
        //RESPONSE SAMPLE 형식에 맞춤
        let resObj = json.resObj();
        resObj.version = req.body.version;
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }

    await Schedule.findAll({
        where: {
            userID: parseInt(req.body.action.parameters.userID_3.value), 
            scheName: req.body.action.parameters.AlarmName.value
        }
    }).then(async (schedule) => {
        await Medicine.findOrCreate({
            where: {
                medicineName : req.body.action.parameters.newMedicineName.value
            },
            attributes: ["medicineID", "medicineName"]
        }).spread(async (medicine) => {
            for(i=0; i<schedule.length; i++){
                await MediSchedule.update({
                    medicineID : medicine.dataValues.medicineID,
                    medicineName: medicine.dataValues.medicineName,
                    dose : req.body.action.parameters.newDosage.values
                }, {
                    where: {scheID : schedule[i].dataValues.scheID}
                }).catch(error => {
                    console.error(error);
                    next(error);
                });
            }//for문 종료
        }).catch(error => {
            console.error(error);
            next(error);
        });
    
    }).catch(e => {
        console.error(e);
        next(e);
    });

    let resObj = json.resObj();
    resObj.version = req.body.version;
    resObj.Yes_changedMedicineName = req.body.action.parameters.Yes_changedMedicineName.value;
    console.log(resObj);
    res.json(resObj);
    res.end();
    return;
}

module.exports = {
    updateEndDate,
    updateAlarmTime,
    updateMedicineName
};
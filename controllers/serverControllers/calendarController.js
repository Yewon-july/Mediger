const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const {Schedule} = require("../../models");

const moment = require('moment');
const momenttz = require('moment-timezone');

const calendar = (req, res) => {
    res.render("calendar",{
    monthToday: moment().format('YYYY년 MM월'),
    userDate: null,
    speciDate: moment().format('MM월 DD일'),
    schedules: null
    });
}

const calendarDetail =  async (req, res) => {
    let dateString=moment().tz('Asia/Seoul').format('YYYY-MM-DD');
    if(req.params.date<0){
        var value = Math.abs(req.params.date);
        dateString = moment(dateString).subtract(value, 'd');
        dateString = moment(dateString).format('YYYY-MM-DD');
    }
    else if (req.params.date>0){
        dateString = moment(dateString).add(req.params.date, 'd');
        dateString = moment(dateString).format('YYYY-MM-DD');
    }
    console.log(dateString);
    await Schedule.findAll({
        where: {
            //test를 위해 임시로 1로 둠
            userID: 1,//req.session.user.userID,
            scheDate: Date.parse(dateString),
        },
        attributes: ["scheID","scheName","scheHour","scheMin", "scheDate", "intake"]
    }).then((schedule) => {
        console.log(schedule);
        res.render("calendar",{
            monthToday: moment().format('YYYY년 MM월'),
            userDate: req.params.date,
            speciDate: moment(dateString).format('MM월 DD일'),
            schedules: schedule
            });
    }).catch((error) => {
        console.error(error);
        next(error);    
    });
}   

const alarmDetail = async (req, res) => {
    var query="" + 
    "SELECT SCHEDULES.scheID, SCHEDULES.scheName, SCHEDULES.scheHour, SCHEDULES.scheMin, SCHEDULES.intake, SCHEDULES.scheDate, MEDISCHEDULES.medicineName, MEDISCHEDULES.dose " + 
    "FROM SCHEDULES JOIN MEDISCHEDULES ON SCHEDULES.scheID=MEDISCHEDULES.scheID " + 
    "WHERE SCHEDULES.scheID=:scheID";

    await sequelize.query(query, 
        {replacements: {scheID: req.params.scheID}, type: Sequelize.QueryTypes.SELECT}
    ).then((alarm) => {
        console.log(alarm);
        alarm[0]["scheDate"] = moment(alarm[0]["scheDate"]).format("MM월 DD일");
        if(parseInt(alarm[0]["scheMin"])<10){
            alarm[0]["scheMin"]='0'+alarm[0]["scheMin"];
        }
        res.render("alarmDetail", {
            date: req.params.date,
            alarms: alarm
        });
    }).catch((error) => {
        console.error(error);
        next(error);
    });
}

const alarmRecord =  async (req, res) => {
    await Schedule.update({intake: true},{
        where: {
            scheID : req.body.scheID
        }
    }).then((schedule)=> {
        console.log(schedule);
        res.redirect("/calendar/"+req.params.date);
    }).catch(error=>{
        console.error(error);
        next(error);
    })
}

module.exports = {
    calendar,
    calendarDetail,
    alarmDetail,
    alarmRecord
};

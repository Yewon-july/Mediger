const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const {Schedule} = require("../../models");
const json = require('./responseController');

const moment = require('moment-timezone');

const whatToTake = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);

    //현재 시간으로부터 전후 1시간에 울릴 알람 리스트
    let hour = parseInt(moment().tz('Asia/Seoul').format('HH'));
    let prevHour = hour-1;
    let nextHour = hour+1;
    if(hour === 00 || hour === '00'){
        prevHour = 23;
    }
    if(hour === 23 || hour === '23'){
        nextHour = 0;
    }

    var query = "SELECT scheName, scheID " + 
        "from SCHEDULES WHERE scheDate=DATE(:scheDate) AND userID=:userID " + 
        "AND scheHour IN (:prevHour, :hour, :nextHour)";
    
    await sequelize.query(query, 
            {replacements: {scheDate: moment().tz('Asia/Seoul').format('YYYY-MM-DD'), userID: req.body.action.parameters.userID_2.value, prevHour: prevHour, hour: parseInt(hour), nextHour: parseInt(nextHour)}, type: Sequelize.QueryTypes.SELECT}
    ).then(results => {
        //울릴 알람이 여러개일 경우
        let alarmNameList = '';
        let scheIDList = '';
        for(var i = 0; i < results.length; i++){
            alarmNameList = alarmNameList +results[i].scheName;
            scheIDList = scheIDList + results[i].scheID;
            if(i < results.length -1){
                alarmNameList = alarmNameList + ', ';
                scheIDList = scheIDList + ', ';
            }
        }

        //RESPONSE SAMPLE 형식에 맞춤
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.medicineList_toTake = alarmNameList;
        resObj.output.askWhatToTake_scheID = scheIDList;

        console.log(resObj);

        res.json(resObj);
        res.end();
        return;
    }).catch(error => {
        console.error(error);
        next(error);
    });
}

const medicationYes = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);
    
    if(!(req.body.action.parameters).hasOwnProperty('Yes_taken')){
        //RESPONSE SAMPLE 형식에 맞춤
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.No_taken = req.body.action.parameters.No_taken.value;
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }
    await Schedule.update({intake: true},{
        where: {
            scheID : parseInt(req.body.action.parameters.askWhatToTake_scheID.value)
        }
    }).then(()=> {
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.medicineList_toTake = req.body.action.parameters.medicineList_toTake.value;
        resObj.output.askWhatToTake_scheID = req.body.action.parameters.askWhatToTake_scheID.value;
        
        console.log(resObj);

        res.json(resObj);
        res.end();
        return;
    }).catch(error => {
        console.error(error);
        next(error);
    })
}

module.exports = {
    whatToTake,
    medicationYes
};
const {Schedule} = require('../../models')

const json = require('./responseController');

const findAlarmInfo = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);

    Schedule.findOne({
        where: { 
            userID: parseInt(req.body.action.parameters.userID_6.value),
            scheName: req.body.action.parameters.alarmName.value
        },
        order: [['endDate', 'DESC']]
    }).then(schedule => {
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.deleteAlarmScheHour = schedule.dataValues.scheHour;
        resObj.output.deleteAlarmScheMin = schedule.dataValues.scheMin;
        resObj.output.deleteAlarmEndDate = schedule.dataValues.endDate;
        resObj.output.deleteAlarmScheID = schedule.dataValues.scheID;
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    })
}
const deleteAlarm = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);

    if(!(req.body.action.parameters).hasOwnProperty('Yes_delete')){
        //RESPONSE SAMPLE 형식에 맞춤
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.No_taken = req.body.action.parameters.No_delete.value;
        resObj.output.alarmName = req.body.action.parameters.alarmName.value
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }

    Schedule.destroy({
        where: {
            userID: parseInt(req.body.action.parameters.userID_6.value),
            scheName: req.body.action.parameters.alarmName.value,
            scheHour: parseInt(req.body.action.parameters.deleteAlarmScheHour.value),
            scheMin: parseInt(req.body.action.parameters.deleteAlarmScheMin.value)
        }
    }).then(()=> {
        let resObj = json.resObj();
        resObj.version = req.body.version;
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }).catch(error => {
        console.error(error);
        next(error);
    });
}
module.exports = {
    findAlarmInfo, 
    deleteAlarm
};
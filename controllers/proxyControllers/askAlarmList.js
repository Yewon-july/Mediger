const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const moment = require('moment-timezone');
const json = require('./responseController');

const alarmList = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);

    //오늘 알람 리스트를 물었을 경우
    ///Answer-alarmListToday 또는 Answer-alarmListOverall
    var scheDate = moment().tz('Asia/Seoul').format('YYYY-MM-DD');

    //특정일의 알람 리스트를 물었을 경우
    ///Answer-alarmListTheDay
    if((req.body.action.parameters).hasOwnProperty('u_theDay') === true){
        const month = parseInt(req.body.action.parameters.u_themonth.value) >= 10 ? req.body.action.parameters.u_themonth.value : '0'+req.body.action.parameters.u_themonth.value;
        const day = parseInt(req.body.action.parameters.u_theDay.value) >= 10 ? req.body.action.parameters.u_theDay.value : '0'+req.body.action.parameters.u_theDay.value;
        var dateFormat = (moment().tz('Asia/Seoul').format('YYYY')).toString() + month + day;
        console.log('dateFormat: ', dateFormat);
        scheDate = moment(dateFormat).tz('Asia/Seoul').format('YYYY-MM-DD');
    }
    //쿼리는 공통적
    var query = "SELECT DISTINCT scheName " + 
        "from SCHEDULES WHERE scheDate=DATE(:scheDate) AND userID=:userID";
        await sequelize.query(query, 
            {replacements:  {scheDate: scheDate, userID: req.body.action.parameters.userID_1.value}, type: Sequelize.QueryTypes.SELECT}
        ).then((results) => {
            console.log(results);
            //울릴 알람이 여러개일 경우
            let resultList = '';
            for(var i = 0; i < results.length; i++){
                resultList = resultList +results[i].scheName;
                if(i < results.length -1){
                    resultList = resultList + ', '
                }
            }
            //RESPONSE SAMPLE 형식에 맞춤
            let resObj = json.resObj();
            resObj.version = req.body.version;
            resObj.output.medicineList = resultList;
            console.log(resObj);
            //NUGU에 전달
            res.json(resObj);
            res.end();
            return;
        }).catch((error) => {
            console.error(error);
            next(error);
        });
}

module.exports = {
    alarmList
};
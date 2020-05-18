const {Schedule} = require('../../models');

const moment = require('moment-timezone');
const json = require('./responseController');

const selectAlarmList = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);

    var scheDate = moment().tz('Asia/Seoul').format('YYYY-MM-DD');

    Schedule.findAll({
        where: {scheDate: scheDate, userID: req.body.action.parameters.userID_5.value, intake: 1}
    }).then((intaken) => {
        console.log(intaken);
        Schedule.findAll({
            where: {scheDate: scheDate, userID: req.body.action.parameters.userID_5.value, intake: 0}
        }).then((notIntaken) => {
            console.log(notIntaken);

            let resObj = json.resObj();
            resObj.version = req.body.version;

            //복용한 약이 없을 경우를 대비한 삼항연산자
            resObj.output.medicineTakenInfo = intaken.length === 0 ? "null" : moreThanOneNames(intaken);

            //복용하지않은 약이 없을 경우를 대비한 삼항연산자
            resObj.output.medicineUntakenInfo = notIntaken.length === 0 ? "null" : moreThanOneNames(notIntaken);
            resObj.output.medicineUntakenScheID = notIntaken.length === 0 ? "null" : moreThanOneScheduleIDs(notIntaken);

            resObj.output.userID_5 = req.body.action.parameters.userID_5.value;

            console.log(resObj);
            res.json(resObj);
            res.end();
            return;
        }).catch(error => {
            console.error(error);
            next(error);
            return;
        });
    }).catch(err => {
        console.error(err);
        next(err);
        return;
    });
}

const updateIntake = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);
    
    if(!((req.body.action.parameters).hasOwnProperty('Yes_medicineTaken')||(req.body.action.parameters).hasOwnProperty('Yes_allNotTaken'))){
        //RESPONSE SAMPLE 형식에 맞춤
        let resObj = json.resObj();
        resObj.version = req.body.version;
        if((req.body.action.parameters).hasOwnProperty('No_medicineTaken')){
            resObj.output.No_medicineTaken = req.body.action.parameters.No_medicineTaken.value;
        }
        if((req.body.action.parameters).hasOwnProperty('No_allNotTaken')){
            resObj.output.No_allNotTaken = req.body.action.parameters.No_allNotTaken.value;
        }
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }

    await Schedule.update({intake: true},{
        where: {
            scheID : parseInt(req.body.action.parameters.medicineUntakenScheID.value)
        }
    }).then(()=> {
        let resObj = json.resObj();
        resObj.version = req.body.version;
        if((req.body.action.parameters).hasOwnProperty('Yes_medicineTaken')){
            resObj.output.Yes_medicineTaken = req.body.action.parameters.Yes_medicineTaken.value;
        }
        if((req.body.action.parameters).hasOwnProperty('Yes_allNotTaken')){
            resObj.output.Yes_allNotTaken = req.body.action.parameters.Yes_allNotTaken.value;
        }
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }).catch(error => {
        console.error(error);
        next(error);
        return;
    });
}

const moreThanOneNames = (result) => {
    let resultList = '';
    for(var i = 0; i < result.length; i++){
        resultList = resultList +result[i].scheName;
        if(i < result.length -1){
            resultList = resultList + ', '
        }
    }
    return resultList;
}

const moreThanOneScheduleIDs = (result) => {
    let resultList = '';
    for(var i = 0; i < result.length; i++){
        resultList = resultList +result[i].scheID;
        if(i < result.length -1){
            resultList = resultList + ', '
        }
    }
    return resultList;
}

module.exports = {selectAlarmList, updateIntake}
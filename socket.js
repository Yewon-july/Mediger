const socketIO = require("socket.io");
var {Schedule} = require("./models");
var moment = require("moment");
var sche = require("node-schedule");
var alarmList = [];

module.exports = (server, app, session) => {
    const io = socketIO(server, {path: '/socket.io'});

    app.set('io',io);
    const add = io.of('/add');
    const alarm = io.of('/alarm');
    io.use((socket,next)=>{
        session(socket.request, socket.request.res,next);
    });
    add.on('connection', (socket) => {
        const req = socket.request;
        console.log("add alarm!");

        socket.on('insert', async (data) => {
            console.log("success!");
            try{
                await Schedule.findAll({
                    where :{
                        userID: req.session.user.userID,
                        intake: 0
                    },
                    attributes: ["scheID","scheName","scheDate","scheHour","scheMin"],
                    order: ["scheDate","scheHour","scheMin"]
                }).then(schedules =>{
                    alarmList = [];
                    for(schedule of schedules)
                    {
                        const date = new Date(schedule.scheDate);
                        alarmList.push({
                            id: schedule.scheID, 
                            name: schedule.scheName, 
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            day: date.getDate(), 
                            hour: schedule.scheHour, 
                            min: schedule.scheMin});
                    }
                });
            }catch(error){
                console.log(error);
            }
        });
        socket.on('disconnect',() =>{
            console.log("close add connection");
        });
        
    });

    alarm.on('connection', (socket)=>{
        console.log("alert alarm!");

        socket.on('ready', (data) =>{
            if(alarmList.length)
            {
                const time = new Date(alarmList[0].year,alarmList[0].month,alarmList[0].day,alarmList[0].hour,alarmList[0].min);
                var j = sche.scheduleJob(time,()=>{
                    var msg = {
                        scheID: alarmList[0].id,
                        scheName: alarmList[0].name,
                        scheHour: alarmList[0].hour,
                        scheMin: alarmList[0].min
                    };
                    socket.emit('alarm',msg);
                    alarmList.shift();
                });
            }
        });
        
    });
};
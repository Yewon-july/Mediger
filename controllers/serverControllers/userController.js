const {User} = require("../../models");

const moment = require('moment');
const userDetail = async (req, res) => {
    try{
        await User.findOne({
            where:{
                //test를 위해 임시로 1로 둠
                userID: 1//req.session.user.userID
            },
            attributes: ["userName","birth","sex","accompanierName","accompanierPhone"]
        }).then((user)=>{
            user.dataValues.birth = moment(user.dataValues.birth).format('YYYY-MM-DD');
            console.log(user)
            res.render("profile",{
                user: user
            });
        })
    }catch(error){
        console.log(error);
        next(error);
    }
};

const userEdit = async (req,res) => {
    try{
        await User.findOne({
            where:{
                userID: 1//req.session.user.userID
            },
            attributes: ["userName","birth","sex","accompanierName","accompanierPhone"]
        }).then((user)=>{
            user.dataValues.birth = moment(user.dataValues.birth).format('YYYY-MM-DD');
            console.log(user);
            res.render("editProfile",{
                user: user
            });
        })
    }catch(error){
        console.log(error);
        next(error);
    }
};

const userUpdate = async (req, res) => {
    try{
        const {accompanierName, accompanierPhone} = req.body;
        await User.update({
            accompanierName: accompanierName,
            accompanierPhone: accompanierPhone
        },{
            where: {
                userID: 1//req.session.user.userID
            }
        }).then((user)=>{
            res.redirect("/user");
        })
    }catch(error){
        console.log(error);
        next(error);
    }
    

};

module.exports = {
    userDetail,
    userEdit,
    userUpdate
};

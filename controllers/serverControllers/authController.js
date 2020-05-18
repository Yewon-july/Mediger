const { User } = require("../../models");


const home = (req, res) => {// Mediger 띄워지는 가장 첫 페이지 join 되어 있는지 확인한다.
    //test를 위해 임시로 함
    res.redirect("/calendar");
    /*
    if (req.session.user) {
        res.redirect("/calendar");
    } else {
        res.redirect("/join");
    }
    */
    
};


const getJoin = (req, res) => {
    res.render("join", {
        title: "join - Mediger"
    });
};

const postJoin = async (req, res) => {
    const { name, birthDay, sex } = req.body;
    try {
        await User.create({
            userName: name,
            birth: birthDay,
            sex: sex
        }).then(user => {
            req.session.user = {
                userID : user.dataValues.userID
            };
        });
        res.redirect("/calendar");
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

module.exports = {
    home,
    getJoin,
    postJoin
};

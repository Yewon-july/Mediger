module.exports = (sequelize, DataTypes) => {
    //약 추천 코드
    return sequelize.define('recommend', {
        focusMediID: { 
            type: DataTypes.INTEGER(15),
            allowNull: false,
            // references: {
            //     model: 'medicine',
            //     key: 'medicineID',
            // },
        },
        recoMediID: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
            // references: {
            //     model: 'medicine',
            //     key: 'medicineID',
            // },
        },
        recoCount: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
        },
    },{
        timestamps: false,
    });
};
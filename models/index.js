const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./users')(sequelize, Sequelize);
db.Medicine = require('./medicines')(sequelize, Sequelize);
db.Schedule = require('./schedules')(sequelize, Sequelize);
db.Recommend = require('./recommends')(sequelize, Sequelize);
db.MediSchedule = require('./mediSchedules')(sequelize, Sequelize);

//db.User.hasMany(db.Schedule);
db.Schedule.belongsTo(db.User, {foreignKey: 'userID', onDelete: 'cascade'});

//db.Medicine.hasMany(db.MediSchedule);
//db.MediSchedule.belongsTo(db.Medicine, {foreignKey: 'medicineID'});

//db.Schedule.hasMany(db.MediSchedule, {foreignKey: 'scheID', sourceKey: 'scheID'});
db.MediSchedule.belongsTo(db.Schedule, {foreignKey: 'scheID', onDelete: 'cascade'});

db.Medicine.belongsToMany(db.Medicine, {
    foreignKey: 'recoMediID',
    as: 'RecoMedicines',
    through: db.Recommend,
});
db.Medicine.belongsToMany(db.Medicine, {
    foreignKey: 'focusMediID',
    as: 'FocusMedicines',
    through: db.Recommend,
});

module.exports = db;
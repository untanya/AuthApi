const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const LightSensor = sequelize.define('LightSensor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    value_lux: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    sensor_id: {
        type: DataTypes.STRING(50),
        defaultValue: 'LIGHT_SENSOR_01'
    }
}, {
    tableName: 'LightSensor'
});

module.exports = LightSensor;
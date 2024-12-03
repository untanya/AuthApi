// migrations/20241203100256-create-light-sensor.js
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('LightSensor', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            value_lux: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            timestamp: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('GETDATE()')
            },
            sensor_id: {
                type: Sequelize.STRING(50),
                defaultValue: 'LIGHT_SENSOR_01'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('GETDATE()')
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('GETDATE()')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('LightSensor');
    }
};
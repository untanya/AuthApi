'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // 1. Create new Sensors table
      await queryInterface.createTable('Sensors', {
        id: {
          type: Sequelize.STRING(50),
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        location: {
          type: Sequelize.STRING(200),
          allowNull: true
        }
      });

      // 2. Insert default sensor
      await queryInterface.bulkInsert('Sensors', [{
        id: 'LIGHT_SENSOR_01',
        name: 'Capteur Principal',
        location: 'Zone A'
      }]);

      // 3. Create new measurements table
      await queryInterface.createTable('LightMeasurements', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        value_lux: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        timestamp: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        sensor_id: {
          type: Sequelize.STRING(50),
          allowNull: false,
          references: {
            model: 'Sensors',
            key: 'id'
          }
        }
      });

    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert all changes in reverse order
    await queryInterface.dropTable('LightMeasurements');
    await queryInterface.dropTable('Sensors');
  }
};
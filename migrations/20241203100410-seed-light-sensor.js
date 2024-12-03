// migrations/20241203100410-seed-light-sensor.js
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const data = [];
        const startDate = new Date('2024-12-03 00:00:00');
        
        for (let i = 0; i < 500; i++) {
            const currentTime = new Date(startDate.getTime() + i * 3 * 60000); // 3 minutes d'intervalle
            const hour = currentTime.getHours();
            
            // Calcul de la valeur de base selon l'heure
            const baseValue = (() => {
                if (hour <= 4) return 5;  // Nuit
                if (hour <= 7) return 100 + (hour - 5) * 200;  // Lever du soleil
                if (hour <= 11) return 800;  // Matin
                if (hour <= 14) return 1000;  // Midi
                if (hour <= 17) return 800;  // Après-midi
                if (hour <= 20) return 400 - (hour - 18) * 100;  // Coucher du soleil
                return 10;  // Soirée
            })();
            
            // Ajout d'une variation aléatoire de ±50 lux
            const randomVariation = (Math.random() - 0.5) * 100;

            data.push({
                value_lux: Math.max(0, baseValue + randomVariation),  // Évite les valeurs négatives
                timestamp: currentTime,
                sensor_id: 'LIGHT_SENSOR_01',
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        await queryInterface.bulkInsert('LightSensor', data);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('LightSensor', null, {});
    }
};

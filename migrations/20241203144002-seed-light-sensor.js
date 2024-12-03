// migrations/20241203100410-seed-light-sensor.js

const baseValue = (() => {
  if (hour <= 4) return 5;  // Nuit -> minimum 5 lux
  if (hour <= 7) return 100 + (hour - 5) * 200;  
  if (hour <= 11) return 800;
  if (hour <= 14) return 1000;
  if (hour <= 17) return 800;
  if (hour <= 20) return Math.max(100, 400 - (hour - 18) * 100);
  return 10;
})();

// Variation plus contrôlée
const randomVariation = (baseValue * 0.2) * (Math.random() - 0.5); // ±20% de variation
data.push({
  value_lux: Math.max(1, baseValue + randomVariation), // Minimum 1 lux
  timestamp: currentTime,
  sensor_id: 'LIGHT_SENSOR_01'
});
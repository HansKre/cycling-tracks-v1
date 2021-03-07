const simplify = require('simplify-js');
const fs = require('fs');

const tolerance = 0.001; //-70%
const highQuality = true;

const data = fs.readFileSync('./public/activity-details/heatmap-orig.json');

// Must convert to an array of points of {x: Number, y: Number} format.
const inData = JSON.parse(data);
const points = inData.map(d => {
    return { x: d.lat, y: d.lng, intensity: d.intensity.toFixed(2) }
});

const simplifiedPoints = simplify(points, tolerance, highQuality);

const out = simplifiedPoints.map(p => {
    return { lat: p.x, lng: p.y, intensity: p.intensity };
})

console.log(points.length, simplifiedPoints.length, (simplifiedPoints.length / points.length).toFixed(1) - 1);

fs.writeFileSync('./public/activity-details/heatmap.json', JSON.stringify(out));
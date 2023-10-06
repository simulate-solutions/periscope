function generateRandomHeatmapData(numPoints, minX, maxX, minY, maxY) {
    var heatmapData = [];

    for (var i = 0; i < numPoints; i++) {
        var x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        var y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

        heatmapData.push({ x: x, y: y, value: 1 });
    }

    return heatmapData;
}

function generateHeatmapAndDisplay(numPoints, minX, maxX, minY, maxY, containerId) {
    var combinedHeatmapData = [];

    function generateAndAppendHeatmapData(numPoints, minX, maxX, minY, maxY) {
        var heatmapData = generateRandomHeatmapData(numPoints, minX, maxX, minY, maxY);
        combinedHeatmapData = combinedHeatmapData.concat(heatmapData);
    }

    // Generate heatmap data for each set of coordinates
    generateAndAppendHeatmapData(numPoints, 450, 480, 70, 550);
    generateAndAppendHeatmapData(numPoints, 550, 580, 70, 550);
    generateAndAppendHeatmapData(numPoints, 150, 180, 370, 450);
    generateAndAppendHeatmapData(numPoints, 250, 680, 250, 550);

    // Create a heatmap instance
    var heatmapInstance = h337.create({
        container: document.getElementById(containerId),
        radius: 25, // Adjust the radius as needed
        maxOpacity: 0.6,
        minOpacity: 0.1,
        blur: 0.75,
    });

    // Convert the data format to heatmap.js format
    var heatmapDataFormatted = {
        max: Math.max.apply(null, combinedHeatmapData.map(function (point) { return point.value; })),
        data: combinedHeatmapData,
    };

    // Set the data for the heatmap
    heatmapInstance.setData(heatmapDataFormatted);
}

// Example usage:
generateHeatmapAndDisplay(10, 450, 480, 70, 550, 'heatmapContainer');

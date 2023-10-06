function sumLists(list1, list2) {
    var sum1 = list1.reduce((acc, val) => acc + val, 0);
    var sum2 = list2.reduce((acc, val) => acc + val, 0);
    return sum1 + sum2;
}

function randn_bm(min, max, skew) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0)
        num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range

    else {
        num = Math.pow(num, skew) // Skew
        num *= max - min // Stretch to fill range
        num += min // offset to min
    }
    return num
}


// Function to generate random data samples from a normal distribution
function generateNormalDistribution(mean, stdDev, numSamples) {
    const data = [];
    for (let i = 0; i < numSamples; i++) {
        const sample = randn_bm(mean - 3 * stdDev, mean + 3 * stdDev, 1);
        data.push(sample);
    }
    return data;
}


// Function to create overlay histograms and KDEs for male and female heights
function createOverlayHistogramWithKDE(maleMean, femaleMean, stdDev, numSamples) {
    const maleHeights = generateNormalDistribution(maleMean, stdDev, numSamples);
    const femaleHeights = generateNormalDistribution(femaleMean, stdDev, numSamples);

    const sumHeights = sumLists(maleHeights, femaleHeights);

    // Create KDE traces for male and female heights
    const maleKDETrace = {
        x: maleHeights,
        type: 'histogram',
        name: 'Bad Scenario',
        opacity: 0.5,
        marker: {
            color: 'orange',
        },
        xaxis: 'x2', // Use the second x-axis for the KDE
        yaxis: 'y2', // Use the second y-axis for the KDE
        histnorm: 'probability density', // Normalize the KDE to match the histogram
        nbinsx: 50, // Number of bins for the KDE
    };

    const femaleKDETrace = {
        x: femaleHeights,
        type: 'histogram',
        name: 'Good Scenario',
        opacity: 0.5,
        marker: {
            color: 'green',
        },
        xaxis: 'x2', // Use the second x-axis for the KDE
        yaxis: 'y2', // Use the second y-axis for the KDE
        histnorm: 'probability density', // Normalize the KDE to match the histogram
        nbinsx: 50, // Number of bins for the KDE
    };

    const data = [maleKDETrace, femaleKDETrace];

    const layout = {
        title: 'Casualties and Kernel Density Estimation',
        xaxis: { title: 'Casualties' },
        yaxis: { title: 'Frequency' },
        xaxis2: { title: 'Casualties', anchor: 'y2' }, // Second x-axis for the KDEs
        yaxis2: { title: 'Probability Density', overlaying: 'y', side: 'right' }, // Second y-axis for the KDEs
        barmode: 'overlay',
    };

    Plotly.newPlot('height-histogram', data, layout);

    return sumHeights;
}

function generateRandomHeatmapData(numPoints, minX, maxX, minY, maxY) {
    var heatmapData = [];

    for (var i = 0; i < numPoints; i++) {
        var x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        var y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

        heatmapData.push({ x: x, y: y, value: 1 });
    }

    return heatmapData;
}

function generateHeatmapAndDisplay(containerId, totalPoints) {

    var numPoints = Math.round(totalPoints / 10);
    var combinedHeatmapData = [];

    function generateAndAppendHeatmapData(numPoints, minX, maxX, minY, maxY) {
        var heatmapData = generateRandomHeatmapData(numPoints, minX, maxX, minY, maxY);
        combinedHeatmapData = combinedHeatmapData.concat(heatmapData);
    }

    // Generate heatmap data for each set of coordinates
    generateAndAppendHeatmapData(numPoints, 450, 480, 70, 550);
    generateAndAppendHeatmapData(numPoints, 550, 580, 70, 550);
    generateAndAppendHeatmapData(numPoints, 110, 190, 400, 450);
    generateAndAppendHeatmapData(numPoints, 150, 600, 250, 550);

    // Remove the previous heatmap container if it exists
    var heatmapContainer = document.getElementById(containerId);
    if (heatmapContainer) {
        heatmapContainer.innerHTML = '';
    }

    // Create a heatmap instance
    var heatmapInstance = h337.create({
        container: document.getElementById(containerId),
        radius: 15, // Adjust the radius as needed
        maxOpacity: 0.6,
        minOpacity: 0.1,
        blur: 0.75,
    });

    // Clear the previous heatmap data (if any)
    heatmapInstance.removeData();

    // Convert the data format to heatmap.js format
    var heatmapDataFormatted = {
        max: Math.max.apply(null, combinedHeatmapData.map(function (point) { return point.value; })),
        data: combinedHeatmapData,
    };

    // Set the data for the heatmap
    heatmapInstance.setData(heatmapDataFormatted);
}

// Event listeners for each day button
const dayButtons = document.querySelectorAll('.day-button');
console.log(dayButtons);

dayButtons.forEach((button, index) => {
    button.addEventListener('click', () => {

        // Log the clicked button's text (e.g., "Monday", "Tuesday", etc.)
        console.log(`Button Clicked: ${button.textContent}`);

        // Define unique male and female mean values for each day
        const maleMeans = [10, 9, 8, 8, 6, 11, 12];
        const femaleMeans = [6, 7, 8, 7, 10, 5, 9];

        // Retrieve the mean values for the clicked day
        const index = Array.from(dayButtons).indexOf(button);
        const maleMean = maleMeans[index];
        const femaleMean = femaleMeans[index];

        // Update the distribution chart
        sumHeights = createOverlayHistogramWithKDE(maleMean, femaleMean, 2, 100);
        generateHeatmapAndDisplay('heatmapContainer', sumHeights);
    });
});

let sumHeights = 0;
const maleMean = 10; // Mean (average) height for males
const femaleMean = 6; // Mean (average) height for females
const stdDev = 2; // Standard deviation
const numSamples = 100; // Number of samples

sumHeights = createOverlayHistogramWithKDE(maleMean, femaleMean, stdDev, numSamples);
generateHeatmapAndDisplay('heatmapContainer', sumHeights);

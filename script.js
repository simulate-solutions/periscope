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

// Function to select a random sample of n elements
function getRandomSample(array, n) {
    const shuffled = array.slice(); // Create a shallow copy of the original array
    let currentIndex = shuffled.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        temporaryValue = shuffled[currentIndex];
        shuffled[currentIndex] = shuffled[randomIndex];
        shuffled[randomIndex] = temporaryValue;
    }

    // Slice the first n elements to get the random sample
    return shuffled.slice(0, n);
}

function generateHeatmapAndDisplay(containerId, totalPoints) {

    // Remove the previous heatmap container if it exists
    var heatmapContainer = document.getElementById(containerId);
    if (heatmapContainer) {
        heatmapContainer.innerHTML = '';
    }

    // Create a heatmap instance
    var heatmapInstance = h337.create({
        container: document.getElementById(containerId),
        radius: 7, // Adjust the radius as needed
        maxOpacity: 0.99,
        minOpacity: 0.01,
        blur: 1,
    });

    // Clear the previous heatmap data (if any)
    heatmapInstance.removeData();

    var heatmapDataSample = getRandomSample(heatmapData, totalPoints);

    // Convert the data format to heatmap.js format
    var heatmapDataFormatted = {
        max: Math.max.apply(null, heatmapDataSample.map(function (point) { return point.value; })),
        data: heatmapDataSample,
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

        const dayGoodMeans = [10, 9, 8, 8, 6, 11, 12];
        const dayBadMeans = [6, 7, 8, 7, 10, 5, 9];


        // Retrieve the mean values for the clicked day
        const index = Array.from(dayButtons).indexOf(button);
        const dayGoodMean = dayGoodMeans[index];
        const dayBadMean = dayBadMeans[index];

        // Update the distribution chart
        createBellCurveChart(dayGoodMean, dayBadMean);
        generateHeatmapAndDisplay('heatmapContainer', sumHeights);
    });
});


function createBellCurveChart(scalingFactor1, scalingFactor2) {
    // Create data for the first bell curve
    const curve1Data = {
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines',
        name: 'Bad scenario',
        line: { color: 'red' }
    };

    // Create data for the second bell curve
    const curve2Data = {
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines',
        name: 'Good scenario',
        line: { color: 'green' }
    };

    const numPoints1 = 1000; // Number of data points for each curve
    const numPoints2 = 200; // Number of data points for each curve
    const mu1 = 0; // Mean of the first curve
    const sigma1 = 1; // Standard deviation of the first curve
    const mu2 = 0; // Mean of the second curve
    const sigma2 = 1.5; // Standard deviation of the second curve

    // Generate data points for the bell curves
    for (let i = 0; i < numPoints1; i++) {
        const x1 = mu1 - 3 * sigma1 + (6 * sigma1 * i) / numPoints1;
        const y1 = scalingFactor1 * (1 / (sigma1 * Math.sqrt(2 * Math.PI))) * Math.exp(-((x1 - mu1) ** 2) / (2 * sigma1 ** 2));
        curve1Data.x.push(x1);
        curve1Data.y.push(y1);
    }

    for (let i = 0; i < numPoints2; i++) {
        const x2 = mu2 - 3 * sigma2 + (6 * sigma2 * i) / numPoints2;
        const y2 = scalingFactor2 * (1 / (sigma2 * Math.sqrt(2 * Math.PI))) * Math.exp(-((x2 - mu2) ** 2) / (2 * sigma2 ** 2));
        curve2Data.x.push(x2);
        curve2Data.y.push(y2);
    }

    // Create the layout for the chart
    const layout = {
        title: 'MSA - Casualty comparison',
        xaxis: {
            title: '',
            showticklabels: false // Hide x-axis tick labels
        },
        yaxis: { title: 'Casualty count' }
    };

    // Create the Plotly chart
    Plotly.newPlot('bellCurveChart', [curve1Data, curve2Data], layout);
}


let sumHeights = 900;
const maleMean = 10; // Mean (average) height for males
const femaleMean = 6; // Mean (average) height for females
const stdDev = 2; // Standard deviation
const numSamples = 100; // Number of samples
const scalingFactor1 = 10;
const scalingFactor2 = 10;

// sumHeights = createOverlayHistogramWithKDE(maleMean, femaleMean, stdDev, numSamples);
generateHeatmapAndDisplay('heatmapContainer', sumHeights);

// Call the function to generate the chart
createBellCurveChart(scalingFactor1, scalingFactor2);

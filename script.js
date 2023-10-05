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
}

// Event listeners for each day button
const dayButtons = document.querySelectorAll('.day-button');
console.log(dayButtons);

dayButtons.forEach((button, index) => {
    button.addEventListener('click', () => {

        // Log the clicked button's text (e.g., "Monday", "Tuesday", etc.)
        console.log(`Button Clicked: ${button.textContent}`);

        // Define unique male and female mean values for each day
        const maleMeans = [10, 9, 8, 7, 6, 5, 4];
        const femaleMeans = [6, 7, 8, 9, 10, 11, 12];

        // Retrieve the mean values for the clicked day
        const index = Array.from(dayButtons).indexOf(button);
        const maleMean = maleMeans[index];
        const femaleMean = femaleMeans[index];

        // Update the distribution chart
        createOverlayHistogramWithKDE(maleMean, femaleMean, 2, 100);

        removeAllDots()
        // Update the dots
        createDotsInArea(imageElement, 35, 70, 30, 2, 40);
        createDotsInArea(imageElement, 15, 60, 70, 10, 2);


    });
});

function removeAllDots() {
    for (const dot of dots) {
        dot.remove();
    }
    // Clear the array
    dots.length = 0;
}

function createDotsInArea(imageElement, numDots, areaX, areaY, areaWidth, areaHeight) {
    const container = imageElement.parentElement;

    for (let i = 0; i < numDots; i++) {
        const randomX = areaX + Math.random() * areaWidth;
        const randomY = areaY + Math.random() * areaHeight;

        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.top = `${randomY}%`;
        dot.style.left = `${randomX}%`;

        container.appendChild(dot);

        // Add the dot to the array
        dots.push(dot);
    }
}

const dots = [];
const imageElement = document.querySelector('img');
const maleMean = 10; // Mean (average) height for males
const femaleMean = 6; // Mean (average) height for females
const stdDev = 2; // Standard deviation
const numSamples = 100; // Number of samples

createDotsInArea(imageElement, 35, 70, 30, 2, 40);
createDotsInArea(imageElement, 15, 60, 70, 10, 2);
createOverlayHistogramWithKDE(maleMean, femaleMean, stdDev, numSamples);

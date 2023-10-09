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

const scaling_factor = 10;

// Generate data points for the bell curves
for (let i = 0; i < numPoints1; i++) {
    const x1 = mu1 - 3 * sigma1 + (6 * sigma1 * i) / numPoints1;
    const y1 = scaling_factor * (1 / (sigma1 * Math.sqrt(2 * Math.PI))) * Math.exp(-((x1 - mu1) ** 2) / (2 * sigma1 ** 2));
    curve1Data.x.push(x1);
    curve1Data.y.push(y1);
}

for (let i = 0; i < numPoints2; i++) {
    const x2 = mu2 - 3 * sigma2 + (6 * sigma2 * i) / numPoints2;
    const y2 = scaling_factor * (1 / (sigma2 * Math.sqrt(2 * Math.PI))) * Math.exp(-((x2 - mu2) ** 2) / (2 * sigma2 ** 2));
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

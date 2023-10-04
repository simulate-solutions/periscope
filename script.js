// Sample height data (replace with your data)
const maleHeights = [160, 165, 170, 175, 180, 185, 190];
const femaleHeights = [150, 155, 160, 165, 170, 175, 180];

// Combine both datasets for the histogram
const allHeights = [...maleHeights, ...femaleHeights];

// Define the SVG dimensions
const margin = { top: 30, right: 30, bottom: 60, left: 60 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

// Create an SVG element within the plot-container
const svg = d3.select("#plot-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create a histogram using D3.js
const histogram = d3
    .histogram()
    .domain([d3.min(allHeights), d3.max(allHeights)])
    .thresholds(10) // Number of bins
    (allHeights);

// Define scales for x and y axes
const x = d3.scaleLinear()
    .domain([d3.min(allHeights), d3.max(allHeights)])
    .range([0, width]);

const y = d3.scaleLinear()
    .domain([0, d3.max(histogram, d => d.length)])
    .nice()
    .range([height, 0]);

// Create bars for the histogram
svg.selectAll("rect")
    .data(histogram)
    .enter()
    .append("rect")
    .attr("x", d => x(d.x0) + 1)
    .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
    .attr("y", d => y(d.length))
    .attr("height", d => y(0) - y(d.length))
    .style("fill", "steelblue");

// Add x and y axes
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("Height (cm)"); // X-axis label

svg.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .text("Frequency"); // Y-axis label

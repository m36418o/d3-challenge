// Complete in collaboration with Ashley Patricia Parra. 
// Step 1: Set up our chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("div#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from the donuts.csv file
d3.csv("assets/data/data.csv").then(function(importData){
    var stateAbbr = [];
    var healthcare = [];
    var poverty = []
    importData.forEach(function(data){
        stateAbbr.push(data.abbr);
        healthcare.push(parseInt(data.healthcare));
        poverty.push(parseFloat(data.poverty));
    })
    
    // Setting scales
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(healthcare) + 3])
    .range([height, 0]);

    var xScale = d3.scaleLinear()
    .domain([d3.min(poverty) - 1, d3.max(poverty) + 2])
    .range([0, width]);

    // Create axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // set x to the bottom of the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // set y to the y axis
    // This syntax allows us to call the axis function
    // and pass in the selector without breaking the chaining
    chartGroup.append("g")
      .call(leftAxis);

    // Add axes labels
    // x-axis
    chartGroup.append("text")
      .attr("x", 450)
      .attr("y", 450)
      .attr("dy", ".75em")
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "black")
      .text("Poverty %");
    // y-axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -170)
      .attr("dy", ".75em")    
      .attr("text-anchor", "end")
      .attr("font-size", "16px")
      .attr("fill", "black")
      .text("Healthcare %");

    // Append circles to data points
    var circlesGroup = chartGroup.selectAll("circle")
      .data(importData)
      .enter()
      .append("circle")
      // .attr("cx", (d, i) => xScale(i))
      // .attr("cy", d => yScale(d))
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yScale(d.healthcare))
      .attr("r", "12")
      .attr("fill", "royalblue");

    // Add State abbreviations to circles
    svg.append("g")
      .selectAll("circle")
      .data(importData)
      .enter()
      .append("text")
      .text(function(d) {
        return d.abbr
      })
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("dx", (d) => {return xScale(d.poverty)})
      .attr("dy", (d) => {return yScale(d.healthcare)})
      .attr("font-size", "10px")
      .attr("class", "stateText");
});
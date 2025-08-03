
const svg = d3.select("#vis");
const width = +svg.attr("width");
const height = +svg.attr("height");

let state = {
  scene: 0,
  data: []
};

d3.csv("dataset.csv").then(data => {
  state.data = data;
  setScene(0);
});

function setScene(sceneIndex) {
  state.scene = sceneIndex;
  svg.selectAll("*").remove(); // Clear previous scene

  clearScene();

  const margin = { top: 40, right: 150, bottom: 50, left: 60 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const x = d3.scaleLinear()
    .domain([d3.min(data, d => d.horsepower) - 5, d3.max(data, d => d.horsepower) + 5])
    .range([margin.left, margin.left + plotWidth]);

  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.mpg) - 2, d3.max(data, d => d.mpg) + 2])
    .range([margin.top + plotHeight, margin.top]);

  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  svg.append("g")
    .attr("transform", `translate(0,${margin.top + plotHeight})`)
    .call(xAxis)
    .append("text")
    .attr("x", plotWidth / 2)
    .attr("y", 35)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Horsepower");

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -plotHeight / 2)
    .attr("y", -40)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("MPG");

  // Add legend
  const legend = svg.selectAll(".legend")
    .data(Object.entries(originColor))
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(${width - 100},${50 + i * 25})`);

  legend.append("rect")
    .attr("x", 0)
    .attr("width", 12)
    .attr("height", 12)
    .style("fill", d => d[1]);

  legend.append("text")
    .attr("x", 20)
    .attr("y", 10)
    .text(d => d[0]);


  if (sceneIndex === 0) scene1();
  else if (sceneIndex === 1) scene2();
  else if (sceneIndex === 2) scene3();
}


////////////////////////////////////////////////////////
function scene1() {
  svg.append("text")
    .attr("x", 20)
    .attr("y", 30)
    .text("Scene 1: Overview")
    .style("font-size", "18px");

  svg.selectAll("circle")
    .data(state.data)
    .enter()
    .append("circle")
    .attr("cx", d => +d.horsepower * 3)
    .attr("cy", d => height - +d.mpg * 5)
    .attr("r", 5)
    .attr("fill", "steelblue");

  addAnnotation("High efficiency", 150, 200);
}

////////////////////////////////////////////////////////////
function scene2() {
  svg.append("text")
    .attr("x", 20)
    .attr("y", 30)
    .text("Scene 2: Highlight High MPG")
    .style("font-size", "18px");

  svg.selectAll("circle")
    .data(state.data.filter(d => +d.mpg > 30))
    .enter()
    .append("circle")
    .attr("cx", d => +d.horsepower * 3)
    .attr("cy", d => height - +d.mpg * 5)
    .attr("r", 6)
    .attr("fill", "green");

  addAnnotation("Cars >30 MPG", 120, 180);
}

///////////////////////////////////////////////////////////////
function scene3() {
  svg.append("text")
    .attr("x", 20)
    .attr("y", 30)
    .text("Scene 3: By Origin")
    .style("font-size", "18px");

  const colorScale = d3.scaleOrdinal()
    .domain(["USA", "Europe", "Japan"])
    .range(["red", "blue", "orange"]);

  svg.selectAll("circle")
    .data(state.data)
    .enter()
    .append("circle")
    .attr("cx", d => +d.horsepower * 3)
    .attr("cy", d => height - +d.mpg * 5)
    .attr("r", 5)
    .attr("fill", d => colorScale(d.origin));

  addAnnotation("Country origin colored", 160, 220);
  addLegend(colorScale);
}

function addAnnotation(label, x, y) {
  const annotations = [{
    note: {
      label: label,
      title: "Note"
    },
    x: x,
    y: y,
    dy: -30,
    dx: 50
  }];

  const makeAnnotations = d3.annotation()
    .annotations(annotations);

  svg.append("g").call(makeAnnotations);
}

function addLegend(colorScale) {
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 150}, 60)`);

  const origins = colorScale.domain();
  origins.forEach((origin, i) => {
    legend.append("rect")
      .attr("x", 0)
      .attr("y", i * 20)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", colorScale(origin));

    legend.append("text")
      .attr("x", 20)
      .attr("y", i * 20 + 10)
      .text(origin)
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
  });
}




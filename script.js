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
  
  if (sceneIndex === 0) scene1();
  else if (sceneIndex === 1) scene2();
  else if (sceneIndex === 2) scene3();
}

// Scene 1: Basic scatterplot
function scene1() {
  const margin = { top: 40, right: 150, bottom: 50, left: 60 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Define x and y scales
  const x = d3.scaleLinear()
    .domain([d3.min(state.data, d => +d.horsepower) - 10, d3.max(state.data, d => +d.horsepower) + 10])
    .range([margin.left, margin.left + plotWidth]);

  const y = d3.scaleLinear()
    .domain([d3.min(state.data, d => +d.mpg) - 2, d3.max(state.data, d => +d.mpg) + 2])
    .range([margin.top + plotHeight, margin.top]);

  // Add x-axis
  svg.append("g")
    .attr("transform", `translate(0,${margin.top + plotHeight})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("x", plotWidth / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Horsepower");

  // Add y-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -plotHeight / 2)
    .attr("y", -40)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("MPG");
	
  svg.append("text")
    .attr("x", 20)
    .attr("y", 30)
    .text("Scene 1: Overview")
    .style("font-size", "18px");

  // Draw scatterplot circles
  svg.selectAll("circle")
    .data(state.data)
    .enter()
    .append("circle")
    .attr("cx", d => +d.horsepower * 3)
    .attr("cy", d => height - +d.mpg * 5)
    .attr("r", 5)
    .attr("fill", "steelblue");

  // Annotations
  addAnnotation("High efficiency", 150, 200);
}

// Scene 2: Filtered or sorted data
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

// Scene 3: Categorical color encoding
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
}

// Annotation helper
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

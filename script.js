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

  // Coordinator label for current scene
  svg.append("text")
    .attr("id", "scene-label")
    .attr("x", width - 200)
    .attr("y", 30)
    .style("font-size", "16px")
    .style("fill", "gray")
    .text("Scene: " + (sceneIndex + 1));

  if (sceneIndex === 0) scene1();
  else if (sceneIndex === 1) scene2();
  else if (sceneIndex === 2) scene3();
}

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


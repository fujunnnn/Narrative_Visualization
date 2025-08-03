const width = 800, height = 500;
const svg = d3.select("#viz").append("svg")
  .attr("width", width)
  .attr("height", height);

const data = [
  { mpg: 35, horsepower: 70, origin: "USA" },
  { mpg: 32, horsepower: 65, origin: "Europe" },
  { mpg: 38, horsepower: 60, origin: "Japan" },
  { mpg: 36, horsepower: 67, origin: "Europe" },
  { mpg: 34, horsepower: 72, origin: "USA" },
  { mpg: 40, horsepower: 58, origin: "Japan" },
  { mpg: 33, horsepower: 66, origin: "Europe" },
  { mpg: 37, horsepower: 63, origin: "Japan" },
  { mpg: 31, horsepower: 75, origin: "USA" },
  { mpg: 39, horsepower: 59, origin: "Japan" }
];

const originColor = {
  "USA": "red",
  "Europe": "blue",
  "Japan": "orange"
};

function clearScene() {
  svg.selectAll("*").remove();
}

function setScene(scene) {
  clearScene();

  svg.append("text")
    .attr("x", 20)
    .attr("y", 30)
    .text("Scene " + scene + ": " + (scene === 1 ? "Overview" : scene === 2 ? "High MPG Cars" : "By Origin"))
    .attr("font-size", "18px");

  let filteredData = data;

  if (scene === 2) {
    filteredData = data.filter(d => d.mpg > 30);
  }

  svg.selectAll("circle")
    .data(filteredData)
    .enter()
    .append("circle")
    .attr("cx", d => d.horsepower * 10)
    .attr("cy", d => height - d.mpg * 10)
    .attr("r", 6)
    .attr("fill", d => scene === 3 ? originColor[d.origin] : "steelblue");

  if (scene === 3) {
    svg.append("g").attr("class", "legend")
      .selectAll("g")
      .data(Object.keys(originColor))
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(20,${50 + i * 20})`)
      .call(g => {
        g.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", d => originColor[d]);
        g.append("text")
          .attr("x", 15)
          .attr("y", 10)
          .text(d => d);
      });

    const makeAnnotations = d3.annotation()
      .annotations([
        {
          note: {
            label: "Country origin colored",
            title: "Note"
          },
          x: 100,
          y: 200,
          dx: 80,
          dy: -30
        }
      ]);
    svg.append("g")
      .call(makeAnnotations);
  }

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("class", "coordinator")
    .text("Coordinator: Scene " + scene);
}
// const svg = d3.select("#vis");
// const width = +svg.attr("width");
// const height = +svg.attr("height");

// let state = {
//   scene: 0,
//   data: []
// };

// d3.csv("dataset.csv").then(data => {
//   state.data = data;
//   setScene(0);
// });

// function setScene(sceneIndex) {
//   state.scene = sceneIndex;
//   svg.selectAll("*").remove(); // Clear previous scene

//   // Coordinator label - bottom right
//   svg.append("text")
//     .attr("id", "scene-label")
//     .attr("x", width - 120)
//     .attr("y", height - 10)
//     .style("font-size", "14px")
//     .style("fill", "#999")
//     .style("font-style", "italic")
//     .text("Coordinator: Scene " + (sceneIndex + 1));

//   if (sceneIndex === 0) scene1();
//   else if (sceneIndex === 1) scene2();
//   else if (sceneIndex === 2) scene3();
// }

// function scene1() {
//   svg.append("text")
//     .attr("x", 20)
//     .attr("y", 30)
//     .text("Scene 1: Overview")
//     .style("font-size", "18px");

//   svg.selectAll("circle")
//     .data(state.data)
//     .enter()
//     .append("circle")
//     .attr("cx", d => +d.horsepower * 3)
//     .attr("cy", d => height - +d.mpg * 5)
//     .attr("r", 5)
//     .attr("fill", "steelblue");

//   addAnnotation("High efficiency", 150, 200);
// }

// function scene2() {
//   svg.append("text")
//     .attr("x", 20)
//     .attr("y", 30)
//     .text("Scene 2: Highlight High MPG")
//     .style("font-size", "18px");

//   svg.selectAll("circle")
//     .data(state.data.filter(d => +d.mpg > 30))
//     .enter()
//     .append("circle")
//     .attr("cx", d => +d.horsepower * 3)
//     .attr("cy", d => height - +d.mpg * 5)
//     .attr("r", 6)
//     .attr("fill", "green");

//   addAnnotation("Cars >30 MPG", 120, 180);
// }

// function scene3() {
//   svg.append("text")
//     .attr("x", 20)
//     .attr("y", 30)
//     .text("Scene 3: By Origin")
//     .style("font-size", "18px");

//   const colorScale = d3.scaleOrdinal()
//     .domain(["USA", "Europe", "Japan"])
//     .range(["red", "blue", "orange"]);

//   svg.selectAll("circle")
//     .data(state.data)
//     .enter()
//     .append("circle")
//     .attr("cx", d => +d.horsepower * 3)
//     .attr("cy", d => height - +d.mpg * 5)
//     .attr("r", 5)
//     .attr("fill", d => colorScale(d.origin));

//   addAnnotation("Country origin colored", 160, 220);
//   addLegend(colorScale);
// }

// function addAnnotation(label, x, y) {
//   const annotations = [{
//     note: {
//       label: label,
//       title: "Note"
//     },
//     x: x,
//     y: y,
//     dy: -30,
//     dx: 50
//   }];

//   const makeAnnotations = d3.annotation()
//     .annotations(annotations);

//   svg.append("g").call(makeAnnotations);
// }

// function addLegend(colorScale) {
//   const legend = svg.append("g")
//     .attr("transform", `translate(${width - 150}, 60)`);

//   const origins = colorScale.domain();
//   origins.forEach((origin, i) => {
//     legend.append("rect")
//       .attr("x", 0)
//       .attr("y", i * 20)
//       .attr("width", 12)
//       .attr("height", 12)
//       .attr("fill", colorScale(origin));

//     legend.append("text")
//       .attr("x", 20)
//       .attr("y", i * 20 + 10)
//       .text(origin)
//       .style("font-size", "12px")
//       .attr("alignment-baseline", "middle");
//   });
// }


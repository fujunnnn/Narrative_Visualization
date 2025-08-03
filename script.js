const svg = d3.select('#vis');
const width = +svg.attr('width');
const height = +svg.attr('height');
// Set up margins and inner chart dimensions
const margin = { top: 40, right: 150, bottom: 50, left: 60 };
const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.top - margin.bottom;

const colorScale = d3
  .scaleOrdinal()
  .domain(['USA', 'Europe', 'Japan'])
  .range(['red', 'blue', 'orange']);

let state = {
  scene: 0,
  data: [],
};

d3.csv('dataset.csv').then(data => {
  state.data = data;
  setScene(0);
});

function setScene(sceneIndex) {
  state.scene = sceneIndex;
  svg.selectAll('*').remove(); // Clear previous scene

  if (sceneIndex === 0) scene1();
  else if (sceneIndex === 1) scene2();
  else if (sceneIndex === 2) scene3();
}

function setCoordinateSystem() {
  // Define x and y scales
  const x = d3
    .scaleLinear()
    .domain([
      d3.min(state.data, d => +d.horsepower) - 10,
      d3.max(state.data, d => +d.horsepower) + 10,
    ])
    .range([margin.left, margin.left + plotWidth]);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(state.data, d => +d.mpg) - 2,
      d3.max(state.data, d => +d.mpg) + 2,
    ])
    .range([margin.top + plotHeight, margin.top]);

  // Add x-axis
  svg
    .append('g')
    .attr('transform', `translate(0,${margin.top + plotHeight})`)
    .call(d3.axisBottom(x))
    .append('text')
    .attr('x', plotWidth / 2)
    .attr('y', 40)
    .attr('fill', 'black')
    .style('text-anchor', 'middle')
    .text('Horsepower');

  // Add y-axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -plotHeight / 2)
    .attr('y', -40)
    .attr('fill', 'black')
    .style('text-anchor', 'middle')
    .text('MPG');
}

function setLegend(colorScale) {
  // Add legend
  const legend = svg
    .append('g')
    .attr('transform', `translate(${width - 120}, ${margin.top})`);

  const origins = colorScale.domain();
  origins.forEach((origin, i) => {
    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', i * 20)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', colorScale(origin));

    legend
      .append('text')
      .attr('x', 20)
      .attr('y', i * 20 + 10)
      .text(origin)
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle');
  });
}

// Scene 3: Filter high efficiency, horsepower
function scene3() {
  //setCoordinateSystem();

  svg
    .append('text')
    .attr('x', 20)
    .attr('y', 30)
    .text('Scene 3: High horsepower')
    .style('font-size', '18px');

  // Set coordinate system
  const x = d3
    .scaleLinear()
    .domain([
      d3.min(state.data, d => +d.horsepower) - 10,
      d3.max(state.data, d => +d.horsepower) + 10,
    ])
    .range([margin.left, margin.left + plotWidth]);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(state.data, d => +d.mpg) - 2,
      d3.max(state.data, d => +d.mpg) + 2,
    ])
    .range([margin.top + plotHeight, margin.top]);

  // Add x-axis
  svg
    .append('g')
    .attr('transform', `translate(0,${margin.top + plotHeight})`)
    .call(d3.axisBottom(x));

  // Add y-axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  const filteredData = state.data.filter(d => +d.horsepower > 110);
  svg
    .selectAll('circle')
    .data(filteredData)
    .enter()
    .append('circle')
    .attr('cx', d => x(+d.horsepower))
    .attr('cy', d => y(+d.mpg))
    .attr('r', 6)
    .attr('fill', d => colorScale(d.origin));

  // Add origin labels
  svg
    .selectAll('text.label')
    .data(filteredData)
    .enter()
    .append('text')
    .attr('x', d => x(+d.horsepower) + 8)
    .attr('y', d => y(+d.mpg) - 6)
    .text(d => d.origin)
    .attr('class', 'label')
    .style('font-size', '10px')
    .style('fill', '#333');

  // Annotations
  addAnnotation('High efficiency', 150, 200);
}

// Scene 2: High MPG
function scene2() {
  svg
    .append('text')
    .attr('x', 20)
    .attr('y', 30)
    .text('Scene 2: Highlight High MPG')
    .style('font-size', '18px');

  // Set coordinate system
  const x = d3
    .scaleLinear()
    .domain([
      d3.min(state.data, d => +d.horsepower) - 10,
      d3.max(state.data, d => +d.horsepower) + 10,
    ])
    .range([margin.left, margin.left + plotWidth]);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(state.data, d => +d.mpg) - 2,
      d3.max(state.data, d => +d.mpg) + 2,
    ])
    .range([margin.top + plotHeight, margin.top]);

  // Add x-axis
  svg
    .append('g')
    .attr('transform', `translate(0,${margin.top + plotHeight})`)
    .call(d3.axisBottom(x));

  // Add y-axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  const filteredData = state.data.filter(d => +d.mpg > 30);

  // Plot points
  svg
    .selectAll('circle')
    .data(filteredData)
    .enter()
    .append('circle')
    .attr('cx', d => x(+d.horsepower))
    .attr('cy', d => y(+d.mpg))
    .attr('r', 6)
    .attr('fill', d => colorScale(d.origin));

  // Add origin labels
  svg
    .selectAll('text.label')
    .data(filteredData)
    .enter()
    .append('text')
    .attr('x', d => x(+d.horsepower) + 8)
    .attr('y', d => y(+d.mpg) - 6)
    .text(d => d.origin)
    .attr('class', 'label')
    .style('font-size', '10px')
    .style('fill', '#333');

  addAnnotation('Cars >30 MPG', 180, 250);
}

// Scene 1:
function scene1() {
  svg
    .append('text')
    .attr('x', 20)
    .attr('y', 30)
    .text('Scene 1: By Origin')
    .style('font-size', '18px');

  const colorScale = d3
    .scaleOrdinal()
    .domain(['USA', 'Europe', 'Japan'])
    .range(['red', 'blue', 'orange']);

  const x = d3
    .scaleLinear()
    .domain([
      d3.min(state.data, d => +d.horsepower) - 10,
      d3.max(state.data, d => +d.horsepower) + 10,
    ])
    .range([margin.left, margin.left + plotWidth]);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(state.data, d => +d.mpg) - 2,
      d3.max(state.data, d => +d.mpg) + 2,
    ])
    .range([margin.top + plotHeight, margin.top]);

  svg
    .append('g')
    .attr('transform', `translate(0,${margin.top + plotHeight})`)
    .call(d3.axisBottom(x));

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg
    .selectAll('circle')
    .data(state.data)
    .enter()
    .append('circle')
    .attr('cx', d => x(+d.horsepower))
    .attr('cy', d => y(+d.mpg))
    .attr('r', 5)
    .attr('fill', d => colorScale(d.origin));

  svg
    .selectAll('text.label')
    .data(state.data)
    .enter()
    .append('text')
    .attr('x', d => x(+d.horsepower) + 8)
    .attr('y', d => y(+d.mpg) - 6)
    .text(d => d.origin)
    .attr('class', 'label')
    .style('font-size', '10px')
    .style('fill', '#333');

  //setCoordinateSystem();
  setLegend(colorScale);

  addAnnotation('Country origin colored', 160, 220);
}

// Annotation helper
function addAnnotation(label, x, y) {
  const annotations = [
    {
      note: {
        label: label,
        title: 'Note',
      },
      x: x,
      y: y,
      dy: -30,
      dx: 50,
    },
  ];

  const makeAnnotations = d3.annotation().annotations(annotations);

  svg.append('g').call(makeAnnotations);
}

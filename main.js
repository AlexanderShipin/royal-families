const totalWidth = 2150;
const totalHeight = 1000;
const svg = d3.select('#royal-tree')
    .attr('width', totalWidth)
    .attr('height', totalHeight)
    .style('width', totalWidth + "px")
    .style('height', totalHeight + "px");

Promise.all([
    d3.json("data/persons.json"),
    d3.json("data/relations.json"),
    d3.json("data/person-settings.json")
]).then(values => draw(values[0], values[1], values[2]));

function draw(persons, relations, personSettings) {
    // x Axis
    const xAxisOffset = 30;
    const xScale = (totalWidth - 2 * xAxisOffset) / 1000;
    // y Axis
    const yAxisOffset = 30;
    const minYear = Math.min(...persons.map(p => new Date(p.birthDate).getFullYear()));
    const maxYear = Math.max(...persons.map(p => Math.max(new Date(p.birthDate).getFullYear(), new Date(p.deathDate).getFullYear())));
    const yScale = (totalHeight - 2 * yAxisOffset) / (maxYear - minYear);

    // persons
    const person = svg.selectAll("#royal-tree")
    .data(persons)
    .enter()
    .append("g");

    person.append("circle")
        .attr("cx", function(p) {
        return personSettings[p.id].x * xScale + xAxisOffset;
        })
        .attr("cy", function(p) {
        return (new Date(p.birthDate).getFullYear() - minYear) * yScale + yAxisOffset;
        })
        .attr("r", 2)
        .style("fill", "#eb3328")
    
    person.append("text")
        .attr("x", function(p) {
        return personSettings[p.id].x * xScale + xAxisOffset;
        })
        .attr("y", function(p) {
        return (new Date(p.birthDate).getFullYear() - minYear) * yScale + yAxisOffset;
        })
        .attr("dy", "-7px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(function(p) {
        return `${p.id} ${p.name}`;//`${p.name}`;//
        })
        .attr("fill", "black")
        .attr("font-family", "Tahoma")
        .attr("font-size", "10px");
    
    // relations
    svg.selectAll("#royal-tree")
    .data(relations.filter(r => r.type === "father-child" || r.type === "mother-child"))
    .enter()
    .append("path")
    .attr("d", function(r) {
        const birthYearSource = new Date(persons.find(p => p.id === r.source.id).birthDate).getFullYear();
        const birthYearTarget = new Date(persons.find(p => p.id === r.target.id).birthDate).getFullYear();

        const x1 = personSettings[r.source.id].x * xScale + xAxisOffset;
        const y1 = (birthYearSource - minYear) * yScale + yAxisOffset;
        const x2 = personSettings[r.target.id].x * xScale + xAxisOffset;
        const y2 = (birthYearTarget - minYear) * yScale + yAxisOffset;

        var mx = x1 + (x2 - x1) / 1.5;
        var my = y1 + (y2 - y1) / 8;

        return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    })
    .style("fill", "none")
    .style("stroke", "blue")
    .style("stroke-width", 0.5);
}
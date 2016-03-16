import d3 from 'd3';

export function createChart(el, props) {
  window.addEventListener('mouseup', () => {props.stopExRateChanging();});
  d3.select(el)
    .classed('d3', true)
    .attr('width', '400px')
    .attr('height', '200px')
    .on('mousemove', mouseMoveCallback(props.changeCircleCoord, el))
    .append('rect')
    .classed('d3-chart', true)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', 'none')
    .attr('stroke', 'rgb(205, 227, 95)');

  updateChart(el, props);
}

export function updateChart(el, props) {
  props.data.get('circles').map((circle) => {
    const className = 'd3-point-' + circle.get('id');
    const data = circle.get('rates').toJS();
    data.map((e) => {e.id = circle.get('id');});
    var point = d3.select(el).selectAll('.' + className).data(data);

    point.enter().append('circle')
      .classed(className, true)
      .attr('r',3)
      .attr('fill', circle.get('color'))
      .attr('stroke', circle.get('color'))
      .style('cursor', 'ns-resize')
      .attr('circleID', circle.get('id'))
      .on('mousedown',mouseDownCallback(props.startExRateChanging));

    point.attr('cx', (d) => {return d.x;})
      .attr('cy', (d) => {return d.y;});
  });
}

function mouseDownCallback(callback) {
  return (data) => {
    callback(data.id, data.x);
  };
}

function mouseMoveCallback(callback, el) {
  return () => {
    if (d3.event.which === 1) {
      const container = d3.select(el)[0][0];
      callback(d3.mouse(container)[1]);
    }
  };
}

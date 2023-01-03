import React from "react";
import * as d3 from "d3";

export class Graph extends React.Component {
  constructor(props) {
    super(props)
  }
    
  render() {
    Array.prototype.max = function() {
      return Math.max.apply(null, this);
    };
          
    Array.prototype.min = function() {
      return Math.min.apply(null, this);
    };

    const getX = d3.scaleLinear()
      .domain([this.props.xData.min(), this.props.xData.max()])
      .range([0, 300])

    const getY = d3.scaleLinear()
      .domain([this.props.yData.min(), this.props.yData.max()])
      .range([300, 0])

    let points = new Array()
    for (let i = 0; i < this.props.xData.length; i++) {
      points.push([getX(this.props.xData[i]), getY(this.props.yData[i])])
    }
    const line = d3.line()
    const linePath = line(points);

    const getYAxis = ref => {
      const yAxis = d3.axisLeft(getY);
      d3.select(ref).call(yAxis);
    };
    
    const getXAxis = ref => {
      const xAxis = d3.axisBottom(getX);
      d3.select(ref).call(xAxis);
    };

    var renderPoints = () => {
      let result = []
      for(let i = 0; i < this.props.xData.length; i++) {
        result.push(
        <circle
          key={i}
          cx={getX(this.props.xData[i])}
          cy={getY(this.props.yData[i])}
          r={4}
          fill="#f00"
        />)
      }
      return result
    }
    
    return (
      <svg width={300} height={300}>
        {renderPoints()}
        <g ref={getYAxis} />
        <g
        ref={getXAxis}
        transform={`translate(0,${getY(0)})`} // нужно сдвинуть ось в самый низ svg
        />
        <path
          strokeWidth={3}
          fill="none"
          stroke="#7cb5ec"
          d={linePath}
        />
      </svg>
      );
    }
  }
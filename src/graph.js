import React from "react";
import * as d3 from "d3";
import { tickStep } from "d3";

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
      
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

Array.prototype.unique = function() {
  return this.filter((item, i, array) => array.indexOf(item) === i)
}

Array.prototype.replace = function(oldValue, newValue) {
  this.forEach((item, i) => {
    if (item == oldValue) {
      this[i] = newValue
    }
  })
  return this
}

Array.prototype.remove = function(value) {
  while (true) {
    let index = this.indexOf(value)
    if (index == -1)
      break
    this.splice(index, 1)
  }
  return this
}

export class Graph extends React.Component {
  constructor(props) {
    super(props)
  }

  replaceInfinity() {

    let isMinInf = this.props.yData.includes(-Infinity)
    let isMaxInf = this.props.yData.includes(Infinity)

    if (isMinInf || isMaxInf) {
      let unique = this.props.yData
        .unique()
        .remove(-Infinity)
        .remove(Infinity)

      let min = unique.min() * 2
      let max = unique.max() * 2

      this.props.yData
        .replace(-Infinity, min)
        .replace(Infinity, max)
    }
  }
    
  render() {

    if (!this.props.xData || !this.props.yData)
      return

    this.replaceInfinity()

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

    const getXAxis = ref => {
      const xAxis = d3.axisBottom(getX);
      d3.select(ref).call(xAxis);
    };

    const getYAxis = ref => {
      const yAxis = d3.axisLeft(getY);
      d3.select(ref).call(yAxis);
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
        <g ref={getXAxis} transform={`translate(0,${getY(0)})`} />
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
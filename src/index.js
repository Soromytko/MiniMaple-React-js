import { react } from "@babel/types";
import { shouldInstrument } from "@jest/transform";
import { stackOffsetSilhouette, thresholdFreedmanDiaconis, tickStep } from "d3";
import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

import {Parser} from "./parser.js"
import {Token} from "./parser.js"

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          inputFunc: '3x^2 + 1',
          diffFunc: '6x',
          parseResult: '',
          buttonClick: false
        };

        this.inputFuncHandleChange = this.onInputFuncHandleChange.bind(this)
        this.diffFuncHandleChange = this.onDiffFuncHandleChange.bind(this)

        this.onAddHandle = this.onAdd.bind(this)
    }

    onInputFuncHandleChange(event) {
      this.setState({inputFunc: event.target.value})

      let parser = new Parser(event.target.value)
      parser.parse()

      this.setState({parseResult: parser.log})

      if (parser.log) {

      }

      // var terms  = func.split('+')
      // console.log(terms )

    // terms.forEach((item) => {
    //   console.log(item)
    // })
      
      this.setState({diffFunc: event.target.value})


      
    }

    onDiffFuncHandleChange(event) {
      this.setState({diffFunc: event.target.value})
    }

    onAdd() {
      this.setState({buttonClick: !this.state.buttonClick})
      let parser = new Parser(this.state.inputFunc)
      parser.parse()
      this.setState({parseResult: parser.log})
    }

    render() {
        return (
          <div>
            <div>
              <label>f(x) = </label>
              <input type="text" value={this.state.inputFunc} onChange={this.inputFuncHandleChange}/>
              <label>   </label>
              <label style={{color: this.state.parseResult == 0 ? 'green' : 'red'}}>
                {this.state.parseResult == 0 ? "correct" : this.state.parseResult}
              </label>
            </div>
            <div>
              <label>f'(x) = {this.state.diffFunc}</label>
              <button onClick={this.onAddHandle}>
                Добавить
              </button>
            </div>
            {/* <div>
              <input type="number" value={this.state.from} onChange={this.}></input>
            </div> */}
          </div>
        )
    }
}

class Grap extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const data = [
      { name: 'Jan', value: 40 },
      { name: 'Feb', value: 35 },
      { name: 'Mar', value: 4 },
      { name: 'Apr', value: 28 },
      { name: 'May', value: 15 },
    ];

    const getX = d3.scaleBand()
  .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May'])
  .range([0, 600]);

  const getY = d3.scaleLinear()
  .domain([0, 40])
  .range([300, 0]);

  const linePath = d3
  .line()
  .x(d => getX(d.name) + getX.bandwidth() / 2)
  .y(d => getY(d.value))
  .curve(d3.curveMonotoneX)(data);
    
    return (
      <svg width={600} height={300}>
        {data.map((item, index) => {
          return (
            <g key={index}>
              <circle
                key={index}
                cx={getX(item.name) + getX.bandwidth() / 2}
                cy={getY(item.value)}
                r={4}
                fill="#7cb5ec"
              />
              <text
            fill="#666"
            x={getX(item.name) + getX.bandwidth() / 2}
            y={getY(item.value) - 10}
            textAnchor="middle"
          >
            {item.value}
          </text>
            </g>
          );
        })}
        
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

// ReactDOM.render(<App/>, document.querySelector("#root"))
ReactDOM.render(<Grap/>, document.querySelector("#root"))





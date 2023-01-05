import { react } from "@babel/types";
import { shouldInstrument } from "@jest/transform";
import { stackOffsetSilhouette, thresholdFreedmanDiaconis, tickStep } from "d3";
import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

import {Parser} from "./parser.js"
import {Token} from "./token.js"
import {Calculator} from "./calculator.js"
import {Graph} from "./graph.js"

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          inputFunc: '3x^2 + 1',
          explicitFunc: '3',
          diffFunc: '6x',
          parseResult: '',
          xMin: '-10',
          xMax: '10',
          buttonClick: false
        };

        this.xData = [-1, 0, 1]
        this.yData = [-33, 243463, 3423]

        this.renderTableData = (data) => {
          let result = []
          for(let i = 0; i < data.length; i++) {
            result.push(<td key={i}>{data[i]}</td>)
          }
          return result
        }

        this.inputFuncHandleChange = this.onInputFuncHandleChange.bind(this)
        this.diffFuncHandleChange = this.onDiffFuncHandleChange.bind(this)
        this.xMinHandleChange = this.onXMinHandleChange.bind(this)
        this.xMaxHandleChange = this.onXMaxHandleChange.bind(this)

        this.onAddHandle = this.onAdd.bind(this)
    }

    onInputFuncHandleChange(event) {
      this.setState({inputFunc: event.target.value})
      this.rebuild(event.target.value, this.state.xMin, this.state.xMax)
      return

      let parser = new Parser(event.target.value)
      parser.parse()

      this.setState({parseResult: parser.log})

      if (!parser.log) {
        let calculator = new Calculator(parser.tokens)
      
        this.xData = []
        this.yData = []
        for (let i = this.state.xMin; i <= this.state.xMax; i++) {
          this.xData.push(i)
          let y = calculator.calc(i)
          this.yData.push(y)
        }

      }

      this.setState({diffFunc: event.target.value})
    }

    onDiffFuncHandleChange(event) {
      this.setState({diffFunc: event.target.value})
    }

    onXMinHandleChange(event) {
      this.setState({xMin: event.target.value})
      this.rebuild(this.state.inputFunc, event.target.value, this.state.xMax)
    }

    onXMaxHandleChange(event) {
      this.setState({xMax: event.target.value})
      this.rebuild(this.state.inputFunc, this.state.xMin, event.target.value)


    }

    onAdd() {
      this.setState({buttonClick: !this.state.buttonClick})
      let parser = new Parser(this.state.inputFunc)
      parser.parse()
      this.setState({parseResult: parser.log})

      let calculator = new Calculator(parser.tokens)
      calculator.calc(0)
    }

    rebuild(func, xMin, xMax) {
      let parser = new Parser(func)
      parser.parse()

      this.setState({parseResult: parser.log})
      this.setState({explicitFunc: parser.getExplicit()})

      if (!parser.log) {
        
        let calculator = new Calculator(parser.tokens)
      
        this.xData = []
        this.yData = []
        for (let i = xMin; i <= xMax; i++) {
          this.xData.push(i)
          let y = calculator.calc(i)
          this.yData.push(y)
        }

      }

      this.setState({diffFunc: func})
    }

    render() {
      // this.xData = [0, 1, 2, 3, 4]
      // this.yData = [0, 1, 4, 9, 16]
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
            {/* <label>f'(x) = {this.state.diffFunc}</label> */}
            <label>f(x) = {this.state.explicitFunc}</label>
            {/* <button onClick={this.onAddHandle}>
              Добавить
            </button> */}
          </div>
          {/* <div>
            <input type="number" value={this.state.from} onChange={this.}></input>
          </div> */}
            <label>interval: 
              [ <input type="number" value={this.state.xMin} onChange={this.xMinHandleChange}/>, 
              <input type="number" value={this.state.xMax} onChange={this.xMaxHandleChange}/> ]
            </label>
          <table>
            <tbody>
              <tr>
                <th>x:</th>
                {this.renderTableData(this.xData)}
              </tr>
              <tr>
                <th>y:</th>
                {this.renderTableData(this.yData)}
              </tr>
            </tbody>
        </table>
        <div>
          <Graph xData={this.xData} yData={this.yData}></Graph>
        </div>
        </div>
      )
    }
}


class Grap_old extends React.Component {
  constructor(props) {
    super(props)
  }

  

  render() {

    let data = []
    for(let i = -3; i < 5; i++)
      data.push(i * i)

    const getX = d3.scaleLinear()
  .domain([0, 30])
  .range([0, 300]);

  const getY = d3.scaleLinear()
  .domain([0, 25])
  .range([300, 0]);

  for(let i = 0; i < data.length; i++)
    console.log(i, getX(i), getY(data[i]))

  var renderPoints = () => {
    let result = []
    for(let i = 0; i < data.length; i++) {
      result.push(
        <circle
          key={i}
          cx={getX(i) + 150}
          cy={getY(data[i])}
          r={4}
          fill="#f00"
        />
      )
      
    }
    return result
  }
    
    return (
      <svg width={300} height={300}>
        {renderPoints()}
        
      </svg>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector("#root"))
// ReactDOM.render(<Grap/>, document.querySelector("#root"))





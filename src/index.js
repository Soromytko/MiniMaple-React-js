import { react } from "@babel/types";
import { shouldInstrument } from "@jest/transform";
import { stackOffsetSilhouette, thresholdFreedmanDiaconis, tickStep } from "d3";
import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

import {Parser} from "./parser.js"
import {Token} from "./token.js"
import {Calculator} from "./calculator.js"

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          inputFunc: '3x^2 + 1',
          diffFunc: '6x',
          parseResult: '',
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

      let calculator = new Calculator(parser.tokens)
      calculator.calc(0)
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
              {/* <button onClick={this.onAddHandle}>
                Добавить
              </button> */}
            </div>
            {/* <div>
              <input type="number" value={this.state.from} onChange={this.}></input>
            </div> */}
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
          </div>
        )
    }
}


class Grap extends React.Component {
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





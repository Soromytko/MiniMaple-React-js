import React from "react";
import ReactDOM from "react-dom";

import {Parser} from "./parser.js"
import {Token} from "./token.js"
import {Calculator} from "./calculator.js"
import {Graph} from "./graph.js"
import { Point } from "./point.js";

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          inputFunc: '3x^2 * sin(x)',
          explicitFunc: '3*x^2*sin(x)',
          parseResult: '',
          xMin: '-10',
          xMax: '10',
        };

        this.points = []

        this.rebuild(this.state.inputFunc, this.state.xMin, this.state.xMax)

        this.renderTable = () => {
          let rows = []
          for (let i = 0; i < this.points.length; i++) {
            rows.push(
              <tr key={i}>
                <td>{this.points[i].x}</td>
                <td>{this.points[i].y}</td>
              </tr>
            )
          }
          return (
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  <th>y</th>
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
          )
        }

        this.inputFuncHandleChange = this.onInputFuncHandleChange.bind(this)
        this.xMinHandleChange = this.onXMinHandleChange.bind(this)
        this.xMaxHandleChange = this.onXMaxHandleChange.bind(this)

        this.defaultFuncs = [
          '8(x+5)',
          'x^2',
          'x^3',
          '1/(-x)',
          'sin(x)',
          'cos(x)',
          '3*x^2*sin(x)',
        ]
        this.setDefaultFuncHandles = []
        this.defaultFuncs.forEach((item, i) => {
          this.setDefaultFuncHandles[i] = () => {
            this.setState({inputFunc: this.defaultFuncs[i]})
            this.rebuild(this.defaultFuncs[i], this.state.xMin, this.state.xMax)
          }
        })
        this.renderButtons = () => {
          let result = []
          for (let i = 0; i < this.defaultFuncs.length; i++) {
            result.push(<button key={i} onClick={this.setDefaultFuncHandles[i]}>{this.defaultFuncs[i]}</button>)
          }
          return result
        }
    }

    onInputFuncHandleChange(event) {
      this.setState({inputFunc: event.target.value})
      this.rebuild(event.target.value, this.state.xMin, this.state.xMax)
    }

    onXMinHandleChange(event) {
      this.setState({xMin: event.target.value})
      this.rebuild(this.state.inputFunc, event.target.value, this.state.xMax)
    }

    onXMaxHandleChange(event) {
      this.setState({xMax: event.target.value})
      this.rebuild(this.state.inputFunc, this.state.xMin, event.target.value)
    }

    rebuild(func, xMin, xMax) {
      let parser = new Parser(func)
      parser.parse()

      this.setState({parseResult: parser.log})
      this.setState({explicitFunc: parser.getExplicit()})

      if (!parser.log) {
        
        let calculator = new Calculator(parser.tokens)
      
        this.points = []
        for (let i = xMin; i <= xMax; i++) {
          this.points.push(new Point(i, calculator.calc(i)))
        }
      }

      this.setState({diffFunc: func})
    }

    render() {
      this.xData = []
      this.yData = []
      this.points.forEach(item => {this.xData.push(item.x); this.yData.push(item.y)})
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
            {this.renderButtons()}
          </div>
          <div>
            <label>f(x) = {this.state.explicitFunc}</label>
          </div>
          <div>
            <label>interval: 
              [ <input type="number" value={this.state.xMin} onChange={this.xMinHandleChange}/>, 
              <input type="number" value={this.state.xMax} onChange={this.xMaxHandleChange}/> ]
            </label>
          </div>
          <div>
            <label>Граф</label>
            <Graph xData={this.xData} yData={this.yData}></Graph>
            <label>Граф</label>
          </div>
          <div>
            {this.renderTable()}
          </div> 
        </div>
      )
    }
}

ReactDOM.render(<App/>, document.querySelector("#root"))

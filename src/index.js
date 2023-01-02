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


ReactDOM.render(<App/>, document.querySelector("#root"))





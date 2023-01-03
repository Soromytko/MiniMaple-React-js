import { thresholdFreedmanDiaconis, tickStep } from "d3"
import {Token} from "./token"

export class Parser {
  constructor(stream) {
    this.stream = stream
    this.i = -1
    this.currentChar = ''
    this.tokens = []
    this.currentParseValue = ''
    this.log = ''

    this.isDigit = () => this.currentChar >= '0' && this.currentChar <= '9'

    this.inc()
  }

  parse() {
    // remove spaces
    this.stream = this.stream.replace(/\s/g, '')

    if (this.stream.length == 0) {
      this.log += 'empty'
      return
    }

    while (this.i < this.stream.length) {
      if (this.parseNumber()) {
        this.tokens.push(new Token('number', this.currentParseValue))
      } else if (this.parseOperator()) {
        this.tokens.push(new Token('operator', this.currentParseValue))
      } else if (this.parseParameter()) {
        this.tokens.push(new Token('parameter', this.currentParseValue))
      } else {
        this.log += 'unknown: ' + '\"' + this.currentChar + '\"'
        return
      }
    }

    this.analyse()
  }

  // semantic analysis
  analyse() {
    Array.prototype.insert = function ( index, ...items ) {
      this.splice( index, 0, ...items );
    };

    // insert "*" before/after "x"
    for (let i = 0; i < this.tokens.length; i++) {
      if (this.tokens[i].type == 'parameter') {
        if (i > 0 && this.tokens[i - 1].type != 'operator') {
          this.tokens.insert(i, new Token('operator', '*'))
        } else if (i + 1 < this.tokens.length && this.tokens[i + 1].type != 'operator') {
          this.tokens.insert(i + 1, new Token('operator', '*'))
        }
      }
    }

    // check operators
    for (let i = 0; i < this.tokens.length; i++) {
      if (this.tokens[i].type == 'operator') {
        if (i + 1 == this.tokens.length || this.tokens[i + 1].type == 'operator') {
          this.log += 'an operand is required after ' +  '\"' +this.tokens[i].lexeme + '\"'
          return
        }
      }
    }
  }

  parseNumber() {
    this.currentParseValue = ''
    do {
      if (this.isDigit())
        this.currentParseValue += this.currentChar
      else
        break
    } while (this.inc())

    return this.currentParseValue.length > 0
  }

  parseOperator() {
    switch (this.currentChar) {
      case '+': case '-': case '*': case '/': {
        this.currentParseValue = this.currentChar
        this.inc()
        return true
      }
    }
    return false
  }

  parseParameter() {
    if (this.currentChar == 'x') {
      this.currentParseValue = this.currentChar
      this.inc()
      return true
    }
    return false
  }

  inc() {
    this.i++
    if (this.i < this.stream.length) {
      this.currentChar = this.stream[this.i]
      return true
    }
    return false
  }

}
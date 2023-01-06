import { thresholdFreedmanDiaconis, tickStep } from "d3"
import { isGeneratorFunction } from "util/types"
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

  /* return explicit string
  3(5x+ 2) - implicit
  3*(5*x+2) - explicit */
  getExplicit() {
    let result = ''
    this.tokens.forEach(token => {
      result += token.lexeme
    })
    return result
  }

  // semantic analysis
  analyse() {
    Array.prototype.insert = function ( index, ...items ) {
      this.splice( index, 0, ...items );
    };

    let isParenthesis = (token) => token.lexeme == '(' || token.lexeme == ')'
 
    // insert "*" before/after "x", before "(", after ")"
    for (let i = 0; i < this.tokens.length; i++) {
      let isInsertBefore = this.tokens[i].type == 'parameter' || this.tokens[i].lexeme == '('
      let isInsertAfter = this.tokens[i].type == 'parameter' || this.tokens[i].lexeme == ')'
      
      if (isInsertBefore && i > 0 && this.tokens[i - 1].type != 'operator') {
        this.tokens.insert(i, new Token('operator', '*'))
        i++
      }

      if (isInsertAfter && i + 1 < this.tokens.length && this.tokens[i + 1].type != 'operator') {
        this.tokens.insert(i + 1, new Token('operator', '*'))
        i++
      }
    }

    let isException = (token) => {
      return token.lexeme == '(' || token.lexeme == 'sin' ||
      token.lexeme == 'cos'
    }
    // check operators
    for (let i = 0; i < this.tokens.length; i++) {
      if (this.tokens[i].type == 'operator' && !isParenthesis(this.tokens[i])) {
        if (i + 1 == this.tokens.length || this.tokens[i + 1].type == 'operator' && !isException(this.tokens[i + 1])) {
          this.log += 'an operand is required after ' +  '\"' + this.tokens[i].lexeme + '\"'
          return
        }
      }
    }

    //check pairs of parentheses
    let right = this.tokens.length - 1
    for (let left = 0; left <= right; left++) {
      if (this.tokens[left].lexeme == '(') {
        let isFound = false
        for (; right > left; right--) {
          if (this.tokens[right].lexeme == ')') {
            isFound = true
            right--
            break
          }
        }
        if (!isFound) {
          this.log += 'requires' + '\"' + ")" + '\"'
          return
        }
      } else if (this.tokens[left].lexeme == ')') {
        this.log += 'requires' + '\"' + "(" + '\"'
        return
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
      case '+': case '-': case '*': case '/':
      case '(' : case ')': case '^': {
        this.currentParseValue = this.currentChar
        this.inc()
        return true
      }
    }

    this.currentParseValue = this.stream.substr(this.i, 3)
    switch (this.currentParseValue) {
      case 'sin': case 'cos': case 'tan': {
        this.inc(3)
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

  inc(step = 1) {
    this.i += step
    if (this.i < this.stream.length) {
      this.currentChar = this.stream[this.i]
      return true
    }
    return false
  }

}
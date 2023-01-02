export class Token {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}

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
    this.stream = this.stream.replace(/\s/g, '')  //replace spaces
    if(this.stream.length == 0) {
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
        this.log += "unknown: " + this.currentChar
        return
      }
    }

    // this.tokens.forEach((token) => {
    //   console.log(token.type, token.value)
    // })
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
      case '-': case '+': {
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
    if(this.i < this.stream.length) {
      this.currentChar = this.stream[this.i]
      return true
    }
    return false
  }

}
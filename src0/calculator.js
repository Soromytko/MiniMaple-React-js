import {Token} from "./token.js"

Math.toRadians = function(degrees) {
  return degrees * Math.PI / 180;
};

export class Calculator {
    constructor(tokens) {
        this.tokens = tokens

        this.priorities = {
            '+': 0,
            '-': 0,
            '*': 1,
            '/': 1 ,
            '^': 2,
            'sin': 2,
            'cos': 2,
            'tan': 2,
          }
    }

    /* the algorithm below is borrowed from:
    https://www.youtube.com/watch?v=Vk-tGND2bfc*/
    calc(x) {
      let numbers = [] // stack
      let operators = [] // stack
      let operate = () => {
        let operand1 = numbers.pop()
        let getOperand2 = () => numbers.length ? numbers.pop() : 0
        switch (operators.pop()) {
          case '+': return getOperand2() + operand1
          case '-': return getOperand2() - operand1
          case '*': return getOperand2() * operand1
          case '/': return getOperand2() / operand1
          case '^': return Math.pow(getOperand2(), operand1)
          case 'sin': return Math.sin(operand1)
          case 'cos': return Math.cos(operand1)
          case 'tan': return Math.tan(operand1)
        }
      }
  
      for (let i = 0; i < this.tokens.length; i++) {
        let token = this.tokens[i]
        if (token.type == 'number') {
          numbers.push(Number(token.lexeme))
        } else if (token.type == 'parameter') {
          numbers.push(Number(x))
        } else if (token.type == 'operator') {
          if (token.lexeme == ')') {
            while (operators[operators.length - 1] != '(') {
              numbers.push(operate())
            }
            operators.pop() //remove "("
          } else {
            if (token.lexeme != '(') {
              while (this.priorities[operators[operators.length - 1]] >= this.priorities[token.lexeme]) { //while
                numbers.push(operate())
              }
            }
            operators.push(token.lexeme)
          }
        }
      }
  
      while (operators.length > 0) {
        numbers.push(operate())
      }

      return numbers.length ? numbers.pop() : 0 
      
  }
}

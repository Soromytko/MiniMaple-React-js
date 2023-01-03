import {Token} from "./token.js"

export class Calculator {
    constructor(tokens) {
        this.tokens = tokens

        this.priorities = {
            '+': 0,
            '-': 0,
            '*': 1,
            '/': 1
          }
    }

    calc(x) {
        let numbers = [] //stack
        let operators = [] //stack
        let operate = () => {
          let opr1 = numbers.pop()
          let opr2 = numbers.pop()
          let op = operators.pop()
          switch (op) {
            case '+': return opr2 + opr1
            case '-': return opr2 - opr1
            case '*': return opr2 * opr1
            case '/': return opr2 / opr1
          }
        }
    
        for (let i = 0; i < this.tokens.length; i++) {
          let token = this.tokens[i]
          if (token.type == 'number') {
            numbers.push(Number(token.lexeme))
            console.log("push number", token.lexeme, "size =", numbers.length)
          } else if(token.type == 'operator') {
            while (this.priorities[operators[operators.length - 1]] >= this.priorities[token.lexeme]) { //while
              let opppp = operate()
              numbers.push(opppp)
              console.log("push number with operate", opppp, "size =", numbers.length)
            }
            operators.push(token.lexeme)
            console.log("push operator", token.lexeme, "size =", operators.length)
    
          }
        }
    
        while (operators.length > 0) {
          let opppp = operate()
          numbers.push(opppp)
          console.log("finish", opppp, "size =", numbers.length)
        }
    
        console.log('result =', numbers.pop())
    
        return 0
        
    }

}
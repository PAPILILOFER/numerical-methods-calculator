// Analizador de expresiones matemáticas personalizado
export class MathParser {
    private tokens: string[] = []
    private position = 0
  
    constructor() {}
  
    // Función principal para evaluar una expresión
    evaluate(expression: string, x: number): number {
      this.tokenize(expression)
      this.position = 0
      return this.parseExpression(x)
    }
  
    // Divide la expresión en tokens
    private tokenize(expression: string): void {
      this.tokens = []
      let i = 0
      const len = expression.length
  
      while (i < len) {
        const char = expression[i]
  
        // Saltar espacios en blanco
        if (char === " ") {
          i++
          continue
        }
  
        // Números
        if (/[0-9.]/.test(char)) {
          let num = ""
          while (i < len && /[0-9.]/.test(expression[i])) {
            num += expression[i]
            i++
          }
          this.tokens.push(num)
          continue
        }
  
        // Operadores
        if (/[+\-*/^()]/.test(char)) {
          this.tokens.push(char)
          i++
          continue
        }
  
        // Funciones y variables
        if (/[a-zA-Z]/.test(char)) {
          let name = ""
          while (i < len && /[a-zA-Z0-9_]/.test(expression[i])) {
            name += expression[i]
            i++
          }
          this.tokens.push(name)
          continue
        }
  
        // Caracteres desconocidos
        i++
      }
    }
  
    // Analiza una expresión
    private parseExpression(x: number): number {
      return this.parseAddSubtract(x)
    }
  
    // Analiza sumas y restas
    private parseAddSubtract(x: number): number {
      let left = this.parseMultiplyDivide(x)
  
      while (this.position < this.tokens.length) {
        const operator = this.tokens[this.position]
        if (operator !== "+" && operator !== "-") break
  
        this.position++
        const right = this.parseMultiplyDivide(x)
  
        if (operator === "+") {
          left += right
        } else {
          left -= right
        }
      }
  
      return left
    }
  
    // Analiza multiplicaciones y divisiones
    private parseMultiplyDivide(x: number): number {
      let left = this.parsePower(x)
  
      while (this.position < this.tokens.length) {
        const operator = this.tokens[this.position]
        if (operator !== "*" && operator !== "/") break
  
        this.position++
        const right = this.parsePower(x)
  
        if (operator === "*") {
          left *= right
        } else {
          if (right === 0) throw new Error("División por cero")
          left /= right
        }
      }
  
      return left
    }
  
    // Analiza potencias
    private parsePower(x: number): number {
      let left = this.parseFactor(x)
  
      while (this.position < this.tokens.length) {
        const operator = this.tokens[this.position]
        if (operator !== "^") break
  
        this.position++
        const right = this.parseFactor(x)
  
        left = Math.pow(left, right)
      }
  
      return left
    }
  
    // Analiza factores (números, variables, funciones, paréntesis)
    private parseFactor(x: number): number {
      if (this.position >= this.tokens.length) {
        throw new Error("Expresión incompleta")
      }
  
      const token = this.tokens[this.position]
      this.position++
  
      // Paréntesis
      if (token === "(") {
        const value = this.parseExpression(x)
        if (this.position < this.tokens.length && this.tokens[this.position] === ")") {
          this.position++
          return value
        }
        throw new Error("Paréntesis no cerrado")
      }
  
      // Números
      if (/^-?\d+(\.\d+)?$/.test(token)) {
        return Number.parseFloat(token)
      }
  
      // Variable x
      if (token === "x") {
        return x
      }
  
      // Constantes
      if (token === "pi") return Math.PI
      if (token === "e") return Math.E
  
      // Funciones
      if (this.position < this.tokens.length && this.tokens[this.position] === "(") {
        this.position++
        const arg = this.parseExpression(x)
        if (this.position < this.tokens.length && this.tokens[this.position] === ")") {
          this.position++
  
          // Funciones matemáticas
          if (token === "sin") return Math.sin(arg)
          if (token === "cos") return Math.cos(arg)
          if (token === "tan") return Math.tan(arg)
          if (token === "sqrt") return Math.sqrt(arg)
          if (token === "log") return Math.log(arg)
          if (token === "exp") return Math.exp(arg)
          if (token === "abs") return Math.abs(arg)
  
          throw new Error(`Función desconocida: ${token}`)
        }
        throw new Error("Paréntesis no cerrado en función")
      }
  
      throw new Error(`Token inesperado: ${token}`)
    }
  }
  
  // Función para evaluar expresiones numéricas simples (para límites)
  export const evaluateExpression = (expression: string, parser: MathParser): number => {
    // Reemplazar constantes
    expression = expression.replace(/pi/gi, String(Math.PI)).replace(/e(?![a-zA-Z])/gi, String(Math.E))
  
    // Evaluar expresiones matemáticas simples
    try {
      // Si es un número simple, convertirlo directamente
      if (/^-?\d+(\.\d+)?$/.test(expression)) {
        return Number.parseFloat(expression)
      }
  
      // Usar el parser para evaluar la expresión
      return parser.evaluate(expression, 0) // x no se usa en límites
    } catch {
      // Si falla, intentar convertir directamente
      return Number.parseFloat(expression)
    }
  }
  
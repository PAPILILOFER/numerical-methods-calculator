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
  
    // Obtener los tokens actuales
    getTokens(): string[] {
      return [...this.tokens]
    }
  
    // Divide la expresión en tokens
    tokenize(expression: string): void {
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
          
          // Añadir multiplicación implícita si sigue una variable o paréntesis
          if (i < len && (/[a-zA-Z]/.test(expression[i]) || expression[i] === "(")) {
            this.tokens.push("*")
          }
          continue
        }
  
        // Operadores y delimitadores
        if (/[+\-*/^(),]/.test(char)) {
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
          
          // Verificar si es una función conocida antes de añadir multiplicación implícita
          const knownFunctions = ["sin", "cos", "tan", "sqrt", "log", "exp", "abs", "root", "ln"]
          this.tokens.push(name)
          
          // Solo añadir multiplicación implícita si no es una función conocida seguida de paréntesis
          if (i < len && 
              ((/[0-9a-zA-Z]/.test(expression[i]) && !knownFunctions.includes(name)) || 
               (expression[i] === "(" && !knownFunctions.includes(name)))) {
            this.tokens.push("*")
          }
          continue
        }
  
        // Caracteres desconocidos
        throw new Error(`Carácter no reconocido: ${char}`)
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
        const firstArg = this.parseExpression(x)

        if (token === "root") {
          // Verificar que haya una coma después del primer argumento
          if (this.position >= this.tokens.length || this.tokens[this.position] !== ",") {
            throw new Error("La función root requiere dos argumentos separados por coma: root(n,x)")
          }
          this.position++ // Avanzar después de la coma
          
          // Leer el segundo argumento
          const secondArg = this.parseExpression(x)
          
          // Verificar el paréntesis de cierre
          if (this.position >= this.tokens.length || this.tokens[this.position] !== ")") {
            throw new Error("Falta el paréntesis de cierre en la función root")
          }
          this.position++

          // Validar los argumentos
          if (firstArg <= 0) {
            throw new Error("El índice de la raíz debe ser positivo")
          }
          if (firstArg % 2 === 0 && secondArg < 0) {
            throw new Error("No se puede calcular una raíz par de un número negativo")
          }

          // Calcular la raíz n-ésima
          return Math.sign(secondArg) * Math.pow(Math.abs(secondArg), 1/firstArg)
        }

        // Otras funciones matemáticas
        if (this.position < this.tokens.length && this.tokens[this.position] === ")") {
          this.position++
          switch (token) {
            case "sin": return Math.sin(firstArg)
            case "cos": return Math.cos(firstArg)
            case "tan": return Math.tan(firstArg)
            case "sqrt": return Math.sqrt(firstArg)
            case "log": return Math.log(firstArg)
            case "ln": return Math.log(firstArg)
            case "exp": return Math.exp(firstArg)
            case "abs": return Math.abs(firstArg)
            default: throw new Error(`Función desconocida: ${token}`)
          }
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
  
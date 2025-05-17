import type { IntegrationMethod, CoefficientIteration } from "@/lib/types"

export const metodoBoole: IntegrationMethod = {
  name: "Método de Boole",
  id: "boole",

  calculate: (f: (x: number) => number, a: number, b: number, n: number): number => {
    // Asegurarse de que n sea múltiplo de 4
    if (n % 4 !== 0) {
      n = Math.ceil(n / 4) * 4
    }

    const h = (b - a) / n
    let suma = 7 * (f(a) + f(b))

    for (let i = 1; i < n; i++) {
      const x = a + i * h
      let coef = 0

      if (i % 4 === 0) {
        coef = 14
      } else if (i % 2 === 0) {
        coef = 12
      } else {
        coef = 32
      }

      suma += coef * f(x)
    }

    return ((2 * h) / 45) * suma
  },

  getDetails: (f: (x: number) => number, a: number, b: number, n: number) => {
    let adjustedN = n
    let details = ""

    if (n % 4 !== 0) {
      adjustedN = Math.ceil(n / 4) * 4
      details = `Nota: El número de segmentos se ajustó de ${n} a ${adjustedN} para ser múltiplo de 4\n`
    }

    const h = (b - a) / adjustedN
    const iterations: Array<CoefficientIteration> = []
    
    // Primer punto
    const fa = f(a)
    iterations.push({ 
      i: 0, 
      xi: a, 
      fxi: fa, 
      coef: 7, 
      term: 7 * fa 
    })
    let suma = 7 * fa

    // Puntos intermedios
    for (let i = 1; i < adjustedN; i++) {
      const x = a + i * h
      const coef = i % 4 === 0 ? 14 : (i % 2 === 0 ? 12 : 32)
      const fx = f(x)
      const term = coef * fx
      iterations.push({ 
        i, 
        xi: x, 
        fxi: fx, 
        coef, 
        term 
      })
      suma += term
    }

    // Último punto
    const fb = f(b)
    iterations.push({ 
      i: adjustedN, 
      xi: b, 
      fxi: fb, 
      coef: 7, 
      term: 7 * fb 
    })
    suma += 7 * fb

    const result = ((2 * h) / 45) * suma
    details +=
      `Método de Boole con ${adjustedN} segmentos\n` +
      `Fórmula: (2h/45) * [7*(f(a) + f(b)) + 32*Σ(f(xi)) para i impar + 12*Σ(f(xi)) para i par múltiplo de 2 pero no de 4 + 14*Σ(f(xi)) para i múltiplo de 4]\n` +
      `h = (b - a) / n = (${b} - ${a}) / ${adjustedN} = ${h}`

    return { result, details, iterations }
  },
}

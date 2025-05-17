import type { IntegrationMethod, CoefficientIteration } from "@/lib/types"

export const metodoBoole: IntegrationMethod = {
  name: "Método de Boole",
  id: "boole",

  calculate: (f: (x: number) => number, a: number, b: number): number => {
    
    const h = (b - a) / 4
    
  
    const x1 = a
    const x2 = a + h
    const x3 = a + 2*h
    const x4 = a + 3*h
    const x5 = b

    // Aplicar la fórmula: (2h/45)[7f(x1) + 32f(x2) + 12f(x3) + 32f(x4) + 7f(x5)]
    const suma = 7*f(x1) + 32*f(x2) + 12*f(x3) + 32*f(x4) + 7*f(x5)
    
    return (2 * h / 45) * suma
  },

  getDetails: (f: (x: number) => number, a: number, b: number) => {
    const h = (b - a) / 4
    const iterations: Array<CoefficientIteration> = []
    
    // Calcular los 5 puntos y sus coeficientes
    const puntos = [
      { x: a, coef: 7 },
      { x: a + h, coef: 32 },
      { x: a + 2*h, coef: 12 },
      { x: a + 3*h, coef: 32 },
      { x: b, coef: 7 }
    ]

    let suma = 0
    puntos.forEach((punto, i) => {
      const fx = f(punto.x)
      const term = punto.coef * fx
      iterations.push({
        i,
        xi: punto.x,
        fxi: fx,
        coef: punto.coef,
        term
      })
      suma += term
    })

    const result = (2 * h / 45) * suma
    const details =
      `Método de Boole (4 segmentos)\n` +
      `Fórmula: (2h/45)[7f(x₁) + 32f(x₂) + 12f(x₃) + 32f(x₄) + 7f(x₅)]\n` +
      `h = (b - a) / 4 = (${b} - ${a}) / 4 = ${h}`

    return { result, details, iterations }
  },
}

import type { IntegrationMethod, CoefficientIteration } from "@/lib/types"

export const metodoTrapezoidal: IntegrationMethod = {
  name: "Método Trapezoidal",
  id: "trapezoidal",

  calculate: (f: (x: number) => number, a: number, b: number, n: number): number => {
    const h = (b - a) / n
    let suma = f(a) + f(b)

    for (let i = 1; i < n; i++) {
      const x = a + i * h
      suma += 2 * f(x)
    }

    return (h / 2) * suma
  },

  getDetails: (f: (x: number) => number, a: number, b: number, n: number) => {
    const h = (b - a) / n
    const iterations: Array<CoefficientIteration> = []
    
    // Añadir primer punto (x₀)
    const fa = f(a)
    iterations.push({
      i: 0,
      xi: a,
      fxi: fa,
      coef: 1,
      term: fa
    })

    let suma = fa

    // Puntos intermedios (x₁ hasta xₙ₋₁)
    for (let i = 1; i < n; i++) {
      const x = a + i * h
      const fx = f(x)
      const term = 2 * fx
      iterations.push({
        i,
        xi: x,
        fxi: fx,
        coef: 2,
        term
      })
      suma += term
    }

    // Añadir último punto (xₙ)
    const fb = f(b)
    iterations.push({
      i: n,
      xi: b,
      fxi: fb,
      coef: 1,
      term: fb
    })
    suma += fb

    const result = (h / 2) * suma
    const details =
      `Método Trapezoidal con ${n} segmentos\n` +
      `Fórmula: (h/2)[f(x₀) + 2f(x₁) + 2f(x₂) + 2f(x₃) + ... + f(xₙ)]\n` +
      `h = (b - a) / n = (${b} - ${a}) / ${n} = ${h}`

    return { result, details, iterations }
  },
}

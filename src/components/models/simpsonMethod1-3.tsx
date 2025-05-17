import type { IntegrationMethod, CoefficientIteration } from "@/lib/types"

export const metodoSimpson13: IntegrationMethod = {
  name: "Método de Simpson 1/3",
  id: "simpson13",

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculate: (f: (x: number) => number, a: number, b: number, _: number): number => {
    const h = (b - a) / 2  // h es (b-a)/2 para Simpson 1/3

    // Simpson 1/3 usa 3 puntos específicos
    const x1 = a          // Punto inicial
    const x2 = a + h      // Punto medio
    const x3 = a + 2 * h  // Punto final (igual a b)

    const suma = f(x1) + 4*f(x2) + f(x3)
    return (h / 3) * suma
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDetails: (f: (x: number) => number, a: number, b: number, _: number) => {
    const h = (b - a) / 2  // h es (b-a)/2 para Simpson 1/3
    const iterations: CoefficientIteration[] = []

    // Calcular los 3 puntos necesarios
    const x1 = a          // Punto inicial
    const x2 = a + h      // Punto medio
    const x3 = a + 2 * h  // Punto final (igual a b)

    const fx1 = f(x1)
    const fx2 = f(x2)
    const fx3 = f(x3)

    // Agregar los puntos como iteraciones individuales
    iterations.push(
      { i: 1, xi: x1, fxi: fx1, coef: 1, term: fx1 },
      { i: 2, xi: x2, fxi: fx2, coef: 4, term: 4 * fx2 },
      { i: 3, xi: x3, fxi: fx3, coef: 1, term: fx3 }
    )

    const suma = fx1 + 4*fx2 + fx3
    const result = (h / 3) * suma

    const details =
      `Método de Simpson 1/3 con 3 puntos\n` +
      `Fórmula: (h/3)[f(x₁) + 4f(x₂) + f(x₃)]\n` +
      `h = (b - a) / 2 = (${b} - ${a}) / 2 = ${h}\n` +
      `x₁ = ${x1}\n` +
      `x₂ = x₁ + h = ${x2}\n` +
      `x₃ = x₂ + h = ${x3}`

    return { result, details, iterations }
  },
}

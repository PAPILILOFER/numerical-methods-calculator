import type { IntegrationMethod, CoefficientIteration } from "@/lib/types"

export const metodoSimpson38: IntegrationMethod = {
  name: "Método de Simpson 3/8",
  id: "simpson38",

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculate: (f: (x: number) => number, a: number, b: number, _: number): number => {
    const h = (b - a) / 3  // h es (b-a)/3 para Simpson 3/8

    // Simpson 3/8 usa 4 puntos específicos
    const x1 = a          // Punto inicial
    const x2 = a + h      // Primer punto intermedio
    const x3 = a + 2 * h  // Segundo punto intermedio
    const x4 = a + 3 * h  // Punto final (igual a b)

    const suma = f(x1) + 3*f(x2) + 3*f(x3) + f(x4)
    return ((3 * h) / 8) * suma
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDetails: (f: (x: number) => number, a: number, b: number, _: number) => {
    const h = (b - a) / 3  // h es (b-a)/3 para Simpson 3/8
    const iterations: CoefficientIteration[] = []

    // Calcular los 4 puntos necesarios
    const x1 = a          // Punto inicial
    const x2 = a + h      // Primer punto intermedio
    const x3 = a + 2 * h  // Segundo punto intermedio
    const x4 = a + 3 * h  // Punto final (igual a b)

    const fx1 = f(x1)
    const fx2 = f(x2)
    const fx3 = f(x3)
    const fx4 = f(x4)

    // Agregar los puntos como iteraciones individuales
    iterations.push(
      { i: 1, xi: x1, fxi: fx1, coef: 1, term: fx1 },
      { i: 2, xi: x2, fxi: fx2, coef: 3, term: 3 * fx2 },
      { i: 3, xi: x3, fxi: fx3, coef: 3, term: 3 * fx3 },
      { i: 4, xi: x4, fxi: fx4, coef: 1, term: fx4 }
    )

    const suma = fx1 + 3*fx2 + 3*fx3 + fx4
    const result = ((3 * h) / 8) * suma

    const details =
      `Método de Simpson 3/8 con 4 puntos\n` +
      `Fórmula: (3h/8)[f(x₁) + 3f(x₂) + 3f(x₃) + f(x₄)]\n` +
      `h = (b - a) / 3 = (${b} - ${a}) / 3 = ${h}\n` +
      `x₁ = ${x1}\n` +
      `x₂ = x₁ + h = ${x2}\n` +
      `x₃ = x₂ + h = ${x3}\n` +
      `x₄ = x₃ + h = ${x4}`

    return { result, details, iterations }
  },
}

import type { IntegrationMethod, CoefficientIteration } from "@/lib/types"

export const metodoSimpsonAbierto: IntegrationMethod = {
  name: "Método de Simpson Abierto",
  id: "simpsonAbierto",

  calculate: (f: (x: number) => number, a: number, b: number, n: number): number => {
    if (n % 2 !== 0) {
      throw new Error("El número de segmentos debe ser par");
    }

    const h = (b - a) / n;
    let suma = f(a);

    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      const coef = i % 2 !== 0 ? 4 : 2;
      suma += coef * f(x);
    }

    suma += f(b);

    return (h / 3) * suma;
  },

  getDetails: (f: (x: number) => number, a: number, b: number, n: number) => {
    if (n % 2 !== 0) {
      throw new Error("El número de segmentos debe ser par");
    }

    const h = (b - a) / n;
    const iterations: CoefficientIteration[] = [];
    let suma = 0;

    // Calcular y mostrar todos los puntos
    let puntosDetails = `Puntos utilizados:\n`;

    // Primer punto del cálculo (x₁ = a)
    const x1 = a;
    const fx1 = f(x1);
    iterations.push({
      i: 1,
      xi: x1,
      fxi: fx1,
      coef: 1,
      term: fx1
    });
    suma += fx1;
    puntosDetails += `x₁ = a = ${a}\n`;

    // Puntos intermedios
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      const coef = i % 2 !== 0 ? 4 : 2;
      const fx = f(x);
      const term = coef * fx;
      iterations.push({
        i: i + 1,
        xi: x,
        fxi: fx,
        coef,
        term
      });
      suma += term;
      puntosDetails += `x${i + 1} = a + ${i}h = ${a} + ${i} × ${h} = ${x}\n`;
    }

    // Último punto (xₙ = b)
    const xn = b;
    const fxn = f(xn);
    iterations.push({
      i: n + 1,
      xi: xn,
      fxi: fxn,
      coef: 1,
      term: fxn
    });
    suma += fxn;
    puntosDetails += `xₙ = b = ${b}\n`;

    const result = (h / 3) * suma;

    const details =
      `Método de Simpson Abierto con ${n} puntos\n` +
      `Fórmula: (h/3)[f(x₁) + 4f(x₂) + 2f(x₃) + 4f(x₄) + 2f(x₅) + ... + f(xₙ)]\n` +
      `donde n debe ser par para mantener el patrón de coeficientes 1, 4, 2, 4, 2, ..., 1\n` +
      `h = (b - a) / n = (${b} - ${a}) / ${n} = ${h}\n\n` +
      puntosDetails;

    return { result, details, iterations };
  },
}

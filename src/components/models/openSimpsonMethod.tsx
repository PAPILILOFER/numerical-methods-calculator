import type { IntegrationMethod, CoefficientIteration } from "@/lib/types"

export const metodoSimpsonAbierto: IntegrationMethod = {
  name: "Método de Simpson Abierto",
  id: "simpsonAbierto",

  calculate: (f: (x: number) => number, a: number, b: number, n: number): number => {
    if (n % 2 !== 0) {
      n = n + 1;
    }

    if (n < 4) {
      n = 4;
    }

    const h = (b - a) / n;
    let suma = f(a + h);


    for (let i = 2; i < n; i++) {
      const x = a + i * h;
      const coef = i % 2 === 0 ? 4 : 2;
      suma += coef * f(x);
    }

    suma += f(b - h);

    return (h / 3) * suma;
  },

  getDetails: (f: (x: number) => number, a: number, b: number, n: number) => {
    let adjustedN = n;
    let adjustmentMessage = "";


    if (n % 2 !== 0) {
      adjustedN = n + 1;
      adjustmentMessage = `Nota: Se ajustó n de ${n} a ${adjustedN} para mantener la paridad requerida por el método.\n`;
    }


    if (adjustedN < 4) {
      adjustmentMessage += `Nota: Se ajustó n a 4 (mínimo requerido) para tener suficientes puntos.\n`;
      adjustedN = 4;
    }

    const h = (b - a) / adjustedN;
    const iterations: CoefficientIteration[] = [];
    let suma = 0;

    const x1 = a + h;
    const fx1 = f(x1);
    iterations.push({
      i: 1,
      xi: x1,
      fxi: fx1,
      coef: 1,
      term: fx1
    });
    suma += fx1;


    for (let i = 2; i < adjustedN; i++) {
      const x = a + i * h;
      const coef = i % 2 === 0 ? 4 : 2;
      const fx = f(x);
      const term = coef * fx;
      iterations.push({
        i,
        xi: x,
        fxi: fx,
        coef,
        term
      });
      suma += term;
    }


    const xn = b - h;
    const fxn = f(xn);
    iterations.push({
      i: adjustedN,
      xi: xn,
      fxi: fxn,
      coef: 1,
      term: fxn
    });
    suma += fxn;

    const result = (h / 3) * suma;

    const details =
      adjustmentMessage +
      `Método de Simpson Abierto con ${adjustedN} puntos\n` +
      `Fórmula: (h/3)[f(x₁) + 4f(x₂) + 2f(x₃) + 4f(x₄) + 2f(x₅) + ... + f(xₙ)]\n` +
      `donde n debe ser par para mantener el patrón de coeficientes 1, 4, 2, 4, 2, ..., 1\n` +
      `h = (b - a) / n = (${b} - ${a}) / ${adjustedN} = ${h}\n` +
      `x₁ = a + h = ${a} + ${h} = ${x1}\n` +
      `xₙ = b - h = ${b} - ${h} = ${xn}`;

    return { result, details, iterations };
  },
}

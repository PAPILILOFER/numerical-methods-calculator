// Tipos comunes para los métodos numéricos

// Tipo base para iteraciones
export interface BaseIteration {
  xi: number
  fxi: number
}

// Tipo para todos los métodos
export interface CoefficientIteration extends BaseIteration {
  i: number  // Índice de la iteración
  coef: number
  term: number
}

// Tipo para Simpson 1/3 (exactamente 3 puntos)
export interface Simpson13Iteration {
  points: BaseIteration[]  // Siempre tendrá 3 puntos
}

// Tipo para Simpson 3/8 (exactamente 4 puntos)
export interface Simpson38Iteration {
  points: BaseIteration[]  // Siempre tendrá 4 puntos
}

export interface IntegrationMethod {
  name: string
  id: string
  calculate: (f: (x: number) => number, a: number, b: number, n: number) => number
  getDetails: (
    f: (x: number) => number,
    a: number,
    b: number,
    n: number,
  ) => {
    result: number
    details: string
    iterations: CoefficientIteration[]
  }
}

export interface CalculationResult {
  result: number
  details: string
}
  
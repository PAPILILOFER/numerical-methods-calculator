// Valores analíticos conocidos para algunas integrales
export const valoresAnaliticos: Record<string, Record<string, number>> = {
    "x^2": {
      "0,1": 1 / 3,
      "0,2": 8 / 3,
      "1,2": 7 / 3,
    },
    "x^3": {
      "0,1": 1 / 4,
      "0,2": 4,
      "1,2": 15 / 4,
    },
    x: {
      "0,1": 1 / 2,
      "0,2": 2,
      "1,2": 3 / 2,
    },
    "5": {
      "0,1": 5,
      "0,2": 10,
      "1,2": 5,
    },
    "sin(x)": {
      "0,3.14159": 2,
      "0,6.28318": 0,
    },
    "sqrt(x)": {
      "0,1": 2 / 3,
      "1,4": 14 / 3 - 2 / 3,
      "6,12": (2 / 3) * (Math.pow(12, 3 / 2) - Math.pow(6, 3 / 2)),
    },
  }
  
  // Función para verificar si existe un valor analítico conocido
  export const getValorAnalitico = (
    expression: string,
    a: number,
    b: number,
  ): { valorExacto: number; formula: string } | null => {
    // Limpiar la expresión
    const cleanExpression = expression.replace(/dx$/i, "").trim()
  
    // Casos especiales que no están en la tabla
    if (cleanExpression === "sqrt(x)" && a === 6 && b === 12) {
      const valorExacto = (2 / 3) * (Math.pow(12, 3 / 2) - Math.pow(6, 3 / 2))
      return {
        valorExacto,
        formula: "(2/3) * (12^(3/2) - 6^(3/2))",
      }
    } else if (cleanExpression === "sin(x)" && a === 0 && b === Math.PI) {
      return {
        valorExacto: 2,
        formula: "∫sin(x)dx de 0 a π = 2",
      }
    } else if (cleanExpression === "exp(x)" && a === 0 && b === 1) {
      const valorExacto = Math.E - 1
      return {
        valorExacto,
        formula: "∫e^x dx de 0 a 1 = e - 1",
      }
    } else if (cleanExpression === "log(x)" && a === 1 && b === 2) {
      const valorExacto = 2 * Math.log(2) - 1
      return {
        valorExacto,
        formula: "∫ln(x)dx de 1 a 2 = 2ln(2) - 1",
      }
    } else if (cleanExpression === "x^3 - 2*x^2 + 3*x - 5" && a === 0 && b === 2) {
      const valorExacto = 2 - 8 / 3 + 6 - 10
      return {
        valorExacto,
        formula: "∫(x^3 - 2x^2 + 3x - 5)dx de 0 a 2 = (x^4/4 - 2x^3/3 + 3x^2/2 - 5x)|_0^2",
      }
    } else if (cleanExpression === "x^2" && a === 0 && b === 1) {
      return {
        valorExacto: 1 / 3,
        formula: "∫x^2 dx de 0 a 1 = x^3/3|_0^1 = 1/3",
      }
    }
  
    // Buscar en la tabla de valores analíticos
    const key = `${a},${b}`
    if (valoresAnaliticos[cleanExpression] && valoresAnaliticos[cleanExpression][key]) {
      return {
        valorExacto: valoresAnaliticos[cleanExpression][key],
        formula: `Valor analítico conocido para ∫${cleanExpression} dx de ${a} a ${b}`,
      }
    }
  
    return null
  }
  
import { MathParser, evaluateExpression } from "@/lib/parser"
import { getValorAnalitico } from "@/lib/analyticalValues"
import type { IntegrationMethod } from "@/lib/types"
import { Dispatch, SetStateAction } from 'react'

interface CalculateHandlerProps {
  selectedMethod: string | null
  functionExpression: string
  lowerLimit: string
  upperLimit: string
  nValue: string
  setError: Dispatch<SetStateAction<string | null>>
  setResult: Dispatch<SetStateAction<number | null>>
  setCalculationDetails: Dispatch<SetStateAction<string>>
  setIterationData: Dispatch<SetStateAction<any[]>>
  parser: MathParser
  metodos: IntegrationMethod[]
}

export const handleCalculate = ({
  selectedMethod,
  functionExpression,
  lowerLimit,
  upperLimit,
  nValue,
  setError,
  setResult,
  setCalculationDetails,
  setIterationData,
  parser,
  metodos
}: CalculateHandlerProps) => () => {
  setError(null)

  if (!selectedMethod || !functionExpression || !lowerLimit || !upperLimit) {
    setError("Por favor complete todos los campos")
    return
  }

  // Validación específica para el método de Simpson Abierto y Trapezoidal
  if (selectedMethod === "simpsonAbierto" || selectedMethod === "trapezoidal") {
    if (!nValue) {
      setError("Por favor ingrese el valor de n")
      return
    }
    const n = parseInt(nValue)
    if (isNaN(n)) {
      setError("El valor de n debe ser un número")
      return
    }
    
    if (selectedMethod === "simpsonAbierto") {
      if (n % 2 !== 0) {
        setError("El valor de n debe ser par")
        return
      }
      if (n < 4) {
        setError("El valor de n debe ser al menos 4")
        return
      }
    } else if (selectedMethod === "trapezoidal") {
      if (n < 1) {
        setError("El valor de n debe ser al menos 1")
        return
      }
    }
  }

  try {
    const a = evaluateExpression(lowerLimit, parser)
    const b = evaluateExpression(upperLimit, parser)
    const n = (selectedMethod === "simpsonAbierto" || selectedMethod === "trapezoidal") 
      ? parseInt(nValue) 
      : 10000

    if (isNaN(a) || isNaN(b)) {
      setError("Por favor ingrese valores numéricos válidos")
      return
    }

    // Limpiar la expresión de la función (eliminar 'dx' si está presente)
    const cleanExpression = functionExpression.replace(/dx$/i, "").trim()

    // Crear la función evaluadora usando el parser
    const f = (x: number) => {
      try {
        return parser.evaluate(cleanExpression, x)
      } catch (error) {
        throw new Error(`Error evaluando la función: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    // Probar la función con varios valores para verificar que es válida
    try {
      const testPoints = [a, (a + b) / 2, b]
      for (const point of testPoints) {
        const testValue = f(point)
        if (isNaN(testValue) || !isFinite(testValue)) {
          throw new Error(`La función no produce un resultado válido en x = ${point}`)
        }
      }
    } catch (error) {
      setError(
        `Error al evaluar la función: ${error instanceof Error ? error.message : String(error)}. Verifique la sintaxis.`,
      )
      return
    }

    // Encontrar el método seleccionado
    const metodo = metodos.find((m) => m.id === selectedMethod)

    if (!metodo) {
      setError("Método no encontrado")
      return
    }

    // Calcular usando el método seleccionado
    const { result: calculatedResult, details, iterations } = metodo.getDetails(f, a, b, n)

    let finalDetails = details

    // Verificar si tenemos un valor analítico conocido
    const valorAnalitico = getValorAnalitico(cleanExpression, a, b)
    if (valorAnalitico) {
      finalDetails += `\n\nValor analítico exacto: ${valorAnalitico.formula} = ${valorAnalitico.valorExacto}`
      finalDetails += `\nError absoluto: ${Math.abs(calculatedResult - valorAnalitico.valorExacto)}`
    }

    setResult(calculatedResult)
    setCalculationDetails(finalDetails)
    setIterationData(iterations)
  } catch (error) {
    setError(`Error al calcular: ${error instanceof Error ? error.message : String(error)}`)
  }
} 
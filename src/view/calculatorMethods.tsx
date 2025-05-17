"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, ActivityIcon as Function, LineChart as ChartIcon, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MathParser, evaluateExpression } from "@/lib/parser"
import { metodoTrapezoidal } from "@/components/models/trapezoidalMethod"
import { metodoBoole } from "@/components/models/booleMethod"
import { metodoSimpson38 } from "@/components/models/methodSimpson3-8"
import { metodoSimpson13 } from "@/components/models/simpsonMethod1-3"
import { metodoSimpsonAbierto } from "@/components/models/openSimpsonMethod"
import { getValorAnalitico } from "@/lib/analyticalValues"
import type { IntegrationMethod, CoefficientIteration } from "@/lib/types"
import LineChart from "@/components/charts/chartLine"
import DefaultFunctions from "@/components/defaultFunctions"

// Lista de todos los métodos disponibles
const metodos: IntegrationMethod[] = [
  metodoTrapezoidal,
  metodoBoole,
  metodoSimpson38,
  metodoSimpson13,
  metodoSimpsonAbierto,
]

const convertToMathSymbols = (expression: string): string => {
  return expression
    .replace(/sqrt\(/g, '√(')
    .replace(/\*\*/g, '^')
    .replace(/\*/g, '×')
    .replace(/pi/g, 'π')
    .replace(/sin\(/g, 'sen(')
    .replace(/exp\(/g, 'e^(')
    .replace(/log\(/g, 'ln(');
}

export default function CalculatorMethods() {
  const [activeTab, setActiveTab] = useState("selector")
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [functionExpression, setFunctionExpression] = useState("")
  const [lowerLimit, setLowerLimit] = useState("")
  const [upperLimit, setUpperLimit] = useState("")
  const [result, setResult] = useState<number | null>(null)
  const [calculationDetails, setCalculationDetails] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [iterationData, setIterationData] = useState<CoefficientIteration[]>([])
  const functionInputRef = useRef<HTMLInputElement>(null)
  const parser = new MathParser()
  const [nValue, setNValue] = useState("")

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    setActiveTab("calculator")
    // Reset result when changing methods
    setResult(null)
    setCalculationDetails("")
    setError(null)
    setIterationData([])
  }

  const insertAtCursor = (text: string) => {
    if (functionInputRef.current) {
      const input = functionInputRef.current
      const start = input.selectionStart || 0
      const end = input.selectionEnd || 0
      const value = input.value

      const newValue = value.substring(0, start) + text + value.substring(end)
      setFunctionExpression(newValue)

      // Focus back on the input and set cursor position after the inserted text
      setTimeout(() => {
        if (functionInputRef.current) {
          functionInputRef.current.focus()
          functionInputRef.current.setSelectionRange(start + text.length, start + text.length)
        }
      }, 0)
    } else {
      setFunctionExpression((prev) => prev + text)
    }
  }

  const loadExample = (example: string) => {
    setError(null)

    switch (example) {
      case "sqrt":
        setFunctionExpression("sqrt(x)")
        setLowerLimit("6")
        setUpperLimit("12")
        break
      case "sin":
        setFunctionExpression("sin(x)")
        setLowerLimit("0")
        setUpperLimit("pi")
        break
      case "poly":
        setFunctionExpression("x^3 - 2*x^2 + 3*x - 5")
        setLowerLimit("0")
        setUpperLimit("2")
        break
      case "exp":
        setFunctionExpression("exp(x)")
        setLowerLimit("0")
        setUpperLimit("1")
        break
      case "log":
        setFunctionExpression("log(x)")
        setLowerLimit("1")
        setUpperLimit("2")
        break
      case "complex":
        setFunctionExpression("sin(x) * sqrt(x)")
        setLowerLimit("1")
        setUpperLimit("5")
        break
      case "simple":
        setFunctionExpression("x^2")
        setLowerLimit("0")
        setUpperLimit("1")
        break
      case "clear":
        setFunctionExpression("")
        setLowerLimit("")
        setUpperLimit("")
        break
    }
  }

  const handleCalculate = () => {
    setError(null)

    if (!selectedMethod || !functionExpression || !lowerLimit || !upperLimit) {
      setError("Por favor complete todos los campos")
      return
    }

    // Validación específica para el método de Simpson Abierto
    if (selectedMethod === "simpsonAbierto") {
      if (!nValue) {
        setError("Por favor ingrese el valor de n")
        return
      }
      const n = parseInt(nValue)
      if (isNaN(n)) {
        setError("El valor de n debe ser un número")
        return
      }
      if (n % 2 !== 0) {
        setError("El valor de n debe ser par")
        return
      }
      if (n < 4) {
        setError("El valor de n debe ser al menos 4")
        return
      }
    }

    try {
      const a = evaluateExpression(lowerLimit, parser)
      const b = evaluateExpression(upperLimit, parser)
      const n = selectedMethod === "simpsonAbierto" ? parseInt(nValue) : 10000

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

  const getMethodTitle = () => {
    const metodo = metodos.find((m) => m.id === selectedMethod)
    return metodo ? metodo.name : "Calculadora"
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-2xl">Calculadora de Métodos Numéricos</CardTitle>
        <CardDescription>Selecciona un método numérico para realizar cálculos de integración</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="selector">Selección de Método</TabsTrigger>
            <TabsTrigger value="calculator" disabled={!selectedMethod}>
              Calculadora
            </TabsTrigger>
          </TabsList>
          <TabsContent value="selector" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => handleMethodSelect("trapezoidal")}
              >
                <Calculator className="h-6 w-6 mb-2" />
                <span>1. Método Trapezoidal</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => handleMethodSelect("boole")}
              >
                <Calculator className="h-6 w-6 mb-2" />
                <span>2. Método de Boole</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => handleMethodSelect("simpson38")}
              >
                <Calculator className="h-6 w-6 mb-2" />
                <span>3. Simpson 3/8 - Newton-Cotes</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => handleMethodSelect("simpson13")}
              >
                <Calculator className="h-6 w-6 mb-2" />
                <span>4. Simpson 1/3 - Newton-Cotes</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center col-span-1 md:col-span-2"
                onClick={() => handleMethodSelect("simpsonAbierto")}
              >
                <Calculator className="h-6 w-6 mb-2" />
                <span>5. Simpson Abierto</span>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="calculator" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{getMethodTitle()}</h3>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("selector")}>
                Cambiar método
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="function">Función f(x)</Label>
                <div className="flex items-center gap-2">
                  <Function className="h-4 w-4" />
                  <Input
                    id="function"
                    placeholder="Ej: x^2 + 2*x + 1"
                    value={functionExpression}
                    onChange={(e) => setFunctionExpression(e.target.value)}
                    ref={functionInputRef}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("+")}>
                    +
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("-")}>
                    -
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("*")}>
                    ×
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("/")}>
                    ÷
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("^")}>
                    x^n
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("sqrt(")}>
                    √
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("sin(")}>
                    sin
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("cos(")}>
                    cos
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("tan(")}>
                    tan
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("log(")}>
                    log
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("exp(")}>
                    e^x
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("pi")}>
                    π
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("e")}>
                    e
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("(")}>
                    (
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor(")")}>
                    )
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor("x")}>
                    x
                  </Button>
                </div>
                <DefaultFunctions onSelectFunction={loadExample} />
                <p className="text-xs text-muted-foreground mt-1">
                  Escribe tu función o selecciona los símbolos para construirla
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lowerLimit">Límite inferior (a)</Label>
                  <Input
                    id="lowerLimit"
                    placeholder="0"
                    value={lowerLimit}
                    onChange={(e) => setLowerLimit(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="upperLimit">Límite superior (b)</Label>
                  <Input
                    id="upperLimit"
                    placeholder="1"
                    value={upperLimit}
                    onChange={(e) => setUpperLimit(e.target.value)}
                  />
                </div>
              </div>
              {selectedMethod === "simpsonAbierto" && (
                <div className="grid gap-2">
                  <Label htmlFor="nValue">Número de segmentos (n)</Label>
                  <Input
                    id="nValue"
                    type="number"
                    step="2"
                    min="4"
                    placeholder="Ingrese un número par ≥ 4"
                    value={nValue}
                    onChange={(e) => {
                      const value = e.target.value
                      setNValue(value) // Permitir cualquier valor al escribir
                    }}
                    className={nValue && (parseInt(nValue) < 4 || parseInt(nValue) % 2 !== 0) ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    El número de segmentos debe ser par y mayor o igual a 4
                  </p>
                </div>
              )}
              <Button onClick={handleCalculate} className="w-full">
                Calcular
              </Button>
              {result !== null && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 border rounded-md bg-muted">
                    <div className="flex items-center gap-2">
                      <ChartIcon className="h-5 w-5" />
                      <h4 className="font-medium">Resultado:</h4>
                    </div>
                    <p className="text-xl font-bold mt-2">{result}</p>

                    {calculationDetails && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium mb-2">Detalles del cálculo:</h5>
                        <pre className="text-xs whitespace-pre-wrap">{calculationDetails}</pre>
                      </div>
                    )}
                  </div>

                  {iterationData.length > 0 && (
                    <>
                      <div className="border rounded-md">
                        <LineChart iterations={iterationData} />
                      </div>

                      <div className="border rounded-md mt-4">
                        <Table>
                          <TableCaption>Tabla de Valores</TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>X</TableHead>
                              <TableHead>Y = {convertToMathSymbols(functionExpression)}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {iterationData.map((iteration, index) => (
                              <TableRow key={index}>
                                <TableCell>{Number(iteration.xi).toString()}</TableCell>
                                <TableCell>{Number(iteration.fxi).toString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="border rounded-md mt-4">
                        <Table>
                          <TableCaption>Tabla de Iteración</TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Xᵢ</TableHead>
                              <TableHead>Y = {convertToMathSymbols(functionExpression)}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {iterationData.map((iteration, index) => (
                              <TableRow key={index}>
                                <TableCell>{Number(iteration.xi).toString()}</TableCell>
                                <TableCell>
                                  {iteration.coef === 1 
                                    ? `${convertToMathSymbols(functionExpression).replace(/x/g, iteration.xi.toString())} = ${Number(iteration.term).toString()}`
                                    : `${iteration.coef}(${convertToMathSymbols(functionExpression).replace(/x/g, iteration.xi.toString())}) = ${Number(iteration.term).toString()}`}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

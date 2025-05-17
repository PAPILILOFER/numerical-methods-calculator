"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, ActivityIcon as Function, LineChart as ChartIcon, AlertCircle, ArrowLeft } from "lucide-react"
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
import { loadExample } from "@/components/FunctionExample"
import { handleCalculate } from "@/components/CalculateHandler"
import Symbol from "@/components/Symbol"

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

  const handleLoadExample = loadExample({
    setFunctionExpression,
    setLowerLimit,
    setUpperLimit,
    setError
  })

  const handleCalculateClick = handleCalculate({
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
  })

  const getMethodTitle = () => {
    const metodo = metodos.find((m) => m.id === selectedMethod)
    return metodo ? metodo.name : "Calculadora"
  }

  const resetAllValues = () => {
    setFunctionExpression("")
    setLowerLimit("")
    setUpperLimit("")
    setResult(null)
    setCalculationDetails("")
    setError(null)
    setIterationData([])
    setNValue("")
  }

  const handleBack = () => {
    resetAllValues()
    setSelectedMethod(null)
    setActiveTab("selector")
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        {activeTab === "calculator" && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="mb-4 -mt-2 -ml-2 flex items-center gap-2 w-fit dark:bg-white dark:text-black bg-black text-white hover:bg-black/90 dark:hover:bg-white/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Selección de métodos
          </Button>
        )}
        <CardTitle className="text-2xl">
          {activeTab === "calculator" 
            ? getMethodTitle()
            : "Calculadora de Métodos Numéricos"
          }
        </CardTitle>
        <CardDescription>
          {activeTab === "calculator"
            ? "Ingrese los valores para realizar el cálculo de integración numérica"
            : "Selecciona un método numérico para realizar cálculos de integración"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger 
              value="selector" 
              disabled 
              className={`${
                activeTab === "selector" 
                ? "dark:text-white text-black font-bold border-2 border-primary" 
                : "text-muted-foreground"
              } transition-all [&:disabled]:opacity-100`}
            >
              Selección de Método
            </TabsTrigger>
            <TabsTrigger 
              value="calculator" 
              disabled
              className={`${
                activeTab === "calculator" 
                ? "dark:text-white text-black font-bold border-2 border-primary" 
                : "text-muted-foreground"
              } transition-all [&:disabled]:opacity-100`}
            >
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
                <span>3. T.Simpson 3/8 </span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => handleMethodSelect("simpson13")}
              >
                <Calculator className="h-6 w-6 mb-2" />
                <span>4. T:Simpson 1/3 </span>
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
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="function" className="text-1xl font-medium my-2">Función f(x)</Label>
                <div className="flex items-center gap-2">
                  <Function className="h-4 w-4" />
                  <Input
                    id="function"
                    placeholder="Ej: x^2 + 2*x + 1"
                    value={functionExpression}
                    onChange={(e) => setFunctionExpression(e.target.value)}
                    ref={functionInputRef}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleCalculateClick} 
                    className="shrink-0 px-4"
                    size="sm"
                  >
                    Calcular
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetAllValues()
                      handleLoadExample("clear")
                    }}
                    className="shrink-0 px-4"
                    size="sm"
                  >
                    Limpiar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Escribe tu función o selecciona los símbolos para construirla
                </p>

                <div className="grid grid-cols-2 gap-4 mt-2">
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

                {(selectedMethod === "simpsonAbierto" || selectedMethod === "trapezoidal") && (
                  <div className="grid gap-2 mt-2">
                    <Label htmlFor="nValue">
                      {selectedMethod === "simpsonAbierto" 
                        ? "Número de segmentos (n)" 
                        : "Número de segmentos"}
                    </Label>
                    <Input
                      id="nValue"
                      type="number"
                      min={selectedMethod === "simpsonAbierto" ? "4" : "1"}
                      step={selectedMethod === "simpsonAbierto" ? "2" : "1"}
                      placeholder={
                        selectedMethod === "simpsonAbierto"
                          ? "Ingrese un número par ≥ 4"
                          : "Ingrese el número de segmentos"
                      }
                      value={nValue}
                      onChange={(e) => {
                        const value = e.target.value
                        setNValue(value)
                      }}
                      className={
                        selectedMethod === "simpsonAbierto" && nValue 
                        ? (parseInt(nValue) < 4 || parseInt(nValue) % 2 !== 0) 
                          ? "border-destructive" 
                          : ""
                        : ""
                      }
                    />
                    {selectedMethod === "simpsonAbierto" && (
                      <p className="text-xs text-muted-foreground">
                        El número de segmentos debe ser par y mayor o igual a 4
                      </p>
                    )}
                  </div>
                )}

                <hr className="my-2" />

                <Symbol insertAtCursor={insertAtCursor} />

                <hr className="my-2" />
                <h5 className="font-medium mb-2">Ejemplos de funciones por defecto:</h5>
                <DefaultFunctions onSelectFunction={handleLoadExample} />

                <hr className="my-2" />
              </div>
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

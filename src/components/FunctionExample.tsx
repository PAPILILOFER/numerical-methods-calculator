import { Dispatch, SetStateAction } from 'react'

interface FunctionExampleProps {
  setFunctionExpression: Dispatch<SetStateAction<string>>
  setLowerLimit: Dispatch<SetStateAction<string>>
  setUpperLimit: Dispatch<SetStateAction<string>>
  setError: Dispatch<SetStateAction<string | null>>
}

export const loadExample = ({
  setFunctionExpression,
  setLowerLimit,
  setUpperLimit,
  setError
}: FunctionExampleProps) => (example: string) => {
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
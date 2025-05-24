import { Button } from "@/components/ui/button"
import RootDialog from "./RootDialog"

interface SymbolProps {
  insertAtCursor: (text: string) => void;
}

export default function Symbol({ insertAtCursor }: SymbolProps) {
  const handleRootConfirm = (index: number, expression: string) => {
    if (index === 2) {
      insertAtCursor(`sqrt(${expression})`)
    } else {
      insertAtCursor(`${expression}`)
    }
  }

  return (
    <>
      <h5 className="font-medium mb-2">Símbolos:</h5>
      <div className="flex flex-wrap gap-2">
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
          ^
        </Button>
        <Button variant="outline" size="sm" onClick={() => insertAtCursor("sqrt(")}>
          √
        </Button>
        <RootDialog onConfirm={handleRootConfirm} />
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
        <Button variant="outline" size="sm" onClick={() => insertAtCursor("ln(")}>
          ln
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
      </div>
    </>
  )
} 
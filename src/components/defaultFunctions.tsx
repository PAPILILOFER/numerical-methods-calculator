import { Button } from "@/components/ui/button"

interface DefaultFunctionsProps {
  onSelectFunction: (example: string) => void;
}

export default function DefaultFunctions({ onSelectFunction }: DefaultFunctionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-2">
      <Button variant="outline" size="sm" onClick={() => onSelectFunction("simple")}>
        x^2 
      </Button>
      <Button variant="outline" size="sm" onClick={() => onSelectFunction("sqrt")}>
        √x
      </Button>
      <Button variant="outline" size="sm" onClick={() => onSelectFunction("sin")}>
        sin(x)
      </Button>
      <Button variant="outline" size="sm" onClick={() => onSelectFunction("exp")}>
        e^x
      </Button>
      <Button variant="outline" size="sm" onClick={() => onSelectFunction("log")}>
        log(x)
      </Button>
      <Button variant="outline" size="sm" onClick={() => onSelectFunction("complex")}>
        Compleja
      </Button>
    </div>
  )
} 
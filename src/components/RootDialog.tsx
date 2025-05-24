import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RootDialogProps {
  onConfirm: (index: number, expression: string) => void
}

const superscriptNumbers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']

const toSuperscript = (num: number): string => {
  return num.toString().split('').map(digit => superscriptNumbers[parseInt(digit)]).join('')
}

export default function RootDialog({ onConfirm }: RootDialogProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState('2')
  const [expression, setExpression] = useState('')

  const handleConfirm = () => {
    const n = parseInt(index)
    if (!isNaN(n) && n > 0 && expression.trim()) {
      if (n === 2) {
        onConfirm(n, expression.trim())
      } else {
        const formattedExpression = `root(${n},${expression.trim()})`
        onConfirm(n, formattedExpression)
      }
      setOpen(false)
      setExpression('')
      setIndex('2')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          ⁿ√x
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Raíz n-ésima</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="index">Índice de la raíz</Label>
            <div className="flex items-center gap-2">
              <Input
                id="index"
                type="number"
                min="1"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                className="w-24"
              />
              <div className="flex-1 text-lg border rounded-md p-2 bg-muted">
                {toSuperscript(parseInt(index) || 2)}√
                <span className="text-muted-foreground">
                  {expression || 'expresión'}
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expression">Expresión dentro de la raíz</Label>
            <Input
              id="expression"
              placeholder="Ejemplo: x+2"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {
            setOpen(false)
            setExpression('')
          }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!expression.trim() || parseInt(index) < 1}>
            Insertar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
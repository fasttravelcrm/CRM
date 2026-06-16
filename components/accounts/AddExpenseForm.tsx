'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { addExpense } from '@/app/actions/accounts'
import type { ExpenseType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, TrendingDown } from 'lucide-react'

const EXPENSE_TYPES: ExpenseType[] = [
  'Umrah Supplier',
  'Airline / Ticket',
  'Hotel Supplier',
  'Transport Supplier',
  'Other Umrah Expense',
]

const METHODS = ['Cash', 'Bank', 'JazzCash', 'EasyPaisa'] as const

export default function AddExpenseForm() {
  const [expenseType, setExpenseType] = useState<ExpenseType>('Umrah Supplier')
  const [supplier, setSupplier] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<typeof METHODS[number]>('Cash')
  const [note, setNote] = useState('')
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0])
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const amountNum = parseFloat(amount)
    if (!supplier.trim()) { toast.error('Supplier / description is required'); return }
    if (!amountNum || amountNum <= 0) { toast.error('Amount must be greater than zero'); return }

    const formData = new FormData()
    formData.set('expense_type', expenseType)
    formData.set('supplier', supplier.trim())
    formData.set('amount_pkr', String(amountNum))
    formData.set('method', method)
    formData.set('note', note.trim())
    formData.set('expense_date', expenseDate)

    startTransition(async () => {
      const result = await addExpense(formData)
      if ('error' in result && result.error) {
        toast.error(result.error)
      } else {
        toast.success('Expense recorded successfully!')
        setSupplier('')
        setAmount('')
        setNote('')
        setExpenseDate(new Date().toISOString().split('T')[0])
      }
    })
  }

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <TrendingDown className="w-4 h-4" />
          Umrah Expense / Supplier Payment
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Record supplier, airline, hotel, and transport payments here.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="col-span-2 md:col-span-1 lg:col-span-2 space-y-1.5">
            <Label className="text-xs">Expense Type</Label>
            <Select value={expenseType} onValueChange={v => v && setExpenseType(v as ExpenseType)}>
              <SelectTrigger className="w-full">
                <SelectValue>{expenseType}</SelectValue>
              </SelectTrigger>
              <SelectContent className="min-w-[220px] !w-auto">
                {EXPENSE_TYPES.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 md:col-span-2 lg:col-span-2 space-y-1.5">
            <Label className="text-xs">Supplier / Description</Label>
            <Input
              placeholder="e.g. Al-Noor Umrah Services"
              value={supplier}
              onChange={e => setSupplier(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Amount (PKR)</Label>
            <Input
              type="number"
              min={1}
              step={1}
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Method</Label>
            <Select value={method} onValueChange={v => v && setMethod(v as typeof METHODS[number])}>
              <SelectTrigger>
                <SelectValue>{method}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Date</Label>
            <Input
              type="date"
              value={expenseDate}
              onChange={e => setExpenseDate(e.target.value)}
              required
            />
          </div>

          <div className="col-span-2 md:col-span-2 lg:col-span-2 space-y-1.5">
            <Label className="text-xs">Note (optional)</Label>
            <Input
              placeholder="Additional details..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              disabled={isPending || !amount || !supplier}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Expense'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

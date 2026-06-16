'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteBooking } from '@/app/actions/bookings'
import { pkr, formatDate, bookingInvoiceId } from '@/lib/formatters'
import type { Booking } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Search, Loader2 } from 'lucide-react'

interface Props {
  bookings: Booking[]
}

export default function BookingsTable({ bookings }: Props) {
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = bookings.filter(b =>
    b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    b.airline_name.toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      await deleteBooking(deleteId)
      toast.success('Booking deleted')
      setDeleteId(null)
    })
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer or airline…"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs">Invoice</TableHead>
              <TableHead className="text-xs">Customer</TableHead>
              <TableHead className="text-xs">Airline</TableHead>
              <TableHead className="text-xs">Pax</TableHead>
              <TableHead className="text-xs text-right">Total</TableHead>
              <TableHead className="text-xs text-right">Paid</TableHead>
              <TableHead className="text-xs text-right">Due</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-12 text-sm">
                  {search ? 'No bookings match your search' : 'No bookings yet. Create your first package!'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/20">
                  <TableCell className="text-xs font-mono text-muted-foreground">{bookingInvoiceId(b.id)}</TableCell>
                  <TableCell className="font-medium text-sm">{b.customer_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.airline_name}</TableCell>
                  <TableCell className="text-sm">{b.adult_count + b.child_count + b.infant_count}</TableCell>
                  <TableCell className="text-right text-sm font-semibold">{pkr(b.total_pkr)}</TableCell>
                  <TableCell className="text-right text-sm text-emerald-600">{pkr(b.paid_pkr)}</TableCell>
                  <TableCell className="text-right text-sm text-amber-600">{pkr(b.remaining_pkr)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(b.booking_date)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={b.remaining_pkr > 0
                        ? 'text-amber-600 border-amber-200 bg-amber-50 text-[10px]'
                        : 'text-emerald-600 border-emerald-200 bg-emerald-50 text-[10px]'
                      }
                    >
                      {b.remaining_pkr > 0 ? 'Due' : 'Paid'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setDeleteId(b.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              This will permanently delete the booking and all associated payments. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

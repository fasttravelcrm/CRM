import { getBookings } from '@/lib/db'
import { pkr, formatDate, bookingInvoiceId } from '@/lib/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function InvoicesPage() {
  const bookings = await getBookings()

  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b bg-muted/20">
        <p className="text-sm text-muted-foreground">{bookings.length} invoice{bookings.length !== 1 ? 's' : ''}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="text-xs">Invoice #</TableHead>
            <TableHead className="text-xs">Customer</TableHead>
            <TableHead className="text-xs">Pax</TableHead>
            <TableHead className="text-xs">Airline</TableHead>
            <TableHead className="text-xs">Makkah Hotel</TableHead>
            <TableHead className="text-xs">Madinah Hotel</TableHead>
            <TableHead className="text-xs text-right">Amount</TableHead>
            <TableHead className="text-xs text-right">Balance</TableHead>
            <TableHead className="text-xs">Date</TableHead>
            <TableHead className="text-xs">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground py-12 text-sm">No invoices yet.</TableCell>
            </TableRow>
          ) : bookings.map((b) => (
            <TableRow key={b.id} className="hover:bg-muted/20">
              <TableCell className="text-xs font-mono font-semibold text-navy">{bookingInvoiceId(b.id)}</TableCell>
              <TableCell className="font-medium text-sm">{b.customer_name}</TableCell>
              <TableCell className="text-sm">{b.adult_count + b.child_count + b.infant_count}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{b.airline_name}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {b.makkah_hotel_name ?? '—'}
                {b.makkah_room_type && <span className="text-[10px] block capitalize">{b.makkah_room_type} · {b.makkah_nights}N</span>}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {b.madinah_hotel_name ?? '—'}
                {b.madinah_room_type && <span className="text-[10px] block capitalize">{b.madinah_room_type} · {b.madinah_nights}N</span>}
              </TableCell>
              <TableCell className="text-right text-sm font-semibold">{pkr(b.total_pkr)}</TableCell>
              <TableCell className="text-right text-sm text-amber-600">{pkr(b.remaining_pkr)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{formatDate(b.booking_date)}</TableCell>
              <TableCell>
                <Badge variant="outline"
                  className={b.remaining_pkr > 0
                    ? 'text-amber-600 border-amber-200 bg-amber-50 text-[10px]'
                    : 'text-emerald-600 border-emerald-200 bg-emerald-50 text-[10px]'
                  }
                >
                  {b.remaining_pkr > 0 ? 'Due' : 'Paid'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

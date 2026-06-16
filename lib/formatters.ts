export function pkr(n: number): string {
  return 'PKR ' + Math.round(n).toLocaleString('en-PK')
}

export function sar(n: number): string {
  return n.toLocaleString('en-PK') + ' SAR'
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function bookingInvoiceId(bookingId: string): string {
  return `INV-${bookingId.slice(0, 8).toUpperCase()}`
}

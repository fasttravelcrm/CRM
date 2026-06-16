import { forwardRef } from 'react'
import type { Airline, Hotel, CalcResult, Company } from '@/lib/types'
import { pkr } from '@/lib/formatters'

interface Props {
  invoiceNo: string
  customerName: string
  adult: number
  child: number
  infant: number
  airline: Airline | null
  makkahHotel: Hotel | null
  makkahRoom: string
  makkahNights: number
  madinahHotel: Hotel | null
  madinahRoom: string
  madinahNights: number
  calc: CalcResult
  advance: number
  transportMode: 'included' | 'separate'
  company: Company
}

const InvoicePrint = forwardRef<HTMLDivElement, Props>(function InvoicePrint(
  { invoiceNo, customerName, adult, child, infant, airline,
    makkahHotel, makkahRoom, makkahNights, madinahHotel, madinahRoom, madinahNights,
    calc, advance, transportMode, company }, ref
) {
  const today = new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'long', year: 'numeric' })
  const totalNights = makkahNights + madinahNights
  const paxStr = [
    adult > 0 ? `${adult} Adult${adult > 1 ? 's' : ''}` : '',
    child > 0 ? `${child} Child${child > 1 ? 'ren' : ''}` : '',
    infant > 0 ? `${infant} Infant${infant > 1 ? 's' : ''}` : '',
  ].filter(Boolean).join(', ')

  return (
    <div ref={ref} className="print-area" style={{ fontFamily: 'Inter, sans-serif', color: '#1a1a1a', background: 'white' }}>
      <div style={{ width: '194mm', margin: '0 auto', padding: '8mm' }}>
        {/* Header */}
        <div style={{ background: '#071426', color: 'white', borderRadius: '8px', padding: '16px 20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#d4a84f' }}>{company.name}</h1>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>{company.address} • {company.website}</p>
            {company.phone && <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', margin: '1px 0 0' }}>{company.phone}</p>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#d4a84f', margin: 0 }}>INVOICE</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>{invoiceNo}</p>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: '1px 0 0' }}>{today}</p>
          </div>
        </div>

        {/* Customer */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>CUSTOMER</p>
            <p style={{ fontSize: '14px', fontWeight: 700 }}>{customerName}</p>
            <p style={{ fontSize: '11px', color: '#6b7280' }}>{paxStr}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>LICENSE</p>
            <p style={{ fontSize: '11px', fontWeight: 600 }}>{company.license}</p>
          </div>
        </div>

        {/* Package summary */}
        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '8px', letterSpacing: '0.05em' }}>PACKAGE DETAILS</p>
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '3px 0', color: '#6b7280' }}>Airline</td>
                <td style={{ padding: '3px 0', fontWeight: 600, textAlign: 'right' }}>{airline?.name ?? 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ padding: '3px 0', color: '#6b7280' }}>Makkah</td>
                <td style={{ padding: '3px 0', fontWeight: 600, textAlign: 'right' }}>{makkahHotel?.name ?? 'N/A'} • {makkahRoom} • {makkahNights}N</td>
              </tr>
              {makkahHotel && (
                <tr>
                  <td style={{ padding: '3px 0', color: '#6b7280' }}>Location</td>
                  <td style={{ padding: '3px 0', textAlign: 'right', color: '#374151' }}>{makkahHotel.location} • {makkahHotel.distance}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '3px 0', color: '#6b7280' }}>Madinah</td>
                <td style={{ padding: '3px 0', fontWeight: 600, textAlign: 'right' }}>{madinahHotel?.name ?? 'N/A'} • {madinahRoom} • {madinahNights}N</td>
              </tr>
              {madinahHotel && (
                <tr>
                  <td style={{ padding: '3px 0', color: '#6b7280' }}>Location</td>
                  <td style={{ padding: '3px 0', textAlign: 'right', color: '#374151' }}>{madinahHotel.location} • {madinahHotel.distance}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '3px 0', color: '#6b7280' }}>Total Nights</td>
                <td style={{ padding: '3px 0', fontWeight: 600, textAlign: 'right' }}>{totalNights} nights</td>
              </tr>
              <tr>
                <td style={{ padding: '3px 0', color: '#6b7280' }}>Transport</td>
                <td style={{ padding: '3px 0', fontWeight: 600, textAlign: 'right' }}>{transportMode === 'included' ? 'Included in Package' : 'Separate'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ background: '#071426', color: 'white', borderRadius: '8px', padding: '14px 16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Package Amount</span>
            <span style={{ fontWeight: 600 }}>{pkr(calc.selling)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Advance Received</span>
            <span style={{ fontWeight: 600 }}>{pkr(advance)}</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#d4a84f', fontWeight: 700 }}>Total Payable</span>
            <span style={{ color: '#d4a84f', fontWeight: 800, fontSize: '16px' }}>{pkr(calc.remaining)}</span>
          </div>
        </div>

        {/* Terms */}
        <div style={{ fontSize: '9px', color: '#9ca3af', marginBottom: '12px' }}>
          <p style={{ fontWeight: 600, marginBottom: '4px', color: '#6b7280' }}>Terms & Conditions:</p>
          <p>• Package rates are valid at time of booking. Changes in airline fares or visa fees may affect the final price.</p>
          <p>• Advance payment confirms the booking. Remaining balance due before departure.</p>
          <p>• Fast Travels & Tours is not responsible for visa rejection or flight cancellations by the airline.</p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
          <p style={{ fontSize: '10px', color: '#9ca3af' }}>Thank you for choosing {company.name}</p>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#6b7280' }}>
            <p style={{ borderTop: '1px solid #6b7280', paddingTop: '4px', width: '120px', marginLeft: 'auto' }}>Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default InvoicePrint

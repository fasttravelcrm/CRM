import type { CalcInput, CalcResult, TransportRate } from './types'

export function getCalc(
  input: CalcInput,
  transportRates: TransportRate[],
  sarToPkr: number,
  visaAdultSar: number,
  visaInfantSar: number,
  transportMode: 'included' | 'separate'
): CalcResult {
  const { adult, child, infant, airline, transportType,
          makkahHotel, makkahRoom, makkahNights,
          madinahHotel, madinahRoom, madinahNights,
          profitType, profitValue, sellingOverride, advance } = input

  const pax = Math.max(1, adult + child + infant)

  // Tickets (PKR)
  const ticketCost = airline
    ? adult * airline.adult_pkr + child * airline.child_pkr + infant * airline.infant_pkr
    : 0

  // Visa (PKR) — children use adult visa rate, matching original behavior
  const visaCost = ((adult + child) * visaAdultSar + infant * visaInfantSar) * sarToPkr

  // Transport (PKR)
  let transportCost = 0
  if (transportMode === 'separate') {
    const paxKey = Math.min(Math.max(pax, 1), 4)
    const rate = transportRates.find(r => r.type === transportType && r.pax_count === paxKey)
    transportCost = (rate?.rate_sar ?? 0) * sarToPkr
  }

  // Hotels (PKR)
  const makkahRateSar = makkahHotel ? (makkahHotel[`${makkahRoom}_sar`] as number) : 0
  const makkahCost = makkahRateSar * sarToPkr * makkahNights * pax

  const madinahRateSar = madinahHotel ? (madinahHotel[`${madinahRoom}_sar`] as number) : 0
  const madinahCost = madinahRateSar * sarToPkr * madinahNights * pax

  const totalCost = ticketCost + visaCost + transportCost + makkahCost + madinahCost

  // Selling price
  let autoSelling: number
  if (profitType === 'fixed') {
    autoSelling = totalCost + profitValue
  } else {
    autoSelling = Math.round(totalCost + totalCost * (profitValue / 100))
  }

  const selling = sellingOverride && sellingOverride > 0 ? sellingOverride : autoSelling
  const profit = selling - totalCost
  const remaining = Math.max(0, selling - advance)
  const perPax = Math.round(selling / pax)

  return {
    pax,
    ticketCost,
    visaCost,
    transportCost,
    makkahCost,
    madinahCost,
    totalCost,
    selling,
    profit,
    remaining,
    perPax,
  }
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = String(Date.now()).slice(-4)
  return `INV-${y}${m}${d}-${rand}`
}

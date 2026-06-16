import { getAirlines, getHotels, getVisa, getCurrency, getTransportRates, getCompany } from '@/lib/db'
import CalculatorForm from '@/components/calculator/CalculatorForm'

export default async function CalculatorPage() {
  const [airlines, hotels, visa, currency, transportRates, company] = await Promise.all([
    getAirlines(),
    getHotels(),
    getVisa(),
    getCurrency(),
    getTransportRates(),
    getCompany(),
  ])

  const makkahHotels = hotels.filter(h => h.city === 'Makkah')
  const madinahHotels = hotels.filter(h => h.city === 'Madinah')

  return (
    <CalculatorForm
      airlines={airlines}
      makkahHotels={makkahHotels}
      madinahHotels={madinahHotels}
      visa={visa}
      currency={currency}
      transportRates={transportRates}
      company={company}
    />
  )
}

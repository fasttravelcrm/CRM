import { notFound } from 'next/navigation'
import { getVisa, getCurrency, getTransportRates, getAirlines, getHotels, getCompany } from '@/lib/db'
import SettingsNav from '@/components/settings/SettingsNav'
import VisaForm from '@/components/settings/VisaForm'
import AirlinesForm from '@/components/settings/AirlinesForm'
import TransportForm from '@/components/settings/TransportForm'
import HotelsForm from '@/components/settings/HotelsForm'
import CurrencyForm from '@/components/settings/CurrencyForm'
import CompanyForm from '@/components/settings/CompanyForm'

const VALID_TABS = ['visa', 'tickets', 'transport', 'hotels', 'currency', 'company']

export default async function SettingsPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params
  if (!VALID_TABS.includes(tab)) notFound()

  const [visa, currency, transportRates, airlines, hotels, company] = await Promise.all([
    getVisa(),
    getCurrency(),
    getTransportRates(),
    getAirlines(),
    getHotels(),
    getCompany(),
  ])

  return (
    <div>
      <SettingsNav />
      {tab === 'visa' && <VisaForm visa={visa} />}
      {tab === 'tickets' && <AirlinesForm airlines={airlines} />}
      {tab === 'transport' && <TransportForm rates={transportRates} />}
      {tab === 'hotels' && <HotelsForm hotels={hotels} />}
      {tab === 'currency' && <CurrencyForm currency={currency} />}
      {tab === 'company' && <CompanyForm company={company} />}
    </div>
  )
}

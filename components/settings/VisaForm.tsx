'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { updateVisa } from '@/app/actions/settings'
import type { VisaSettings } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save } from 'lucide-react'

export default function VisaForm({ visa }: { visa: VisaSettings }) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateVisa(formData)
      toast.success('Visa settings saved!')
    })
  }

  return (
    <Card className="shadow-sm border-0 max-w-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Visa Rates (SAR)</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'adult_sar', label: 'Adult', default: visa.adult_sar },
              { name: 'child_sar', label: 'Child', default: visa.child_sar },
              { name: 'infant_sar', label: 'Infant', default: visa.infant_sar },
            ].map(f => (
              <div key={f.name} className="space-y-1.5">
                <Label className="text-xs">{f.label} (SAR)</Label>
                <Input type="number" name={f.name} defaultValue={f.default} min={0} required />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Transport Mode</Label>
            <Select name="transport_mode" defaultValue={visa.transport_mode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="included">Included in package (no separate transport cost)</SelectItem>
                <SelectItem value="separate">Separate (added to package cost)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isPending} className="bg-navy hover:bg-navy-2 text-white">
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

import { getStaff } from '@/lib/db'
import StaffForm from '@/components/users/StaffForm'

export default async function UsersPage() {
  const staff = await getStaff()
  return <StaffForm staff={staff} />
}

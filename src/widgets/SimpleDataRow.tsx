import { Text } from 'native-base'
import DataRow from '../components/DataRow'

type Props = { label: string; value: string }

const SimpleDataRow: React.FC<Props> = ({ label, value }) => {
  return (
    <DataRow>
      <Text>{label}: </Text>
      <Text>{value}</Text>
    </DataRow>
  )
}
export default SimpleDataRow

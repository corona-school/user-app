import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const DatePicker: React.FC<Props> = ({ type = 'date', onChange, value }) => {
  return <input type={type} onChange={onChange} value={value} />
}
export default DatePicker

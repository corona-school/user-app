import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const DatePicker: React.FC<Props> = ({ type = 'date', onChange }) => {
  return <input type={type} onChange={onChange} />
}
export default DatePicker

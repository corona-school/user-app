import { InputHTMLAttributes } from 'react'
import '../web/scss/components/DatePicker.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const DatePicker: React.FC<Props> = ({ type = 'date', onChange, value }) => {
  return (
    <>
      <div className="lf__datepicker">
        <input type={type} onChange={onChange} value={value} />
      </div>
    </>
  )
}
export default DatePicker

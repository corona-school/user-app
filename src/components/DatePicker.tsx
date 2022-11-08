import { DateTime } from 'luxon'
import { InputHTMLAttributes, useMemo } from 'react'
import '../web/scss/components/DatePicker.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const DatePicker: React.FC<Props> = ({ type = 'date', onChange, value }) => {
  const min = useMemo(() => {
    let date = DateTime.now()
    date = date.plus({ days: 7 })
    return date.toFormat('yyyy-MM-dd')
  }, [])

  return (
    <>
      <div className="lf__datepicker">
        <input
          type={type}
          onChange={onChange}
          value={value}
          min={(type === 'date' && min) || undefined}
        />
      </div>
    </>
  )
}
export default DatePicker

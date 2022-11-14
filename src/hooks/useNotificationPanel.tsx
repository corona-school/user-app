import { gql, useQuery } from '@apollo/client'
import { DateTime, Interval } from 'luxon'

//NOTIFICATION PANEL
//TO DO: query for all user specific notifications
const queryNotis = gql`
  query {
    notifications {
      id
      description
      category
      mailjetTemplateId
      active
    }
  }
`

const getTimedifference = () => {
  const now = DateTime.now()
  const notiTime = DateTime.local(2022, 11, 14, 11)
  const intervall = Interval.fromDateTimes(notiTime, now)
  const diff = intervall.toDuration('minutes').toObject()
  console.log(diff)
}

const useAllNotifications = () => {
  const { data, loading, error } = useQuery(queryNotis)
  getTimedifference()
  console.log('Daten von hook', data)
  return { data, loading, error }
}

export { useAllNotifications }

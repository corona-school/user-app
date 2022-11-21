import { Box, Center, Toast } from 'native-base'
import { useEffect } from 'react'
import MessageBox from '../components/Notification/MessageBox'

const notification = {
  id: 1,
  headline: 'Du hast ein neues Match',
  body: 'Max freut sich dich kennenzulernen',
  createdAt: '2022-11-21T14:08:35.539Z',
  notification: { messageType: 'match' }
}

const notifications = [
  {
    id: 1,
    headline: 'Du hast ein neues Match',
    body: 'Max freut sich dich kennenzulernen',
    createdAt: '2022-11-21T14:08:35.539Z',
    notification: { messageType: 'match' }
  },
  {
    id: 2,
    headline: 'Physik Grundlagen Klasse 5',
    body: 'Zertifikat bereit zum Download',
    createdAt: '2022-11-21T14:03:35.539Z',
    notification: { messageType: 'course' }
  }
]

export const showInAppMessage = () => {
  return Toast.show({
    placement: 'top-right',
    render: () => {
      return (
        <Box mr={5}>
          <MessageBox
            key={notification.id}
            displayTime={false}
            userNotification={notification}
          />
        </Box>
      )
    }
  })
}

export const InAppMessage: React.FC = () => {
  // TODO if new message -> trigger Toast

  useEffect(() => {
    showInAppMessage()
  }, [])

  return <Center></Center>
}

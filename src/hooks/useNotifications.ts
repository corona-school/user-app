import { gql, useQuery } from '@apollo/client'

const userNotificationQuery = gql`
  query {
    me {
      userID
      concreteNotifications {
        id
        headline
        body
        notification {
          messageType
        }
        createdAt
      }
    }
  }
`

const useNotifications = () => {
  const { data, loading, error, refetch } = useQuery(userNotificationQuery)
  
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    if(!loading && !error) {
      setNotifications(data?.me?.concreteNotifications);
    }
  }, [loading]);
  
  return { notifications, loading, error, refetch }
}

export { useNotifications }

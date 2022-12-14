import { Box, Text, useBreakpointValue } from 'native-base'
import PreferenceItem from './PreferenceItem'
import { FC } from "react"
import { useUserPreferences } from "../../../hooks/useNotificationPreferences"
import { NotificationCategories } from "../../../helper/notification-preferences"

const channels = ['email']
type Props = {
  title: string
  notificationCategories: NotificationCategories
}

export const Preferences: FC<Props> = ({title, notificationCategories}) => {
  const { userPreferences, updateUserPreferences } = useUserPreferences()
  const handleSwitchUpdate = (
    category: string,
    channel: string,
    value: boolean
  ) => {
    updateUserPreferences({
      variables: {
        preferences: { ...userPreferences, [category]: {[channel]: value}}
      },
      optimisticResponse: { meUpdate: true }
    })
  }

  const marginLeft = useBreakpointValue({
    base: 0,
    lg: 5
  })

  const marginBottom = useBreakpointValue({
    base: 5,
    lg: 3
  })

  return (
    <>
      <Box ml={marginLeft}>
        <Text mb={marginBottom}>
          {title}
        </Text>
        <Box>
          { Object.keys(notificationCategories).map((category: string) =>
            channels.map((channel: string) => (
              <PreferenceItem
                category={category}
                notificationTypeDetails={notificationCategories[category]}
                value={userPreferences[category][channel]}
                onUpdate={(value: boolean) =>
                  handleSwitchUpdate(category, channel, value)
                }
              />
            ))
          )}
        </Box>
      </Box>
    </>
  )
}
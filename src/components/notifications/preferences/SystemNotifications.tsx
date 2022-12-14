import { Preferences } from "./Preferences"
import { useTranslation } from "react-i18next"
import {
  systemNotificationCategories,
} from "../../../helper/notification-preferences"

export const SystemNotifications = () => {
  const { t } = useTranslation()
  return (
    <Preferences
      title={t('notification.controlPanel.tabs.tab1.description')}
      notificationCategories={systemNotificationCategories}
    />)
}


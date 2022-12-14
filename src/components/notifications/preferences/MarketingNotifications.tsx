import { Preferences } from "./Preferences"
import { useTranslation } from "react-i18next"
import {
  marketingNotificationCategories,
} from "../../../helper/notification-preferences"

export const MarketingNotifications = () => {
  const { t } = useTranslation()
  return (
    <Preferences
      title={t('notification.controlPanel.tabs.tab2.description')}
      notificationCategories={marketingNotificationCategories}
    />)
}

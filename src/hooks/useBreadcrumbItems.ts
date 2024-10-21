import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useBreadcrumbItems = () => {
    const localStorageLanguage = localStorage.getItem('lernfair-language');
    const { t } = useTranslation();
    const items = useMemo(() => {
        return {
            APPOINTMENTS: { label: t('navigation.label.appointments'), route: '/appointments' },
            APPOINTMENT: { label: '', route: '/appointment' },
            CREATE_APPOINTMENT: { label: t('navigation.label.createAppointment'), route: '/create-appointment' },
            EDIT_APPOINTMENT: { label: t('navigation.label.editAppointment'), route: '/edit-appointment' },
            COURSES: { label: t('navigation.label.group'), route: '/group' },
            CREATE_COURSE: { label: t('navigation.label.createCourse'), route: '/create-course' },
            MATCHING: { label: t('navigation.label.matching'), route: '/matching' },
            REQUEST_MATCH: { label: t('navigation.label.requestMatch'), route: '/request-match' },
            SETTINGS: { label: t('navigation.label.settings'), route: '/settings' },
            SYSTEM_NOTIFICATIONS: { label: t('navigation.label.systemNotifications'), route: '/notifications/system' },
            NEWSLETTER_NOTIFICATIONS: { label: t('navigation.label.newsletterNotifications'), route: '/notifications/newsletter' },
        } as const;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localStorageLanguage, t]);
    return items;
};

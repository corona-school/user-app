import { BreadcrumbItem } from '@/components/Breadcrumb';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export const useBreadcrumbRoutes = () => {
    const localStorageLanguage = localStorage.getItem('lernfair-language');
    const { t } = useTranslation();
    return useMemo(() => {
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
            NOTIFICATIONS: { label: t('navigation.label.notifications'), route: '/notifications' },
            CHAT: { label: t('navigation.label.chat'), route: '/chat' },
            KNOWLEDGE_CENTER_STUDENTS: { label: t('navigation.label.forStudents'), route: '/knowledge-helper' },
            KNOWLEDGE_CENTER_PUPILS: { label: t('navigation.label.forPupils'), route: '/knowledge-pupil' },
            PROFILE: { label: t('navigation.label.profile'), route: '/profile' },
            MANAGE_SESSIONS: { label: t('navigation.label.manageSessions'), route: '/manage-sessions' },
            HELP_CENTER: { label: t('navigation.label.helpCenter'), route: '/hilfebereich' },
            NEW_EMAIL: { label: t('navigation.label.newEmail'), route: '/new-email' },
            NEW_PASSWORD: { label: t('navigation.label.newPassword'), route: '/new-password' },
            INSTALL: { label: t('navigation.label.install'), route: '/install' },
            PROGRESS: { label: t('navigation.label.progress'), route: '/progress' },
        } as const;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localStorageLanguage, t]);
};

export const useBreadcrumb = () => {
    const routes = useBreadcrumbRoutes();
    const location = useLocation();
    const localStorageLanguage = localStorage.getItem('lernfair-language');

    const items = useMemo(() => {
        const map = new Map<RegExp, BreadcrumbItem[]>();
        map.set(/appointments/, [routes.APPOINTMENTS]);
        map.set(/create-appointment/, [routes.CREATE_APPOINTMENT]);
        map.set(/settings/, [routes.SETTINGS]);
        map.set(/profile/, [routes.SETTINGS, routes.PROFILE]);
        map.set(/group/, [routes.COURSES]);
        map.set(/create-course/, [routes.COURSES, routes.CREATE_COURSE]);
        map.set(/matching/, [routes.MATCHING]);
        map.set(/request-match/, [routes.MATCHING, routes.REQUEST_MATCH]);
        map.set(/knowledge-helper*/, [routes.KNOWLEDGE_CENTER_STUDENTS]);
        map.set(/knowledge-pupil*/, [routes.KNOWLEDGE_CENTER_PUPILS]);
        map.set(/notifications*/, [routes.SETTINGS, routes.NOTIFICATIONS]);
        map.set(/hilfebereich/, [routes.SETTINGS, routes.HELP_CENTER]);
        map.set(/manage-sessions/, [routes.SETTINGS, routes.MANAGE_SESSIONS]);
        map.set(/new-email/, [routes.SETTINGS, routes.NEW_EMAIL]);
        map.set(/new-password/, [routes.SETTINGS, routes.NEW_PASSWORD]);
        map.set(/install/, [routes.SETTINGS, routes.INSTALL]);
        map.set(/progress/, [routes.SETTINGS, routes.PROGRESS]);
        return Array.from(map.entries());
    }, [localStorageLanguage]);

    return useMemo(() => {
        const result = items.find(([route]) => route.test(location.pathname));
        if (!result) return;
        return result[1];
    }, [location.pathname, localStorageLanguage]);
};

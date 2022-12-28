import IconChat from '../assets/icons/lernfair/notifications/Icon_Chat.svg';
import IconAppointment from '../assets/icons/lernfair/notifications/Icon_Appointment.svg';
import IconSuggestion from '../assets/icons/lernfair/notifications/Icon_Suggestion.svg';
import IconAnnouncement from '../assets/icons/lernfair/notifications/Icon_Announcement.svg';
import IconSurvey from '../assets/icons/lernfair/notifications/Icon_Survey.svg';
import IconCall from '../assets/icons/lernfair/notifications/Icon_Call.svg';
import IconAdvice from '../assets/icons/lernfair/notifications/Icon_Advice.svg';

import ChatIcon from '../assets/icons/lernfair/notifications/lf_chat.svg';
import SuggestionIcon from '../assets/icons/lernfair/notifications/lf_suggestion.svg';
import AppointmentIcon from '../assets/icons/lernfair/notifications/lf_appointment.svg';
import SurveyIcon from '../assets/icons/lernfair/notifications/lf_survey.svg';
import AnnouncementIcon from '../assets/icons/lernfair/notifications/lf_announcement.svg';
import CallIcon from '../assets/icons/lernfair/notifications/lf_call.svg';
import AdviceIcon from '../assets/icons/lernfair/notifications/lf_advice.svg';

import IconChatModal from '../assets/icons/lernfair/notifications/Ic_Chat.svg';
import IconSuggestioneModal from '../assets/icons/lernfair/notifications/Ic_Suggestion.svg';
import IconAppointmentModal from '../assets/icons/lernfair/notifications/Ic_Appointment.svg';
import IconSurveyModal from '../assets/icons/lernfair/notifications/Ic_Survey.svg';
import IconAnnouncementModal from '../assets/icons/lernfair/notifications/Ic_Announcement.svg';
import IconCallModal from '../assets/icons/lernfair/notifications/Ic_Call.svg';
import IconAdviceModal from '../assets/icons/lernfair/notifications/Ic_Advice.svg';

import { FC } from 'react';

export interface NotificationCategoryDetails {
    title: string;
    icon?: FC;
    modal: Modal;
}

export type Modal = { body: string; icon?: FC };

export type NotificationCategories = {
    [category: string]: NotificationCategoryDetails;
};

export const systemNotificationCategories: NotificationCategories = {
    chat: {
        title: 'notification.controlPanel.preference.chat.title',
        icon: IconChat,
        modal: {
            body: 'notification.controlPanel.preference.chat.modalBody',
            icon: IconChatModal,
        },
    },
    survey: {
        title: 'notification.controlPanel.preference.survey.title',
        icon: IconSurvey,
        modal: {
            body: 'notification.controlPanel.preference.survey.modalBody',
            icon: IconSurveyModal,
        },
    },
    appointment: {
        title: 'notification.controlPanel.preference.appointment.title',
        icon: IconAppointment,
        modal: {
            body: 'notification.controlPanel.preference.appointment.modalBody',
            icon: IconAppointmentModal,
        },
    },
    advice: {
        title: 'notification.controlPanel.preference.advice.title',
        icon: IconAdvice,
        modal: {
            body: 'notification.controlPanel.preference.advice.modalBody',
            icon: IconAppointmentModal,
        },
    },
    suggestion: {
        title: 'notification.controlPanel.preference.suggestion.title',
        icon: IconSuggestion,
        modal: {
            body: 'notification.controlPanel.preference.suggestion.modalBody',
            icon: IconSuggestioneModal,
        },
    },
    announcement: {
        title: 'notification.controlPanel.preference.announcement.title',
        icon: IconAnnouncement,
        modal: {
            body: 'notification.controlPanel.preference.announcement.modalBody',
            icon: IconAnnouncementModal,
        },
    },
    call: {
        title: 'notification.controlPanel.preference.call.title',
        icon: IconCall,
        modal: {
            body: 'notification.controlPanel.preference.call.modalBody',
            icon: IconCallModal,
        },
    },
};

export const getSystemNotificationPreferenceCategories = () => Object.keys(systemNotificationCategories);

export const marketingNotificationCategories: NotificationCategories = {
    news: {
        title: 'notification.controlPanel.preference.news.title',
        modal: {
            body: 'notification.controlPanel.preference.news.modalBody',
        },
    },
    event: {
        title: 'notification.controlPanel.preference.event.title',
        modal: {
            body: 'notification.controlPanel.preference.event.modalBody',
        },
    },
    request: {
        title: 'notification.controlPanel.preference.request.title',
        modal: {
            body: 'notification.controlPanel.preference.request.modalBody',
        },
    },
    alternative: {
        title: 'notification.controlPanel.preference.alternative.title',
        modal: {
            body: 'notification.controlPanel.preference.alternative.modalBody',
        },
    },
};

export const getMarketingNotificationPreferenceCategories = () => Object.keys(marketingNotificationCategories);
export const getAllNotificationPreferenceCategories = () => [...getSystemNotificationPreferenceCategories(), ...getMarketingNotificationPreferenceCategories()];

export const messageIcons: { [category: string]: FC } = {
    chat: ChatIcon,
    survey: SurveyIcon,
    appointment: AppointmentIcon,
    advice: AdviceIcon,
    suggestion: SuggestionIcon,
    announcement: AnnouncementIcon,
    call: CallIcon,
};

export const modalIcons: { [category: string]: FC } = {
    chat: IconChatModal,
    survey: IconSurveyModal,
    appointment: IconAppointmentModal,
    advice: IconAdviceModal,
    suggestion: IconSuggestioneModal,
    announcement: IconAnnouncementModal,
    call: IconCallModal,
};

import IconMessage from '../assets/icons/lernfair/notifications/Icon_Message.svg';
import IconMatch from '../assets/icons/lernfair/notifications/Icon_Match.svg';
import IconAppointment from '../assets/icons/lernfair/notifications/Icon_Appointment.svg';
import IconCourse from '../assets/icons/lernfair/notifications/Icon_Course.svg';
import IconNews from '../assets/icons/lernfair/notifications/Icon_News.svg';
import IconSurvey from '../assets/icons/lernfair/notifications/Icon_Survey.svg';

import MessageIcon from '../assets/icons/lernfair/notifications/lf_message.svg';
import MatchIcon from '../assets/icons/lernfair/notifications/lf_match.svg';
import CourseIcon from '../assets/icons/lernfair/notifications/lf_course.svg';
import AppointmentIcon from '../assets/icons/lernfair/notifications/lf_appointment.svg';
import SurveyIcon from '../assets/icons/lernfair/notifications/lf_survey.svg';
import NewsIcon from '../assets/icons/lernfair/notifications/lf_news.svg';

import IconMessageModal from '../assets/icons/lernfair/notifications/Ic_Message.svg';
import IconMatchModal from '../assets/icons/lernfair/notifications/Ic_Match.svg';
import IconCourseModal from '../assets/icons/lernfair/notifications/Ic_Course.svg';
import IconAppointmentModal from '../assets/icons/lernfair/notifications/Ic_Appointment.svg';
import IconSurveyModal from '../assets/icons/lernfair/notifications/Ic_Survey.svg';
import IconNewsModal from '../assets/icons/lernfair/notifications/Ic_News.svg';

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
        icon: IconMessage,
        modal: {
            body: 'notification.controlPanel.preference.chat.modalBody',
            icon: IconMessageModal,
        },
    },
    match: {
        title: 'notification.controlPanel.preference.match.title',
        icon: IconMatch,
        modal: {
            body: 'notification.controlPanel.preference.match.modalBody',
            icon: IconMatchModal,
        },
    },
    course: {
        title: 'notification.controlPanel.preference.course.title',
        icon: IconCourse,
        modal: {
            body: 'notification.controlPanel.preference.course.modalBody',
            icon: IconCourseModal,
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
    survey: {
        title: 'notification.controlPanel.preference.survey.title',
        icon: IconSurvey,
        modal: {
            body: 'notification.controlPanel.preference.survey.modalBody',
            icon: IconSurveyModal,
        },
    },
    news: {
        title: 'notification.controlPanel.preference.news.title',
        icon: IconNews,
        modal: {
            body: 'notification.controlPanel.preference.news.modalBody',
            icon: IconNewsModal,
        },
    },
};

export const getSystemNotificationPreferenceCategories = () => Object.keys(systemNotificationCategories);

export const marketingNotificationCategories: NotificationCategories = {
    newsletter: {
        title: 'notification.controlPanel.preference.newsletter.title',
        modal: {
            body: 'notification.controlPanel.preference.newsletter.modalBody',
        },
    },
    training: {
        title: 'notification.controlPanel.preference.training.title',
        modal: {
            body: 'notification.controlPanel.preference.training.modalBody',
        },
    },
    events: {
        title: 'notification.controlPanel.preference.events.title',
        modal: {
            body: 'notification.controlPanel.preference.events.modalBody',
        },
    },
    newsoffer: {
        title: 'notification.controlPanel.preference.newsoffer.title',
        modal: {
            body: 'notification.controlPanel.preference.newsoffer.modalBody',
        },
    },
    request: {
        title: 'notification.controlPanel.preference.request.title',
        modal: {
            body: 'notification.controlPanel.preference.request.modalBody',
        },
    },
    learnoffer: {
        title: 'notification.controlPanel.preference.learnoffer.title',
        modal: {
            body: 'notification.controlPanel.preference.learnoffer.modalBody',
        },
    },
    alternativeoffer: {
        title: 'notification.controlPanel.preference.alternativeoffer.title',
        modal: {
            body: 'notification.controlPanel.preference.alternativeoffer.modalBody',
        },
    },
    feedback: {
        title: 'notification.controlPanel.preference.feedback.title',
        modal: {
            body: 'notification.controlPanel.preference.feedback.modalBody',
        },
    },
};

export const getMarketingNotificationPreferenceCategories = () => Object.keys(marketingNotificationCategories);
export const getAllNotificationPreferenceCategories = () => [...getSystemNotificationPreferenceCategories(), ...getMarketingNotificationPreferenceCategories()];

export const messageIcons: { [category: string]: FC } = {
    message: MessageIcon,
    match: MatchIcon,
    course: CourseIcon,
    appointment: AppointmentIcon,
    survey: SurveyIcon,
    news: NewsIcon,
};

export const modalIcons: { [category: string]: FC } = {
    chat: IconMessageModal,
    match: IconMatchModal,
    course: IconCourseModal,
    appointment: IconAppointmentModal,
    survey: IconSurveyModal,
    news: IconNewsModal,
};

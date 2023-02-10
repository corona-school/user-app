import { Dispatch } from 'react';

export enum AppointmentType {
    GROUP = 'group',
    ONE_ON_ONE = '1on1',
    OTHER_INTERNAL = 'other-internal',
    LEGACY_LECTURE = 'legacy-lecture',
}

export enum FormReducerActionType {
    TEXT_CHANGE = 'text_change',
    DATE_CHANGE = 'date_change',
    SELECT_CHANGE = 'select_change',
    TOGGLE_CHANGE = 'toggle_change',
}

export type CreateAppointmentAction = {
    type: FormReducerActionType;
    value?: any;
    field: keyof State;
};

export enum WeeklyReducerActionType {
    ADD_WEEKLY_APPOINTMENT = 'add_weekly_appointment',
    CHANGE_WEEKLY_APPOINTMENT_TITLE = 'change_weekly_appointment_title',
    CHANGE_WEEKLY_APPOINTMENT_DESCRIPTION = 'change_weekly_appointment_description',
    REMOVE_WEEKLY_APPOINTMENT = 'remove_weekly_appointment',
}

type AddWeeklyAppointmentAction = {
    type: WeeklyReducerActionType.ADD_WEEKLY_APPOINTMENT;
};

type RemoveWeeklyAppointmentAction = {
    type: WeeklyReducerActionType.REMOVE_WEEKLY_APPOINTMENT;
};

type ChangeWeeklyAppointmentTitle = {
    type: WeeklyReducerActionType.CHANGE_WEEKLY_APPOINTMENT_TITLE;
    value: string;
    index: number;
    field: 'title';
};

type ChangeWeeklyAppointmentDescription = {
    type: WeeklyReducerActionType.CHANGE_WEEKLY_APPOINTMENT_DESCRIPTION;
    value: string;
    index: number;
    field: 'description';
};

export type WeeklyAppointmentAction =
    | AddWeeklyAppointmentAction
    | RemoveWeeklyAppointmentAction
    | ChangeWeeklyAppointmentDescription
    | ChangeWeeklyAppointmentTitle;

export type WeeklyAppointment = {
    title?: string;
    description?: string;
};

export type Weeklies = WeeklyAppointment[];

export type TAppointmentContext = {
    appointmentToCreate: State;
    dispatchCreateAppointment: Dispatch<CreateAppointmentAction>;
    weeklies: WeeklyAppointment[];
    dispatchWeeklyAppointment: Dispatch<WeeklyAppointmentAction>;
};

export type StateWithoutWeeklies = {
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number;
    isRecurring: false;
};

export type StateWithWeeklies = {
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number;
    isRecurring: true;
};

export type State = StateWithoutWeeklies | StateWithWeeklies;

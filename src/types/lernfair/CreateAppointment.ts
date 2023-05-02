import { Dispatch, SetStateAction } from 'react';
import { AppointmentCreateGroupInput } from '../../gql/graphql';

export enum FormReducerActionType {
    TEXT_CHANGE = 'text_change',
    DATE_CHANGE = 'date_change',
    SELECT_CHANGE = 'select_change',
    TOGGLE_CHANGE = 'toggle_change',
    CLEAR_DATA = 'clear_data',
}

export type CreateAppointmentAction = {
    type: FormReducerActionType;
    value?: any;
    field?: keyof State;
};

export enum WeeklyReducerActionType {
    ADD_WEEKLY_APPOINTMENT = 'add_weekly_appointment',
    CHANGE_WEEKLY_APPOINTMENT_TITLE = 'change_weekly_appointment_title',
    CHANGE_WEEKLY_APPOINTMENT_DESCRIPTION = 'change_weekly_appointment_description',
    REMOVE_WEEKLY_APPOINTMENT = 'remove_weekly_appointment',
    CLEAR_WEEKLIES = 'clear_weeklies',
}

type AddWeeklyAppointmentAction = {
    index: number;
    type: WeeklyReducerActionType.ADD_WEEKLY_APPOINTMENT;
    nextDate: string;
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

type ClearWeeklies = {
    type: WeeklyReducerActionType.CLEAR_WEEKLIES;
};

export type WeeklyAppointmentAction =
    | AddWeeklyAppointmentAction
    | RemoveWeeklyAppointmentAction
    | ChangeWeeklyAppointmentDescription
    | ChangeWeeklyAppointmentTitle
    | ClearWeeklies;

export type WeeklyAppointment = {
    index: number;
    title?: string;
    description?: string;
    nextDate: string;
};

export type Weeklies = WeeklyAppointment[];

export type TAppointmentContext = {
    appointmentToCreate: State;
    dispatchCreateAppointment: Dispatch<CreateAppointmentAction>;
    weeklies: WeeklyAppointment[];
    dispatchWeeklyAppointment: Dispatch<WeeklyAppointmentAction>;
    appointmentsToBeCreated: AppointmentCreateGroupInput[];
    setAppointmentsToBeCreated: Dispatch<SetStateAction<AppointmentCreateGroupInput[]>>;
    appointmentsToBeCanceled: number[];
    setAppointmentsToBeCanceled: Dispatch<SetStateAction<number[]>>;
    appointmentsToBeUpdated: AppointmentCreateGroupInput[];
    setAppointmentsToBeUpdated: Dispatch<SetStateAction<AppointmentCreateGroupInput[]>>;
};

export type StateWithoutWeeklies = {
    title?: string;
    description?: string;
    date: string;
    time: string;
    duration: number;
    isRecurring: false;
};

export type StateWithWeeklies = {
    title?: string;
    description?: string;
    date: string;
    time: string;
    duration: number;
    isRecurring: true;
};

export type State = StateWithoutWeeklies | StateWithWeeklies;

import { DateTime } from 'luxon';
import { createContext, Dispatch, ReactNode, Reducer, useContext, useReducer, useState } from 'react';

export enum AppointmentType {
    GROUP = 'group',
    ONE_ON_ONE = '1on1',
    OTHER_INTERNAL = 'other-internal',
    LEGACY_LECTURE = 'legacy-lecture',
}

export enum ReducerActionType {
    ADD_TITLE = 'add_title',
    ADD_DATE = 'add_date',
    ADD_TIME = 'add_time',
    ADD_DURATION = 'add_duration',
    ADD_DESCRIPTION = 'add_description',
    ADD_ORGANIZERS = 'add_organizers',
    ADD_SUBCOURSE = 'add_subcourse',
    ADD_MATCH = 'add_match',
}

type CreateAppointmentAction = {
    type: ReducerActionType;
    value: any;
};

type CreateAppointment = {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    duration?: number;
    subcourseId?: number;
    matchId?: number;
    organizers?: number[];
    participants_pupil?: number[];
    participants_student?: number[];
    participants_screener?: number[];
    weekly?: WeeklyAppointment[];
};

type WeeklyAppointment = {
    title: string;
    description: string;
};

type CreateAppointmentContext = {
    newAppointment: CreateAppointment;
    weeklyAppointment?: WeeklyAppointment[];
    setNewAppoinment: Dispatch<any>;
    setWeeklyAppointment: Dispatch<any>;
};

export const CreateAppointmentContext = createContext<CreateAppointmentContext>({
    newAppointment: {},
    weeklyAppointment: [],
    setNewAppoinment: () => undefined,
    setWeeklyAppointment: () => undefined,
});

const convert = () => {
    const date = '';
    const time = '';
    let start: string;

    const convertStartDate = (date: string, time: string) => {
        const dt = DateTime.fromISO(date);
        const t = DateTime.fromISO(time);

        const newDate = dt.set({
            hour: t.hour,
            minute: t.minute,
            second: t.second,
        });
        return newDate.toISO();
    };

    start = convertStartDate(date, time);
};

const appointmentReducer: Reducer<any, CreateAppointmentAction> = (appointment: {}, action: CreateAppointmentAction) => {
    switch (action.type) {
        case ReducerActionType.ADD_TITLE: {
            return { ...appointment, title: action.value };
        }
        case ReducerActionType.ADD_DATE: {
            return { ...appointment, start: action.value };
        }
        case ReducerActionType.ADD_DESCRIPTION: {
            return { ...appointment, description: action.value };
        }
        case ReducerActionType.ADD_DURATION: {
            return { ...appointment, duration: action.value };
        }
    }
};

export const CreateAppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [newAppointment, setNewAppoinment] = useReducer(appointmentReducer, {});
    const [weeklyAppointment, setWeeklyAppointment] = useState<WeeklyAppointment[]>([]);

    return (
        <CreateAppointmentContext.Provider value={{ newAppointment, weeklyAppointment, setNewAppoinment, setWeeklyAppointment }}>
            {children}
        </CreateAppointmentContext.Provider>
    );
};

export const useCreateAppointments = () => {
    return useContext(CreateAppointmentContext);
};

import { createContext, Dispatch, ReactNode, useContext, useReducer, useState } from 'react';

export enum AppointmentType {
    GROUP = 'group',
    ONE_ON_ONE = '1on1',
    OTHER_INTERNAL = 'other-internal',
    LEGACY_LECTURE = 'legacy-lecture',
}

type CreateAppointment = {
    title?: string;
    description?: string;
    start?: Date;
    duration?: number;
    subcourseId?: number;
    matchId?: number;
    organizers?: number[];
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

const appointmentReducer = (appointment: any, newAppointment: CreateAppointment) => {
    return {
        ...appointment,
        title: newAppointment.title,
        description: newAppointment.description,
        start: newAppointment.start,
        duration: newAppointment.duration,
        subcourseId: newAppointment.subcourseId,
        matchId: newAppointment.matchId,
        weekly: newAppointment.weekly,
    };
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

import { createContext, ReactNode, Reducer, useContext, useReducer, useState } from 'react';
import { AppointmentCreateGroupInput } from '../gql/graphql';
import {
    CreateAppointmentAction,
    FormReducerActionType,
    State,
    Weeklies,
    WeeklyAppointmentAction,
    WeeklyReducerActionType,
    TAppointmentContext,
} from '../types/lernfair/CreateAppointment';

const createAppointmentFormReducer: Reducer<State, CreateAppointmentAction> = (state: State, action: CreateAppointmentAction) => {
    switch (action.type) {
        case FormReducerActionType.TEXT_CHANGE: {
            return { ...state, [action.field || 'title']: action.value };
        }
        case FormReducerActionType.SELECT_CHANGE: {
            return { ...state, [action.field || 'duration']: action.value };
        }
        case FormReducerActionType.DATE_CHANGE: {
            return { ...state, [action.field || 'date']: action.value };
        }
        case FormReducerActionType.TOGGLE_CHANGE: {
            return { ...state, [action.field || 'isRecurring']: !state[action.field || 'isRecurring'] };
        }
        case FormReducerActionType.CLEAR_DATA: {
            return {
                title: '',
                description: '',
                date: '',
                time: '',
                duration: 0,
                meetingLink: undefined,
                isRecurring: false,
            };
        }
    }
};

const weeklyReducer: Reducer<Weeklies, WeeklyAppointmentAction> = (state: Weeklies, action: WeeklyAppointmentAction) => {
    switch (action.type) {
        case WeeklyReducerActionType.ADD_WEEKLY_APPOINTMENT: {
            return [...state, { index: action.index, title: '', description: '', nextDate: action.nextDate }];
        }
        case WeeklyReducerActionType.REMOVE_WEEKLY_APPOINTMENT: {
            state.pop();
            return [...state];
        }
        case WeeklyReducerActionType.CHANGE_WEEKLY_APPOINTMENT_TITLE: {
            const mutatedWeekly = { ...state[action.index], [action.field]: action.value };
            const nextState = [...state];
            nextState.splice(action.index, 1, mutatedWeekly);
            return [...nextState];
        }
        case WeeklyReducerActionType.CHANGE_WEEKLY_APPOINTMENT_DESCRIPTION: {
            const mutatedWeekly = { ...state[action.index], [action.field]: action.value };
            const nextState = [...state];
            nextState.splice(action.index, 1, mutatedWeekly);
            return [...nextState];
        }
        case WeeklyReducerActionType.CLEAR_WEEKLIES: {
            return [];
        }
    }
};
export const AppointmentContext = createContext<TAppointmentContext>({
    appointmentToCreate: {
        title: '',
        description: '',
        date: '',
        time: '',
        meetingLink: undefined,
        duration: 60,
        isRecurring: false,
    },
    dispatchCreateAppointment: () => undefined,
    weeklies: [],
    dispatchWeeklyAppointment: () => undefined,
    appointmentsToBeCreated: [],
    setAppointmentsToBeCreated: () => undefined,
    appointmentsToBeCanceled: [],
    setAppointmentsToBeCanceled: () => undefined,
    appointmentsToBeUpdated: [],
    setAppointmentsToBeUpdated: () => undefined,
});

export const CreateAppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appointmentToCreate, dispatchCreateAppointment] = useReducer(createAppointmentFormReducer, {
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        meetingLink: undefined,
        isRecurring: false,
    });
    const [weeklies, dispatchWeeklyAppointment] = useReducer(weeklyReducer, []);

    const [appointmentsToBeCreated, setAppointmentsToBeCreated] = useState<AppointmentCreateGroupInput[]>([]);
    const [appointmentsToBeCanceled, setAppointmentsToBeCanceled] = useState<number[]>([]);
    const [appointmentsToBeUpdated, setAppointmentsToBeUpdated] = useState<AppointmentCreateGroupInput[]>([]);

    return (
        <AppointmentContext.Provider
            value={{
                appointmentToCreate,
                weeklies,
                appointmentsToBeCreated,
                appointmentsToBeCanceled,
                appointmentsToBeUpdated,
                dispatchCreateAppointment,
                dispatchWeeklyAppointment,
                setAppointmentsToBeCreated,
                setAppointmentsToBeCanceled,
                setAppointmentsToBeUpdated,
            }}
        >
            {children}
        </AppointmentContext.Provider>
    );
};

export const useCreateAppointment = () => {
    const { appointmentToCreate, dispatchCreateAppointment } = useContext(AppointmentContext);
    return { appointmentToCreate, dispatchCreateAppointment };
};

export function useWeeklyAppointments() {
    const { weeklies, dispatchWeeklyAppointment } = useContext(AppointmentContext);
    return { weeklies, dispatchWeeklyAppointment };
}

export const useCreateCourseAppointments = () => {
    const {
        appointmentsToBeCreated,
        appointmentsToBeCanceled,
        appointmentsToBeUpdated,
        setAppointmentsToBeCanceled,
        setAppointmentsToBeCreated,
        setAppointmentsToBeUpdated,
    } = useContext(AppointmentContext);
    return {
        appointmentsToBeCreated,
        appointmentsToBeCanceled,
        appointmentsToBeUpdated,
        setAppointmentsToBeCanceled,
        setAppointmentsToBeCreated,
        setAppointmentsToBeUpdated,
    };
};

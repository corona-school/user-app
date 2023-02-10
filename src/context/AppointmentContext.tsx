import { createContext, ReactNode, Reducer, useContext, useReducer } from 'react';
import {
    CreateAppointmentAction,
    FormReducerActionType,
    State,
    Weeklies,
    WeeklyAppointmentAction,
    WeeklyReducerActionType,
    TAppointmentContext,
} from './CreateAppointment';

const formReducer: Reducer<State, CreateAppointmentAction> = (state: State, action: CreateAppointmentAction) => {
    switch (action.type) {
        case FormReducerActionType.TEXT_CHANGE: {
            return { ...state, [action.field]: action.value };
        }
        case FormReducerActionType.SELECT_CHANGE: {
            return { ...state, [action.field]: action.value };
        }
        case FormReducerActionType.DATE_CHANGE: {
            return { ...state, [action.field]: action.value };
        }
        case FormReducerActionType.TOGGLE_CHANGE: {
            return { ...state, [action.field]: !state[action.field] };
        }
    }
};

const weeklyReducer: Reducer<Weeklies, WeeklyAppointmentAction> = (state: Weeklies, action: WeeklyAppointmentAction) => {
    switch (action.type) {
        case WeeklyReducerActionType.ADD_WEEKLY_APPOINTMENT: {
            return [...state, { title: '', description: '' }];
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
    }
};
export const AppointmentContext = createContext<TAppointmentContext>({
    appointmentToCreate: {
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 0,
        isRecurring: false,
    },
    dispatchCreateAppointment: () => undefined,
    weeklies: [],
    dispatchWeeklyAppointment: () => undefined,
});

export const CreateAppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [weeklies, dispatchWeeklyAppointment] = useReducer(weeklyReducer, []);
    const [appointmentToCreate, dispatchCreateAppointment] = useReducer(formReducer, {
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 0,
        isRecurring: false,
    });

    return (
        <AppointmentContext.Provider value={{ appointmentToCreate, weeklies, dispatchCreateAppointment, dispatchWeeklyAppointment }}>
            {children}
        </AppointmentContext.Provider>
    );
};

export const useCreateAppointments = () => {
    const { appointmentToCreate, dispatchCreateAppointment } = useContext(AppointmentContext);
    return { appointmentToCreate, dispatchCreateAppointment };
};

export function useWeeklyAppointments() {
    const { weeklies, dispatchWeeklyAppointment } = useContext(AppointmentContext);
    return { weeklies, dispatchWeeklyAppointment };
}

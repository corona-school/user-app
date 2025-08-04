import { Language, PupilEmailOwner } from '@/gql/graphql';
import useApollo from '@/hooks/useApollo';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RegistrationStep } from './util';

export interface RegistrationForm {
    userType?: 'pupil' | 'student';
    acceptanceCheck: {
        needHelpInSchool?: boolean;
        familyCannotHelp?: boolean;
        familyCannotAffordTutoring?: boolean;
    };
    firstname: string;
    lastname: string;
    age: number;
    languages: Language[];
    emailOwner?: PupilEmailOwner;
    email: string;
    password: string;
    isRegisteringManually: boolean;
    privacyConsent: boolean;
    currentStep?: RegistrationStep;
}

interface RegistrationContextValue {
    form: RegistrationForm;
    onFormChange: (data: Partial<RegistrationForm>) => void;
    reset: () => void;
    isLoading: boolean;
}

const emptyState: RegistrationForm = {
    acceptanceCheck: {},
    languages: [],
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    privacyConsent: false,
    isRegisteringManually: true,
    age: 0,
};

const RegistrationContext = createContext<RegistrationContextValue>({
    form: emptyState,
    isLoading: false,
    onFormChange: () => {},
    reset: () => {},
});

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
    const {} = useApollo();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const [values, setValues, removeValues] = useLocalStorage<RegistrationForm>({
        key: 'registration',
        initialValue: {
            ...emptyState,
        },
    });
    const [password, setPassword] = useState('');

    const handleOnChange = ({ password, ...data }: Partial<RegistrationForm>) => {
        if (password !== undefined) {
            setPassword(password);
        }
        setValues({ ...values, ...data });
    };

    const reset = () => {
        removeValues();
        setValues(emptyState);
        setPassword('');
    };

    const computeCurrentState = () => {
        if (values.currentStep) {
            if (values.currentStep === RegistrationStep.dataPrivacy && !password) {
                handleOnChange({ currentStep: RegistrationStep.authenticationInfo });
                return RegistrationStep.authenticationInfo;
            }
            return values.currentStep;
        }

        if (values.userType === 'pupil') {
            handleOnChange({ currentStep: RegistrationStep.acceptanceCheck });
            return RegistrationStep.acceptanceCheck;
        }
        if (values.userType === 'student') {
            handleOnChange({ currentStep: RegistrationStep.userName });
            return RegistrationStep.userName;
        }

        handleOnChange({ currentStep: RegistrationStep.userType });
        return RegistrationStep.userType;
    };

    useEffect(() => {
        if (location.pathname !== '/registration') {
            reset();
        }

        if (location?.pathname === '/registration/student' || location?.pathname === '/registration/helper') {
            handleOnChange({ userType: 'student' });
        }
        if (location?.pathname === '/registration/pupil') {
            handleOnChange({ userType: 'pupil' });
        }
    }, [location.pathname]);

    return (
        <RegistrationContext.Provider
            value={{ form: { ...values, password, currentStep: computeCurrentState() }, onFormChange: handleOnChange, reset, isLoading }}
        >
            {children}
        </RegistrationContext.Provider>
    );
};

export const useRegistrationForm = () => {
    return useContext(RegistrationContext);
};

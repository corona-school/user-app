import { Language, PupilEmailOwner } from '@/gql/graphql';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useState } from 'react';

export interface RegistrationForm {
    userType?: 'pupil' | 'student';
    acceptanceCheck: {
        needHelpInSchool?: boolean;
        familyCannotHelp?: boolean;
        familyCannotAffordTutoring?: boolean;
    };
    firstname: string;
    lastname: string;
    age?: number;
    languages: Language[];
    emailOwner?: PupilEmailOwner;
    email: string;
    password: string;
    isRegisteringManually?: boolean;
    privacyConsent: boolean;
}

const emptyState: RegistrationForm = {
    acceptanceCheck: {},
    languages: [],
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    privacyConsent: false,
};

export const useRegistrationForm = () => {
    const [values, setValues] = useLocalStorage<RegistrationForm>({
        key: 'registration',
        initialValue: emptyState,
    });
    const [password, setPassword] = useState('');

    const handleOnChange = ({ password, ...data }: Partial<RegistrationForm>) => {
        if (password !== undefined) {
            setPassword(password);
        }
        setValues({ ...values, ...data });
    };

    const reset = () => {
        setValues(emptyState);
        setPassword('');
    };

    return { form: { ...values, password }, onFormChange: handleOnChange, reset };
};

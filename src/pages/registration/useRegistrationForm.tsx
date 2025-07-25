import { Language, PupilEmailOwner } from '@/gql/graphql';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface RegistrationForm {
    userType?: 'pupil' | 'student';
    acceptanceCheck: {
        needHelpInSchool?: boolean;
        familyCannotHelp?: boolean;
        familyCannotAffordTutoring?: boolean;
    };
    firstname?: string;
    lastname?: string;
    age?: number;
    languages: Language[];
    emailOwner?: PupilEmailOwner;
}

export const useRegistrationForm = () => {
    const [values, setValues] = useLocalStorage<RegistrationForm>({
        key: 'registration',
        initialValue: {
            acceptanceCheck: {},
            languages: [],
        },
    });

    const handleOnChange = (data: Partial<RegistrationForm>) => {
        setValues({ ...values, ...data });
    };

    const reset = () => {
        setValues({
            acceptanceCheck: {},
            languages: [],
        });
    };

    return { form: values, onFormChange: handleOnChange, reset };
};

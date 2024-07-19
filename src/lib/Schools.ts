import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { log, logError } from '../log';
import { states } from '../types/lernfair/State';
import { schooltypes } from '../types/lernfair/SchoolType';
import { SchoolType, State } from '../gql/graphql';

const API = 'https://jedeschule.codefor.de';

interface UseSchoolSearchArgs {
    name: string;
}

export interface ExternalSchool {
    id: string;
    name: string;
    city: string;
    school_type: string;
    zip: string;
    email?: string;
}

export const getExternalSchoolState = (school?: ExternalSchool) => {
    const state = school?.id.substring(0, 2).toLowerCase();
    const isValid = states.some((e) => e.key === state);
    if (!isValid) {
        /**
         * The state is always the first part of the school id, if for some reason the state doesn't match
         * we need the heads up about that.
         */
        logError('jedeschule', 'Could not get state from school', school);
        return;
    }
    return state as State;
};

export const getExternalSchoolType = (school?: ExternalSchool) => {
    const schoolType = school?.school_type?.toLowerCase();
    if (!schoolType) return;
    const isValid = schooltypes.some((e) => e.key === schoolType);
    if (!isValid) {
        /**
         * It's more likely that the school types don't match with the ones we are expecting...
         * So it shouldn't be a big deal
         */
        log('jedeschule', 'Could not get school type from school', school);
        return;
    }
    return schoolType as SchoolType;
};

const useSchoolSearch = ({ name }: UseSchoolSearchArgs) => {
    const debouncedName = useDebounce({ delay: 500, value: name });
    const [schools, setSchools] = useState<ExternalSchool[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (name && name.length > 3) {
            setIsLoading(true);
        }
    }, [name]);

    useEffect(() => {
        if (debouncedName.length > 3) {
            setIsLoading(true);
            fetch(`${API}/schools/?limit=20&include_raw=false&name=${debouncedName}`)
                .then(async (response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        const error = await response.json();
                        logError('jedeschule', `Error fetching schools - ${response.status}: ${response.statusText}}`, error);
                    }
                })
                .then((response) => {
                    setSchools(response);
                })
                .catch((error) => {
                    logError('jedeschule', `Error fetching schools`, error);
                })
                .finally(() => setIsLoading(false));
        } else {
            resetResults();
        }
    }, [debouncedName]);

    const resetResults = () => {
        setSchools([]);
    };

    return { schools, resetResults, isLoading };
};

export default useSchoolSearch;

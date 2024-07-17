import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { log, logError } from '../log';
import { states } from '../types/lernfair/State';
import { schooltypes } from '../types/lernfair/SchoolType';

const API = 'https://jedeschule.codefor.de';

interface UseSchoolSearchArgs {
    name: string;
}

export interface ISchool {
    id: string;
    name: string;
    city: string;
    school_type: string;
    zip: string;
    hasValidSchoolType: boolean;
    hasValidSchoolState: boolean;
}

export const getSchoolState = (school?: ISchool) => {
    const state = school?.id.substring(0, 2).toLowerCase();
    const isValid = states.some((e) => e.key === state);
    if (!isValid) {
        /**
         * The state is always the first part of the school id, if for some reason the state doesn't match
         * we need the heads up about that.
         */
        logError('jedeschule', 'Could not get state from school', school);
        return null;
    }
    return state;
};

export const getSchoolType = (school?: ISchool) => {
    const schoolType = school?.school_type?.toLowerCase();
    if (!schoolType) return null;
    const isValid = schooltypes.some((e) => e.key === schoolType);
    if (!isValid) {
        /**
         * It's more likely that the school types don't match with the ones we are expecting...
         * So it shouldn't be a big deal
         */
        log('jedeschule', 'Could not get school type from school', school);
        return null;
    }
    return schoolType;
};

const useSchoolSearch = ({ name }: UseSchoolSearchArgs) => {
    const debouncedName = useDebounce({ delay: 200, value: name });
    const [schools, setSchools] = useState<ISchool[]>([]);

    useEffect(() => {
        if (debouncedName.length > 3) {
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
                });
        } else {
            resetResults();
        }
    }, [debouncedName]);

    const resetResults = () => {
        setSchools([]);
    };

    return { schools, resetResults };
};

export default useSchoolSearch;

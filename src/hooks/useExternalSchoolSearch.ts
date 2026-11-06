import useDebounce from './useDebounce';
import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import { useEffect, useState } from 'react';
interface UseSchoolSearchArgs {
    name: string;
    skip?: boolean;
}

const EXTERNAL_SCHOOL_SEARCH_QUERY = gql(`
    query searchSchools($name: String!) {
        externalSchoolSearch(filters:  { name: $name })
            {
            id
            name
        }
    }    
`);

const EXTERNAL_SCHOOL_DETAIL_QUERY = gql(`
    query schoolDetails($id: String!) {
        schoolDetail(schoolId: $id)
            {
            id
            name
            state
            schooltype
            zip
            city
            email
        }
    }    
`);

const useSchoolSearch = ({ name, skip }: UseSchoolSearchArgs) => {
    const debouncedName = useDebounce({ delay: 800, value: name });
    const [isLoading, setIsLoading] = useState(false);
    const { data, loading: isFetching } = useQuery(EXTERNAL_SCHOOL_SEARCH_QUERY, {
        variables: { name: debouncedName },
        skip: debouncedName.length < 3 || name.length < 3 || skip,
    });
    useEffect(() => {
        setIsLoading(name.length >= 3 && name !== debouncedName && !skip);
    }, [name, debouncedName, skip]);

    return { schools: data?.externalSchoolSearch || [], isLoading: isFetching || isLoading };
};

const useSchoolDetails = (id: string) => {
    const { data, loading } = useQuery(EXTERNAL_SCHOOL_DETAIL_QUERY, {
        variables: { id },
        skip: !id,
    });

    return { school: data?.schoolDetail || null, isLoading: loading };
};

export { useSchoolDetails, useSchoolSearch };

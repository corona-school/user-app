import useDebounce from './useDebounce';
import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import { useEffect, useState } from 'react';
interface UseSchoolSearchArgs {
    name: string;
    skip?: boolean;
}

const ExternalSchoolSearchQuery = gql(`
    query searchSchools($name: String!) {
        externalSchoolSearch(
            filters:  { name: $name },
            options:  { limit: 20 }
        )
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
    const { data, loading: isFetching } = useQuery(ExternalSchoolSearchQuery, {
        variables: { name: debouncedName },
        skip: debouncedName.length < 3 || name.length < 3 || skip,
    });
    useEffect(() => {
        setIsLoading(name.length >= 3 && name !== debouncedName && !skip);
    }, [name, debouncedName, skip]);

    return { schools: data?.externalSchoolSearch || [], isLoading: isFetching || isLoading };
};

export default useSchoolSearch;

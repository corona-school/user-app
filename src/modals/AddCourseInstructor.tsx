import { gql } from './../gql';
import { useLazyQuery } from '@apollo/client';
import { View, Row, Button, ArrowBackIcon, useTheme, VStack, Flex, Text } from 'native-base';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import SearchBar from '../components/SearchBar';
import { LFInstructor } from '../types/lernfair/Course';
import InstructorRow from '../widgets/InstructorRow';

const RESULTS_PER_PAGE = 20;

type Props = {
    onClose: () => void;
    addedInstructors: LFInstructor[];
    onInstructorAdded: (instructor: LFInstructor) => void;
};

const AddCourseInstructor: React.FC<Props> = ({ onClose, addedInstructors, onInstructorAdded }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const [searchString, setSearchString] = useState<string>('');

    const [searchInstructors, { data, loading }] = useLazyQuery(
        gql(`
    query searchInstructors($search: String!, $take: Int!) {
      otherInstructors(take: $take, skip: 0, search: $search) {
        id
        firstname
        lastname
      }
    }
  `)
    );

    const search = useCallback(() => {
        searchInstructors({ variables: { search: searchString, take: RESULTS_PER_PAGE } });
    }, [searchInstructors, searchString]);

    const instructors = useMemo(() => {
        return data?.otherInstructors || [];
    }, [data?.otherInstructors]);

    if (loading) return <CenterLoadingSpinner />;

    return (
        <View flex="1">
            <Row w="100%" paddingX={space['1']} paddingY={space['0.5']}>
                <Button padding={space['1']} onPress={onClose}>
                    <ArrowBackIcon />
                </Button>
                <SearchBar
                    onSearch={(s) => search()}
                    onChangeText={setSearchString}
                    value={searchString}
                    placeholder={t('course.addCourseInstructor.search')}
                />
            </Row>
            <View overflowY={'scroll'} flex="1">
                {(instructors.length > 0 && (
                    <Flex pb={'72px'} flex="1">
                        <VStack flex="1">
                            {instructors?.map((instructor) => (
                                <InstructorRow isAdded={false} instructor={instructor} onPress={() => onInstructorAdded(instructor)} />
                            ))}
                        </VStack>
                    </Flex>
                )) || (
                    <Flex flex="1" justifyContent="center" alignItems="center">
                        <Text>{t('course.addCourseInstructor.notFound')}</Text>
                    </Flex>
                )}
            </View>
        </View>
    );
};
export default AddCourseInstructor;

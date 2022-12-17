import { gql, useLazyQuery } from '@apollo/client';
import { View, Row, Button, ArrowBackIcon, useTheme, VStack, Heading, Flex, Text, Box } from 'native-base';
import { useCallback, useMemo, useState } from 'react';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { LFInstructor } from '../types/lernfair/Course';
import InstructorRow from '../widgets/InstructorRow';

const RESULTS_PER_PAGE = 20;

type Props = {
    onClose: () => any;
    addedInstructors: LFInstructor[];
    onInstructorAdded: (instructor: LFInstructor) => any;
};

const AddCourseInstructor: React.FC<Props> = ({ onClose, addedInstructors, onInstructorAdded }) => {
    const { space } = useTheme();
    const [searchString, setSearchString] = useState<string>('');
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [selectedInstructor, setSelectedInstructor] = useState<LFInstructor>();

    const [searchInstructors, { data, loading }] = useLazyQuery(gql`
    query searchInstructors($search: String!) {
      otherInstructors(take: ${RESULTS_PER_PAGE}, skip: ${(pageIndex - 1) * RESULTS_PER_PAGE}, search: $search) {
        id
        firstname
        lastname
      }
    }
  `);

    const search = useCallback(() => {
        searchInstructors({ variables: { search: searchString } });
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
                <SearchBar onSearch={(s) => search()} onChangeText={setSearchString} value={searchString} />
            </Row>
            <View overflowY={'scroll'} flex="1">
                {(instructors.length > 0 && (
                    <Flex pb={'72px'} flex="1">
                        <Heading marginX={space['1']}>Seite {pageIndex}</Heading>
                        <VStack flex="1">
                            {instructors?.map((instructor: LFInstructor) => {
                                let isAdded = false;
                                if (addedInstructors.find((i) => i.id === instructor.id)) {
                                    isAdded = true;
                                }

                                return <InstructorRow isAdded={isAdded} instructor={instructor} onPress={() => setSelectedInstructor(instructor)} />;
                            })}
                        </VStack>
                        {pageIndex > 1 && instructors.length > RESULTS_PER_PAGE && (
                            <Flex mt={space['1']} justifyContent="flex-end">
                                <Pagination
                                    currentIndex={pageIndex}
                                    onPrev={() => {
                                        setPageIndex((prev) => prev - 1);
                                        search();
                                    }}
                                    onNext={() => {
                                        setPageIndex((prev) => prev + 1);
                                        search();
                                    }}
                                    onSelectIndex={(index) => {
                                        setPageIndex(index);
                                        search();
                                    }}
                                />
                            </Flex>
                        )}
                    </Flex>
                )) || (
                    <Flex flex="1" justifyContent="center" alignItems="center">
                        <Text>Keine Suchergebnisse.</Text>
                    </Flex>
                )}
                {selectedInstructor && (
                    <Row
                        bgColor="primary.900"
                        w="100%"
                        h="64px"
                        position={'fixed'}
                        bottom="0"
                        alignItems={'center'}
                        justifyContent={'center'}
                        paddingX={space['0.5']}
                    >
                        <Heading fontSize="md" color="lightText" flex="1">
                            {selectedInstructor.firstname} hinzufügen
                        </Heading>
                        <Button onPress={() => onInstructorAdded(selectedInstructor)} isDisabled={!selectedInstructor}>
                            hinzufügen
                        </Button>
                    </Row>
                )}
            </View>
        </View>
    );
};
export default AddCourseInstructor;

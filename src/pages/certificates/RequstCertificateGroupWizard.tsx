import { gql, useQuery } from '@apollo/client';
import { Text, useTheme, VStack, Heading, Box, Button } from 'native-base';
import { useContext } from 'react';
import CardOverlay from '../../components/CardOverlay';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import CSSWrapper from '../../components/CSSWrapper';
import { LFSubCourse } from '../../types/lernfair/Course';
import AppointmentCard from '../../widgets/AppointmentCard';
import SelectActionsWidget from '../../widgets/certificates/SelectActionsWidget';
import { RequestCertificateContext } from '../RequestCertificate';

type Props = { onNext: () => any };

const RequestCertificateGroupWizard: React.FC<Props> = ({ onNext }) => {
    const { space } = useTheme();
    const { state, setState, wizardIndex, setWizardIndex } = useContext(RequestCertificateContext);

    const { data, loading } = useQuery(gql`
        query GetSubcoursesForCertificate {
            me {
                student {
                    subcoursesInstructing {
                        id
                        lectures {
                            start
                            duration
                        }
                        firstLecture {
                            start
                        }
                        course {
                            name
                            image
                            tags {
                                name
                            }
                            subject
                        }
                    }
                }
            }
        }
    `);

    return (
        <>
            {wizardIndex === 0 && (
                <VStack space={space['1']} paddingBottom={space['1']}>
                    <Heading>Kurse wählen</Heading>

                    <Text>Welche der folgenden Kurse sollen auf deiner Bescheinigung aufgeführt werden?</Text>

                    <VStack space={space['0.5']}>
                        {loading && <CenterLoadingSpinner />}
                        {!loading && (
                            <>
                                {data.me.student.subcoursesInstructing.map((course: LFSubCourse, index: number) => {
                                    const isSelected = state.courses.includes(course);

                                    return (
                                        <CardOverlay selected={isSelected}>
                                            <CSSWrapper className="course-list__item">
                                                <AppointmentCard
                                                    onPressToCourse={() => {
                                                        if (isSelected) {
                                                            setState({
                                                                ...state,
                                                                courses: state.courses.filter((c) => c !== course),
                                                            });
                                                        } else {
                                                            setState({
                                                                ...state,
                                                                courses: [...state.courses, course],
                                                            });
                                                        }
                                                    }}
                                                    key={index}
                                                    variant="horizontal"
                                                    description={course.course.description}
                                                    tags={course.course.tags}
                                                    date={course.firstLecture?.start || ''}
                                                    countCourse={course.lectures.length}
                                                    image={course.course.image}
                                                    title={course.course.name}
                                                />
                                            </CSSWrapper>
                                        </CardOverlay>
                                    );
                                })}
                            </>
                        )}
                        <Button isDisabled={state.courses.length < 1} onPress={() => setWizardIndex(1)}>
                            Weiter
                        </Button>
                    </VStack>
                </VStack>
            )}
            {wizardIndex === 1 && <SelectActionsWidget onNext={onNext} />}
        </>
    );
};
export default RequestCertificateGroupWizard;

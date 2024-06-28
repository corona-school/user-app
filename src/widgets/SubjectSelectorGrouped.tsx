import { Box, Heading, HStack, Row, Text, useTheme, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Subject } from '../gql/graphql';
import { SUBJECTS_MAIN, SUBJECTS_MINOR, SUBJECTS_RARE, SUBJECT_TO_ICON } from '../types/subject';
import IconTagList from './IconTagList';
import Flame from '../assets/icons/flame.svg';

const SingleSubjectSelector = ({
    subSubjects,
    group,
    groupWidth,
    justifyContent,
    limit,
    subjects,
    addSubject,
    removeSubject,
    variant,
    importance = 0,
}: {
    subSubjects: Subject['name'][];
    group: string;
    groupWidth: string;
    justifyContent?: string;
    limit?: number;
    subjects: Subject['name'][];
    addSubject: (name: string) => void;
    removeSubject: (name: string) => void;
    variant?: 'normal' | 'selection';
    importance?: number;
}) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    return (
        <HStack w={groupWidth} mt={5} flexWrap="wrap" justifyContent={justifyContent ?? 'center'} alignItems={justifyContent ?? 'center'}>
            <Row w="100%" alignItems={'flex-start'}>
                <Heading lineHeight={'28px'} mb={3}>
                    {t(`matching.wizard.student.subjects.${group}.title` as unknown as TemplateStringsArray)}
                </Heading>
                {[...Array(importance)].map(() => (
                    <Flame stroke={'rgb(255,0,0)'} />
                ))}
            </Row>
            <Text w="100%" mb={4}>
                {t(`matching.wizard.student.subjects.${group}.explanation` as unknown as TemplateStringsArray)}
            </Text>
            {subSubjects.map((subject) => {
                return (
                    <Box margin={space['0.5']} maxW="250px" flexBasis="100px" flexGrow={1} alignSelf={'stretch'}>
                        <IconTagList
                            key={subject}
                            initial={subjects.includes(subject)}
                            variant={variant}
                            text={t(`lernfair.subjects.${subject}` as unknown as TemplateStringsArray)}
                            iconPath={`subjects/icon_${(SUBJECT_TO_ICON as any)[subject as any] as string}.svg`}
                            onPress={() => {
                                if (!subjects.includes(subject)) {
                                    if (limit && subjects.length >= limit) {
                                        removeSubject(subjects[0]);
                                    }
                                    addSubject(subject);
                                } else {
                                    removeSubject(subject);
                                }
                            }}
                        />
                    </Box>
                );
            })}
        </HStack>
    );
};

export const SubjectSelectorGrouped = ({
    subjects,
    addSubject,
    removeSubject,
    limit,
    selectable,
    variant = 'selection',
    includeDaz = false,
    justifyContent,
}: {
    subjects: Subject['name'][];
    selectable?: Subject['name'][];
    addSubject: (name: string) => void;
    removeSubject: (name: string) => void;
    limit?: number;
    variant?: 'normal' | 'selection';
    includeDaz?: boolean;
    justifyContent?: string;
}) => {
    const groupWidth = useBreakpointValue({
        base: '100%',
        xl: '30%',
    });

    return (
        <>
            <HStack w="100%" flexWrap="wrap" justifyContent={'space-between'} alignItems={justifyContent ?? 'center'}>
                <SingleSubjectSelector
                    subjects={subjects}
                    removeSubject={removeSubject}
                    addSubject={addSubject}
                    subSubjects={SUBJECTS_MAIN}
                    group={'maincourse'}
                    justifyContent={justifyContent}
                    groupWidth={groupWidth}
                    limit={limit}
                    variant={variant}
                    importance={3}
                />
                <SingleSubjectSelector
                    subjects={subjects}
                    removeSubject={removeSubject}
                    addSubject={addSubject}
                    subSubjects={SUBJECTS_MINOR}
                    justifyContent={justifyContent}
                    groupWidth={groupWidth}
                    limit={limit}
                    group={'minorcourse'}
                    variant={variant}
                    importance={1}
                />
                <SingleSubjectSelector
                    subjects={subjects}
                    removeSubject={removeSubject}
                    addSubject={addSubject}
                    subSubjects={SUBJECTS_RARE}
                    justifyContent={justifyContent}
                    groupWidth={groupWidth}
                    limit={limit}
                    group={'rarecourse'}
                    variant={variant}
                />
            </HStack>
            ;
        </>
    );
};

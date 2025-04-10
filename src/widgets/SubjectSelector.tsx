import { Box, HStack, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Subject } from '../gql/graphql';
import { DAZ, SUBJECT_TO_ICON, SUBJECTS_MAIN, SUBJECTS_MINOR, SUBJECTS_RARE } from '../types/subject';
import IconTagList from './IconTagList';

export const SubjectSelector = ({
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
    const { t } = useTranslation();
    const { space } = useTheme();
    const SUBJECTS = [...SUBJECTS_MAIN, ...SUBJECTS_MINOR, ...SUBJECTS_RARE];

    return (
        <HStack w="100%" flexWrap="wrap" justifyContent={justifyContent ?? 'center'} alignItems={justifyContent ?? 'center'}>
            {((selectable ?? (includeDaz ? SUBJECTS : SUBJECTS.filter((it) => it !== DAZ))) as string[]).map((subject) => (
                <Box margin={space['0.5']} maxW="250px" flexBasis="100px" flexGrow={1} key={subject}>
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
            ))}
        </HStack>
    );
};

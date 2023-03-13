import { FormControl, Heading, useBreakpointValue, useTheme, VStack, Text, Box, Input } from 'native-base';
import { Slider } from '@miblanchard/react-native-slider';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateCourseContext } from '../CreateCourse';
import ButtonRow from './ButtonRow';

type AttendeesProps = {
    onNext: () => any;
    onBack: () => any;
};

const CourseAttendees: React.FC<AttendeesProps> = ({ onNext, onBack }) => {
    const { space, sizes, colors } = useTheme();
    const { t } = useTranslation();
    const { maxParticipantCount, setMaxParticipantCount, classRange, setClassRange } = useContext(CreateCourseContext);

    const [courseClassRange, setCourseClassRange] = useState<[number, number]>(classRange || [1, 13]);
    const [maxParticipants, setMaxParticipants] = useState<string>(maxParticipantCount || '');

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const isValidInput: boolean = useMemo(() => {
        if (maxParticipants) return false;
        return true;
    }, [maxParticipants]);

    const onNextStep = useCallback(() => {
        setClassRange && setClassRange(courseClassRange);
        setMaxParticipantCount && setMaxParticipantCount(maxParticipants);
        onNext();
    }, [courseClassRange, maxParticipants, onNext, setClassRange, setMaxParticipantCount]);
    return (
        <>
            <VStack space={space['1']} marginX="auto" width="100%" maxWidth={ContentContainerWidth}>
                <Heading>{t('course.CourseDate.step.attendees')}</Heading>
                <FormControl>
                    <FormControl.Label _text={{ color: 'primary.900', fontSize: 'md' }} isRequired>
                        {t('course.CourseDate.form.detailsContent')}
                    </FormControl.Label>

                    <Text>{t('course.CourseDate.form.classRange', { minRange: courseClassRange[0], maxRange: courseClassRange[1] })}</Text>
                    <Box>
                        <Slider
                            animateTransitions
                            minimumValue={1}
                            maximumValue={13}
                            minimumTrackTintColor={colors['primary']['500']}
                            thumbTintColor={colors['primary']['900']}
                            value={courseClassRange || [1, 13]}
                            step={1}
                            onValueChange={(value: number | number[]) => {
                                Array.isArray(value) && setCourseClassRange([value[0], value[1]]);
                            }}
                        />
                    </Box>
                </FormControl>

                <FormControl marginBottom={space['2']}>
                    <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
                        {t('course.CourseDate.form.maxMembersLabel')}
                    </FormControl.Label>

                    <Input
                        keyboardType="numeric"
                        value={maxParticipants}
                        onChangeText={(text) => {
                            const t = text.replace(/\D+/g, '');
                            setMaxParticipants(t);
                        }}
                        marginBottom={space['0.5']}
                    />

                    <Text fontSize="xs" color="primary.grey">
                        {t('course.CourseDate.form.maxMembersInfo')}
                    </Text>
                </FormControl>

                <ButtonRow isDisabled={isValidInput} onNext={onNextStep} onBack={onBack} />
            </VStack>
        </>
    );
};

export default CourseAttendees;

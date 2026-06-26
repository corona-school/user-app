import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { IconLoader } from '@/components/IconLoader';
import { Toggle } from '@/components/Toggle';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import {
    IconActivity,
    IconBriefcase,
    IconCalculator,
    IconChalkboard,
    IconChevronDown,
    IconChevronUp,
    IconCircleCheckFilled,
    IconCode,
    IconCoins,
    IconDeviceAnalytics,
    IconFlask2,
    IconFocus2,
    IconGlobe,
    IconListSearch,
    IconMicroscope,
    IconMusic,
    IconPlusMinus,
    IconPrismLight,
    IconQuestionMark,
    IconScale,
    IconSpeakerphone,
    IconTool,
    IconTower,
} from '@tabler/icons-react';
import { Box, HStack, useTheme } from 'native-base';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Subject } from '../gql/graphql';
import { DAZ, SUBJECT_TO_ICON, SUBJECTS_MAIN, SUBJECTS_MINOR, SUBJECTS_RARE, SingleSubject } from '../types/subject';
import IconTagList from './IconTagList';

const deprecatedSubjects: SingleSubject[] = ['Altgriechisch', 'Chinesisch', 'Italienisch', 'Kunst', 'Niederländisch', 'Philosophie', 'Religion', 'Russisch'];

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

const getGradesLabels = (numbers: number[]) => {
    if (!numbers.length) return '';

    const result = [];
    let start = numbers[0];
    let end = numbers[0];

    for (let i = 1; i <= numbers.length; i++) {
        if (numbers[i] === end + 1) {
            end = numbers[i];
        } else {
            result.push(start === end ? `${start}` : `${start}-${end}`);

            start = numbers[i];
            end = numbers[i];
        }
    }

    return result.join(',');
};

export interface SubjectOption {
    subject: SingleSubject;
    pupilsWaiting?: number;
    waitingDaysRange?: { from: number; to: number };
    gradesAvailable?: number[];
}

interface SingleProps {
    value: SingleSubject;
    onChange: (it: SingleSubject) => any;
    multiple?: false;
}

interface MultipleProps {
    value: SingleSubject[];
    onChange: (it: SingleSubject[]) => any;
    multiple?: true;
}

type SubjectsSelectorProps = (SingleProps | MultipleProps) & {
    options: SubjectOption[];
    showPupilsWaiting?: boolean;
    showWaitingDays?: boolean;
    showGradesAvailable?: boolean;
};

export const SubjectsSelector = ({
    value,
    onChange,
    multiple,
    options = [],
    showGradesAvailable,
    showPupilsWaiting,
    showWaitingDays,
}: SubjectsSelectorProps) => {
    const { t } = useTranslation();
    const [showAllSubjects, setShowAllSubjects] = useState(false);

    const handleOnToggle = (subject: SingleSubject, selected: boolean) => {
        if (multiple) {
            onChange(selected ? [...value, subject] : value.filter((s) => s !== subject));
            return;
        }

        onChange(subject as any);
    };

    const filteredOptions = useMemo(() => {
        return options.filter((option) => !deprecatedSubjects.includes(option.subject as any));
    }, [options]);

    const mainOptions = filteredOptions.slice(0, 12);
    const rareOptions = filteredOptions.slice(12);

    console.log(mainOptions);

    return (
        <div className="flex flex-wrap gap-2 justify-center md:gap-4 md:justify-start">
            {mainOptions.concat(showAllSubjects ? rareOptions : []).map((option) => {
                const isPressed = multiple ? (value as SingleSubject[]).some((s) => s === option.subject) : value === option.subject;
                return (
                    <Toggle
                        variant="outline-primary-lighter"
                        className={cn('w-[167px] h-[120px] md:w-full md:max-w-[272px] p-3 flex flex-col text-sm relative ', {
                            'h-[104px] md:max-w-[176px]': !showGradesAvailable && !showPupilsWaiting && showWaitingDays,
                        })}
                        key={option.subject}
                        pressed={isPressed}
                        onPressedChange={(pressed) => handleOnToggle(option.subject, pressed)}
                    >
                        <div className="min-w-10 min-h-10 bg-accent-medium rounded-full flex items-center justify-center group-data-[state=on]:bg-green-200">
                            <SubjectIcon subject={option.subject} className={cn('rounded-full size-6 flex-shrink-0')} />
                        </div>
                        <Typography variant="sm" className="font-semibold mb-3 leading-1 mt-1">
                            {t(`lernfair.subjects.${option.subject}` as unknown as TemplateStringsArray)}
                        </Typography>
                        <div className="flex gap-x-1">
                            {showWaitingDays && (
                                <Typography variant="sm" className="text-[12px] text-primary-midnight">
                                    {option?.waitingDaysRange?.from && option?.waitingDaysRange?.to
                                        ? t('waitingTimeInWeeks', {
                                              0: Math.ceil(option.waitingDaysRange.from / 7),
                                              1: Math.ceil(option.waitingDaysRange.to / 7),
                                          })
                                        : `Zu wenig Daten`}
                                </Typography>
                            )}
                            {showPupilsWaiting && !!option.pupilsWaiting && (
                                <Badge className="shadow-none text-[12px] font-normal px-[7px] h-5">{option.pupilsWaiting} wartend</Badge>
                            )}
                            {showGradesAvailable && !!option.gradesAvailable && (
                                <Badge className="shadow-none text-[12px] font-normal px-[7px] h-5 bg-accent text-primary group-data-[state=on]:bg-transparent">
                                    Kl. {getGradesLabels(option.gradesAvailable)}
                                </Badge>
                            )}
                        </div>
                        {isPressed && <IconCircleCheckFilled size={24} className="text-green-500 absolute top-2 right-2 md:-top-2 md:-right-2" />}
                    </Toggle>
                );
            })}
            {options.length > 12 && (
                <div className="w-full flex justify-center pt-6 md:pt-10">
                    <Button
                        leftIcon={showAllSubjects ? <IconChevronUp /> : <IconChevronDown />}
                        variant="outline"
                        onClick={() => setShowAllSubjects(!showAllSubjects)}
                        className="px-11"
                    >
                        {showAllSubjects ? t('lessSubjects') : t('moreSubjects')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export const SubjectIcon = ({ subject, className }: { subject: SingleSubject; className?: string }) => {
    switch (subject) {
        case 'Altgriechisch':
        case 'Chinesisch':
        case 'Italienisch':
        case 'Kunst':
        case 'Niederländisch':
        case 'Philosophie':
        case 'Religion':
        case 'Russisch':
            return <IconQuestionMark className={className} />;

        case 'Arbeitslehre':
            return <IconBriefcase className={className} />;
        case 'Biologie':
            return <IconMicroscope className={className} />;
        case 'Chemie':
            return <IconFlask2 className={className} />;
        case 'Deutsch':
            return <IconLoader iconPath="subjects/german.svg" className={className} />;
        case 'Deutsch als Zweitsprache':
            return <IconLoader iconPath="subjects/daz.svg" className={className} />;
        case 'Englisch':
            return <IconLoader iconPath="subjects/english.svg" className={className} />;
        case 'Erdkunde':
            return <IconGlobe className={className} />;
        case 'Ethik':
            return <IconScale className={className} />;
        case 'Französisch':
            return <IconLoader iconPath="subjects/french.svg" className={className} />;
        case 'Geschichte':
            return <IconTower className={className} />;
        case 'Gesundheit':
            return <IconActivity className={className} />;
        case 'Informatik':
            return <IconCode className={className} />;
        case 'Latein':
            return <IconLoader iconPath="subjects/latin.svg" className={className} />;
        case 'Lernen lernen':
            return <IconFocus2 className={className} />;
        case 'Mathematik':
            return <IconPlusMinus className={className} />;
        case 'Musik':
            return <IconMusic className={className} />;
        case 'Pädagogik':
            return <IconChalkboard className={className} />;
        case 'Physik':
            return <IconPrismLight className={className} />;
        case 'Politik':
            return <IconSpeakerphone className={className} />;
        case 'Rechnungswesen':
            return <IconCalculator className={className} />;
        case 'Sachkunde':
            return <IconListSearch className={className} />;
        case 'Spanisch':
            return <IconLoader iconPath="subjects/spanish.svg" className={className} />;
        case 'Steuerlehre':
            return <IconDeviceAnalytics className={className} />;
        case 'Technik':
            return <IconTool className={className} />;
        case 'Wirtschaft':
            return <IconCoins className={className} />;

        default:
            break;
    }
    return <IconLoader icon={subject} className={cn('rounded-full size-6 flex-shrink-0', className)} />;
};

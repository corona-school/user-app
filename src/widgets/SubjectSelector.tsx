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
import { Subject, Course_Subject_Enum } from '../gql/graphql';
import { DAZ, SUBJECT_TO_ICON, SUBJECTS_MAIN, SUBJECTS_MINOR, SUBJECTS_RARE, courseSubjectToSubject } from '../types/subject';
import IconTagList from './IconTagList';

const deprecatedSubjects = [
    Course_Subject_Enum.Altgriechisch,
    Course_Subject_Enum.Chinesisch,
    Course_Subject_Enum.Italienisch,
    Course_Subject_Enum.Kunst,
    Course_Subject_Enum.NiederlNdisch,
    Course_Subject_Enum.Philosophie,
    Course_Subject_Enum.Religion,
    Course_Subject_Enum.Russisch,
] as const;

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
    subject: Course_Subject_Enum;
    pupilsWaiting?: number;
    waitingDaysRange?: { from: number; to: number };
    gradesAvailable?: number[];
}

interface SingleProps {
    value: Course_Subject_Enum;
    onChange: (it: Course_Subject_Enum) => any;
    multiple?: false;
}

interface MultipleProps {
    value: Course_Subject_Enum[];
    onChange: (it: Course_Subject_Enum[]) => any;
    multiple?: true;
}

type SubjectsSelectorProps = (SingleProps | MultipleProps) & {
    options: SubjectOption[];
    showPupilsWaiting?: boolean;
    showWaitingDays?: boolean;
    showGradesAvailable?: boolean;
};

export const SubjectsSelector = ({ value, onChange, multiple, options, showGradesAvailable, showPupilsWaiting, showWaitingDays }: SubjectsSelectorProps) => {
    const { t } = useTranslation();
    const [showAllSubjects, setShowAllSubjects] = useState(false);

    const handleOnToggle = (subject: Course_Subject_Enum, selected: boolean) => {
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

    return (
        <div className="flex flex-wrap gap-2 md:gap-4 justify-start">
            {mainOptions.concat(showAllSubjects ? rareOptions : []).map((option) => {
                const isPressed = multiple ? (value as Course_Subject_Enum[]).some((s) => s === option.subject) : value === option.subject;
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
                            {t(`lernfair.subjects.${courseSubjectToSubject(option.subject)}` as unknown as TemplateStringsArray)}
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
                <div className="w-full flex justify-center pt-10">
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

export const SubjectIcon = ({ subject, className }: { subject: Course_Subject_Enum; className?: string }) => {
    switch (subject) {
        case Course_Subject_Enum.Altgriechisch:
        case Course_Subject_Enum.Chinesisch:
        case Course_Subject_Enum.Italienisch:
        case Course_Subject_Enum.Kunst:
        case Course_Subject_Enum.NiederlNdisch:
        case Course_Subject_Enum.Philosophie:
        case Course_Subject_Enum.Religion:
        case Course_Subject_Enum.Russisch:
            return <IconQuestionMark className={className} />;

        case Course_Subject_Enum.Arbeitslehre:
            return <IconBriefcase className={className} />;
        case Course_Subject_Enum.Biologie:
            return <IconMicroscope className={className} />;
        case Course_Subject_Enum.Chemie:
            return <IconFlask2 className={className} />;
        case Course_Subject_Enum.Deutsch:
            return <IconLoader iconPath="subjects/german.svg" className={className} />;
        case Course_Subject_Enum.DeutschAlsZweitsprache:
            return <IconLoader iconPath="subjects/daz.svg" className={className} />;
        case Course_Subject_Enum.Englisch:
            return <IconLoader iconPath="subjects/english.svg" className={className} />;
        case Course_Subject_Enum.Erdkunde:
            return <IconGlobe className={className} />;
        case Course_Subject_Enum.Ethik:
            return <IconScale className={className} />;
        case Course_Subject_Enum.FranzSisch:
            return <IconLoader iconPath="subjects/french.svg" className={className} />;
        case Course_Subject_Enum.Geschichte:
            return <IconTower className={className} />;
        case Course_Subject_Enum.Gesundheit:
            return <IconActivity className={className} />;
        case Course_Subject_Enum.Informatik:
            return <IconCode className={className} />;
        case Course_Subject_Enum.Latein:
            return <IconLoader iconPath="subjects/latin.svg" className={className} />;
        case Course_Subject_Enum.LernenLernen:
            return <IconFocus2 className={className} />;
        case Course_Subject_Enum.Mathematik:
            return <IconPlusMinus className={className} />;
        case Course_Subject_Enum.Musik:
            return <IconMusic className={className} />;
        case Course_Subject_Enum.PDagogik:
            return <IconChalkboard className={className} />;
        case Course_Subject_Enum.Physik:
            return <IconPrismLight className={className} />;
        case Course_Subject_Enum.Politik:
            return <IconSpeakerphone className={className} />;
        case Course_Subject_Enum.Rechnungswesen:
            return <IconCalculator className={className} />;
        case Course_Subject_Enum.Sachkunde:
            return <IconListSearch className={className} />;
        case Course_Subject_Enum.Spanisch:
            return <IconLoader iconPath="subjects/spanish.svg" className={className} />;
        case Course_Subject_Enum.Steuerlehre:
            return <IconDeviceAnalytics className={className} />;
        case Course_Subject_Enum.Technik:
            return <IconTool className={className} />;
        case Course_Subject_Enum.Wirtschaft:
            return <IconCoins className={className} />;

        default:
            break;
    }
    return <IconLoader icon={subject} className={cn('rounded-full size-6 flex-shrink-0', className)} />;
};

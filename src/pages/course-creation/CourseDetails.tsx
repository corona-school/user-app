import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Course_Category_Enum } from '@/gql/graphql';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import Dropzone, { FileItem } from '@/components/Dropzone';
import { Button } from '@/components/Button';
import { Slider } from '@/components/Slider';
import { SUBJECTS_MAIN, SUBJECTS_MINOR, SUBJECTS_RARE } from '@/types/subject';
import { useQuery } from '@apollo/client';
import { gql } from '@/gql';
import { getGradeLabel } from '@/Utility';
import { Typography } from '@/components/Typography';
import { InfoTooltipButton } from '@/components/Tooltip';
import { LFTag } from '@/types/lernfair/Course';

const TAGS_QUERY = gql(`
    query GetCourseTags($category: String!) {
        courseTags(category: $category) {
            id
            name
        }
    }
`);

const SUBJECTS = ['Deutsch', 'Englisch', 'Mathematik', ...SUBJECTS_MINOR, ...SUBJECTS_RARE];

interface Props {
    courseName: string;
    setCourseName: Dispatch<SetStateAction<string>>;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
    pickedPhoto: FileItem | null | undefined;
    setPickedPhoto: Dispatch<SetStateAction<FileItem | null | undefined>>;
    existingPhoto: string;
    maxParticipantCount: number;
    setMaxParticipantCount: Dispatch<SetStateAction<number>>;
    subject: string | null;
    setSubject: Dispatch<SetStateAction<string | null>>;
    gradeRange: [number, number];
    setGradeRange: Dispatch<SetStateAction<[number, number]>>;
    selectedTags: LFTag[];
    setSelectedTags: Dispatch<SetStateAction<LFTag[]>>;
    category: Course_Category_Enum;
    setCategory: Dispatch<SetStateAction<Course_Category_Enum>>;
    errors?: string[];
}

const PREDEFINED_PARTICIPANTS = [5, 10, 20, 30, 40, 50, 100];

const CourseDetails: React.FC<Props> = ({
    courseName,
    setCourseName,
    description,
    setDescription,
    pickedPhoto,
    setPickedPhoto,
    existingPhoto,
    subject,
    setSubject,
    maxParticipantCount,
    setMaxParticipantCount,
    gradeRange,
    setGradeRange,
    selectedTags,
    setSelectedTags,
    category,
    setCategory,
    errors,
}) => {
    const { t } = useTranslation();

    const [draftMaxParticipantCount, setDraftMaxParticipantCount] = useState<string>(
        PREDEFINED_PARTICIPANTS.includes(maxParticipantCount) ? maxParticipantCount.toString() : 'custom'
    );
    const [customMaxAttendees, setCustomMaxAttendees] = useState<number>(maxParticipantCount);

    const { data, loading: isLoading } = useQuery(TAGS_QUERY, { variables: { category } });

    useEffect(() => {
        if (draftMaxParticipantCount === 'custom') {
            setMaxParticipantCount(customMaxAttendees);
        } else {
            setMaxParticipantCount(parseInt(draftMaxParticipantCount, 10));
        }
    }, [draftMaxParticipantCount, customMaxAttendees]);

    return (
        <>
            <Typography variant="h3">{t('course.CourseDate.step.general')}</Typography>
            {/*Don't allow homework help courses to change category, as they cannot change it back (hidden category)*/}
            {category !== Course_Category_Enum.HomeworkHelp && (
                <div className="flex flex-col gap-2.5">
                    <Label htmlFor="courseCategory" className="text-base">
                        {t('course.CourseDate.form.courseCategory')}
                    </Label>
                    <RadioGroup className="px-4" id="courseCategory" value={category} onValueChange={(v) => setCategory(v as Course_Category_Enum)}>
                        <div className="flex gap-x-2 items-center">
                            <RadioGroupItem id="revision" value={Course_Category_Enum.Revision} />
                            <div className="inline-flex align-baseline gap-1.5">
                                <Label htmlFor="revision">{t('course.CourseDate.form.revision')}</Label>
                                <InfoTooltipButton tooltipContent="TODO" />
                            </div>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <RadioGroupItem id="language" value={Course_Category_Enum.Language} />
                            <div className="inline-flex align-baseline gap-1.5">
                                <Label htmlFor="language">{t('course.CourseDate.form.language')}</Label>
                                <InfoTooltipButton tooltipContent="TODO" />
                            </div>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <RadioGroupItem id="focus" value={Course_Category_Enum.Focus} />
                            <div className="inline-flex align-baseline gap-1.5">
                                <Label htmlFor="focus">{t('course.CourseDate.form.focus')}</Label>
                                <InfoTooltipButton tooltipContent="TODO" />
                            </div>
                        </div>
                    </RadioGroup>
                </div>
            )}

            <div className="flex flex-col gap-2.5">
                <Label htmlFor="courseName" className="text-base">
                    {t('course.CourseDate.form.courseNameHeadline')}
                </Label>
                <Input
                    id="courseName"
                    value={courseName}
                    placeholder={t('course.CourseDate.form.courseNamePlaceholder')}
                    onChange={(e) => setCourseName?.(e.target.value)}
                    className="w-full"
                />
                {errors && errors.includes('course-name') && (
                    <Typography variant="sm" className="text-red-500 error">
                        Bitte gib einen Kursnamen ein.
                    </Typography>
                )}
            </div>

            <div className="flex flex-col gap-2.5">
                <Label htmlFor="description" className="text-base">
                    {t('course.CourseDate.form.descriptionLabel')}
                </Label>
                <TextArea
                    id="description"
                    value={description}
                    placeholder={t('course.CourseDate.form.descriptionPlaceholder')}
                    onChange={(e) => setDescription?.(e.target.value)}
                    className="resize-none h-24 w-full"
                />
                {errors && errors.includes('description') && (
                    <Typography variant="sm" className="text-red-500">
                        Bitte gib eine Kursbeschreibung ein.
                    </Typography>
                )}
            </div>

            <div className="flex flex-col gap-2.5">
                <div className="inline-flex align-baseline gap-1.5">
                    <Label className="text-base">{t('course.CourseDate.step.attendees')}</Label>
                    <InfoTooltipButton tooltipContent="TODO" />
                </div>
                <div className="flex gap-2.5 flex-wrap">
                    {PREDEFINED_PARTICIPANTS.map((item) => (
                        <Button
                            className="flex-grow"
                            key={item}
                            variant={draftMaxParticipantCount === item.toString() ? 'default' : 'outline'}
                            onClick={() => setDraftMaxParticipantCount(item.toString())}
                        >
                            {item}
                        </Button>
                    ))}
                    <Button
                        variant={draftMaxParticipantCount === 'custom' ? 'default' : 'outline'}
                        className="flex-grow"
                        onClick={() => setDraftMaxParticipantCount('custom')}
                    >
                        Eigene
                    </Button>
                </div>
                {draftMaxParticipantCount === 'custom' && (
                    <div className="w-full flex items-center gap-2.5">
                        <Slider value={[customMaxAttendees]} onValueChange={(v) => setCustomMaxAttendees(v[0])} />
                        <span className="w-8 text-center">{customMaxAttendees}</span>
                    </div>
                )}
            </div>

            {/*Subject selection for revision courses*/}
            {category === Course_Category_Enum.Revision && (
                <div className="flex flex-col gap-2.5">
                    <div className="inline-flex align-baseline gap-1.5">
                        <Label className="text-base">{t('course.CourseDate.form.courseSubjectLabel')}</Label>
                        <InfoTooltipButton tooltipContent="TODO" />
                    </div>
                    <div className="flex gap-2.5 flex-wrap">
                        {SUBJECTS.map((s) => (
                            <Button key={s} variant={s === subject ? 'default' : 'outline'} onClick={() => setSubject && setSubject(s)}>
                                {t(`lernfair.subjects.${s}` as unknown as TemplateStringsArray)}
                            </Button>
                        ))}
                    </div>
                    {errors && errors.includes('subject') && (
                        <Typography variant="sm" className="text-red-500">
                            Bitte wähle ein Fach aus.
                        </Typography>
                    )}
                </div>
            )}

            {/*Tag selection for non-revision courses*/}
            {category && category !== Course_Category_Enum.Revision && category !== Course_Category_Enum.HomeworkHelp && (
                <div className="flex flex-col gap-2.5">
                    <div className="inline-flex align-baseline gap-1.5">
                        <Label className="text-base">{t('course.CourseDate.form.tagsLabel')}</Label>
                        <InfoTooltipButton tooltipContent="TODO" />
                    </div>
                    <div className="flex gap-2.5 flex-wrap">
                        {data?.courseTags.map((tag) => (
                            <Button
                                key={tag.id}
                                variant={selectedTags.some((x) => x.id === tag.id) ? 'default' : 'outline'}
                                onClick={() => {
                                    if (selectedTags.some((x) => x.id === tag.id)) {
                                        setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
                                    } else {
                                        setSelectedTags([...selectedTags, tag]);
                                    }
                                }}
                            >
                                {tag.name}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2.5">
                <Label className="text-base">{t('course.CourseDate.form.coursePhotoLabel')}</Label>
                <Dropzone onUpload={(file) => setPickedPhoto && setPickedPhoto(file)} file={pickedPhoto === undefined ? existingPhoto : pickedPhoto} />
            </div>

            {/*  Grade selection  */}
            <div className="flex flex-col gap-2.5">
                <Label className="text-base">{t('course.CourseDate.form.detailsContent')}</Label>
                <Slider id="gradeSlider" min={1} max={14} value={gradeRange} onValueChange={(range) => setGradeRange([range[0], range[1]])} />
                <Label htmlFor="gradeSlider" className="text-center">
                    {t('course.CourseDate.form.classRange', {
                        minRange: getGradeLabel(gradeRange[0]),
                        maxRange: getGradeLabel(gradeRange[1]),
                    })}
                </Label>
                {errors && errors.includes('grade-range') && (
                    <Typography variant="sm" className="text-red-500">
                        Bitte gib einen Klassenbereich an.
                    </Typography>
                )}
            </div>
        </>
    );
};

export default CourseDetails;

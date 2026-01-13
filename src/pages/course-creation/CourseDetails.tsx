import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Course_Category_Enum } from '@/gql/graphql';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import Dropzone, { FileItem } from '@/components/Dropzone';
import { Slider } from '@/components/Slider';
import { SUBJECTS_MINOR, SUBJECTS_RARE } from '@/types/subject';
import { useQuery } from '@apollo/client';
import { gql } from '@/gql';
import { getGradeLabel } from '@/Utility';
import { Typography } from '@/components/Typography';
import { InfoTooltipButton } from '@/components/Tooltip';
import { LFSubCourse } from '@/types/lernfair/Course';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import CourseInstructors from '@/pages/course-creation/CourseInstructors';
import { Toggle } from '@/components/Toggle';

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
    subcourse: LFSubCourse;
    setSubcourse: Dispatch<SetStateAction<LFSubCourse>>;
    pickedPhoto: FileItem | null | undefined;
    setPickedPhoto: Dispatch<SetStateAction<FileItem | null | undefined>>;
    errors: string[];
}

const PREDEFINED_PARTICIPANTS = [5, 10, 20, 30, 40, 50, 100];

const CourseDetails: React.FC<Props> = ({ subcourse, setSubcourse, pickedPhoto, setPickedPhoto, errors }) => {
    const { t } = useTranslation();

    const [draftMaxParticipantCount, setDraftMaxParticipantCount] = useState<string>(
        subcourse.maxParticipants && PREDEFINED_PARTICIPANTS.includes(subcourse.maxParticipants) ? subcourse.maxParticipants.toString() : 'custom'
    );
    const [customMaxAttendees, setCustomMaxAttendees] = useState<number>(subcourse.maxParticipants ?? 100);

    const { data, loading: tagsLoading } = useQuery(TAGS_QUERY, { variables: { category: subcourse.course.category } });

    useEffect(() => {
        if (draftMaxParticipantCount === 'custom') {
            setSubcourse((s) => ({ ...s, maxParticipants: customMaxAttendees }));
        } else {
            setSubcourse((s) => ({ ...s, maxParticipants: parseInt(draftMaxParticipantCount, 10) }));
        }
    }, [draftMaxParticipantCount, customMaxAttendees, setSubcourse]);

    return (
        <>
            <Typography variant="h4">{t('course.CourseDate.step.general')}</Typography>
            {/*Don't allow homework help courses to change category, as they cannot change it back (hidden category)*/}
            {subcourse.course.category !== Course_Category_Enum.HomeworkHelp && (
                <div className="flex flex-col gap-2.5">
                    <Label htmlFor="courseCategory" className="text-base">
                        {t('course.CourseDate.form.courseCategory')}
                    </Label>
                    <RadioGroup
                        id="courseCategory"
                        value={subcourse.course.category}
                        onValueChange={(v) =>
                            setSubcourse((s) => ({ ...s, course: { ...s.course, category: v as Course_Category_Enum, tags: [], subject: '' } }))
                        }
                    >
                        <div className="flex sm:flex-row flex-col gap-5">
                            <div className="flex gap-x-2 items-center">
                                <RadioGroupItem size="sm" id="revision" value={Course_Category_Enum.Revision} />
                                <div className="inline-flex align-baseline gap-1.5">
                                    <Label htmlFor="revision">{t('course.CourseDate.form.revision')}</Label>
                                    <InfoTooltipButton className="size-4" tooltipContent={t('course.CourseDate.form.revisionTooltip')} />
                                </div>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <RadioGroupItem size="sm" id="language" value={Course_Category_Enum.Language} />
                                <div className="inline-flex align-baseline gap-1.5">
                                    <Label htmlFor="language">{t('course.CourseDate.form.language')}</Label>
                                    <InfoTooltipButton className="size-4" tooltipContent={t('course.CourseDate.form.languageTooltip')} />
                                </div>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <RadioGroupItem size="sm" id="focus" value={Course_Category_Enum.Focus} />
                                <div className="inline-flex align-baseline gap-1.5">
                                    <Label htmlFor="focus">{t('course.CourseDate.form.focus')}</Label>
                                    <InfoTooltipButton className="size-4" tooltipContent={t('course.CourseDate.form.focusTooltip')} />
                                </div>
                            </div>
                        </div>
                    </RadioGroup>
                </div>
            )}
            <div className="flex sm:flex-row flex-col gap-5">
                <div className="flex-1 flex flex-col gap-5">
                    <div className="flex flex-col gap-2.5">
                        <Label htmlFor="courseName" className="text-base required">
                            {t('course.CourseDate.form.courseNameHeadline')}
                        </Label>
                        <Input
                            id="courseName"
                            value={subcourse.course.name}
                            placeholder={t('course.CourseDate.form.courseNamePlaceholder')}
                            onChange={(e) => setSubcourse((s) => ({ ...s, course: { ...s.course, name: e.target.value } }))}
                            className="w-full"
                        />
                        {errors.includes('course-name') && (
                            <Typography variant="sm" className="text-red-500 error">
                                {t('course.error.course-name')}
                            </Typography>
                        )}
                    </div>

                    <div className="flex flex-col gap-2.5 h-[80%] min-h-48">
                        <Label htmlFor="description" className="text-base required">
                            {t('course.CourseDate.form.descriptionLabel')}
                        </Label>
                        <TextArea
                            id="description"
                            value={subcourse.course.description}
                            placeholder={t('course.CourseDate.form.descriptionPlaceholder')}
                            onChange={(e) => setSubcourse((s) => ({ ...s, course: { ...s.course, description: e.target.value } }))}
                            className="resize-none h-full flex-grow w-full"
                        />
                        {errors.includes('description') && (
                            <Typography variant="sm" className="text-red-500 error">
                                {t('course.error.description')}
                            </Typography>
                        )}
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-5">
                    <div className="flex flex-col gap-2.5">
                        <div className="inline-flex align-baseline gap-1.5">
                            <Label className="text-base">{t('course.CourseDate.step.attendees')}</Label>
                            <InfoTooltipButton tooltipContent={t('course.CourseDate.form.maxMembersTooltip')} />
                        </div>
                        <div className="flex gap-2.5 flex-wrap">
                            {PREDEFINED_PARTICIPANTS.map((item) => (
                                <Toggle
                                    className="flex-grow"
                                    key={item}
                                    variant="primary"
                                    pressed={draftMaxParticipantCount === item.toString()}
                                    onPressedChange={() => setDraftMaxParticipantCount(item.toString())}
                                >
                                    {item}
                                </Toggle>
                            ))}
                            <Toggle
                                pressed={draftMaxParticipantCount === 'custom'}
                                className="flex-grow"
                                variant="primary"
                                onPressedChange={() => setDraftMaxParticipantCount('custom')}
                            >
                                {t('course.CourseDate.form.customMembersCount')}
                            </Toggle>
                        </div>
                        {draftMaxParticipantCount === 'custom' && (
                            <div className="w-full flex items-center gap-2.5">
                                <Slider value={[customMaxAttendees]} onValueChange={(v) => setCustomMaxAttendees(v[0])} />
                                <span className="w-8 text-center">{customMaxAttendees}</span>
                            </div>
                        )}
                    </div>

                    {/*Subject selection for revision courses*/}
                    {subcourse.course.category === Course_Category_Enum.Revision && (
                        <div className="flex flex-col gap-2.5">
                            <div className="inline-flex align-baseline gap-1.5">
                                <Label className="text-base required">{t('course.CourseDate.form.courseSubjectLabel')}</Label>
                                <InfoTooltipButton tooltipContent={t('course.CourseDate.form.courseSubjectTooltip')} />
                            </div>
                            <div className="flex gap-2.5 flex-wrap">
                                {SUBJECTS.map((s) => (
                                    <Toggle
                                        key={s}
                                        pressed={s === subcourse.course.subject}
                                        variant="primary"
                                        onPressedChange={() => setSubcourse((sc) => ({ ...sc, course: { ...sc.course, subject: s } }))}
                                    >
                                        {t(`lernfair.subjects.${s}` as unknown as TemplateStringsArray)}
                                    </Toggle>
                                ))}
                            </div>
                            {errors.includes('subject') && (
                                <Typography variant="sm" className="text-red-500 error">
                                    {t('course.error.subject')}
                                </Typography>
                            )}
                        </div>
                    )}

                    {/*Tag selection for non-revision courses*/}
                    {subcourse.course.category &&
                        subcourse.course.category !== Course_Category_Enum.Revision &&
                        subcourse.course.category !== Course_Category_Enum.HomeworkHelp && (
                            <div className="flex flex-col gap-2.5">
                                <div className="inline-flex align-baseline gap-1.5">
                                    <Label className="text-base">{t('course.CourseDate.form.tagsLabel')}</Label>
                                    <InfoTooltipButton tooltipContent={t('course.CourseDate.form.tagsTooltip')} />
                                </div>
                                <div className="flex gap-2.5 flex-wrap">
                                    {tagsLoading && <CenterLoadingSpinner />}
                                    {data?.courseTags.map((tag) => (
                                        <Toggle
                                            key={tag.id}
                                            variant="primary"
                                            pressed={subcourse.course.tags?.some((x) => x.id === tag.id)}
                                            onPressedChange={() => {
                                                if (subcourse.course.tags?.some((x) => x.id === tag.id)) {
                                                    setSubcourse((s) => ({
                                                        ...s,
                                                        course: { ...s.course, tags: subcourse.course.tags?.filter((t) => t.id !== tag.id) },
                                                    }));
                                                } else {
                                                    setSubcourse((s) => ({ ...s, course: { ...s.course, tags: [...subcourse.course.tags!, tag] } }));
                                                }
                                            }}
                                        >
                                            {tag.name}
                                        </Toggle>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex flex-1 flex-col gap-2.5">
                    <Label className="text-base">{t('course.CourseDate.form.coursePhotoLabel')}</Label>
                    <Dropzone
                        onUpload={(file) => setPickedPhoto && setPickedPhoto(file)}
                        file={pickedPhoto === undefined ? (subcourse.course.image?.default ? undefined : subcourse.course.image?.url) : pickedPhoto}
                    />
                </div>

                <div className="flex-1">
                    <CourseInstructors subcourse={subcourse} setSubcourse={setSubcourse} />
                </div>
            </div>

            {/*  Grade selection  */}
            <div className="flex flex-col gap-2.5">
                <Label className="text-base">{t('course.CourseDate.form.detailsContent')}</Label>
                <Label htmlFor="gradeSlider">
                    {t('course.CourseDate.form.classRange', {
                        minRange: getGradeLabel(subcourse.minGrade!),
                        maxRange: getGradeLabel(subcourse.maxGrade!),
                    })}
                </Label>
                <Slider
                    id="gradeSlider"
                    min={1}
                    max={14}
                    value={[subcourse.minGrade!, subcourse.maxGrade!]}
                    onValueChange={(range) => setSubcourse((s) => ({ ...s, minGrade: range[0], maxGrade: range[1] }))}
                />
                {errors.includes('grade-range') && (
                    <Typography variant="sm" className="text-red-500 error">
                        {t('course.error.grade-range')}
                    </Typography>
                )}
            </div>
        </>
    );
};

export default CourseDetails;

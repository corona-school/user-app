import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Course_Category_Enum } from '@/gql/graphql';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import Dropzone from '@/components/Dropzone';
import { CreateCourseContext } from '@/pages/CreateCourse';
import { Button } from '@/components/Button';
import { Slider } from '@/components/Slider';
import { SUBJECTS_MAIN, SUBJECTS_MINOR, SUBJECTS_RARE } from '@/types/subject';
import { useQuery } from '@apollo/client';
import { gql } from '@/gql';
import { getGradeLabel } from '@/Utility';
import { Typography } from '@/components/Typography';
import { InfoTooltipButton, TooltipButton } from '@/components/Tooltip';
import InfoGreen from '@/assets/icons/icon_info_dk_green.svg';

const TAGS_QUERY = gql(`
        query GetCourseTags($category: String!) {
            courseTags(category: $category) {
                id
                name
            }
        }
    `);

const CourseDetails: React.FC = () => {
    const { t } = useTranslation();
    const { image, courseName, setCourseName, description, setDescription, pickedPhoto, setPickedPhoto } = useContext(CreateCourseContext);

    const [maxAttendees, setMaxAttendees] = useState<number | 'custom'>(0);
    const [customMaxAttendees, setCustomMaxAttendees] = useState<number>(0);
    const [category, setCategory] = useState<Course_Category_Enum>(Course_Category_Enum.Revision);

    const SUBJECTS = [...SUBJECTS_MAIN, ...SUBJECTS_MINOR, ...SUBJECTS_RARE];
    type Subject = typeof SUBJECTS[number];
    const [subject, setSubject] = useState<Subject | null>(null);

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [gradeRange, setGradeRange] = useState<[number, number]>([1, 14]);

    const { data, loading: isLoading } = useQuery(TAGS_QUERY, { variables: { category } });

    // prevent user from selecting tags from multiple categories
    useEffect(() => {
        setSelectedTags([]);
    }, [category]);

    return (
        <>
            <Typography variant="h3">{t('course.CourseDate.step.general')}</Typography>
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
            </div>

            <div className="flex flex-col gap-2.5">
                <div className="inline-flex align-baseline gap-1.5">
                    <Label className="text-base">{t('course.CourseDate.step.attendees')}</Label>
                    <InfoTooltipButton tooltipContent="TODO" />
                </div>
                <div className="flex gap-2.5 flex-wrap">
                    {[5, 10, 20, 30, 40, 50, 100].map((item) => (
                        <Button className="flex-grow" key={item} variant={maxAttendees === item ? 'default' : 'outline'} onClick={() => setMaxAttendees(item)}>
                            {item}
                        </Button>
                    ))}
                    <Button variant={maxAttendees === 'custom' ? 'default' : 'outline'} className="flex-grow" onClick={() => setMaxAttendees('custom')}>
                        Eigene
                    </Button>
                </div>
                {maxAttendees === 'custom' && (
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
                            <Button key={s} variant={s === subject ? 'default' : 'outline'} onClick={() => setSubject(s)}>
                                {t(`lernfair.subjects.${s}`)}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/*Tag selection for non-revision courses*/}
            {category && category !== Course_Category_Enum.Revision && (
                <div className="flex flex-col gap-2.5">
                    <div className="inline-flex align-baseline gap-1.5">
                        <Label className="text-base">{t('course.CourseDate.form.tagsLabel')}</Label>
                        <InfoTooltipButton tooltipContent="TODO" />
                    </div>
                    <div className="flex gap-2.5 flex-wrap">
                        {data?.courseTags.map((tag) => (
                            <Button
                                key={tag.id}
                                variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                                onClick={() => {
                                    if (selectedTags.includes(tag.name)) {
                                        setSelectedTags(selectedTags.filter((t) => t !== tag.name));
                                    } else {
                                        setSelectedTags([...selectedTags, tag.name]);
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
                <Dropzone onUpload={(file) => setPickedPhoto && setPickedPhoto(file)} file={pickedPhoto} />
            </div>

            {/*  Grade selection  */}
            <div className="flex flex-col gap-2.5">
                <Label className="text-base">{t('course.CourseDate.form.detailsContent')}</Label>
                <Slider id="gradeSlider" min={1} max={14} value={gradeRange} onValueChange={(range) => setGradeRange([range[0], range[1]])} />
                <Label htmlFor="gradeSlider" className="text-center">
                    {t('course.CourseDate.form.classRange', { minRange: getGradeLabel(gradeRange[0]), maxRange: getGradeLabel(gradeRange[1]) })}
                </Label>
            </div>
        </>
    );
};

export default CourseDetails;

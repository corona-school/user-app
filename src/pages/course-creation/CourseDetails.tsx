import { useState, useContext, useEffect } from 'react';
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

    const [name, setName] = useState<string>(courseName || '');
    const [courseDescription, setCourseDescription] = useState<string>(description || '');
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
                <Label htmlFor="courseCategory">{t('course.CourseDate.form.courseCategory')}</Label>
                <RadioGroup className="px-4" id="courseCategory" value={category} onValueChange={(v) => setCategory(v as Course_Category_Enum)}>
                    <div className="flex gap-x-2 items-center">
                        <RadioGroupItem id="revision" value={Course_Category_Enum.Revision} />
                        <Label htmlFor="revision">{t('course.CourseDate.form.revision')}</Label>
                    </div>
                    <div className="flex gap-x-2 items-center">
                        <RadioGroupItem id="language" value={Course_Category_Enum.Language} />
                        <Label htmlFor="language">{t('course.CourseDate.form.language')}</Label>
                    </div>
                    <div className="flex gap-x-2 items-center">
                        <RadioGroupItem id="focus" value={Course_Category_Enum.Focus} />
                        <Label htmlFor="focus">{t('course.CourseDate.form.focus')}</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col gap-2.5">
                <Label htmlFor="courseName">{t('course.CourseDate.form.courseNameHeadline')}</Label>
                <Input
                    id="courseName"
                    value={name}
                    placeholder={t('course.CourseDate.form.courseNamePlaceholder')}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                />
            </div>

            <div className="flex flex-col gap-2.5">
                <Label htmlFor="courseDescription">{t('course.CourseDate.form.descriptionLabel')}</Label>
                <TextArea
                    id="description"
                    value={courseDescription}
                    placeholder={t('course.CourseDate.form.descriptionPlaceholder')}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className="resize-none h-24 w-full"
                />
            </div>

            <div className="flex flex-col gap-2.5">
                <Label>{t('course.CourseDate.step.attendees')}</Label>
                <div className="flex gap-2.5">
                    {[5, 10, 20, 30, 40, 50, 100].map((item) => (
                        <Button className="w-16" key={item} variant={maxAttendees === item ? 'default' : 'outline'} onClick={() => setMaxAttendees(item)}>
                            {item}
                        </Button>
                    ))}
                    <Button variant={maxAttendees === 'custom' ? 'default' : 'outline'} onClick={() => setMaxAttendees('custom')}>
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
                    <Label>{t('course.CourseDate.form.courseSubjectLabel')}</Label>
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
                    <Label>{t('course.CourseDate.form.tagsLabel')}</Label>
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
                <Label>{t('course.CourseDate.form.coursePhotoLabel')}</Label>
                <Dropzone onUpload={(file) => setPickedPhoto && setPickedPhoto(file)} file={pickedPhoto} />
            </div>

            {/*  Grade selection  */}
            <div className="flex flex-col gap-2.5">
                <Label>{t('course.CourseDate.form.detailsContent')}</Label>
                <Slider id="gradeSlider" min={1} max={14} value={gradeRange} onValueChange={(range) => setGradeRange([range[0], range[1]])} />
                <Label htmlFor="gradeSlider" className="text-center">
                    {t('course.CourseDate.form.classRange', { minRange: getGradeLabel(gradeRange[0]), maxRange: getGradeLabel(gradeRange[1]) })}
                </Label>
            </div>
        </>
    );
};

export default CourseDetails;

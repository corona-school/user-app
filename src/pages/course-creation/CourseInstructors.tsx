import { Label } from '@/components/Label';
import { Button } from '@/components/Button';
import { IconTrash } from '@tabler/icons-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Dispatch, SetStateAction, useState } from 'react';
import { cn } from '@/lib/Tailwind';
import { Combobox } from '@/components/Combobox';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@/gql';
import { InfoTooltipButton } from '@/components/Tooltip';
import { useTranslation } from 'react-i18next';
import { Instructor } from '@/gql/graphql';
import { LFSubCourse } from '@/types/lernfair/Course';
import { Typography } from '@/components/Typography';

interface Props {
    subcourse: LFSubCourse;
    setSubcourse: Dispatch<SetStateAction<LFSubCourse>>;
}

const INSTRUCTORS_QUERY = gql(`
        query otherInstructors($search: String!, $take: Int!) {
            otherInstructors(take: $take, skip: 0, search: $search) {
                id
                firstname
                lastname
                aboutMe
            }
        }
    `);

const CourseInstructors: React.FC<Props> = ({ subcourse, setSubcourse }) => {
    const [searchInstructorsQuery] = useLazyQuery(INSTRUCTORS_QUERY);
    const [searchString, setSearchString] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Instructor[]>([]);
    const { t } = useTranslation();

    const searchInstructors = async (query: string) => {
        setSearchString(query);
        const instructors = await searchInstructorsQuery({ variables: { search: query, take: 10 } });
        if (instructors.data) {
            const rawResults = instructors.data.otherInstructors;
            const results = rawResults.filter((x) => !subcourse.instructors?.some((i) => i.id === x.id) && !subcourse.mentors?.some((m) => m.id === x.id));
            setSearchResults(results);
        }
    };

    const changeRole = (id: number, wasInstructor: boolean, type: 'instructor' | 'mentor') => {
        if ((wasInstructor && type === 'instructor') || (!wasInstructor && type === 'mentor')) return;

        if (wasInstructor) {
            const instructor = subcourse.instructors!.find((i) => i.id === id);
            if (instructor) {
                setSubcourse((s) => ({ ...s, instructors: subcourse.instructors!.filter((i) => i.id !== id) }));
                setSubcourse((s) => ({ ...s, mentors: [...subcourse.mentors!, instructor] }));
            }
        } else {
            const mentor = subcourse.mentors!.find((i) => i.id === id);
            if (mentor) {
                setSubcourse((s) => ({ ...s, mentors: subcourse.mentors!.filter((i) => i.id !== id) }));
                setSubcourse((s) => ({ ...s, instructors: [...subcourse.instructors!, mentor] }));
            }
        }
    };

    const onSearchSelect = (instructor: Instructor) => {
        setSubcourse((s) => ({ ...s, instructors: [...subcourse.instructors!, instructor] }));
        setSearchResults([]); // Clear search results after selection
    };

    const removeManager = (isInstructor: boolean, id: number) => {
        if (isInstructor) {
            setSubcourse((s) => ({ ...s, instructors: subcourse.instructors!.filter((i) => i.id !== id) }));
        } else {
            setSubcourse((s) => ({ ...s, mentors: subcourse.mentors!.filter((i) => i.id !== id) }));
        }
    };

    return (
        <>
            <div className="inline-flex align-baseline gap-1.5">
                <Label>{t(subcourse.allowMentoring ? 'course.CourseDate.form.otherInstructorsMentors' : 'course.CourseDate.form.otherInstructors')}</Label>
                <InfoTooltipButton
                    className="size-4"
                    tooltipContent={t(
                        subcourse.allowMentoring ? 'course.CourseDate.form.otherInstructorsMentorsTooltip' : 'course.CourseDate.form.otherInstructorsTooltip'
                    )}
                />
            </div>
            <Typography className="text-form pb-2 pt-1.5">
                {t(
                    subcourse.allowMentoring
                        ? 'course.CourseDate.form.otherInstructorsMentorsDescription'
                        : 'course.CourseDate.form.otherInstructorsDescription'
                )}
            </Typography>

            <div className="flex flex-col gap-2.5">
                <div className="flex gap-2.5">
                    <Combobox
                        placeholder={t('course.CourseDate.form.searchInstructorsPlaceholder')}
                        className="flex-grow"
                        onSearch={searchInstructors}
                        search={searchString}
                        values={searchResults.map((r) => ({ value: JSON.stringify(r), label: `${r.firstname} ${r.lastname}` }))}
                        onSelect={(v) => onSearchSelect(JSON.parse(v) as Instructor)}
                    />
                </div>

                {[...subcourse.instructors!.map((i) => ({ isInstructor: true, ...i })), ...subcourse.mentors!.map((m) => ({ isInstructor: false, ...m }))].map(
                    (manager) => (
                        <div key={manager.id} className="flex gap-2.5 items-center">
                            <div className="bg-primary-lighter w-full h-11 rounded-md flex items-center px-4 gap-2.5">
                                <span>
                                    {manager.firstname} {manager.lastname}
                                </span>
                                {subcourse.allowMentoring && (
                                    <Select
                                        value={manager.isInstructor ? 'instructor' : 'mentor'}
                                        onValueChange={(v) => changeRole(manager.id!, manager.isInstructor, v as 'mentor' | 'instructor')}
                                    >
                                        <SelectTrigger
                                            id="duration"
                                            className={cn('px-2 h-7 text-white border-0', manager.isInstructor ? 'bg-green-600' : 'bg-blue-600')}
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="instructor">{t('course.CourseDate.form.instructor')}</SelectItem>
                                            <SelectItem value="mentor">{t('course.CourseDate.form.mentor')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                            <Button size="icon" className="flex-shrink-0" onClick={() => manager.id && removeManager(manager.isInstructor, manager.id)}>
                                <IconTrash />
                            </Button>
                        </div>
                    )
                )}
            </div>
        </>
    );
};

export default CourseInstructors;

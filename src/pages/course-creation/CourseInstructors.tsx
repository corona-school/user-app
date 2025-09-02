import { Label } from '@/components/Label';
import { Button } from '@/components/Button';
import { IconTrash } from '@tabler/icons-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { useState } from 'react';
import { cn } from '@/lib/Tailwind';
import { Combobox } from '@/components/Combobox';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@/gql';
import { LFInstructor } from '@/types/lernfair/Course';
import { InfoTooltipButton } from '@/components/Tooltip';
import { useTranslation } from 'react-i18next';

interface Props {
    instructors: LFInstructor[];
    setInstructors: (instructors: LFInstructor[] | ((prev: LFInstructor[]) => LFInstructor[])) => void;
    mentors: LFInstructor[];
    setMentors: (mentors: LFInstructor[] | ((prev: LFInstructor[]) => LFInstructor[])) => void;
}

const INSTRUCTORS_QUERY = gql(`
        query searchInstructors($search: String!, $take: Int!) {
            otherInstructors(take: $take, skip: 0, search: $search) {
                id
                firstname
                lastname
            }
        }
    `);

const CourseInstructors: React.FC<Props> = (props) => {
    const [searchInstructorsQuery] = useLazyQuery(INSTRUCTORS_QUERY);
    const [searchString, setSearchString] = useState<string>('');
    const [searchResults, setSearchResults] = useState<LFInstructor[]>([]);
    const { t } = useTranslation();

    const searchInstructors = async (query: string) => {
        setSearchString(query);
        const instructors = await searchInstructorsQuery({ variables: { search: query, take: 10 } });
        if (instructors.data) {
            const rawResults = instructors.data.otherInstructors.map((i) => ({ id: i.id, firstname: i.firstname, lastname: i.lastname }));
            const results = rawResults.filter((x) => !props.instructors.some((i) => i.id === x.id) && !props.mentors.some((m) => m.id === x.id));
            setSearchResults(results);
        }
    };
    const changeRole = (id: number, wasInstructor: boolean, type: 'instructor' | 'mentor') => {
        if ((wasInstructor && type === 'instructor') || (!wasInstructor && type === 'mentor')) return;

        if (wasInstructor) {
            const instructor = props.instructors.find((i) => i.id === id);
            if (instructor) {
                props.setInstructors((prev: LFInstructor[]) => prev.filter((i) => i.id !== id));
                props.setMentors((prev: LFInstructor[]) => [...prev, instructor]);
            }
        } else {
            const mentor = props.mentors.find((m) => m.id === id);
            if (mentor) {
                props.setMentors((prev: LFInstructor[]) => prev.filter((m) => m.id !== id));
                props.setInstructors((prev: LFInstructor[]) => [...prev, mentor]);
            }
        }
    };

    const onSearchSelect = (instructor: LFInstructor) => {
        props.setInstructors([...props.instructors, instructor]);
        setSearchResults([]); // Clear search results after selection
    };

    const removeManager = (isInstructor: boolean, id: number) => {
        if (isInstructor) {
            props.setInstructors((prev: LFInstructor[]) => prev.filter((i) => i.id !== id));
        } else {
            props.setMentors((prev: LFInstructor[]) => prev.filter((m) => m.id !== id));
        }
    };

    return (
        <div>
            <div className="inline-flex align-baseline gap-1.5">
                <Label className="text-base">{t('course.CourseDate.form.otherInstructors')}</Label>
                <InfoTooltipButton tooltipContent="TODO" />
            </div>
            <p>{t('course.CourseDate.form.otherInstructorsDescription')}</p>

            <div className="flex flex-col gap-2.5">
                <div className="flex gap-2.5">
                    <Combobox
                        placeholder={t('course.CourseDate.form.searchInstructorsPlaceholder')}
                        className="flex-grow"
                        onSearch={searchInstructors}
                        search={searchString}
                        values={searchResults.map((r) => ({ value: JSON.stringify(r), label: `${r.firstname} ${r.lastname}` }))}
                        onSelect={(v) => onSearchSelect(JSON.parse(v) as LFInstructor)}
                    />
                </div>

                {[...props.instructors.map((i) => ({ isInstructor: true, ...i })), ...props.mentors.map((m) => ({ isInstructor: false, ...m }))].map(
                    (manager) => (
                        <div key={manager.id} className="flex gap-2.5 items-center">
                            <div className="bg-primary-lighter w-full h-11 rounded-md flex items-center px-4 gap-2.5">
                                <span>
                                    {manager.firstname} {manager.lastname}
                                </span>
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
                            </div>
                            <Button size="icon" className="flex-shrink-0" onClick={() => manager.id && removeManager(manager.isInstructor, manager.id)}>
                                <IconTrash />
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default CourseInstructors;

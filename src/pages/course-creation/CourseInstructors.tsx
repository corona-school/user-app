import { Label } from '@/components/Label';
import { Button } from '@/components/Button';
import { IconCirclePlus, IconSettingsFilled, IconTrash, IconTrashFilled, IconTrashX } from '@tabler/icons-react';
import { Input } from '@/components/Input';
import { Instructor } from '@/gql/graphql';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/Dropdown';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { useState } from 'react';
import { cn } from '@/lib/Tailwind';
import { Combobox } from '@/components/Combobox';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@/gql';
import { LFInstructor } from '@/types/lernfair/Course';
import { InfoTooltipButton } from '@/components/Tooltip';

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
    const [searchInstructorsQuery, { data, loading }] = useLazyQuery(INSTRUCTORS_QUERY);
    const [searchString, setSearchString] = useState<string>('');
    const [searchResults, setSearchResults] = useState<LFInstructor[]>([]);
    const [instructorToAdd, setInstructorToAdd] = useState<number | null>(null);
    const searchInstructors = async (query: string) => {
        setSearchString(query);
        const instructors = await searchInstructorsQuery({ variables: { search: searchString, take: 10 } });
        if (instructors.data) {
            setSearchResults(instructors.data.otherInstructors.map((i) => ({ id: i.id, firstname: i.firstname, lastname: i.lastname })));
        }
    };
    const addInstructor = (query: string) => {};
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
    return (
        <div>
            <div className="inline-flex align-baseline gap-1.5">
                <Label className="text-base">Kursleitung</Label>
                <InfoTooltipButton tooltipContent="TODO" />
            </div>
            <p>Füge weitere Kursleiter oder Mentoren hinzu</p>

            <div className="flex flex-col gap-2.5">
                <div className="flex gap-2.5">
                    <Combobox
                        placeholder="Namen suchen oder E-Mail eingeben"
                        className="flex-grow"
                        onSearch={searchInstructors}
                        search={searchString}
                        values={searchResults.map((r) => ({ value: String(r.id), label: `${r.firstname} ${r.lastname}` }))}
                        onSelect={(v) => setInstructorToAdd(Number(v))}
                    />
                    <Button variant="default" size="icon">
                        <IconCirclePlus />
                    </Button>
                </div>

                {[...props.instructors.map((i) => ({ isInstructor: true, ...i })), ...props.mentors.map((m) => ({ isInstructor: false, ...m }))].map(
                    (instructor) => (
                        <div key={instructor.id} className="flex gap-2.5 items-center">
                            <div className="bg-primary-lighter w-full h-11 rounded-md flex items-center px-4 gap-2.5">
                                <span>
                                    {instructor.firstname} {instructor.lastname}
                                </span>
                                <Select
                                    value={instructor.isInstructor ? 'instructor' : 'mentor'}
                                    onValueChange={(v) => changeRole(instructor.id!, instructor.isInstructor, v as 'mentor' | 'instructor')}
                                >
                                    <SelectTrigger
                                        id="duration"
                                        className={cn('px-2 h-7 text-white border-0', instructor.isInstructor ? 'bg-green-600' : 'bg-blue-600')}
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="instructor">Kursleiter</SelectItem>
                                        <SelectItem value="mentor">Mentor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button size="icon" className="flex-shrink-0">
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

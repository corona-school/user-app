import { Label } from '@/components/Label';
import { Button } from '@/components/Button';
import { IconCirclePlus, IconSettingsFilled, IconTrash, IconTrashFilled, IconTrashX } from '@tabler/icons-react';
import { Input } from '@/components/Input';
import { Instructor } from '@/gql/graphql';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/Dropdown';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { useState } from 'react';
import { cn } from '@/lib/Tailwind';

interface Props {
    instructors: Instructor[];
    mentors: Instructor[];
}

const Instructors: React.FC<Props> = (props) => {
    const [people, setPeople] = useState<(Instructor & { isInstructor: boolean })[]>([
        ...props.instructors.map((i) => ({ isInstructor: true, ...i })),
        ...props.mentors.map((m) => ({ isInstructor: false, ...m })),
    ]);

    const updateInstructor = (id: number, type: 'instructor' | 'mentor') => {
        setPeople((prev) => {
            return prev.map((p) => {
                if (p.id === id) {
                    return { ...p, isInstructor: type === 'instructor' };
                }
                return p;
            });
        });
    };
    return (
        <div>
            <Label>Kursleitung</Label>
            <p>Füge weitere Kursleiter oder Mentoren hinzu</p>

            <div className="flex flex-col gap-2.5">
                <div className="flex gap-2.5">
                    <Input type="text" placeholder="E-Mail" className="flex-grow" />
                    <Button variant="default" size="icon">
                        <IconCirclePlus />
                    </Button>
                </div>

                {people.map((instructor) => (
                    <div key={instructor.id} className="flex gap-1.5 items-center">
                        <div className="bg-primary-lighter w-full h-11 rounded-md flex items-center px-4 gap-2">
                            <span>
                                {instructor.firstname} {instructor.lastname}
                            </span>
                            <Select
                                value={instructor.isInstructor ? 'instructor' : 'mentor'}
                                onValueChange={(v) => updateInstructor(instructor.id, v as 'mentor' | 'instructor')}
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
                ))}
            </div>
        </div>
    );
};

export default Instructors;

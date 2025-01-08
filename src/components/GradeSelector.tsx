import IconTagList from '../widgets/IconTagList';
import { getGradeLabel } from '../Utility';
import { EnumSelector } from './EnumSelector';
import { Typography } from './Typography';

interface GradeTagProps {
    grade: number;
    isSelected?: boolean;
    onSelect?: (grade: number) => void;
}

export const GradeTag = ({ grade, isSelected, onSelect }: GradeTagProps) => {
    return (
        <IconTagList initial={isSelected} textIcon={grade === 14 ? 'A' : `${grade}`} text={getGradeLabel(grade)} onPress={() => onSelect && onSelect(grade)} />
    );
};

interface GradeSelectorProps {
    grade?: number;
    onGradeChange: (grade: number) => void;
    omitGrades?: number[];
    className?: string;
}

const gradesLabelsMap = new Array(14).fill(0).reduce((map, _, i) => {
    const grade = i + 1;
    return { ...map, [`${grade}`]: grade };
}, {});
const gradesIconsMap = new Array(14).fill(0).reduce((map, _, i) => {
    const grade = i + 1;
    return { ...map, [`${grade}`]: grade === 14 ? 'A' : `${grade}` };
}, {});

const Selector = EnumSelector(
    gradesLabelsMap,
    (grade) => (grade < 14 ? ['lernfair.schoolclass', { class: grade }] : 'inTraining'),
    (k) => (
        <div className="flex items-center justify-center size-8 rounded-full bg-white border-[0.5px] border-gray-100">
            <Typography className="text-base font-bold text-center">{gradesIconsMap[k]}</Typography>
        </div>
    )
);

export function GradeSelector({ grade, onGradeChange, omitGrades = [], className }: GradeSelectorProps) {
    return <Selector value={grade} setValue={onGradeChange} className={className} />;
}

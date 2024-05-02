import { Column, useTheme } from 'native-base';
import IconTagList from '../widgets/IconTagList';
import { getGradeLabel } from '../Utility';

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
}

export function GradeSelector({ grade, onGradeChange, omitGrades = [] }: GradeSelectorProps) {
    const { space } = useTheme();

    return (
        <>
            {new Array(14).fill(0).map((_, i) => {
                const value = i + 1;
                const isOmitted = omitGrades.includes(value);
                if (isOmitted) return null;
                return (
                    <Column mb={space['0.5']} mr={space['0.5']}>
                        <GradeTag grade={value} isSelected={grade === value} onSelect={onGradeChange} />
                    </Column>
                );
            })}
        </>
    );
}

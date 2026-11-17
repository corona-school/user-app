import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Slider } from '@/components/Slider';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { SingleSubject } from '@/types/subject';
import { getGradeLabel } from '@/Utility';
import { SubjectIcon } from '@/widgets/SubjectSelector';
import { IconCopyPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface GradeRange {
    min: number;
    max: number;
}

interface SubjectGradeCardProps {
    subject: SingleSubject;
    range: GradeRange;
    onRangeChange: (range: GradeRange) => void;
    onCopyToAll?: (range: GradeRange) => void;
    isCopyDisabled?: boolean;
    /** Total number of pupils waiting for this subject. Hidden if not provided. */
    pupilsWaiting?: number;
    /** Number of pupils waiting within the selected range. Only shown if `pupilsWaiting` is set. */
    pupilsWaitingInRange?: number;
    className?: string;
}

export const SubjectGradeCard = ({
    subject,
    range,
    onRangeChange,
    onCopyToAll,
    isCopyDisabled,
    pupilsWaiting,
    pupilsWaitingInRange,
    className,
}: SubjectGradeCardProps) => {
    const { t } = useTranslation();

    const copyButton = (buttonClassName: string) =>
        onCopyToAll && (
            <Button
                className={cn('font-normal', buttonClassName)}
                size="xs"
                variant="ghost"
                leftIcon={<IconCopyPlus size={16} />}
                onClick={() => onCopyToAll(range)}
                disabled={isCopyDisabled}
            >
                Für alle Fächer übernehmen
            </Button>
        );

    return (
        <div className={cn('md:w-[420px] md:max-w-[560px] flex-[1_1_420px] rounded-md p-4 pb-2 md:pb-4 gap-2 border border-accent-dark', className)}>
            <div className="flex justify-between">
                <div className="flex gap-x-[14px] mb-6 min-w-0">
                    <div className="w-10 h-10 shrink-0 bg-accent-medium rounded-full flex items-center justify-center">
                        <SubjectIcon subject={subject} className="rounded-full size-6 flex-shrink-0" />
                    </div>
                    <div className="w-full min-w-0">
                        <Typography variant="subtle" className="font-semibold leading-1 mb-1 truncate">
                            {t(`lernfair.subjects.${subject}` as unknown as TemplateStringsArray)}
                        </Typography>
                        {!!pupilsWaiting && (
                            <Badge className="shadow-none text-[12px] font-normal px-[7px] h-5">{t('peopleWaiting', { count: pupilsWaiting })}</Badge>
                        )}
                    </div>
                </div>
                {copyButton('hidden md:flex')}
            </div>
            <div className="mb-4">
                <Typography variant="subtle" className="mb-3 text-primary-midnight">
                    {getGradeLabel(range.min)} - {getGradeLabel(range.max)}{' '}
                    {!!pupilsWaiting && <span>({t('peopleWaiting', { count: pupilsWaitingInRange ?? 0 })})</span>}
                </Typography>
                <Slider min={1} max={14} onValueChange={([min, max]) => onRangeChange({ min, max })} value={[range.min, range.max]} />
            </div>
            {onCopyToAll && <div className="md:hidden inline-block py-2 h-auto w-auto">{copyButton('')}</div>}
        </div>
    );
};

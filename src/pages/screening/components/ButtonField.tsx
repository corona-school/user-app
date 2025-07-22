import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { cn } from '@/lib/Tailwind';
import { IconPencil } from '@tabler/icons-react';

interface ButtonFieldProps {
    onClick: () => void;
    children: React.ReactNode;
    label?: string;
    className?: string;
    disabled?: boolean;
}

export const ButtonField = ({ onClick, children, label, disabled, className }: ButtonFieldProps) => {
    return (
        <>
            {label ? <Label>{label}</Label> : <></>}
            <Button variant="input" size="input" onClick={onClick} className={cn(className)} disabled={disabled}>
                <span className="w-full flex items-center justify-between min-w-[200px]">
                    <span>{children}</span> <IconPencil className="text-gray-400" />
                </span>
            </Button>
        </>
    );
};

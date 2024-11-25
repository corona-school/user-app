import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { cn } from '@/lib/Tailwind';
import { IconPencil } from '@tabler/icons-react';

interface ButtonFieldProps {
    onClick: () => void;
    children: React.ReactNode;
    label: string;
    className?: string;
}

export const ButtonField = ({ onClick, children, label, className }: ButtonFieldProps) => {
    return (
        <>
            <Label>{label}</Label>
            <Button variant="input" size="input" onClick={onClick} className={cn(className)}>
                <span className="w-full flex items-center justify-between min-w-[200px]">
                    <span>{children}</span> <IconPencil className="text-gray-400" />
                </span>
            </Button>
        </>
    );
};

import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { useEffect, useState } from 'react';

interface KnowsUsSelectProps {
    type: 'pupil' | 'student';
    value: string;
    customValue: string;
    onChange: (values: { value: string; customValue: string }) => void;
    className?: string;
}

const pupilOptions = [
    'Persönliche Empfehlung: Familie & Freunde',
    'Jugendzentrum',
    'Tafel',
    'Schule / Lehrkraft',
    'TikTok',
    'Instagram',
    'Print (Flyer, Poster etc.)',
    'Suchmaschine (Google)',
    'Website',
    'Sonstiges',
];

const studentOptions = [
    'Persönliche Empfehlung/Freund:innen',
    'Ehrenamtsbörse',
    'Instagram',
    'Tafel',
    'LinkedIn',
    'Suchmaschine',
    'Jugendzentrum',
    'Print (Flyer, Poster,…)',
    'Presse',
    'Stipendium',
    'Unternehmenskooperation',
    'Universität',
    'Von Schüler:in zu Helfer:in',
    'Sonstiges',
];

export const KnowsUsSelect = ({ value: knowsFrom, customValue: customKnowsFrom, onChange, type, className }: KnowsUsSelectProps) => {
    const [errorMessage, setErrorMessage] = useState('');
    const options = type === 'pupil' ? pupilOptions : studentOptions;

    useEffect(() => {
        const isCustom = !!knowsFrom && !options.includes(knowsFrom);
        if (isCustom) {
            handleOnCustomKnowsFromChanges(knowsFrom);
        }
    }, [knowsFrom, customKnowsFrom]);

    const handleOnCustomKnowsFromChanges = (newCustom: string) => {
        setErrorMessage(newCustom.length > 60 ? 'Bitte halte deine Antwort kürzer als 60 Zeichen' : '');
        onChange({ value: 'Sonstiges', customValue: newCustom });
    };

    return (
        <>
            <Label>Kennt Lern-Fair durch:</Label>
            <Select value={knowsFrom} onValueChange={(newValue) => onChange({ value: newValue, customValue: customKnowsFrom })}>
                <SelectTrigger className={cn('h-10 w-full', className)} placeholder="Bitte wähle eine Antwort aus" aria-label="Knows us from">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {knowsFrom === 'Sonstiges' && (
                <>
                    <Input
                        value={customKnowsFrom}
                        onChange={(e) => handleOnCustomKnowsFromChanges(e.target.value)}
                        placeholder="Bitte gebe hier eine Antwort ein"
                        maxLength={60}
                        className={className}
                    />
                    {errorMessage && (
                        <Typography variant="sm" className="text-destructive">
                            {errorMessage}
                        </Typography>
                    )}
                </>
            )}
        </>
    );
};

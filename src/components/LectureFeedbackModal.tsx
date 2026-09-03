import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Toggle } from '@/components/Toggle';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { IconSend } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Input } from './Input';
import { Typography } from './Typography';

const SUBMIT_FEEDBACK_MUTATION = gql(`
    mutation submitFeedback($feedbackId: Float!, $rating: Float!, $tags: [String!]!) {
        lectureFeedbackSubmit(id: $feedbackId, data:  {
           rating: $rating,
           tags: $tags
        }) {
            id
            status
        }
    }
`);

const RATING_TAGS = {
    1: ['Unvorbereitet', 'Unfreundlich', 'Unmotiviert', 'Unaufmerksam', 'Desinteressiert', 'Ungeduldig'],
    2: ['Wenig vorbereitet', 'Eher unfreundlich', 'Wenig motiviert', 'Eher unaufmerksam', 'Wenig interessiert', 'Eher ungeduldig'],
    3: ['Teilweise vorbereitet', 'Neutral', 'Teilweise motiviert', 'Aufmerksam', 'Interessiert', 'Geduldig'],
    4: ['Gut vorbereitet', 'Freundlich', 'Motiviert', 'Aufmerksam', 'Engagiert', 'Sehr geduldig'],
    5: ['Gut vorbereitet', 'Freundlich', 'Hilfsbereit', 'Motiviert', 'Geduldig', 'Engagiert'],
};

type Rating = 1 | 2 | 3 | 4 | 5;

interface StudentScreeningModalProps extends BaseModalProps {
    feedbackId: number;
    learningPartnerName: string;
}

export const LectureFeedbackModal = ({ feedbackId, onOpenChange, isOpen, learningPartnerName }: StudentScreeningModalProps) => {
    const [rating, setRating] = useState<Rating>();
    const { t } = useTranslation();
    const [submitFeedback] = useMutation(SUBMIT_FEEDBACK_MUTATION);
    const [tags, setTags] = useState<string[]>([]);
    const [comment, setComment] = useState('');

    const handleOnTagToggle = (tag: string) => {
        if (tags.includes(tag)) {
            setTags(tags.filter((t) => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    };

    const handleOnSubmit = async () => {
        await submitFeedback({ variables: { feedbackId, rating: rating!, tags } });
        toast.success('Dankeschön!', { description: 'Dein Feedback wurde gesendet' });
        onOpenChange(false);
    };

    useEffect(() => {
        setTags([]);
    }, [rating]);

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} size="sm">
            <ModalHeader>
                <ModalTitle>Wie war euer Meeting?</ModalTitle>
            </ModalHeader>
            <div>
                <Typography className="mb-4 md:mb-8">
                    Das Feedback geht nur an Lern-Fair. Dein*e Lernpartner*in {learningPartnerName} kann es nicht sehen.
                </Typography>
                <div className="flex gap-x-1">
                    <Toggle
                        className="h-[52px] w-[58.8px] md:h-[52px] md:w-[99.2px] hover:bg-yellow-100 text-3xl"
                        pressed={rating === 1}
                        onPressedChange={() => setRating(1)}
                    >
                        😔
                    </Toggle>
                    <Toggle
                        className="h-[52px] w-[58.8px] md:h-[52px] md:w-[99.2px] hover:bg-yellow-100 text-3xl"
                        pressed={rating === 2}
                        onPressedChange={() => setRating(2)}
                    >
                        🤔
                    </Toggle>
                    <Toggle
                        className="h-[52px] w-[58.8px] md:h-[52px] md:w-[99.2px] hover:bg-yellow-100 text-3xl"
                        pressed={rating === 3}
                        onPressedChange={() => setRating(3)}
                    >
                        😐
                    </Toggle>
                    <Toggle
                        className="h-[52px] w-[58.8px] md:h-[52px] md:w-[99.2px] hover:bg-yellow-100 text-3xl"
                        pressed={rating === 4}
                        onPressedChange={() => setRating(4)}
                    >
                        🙂
                    </Toggle>
                    <Toggle
                        className="h-[52px] w-[58.8px] md:h-[52px] md:w-[99.2px] hover:bg-yellow-100 text-3xl"
                        pressed={rating === 5}
                        onPressedChange={() => setRating(5)}
                    >
                        🤩
                    </Toggle>
                </div>
            </div>
            {rating && (
                <div>
                    <div className="flex flex-wrap gap-1">
                        {RATING_TAGS[rating].map((tag) => (
                            <Toggle
                                className="rounded-full py-[13px] px-[16px]"
                                variant="outline-accent"
                                key={tag}
                                pressed={tags.includes(tag)}
                                onPressedChange={() => handleOnTagToggle(tag)}
                            >
                                {tag}
                            </Toggle>
                        ))}
                        <Toggle
                            className="rounded-full py-[13px] px-[16px]"
                            variant="outline-accent"
                            pressed={tags.includes('Sonstiges')}
                            onPressedChange={() => handleOnTagToggle('Sonstiges')}
                        >
                            Sonstiges
                        </Toggle>
                    </div>
                    {tags.includes('Sonstiges') && (
                        <Input className="w-full mt-4" placeholder="Dein Kommentar" errorMessageClassName="hidden" value={comment} onChangeText={setComment} />
                    )}
                </div>
            )}
            <ModalFooter mobileLayout="column">
                <Button className="w-full lg:w-[130px]" variant="outline" onClick={() => onOpenChange(false)}>
                    Überspringen
                </Button>
                <Button className="w-full lg:w-[180px]" rightIcon={<IconSend size={16} />} disabled={!rating} onClick={handleOnSubmit}>
                    Feedback senden
                </Button>
            </ModalFooter>
        </Modal>
    );
};

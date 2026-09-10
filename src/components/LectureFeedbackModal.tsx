import { Button } from '@/components/Button';
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
import { useLottie } from 'lottie-react';
import SadAnimation from '@/assets/animations/sad-animation.json';
import ThinkAnimation from '@/assets/animations/think-animation.json';
import CryAnimation from '@/assets/animations/cry-animation.json';
import HappyAnimation from '@/assets/animations/happy-animation.json';
import StarAnimation from '@/assets/animations/star-animation.json';
import { cn } from '@/lib/Tailwind';

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
    onFeedbackSubmitted?: () => Promise<void>;
}

export const LectureFeedbackModal = ({ feedbackId, onOpenChange, isOpen, onFeedbackSubmitted }: StudentScreeningModalProps) => {
    const [rating, setRating] = useState<Rating>();
    const cry = useLottie({ src: CryAnimation });
    const sad = useLottie({ src: SadAnimation });
    const think = useLottie({ src: ThinkAnimation });
    const happy = useLottie({ src: HappyAnimation });
    const star = useLottie({ src: StarAnimation });

    const { t } = useTranslation();
    const [submitFeedback] = useMutation(SUBMIT_FEEDBACK_MUTATION);
    const [tags, setTags] = useState<string[]>([]);
    const [comment, setComment] = useState('');

    const hasOtherTag = tags.some((tag) => tag.startsWith('Sonstiges'));

    const handleRatingChange = (newRating: Rating) => {
        setRating(newRating);

        const animations = {
            1: cry,
            2: sad,
            3: think,
            4: happy,
            5: star,
        };

        animations[newRating].animationItem?.goToAndPlay(0, true);
    };

    const handleOnTagToggle = (tag: string) => {
        if (tags.includes(tag) || (tag.startsWith('Sonstiges') && hasOtherTag)) {
            setTags(tags.filter((t) => t !== tag && !t.startsWith('Sonstiges')));
        } else {
            setTags([...tags, tag]);
        }
    };

    const handleOnChangeComment = (newComment: string) => {
        setComment(newComment);
        setTags((prevTags) => {
            return prevTags.map((tag) => (tag.startsWith('Sonstiges') ? `Sonstiges: ${newComment}` : tag));
        });
    };

    const handleOnSubmit = async () => {
        await submitFeedback({ variables: { feedbackId, rating: rating!, tags } });
        toast.success('Dankeschön!', { description: 'Dein Feedback wurde gesendet' });
        onOpenChange(false);
        await onFeedbackSubmitted?.();
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
                <Typography className="mb-4 md:mb-8">Das Feedback geht nur an Lern-Fair. Dein*e Lernpartner*in kann es nicht sehen.</Typography>
                <div className="flex gap-x-1">
                    <Toggle
                        className={cn(
                            'h-[52px] w-[58.8px] md:h-[52px] md:w-[99.2px] text-3xl transition-transform duration-200 data-[state=on]:bg-transparent hover:bg-transparent',
                            rating === 1 && 'scale-150 z-10'
                        )}
                        pressed={rating === 1}
                        onPressedChange={() => handleRatingChange(1)}
                    >
                        <div ref={cry.setDisplayRef} className="h-[39px]"></div>
                    </Toggle>
                    <Toggle
                        className={cn(
                            'h-[52px] w-[58.8px] md:h-[52px] md:w-[99.2px] text-3xl transition-transform duration-200 data-[state=on]:bg-transparent hover:bg-transparent',
                            rating === 2 && 'scale-150 z-10'
                        )}
                        pressed={rating === 2}
                        onPressedChange={() => handleRatingChange(2)}
                    >
                        <div ref={sad.setDisplayRef} className="h-[39px]"></div>
                    </Toggle>
                    <Toggle
                        className={cn(
                            'h-[52px] w-[58.8px] md:h-[52px] md:w-[99.2px] text-3xl transition-transform duration-200 data-[state=on]:bg-transparent hover:bg-transparent',
                            rating === 3 && 'scale-150 z-10'
                        )}
                        pressed={rating === 3}
                        onPressedChange={() => handleRatingChange(3)}
                    >
                        <div ref={think.setDisplayRef} className="h-[39px]"></div>
                    </Toggle>
                    <Toggle
                        className={cn(
                            'h-[52px] w-[58.8px] md:h-[52px] md:w-[99.2px] text-3xl transition-transform duration-200 data-[state=on]:bg-transparent hover:bg-transparent',
                            rating === 4 && 'scale-150 z-10'
                        )}
                        pressed={rating === 4}
                        onPressedChange={() => handleRatingChange(4)}
                    >
                        <div ref={happy.setDisplayRef} className="h-[39px]"></div>
                    </Toggle>
                    <Toggle
                        className={cn(
                            'h-[52px] w-[58.8px] md:h-[52px] md:w-[99.2px] text-3xl transition-transform duration-200 data-[state=on]:bg-transparent hover:bg-transparent',
                            rating === 5 && 'scale-150 z-10'
                        )}
                        pressed={rating === 5}
                        onPressedChange={() => handleRatingChange(5)}
                    >
                        <div ref={star.setDisplayRef} className="h-[39px]"></div>
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
                            pressed={hasOtherTag}
                            onPressedChange={() => handleOnTagToggle('Sonstiges')}
                        >
                            Sonstiges
                        </Toggle>
                    </div>
                    {hasOtherTag && (
                        <Input
                            className="w-full mt-4"
                            placeholder="Dein Kommentar"
                            errorMessageClassName="hidden"
                            value={comment}
                            onChangeText={handleOnChangeComment}
                        />
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

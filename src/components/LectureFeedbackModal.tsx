import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Toggle } from '@/components/Toggle';
import { gql } from '@/gql';
import { useUserType } from '@/hooks/useApollo';
import { useMutation } from '@apollo/client';
import { IconSend } from '@tabler/icons-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TFuncKey, useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Typography } from './Typography';
import { useLottie } from 'lottie-react';
import SadAnimation from '@/assets/animations/sad-animation.json';
import ThinkAnimation from '@/assets/animations/think-animation.json';
import CryAnimation from '@/assets/animations/cry-animation.json';
import HappyAnimation from '@/assets/animations/happy-animation.json';
import StarAnimation from '@/assets/animations/star-animation.json';
import { cn } from '@/lib/Tailwind';
import { TextArea } from './TextArea';

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

const LECTURE_FEEDBACK_TAG_KEYS = [
    'learning_progress',
    'relationship_tone',
    'pupil_motivation',
    'emotional_safety',
    'tech_reliability',
    'learning_environment',
    'language_barriers',
    'support_needed',
    'pupil_preparedness',
    'punctuality_time',
    'pupil_wellbeing',
] as const;

type Rating = 1 | 2 | 3 | 4 | 5;

const MAX_COMMENT_ROWS = 5;
const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';

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

    const { t, i18n } = useTranslation();
    const userType = useUserType();
    const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_MEDIA_QUERY).matches);
    const commentRef = useRef<HTMLTextAreaElement>(null);
    const [submitFeedback] = useMutation(SUBMIT_FEEDBACK_MUTATION);
    const [tags, setTags] = useState<string[]>([]);
    const [comment, setComment] = useState('');

    const labelField = userType === 'pupil' ? 'labelForPupil' : 'labelForStudent';
    const germanT = i18n.getFixedT('de');
    const ratingTags = rating
        ? LECTURE_FEEDBACK_TAG_KEYS.flatMap((key) => {
              const path = `lectureFeedback.tags.${key}.${rating}.${labelField}` as TFuncKey;
              return i18n.exists(path) ? [{ key, label: t(path) as string }] : [];
          })
        : [];

    const otherTag = germanT('lectureFeedback.otherTag') as string;
    const hasOtherTag = tags.some((tag) => tag.startsWith(otherTag));

    useEffect(() => {
        const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
        const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
        mediaQuery.addEventListener('change', onChange);
        return () => mediaQuery.removeEventListener('change', onChange);
    }, []);

    useLayoutEffect(() => {
        const el = commentRef.current;
        if (!el) return;

        const minRows = isDesktop ? 1 : 2;
        el.rows = minRows;
        el.style.height = 'auto';
        const paddingY = parseFloat(getComputedStyle(el).paddingTop) + parseFloat(getComputedStyle(el).paddingBottom);
        const borderY = el.offsetHeight - el.clientHeight;
        const lineHeight = (el.clientHeight - paddingY) / minRows;
        const maxHeight = lineHeight * MAX_COMMENT_ROWS + paddingY + borderY;
        const contentHeight = el.scrollHeight + borderY;
        el.style.height = `${Math.min(contentHeight, maxHeight)}px`;
        el.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
    }, [comment, hasOtherTag, isDesktop]);

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
        if (tags.includes(tag) || (tag.startsWith(otherTag) && hasOtherTag)) {
            setTags(tags.filter((t) => t !== tag && !t.startsWith(otherTag)));
        } else {
            setTags([...tags, tag]);
        }
    };

    const handleOnChangeComment = (newComment: string) => {
        setComment(newComment);
        setTags((prevTags) => {
            return prevTags.map((tag) => (tag.startsWith(otherTag) ? `${otherTag}: ${newComment}` : tag));
        });
    };

    const handleOnSubmit = async () => {
        await submitFeedback({ variables: { feedbackId, rating: rating!, tags } });
        toast.success(t('lectureFeedback.submitSuccessTitle'), { description: t('lectureFeedback.submitSuccessDescription') });
        onOpenChange(false);
        await onFeedbackSubmitted?.();
    };

    useEffect(() => {
        setTags([]);
    }, [rating]);

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} size="sm">
            <ModalHeader>
                <ModalTitle>{t('lectureFeedback.title')}</ModalTitle>
            </ModalHeader>
            <div>
                <Typography className="mb-4 md:mb-8">{t('lectureFeedback.disclaimer')}</Typography>
                <div className="flex gap-x-1 justify-center">
                    <Toggle
                        className={cn(
                            'h-[52px] w-[58.8px] md:h-[52px] md:w-[81.6px] text-3xl transition-transform duration-200 data-[state=on]:bg-transparent hover:bg-transparent',
                            rating === 1 && 'scale-150 z-10'
                        )}
                        pressed={rating === 1}
                        onPressedChange={() => handleRatingChange(1)}
                    >
                        <div ref={cry.setDisplayRef} className="h-[39px]"></div>
                    </Toggle>
                    <Toggle
                        className={cn(
                            'h-[52px] w-[58.8px] md:h-[52px] md:w-[81.6px] text-3xl transition-transform duration-200 data-[state=on]:bg-transparent hover:bg-transparent',
                            rating === 2 && 'scale-150 z-10'
                        )}
                        pressed={rating === 2}
                        onPressedChange={() => handleRatingChange(2)}
                    >
                        <div ref={sad.setDisplayRef} className="h-[39px]"></div>
                    </Toggle>
                    <Toggle
                        className={cn(
                            'h-[52px] w-[58.8px] md:h-[52px] md:w-[81.6px] text-3xl transition-transform duration-200 data-[state=on]:bg-transparent hover:bg-transparent',
                            rating === 3 && 'scale-150 z-10'
                        )}
                        pressed={rating === 3}
                        onPressedChange={() => handleRatingChange(3)}
                    >
                        <div ref={think.setDisplayRef} className="h-[39px]"></div>
                    </Toggle>
                    <Toggle
                        className={cn(
                            'h-[52px] w-[58.8px] md:h-[52px] md:w-[81.6px] text-3xl transition-transform duration-200 data-[state=on]:bg-transparent hover:bg-transparent',
                            rating === 4 && 'scale-150 z-10'
                        )}
                        pressed={rating === 4}
                        onPressedChange={() => handleRatingChange(4)}
                    >
                        <div ref={happy.setDisplayRef} className="h-[39px]"></div>
                    </Toggle>
                    <Toggle
                        className={cn(
                            'h-[52px] w-[58.8px] md:h-[52px] md:w-[81.6px] text-3xl transition-transform duration-200 data-[state=on]:bg-transparent hover:bg-transparent',
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
                        {ratingTags.map(({ key, label }) => (
                            <Toggle
                                className="rounded-full py-[13px] px-[16px]"
                                variant="outline-accent"
                                key={key}
                                pressed={tags.includes(key)}
                                onPressedChange={() => handleOnTagToggle(key)}
                            >
                                {label}
                            </Toggle>
                        ))}
                        <Toggle
                            className="rounded-full py-[13px] px-[16px]"
                            variant="outline-accent"
                            pressed={hasOtherTag}
                            onPressedChange={() => handleOnTagToggle(otherTag)}
                        >
                            {t('lectureFeedback.otherTag')}
                        </Toggle>
                    </div>
                    {hasOtherTag && (
                        <TextArea
                            ref={commentRef}
                            rows={isDesktop ? 1 : 2}
                            className="w-full mt-4 resize-none min-h-0"
                            placeholder={t('lectureFeedback.commentPlaceholder')}
                            errorMessageClassName="hidden"
                            value={comment}
                            onChangeText={handleOnChangeComment}
                        />
                    )}
                </div>
            )}
            <ModalFooter mobileLayout="column">
                <Button className="w-full lg:w-[130px]" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('lectureFeedback.skip')}
                </Button>
                <Button className="w-full lg:w-[180px]" rightIcon={<IconSend size={16} />} disabled={!rating} onClick={handleOnSubmit}>
                    {t('lectureFeedback.submit')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

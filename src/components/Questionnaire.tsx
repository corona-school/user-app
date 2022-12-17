import { Box, Button, Flex, Heading, Image, Progress, Text, useBreakpointValue, useTheme, VStack } from 'native-base';
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserType } from '../hooks/useApollo';
import useLernfair from '../hooks/useLernfair';
import useRegistration from '../hooks/useRegistration';
import CenterLoadingSpinner from './CenterLoadingSpinner';
import QuestionnaireSelectionView from './questionnaire/QuestionnaireSelectionView';
import { ISelectionItem } from './questionnaire/SelectionItem';

export type Question = {
    id: string;
    label?: string;
    question?: string;
    type: 'selection';
    text?: string;
    required?: boolean;
};

export type QuestionnaireViewType = string | 'normal' | 'large';
export interface SelectionQuestion extends Question {
    imgRootPath: string;
    minSelections?: number;
    maxSelections?: number;
    options: ISelectionItem[];
    viewType?: QuestionnaireViewType;
}

export type Answer = any;

export interface ObjectAnswer<T = boolean | number> extends Answer {
    [key: string]: T;
}

type IQuestionnaireContext = {
    questions: Question[];
    currentQuestion: Question;
    setQuestions?: Dispatch<SetStateAction<Question[]>>;
    currentIndex: number;
    setCurrentIndex?: Dispatch<SetStateAction<number>>;
    answers: {
        [key: string]: Answer;
    };
    setAnswers?: Dispatch<
        SetStateAction<{
            [key: string]: Answer;
        }>
    >;
};

export const QuestionnaireContext = createContext<IQuestionnaireContext>({
    questions: [],
    currentIndex: 0,
    answers: {},
    currentQuestion: {
        label: '',
        question: '',
        type: 'selection',
        id: '',
    },
});

export type IQuestionnaire = {
    onQuestionnaireFinished: (answers: { [key: string]: ObjectAnswer }) => any;
    onPressItem?: (data?: any) => any;
    onQuestionChanged?: (question: Question) => any;
    modifySelectionQuestionBeforeRender?: () => any;
    modifyQuestionBeforeNext?: () => any;
    modifyAnswerBeforeNext?: (answer: ObjectAnswer, question: Question) => any;
    disableNavigation?: boolean;
};

const Questionnaire: React.FC<IQuestionnaire> = ({
    onQuestionnaireFinished,
    onPressItem,
    modifyQuestionBeforeNext,
    modifyAnswerBeforeNext,
    disableNavigation,
}) => {
    const { t } = useTranslation();
    const { space, sizes } = useTheme();

    const userType = useUserType();

    const { currentIndex, questions, answers, setCurrentIndex, currentQuestion } = useContext(QuestionnaireContext);

    /**
     * check if index is not at the tail end of questions
     * if it is, end the questionnaire
     * else move on after modifying the question
     * if the prop exists
     */
    const next = useCallback(() => {
        modifyAnswerBeforeNext && modifyAnswerBeforeNext(answers[currentQuestion.id], currentQuestion);

        if (currentIndex >= questions.length - 1) {
            onQuestionnaireFinished && onQuestionnaireFinished(answers);
        } else {
            modifyQuestionBeforeNext && modifyQuestionBeforeNext();
            setCurrentIndex && setCurrentIndex((prev) => prev + 1);
        }
    }, [answers, currentIndex, currentQuestion, modifyAnswerBeforeNext, modifyQuestionBeforeNext, onQuestionnaireFinished, questions.length, setCurrentIndex]);

    // check if answer is valid when question type is selection
    const isValidSelectionAnswer: (answer: ObjectAnswer) => boolean = useCallback(
        (answer: ObjectAnswer) => {
            const question = currentQuestion as SelectionQuestion;
            const answercount = Object.values(answer || {}).filter((a) => !!a).length;

            return answercount >= (question.minSelections || 1) && (question.maxSelections ? answercount <= question.maxSelections : true);
        },
        [currentQuestion]
    );

    // check if current answer is appropriate for corresponding type
    const isValidAnswer: boolean = useMemo(() => {
        const currentAnswer = answers[currentQuestion.id];

        let isValid = false;
        if (!currentAnswer) return false;
        if (currentQuestion.type === 'selection') {
            isValid = isValidSelectionAnswer(currentAnswer);
        }

        return isValid;
    }, [answers, currentQuestion, isValidSelectionAnswer]);

    // skip one question
    const skip = useCallback(() => {
        delete answers[currentQuestion.id];
        next();
    }, [answers, currentQuestion.id, next]);

    // go one question back
    const back = useCallback(() => {
        setCurrentIndex && setCurrentIndex((prev) => prev - 1);
    }, [setCurrentIndex]);

    const ContainerWidth = useBreakpointValue({
        base: '90%',
        lg: sizes['formsWidth'],
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    if (questions.length === 0) return <CenterLoadingSpinner />;
    return (
        <Flex flex="1" pb={space['1']}>
            <Box paddingY={space['2']} bgColor="primary.500" justifyContent="center" alignItems="center" position="relative" borderBottomRadius={8}>
                <Image
                    alt="Lernfair"
                    position="absolute"
                    zIndex="-1"
                    borderBottomRadius={15}
                    width="100%"
                    height="100%"
                    source={{
                        uri: require('../assets/images/globals/lf-bg.png'),
                    }}
                />
                <Heading>{t(`registration.questions.${userType}.${currentQuestion.id}.label`)}</Heading>
            </Box>
            <Box paddingX={space['1']} mt={space['4']} width={ContainerWidth} marginX="auto">
                <Progress value={((currentIndex + 1) / questions.length) * 100} h="3.5" _filledTrack={{ backgroundColor: 'primary.900' }} />
                <Text fontWeight={600} mt={space['0.5']}>
                    {t('questionnaire.step')} {currentIndex + 1} / {questions.length}
                </Text>
            </Box>
            <Flex flex="1" overflowY={'scroll'} width={ContainerWidth} marginX="auto" marginBottom={space['2']}>
                {currentQuestion.type === 'selection' && (
                    <QuestionnaireSelectionView
                        currentQuestion={currentQuestion as SelectionQuestion}
                        prefill={answers[currentQuestion.id]}
                        userType={userType || 'pupil'}
                        onPressSelection={onPressItem}
                    />
                )}
            </Flex>
            <VStack paddingX={space['2']} space={space['0.5']} width={ContainerWidth} marginX="auto">
                <Button isDisabled={disableNavigation || !isValidAnswer} onPress={next}>
                    {t('questionnaire.btn.next')}
                </Button>

                {!currentQuestion.required && (
                    <Button isDisabled={disableNavigation} onPress={skip} variant={'outline'}>
                        {t('questionnaire.btn.skip')}
                    </Button>
                )}

                {currentIndex > 0 && (
                    <Button isDisabled={disableNavigation} onPress={back} variant={'link'}>
                        {t('questionnaire.btn.back')}
                    </Button>
                )}
            </VStack>
        </Flex>
    );
};

export default Questionnaire;

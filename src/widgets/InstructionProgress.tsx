import { View, Text, Row, Circle, Divider, useTheme } from 'native-base';
import { Pressable } from 'react-native';

type Instruction = {
    label: string;
    title?: string;
};

type Props = {
    instructions?: Instruction[];
    currentIndex?: number;
    isDark?: boolean;
    canPressSteps?: boolean;
    goToStep?: (index: number) => void;
};

const InstructionProgress: React.FC<Props> = ({ isDark, instructions, currentIndex = 0, goToStep, canPressSteps }) => {
    const { space, sizes } = useTheme();
    return (
        <View>
            <Row>
                {instructions?.map((instruction, index) => {
                    const isLast = index >= instructions.length - 1;
                    const isActive = index === currentIndex;

                    const circlebgColor = (isActive = false, isDark = false) => {
                        if (isDark) {
                            if (isActive) {
                                return 'primary.400';
                            } else {
                                return 'primary.800';
                            }
                        } else {
                            if (isActive) {
                                return 'primary.400';
                            } else {
                                return 'transparent';
                            }
                        }
                    };

                    const circleLabelColor = (isActive = false, isDark = false) => {
                        if (isDark) {
                            if (isActive) {
                                return 'white';
                            } else {
                                return 'primary.900';
                            }
                        } else {
                            if (isActive) {
                                return 'primary.900';
                            } else {
                                return 'primary.400';
                            }
                        }
                    };

                    return (
                        <Row
                            key={`instruction-label-${index}`}
                            alignItems={'center'}
                            flex={isActive ? 1 : 0}
                            flexBasis={sizes['6'] + 'px'}
                            mr={!isLast ? space['0.5'] : 0}
                        >
                            <Pressable disabled={!canPressSteps} onPress={() => goToStep && goToStep(index)}>
                                <Circle bg={circlebgColor(isActive, isDark)} borderColor="primary.grey" borderWidth={isActive ? 0 : 1} size={sizes['1.5']}>
                                    <Text bold color={isActive ? 'lightText' : 'primary.grey'}>
                                        {index + 1}
                                    </Text>
                                </Circle>
                            </Pressable>
                            {isActive && (
                                <Text color={circleLabelColor(isActive, isDark)} bold ml={space['0.5']}>
                                    {instruction.label}
                                </Text>
                            )}
                            {isActive && !isLast && (
                                <View flex="1" px={space['1']}>
                                    <Divider borderColor={'primary.grey'} />
                                </View>
                            )}
                        </Row>
                    );
                })}
            </Row>
        </View>
    );
};
export default InstructionProgress;

import { Text, ChevronRightIcon, useTheme, Pressable } from 'native-base';
import DataRow from '../components/DataRow';

type Props = {
    label: string;
    value?: string;
    onPress?: () => any;
    isDisabled?: boolean;
    hideArrowIcon?: boolean;
};

const EditDataRow: React.FC<Props> = ({ label, value, onPress, isDisabled, hideArrowIcon }) => {
    const { space } = useTheme();
    const textColor = isDisabled ? 'gray.300' : 'darkText';
    return (
        <Pressable onPress={onPress} isDisabled={isDisabled}>
            <DataRow>
                <Text flex="1" fontWeight={600} color={textColor}>
                    {label}
                </Text>
                {value && (
                    <Text marginRight={space['0.5']} color={textColor}>
                        {value}
                    </Text>
                )}
                {hideArrowIcon ? <></> : <ChevronRightIcon color={textColor} />}
            </DataRow>
        </Pressable>
    );
};
export default EditDataRow;

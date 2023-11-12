import { ChevronDownIcon, ChevronUpIcon, Heading, Pressable, Row, useTheme, VStack } from 'native-base';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    isOpen?: boolean;
    children: ReactNode | ReactNode[];
    header?: ReactNode | ReactNode[];
    onPressHeader?: () => any;
    textColor?: string;
};

const CollapsibleContent: React.FC<Props> = ({ children, isOpen, textColor, header, onPressHeader }) => {
    const { space, colors } = useTheme();
    const { t } = useTranslation();

    const iconColor = useMemo(() => (isOpen ? 'lightText' : 'primary.900'), [isOpen]);

    return (
        <VStack>
            {header || (
                <Pressable onPress={onPressHeader}>
                    <Row alignItems="center" borderBottomWidth="1" borderColor={colors['primary']['500']}>
                        <Heading fontSize="md" pt={space['1']} pb={space['0.5']} flex="1" color={textColor}>
                            {t('further_details')}
                        </Heading>
                        {isOpen ? <ChevronUpIcon color={iconColor} /> : <ChevronDownIcon color={iconColor} />}
                    </Row>
                </Pressable>
            )}
            {isOpen && children}
        </VStack>
    );
};
export default CollapsibleContent;

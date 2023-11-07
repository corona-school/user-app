import { Box, Column, Row, useTheme } from 'native-base';
import IconTagList from './IconTagList';
import { useTranslation } from 'react-i18next';

export const YesNoSelector = ({
    initialYes,
    initialNo,
    onPressYes,
    onPressNo,
    align,
}: {
    initialYes?: boolean;
    initialNo?: boolean;
    onPressYes?: () => void;
    onPressNo?: () => void;
    align?: 'center' | 'left' | 'right' | undefined;
}) => {
    const { space } = useTheme();
    const { t } = useTranslation();

    return (
        <Box alignItems="center" marginTop={space['0.5']}>
            <Row w="100%" space={space['1']} justifyContent={align ?? 'center'}>
                <Column flex={1} maxW="300px">
                    <IconTagList iconPath={`lf-yes.svg`} initial={initialYes} variant="selection" text={t('yes')} onPress={onPressYes} />
                </Column>
                <Column flex={1} maxW="300px">
                    <IconTagList iconPath={`lf-no.svg`} initial={initialNo} variant="selection" text={t('no')} onPress={onPressNo} />
                </Column>
            </Row>
        </Box>
    );
};

import { Row, Box, VStack, useTheme } from 'native-base';
import { ReactNode } from 'react';
import Card from '../components/Card';
import ProfilAvatar from './ProfilAvatar';

type Props = {
    children: ReactNode | ReactNode[];
    avatar?: string;
    button?: ReactNode | ReactNode[];
    variant?: 'normal' | 'dark';
};

const LeftImageCard: React.FC<Props> = ({ children, avatar, button, variant = 'normal' }) => {
    const { space } = useTheme();

    return (
        <Card flexibleWidth variant={variant} isFullHeight={false}>
            <Row paddingLeft="8px">
                {avatar && (
                    <Box w={100} padding={avatar ? '16px' : ''}>
                        <ProfilAvatar image={avatar} size="lg" />
                    </Box>
                )}
                <VStack paddingX={space['0.5']} paddingY={space['1']} flex="1" space={space['0.5']}>
                    {children}
                </VStack>
            </Row>

            {button && (
                <Row display="block" paddingLeft={space['1']} paddingRight={space['1']} paddingBottom={space['1']}>
                    {button}
                </Row>
            )}
        </Card>
    );
};
export default LeftImageCard;
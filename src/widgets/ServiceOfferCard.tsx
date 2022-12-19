import { Text, Box, useTheme, Image, Link } from 'native-base';
import { ReactNode } from 'react';
import Card from '../components/Card';

type Props = {
    title: string;
    content?: string;
    icon?: ReactNode | ReactNode[];
    image?: string;
    href?: string;
};

const ServiceOfferCard: React.FC<Props> = ({ title, content, icon, image, href }) => {
    const { space } = useTheme();
    return (
        <Link href={href}>
            <Card flexibleWidth={icon ? false : true}>
                {image && (
                    <Image
                        position="absolute"
                        w="100%"
                        h="100%"
                        alt={title}
                        source={{
                            uri: image,
                        }}
                    />
                )}
                <Box background="primary.darkTranslucent" h={icon ? 220 : 120} padding={space['1']} justifyContent={icon ? 'center' : 'flex-end'}>
                    {icon && <Box mb={3}>{icon}</Box>}

                    <Text color="lightText" fontSize="md" bold mb={1}>
                        {title}
                    </Text>

                    {content && (
                        <Text color="lightText" fontSize="sm">
                            {content}
                        </Text>
                    )}
                </Box>
            </Card>
        </Link>
    );
};
export default ServiceOfferCard;

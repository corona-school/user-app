import { View, Flex, Link, useTheme } from 'native-base';

import CommunityUser from '../widgets/CommunityUser';
import Card from '../components/Card';

type Props = {
    variant?: 'normal' | 'card';
    onPressLink?: () => any;
    username: string;
    usernamesize?: string;
    usernameweight?: string;
    avatar?: string;
    avatarsize?: 'xs' | 'md';
};

const PersonListing: React.FC<Props> = ({ variant, onPressLink, username, avatar, avatarsize, usernamesize, usernameweight }) => {
    const { space } = useTheme();

    const isCardVariant = variant === 'card';
    const Wrapper = isCardVariant ? Card : View;

    return (
        <Wrapper flexibleWidth>
            <Link
                onPress={onPressLink}
                paddingLeft={isCardVariant ? space['1.5'] : ''}
                paddingRight={isCardVariant ? space['1.5'] : ''}
                paddingBottom={isCardVariant ? space['1.5'] : ''}
                justifyContent={isCardVariant ? 'center' : ''}
            >
                <Flex flexDirection="row" alignItems="center" marginRight={variant === 'normal' ? space['1'] : ''}>
                    <CommunityUser
                        align={variant === 'normal' ? 'row' : 'column'}
                        avatar={avatar}
                        avatarsize={avatarsize}
                        name={username}
                        usernameweight={usernameweight}
                        usernamesize={usernamesize}
                    />
                </Flex>
            </Link>
        </Wrapper>
    );
};
export default PersonListing;

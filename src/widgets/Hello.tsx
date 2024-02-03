import { Heading } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useUser } from '../hooks/useApollo';

type Props = {};

const Hello: React.FC<Props> = () => {
    const { t } = useTranslation();
    const user = useUser();
    return (
        <Heading color={'#fff'}>
            {t('hallo')} {user?.firstname}!
        </Heading>
    );
};
export default Hello;

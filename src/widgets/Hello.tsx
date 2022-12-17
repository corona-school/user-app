import { gql } from './../gql';
import { useQuery } from '@apollo/client';
import { Heading } from 'native-base';
import { useTranslation } from 'react-i18next';

type Props = {};

const Hello: React.FC<Props> = () => {
    const { t } = useTranslation();
    const { data, loading } = useQuery(
        gql(`
        query GetFirstname {
            me {
                firstname
            }
        }
    `)
    );

    if (loading) return <></>;
    return (
        <Heading color={'#fff'}>
            {t('hallo')} {data?.me?.firstname}!
        </Heading>
    );
};
export default Hello;

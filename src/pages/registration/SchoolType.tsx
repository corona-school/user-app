import { Box, Button, Column, Heading, Row, useTheme, VStack } from 'native-base';
import { useContext, useState } from 'react';
import { RegistrationContext } from '../Registration';
import IconTagList from '../../widgets/IconTagList';
import { schooltypes } from '../../types/lernfair/SchoolType';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { SchoolType as SchoolTypeEnum } from '../../gql/graphql';
import AlertMessage from '../../widgets/AlertMessage';

const SchoolType: React.FC = () => {
    const { school, setSchool, onPrev, onNext } = useContext(RegistrationContext);
    const { space } = useTheme();
    const { t } = useTranslation();
    usePageTitle('Lern-Fair - Registrierung: Schulform');

    const [showTypeMissing, setShowTypeMissing] = useState<boolean>(false);

    const handleNext = () => {
        if (!school?.schooltype) {
            setShowTypeMissing(true);
        } else {
            onNext();
        }
    };

    return (
        <VStack flex="1" marginTop={space['1']}>
            <Heading>{t(`registration.steps.schoolType.subtitle`)}</Heading>
            <Row flexWrap="wrap" w="100%" mt={space['1']} marginBottom={space['1']}>
                {schooltypes.map((type, i) => (
                    <Column key={i} mb={space['0.5']} mr={space['0.5']}>
                        <IconTagList
                            initial={school?.schooltype === type.key}
                            text={type.label}
                            onPress={() => {
                                setSchool({ ...school, schooltype: type.key as SchoolTypeEnum });
                                if (showTypeMissing) {
                                    setShowTypeMissing(false);
                                }
                            }}
                            iconPath={`schooltypes/icon_${type.key}.svg`}
                        />
                    </Column>
                ))}
            </Row>
            {showTypeMissing && <AlertMessage content={t('registration.hint.schoolTypeSelectionMissing')} />}
            <Box alignItems="center" marginTop={space['2']}>
                <Row space={space['1']} justifyContent="center">
                    <Column width="100%">
                        <Button width="100%" height="100%" variant="ghost" colorScheme="blueGray" onPress={onPrev}>
                            {t('back')}
                        </Button>
                    </Column>
                    <Column width="100%">
                        <Button width="100%" onPress={handleNext}>
                            {t('next')}
                        </Button>
                    </Column>
                </Row>
            </Box>
        </VStack>
    );
};
export default SchoolType;

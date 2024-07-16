import { Box, Button, Column, Heading, Row, useTheme, VStack } from 'native-base';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationContext, TRAINEE_GRADE } from '../Registration';
import { GradeSelector } from '../../components/GradeSelector';
import { usePageTitle } from '../../hooks/usePageTitle';

const SchoolClass: React.FC = () => {
    const { schoolClass, setSchoolClass, schoolType, setSchoolType, onNext, onPrev } = useContext(RegistrationContext);
    const { space } = useTheme();
    const { t } = useTranslation();
    usePageTitle('Lern-Fair - Registrierung: Klasse');

    const handleOnSchoolClassChange = (newClass: number) => {
        setSchoolClass(newClass);
        if (!schoolType) {
            setSchoolType(newClass === TRAINEE_GRADE ? 'berufsschule' : 'grundschule');
        }
    };

    return (
        <VStack flex="1" marginTop={space['1']}>
            <Heading>{t(`registration.steps.grade.subtitle`)}</Heading>
            <Row flexWrap="wrap" w="100%" mt={space['1']} marginBottom={space['1']}>
                <GradeSelector grade={schoolClass} onGradeChange={handleOnSchoolClassChange} />
            </Row>
            <Box alignItems="center" marginTop={space['2']}>
                <Row space={space['1']} justifyContent="center">
                    <Column width="100%">
                        <Button width="100%" height="100%" variant="ghost" colorScheme="blueGray" onPress={onPrev}>
                            {t('back')}
                        </Button>
                    </Column>
                    <Column width="100%">
                        <Button width="100%" onPress={onNext}>
                            {t('next')}
                        </Button>
                    </Column>
                </Row>
            </Box>
        </VStack>
    );
};
export default SchoolClass;

import { Box, Button, Column, Heading, Row, useTheme, VStack } from 'native-base';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationContext } from '../Registration';
import { GradeSelector } from '../../components/GradeSelector';

const SchoolClass: React.FC = () => {
    const { schoolClass, setSchoolClass, schoolType, setSchoolType, setCurrentIndex } = useContext(RegistrationContext);
    const { space } = useTheme();
    const { t } = useTranslation();

    const handleOnSchoolClassChange = (newClass: number) => {
        setSchoolClass(newClass);
        if (!schoolType) {
            setSchoolType(newClass === 14 ? 'berufsschule' : 'grundschule');
        }
    };

    return (
        <VStack flex="1" marginTop={space['1']}>
            <Heading>{t(`registration.steps.2.subtitle`)}</Heading>
            <Row flexWrap="wrap" w="100%" mt={space['1']} marginBottom={space['1']}>
                <GradeSelector grade={schoolClass} onGradeChange={handleOnSchoolClassChange} />
            </Row>
            <Box alignItems="center" marginTop={space['2']}>
                <Row space={space['1']} justifyContent="center">
                    <Column width="100%">
                        <Button
                            width="100%"
                            height="100%"
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                                setCurrentIndex(1);
                            }}
                        >
                            {t('back')}
                        </Button>
                    </Column>
                    <Column width="100%">
                        <Button width="100%" onPress={() => setCurrentIndex(3)}>
                            {t('next')}
                        </Button>
                    </Column>
                </Row>
            </Box>
        </VStack>
    );
};
export default SchoolClass;

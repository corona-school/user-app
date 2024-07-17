import { Input, Pressable, VStack, Text, HStack, FormControl, Box, Flex, Row, Column, Button } from 'native-base';
import { useContext, useState } from 'react';
import Check from '../../assets/icons/check.svg';
import { useTranslation } from 'react-i18next';
import { RegistrationContext } from '../Registration';
import useSchoolSearch, { getSchoolState, getSchoolType, ISchool } from '../../lib/Schools';

const School = () => {
    const { t } = useTranslation();

    const { onNext, onPrev, school, setSchool, setUserState, setSchoolType } = useContext(RegistrationContext);
    const [name, setName] = useState(school?.name ?? '');
    const { schools, resetResults } = useSchoolSearch({ name });

    const handleOnSelect = (school: ISchool) => {
        setName(school.name);
        const schoolState = getSchoolState(school) ?? '';
        const schoolType = getSchoolType(school) ?? '';
        setSchool({ ...school, hasValidSchoolState: !!schoolState, hasValidSchoolType: !!schoolType });
        setUserState(schoolState);
        setSchoolType(schoolType);
        resetResults();
    };

    const handleOnChangeText = (value: string) => {
        setName(value);
        setSchool(undefined);
    };

    const handleOnNext = () => {
        if (!school) {
            setSchool({ id: '', name, city: '', hasValidSchoolState: false, hasValidSchoolType: false, school_type: '', zip: '' });
            setSchoolType('');
            setUserState('');
        }
        onNext();
    };

    const hasSelection = school && school.name === name;

    return (
        <VStack alignSelf="flex-start" w="100%" mt={5}>
            <HStack>
                <Flex flexDirection={{ base: 'column', lg: 'row' }} paddingY="0.5" w="100%">
                    <FormControl w="100%">
                        <FormControl.Label>{t('registration.steps.school.subtitle')}</FormControl.Label>
                        <Input w="100%" value={name} onChangeText={handleOnChangeText} placeholder="z.B Erich-Kästner-Schule" variant="outline" />
                        <FormControl.HelperText>{t('registration.steps.school.helperText')}</FormControl.HelperText>
                    </FormControl>
                    {hasSelection && (
                        <Box ml={{ base: 0, lg: 2 }} display="flex" justifyContent="center">
                            <Text color="success.500" display="flex" alignItems="center">
                                <Check color="green" /> {t('registration.steps.school.schoolFound')}
                            </Text>
                        </Box>
                    )}
                </Flex>
            </HStack>
            <VStack space={4} mt={4} h={{ base: '400px', md: '300px' }} overflowY="scroll">
                {!hasSelection &&
                    name &&
                    schools.map((school) => (
                        <Pressable
                            key={school.id}
                            w="100%"
                            justifyItems="flex-start"
                            borderWidth="0.5"
                            borderColor="primary.500"
                            _hover={{
                                backgroundColor: 'primary.100',
                                borderColor: 'primary.900',
                            }}
                            p={4}
                            borderRadius={4}
                            onPress={() => handleOnSelect(school)}
                        >
                            <Text color="primary.900">
                                {school.name}, {school.zip}, {school.city}
                            </Text>
                        </Pressable>
                    ))}
            </VStack>
            <Box alignItems="center" marginTop={2}>
                <Row space={1} justifyContent="center">
                    <Column width="100%">
                        <Button width="100%" height="100%" variant="ghost" colorScheme="blueGray" onPress={onPrev}>
                            {t('back')}
                        </Button>
                    </Column>
                    <Column width="100%">
                        <Button width="100%" onPress={handleOnNext}>
                            {t('next')}
                        </Button>
                    </Column>
                </Row>
            </Box>
        </VStack>
    );
};

export default School;

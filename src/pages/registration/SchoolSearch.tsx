import { Input, Pressable, VStack, Text, HStack, FormControl, Box, Flex, Row, Column, Button, useTheme, Spinner } from 'native-base';
import { useContext, useEffect, useState } from 'react';
import Check from '../../assets/icons/check_filled.svg';
import Search from '../../assets/icons/search.svg';
import CheckOutlined from '../../assets/icons/check_outlined.svg';
import { useTranslation } from 'react-i18next';
import { RegistrationContext } from '../Registration';
import useSchoolSearch from '../../hooks/useExternalSchoolSearch';
import { ExternalSchoolSearch } from '../../gql/graphql';
import { usePageTitle } from '../../hooks/usePageTitle';

const SchoolSearch = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { onNext, onPrev, school, setSchool } = useContext(RegistrationContext);
    const [name, setName] = useState(school?.name ?? '');
    const { schools, isLoading } = useSchoolSearch({ name, skip: school?.name === name });
    const [resultType, setResultType] = useState<'found' | 'not-found' | 'none'>('none');
    usePageTitle('Lern-Fair - Registrierung: Schulname');

    const handleOnSelect = (school: ExternalSchoolSearch) => {
        setSchool({ ...school, hasPredefinedState: !!school.state, hasPredefinedType: !!school.schooltype });
        setResultType('found');
        setName(school.name);
    };

    const handleOnChangeText = (value: string) => {
        setName(value);
        setSchool(undefined);
    };

    const handleOnNext = () => {
        if (!school && !!name.trim()) {
            setSchool({ name: name.trim() });
        }
        onNext();
    };

    useEffect(() => {
        if (!school?.id) {
            setResultType(name.length > 3 && !isLoading && !schools.length ? 'not-found' : 'none');
        }
    }, [name, isLoading, schools, school?.id]);

    const showList = (name && !isLoading) || !!school?.id;

    return (
        <VStack alignSelf="flex-start" w="100%" mt={5}>
            <HStack>
                <Flex flexDirection={{ base: 'column', lg: 'row' }} paddingY="0.5" w="100%">
                    <FormControl w="100%">
                        <FormControl.Label>{t('registration.steps.school.subtitle')}</FormControl.Label>
                        <Input
                            InputLeftElement={<Search color={colors.primary[900]} style={{ marginLeft: '10px' }} />}
                            w="100%"
                            value={name}
                            onChangeText={handleOnChangeText}
                            placeholder="z.B Erich-Kästner-Schule"
                            variant="outline"
                        />
                        <FormControl.HelperText>{t('registration.steps.school.helperText')}</FormControl.HelperText>
                    </FormControl>
                    {resultType !== 'none' && (
                        <Box ml={{ base: 0, lg: 2 }} display="flex" justifyContent="center">
                            <Text mt={{ base: 2, lg: 0 }} display="flex" alignItems="center">
                                {resultType === 'found' && (
                                    <>
                                        <Check color="green" style={{ marginRight: 5 }} />
                                        {t('registration.steps.school.schoolFound')}
                                    </>
                                )}
                                {resultType === 'not-found' && (
                                    <>
                                        <CheckOutlined color="green" style={{ marginRight: 5 }} />
                                        {t('registration.steps.school.otherSchoolFound')}
                                    </>
                                )}
                            </Text>
                        </Box>
                    )}
                </Flex>
            </HStack>
            <VStack space={4} mt={4} maxH={{ base: '420px', lg: '330px' }} overflowY="scroll">
                {isLoading && <Spinner />}
                {showList &&
                    schools.map((school) => (
                        <Pressable
                            key={school.id}
                            w="100%"
                            justifyItems="flex-start"
                            borderWidth="0.5"
                            borderColor={'primary.500'}
                            background={'white'}
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

export default SchoolSearch;

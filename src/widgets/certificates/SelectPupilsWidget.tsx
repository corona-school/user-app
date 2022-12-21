import { gql, useQuery } from '@apollo/client';
import { Text, useTheme, VStack, Button, Heading } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { LFMatch } from '../../types/lernfair/Match';
import { RequestCertificateContext } from '../../pages/RequestCertificate';
import Card from '../../components/Card';
import CardOverlay from '../../components/CardOverlay';
import { Pressable } from 'react-native';

type Props = {
    onNext: () => any;
};

const SelectPupilsWidget: React.FC<Props> = ({ onNext }) => {
    const { space } = useTheme();
    const [_selections, setSelections] = useState<string[]>([]);
    const { setState } = useContext(RequestCertificateContext);

    const { data, loading } = useQuery(gql`
        query GetPupilsForCertificate {
            me {
                student {
                    subjectsFormatted {
                        name
                    }
                    matches {
                        subjectsFormatted {
                            name
                        }
                        pupil {
                            id
                            firstname
                            lastname
                        }
                    }
                }
            }
        }
    `);

    const next = useCallback(() => {
        if (!data?.me?.student?.matches) return [];
        const selections: LFMatch[] | undefined = _selections?.map((id: string) => {
            return data.me.student.matches.find((match: LFMatch) => match.pupil.id === id);
        });
        if (!selections) return;
        setState((prev) => ({ ...prev, pupilMatches: selections }));
        onNext();
    }, [_selections, data?.me?.student?.matches, onNext, setState]);

    if (loading) return <CenterLoadingSpinner />;

    return (
        <VStack space={space['1']}>
            <Text>Bei welchen Schüler:innen möchtest du eine Bescheinigung beantragen?</Text>

            <VStack space={space['1']}>
                {data?.me?.student?.matches?.map((match: LFMatch) => {
                    const isSelected = _selections.includes(match.pupil.id);
                    return (
                        <CardOverlay selected={isSelected}>
                            <Pressable
                                onPress={() => {
                                    if (isSelected) {
                                        setSelections((prev) => prev.filter((id) => id !== match.pupil.id));
                                    } else {
                                        setSelections((prev) => [...prev, match.pupil.id]);
                                    }
                                }}
                            >
                                <Card padding={space['1']} flexibleWidth>
                                    <VStack space={['0.5']}>
                                        <Heading>{match.pupil.firstname}</Heading>
                                        <Text>Bescheinigung beantragen</Text>
                                    </VStack>
                                </Card>
                            </Pressable>
                        </CardOverlay>
                    );
                })}
            </VStack>

            <Button isDisabled={_selections.length === 0} onPress={next}>
                Weiter
            </Button>
        </VStack>
    );
};
export default SelectPupilsWidget;

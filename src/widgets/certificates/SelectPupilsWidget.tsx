import { useQuery } from '@apollo/client';
import { Text, useTheme, VStack, Button, Heading } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { LFMatch } from '../../types/lernfair/Match';
import { RequestCertificateContext } from '../../pages/RequestCertificate';
import Card from '../../components/Card';
import CardOverlay from '../../components/CardOverlay';
import { Pressable } from 'react-native';
import { gql } from '../../gql';
import { Match } from '../../gql/graphql';

type Props = {
    onNext: () => any;
};

const SelectPupilsWidget: React.FC<Props> = ({ onNext }) => {
    const { space } = useTheme();
    const { setState } = useContext(RequestCertificateContext);

    const { data, loading } = useQuery(
        gql(`
        query GetPupilsForCertificate {
            me {
                student {
                    subjectsFormatted {
                        name
                    }
                    matches {
                        uuid
                        createdAt
                        subjectsFormatted {
                            name
                        }
                        pupil {
                            firstname
                            lastname
                        }
                    }
                }
            }
        }
    `)
    );

    const [selections, setSelections] = useState<
        (Pick<Match, 'uuid' | 'subjectsFormatted' | 'createdAt'> & { pupil: { firstname?: string | null; lastname?: string | null } })[]
    >([]);

    const next = useCallback(() => {
        setState((prev) => ({ ...prev, pupilMatches: selections }));
        onNext();
    }, [selections, data?.me?.student?.matches, onNext, setState]);

    if (loading) return <CenterLoadingSpinner />;

    return (
        <VStack space={space['1']}>
            <Text>Bei welchen Schüler:innen möchtest du eine Bescheinigung beantragen?</Text>

            <VStack space={space['1']}>
                {data?.me?.student?.matches?.map((match) => {
                    const isSelected = selections.includes(match);
                    return (
                        <CardOverlay selected={isSelected}>
                            <Pressable
                                onPress={() => {
                                    if (isSelected) {
                                        setSelections((prev) => prev.filter((it) => it !== match));
                                    } else {
                                        setSelections((prev) => [...prev, match]);
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

            <Button isDisabled={selections.length === 0} onPress={next}>
                Weiter
            </Button>
        </VStack>
    );
};
export default SelectPupilsWidget;

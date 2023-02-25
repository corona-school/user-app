import { gql } from './../gql';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Text, VStack, Button, Flex, useTheme, Row, Column, Heading, Modal } from 'native-base';
import { useMemo } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import Tag from '../components/Tag';
import { LFTag } from '../types/lernfair/Course';

type Props = {
    isOpen?: boolean;
    onClose: () => any;
    selections: LFTag[];
    onSelectTag: (tag: LFTag) => any;
    onDeleteTag: (index: number) => any;
};

const Tags: React.FC<Props> = ({ isOpen, onClose, selections, onSelectTag, onDeleteTag }) => {
    const { space } = useTheme();
    const { t } = useTranslation();

    const { data, loading: isLoading } = useQuery(
        gql(`
        query GetCourseTags {
            courseTags(category: "revision") {
                id
                name
            }
        }
    `)
    );

    const unselectedTags = useMemo(() => data?.courseTags.filter((tag: LFTag) => !selections.includes(tag)), [data?.courseTags, selections]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Tags wählen</Modal.Header>
                <Modal.Body>
                    {!isLoading && (
                        <VStack marginX={space['1']} space={space['1']}>
                            <Heading>Ausgewählte Tags</Heading>
                            <Row flex="1" flexWrap={'wrap'}>
                                {selections.map((tag: LFTag, index: number) => (
                                    <TagItem tag={tag} onPress={() => onDeleteTag(index)} />
                                ))}
                            </Row>
                            <VStack space={space['1']}>
                                <Heading>Weitere Tags</Heading>
                                <Row flex="1" flexWrap={'wrap'}>
                                    {(data &&
                                        data?.courseTags.length > 0 &&
                                        unselectedTags?.map((tag: LFTag) => <TagItem tag={tag} onPress={() => onSelectTag(tag)} />)) || (
                                        <Flex flex="1" justifyContent="center" alignItems="center">
                                            <Text>Keine Tags gefunden</Text>
                                        </Flex>
                                    )}
                                </Row>
                            </VStack>
                        </VStack>
                    )}
                    {isLoading && <CenterLoadingSpinner />}
                </Modal.Body>
                <Modal.Footer>
                    <Row space={space['1']}>
                        <Button onPress={onClose}>{t('ok')}</Button>
                    </Row>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};
export default Tags;

const TagItem: React.FC<{ tag: LFTag; onPress: () => any }> = ({ tag, onPress }) => {
    const { space } = useTheme();

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Column mr={space['0.5']}>
                <Tag text={tag.name} />
            </Column>
        </TouchableWithoutFeedback>
    );
};

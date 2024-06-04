import { gql } from './../gql';
import { useMutation } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Text, VStack, useTheme, useToast, Radio, Button, TextArea, Modal, HStack } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useApollo, { useUserType } from '../hooks/useApollo';
import { switchLanguage } from '../I18n';

type Props = {
    isOpen: boolean;
    onCloseModal: () => any;
};

export const SwitchLanguageModal: React.FC<Props> = ({ isOpen, onCloseModal }) => {
    const { space } = useTheme();

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <Modal.Content>
                <VStack>
                    <Modal.CloseButton />
                    <Modal.Header>Sprache wechseln / Choose language</Modal.Header>
                </VStack>
                <VStack padding={space['1']} space={space['1']}>
                    <Button
                        onPress={() => {
                            switchLanguage('de');
                            onCloseModal();
                        }}
                    >
                        Deutsch
                    </Button>
                    <Button
                        onPress={() => {
                            switchLanguage('en');
                            onCloseModal();
                        }}
                    >
                        English
                    </Button>
                    <Button
                        onPress={() => {
                            switchLanguage('ar');
                            onCloseModal();
                        }}
                    >
                        اللغة العربية
                    </Button>
                    <Button
                        onPress={() => {
                            switchLanguage('tr');
                            onCloseModal();
                        }}
                    >
                        Türkçe
                    </Button>
                    <Button
                        onPress={() => {
                            switchLanguage('uk');
                            onCloseModal();
                        }}
                    >
                        Українська
                    </Button>
                    <Button
                        onPress={() => {
                            switchLanguage('ru');
                            onCloseModal();
                        }}
                    >
                        Русский
                    </Button>
                </VStack>
            </Modal.Content>
        </Modal>
    );
};

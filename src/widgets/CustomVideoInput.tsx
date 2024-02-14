import React, { useEffect, useState } from 'react';
import { Box, FormControl, Input, Select, Stack } from 'native-base';
import CustomSelect from '../components/CustomSelect';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { useTranslation } from 'react-i18next';
import ZoomIcon from '../assets/icons/zoom-logo.svg';

type CustomVideoInputProps = {
    inputValue?: string;
    overrideMeetingLink: string | undefined;
    videoChatType: string;
    setVideoChatType: (type: string) => void;
    handleInput?: (e: any) => void;
    handleBlur?: (e: any) => void;
    clearInput: () => void;
};

const CustomVideoInput: React.FC<CustomVideoInputProps> = ({
    inputValue,
    overrideMeetingLink,
    videoChatType,
    setVideoChatType,
    handleBlur,
    handleInput,
    clearInput,
}) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const [isPrefilled, setIsPrefilled] = useState<boolean>();

    useEffect(() => {
        if (overrideMeetingLink) {
            setVideoChatType('Link');
            setIsPrefilled(true);
        }
    }, [overrideMeetingLink, setVideoChatType]);

    return (
        <Stack space={1}>
            <FormControl>
                <CustomSelect
                    placeholder="Videochat"
                    onValueChange={(value: string) => {
                        setVideoChatType(value);
                        setIsPrefilled(false);
                    }}
                    selectedValue={isPrefilled ? 'Link' : videoChatType}
                >
                    <Select.Item value="Zoom" label={t('appointment.create.videoSelectOptions.zoom')} />
                    <Select.Item value="Link" label={t('appointment.create.videoSelectOptions.link')} />
                </CustomSelect>
                {videoChatType === 'Zoom' && (
                    <Box top="12px" left="12px" pointerEvents="none" position="absolute">
                        <ZoomIcon />
                    </Box>
                )}
            </FormControl>

            {videoChatType === 'Link' && (
                <FormControl>
                    <Input
                        name="customLink"
                        width={isMobile ? '60%' : '100%'}
                        onChange={handleInput}
                        borderBottomRightRadius={5}
                        borderTopRightRadius={5}
                        placeholder={t('appointment.create.videoChatPlaceholder')}
                        value={inputValue}
                        onBlur={handleBlur}
                        // isDisabled={videoChatType === 'Zoom' || videoChatType === ''}
                    />
                </FormControl>
            )}
        </Stack>
    );
};

export default CustomVideoInput;

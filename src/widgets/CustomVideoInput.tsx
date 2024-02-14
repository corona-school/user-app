import React, { useEffect } from 'react';
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

    const handleValueChange = (item: string) => {
        if (item === 'Zoom') clearInput();
        setVideoChatType(item);
    };

    useEffect(() => {
        if (overrideMeetingLink) {
            setVideoChatType('Link');
        }
    }, [overrideMeetingLink, setVideoChatType]);

    return (
        <Stack space={1}>
            <FormControl>
                <CustomSelect
                    placeholder="Videochat"
                    onValueChange={handleValueChange}
                    selectedValue={overrideMeetingLink ? 'Link' : undefined}
                    isDisabled={overrideMeetingLink ? true : false}
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
                    isDisabled={!!overrideMeetingLink || videoChatType === 'Zoom' || videoChatType === ''}
                />
            </FormControl>
        </Stack>
    );
};

export default CustomVideoInput;

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Box, FormControl, Input, Select, Stack } from 'native-base';
import CustomSelect from '../components/CustomSelect';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { useTranslation } from 'react-i18next';
import ZoomIcon from '../assets/icons/zoom-logo.svg';
import { VideoChatTypeEnum } from '../pages/create-appointment/AppointmentCreation';

type CustomVideoInputProps = {
    inputValue?: string;
    overrideMeetingLink: string | undefined;
    videoChatType: string;
    setVideoChatType: Dispatch<SetStateAction<VideoChatTypeEnum>>;
    handleInput: (e: any) => void;
    handleBlur?: (e: any) => void;
};

const CustomVideoInput: React.FC<CustomVideoInputProps> = ({ inputValue, overrideMeetingLink, videoChatType, setVideoChatType, handleBlur, handleInput }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const [isPrefilled, setIsPrefilled] = useState<boolean>();

    useEffect(() => {
        if (overrideMeetingLink) {
            setVideoChatType(VideoChatTypeEnum.LINK);
            setIsPrefilled(true);
        }
    }, [overrideMeetingLink, setVideoChatType]);

    return (
        <Stack space={1}>
            <FormControl>
                <CustomSelect
                    placeholder="Videochat"
                    onValueChange={(value: string) => {
                        setVideoChatType(value === 'Zoom' ? VideoChatTypeEnum.ZOOM : VideoChatTypeEnum.LINK);
                        setIsPrefilled(false);
                    }}
                    selectedValue={isPrefilled ? 'Link' : videoChatType}
                >
                    <Select.Item value={VideoChatTypeEnum.ZOOM} label={t('appointment.create.videoSelectOptions.zoom')} />
                    <Select.Item value={VideoChatTypeEnum.LINK} label={t('appointment.create.videoSelectOptions.link')} />
                </CustomSelect>
                {videoChatType === VideoChatTypeEnum.ZOOM && (
                    <Box top="12px" left="12px" pointerEvents="none" position="absolute">
                        <ZoomIcon />
                    </Box>
                )}
            </FormControl>

            {videoChatType === VideoChatTypeEnum.LINK && (
                <FormControl>
                    <Input
                        width={isMobile ? '60%' : '100%'}
                        onChange={(value) => handleInput(value)}
                        borderBottomRightRadius={5}
                        borderTopRightRadius={5}
                        placeholder={t('appointment.create.videoChatPlaceholder')}
                        value={inputValue}
                        onBlur={handleBlur}
                    />
                </FormControl>
            )}
        </Stack>
    );
};

export default CustomVideoInput;

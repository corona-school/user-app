import React, { useState } from 'react';
import { Box, FormControl, Input, Select, Stack } from 'native-base';
import CustomSelect from '../components/CustomSelect';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { useTranslation } from 'react-i18next';
import ZoomIcon from '../assets/icons/zoom-logo.svg';

type CustomVideoInputProps = {
    inputValue?: string;
    overrideMeetingLink: string | undefined;
    handleInput?: (e: any) => void;
    handleBlur?: (e: any) => void;
    clearInput?: () => void;
};

const CustomVideoInput: React.FC<CustomVideoInputProps> = ({ inputValue, overrideMeetingLink, handleBlur, handleInput, clearInput }) => {
    const [videoChatType, setVideoChatType] = useState<string>('');

    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();

    const handleValueChange = (item: string) => {
        clearInput && item === 'Zoom' && clearInput();
        setVideoChatType(item);
    };

    return (
        <Stack space={1}>
            <FormControl>
                <CustomSelect
                    placeholder="Videochat"
                    onValueChange={handleValueChange}
                    selectedValue={overrideMeetingLink ? 'Link' : undefined}
                    isDisabled={overrideMeetingLink ? true : false}
                >
                    <Select.Item value="Zoom" label={'          Zoom Meeting (automatisch generieren)'} />
                    <Select.Item value="Link" label={'Eigenen Meeting Link'} />
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
                    placeholder={'Hinterlege deinen eigenen Link zum Videochat'}
                    value={overrideMeetingLink ? overrideMeetingLink : inputValue}
                    onBlur={handleBlur}
                    isDisabled={videoChatType === 'Zoom' || videoChatType === ''}
                />
            </FormControl>
        </Stack>
    );
};

export default CustomVideoInput;

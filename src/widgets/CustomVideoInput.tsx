import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ZoomIcon from '../assets/icons/zoom-logo.svg';
import { VideoChatTypeEnum } from '../pages/create-appointment/AppointmentCreation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Input } from '@/components/Input';

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
    const [isPrefilled, setIsPrefilled] = useState<boolean>();

    useEffect(() => {
        if (overrideMeetingLink) {
            setVideoChatType(VideoChatTypeEnum.LINK);
            setIsPrefilled(true);
        }
    }, [overrideMeetingLink, setVideoChatType]);

    return (
        <div className="flex flex-col gap-y-1">
            <div className="flex flex-col gap-y-1">
                <Select
                    value={isPrefilled ? 'Link' : videoChatType}
                    defaultValue={VideoChatTypeEnum.ZOOM}
                    onValueChange={(value: string) => {
                        setVideoChatType(value === 'Zoom' ? VideoChatTypeEnum.ZOOM : VideoChatTypeEnum.LINK);
                        setIsPrefilled(false);
                    }}
                >
                    <SelectTrigger id="videoChat" className="h-10 w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={VideoChatTypeEnum.ZOOM}>
                            <div className="flex gap-x-2 items-center justify-start md:justify-center">
                                <span className="overflow-hidden text-ellipsis">{t('appointment.create.videoSelectOptions.zoom')}</span>{' '}
                                <ZoomIcon className="mr-2" />
                            </div>
                        </SelectItem>
                        <SelectItem value={VideoChatTypeEnum.LINK}>{t('appointment.create.videoSelectOptions.link')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {videoChatType === VideoChatTypeEnum.LINK && (
                <div className="flex flex-col gap-y-1">
                    <Input
                        className="w-[60%] md:w-full rad"
                        onChange={handleInput}
                        placeholder={t('appointment.create.videoChatPlaceholder')}
                        value={inputValue}
                        onBlur={handleBlur}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomVideoInput;

import { Button, Card, DeleteIcon, Stack, Text, useTheme } from 'native-base';
import { InputHTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilePicker } from 'use-file-picker';
import AlertMessage from '../widgets/AlertMessage';
import { BACKEND_URL } from '../config';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    handleFileChange: (files: File[]) => void;
}

const FilePicker: React.FC<Props> = ({ handleFileChange }) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const maxFileSize = 5; // in MB
    const [openFileSelector, { plainFiles, errors }] = useFilePicker({ maxFileSize, minFileSize: 0, multiple: true });

    // unforunately useFilePicker doesnt return state change of file content.
    // So to force a rerender after deleting an element of filesContent, we need to use a state change!
    const [deletedFile, setDeletedFile] = useState<boolean>(false);

    const [fileError, setFileError] = useState<string>();

    useEffect(() => {
        handleFileChange(plainFiles);
    }, [plainFiles]);

    useEffect(() => {
        if (errors.length > 0) {
            let fileError = errors[0].fileSizeToolarge ? t('helpcenter.contact.fileupload.fileSizeToolarge', { maxSize: maxFileSize }) : '';
            fileError = errors[0].fileSizeTooSmall ? t('helpcenter.contact.fileupload.fileSizeToSmall') : fileError;
            fileError = errors[0].readerError ? t('helpcenter.contact.fileupload.readerError') : fileError;
            fileError = errors[0].maxLimitExceeded ? t('helpcenter.contact.fileupload.maxLimitExceeded') : fileError;
            fileError = errors[0].minLimitNotReached ? t('helpcenter.contact.fileupload.minLimitNotReached') : fileError;
            setFileError(fileError);
        } else {
            setFileError(undefined);
        }
    }, [errors]);

    return (
        <>
            <Stack space={space['1']} alignItems="center" direction="row" flexWrap="wrap">
                <Button flex="0 1 fit-content" maxW="100%" onPress={openFileSelector}>
                    {t('helpcenter.contact.fileupload.label')}
                </Button>
                <Stack flex="1 1 min-content" paddingTop={space['0.5']} alignItems="center" direction="row" flexWrap="wrap">
                    {plainFiles.map((file, i) => (
                        <Card mr={space['0.5']} shadow={0} mb={space['0.5']} maxW="100%" key={i} padding="4px" height="100%" bg="primary.100">
                            <Stack space={space['0.5']} direction="row" alignItems="center">
                                <Text numberOfLines={1}>{file.name}</Text>
                                <div
                                    onClick={() => {
                                        plainFiles.splice(i, 1);
                                        setDeletedFile(!deletedFile);
                                    }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <DeleteIcon />
                                </div>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            </Stack>
            {fileError && <AlertMessage content={fileError} />}
        </>
    );
};
export default FilePicker;

export const uploadFiles = async (files: File[]): Promise<string[]> => {
    let fileIDs: string[] = [];
    for (const file of files) {
        const formData: FormData = new FormData();
        const data = new Blob([file], { type: file.type });
        formData.append('file', data, file.name);
        const resp = await fetch(BACKEND_URL + '/api/files/upload', {
            method: 'POST',
            body: formData,
        });
        const fileID = await resp.text();
        fileIDs.push(fileID);
    }
    return fileIDs;
};

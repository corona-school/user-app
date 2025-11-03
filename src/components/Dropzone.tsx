import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { IconCloudUpload } from '@tabler/icons-react';
import { Button } from '@/components/Button';
import { cn } from '@/lib/Tailwind';
import UnsplashModal from '@/modals/Unsplash';
import { useTranslation } from 'react-i18next';

export interface FileItem {
    name: string;
    size: number;
    type: string;
    content: string | ArrayBuffer | null;
    blob: File;
}

interface DropzoneProps {
    onUpload: (file: FileItem | null) => void;
    file?: FileItem | string | null;
}

const Dropzone: React.FC<DropzoneProps> = ({ onUpload, file }) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setError(null);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
        // if filetype is not image, set error
        if (e.dataTransfer.items.length === 1) {
            const item = e.dataTransfer.items[0];
            if (item.kind === 'file') {
                if (!(item.type === 'image/png' || item.type === 'image/jpeg')) {
                    setError(t('single.dropzone.error.imagesOnly'));
                } else {
                    setError(null);
                }
            }
        } else if (e.dataTransfer.items.length > 1) {
            setError('single.dropzone.error.onlyOneFile');
        }
    };

    const readFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target?.result;
            if (fileContent) {
                onUpload({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    content: fileContent,
                    blob: file,
                });
            } else {
                onUpload(null);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        readFile(file);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setError(null);
        if (e.dataTransfer.items.length > 0) {
            const item = e.dataTransfer.items[0];
            if (item.kind === 'file') {
                if (item.type === 'image/png' || item.type === 'image/jpeg') {
                    readFile(e.dataTransfer.files[0]);
                }
            }
        }
    };

    const openFilePicker = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onUrlSelect = (url: string): void => {
        if (!url) return;
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const file = new File([blob], 'unsplash-image.jpg', { type: blob.type });
                readFile(file);
            })
            .catch((err) => {
                console.error('Error fetching image from Unsplash:', err);
                setError(t('single.dropzone.error.unsplash'));
            });
        setShowModal(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div
                className={`border-2 border-dashed rounded-lg text-center transition-colors ${
                    isDragging ? (error ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50') : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileInput} multiple />

                <div>
                    {error ? (
                        <div className="p-8 flex flex-col items-center">
                            <div className="w-16 h-16 mb-2 text-red-500">
                                <IconCloudUpload width={64} height={64} stroke={2} />
                            </div>
                            <p className="font-medium text-red-700">{error}</p>
                        </div>
                    ) : !file ? (
                        <div className="p-8 flex flex-col items-center">
                            <div className={cn('w-16 h-16 mb-2', isDragging ? 'text-blue-500' : 'text-gray-400')}>
                                <IconCloudUpload width={64} height={64} stroke={2} />
                            </div>
                            <p className="font-medium text-gray-700">{t('single.dropzone.description')}</p>

                            <div className="mt-2 flex space-x-4 justify-center">
                                <Button variant="outline" onClick={openFilePicker}>
                                    {t('single.dropzone.customImage')}
                                </Button>
                                <Button variant="outline" onClick={() => setShowModal(true)}>
                                    {t('single.dropzone.database')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 pb-4">
                            <img
                                src={typeof file === 'string' ? file : (file.content as string)}
                                alt={typeof file === 'string' ? file : file.name}
                                className="w-full object-cover rounded-md"
                            />
                            <div className="flex gap-2.5 content-between items-baseline">
                                {typeof file !== 'string' && (
                                    <>
                                        <span className="font-medium text-gray-700">{file.name}</span>
                                        <span className="text-sm text-gray-500">{Math.round(file.size / 1024)} KiB</span>
                                    </>
                                )}
                                <Button onClick={() => onUpload(null)} variant="destructive">
                                    {t('single.dropzone.changeImage')}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <UnsplashModal isOpen={showModal} onOpenChange={() => setShowModal(false)} onPhotoSelected={onUrlSelect} />
        </div>
    );
};

export default Dropzone;

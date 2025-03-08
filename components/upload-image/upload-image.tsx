"use client";

import {Input} from "@/components/ui/input";
import Image from "next/image";
import {useRef, useState, forwardRef, useImperativeHandle} from "react";

export type TUploadImageProps = {
    onImageUpload: (files: File[] | undefined) => void;
    maxFiles?: number; // Maximum number of files (default: 1)
};

export type UploadImageRef = {
    clearImage: () => void;
};

const UploadImage = forwardRef<UploadImageRef, { props: TUploadImageProps }>(({props}, ref) => {
    const {maxFiles = 1} = props;
    const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        clearImage: () => {
            setSelectedImages([]);
            if (inputRef.current) {
                inputRef.current.value = ""; // Clear file input
            }
        }
    }));

    const onClick = () => {
        if (inputRef.current) inputRef.current.click();
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const fileArray = Array.from(files).slice(0, maxFiles); // Limit file count
        const newImages = fileArray.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setSelectedImages(newImages);
        props.onImageUpload(fileArray);

    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
    };

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
    };

    return (
        <div
            onClick={onClick}
            onDrop={onDrop}
            onDragOver={(event) => event.preventDefault()}
            className="w-full h-full border-dashed border-2 border-gray-300 flex justify-center items-center cursor-pointer p-4"
        >
            <Input
                type="file"
                accept="image/jpg, image/png, image/jpeg"
                multiple={maxFiles > 1}
                ref={inputRef}
                className="hidden"
                onChange={onFileChange}
            />

            {selectedImages.length > 0 ? (
                <div className="w-full h-full flex gap-2">
                    {selectedImages.map((img, index) => (
                        <div key={index} className="relative flex-1 h-full">
                            <Image
                                src={img.preview}
                                alt={`Uploaded ${index + 1}`}
                                fill
                                className="object-cover rounded-md"
                            />
                            <p className="absolute bottom-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 w-full text-center truncate">
                                {img.file.name}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm text-center">Drag and drop or click to upload (Max {maxFiles})</p>
            )}
        </div>
    );
});

UploadImage.displayName = "UploadImage";
export default UploadImage;

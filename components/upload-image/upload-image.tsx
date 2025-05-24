"use client";

import {Input} from "@/components/ui/input";
import Image from "next/image";
import {useRef, useState, forwardRef, useImperativeHandle} from "react";

export type TUploadImageProps = {
    onImageUpload: (files: File[] | undefined) => void;
    maxFiles?: number; // Maximum number of files (default: 1)
    maxSizeMb?: number; // Maximum file size in MB (default: 1)
};

export type UploadImageRef = {
    clearImage: () => void;
};

const UploadImage = forwardRef<UploadImageRef, { props: TUploadImageProps }>(({props}, ref) => {
    const {maxFiles = 1, maxSizeMb = 1} = props;
    const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const maxSizeInBytes = maxSizeMb * 1024 * 1024;

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

        const validFiles: File[] = [];
        const oversizedFiles: string[] = [];

        Array.from(files).slice(0, maxFiles).forEach(file => {
            if (file.size <= maxSizeInBytes) {
                validFiles.push(file);
            } else {
                oversizedFiles.push(file.name);
            }
        });

        if (oversizedFiles.length > 0) {
            alert(`The following file(s) exceed the ${maxSizeMb}MB size limit and were not added: ${oversizedFiles.join(", ")}`);
        }

        if (validFiles.length === 0 && oversizedFiles.length > 0 && selectedImages.length === 0) {
            // If all new files are oversized and no images were previously selected, do nothing further
             props.onImageUpload(undefined); // Or an empty array if preferred
            return;
        }


        const newImages = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        // If maxFiles is 1, replace the current image. Otherwise, append.
        if (maxFiles === 1) {
            setSelectedImages(newImages);
            props.onImageUpload(newImages.map(img => img.file));
        } else {
            // This part needs refinement if you want to add to existing selection
            // For now, it replaces, respecting maxFiles for the new selection
            setSelectedImages(newImages);
            props.onImageUpload(newImages.map(img => img.file));
        }
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
                <div className="w-full h-full flex gap-2 flex-wrap"> {/* Added flex-wrap for multiple images */}
                    {selectedImages.map((img, index) => (
                        <div key={index} className="relative flex-1 h-full min-w-[100px]"> {/* Added min-width for smaller items */}
                            <Image
                                src={img.preview}
                                alt={`Uploaded ${index + 1}`}
                                fill
                                className="object-cover rounded-md"
                                // Revoke object URL on unmount to prevent memory leaks
                                onLoadingComplete={(imgElement) => {
                                    // It's good practice to revoke, but can be tricky with re-renders.
                                    // Consider revoking when images are cleared or component unmounts.
                                }}
                            />
                            <p className="absolute bottom-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 w-full text-center truncate">
                                {img.file.name}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm text-center">Drag & drop or click to upload (Max {maxFiles}, {maxSizeMb}MB/file)</p>
            )}
        </div>
    );
});

UploadImage.displayName = "UploadImage";
export default UploadImage;
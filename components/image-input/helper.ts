import { Area } from "react-easy-crop";

export const cropImage = async (imageSource: string, pixelCrop: Area) => {
    return new Promise<string>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = imageSource;

        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject("Could not get canvas context");
                return;
            }

            // Use natural image size for cropping
            const { naturalWidth: imgWidth, naturalHeight: imgHeight } = image;

            // Adjust crop values based on natural image size
            const scaleX = imgWidth / image.width;
            const scaleY = imgHeight / image.height;

            const cropX = pixelCrop.x * scaleX;
            const cropY = pixelCrop.y * scaleY;
            const cropWidth = pixelCrop.width * scaleX;
            const cropHeight = pixelCrop.height * scaleY;

            // Set canvas size to crop area
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            // Draw the cropped portion of the image onto the canvas
            ctx.drawImage(
                image,
                cropX, cropY, // Source X, Y in the original image
                cropWidth, cropHeight, // Width, Height in original image
                0, 0, // Destination X, Y on canvas
                pixelCrop.width, pixelCrop.height // Width, Height on canvas
            );

            // Convert the cropped image to Base64
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject("Failed to create blob");
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => resolve(reader.result as string);
            }, "image/jpeg", 0.95);
        };

        image.onerror = () => reject("Image failed to load");
    });
};

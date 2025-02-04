import {Area} from "react-easy-crop";


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

            canvas.style.backgroundColor = "black";


            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            ctx.drawImage(
                image,
                pixelCrop.x, pixelCrop.y,
                pixelCrop.width, pixelCrop.height,
                0, 0,
                image.width, image.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject("Failed to create blob");
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => resolve(reader.result as string);
            }, "image/jpeg");
        };
        image.onerror = () => reject("Image failed to load");
    });
};
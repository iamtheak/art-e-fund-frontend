import {auth} from "@/auth";

export const getUserFromSession = async () => {
    const session = await auth();

    return session?.user || null;
}

export function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

export function isValidUsername(username: string) {
    return /^[a-zA-Z0-9_]+$/.test(username);
}

export function decodeUrl(url: string) {

    try {
        const decoded = decodeURIComponent(url);
        const cleanedString = decoded
            .replace(/(\w+):/g, '"$1":')
            .replace(/'/g, '"');

        return JSON.parse(cleanedString);
    } catch (error) {
        console.error("Failed to parse purchase order data:", error);
        return null
    }
}
"use client"

import React, {useEffect, useRef} from "react"
import {useState, useCallback} from "react"
import type {TImageInputProps} from "@/components/image-input/types"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import Cropper, {Area, Point} from "react-easy-crop"
import {cropImage} from "@/components/image-input/helper";
import Image from "next/image"

const ImageInput: React.FC<TImageInputProps> = ({image: initialImage, onCropComplete}) => {
    const [selectedImage, setSelectedImage] = useState<string | null>()
    const [crop, setCrop] = useState<Point>({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isCropping, setIsCropping] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        setSelectedImage(initialImage ?? undefined)
    },[initialImage])

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setSelectedImage(imageUrl)
            setIsCropping(true)
            setZoom(1)
            setCrop({x: 0, y: 0})
        }
    }

    const onCropCompleteCallback = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createCroppedImage = useCallback(async (imageSource: string, pixelCrop: Area) => cropImage(imageSource, pixelCrop), [])

    const handleCropConfirm = useCallback(async () => {
        if (croppedAreaPixels && selectedImage) {
            try {
                const croppedImageData = await createCroppedImage(selectedImage, croppedAreaPixels)
                onCropComplete(croppedImageData)

                setSelectedImage(croppedImageData)
                setIsCropping(false)
            } catch (e) {
                console.error(e)
                // Handle error (e.g., show error message to user)
            }
        }
    }, [croppedAreaPixels, selectedImage, createCroppedImage, onCropComplete])

    const handleCropCancel = () => {
        setIsCropping(false)
        setZoom(1)
        setCrop({x: 0, y: 0})
    }
    return (
        <div className="flex flex-col items-center space-y-4">
            {selectedImage ? (
                isCropping ? (
                    <>
                        <div className="relative w-80 h-80">
                            <Cropper
                                image={selectedImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropCompleteCallback}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                                objectFit="contain"
                                minZoom={0.5}
                                maxZoom={3}
                            />
                        </div>
                        <div className="bottom-[-50px] left-0 right-0 flex justify-center space-x-2">
                            <Button type={"button"} onClick={handleCropCancel}>Cancel</Button>
                            <Button type={"button"} onClick={handleCropConfirm}>Confirm</Button>
                        </div>
                    </>

                ) : (
                    <div className="relative w-64 h-64 overflow-hidden rounded-full">
                        <Image width={100} height={100} className={"h-full w-full object-cover"}
                               src={selectedImage || "/placeholder.svg"} alt="Selected image"/>
                    </div>
                )
            ) : (
                <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-full">
                    <span className="text-gray-500">No image selected</span>
                </div>
            )}
            <Input ref={inputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden"
                   id="image-input"/>
            <div className={"flex gap-3"}>

                <Button type={"button"} onClick={() => {
                    inputRef.current?.click();
                }}>
                    {selectedImage ? "Change Image" : "Select Image"}
                </Button>
                {selectedImage && !isCropping && <Button onClick={() => {
                    setSelectedImage(null)
                }}>
                    Remove Image
                </Button>}
            </div>
            {isCropping && (
                <input
                    type="range"
                    value={zoom}
                    min={0.5}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full max-w-xs"
                />
            )}
        </div>
    )
}


export default ImageInput


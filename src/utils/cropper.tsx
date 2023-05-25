import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from './getCroppedImage';

const ImageCropper: React.FC<{ image: string, setImage: React.Dispatch<React.SetStateAction<string>>}> = (props: { image: string, setImage: React.Dispatch<React.SetStateAction<string>> }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);

    const image = props.image
    const onCropComplete =
        async (_: Area, croppedAreaPixels: Area) => {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels)

            props.setImage(croppedImage)
        }

    const onZoomChange = useCallback((zoom: number) => {
        setZoom(zoom);
    }, []);

    const onCropChange = useCallback((crop: any) => {
        setCrop(crop);
    }, []);
    return (
        <div className="crop-container">
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={onCropChange}
                onCropComplete={onCropComplete}
                onZoomChange={onZoomChange}
            />
        </div>
    );
};

export default ImageCropper;

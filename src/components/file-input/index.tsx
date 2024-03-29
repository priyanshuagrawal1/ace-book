import React, { useRef, useState, ChangeEvent, useEffect } from 'react';
import { IoImagesOutline } from 'react-icons/io5';
import "./file-input.css"
import ImageCropper from '../../utils/cropper';
interface MyComponentProps {
    setImageSrc: React.Dispatch<React.SetStateAction<string | null>>;
    stage: number;
    setStage: React.Dispatch<React.SetStateAction<number >>;
    setPostDescription: React.Dispatch<React.SetStateAction<string>>;
}
const FileInput: React.FC<MyComponentProps> = (props: MyComponentProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string>("");
    const [needsCrop, setNeedsCrop] = useState<boolean>(true);
    const readFile = (file: File) => {
        setNeedsCrop(true);
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                props.setImageSrc(reader.result);
                setImageSrc(reader.result);
            }
        };
        reader.readAsDataURL(file);
        props.setStage(1)
    }
    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file = event.target.files && event.target.files[0];
        if (file) {
            readFile(file)
        }
    };
    function handleDragOver(event: any) {
        event.preventDefault();
    }
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    function handleDrop(event: any) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
            if (file) {
                readFile(file)
            }
    }

    useEffect(() => { props.setImageSrc(croppedImage) }, [croppedImage])
    return (
        <div className='upload-popup' onDragOver={(event) => handleDragOver(event)} onDrop={(event) => handleDrop(event)}>
            <input
                type="file"
                accept=".jpg, .jpeg, .png"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
            />
            {props.stage==0&& <div className='upload-image'>
                    <IoImagesOutline className="drag-images" />
                    <span style={{ fontSize: "18px", fontWeight: "500", padding: "5px 0px 20px 0px" }}>Drag photos and videos here</span>
                <button className='upload-button' onClick={handleClick}>Select from computer</button>
                </div>
            }
            {props.stage == 1 &&
                needsCrop &&
                <> <ImageCropper image={imageSrc!} setImage={setCroppedImage} />
                    <button style={{ position: "absolute", bottom: "20px", right: "45%", backgroundColor: "rgb(1, 149, 247)", zIndex: "100" }} onClick={() => { setNeedsCrop(false); props.setStage(2) }}>Done</button>
                </>
            }
        </div>
    );
};

export default FileInput;

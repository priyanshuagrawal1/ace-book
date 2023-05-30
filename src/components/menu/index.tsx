import { useRef, useState } from 'react';
import "./menu.css"
import { HiPlus } from "react-icons/hi"
import { auth, db, storage } from '../../services/firebase';
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { FieldValue, doc, setDoc } from "firebase/firestore";

import { Snackbar } from '@mui/material';

import FileInput from '../file-input';

const MenuButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [postDescription, setPostDescription] = useState<string>("");
    const [stage, setStage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const handleBack = () => {
        setStage(prev => {
            if (prev === 2)
                return prev - 2;
            if (prev > 0)
                return --prev
            return prev

        })
        if (stage == 0) {
            setImageSrc(null)
        }
    }
    const closePopup = () => {
        setStage(0)
        setIsOpen(false)
    }
    const handlePostUpload = async () => {
        setIsOpen(false)
        setStage(0)
        setIsLoading(true)
        const postId = uuidv4()
        let file: File;
        // setPostId(postId)
        await fetch(imageSrc!)
            .then(res => res.blob())
            .then(blob => {
                file = new File([blob], postId, { type: "image/png" })
                console.log(file)
            })
        const storageRef = ref(storage, `images/${postId}`);

        await uploadBytes(storageRef, file!).then((_) => {
            console.log('Uploaded a blob or file!');
            setSnackbarOpen(true);
            setPostDescription("");
            setImageSrc("");
        });

        await setDoc(doc(db, "posts", postId), {
            description: postDescription,
            userId: auth.currentUser?.uid,
            likes: 0,
            createdAt: new Date().toISOString()
        });
        await setDoc(doc(db, "likes", postId), {
            postId:postId
        })
        setIsLoading(false)

    }
    const popupRef = useRef(null);
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    const handlePopupClick = (e: any) => {
        if (e.target === popupRef.current) {
            closePopup(); // Close the popup only if clicked outside the popup content
        }
    };
    return (
        <div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Adjust the duration as needed
                onClose={handleSnackbarClose}
                message="Posted successfully!"
            />
            {isLoading && (
                <div className="overlay">
                    <div className="loader"></div>
                </div>
            )}
            <HiPlus className={`menu-button ${isOpen ? 'open' : ''}`} onClick={toggleMenu} />
            {isOpen && <div className='menu-overlay' ref={popupRef} onClick={handlePopupClick}>
                <div className={`menu ${isOpen ? 'open' : ''} ${stage == 3 ? "extended" : ""}`}>
                    <div className='new-post-title' style={{}} >
                        {imageSrc && stage > 0 && <button style={{
                            padding: "0px 15px", backgroundColor: "transparent", color: "#0195f7", border: "none", outline: "none"
                        }}
                            onClick={handleBack}
                        >back</button>}
                        <span style={{ margin: stage == 0 ? "auto" : 0 }}>
                            Create new post
                        </span>
                        {imageSrc && stage == 2 && <button style={{
                            padding: "0px 15px", backgroundColor: "transparent", color: "#0195f7", border: "none", outline: "none"
                        }}
                            onClick={() => setStage(3)}
                        >next</button>}
                        {imageSrc && stage == 3 && <button style={{
                            padding: "0px 15px", backgroundColor: "transparent", color: "#0195f7", border: "none", outline: "none",
                        }}
                            onClick={() => handlePostUpload()}
                        >Post</button>}
                    </div>
                    <FileInput setImageSrc={setImageSrc} setPostDescription={setPostDescription} stage={stage} setStage={setStage} />
                    <div style={{ display: "flex", flexDirection: "row" }}> {imageSrc && (stage == 2 || stage == 3) && <img src={imageSrc!} style={{ height: "500px", width: "500px" }} ></img>}
                        {stage == 3 && <div className="post-add-comments" style={{ padding: "0px", width: "100%" }}>
                            <span style={{ padding: "10px" }}>Enter your post caption</span>
                            <textarea
                                maxLength={300}
                                rows={5}
                                wrap="hard"
                                placeholder="Add a caption..."
                                className="post-caption"
                                onChange={(e) => setPostDescription(e.target.value)}
                            />
                        </div>}
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default MenuButton;

import "./profile-menu.css"
import defaultPic from "../../assets/default.jpeg"
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, storage } from "../../services/firebase";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { FaRegEdit } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Snackbar } from '@mui/material';

async function logout() {
  await signOut(auth);
  window.location.href = "/"
}
const compressImage = async (file: File, { quality = 1, type = file.type }) => {
  // Get as image data
  const imageBitmap = await createImageBitmap(file);

  // Draw to canvas
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext('2d');
  ctx!.drawImage(imageBitmap, 0, 0);

  // Turn into Blob
  return await new Promise((resolve) =>
    canvas.toBlob(resolve, type, quality)
  );
};

interface User {
  id: string;
  name: string;
  imgUrl?: string;
}
export default function ProfileMenu(_: any) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const handleOverlayClick = (e: any) => {
    if (e.target === profileOverlayRef.current) {
      setIsOpen(false); // Close the popup only if clicked outside the popup content
    }
  }
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  async function fetchUser() {
    const userId = auth.currentUser?.uid
    const docRef = doc(db, "users", userId!)
    const docData = (await getDoc(docRef)).data()
    if (docData) {
      const user: User = {
        id: userId!,
        name: docData.displayName,
        imgUrl: docData.imageUrl ?? "",
      }
      setUser(user)
    }
  }
  async function uploadFile(event: any) {
    const file = event.target.files && event.target.files[0];

    const compressedFile: any = await compressImage(file, {
      // 0: is maximum compression
      // 1: is no compression
      quality: 0.5,

      // We want a JPEG file
      type: 'image/jpeg',
    });
    const storageRef = ref(storage, `users/${auth.currentUser?.uid!}`);
    await uploadBytes(storageRef, compressedFile!).then( async (_) => {
      const userRef = doc(db, "users", user!.id!);
      const profilePic = ref(storage, `users/${user!.id}`);
      const downloadUrl = await getDownloadURL(profilePic)
      updateDoc(userRef, {
        imageUrl: downloadUrl
      })
      fetchUser()
      setSnackbarOpen(true);
    });
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUser()
      }
      else {
        window.location.href = "/"
      }
    })
  }, [])
  function handleEditClick() {
    editProfileRef.current?.click();
  }
  const editProfileRef = useRef<HTMLInputElement | null>(null);
  const profileOverlayRef = useRef(null)
  return (
    <> <div className="profile">
      <div className="photo-overlay">
        <img src={user?.imgUrl ?? defaultPic} onClick={() => { setIsOpen(!isOpen) }} className="profile-photo" onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
        }}></img>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Adjust the duration as needed
        onClose={handleSnackbarClose}
        message="Posted successfully!"
      />
      {isOpen && <div className="overlay" onClick={handleOverlayClick} ref={profileOverlayRef}>
        <div className="profile-corner">
          <div className="photo-overlay" style={{ width: "100px", margin: "15px" }}>
            <img src={user?.imgUrl ?? defaultPic} className="profile-photo" style={{ width: "120px", }} onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
            }}>
            </img>
            <input ref={editProfileRef} type="file" accept=".jpg, .jpeg, .png" style={{ display: "none" }} onChange={uploadFile} />
            <FaRegEdit className="edit-icon" onClick={handleEditClick} />
          </div>
          <span>hello {auth.currentUser?.displayName??"unknown user"}</span>
          <button onClick={logout} className="logoutButton"> Logout</button>
        </div>
      </div>}
    </div>
    </>
  )
}

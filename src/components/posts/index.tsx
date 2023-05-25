import "./posts.css"
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment } from "react-icons/fa"
import { IoPaperPlaneOutline } from "react-icons/io5";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md"
import { useEffect, useState } from "react";
import { Post } from "../../pages/feedPage";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
interface PostProps {
    post: Post
}

export default function Post(props: PostProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState("");
    const post = props.post
    const handleLikeClick = () => {
        setIsLiked(!isLiked);
    };

    const handleCommentChange = (e: any) => {
        setComment(e.target.value);
    };
    console.log(props.post, "post")
    useEffect(() => {
        async function fetchUser() {
            const docRef = doc(db, "users", props.post.userId!);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data()
            if (data) {
                setUserName(data.displayName)
            }
        }
        fetchUser()
    }, [])
    return (
        <div className="post">

            <div className="post-header">
                <div className="post-profile">
                    <img src={auth.currentUser?.photoURL ?? ""} alt="User image"
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                        }} />
                </div>
                <div className="post-account">{post.userName}</div>
                <div className="post-time">{post.postTime}</div>
                <div className="post-menu">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
            <div className="post-content">
                <img src={post.imageUrl} alt="" />
            </div>
            <div className="post-actions">
                <div className="post-like" onClick={handleLikeClick}>
                    {isLiked ? <AiFillHeart style={{ fill: "red" }} /> : <AiOutlineHeart />}
                </div>
                <div className="post-comment">
                    <FaRegComment style={{
                        "transform": "rotateY(180deg)"
                    }} />
                </div>
                <div className="post-share">
                    <IoPaperPlaneOutline />
                </div>
                <div className="post-save" onClick={() => { setIsSaved(!isSaved) }}>
                    {isSaved ? <MdBookmark style={{ fill: "red" }} /> : <MdBookmarkBorder />}
                </div>
            </div>
            <div className="post-meta">
                <div className="post-likes">4000 likes</div>
                <div className="post-account-description">
                    <span> <span className="post-account">{post.userName}</span>
                        <span className="post-description">{post.postDescription} </span>
                    </span>
                </div>
                <div className="post-comments">Comments section</div>
                <div className="post-add-comments">
                    <input
                        type="text"
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder="Add a comment..."
                        className="comment-input"
                    />
                </div>
            </div>
        </div>
    )
}

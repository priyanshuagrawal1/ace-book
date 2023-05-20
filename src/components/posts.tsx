import "./posts.css"
import { AiFillHeart,AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment } from "react-icons/fa"
import { IoPaperPlaneOutline } from "react-icons/io5";
import { MdBookmarkBorder,MdBookmark } from "react-icons/md"
import reactLogo from "../assets/react.svg"
import { useState } from "react";
export default function Posts() {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [comment, setComment] = useState('');

    const handleLikeClick = () => {
        setIsLiked(!isLiked);
    };
    const handleCommentChange = (e:any) => {
        setComment(e.target.value);
    };
  return (
      <div className="post">
          <div className="post-header">
              <div className="post-profile">
                  <img src={reactLogo} alt="User image" />
              </div>
              <div className="post-account">User name</div>
              <div className="post-time">3d</div>
              <div className="post-menu">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
              </div>
            </div>
          <div className="post-content">
                <img src={reactLogo} alt="" />
          </div>
          <div className="post-actions">
              <div className="post-like" onClick={handleLikeClick}>
                  {isLiked ? <AiFillHeart style={{ fill: "red" }} /> : <AiOutlineHeart />}
              </div>
              <div className="post-comment">
                  <FaRegComment style={{
                      "transform": "rotateY(180deg)"}} />
              </div>
              <div className="post-share">
                  <IoPaperPlaneOutline/>
              </div>
              <div className="post-save" onClick={() => { setIsSaved(!isSaved)}}>
                  {isSaved ?<MdBookmark style={{fill:"red"}} />:<MdBookmarkBorder/>}
              </div>
          </div>
          <div className="post-meta">
              <div className="post-likes">4000 likes</div>
              <div className="post-account-description">
                 <span> <span className="post-account">Account name</span>
                      <span className="post-description">post description post description post description post description post description </span>
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

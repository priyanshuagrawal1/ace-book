

import { useEffect, useState } from 'react';
import { getDownloadURL, getMetadata, ref } from 'firebase/storage';
import { collection, doc, getDoc,limit, onSnapshot, query } from 'firebase/firestore';
import { auth, db, storage } from '../services/firebase';
import MenuButton from '../components/menu';
import Post from '../components/posts';

import "./feedPage.css"
import ProfileMenu from '../components/profile-menu/profile-menu';
export interface Post {
    postDescription?: string;
    imageUrl?: string;
    postTime?: string;
    userId?: string;
    userName?: string;
    userProfile?: string;
    id?: string;
    likes?: number;
}
function calculatePostTime(uploadDate: string) {
    const previousDate = new Date(uploadDate);
    const timeDifference = new Date().getTime() - previousDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let smallestDifference = '';
    if (days > 0) {
        smallestDifference = `${days}d`;
    } else if (hours > 0) {
        smallestDifference = `${hours}h`;
    } else if (minutes > 0) {
        smallestDifference = `${minutes}m`;
    } else {
        smallestDifference = `${seconds}s`;
    }
    return smallestDifference
}
export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (posts.length == 0) { setIsLoading(true) }
        const fetchData = async () => {
            try {
                const postsRef = collection(db, "posts")

                const postQuery = query(postsRef,limit(10))
                 onSnapshot(postQuery, async (querySnapshot) => {
                    const posts: Post[] = []
                    querySnapshot.forEach((doc) => {
                        const post: Post = {
                            postDescription: doc.data().description,
                            userId: doc.data().userId,
                            id: doc.id,
                            likes: doc.data().likes
                        }
                        posts.push(post)
                    });
                    for (let post of posts) {
                        if (!post.userId) continue;
                        const imageRef = ref(storage, `images/${post.id}`);
                        if(!imageRef) continue
                        const imageurl = await getDownloadURL(imageRef)
                        if(!imageurl) continue
                        const meta = await getMetadata(imageRef)
                        const uploadDate = meta?.updated
                        const userData = (await getDoc(doc(db, "users", post.userId),)).data()
                        if (!userData) continue;
                        post.userName = userData.displayName
                        post.userProfile = userData.imageUrl??""
                        const smallestDifference = calculatePostTime(uploadDate)
                        post.postTime = smallestDifference;
                        if (!imageurl) continue;
                        post.imageUrl = imageurl
                    }
                    setPosts(posts)
                    setIsLoading(false)
                });
                // setPosts(postsList)
            } catch (error) {
                console.error('Error occurred while listing items:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='feed-page'>
            {isLoading && (
                <div className="overlay">
                    <div className="loader"></div>
                </div>
            )}
            <ProfileMenu userName={ auth.currentUser?.displayName} />
            <MenuButton />
            <div className="posts">
                {posts.map(post => {
                    return <Post post={post} key={post.imageUrl} />
                })}
            </div>
        </div>
    )
}

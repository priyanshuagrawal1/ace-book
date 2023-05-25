

import { useEffect, useState } from 'react';
import { getDownloadURL, getMetadata, listAll, ref } from 'firebase/storage';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { auth, db, storage } from '../services/firebase';
import MenuButton from '../components/menu';
import Post from '../components/posts';
    import { signOut } from 'firebase/auth';

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
    const listRef = ref(storage, 'images');
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (posts.length == 0) { setIsLoading(true) }
        const fetchData = async () => {
            try {
              const postsRef=  collection(db, "posts")
                const postQuery = query(postsRef, limit(10))
                const posts:Post[]=[]
                const querySnapshot = await getDocs(postQuery);
                querySnapshot.forEach((doc) => {
                    const post: Post = {
                        postDescription: doc.data().description,
                        userId: doc.data().userId,
                        id:doc.id
                    }
                    posts.push(post)
                });
                
                for (let post of posts) {
                    if (!post.userId) continue;
                    const user = await getDoc(doc(db, "users", post.userId),)
                    if (!user?.data()) continue;
                    post.userName = user.data()?.displayName
                    const imageRef = ref(storage, `images/${post.id}`);
                    const imageurl = await getDownloadURL(imageRef)
                    if (!imageurl) continue;
                    post.imageUrl = imageurl
                }
                setPosts(posts)
                // const res = await listAll(listRef);
                // const postsList: Post[] = [];
                // for (let itemRef of res.items) {
                //     try {
                //         const url = await getDownloadURL(itemRef);
                //         const meta = await getMetadata(itemRef)
                //         const uploadDate = meta.updated
                //         const smallestDifference = calculatePostTime(uploadDate)
                //         const docRef = doc(db, "posts", itemRef.name);
                //         const docSnap = await getDoc(docRef);

                //         if (docSnap.exists()) {
                //             // console.log('Document data:', docSnap.data());
                //             // const postUserId = docSnap.data().userId;
                //             // const user = await authAdmin().getUser(postUserId)
                //             const newPost: Post = {
                //                 postDescription: docSnap.data().description,
                //                 imageUrl: url,
                //                 userId:docSnap.data().userId,
                //                 postTime: smallestDifference,
                //             }
                //             postsList.push(newPost)
                //         } else {
                //             console.log('No such document!');
                //         }

                //         // Call your addPost function here passing postDescription and url
                //         // addPost(postDescription, url);
                //     } catch (error) {
                //         console.error('Error occurred while fetching data:', error);
                //     }
                // }
                setIsLoading(false)
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
            <ProfileMenu />
            <MenuButton />
            <div className="posts">
                {posts.map(post => {
                    return <Post post={post} key={post.imageUrl} />
                })}
            </div>
        </div>
    )
}

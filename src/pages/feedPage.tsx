

import { useEffect, useState } from 'react';
import { getDownloadURL, getMetadata, ref } from 'firebase/storage';
import { DocumentData, QueryDocumentSnapshot, collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { auth, db, storage } from '../services/firebase';
import MenuButton from '../components/menu';
import Post from '../components/posts';
import InfiniteScroll from 'react-infinite-scroll-component';
import { chunk } from 'lodash';
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
    likedByUser: boolean;
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
    const [hasNext, setHasNext] = useState<boolean>(true);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [postsType, setPostsType] = useState<string>("");
    const [page, setPage] = useState<number>(1)
    let ignoreFetch = false

    console.log({ postsType })
    async function setPostsData(posts: Post[]) {
        for (let post of posts) {
            if (!post.userId) continue;
            const imageRef = ref(storage, `images/${post.id}`);
            if (!imageRef) continue
            const imageurl = await getDownloadURL(imageRef)
            if (!imageurl) continue
            const meta = await getMetadata(imageRef)
            const uploadDate = meta?.updated
            const userData = (await getDoc(doc(db, "users", post.userId),)).data()
            if (!userData) continue;
            post.userName = userData.displayName
            post.userProfile = userData.imageUrl ?? "";
            const smallestDifference = calculatePostTime(uploadDate)
            post.postTime = smallestDifference;
            if (!imageurl) continue;
            post.imageUrl = imageurl
            const likequery = query(collection(db, "likes"), where("postId", "==", post.id), where("likedBy", "array-contains", auth.currentUser!.uid))
            const likedBy = await getDocs(likequery)
            if (likedBy.docs.length) {
                post.likedByUser = true;
            }
        }
        setPosts((prev) => {
            return [...prev, ...posts!]
        })
        setIsLoading(false)
    }
    const fetchLikedPosts = async () => {
        try {
            const userRef = doc(db, "users", auth.currentUser!.uid)
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data()
            if (!userData) return;

            const likedPosts :string[] = userData.likes;
            if (!likedPosts.length) { return; }
            const posts: Post[] = []
            const likedPostsChunk = chunk(likedPosts, 10)
            if (!likedPostsChunk[page - 1]) {
                setHasNext(false)
               return 
            }
            for (let postId of likedPostsChunk[page-1]) {
                const postRef = doc(db, "posts", postId)
                const postDoc = await getDoc(postRef);
                const postData = postDoc.data();
                if (!postData) continue;
                const post: Post = {
                    postDescription: postData.description,
                    userId: postData.userId,
                    id: postDoc.id,
                    likes: postData.likes,
                    likedByUser: false
                }
                posts.push(post)
            }
            setPage(page+1)
            await setPostsData(posts)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchAllData = async () => {
        try {
            const postsRef = collection(db, "posts")
            let postQuery = query(postsRef, orderBy("createdAt", "desc"), limit(10))
            if (lastVisible) {
                const createdAt = lastVisible.data().createdAt
                postQuery = query(collection(db, "posts"),
                    orderBy("createdAt", "desc"),
                    startAfter(createdAt),
                    limit(10));
            }
            const documentSnapshots = await getDocs(postQuery);
            if (documentSnapshots.docs.length == 0) {
                setHasNext(false);
                return;
            }
            // Get the last visible document
            setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])
            const posts: Post[] = []
            documentSnapshots.forEach((doc) => {
                const post: Post = {
                    postDescription: doc.data().description,
                    userId: doc.data().userId,
                    id: doc.id,
                    likes: doc.data().likes,
                    likedByUser: false
                }
                posts.push(post)
            });
            await setPostsData(posts)
            // setPosts(postsList)
        } catch (error) {
            console.error('Error occurred while listing items:', error);
        }
    };
    // @ts-ignore
    useEffect(() => {
        if (posts.length == 0) {
            setIsLoading(true)
        }
        if (!ignoreFetch) {
            fetchAllData();
        }
        return (): boolean => {
            setPosts([])
            return ignoreFetch = true;
        };

    }, []);

    function fetchMorePosts() {
        switch (postsType) {
            case "":
            case "all": fetchAllData(); break;
            case "liked": fetchLikedPosts(); break;
        }
    }

    // @ts-ignore
    useEffect(() => {
        setPosts([])
        setLastVisible(null)
        setHasNext(true)
        setPage(1)
        setIsLoading(true)
        switch (postsType) {
            case "all": fetchAllData(); break;
            case "liked": fetchLikedPosts(); break;
        }
    }, [postsType]);

    return (
        <div className='feed-page' id="scrollableDiv"
        >
            {isLoading && (
                <div className="overlay">
                    <div className="loader"></div>
                </div>
            )}
            <ProfileMenu userName={auth.currentUser?.displayName} setPostsType={setPostsType} />
            <MenuButton />
            <div className='posts'>
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMorePosts}
                    hasMore={hasNext} // Replace with a condition based on your data source
                    loader={posts.length ? <p>Loading...</p> : <></>}
                >
                    <ul>
                        {posts.map(post => (
                            <Post post={post} key={post.imageUrl} />
                        ))}
                    </ul>
                </InfiniteScroll>
                {/* {error && <p>Error: {error.message}</p>} */}
            </div>
        </div>
    )
}

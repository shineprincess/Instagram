// Design Posts
import React , {useState , useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from "./firebase";
import firebase from 'firebase';

function Post( { postId, user, username , caption , imageUrl} ) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("")

    useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
          .collection("posts")
          .doc(postId)
          .collection("comments")
          .orderBy('timestamp','desc')
          .onSnapshot((snapshot) => {
            setComments(snapshot.docs.map((doc) => doc.data()))
          });
        }
        return () => {
          unsubscribe();
        };
      }, [postId]);

    
    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username: user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
          });
        
          setComment('');
        
        }

    return (
        <div className = "post">
            <div className = "post__header">
            <Avatar 
                className = "post__avatar"
                alt = "Piyu "
                src = "https://images.unsplash.com/photo-1545828751-0a3b3a1da949?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8cHJpbmNlc3N8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
            />
            <h3> { username } </h3>
            </div>
            
            <img
                className = "post__image" 
                src = {imageUrl}
                alt = "post"
            />

            <h4 className = "post__text"> <strong>  {username} </strong> {caption } </h4>

            {
                <div className="post__comments">
                    {comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>

                    ))}
                </div>
            }

            {user && (
                <form className= "post__commentBox">
                    <input 
                        className="post__input"
                        type="text"
                        placeholder="Add a comment...."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}>Post
                        </button>
                </form>
            )}
            
        </div>
    )
}

export default Post

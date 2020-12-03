import React, {
  useState,
  useEffect
} from 'react';
import './Post.scss';
import Avatar from '@material-ui/core/Avatar';
import {db} from '../firebase';
import firebase from 'firebase';

const Post = ({ username, imgUrl, caption, postId, user }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(()=> {
    let unsubscribe;
    if(postId) {
      unsubscribe = db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()))
      });
    };

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();


    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    setComment('');
  };

  return (
    <div className='post'>
      <div className="post__header">
        <Avatar 
          className='post__avatar'
          alt={username}
          src=''
        />
        <h3>{username}</h3>
      </div>

      <img className='post__image'
        src={imgUrl} 
        alt={username}
      />

      <h4 className='post__username__caption'><strong>{username}</strong>: {caption}</h4>
      
      <div className="post__comments">
        { comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {
        user ? (
        <form className='post__comment'>
          <input
            className='post__comment__input' 
            type="text"
            placeholder='Add comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className='post__comment__button'
            disabled={!comment}
            type='submit'
            onClick={postComment}
          >
            Post
          </button>
        </form>) : ('')
      }
    </div>
  )
}

export default Post

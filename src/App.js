import React, {
  useState,
  useEffect
} from 'react';
import './App.scss';
import Post from './components/Post';
import InstainkLogo from './images/app.co.png';
import ImageUpload from './ImageUpload';

import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '80%',
    maxWidth: '400px',
    height: 'auto',
    backgroundColor: '#fff',
    border: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 2, 2),
    outline: 'none',
  }
}));
 
function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen]  = useState(false);
  const [openSignIn, setOpenSignIn] = useState('');
  const [username, setUsername]  = useState('');
  const [password, setPassword]  = useState('');
  const [email, setEmail]  = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //every time a new post is added, this code fires...
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      });
    })
    .catch((error) => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((err) => alert(err.message))

    setOpenSignIn(false);
  }

  return (
    <div className="App">
    
      { user?.displayName ? 
        (
          <ImageUpload  username={user.displayName}/>
        )
          :
        (
          <h3 className='app__message__not__logged'>You need to login to upload and comment</h3>
        )
      }


    <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img 
                className='app__headerImage'
                src={InstainkLogo}
                alt="logo.png"
              />
            </center>
            <Input
              className='app__input__field'
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className='app__input__field'
              type='text'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className='app__input__field'
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp} >Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img 
                className='app__headerImage'
                src={InstainkLogo}
                alt="logo.png"
              />
            </center>
            <Input
              className='app__input__field'
              type='text'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className='app__input__field'
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <div className="app__headerImage">
          <img 
            src={InstainkLogo}
            alt="logo.png"
          />
        </div>
        <div className="app__header__log">
          { user ? 
              (
                <Button onClick={() => auth.signOut()}>Log Out</Button>
              )
                :
              (
                <div className="app__loginContainer">
                  <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                  <Button onClick={() => setOpen(true)}>Sign Up</Button>
                </div>
              )
            }
        </div>
      </div>

      <div className="app__posts">
        {
          posts.map(({post, id}) => (
            <Post username={post.username} caption={post.caption} imgUrl={post.imgUrl} key={id} postId={id} user={user}/>   
          ))
        }
      </div>
    </div>
  );
}

export default App;

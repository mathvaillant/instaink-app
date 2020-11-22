import React, {
  useState,
  useEffect
} from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.scss';

import HomeIcon from '@material-ui/icons/Home';
import Add from '@material-ui/icons/Add';
import PublishIcon from '@material-ui/icons/Publish';

function ImageUpload({ username }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    const currentImage = e.target.files[0];
    if(currentImage) {
      setImage(currentImage);
    }
  }

  const pageTop = () => {
      window.scroll({
        top: 0,
        behavior: 'smooth'
    });
  }

  const reset = () => {
    setProgress(0);
    setImage(null);
    setCaption('');
    pageTop();
  }

  const handleUpload = () => {
    if(image && caption) {

      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Error function ... 
          console.log(error);
          alert(error.message);
        },
        () => {
          // complete function ...
          console.log(image.name)
          storage.ref("images").child(image.name).getDownloadURL()
          .then(url => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgUrl: url,
              username: username
            })
          })

          reset();
        }
      ) 
    } else {
      alert('you need to add an image and the caption before uploading');
    }
  }

  return (
    <div className='img__upload'>
      <progress value={progress} max='100'></progress>
      <div className="img__upload__input">
        {
          <div className="img__upload__pageTop">
            <span onClick={pageTop}>
              <HomeIcon className='img__upload__icons'/>
            </span>
          </div>
        }
        <input className="img__upload__file" name='file' id='file' type="file" onChange={handleChange} required={true} />
        <label className='img__upload__file__label' htmlFor="file"><Add className='img__upload__icons'/></label>
        <input className='img__upload__caption' type="text" placeholder='Enter a caption...' value={caption} onChange={event => setCaption(event.target.value)} required={true}/>
        <Button onClick={handleUpload} className='img__upload__button'>
          <PublishIcon className='img__upload__icons'/>
        </Button>
      </div>
    </div>
  )
}

export default ImageUpload

import React from 'react';
import { Button } from '@material-ui/core';
import {useState} from 'react';
import { db, storage } from "./firebase";
import firebase from 'firebase';
import './ImageUpload.css';


function ImageUpload({username}) {
    const [progress, setProgress] = useState(0);
    const [image,setImage] = useState(null);
    const [caption , setCaption] = useState("");
   

    const handleChange = (e) => {
        // get the file that you actually selected
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        //image.name -> file name 
        //images -> creating the folder
        //storage -> access the storage in firebase and get a refrence to folder(images )
        //put(image) -> putting image to the point

        const uploadTask = storage.ref(`images/${image.name}`).put(image); //uploaded

        uploadTask.on (
            "state_changed", // as the image uploaded keep giving me snapshot 
            (snapshot) => {
                //progress function ...
                
                const progress = Math.round (
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100 
                );  
                setProgress(progress);
            },
            (error) => {
                //Error Function
                console.log(error);
                alert(error.message);
            },
            () => { 
                //complete function ...
                //upload image to firebase Storage 
                storage //downloaded link
                    .ref("images")  // go to the ref images 
                    .child(image.name) // go to the image name child 
                    .getDownloadURL() //get me the download URL 
                    .then(url => {
                //post image inside of database
                        db.collection("posts").add({
                            //sort all post on correct timings
                            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                            caption : caption ,
                            imageUrl : url , 
                            username : username
                        })

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        );
    };

    return (
        <div className="imageUpload">
            {/* I want to have... */}  
            {/* caption input */}
            {/* File picker */}
            {/* Post button  */}

            <progress className="imageUpload_Progress" value={progress} max="100"/>
            <input 
                type = "text" 
                placeholder = "Enter a caption..."
                onChange = {(event)=> setCaption(event.target.value)}  
                value={caption} 
            />

            <input type = "file" onChange = {handleChange}/>

            <Button onClick = {handleUpload}>Upload</Button>
        </div>
    );
}

export default ImageUpload 
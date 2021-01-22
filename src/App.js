import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import ReactPlayer from "react-player";
import Avatar from '@material-ui/core/Avatar';


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
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false); //sign up
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      //listen any single time any change happen like login logout
      if (authUser) {
        //user has logged in...
        console.log(authUser);
        setUser(authUser); //keep u logged in //backened stuff

        // if(authUser.displayName) {
        //   //dont update username
        // } else {
        //     //if we just  created someone
        //      //new user
        //     return authUser.updateProfile ({
        //       displayName : username,
        //   });
        // }
      } else {
        //user has logged out...
        setUser(null);
      }
    });

    return () => {
      //perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  //UseEffect Runs a piece of code based on a specific condition
  useEffect(() => {
    //this is where the code runs
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //every time a new post added, this code fires...
        //when someone push a post its gonna fire off setPosts to from that snapshot go get the docs
        //(docs=> list of this ) map through every single one get each doc
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []); // [] says whatever the code is here run it once when page refreshes

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        // then update the username
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message)); // if any error occur then catch it and set an alert show that message of error
    //firebase giving me a backened validation
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false); // the modal which is pop up i want it to be close after sign up
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://serveroutagestatus.com/wp-content/uploads/2020/02/Instagram_Logo.png"
                alt="instagram"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              {" "}
              Sign Up{" "}
            </Button>
          </form>
        </div>
      </Modal>

      {/* we are logged in now we dont need username we only need email and pass */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://serveroutagestatus.com/wp-content/uploads/2020/02/Instagram_Logo.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              {" "}
              Sign In{" "}
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://serveroutagestatus.com/wp-content/uploads/2020/02/Instagram_Logo.png"
          alt="instagram"
        />

        {user ? (
          <Button onClick={() => auth.signOut()}> Log out </Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In </Button>
            <Button onClick={() => setOpen(true)}>Sign Up </Button>
          </div>
        )}
      </div>

       {/* NOTE  STORİES  */}
       <div className="app__stories">
            <Avatar
      className="post__avatar post__avatarstory" 
      alt="+"/* {username} */ 
      src="https://lumiere-a.akamaihd.net/v1/images/b_disneyprincess_updates_mobile_rapunzel_19273_5e2281e9.jpeg" />
              <Avatar
      className="post__avatar post__avatarstory" 
      alt="Piya"/* {username} */ 
      src="https://images6.fanpop.com/image/photos/37300000/Walt-Disney-Princess-Rapunzel-tangled-37344671-1512-1288.png" />
      <Avatar
      className="post__avatar post__avatarstory" 
      alt="S"/* {username} */ 
      src="https://i.pinimg.com/originals/47/b1/47/47b147b6d88fea4bcd32344251784b24.jpg" />
      </div>


      {/* going to every single post in useState loooping through all single posts */}

      <div className="app__posts">
        <div className="app__postsRight">
          {posts.map(({ id, post }) => (
            <Post
              key={post.id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
          <div className="app__postsRight">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=iTAw1HK4z2M"
              className="react-player"
              playing
              width="60vh"
              height="60vh"
            />
        </div>
      </div>


      {/* <div className="app__postRight">
            <InstagramEmbed
            url='https://www.instagram.com/p/B0N8QKuJZBV/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
             />

     </div> */}

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you 🥺 need to login to upload</h3>
      )}
    </div>
  );
}

export default App;

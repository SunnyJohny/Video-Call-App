import React, { useContext, useState } from "react";
import { Grid, Typography, Paper, makeStyles, Button } from "@material-ui/core";

import { SocketContext } from "../Context";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "280px",
    [theme.breakpoints.down("xs")]: {
      width: "280px",
    },
  },
  gridContainer: {
    justifyContent: "right",
    margin: "10px 150px 10px 10px",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      margin: "10px 28px 10px 10px",
    },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px 10px 10px 40px",
    width: "300px",
  },
  button: {
    margin: "10px",
  },
}));

const VideoPlayer = () => {
  const {
    name,

    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,

    call,
  } = useContext(SocketContext);
  const [muted, setMuted] = useState(false);

  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const classes = useStyles();

  const handleMuteToggle = () => {
    setMuted((prevMuted) => !prevMuted);
    const newMuted = !muted;
    stream.getAudioTracks()[0].enabled = !newMuted;
    setAudioEnabled(!newMuted);
  };

  const handleVideoToggle = () => {
    setVideoEnabled(prevVideoEnabled => !prevVideoEnabled);
    stream.getVideoTracks()[0].enabled = !videoEnabled;
  };
  

  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {name || "Name"}
            </Typography>
            <video
              playsInline
              muted={muted}
              ref={myVideo}
              autoPlay
              className={classes.video}
            />
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={handleMuteToggle}
            >
              {audioEnabled ? "Mute" : "Unmute"}
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={handleVideoToggle}
            >
              {videoEnabled ? "Disable Video" : "Enable Video"}
            </Button>
          </Grid>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {call.name || "Name"}
            </Typography>
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className={classes.video}
            />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;

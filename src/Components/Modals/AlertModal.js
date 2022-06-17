import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertModal(props) {
  let navigate = useNavigate();

  const redirectToLogIn = () => {
    navigate("logIn", { replace: true });
  };

  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.close}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Alert"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {props.logIn && (
            <Button onClick={redirectToLogIn}>Go to Sign In page</Button>
          )}
          <Button onClick={props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

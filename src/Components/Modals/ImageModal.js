import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ImageModal(props) {
  const [open, setOpen] = React.useState(props.open);
  const [image, setimage] = React.useState("");

  const handleClose = () => {
    props.closeImageSponsorModal();
  };

  const handleCloseFinish = () => {
    props.finishImageSponsorModal(image);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add tournament image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a image cover to the tournament, please enter the image link here. Otherwise, just go ahead.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Image link"
            type="email"
            fullWidth
            value={image}
            onChange={(event)=>{setimage(event.target.value)}}
            variant="standard"
          />

          {image !== "" && (
            <>

                      <div
                      style={{
                        backgroundImage: "url(" + image,
                        height: "80px",
                        width: "120px",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                      }}
                    ></div>

</>
          )}



        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCloseFinish}>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

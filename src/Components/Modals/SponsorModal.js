import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function SponsorModal(props) {
  const [open, setOpen] = React.useState(props.open);
  const [logos, setLogos] = React.useState([]);
  const [actualLogo, setactualLogo] = React.useState("");

  const handleClose = () => {
    props.closeSponsorModal();
  };

  const handleCloseFinish = () => {
    props.sendLogos(logos);
  };

  const setLogosFun = () => {

    console.log(actualLogo !== "")

    if(actualLogo !== ""){
      setLogos([actualLogo]);
    }

    setactualLogo("");
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Sponsors</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a sponsor to the tournament, please enter a sponsor logo url
            here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Sponsor logo link"
            type="email"
            value={actualLogo}
            fullWidth
            variant="standard"
            onChange={(event) => {
              setactualLogo(event.target.value);
            }}
          />
          <div style={{ height: "30px" }}>
            <Button
              sx={{ position: "absolute", right: "15px" }}
              onClick={setLogosFun}
            >
              Add logo
            </Button>
          </div>

          {logos.length !== 0 && (
            <>
              <DialogContentText
                sx={{ color: "black", marginTop: "20px", fontWeight: "bold" }}
              >
                Sponsors added
              </DialogContentText>

              <div style={{ display: "flex" }}>
                {logos.map((tourn) => {
                  return (
                    <div
                      style={{
                        backgroundImage: "url(" + tourn,
                        height: "80px",
                        width: "120px",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCloseFinish}>Finish</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

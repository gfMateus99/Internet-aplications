import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ApplyModal(props) {
  const [license, setlicense] = useState("");
  const [ranking, setranking] = useState("");
  const [licenseError, setlicenseError] = useState(false);
  const [rankingError, setrankingError] = useState(false);
  const finish = () => {
    var isOk = true;

    if (license === "") {
      isOk = false;
      setlicenseError(true);
    }

    if (ranking === "") {
      isOk = false;
      setrankingError(true);
    }
    if (isOk) {
      props.finishApplyToParticipate(license, ranking);
    }
  };

  return (
    <div>
      <Dialog open={props.open} onClose={props.cancelapplyToParticipate}>
        <DialogTitle>Participate in a tournament</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To participate in this tournament, please enter your license number
            and current ranking behind.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            value={ranking}
            error={rankingError}
            onChange={(event) => {
              setrankingError(false);
              setranking(event.target.value);
            }}
            id="name"
            label="Current ranking"
            type="number"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            value={license}
            error={licenseError}
            onChange={(event) => {
              setlicenseError(false);
              setlicense(event.target.value);
            }}
            id="name"
            label="Your license number"
            type="number"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.cancelapplyToParticipate}>Cancel</Button>
          <Button onClick={finish}>Apply</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

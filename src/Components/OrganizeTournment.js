import React, { useState } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import SponsorModal from "./Modals/SponsorModal";
import ImageModal from "./Modals/ImageModal";
import ConfirmModal from "./Modals/ConfirmModal";

import db from "../config/firebaseConfig";
import { ref, set } from "firebase/database";

export default GoogleApiWrapper({
  apiKey: "AIzaSyA7yLh5uk-SEhNJ8SIizaWhPfDy4SxnzkM",
})(OrganizeTournment);

export function OrganizeTournment(props) {
  const [user, setUser] = useState(props.user);
  const [sponsorModal, setsponsorModal] = useState(false);
  const [imageModal, setimageModal] = useState(false);

  const [logos, setLogos] = useState([]);
  const [discipline, setdiscipline] = useState("");
  const [Time, setTime] = useState("");
  const [Application_Deadline, setApplication_Deadline] = useState("");
  const [Max_Participants, setMax_Participants] = useState("");
  const [tournamentName, settournamentName] = useState("");
  const [coordinatesLat, setcoordinatesLat] = useState("");
  const [coordinatesLong, setcoordinatesLong] = useState("");
  const [tournamentImage, settournamentImage] = useState("");

  const [tournamentNameError, settournamentNameError] = useState(false);
  const [disciplineError, setdisciplineError] = useState(false);
  const [Application_DeadlineError, setApplication_DeadlineError] = useState(false);
  const [Max_ParticipantsError, setMax_ParticipantsError] = useState(false);
  const [Number_playersError, setNumber_playersError] = useState(false);
  const [coordinatesLatError, setcoordinatesLatError] = useState(false);
  const [coordinatesLongError, setcoordinatesLongError] = useState(false);
  const [TimeError, setTimeError] = useState(false);

  let navigate = useNavigate();

  const seeAllTourn = () => {
    navigate("/", { replace: true });
  };

  const openSponsorModal = () => {
    setsponsorModal(true);
  };

  const closeSponsorModal = () => {
    setsponsorModal(false);
  };

  const sendLogos = (logosVec) => {
    setsponsorModal(false);
    var logosAux = logos;
    if (logosVec.length !== 0) {
      logosAux.push(logosVec);
    }
    setLogos(logosAux);
  };

  const closeImageSponsorModal = () => {
    setimageModal(false);
  };

  const [confirmModal, setconfirmModal] = useState(false);

  const finishImageSponsorModal = (image) => {
    settournamentImage(image)
    setimageModal(false);
    setconfirmModal(true);
  };

  const cancelAddTournament = () => {
    setconfirmModal(false);
  };

  const onsettournamentName = (event) => {
    settournamentName(event.target.value);
    settournamentNameError(false)
  };

  const onEditDiscipline = (event) => {
    setdiscipline(event.target.value);
    setdisciplineError(false)
  };

  const onEditTime = (event) => {
    setTime(event.target.value);
    setTimeError(false);
  };

  const onApplication_Deadline = (event) => {
    setApplication_Deadline(event.target.value);
    setApplication_DeadlineError(false)
  };

  const onMax_Participants = (event) => {
    setMax_Participants(event.target.value);
    setMax_ParticipantsError(false)
  };

  const containerStyle = {
    position: "absolute",
    width: "48%",
    height: "390px",
    right: 0,
    marginRight: "10px",
    marginTop: "15px",
  };

  const style = {
    width: "100%",
    height: "100%",
  };

  const onMapClicked = (props) => {
    console.log(props);
  };

  const CreateNewTornament = () => {

    var isOk = true

    if(tournamentName === "") {
      settournamentNameError(true)
      isOk = false
    }
    if(discipline === "") {
      setdisciplineError(true)
      isOk = false
    }
    if(Time === "") {
      setTimeError(true)
      isOk = false
    }
    if(Application_Deadline === "") {
      setApplication_DeadlineError(true)
      isOk = false
    } else {
      var varDate = new Date(Application_Deadline); 
      var today = new Date();
      if(varDate >= today) {
        //alert("Working!");
      } else {
        alert("Insert a date later than today's date!");
        setApplication_DeadlineError(true)
        isOk = false
      }
    }

    if(Max_Participants === "") {
      setMax_ParticipantsError(true)
      isOk = false
    }

    if(coordinatesLat === "") {
      setcoordinatesLatError(true)
      isOk = false
    }

    if(coordinatesLong === "") {
      setcoordinatesLongError(true)
      isOk = false
    }

    if(isOk) {
      setimageModal(true);
    }
  };


  const addTournment = () => {
    setconfirmModal(false);

    const toAdd = {
      id: props.database.length,
      name_tour: tournamentName,
      discipline: discipline,
      organizer: props.user.displayName,
      organizer_uid: props.user.uid,
      participants: ["none"],
      time: Time,
      google_maps_with_location: { lat: coordinatesLat, long: coordinatesLong},
      max_participants: Max_Participants,
      participation_application_deadline: Application_Deadline,
      sponsor_logos: logos.length === 0 ? ["none"] : logos,
      number_of_ranked_players: 0,
      logo: logos.length === 0 ? ["none"] : logos,
      tournmentImage: tournamentImage,
      participantsDetails: ["none"],
      tournament_board: ["none"],
    };

    set(ref(db, props.database.length + "/"), toAdd);
    navigate("/", { replace: true });
    alert("Tournament created");
  };

  return (
    <>
      <div style={{ height: "450px" }}>
        <div style={{ marginLeft: "10px" }}>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex" }}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                onClick={seeAllTourn}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <h2>{props.title}</h2>
            </div>
            <div
              style={{
                position: "absolute",
                right: 0,
                marginRight: "10px",
                marginTop: "20px",
              }}
            >
              <Button variant="contained" onClick={CreateNewTornament}>
                Create Tournament
              </Button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{ height: "1px", width: "99%", backgroundColor: "grey" }}
            ></div>
          </div>

          <div style={{ display: "flex" }}>
            <div>
              <div style={{ marginLeft: "10px", marginTop: "15px" }}>
                <div style={{ color: "black", fontWeight: "bold" }}>
                  Organizer
                </div>
                <TextField
                  id="standard-basic"
                  variant="standard"
                  sx={{ width: "250px" }}
                  value={user ? user.displayName : ""}
                  disabled
                />
              </div>

              <div style={{ marginLeft: "10px", marginTop: "15px" }}>
                <div style={{ color: "black", fontWeight: "bold" }}>
                  Tournament Name *
                </div>
                <TextField
                  id="standard-basic"
                  variant="standard"
                  error={tournamentNameError}
                  sx={{ width: "250px" }}
                  value={tournamentName}
                  onChange={onsettournamentName}
                  placeholder="Insert tournament name"
                />
              </div>
              <div style={{ marginLeft: "10px", marginTop: "15px" }}>
                <div style={{ color: "black", fontWeight: "bold" }}>
                  Discipline *
                </div>
                <TextField
                  id="standard-basic"
                  sx={{ width: "250px" }}
                  variant="standard"
                  error={disciplineError}
                  value={discipline}
                  onChange={onEditDiscipline}
                  placeholder="Insert Discipline"
                />
              </div>

              <div style={{ marginLeft: "10px", marginTop: "15px" }}>
                <div style={{ color: "black", fontWeight: "bold" }}>Time</div>
                <TextField
                  id="standard-basic"
                  type="time"
                  error={TimeError}
                  variant="standard"
                  sx={{ width: "250px" }}
                  value={Time}
                  onChange={onEditTime}
                  placeholder="Insert Time"
                />
              </div>
            </div>

            <div style={{ marginLeft: "100px" }}>
              <div style={{ marginLeft: "10px", marginTop: "15px" }}>
                <div style={{ color: "black", fontWeight: "bold" }}>
                  Application Deadline *
                </div>
                <TextField
                  id="standard-basic"
                  variant="standard"
                  error={Application_DeadlineError}
                  type="date"
                  sx={{ width: "250px" }}
                  value={Application_Deadline}
                  onChange={onApplication_Deadline}
                  placeholder="Insert Application Deadline"
                />
              </div>

              <div style={{ marginLeft: "10px", marginTop: "15px" }}>
                <div style={{ color: "black", fontWeight: "bold" }}>
                  Max Participants *
                </div>
                <TextField
                  id="standard-basic"
                  sx={{ width: "250px" }}
                  type="number"
                  error={Max_ParticipantsError}
                  variant="standard"
                  value={Max_Participants}
                  onChange={onMax_Participants}
                  placeholder="Insert Max Participants"
                />
              </div>


              <div style={{ marginLeft: "10px", marginTop: "15px" }}>
                <div style={{ color: "black", fontWeight: "bold" }}>
                  Insert map coordinates *
                </div>
                <div style={{ display: "flex" }}>
                  <TextField
                    id="standard-basic"
                    sx={{ width: "120px" }}
                    variant="standard"
                    type="number"
                    error={coordinatesLatError}
                    value={coordinatesLat}
                    onChange={(event) => {
                      setcoordinatesLat(event.target.value);
                      setcoordinatesLatError(false)
                    }}
                    placeholder="Lat"
                  />
                  <TextField
                    id="standard-basic"
                    sx={{ width: "120px", marginLeft: "10px" }}
                    variant="standard"
                    error={coordinatesLongError}
                    value={coordinatesLong}
                    onChange={(event) => {
                      setcoordinatesLong(event.target.value);
                      setcoordinatesLongError(false);
                    }}
                    placeholder="Long"
                  />
                </div>
              </div>
            </div>

            <Map
              google={props.google}
              containerStyle={containerStyle}
              style={style}
              zoom={1}
              onClick={onMapClicked}
              initialCenter={{ lat: coordinatesLat, lng: coordinatesLong }}
            >
              <Marker
                title={"The marker`s title will appear as a tooltip."}
                name={"SOMA"}
                position={{ lat: coordinatesLat, lng: coordinatesLong }}
              />
            </Map>
          </div>
          <div
            style={{ marginLeft: "10px", marginTop: "15px", display: "flex" }}
          >
            <div style={{ color: "black", fontWeight: "bold" }}>Sponsors:</div>
            <Button
              onClick={openSponsorModal}
              sx={{
                height: "30px",
                marginLeft: "10px",
                backgroundColor: "gray",
                "&:hover": {
                  backgroundColor: "lightGrey",
                },
              }}
              variant="contained"
            >
              Click to add Sponsors
            </Button>
          </div>
          <div style={{ display: "flex", marginTop: "10px", width: "50%" }}>
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
        </div>
      </div>

      {sponsorModal && (
        <SponsorModal
          open={sponsorModal}
          sendLogos={sendLogos}
          closeSponsorModal={closeSponsorModal}
        ></SponsorModal>
      )}

      {imageModal && (
        <ImageModal
          open={imageModal}
          closeImageSponsorModal={closeImageSponsorModal}
          finishImageSponsorModal={finishImageSponsorModal}
        ></ImageModal>
      )}

      {confirmModal && (
        <ConfirmModal
          open={confirmModal}
          aprove={addTournment}
          cancel={cancelAddTournament}
          title={"Confirm tournament creation"}
          text={
            "Are you sure you want to create a tournament with information inserted? You can edit the tournament information till the Application Deadline day."
          }
        ></ConfirmModal>
      )}
    </>
  );
}

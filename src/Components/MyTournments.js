import React, { useState } from "react";
//import ReactGA from "react-ga";
//import "./App.css";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

import TournmentItem from "./TournmentItem";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";

import ApplyModal from "./Modals/ApplyModal";
import AlertModal from "./Modals/AlertModal";
import TournamentLadder from './TournamentLadder.js';

import UnstyledButtonCustom from './Button'

export default GoogleApiWrapper({
  apiKey: "AIzaSyA7yLh5uk-SEhNJ8SIizaWhPfDy4SxnzkM",
})(PresentTournaments);

export function PresentTournaments(props) {
  const [slice, setSlice] = useState(0);

  const [idClicked, setidClicked] = useState("");
  const [tournClicked, settournClicked] = useState({});
  const [search, setsearch] = useState("");
  const [user, setUser] = useState(props.user);
  const [edit, setEdit] = useState(false);
  const [tournamentLadder, settournamentLadder] = useState(false);
  const [tournamentInMovement, settournamentInMovement] = useState(false);
  const [tournamentBoard, settournamentBoard] = useState({});

  const compare = ( a, b ) => {
    if ( a.ranking < b.ranking ){
      return -1;
    }
    if ( a.ranking > b.ranking ){
      return 1;
    }
    return 0;
  }  

  const addRound = (title, seeds) => {
    return {
      title: title,
      seeds: seeds
    }
  }

  const addSeed = (id, date , teams, result, checked=false) => {
    return {
      id: id,
      date: date,
      teams: teams,
      result: result,
      checked: checked,
      insertedBy: "none"
    }
  }

  const addTeam = (teamA, teamB, uidA, uidB) => {
    return [{ name: teamA, uid: uidA }, { name: teamB, uid: uidB }]
  }

  const addSingleTeam = (teamA, uidA) => {
    return [{ name: teamA, uid: uidA }]
  }

  const activateBoard = () =>{

    if(tournClicked.tournament_board[0] === "none"){
      var participants = tournClicked.participantsDetails;
      var participantOrdered = participants.sort( compare );
      console.log(participantOrdered)

      var date = new Date().toDateString()
      var id = 0
      var result = "---"
      var roundNumber = 1

      var board = []
      
      var title = "Round " + roundNumber
      //CRIAR AS SEEDS
      var seeds = []
      for(var i=0; i<participantOrdered.length; i++) {         
        if (i+1 === participantOrdered.length) {
          seeds.push(addSeed(id, date, addSingleTeam(participantOrdered[i].userName, participantOrdered[i].userUid), result, true))
        } else {
          seeds.push(addSeed(id, date, addTeam(participantOrdered[i].userName, participantOrdered[i+1].userName, participantOrdered[i].userUid, participantOrdered[i+1].userUid),result))
        }
        i++
        id += 1;
      }

      var round = addRound(title, seeds)
      board.push(round)
      
      var notCompleted = false;
      var previous = -1
      while (!notCompleted) {
        seeds = []
        previous = round.seeds.length
        var numberAux = Math.round(previous/2)

        for(var j=0; j<numberAux; j++) {

          if(j+1 === numberAux) {
            //SE ENTRA AQUI ESTA NO ULTMIO JOGO DA ROUND

            const isImpar = previous % 2;

            if(!isImpar){
            //SE O previous É PAR HA 2 JOGOS PARA CHECKAR
              console.log("É PAR")

              //APAGARRRRRRRRRRRRRRRRRRRRRRRRRR
              var gameToCheckNum = numberAux*2  

              //o primeiro jogo de check ta chill por isso fica waitting
              //o segundo jogo de check é que:
                var aux = round.seeds[round.seeds.length-1]

                var secondGameName = "Waiting"
                var secondGameUID = "Waiting"

                if(aux.checked) {
                  //se tiver checked inserir jogador
                  secondGameName = aux.teams[0].name
                  secondGameUID = aux.teams[0].uid

                } else {
                //senao waiting
                }
                

                seeds.push(addSeed(id, "Waiting", 
                addTeam("Waiting", 
                        secondGameName, 
                        "Waiting", 
                        secondGameUID),
                        result)) 




            } else {
            //ELSE SE O PREVIOUS E IMPAR SO HA UM JOGO PARA CHECKAR
              
              var auxImpar = round.seeds[round.seeds.length-1]


              if(auxImpar.checked) {
              //o jogo se tiver ckecked preencher so com este jogo e meter a checked
                //se nao tiver checked fica ambos a waiting

                seeds.push(addSeed(id, date, 
                  addSingleTeam(auxImpar.teams[0].name, 
                    auxImpar.teams[0].uid), "---", true))


              } else {
                console.log("ASDasdasdasd")
                console.log(previous)

                
                seeds.push(addSeed(id, "Waiting", 
                addTeam("Waiting", 
                      "Waiting", 
                      "Waiting", 
                      "Waiting"),
                      result, true)) 
                    
              }
            

            }
            





          } else {
            seeds.push(addSeed(id, "Waiting", 
            addTeam("Waiting", 
                    "Waiting", 
                    "Waiting", 
                    "Waiting"),
                    result)) 
          }
          
          id += 1;

        }

        roundNumber++
        title = "Round " + roundNumber
        round = addRound(title, seeds)
        if(previous !== 1){
          board.push(round)
        }

        if (numberAux === 1) {
          break;
        }

      }

      console.log(board)
      settournamentBoard(board)
    
      tournClicked.tournament_board = board
  
      var identification = -1;
      var count = 0;
  
      props.database.map((info) => {
        if (info.id === tournClicked["id"]) {
          identification = count;
        }
        count = count + 1;
      });
  
      props.writeNewPost(tournClicked, identification);
  
    }else {
      settournamentBoard(tournClicked.tournament_board)
    }

    settournamentLadder(true)

  }


  
  const onChangePage = (event) => {
    let marked = event.target.textContent;

    if (marked == 1) {
      setSlice(0);
    } else if (marked == 2) {
      setSlice(10);
    } else if (marked == 3) {
      setSlice(20);
    } else if (marked == 4) {
      setSlice(30);
    }
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

  const onClickTournment = (idClicked) => {
    setidClicked(idClicked);
    settournClicked(props.database.find((x) => x.id === idClicked));

    var aux = props.database.find((x) => x.id === idClicked)
    console.log(aux.participation_application_deadline)
    var varDate = new Date(aux.participation_application_deadline); 
    var today = new Date();
    console.log(varDate)
    console.log(today)

    if(varDate <= today) {
      settournamentInMovement(true)
    } else {
      settournamentInMovement(false)    
    }

  };

  const [discipline, setdiscipline] = useState("");
  const [Organizer, setOrganizer] = useState("");
  const [Time, setTime] = useState("");
  const [Application_Deadline, setApplication_Deadline] = useState("");
  const [Max_Participants, setMax_Participants] = useState("");
  const [Number_players, setNumber_players] = useState("");
  const [coordinatesLat, setcoordinatesLat] = useState("");
  const [coordinatesLong, setcoordinatesLong] = useState("");

  const seeAllTourn = () => {
    setidClicked("");
    settournClicked("");
    setdiscipline("");
    setOrganizer("");
    setTime("");
    setApplication_Deadline("");
    setMax_Participants("");
    setNumber_players("");
    setcoordinatesLat("");
    setcoordinatesLong("");
    settournamentInMovement(false)
    setEdit(false);
  };

  const [applyModal, setapplyModal] = useState(false);

  const [fullTournamentModal, setfullTournamentModal] = useState(false);

  const closeAlertFullTournamentModal = () => {
    setfullTournamentModal(false);
  };

  const [applyModalToAskLogIn, setapplyModalToAskLogIn] = useState(false);

  const closeapplyModalToAskLogIn = () => {
    setapplyModalToAskLogIn(false)
  }

  const applyToParticipate = () => {


    if(!user) {
      setapplyModalToAskLogIn(true)      
    }else {
      if (
        parseInt(tournClicked.number_of_ranked_players) == parseInt(tournClicked.max_participants)
      ) {
        setfullTournamentModal(true);
      } else {
        setapplyModal(true);
      }
    }



  };

  const cancelapplyToParticipate = () => {
    setapplyModal(false);
  };

  const finishApplyToParticipate = (licenseI, rankingI) => {
    setapplyModal(false);
    
    tournClicked.number_of_ranked_players = parseInt(tournClicked.number_of_ranked_players) + 1

    if(tournClicked.participantsDetails[0] === "none") {

      tournClicked.participantsDetails = [{userUid: user.uid,
                                          userName: user.displayName,
                                          license: licenseI,
                                          ranking: rankingI }]
    tournClicked.participants = [user.uid]

    }else {
      console.log("asdasdsd")
      tournClicked.participantsDetails = [...tournClicked.participantsDetails, {userUid: user.uid,
                                                                              userName: user.displayName,
                                                                              license: licenseI,
                                                                              ranking: rankingI }]
      tournClicked.participants = [...tournClicked.participants, user.uid]

    }

    console.log(tournClicked)


    var identification = -1;
    var count = 0;

    props.database.map((info) => {
      if (info.id === tournClicked["id"]) {
        identification = count;
      }
      count = count + 1;
    });

    props.writeNewPost(tournClicked, identification);

  };




  const onEditClicked = () => {
    setEdit(true);
    setdiscipline(tournClicked.discipline);
    setOrganizer(tournClicked.organizer);
    setTime(tournClicked.time);
    setApplication_Deadline(tournClicked.participation_application_deadline);
    setMax_Participants(tournClicked.max_participants);
    setNumber_players(tournClicked.number_of_ranked_players);
    setcoordinatesLat(tournClicked.google_maps_with_location.lat);
    setcoordinatesLong(tournClicked.google_maps_with_location.long);
   
  };

  const concludeEdit = () => {
    setEdit(false);

    tournClicked.discipline = discipline;
    tournClicked.time = Time;
    tournClicked.participation_application_deadline = Application_Deadline;
    tournClicked.max_participants = Max_Participants;
    tournClicked.number_of_ranked_players = Number_players;
    tournClicked.google_maps_with_location.lat = coordinatesLat;
    tournClicked.google_maps_with_location.long = coordinatesLong;

    var identification = -1;
    var count = 0;

    props.database.map((info) => {
      if (info.id === tournClicked["id"]) {
        identification = count;
      }
      count = count + 1;
    });

    props.writeNewPost(tournClicked, identification);

    setdiscipline("");
    setOrganizer("");
    setTime("");
    setApplication_Deadline("");
    setMax_Participants("");
    setNumber_players("");

  };

  const cancelEdit = () => {
    setEdit(false);
    setdiscipline("");
    setOrganizer("");
    setTime("");
    setApplication_Deadline("");
    setMax_Participants("");
    setNumber_players("");
    setcoordinatesLat(tournClicked.google_maps_with_location.lat);
    setcoordinatesLong(tournClicked.google_maps_with_location.long);
  };

  const onEditDiscipline = (event) => {
    setdiscipline(event.target.value);
  };

  const onEditTime = (event) => {
    setTime(event.target.value);
  };

  const onApplication_Deadline = (event) => {
    setApplication_Deadline(event.target.value);
  };

  const onMax_Participants = (event) => {
    if (Number_players > event.target.value) {
    } else {
      setMax_Participants(event.target.value);
    }
  };

  const onNumber_players = (event) => {
    setNumber_players(event.target.value);
  };

  const onMapClicked = (props) => {
    console.log(props);
  };

  const propagateBoard = (board) => {
    
    
    tournClicked.tournament_board = board;

    var identification = -1;
    var count = 0;

    props.database.map((info) => {
      if (info.id === tournClicked["id"]) {
        identification = count;
      }
      count = count + 1;
    });

    props.writeNewPost(tournClicked, identification);

  }

  const [filteraplied, setfilteraplied] = useState(false);
  const [tourselecl, settourselecl] = useState("");
  const [organizetournamentskeystate, setorganizetournamentskeystate] = useState(false);

  const onClickFilter = () => {
    setfilteraplied(true)
    settourselecl("Organized Tournaments")
    setorganizetournamentskeystate(true)
  }

  const onClickFilter2 = () => {
    setfilteraplied(true)
    settourselecl("Participant tournament")
    setorganizetournamentskeystate(false)
  }

  const returnpage = () => {
    setfilteraplied(false)
  }
  

  return (
    <>
      {idClicked === "" && (
        <>

        {!filteraplied ? 

        <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"100px", height: "400px"}}>
        <UnstyledButtonCustom name={"Tournaments I organized"} click={onClickFilter}></UnstyledButtonCustom>
        <UnstyledButtonCustom name={"Tournaments I'm participating in"} click={onClickFilter2}></UnstyledButtonCustom>

        </div>

        :

        <>

<div style={{ display: "flex", marginLeft:"10px" }}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                onClick={returnpage}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <h2>{tourselecl}</h2>
            </div>

          <div
            style={{
              marginTop: "45px",
              display: "flex",
              flexDirection: "row",
              gap: "40px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {slice === 0 &&
              props.database
                .filter((data) =>
                organizetournamentskeystate ? data.organizer_uid.includes(props.user.uid)
                :  data.participants.includes(props.user.uid)
                )
                .slice(0, 10)
                .map((info) => {
                  return (
                    <TournmentItem
                      key={info.id}
                      tournment={info}
                      onClickTournment={onClickTournment}
                    ></TournmentItem>
                  );
                })}

            {slice !== 0 &&
              props.database
              .filter((data) =>
              organizetournamentskeystate ? data.organizer_uid.includes(props.user.uid)
              :  data.participants.includes(props.user.uid)            )
                .slice(slice, slice + 10)
                .map((info) => {
                  return (
                    <TournmentItem
                      key={info.id}
                      tournment={info}
                      onClickTournment={onClickTournment}
                    ></TournmentItem>
                  );
                })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
              marginBottom: "20px",
            }}
          >
            {search === "" ? (
              <Pagination
                count={Math.ceil(props.database.length / 10)}
                onChange={onChangePage}
                hidePrevButton
                hideNextButton
              />
            ) : (
              <Pagination
                hidePrevButton
                hideNextButton
                count={Math.ceil(
                  props.database.filter((data) =>
                    data.name_tour.toLowerCase().includes(search.toLowerCase())
                  ).length / 10
                )}
                onChange={onChangePage}
              />
            )}
          </div>
          </>
           }
        </>
        
      )}

      {idClicked !== "" && (
        <div style={{ minHeight: "450px" }}>
          {!tournamentLadder ? 
          <div style={{ marginLeft: "10px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ display: "flex" }}>
                {!edit && (
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    onClick={seeAllTourn}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                )}
   

<div style={{display:"flex"}}>

<h2 style={{ marginLeft: edit ? "10px" : "0px", }}>
  {tournClicked.name_tour} 
</h2>
<h2 style={{ marginLeft: edit ? "10px" : "0px", color:"grey" }}>
{                tournamentInMovement && "-(In Progress)"}
</h2>
</div>


              </div>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginRight: "10px",
                  marginTop: "20px",
                }}
              >
                {user !== null && !tournamentInMovement &&
                  user.emailVerified &&
                  user.uid === tournClicked.organizer_uid &&
                  !edit && (
                    <IconButton
                      color="primary"
                      onClick={onEditClicked}
                      sx={{
                        color: "gray",
                        marginRight: "20px",
                        fontSize: "20px",
                      }}
                    >
                      <EditIcon /> Edit
                    </IconButton>
                  )}

                {!edit && !tournamentInMovement && user &&tournClicked.participants.indexOf(user.uid) === -1 &&(
                  <Button variant="contained" onClick={applyToParticipate}>
                    Applying to participate
                  </Button>
                )}

              {!edit && !tournamentInMovement && !user && (
                  <Button variant="contained" onClick={applyToParticipate}>
                    Applying to participate
                  </Button>
                )}

                {!edit && user && tournClicked.participants.indexOf(user.uid) !== -1 &&(
                  <Button variant="contained" disabled>
                    You are participating in this tournament
                  </Button>
                )}

                {!edit && tournamentInMovement &&(
                  <Button variant="contained" sx={{marginLeft:"5px"}} onClick={activateBoard}>
                    Tournament Board
                  </Button>
                )}


                {edit && (
                  <Button
                    sx={{
                      backgroundColor: "gray",
                      "&:hover": {
                        backgroundColor: "lightGrey",
                      },
                    }}
                    variant="contained"
                    onClick={cancelEdit}
                  >
                    <CloseIcon></CloseIcon>
                    Cancel
                  </Button>
                )}
                {edit && (
                  <Button
                    sx={{ marginLeft: "5px" }}
                    variant="contained"
                    onClick={concludeEdit}
                  >
                    <SaveIcon></SaveIcon>
                    Save
                  </Button>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{ height: "1px", width: "99%", backgroundColor: "grey" }}
              ></div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ marginLeft: "10px", marginTop: "15px" }}>
                <div style={{ color: "grey" }}>Discipline</div>

                {edit ? (
                  <TextField
                    id="standard-basic"
                    variant="standard"
                    sx={{ width: "250px" }}
                    value={discipline}
                    onChange={onEditDiscipline}
                  />
                ) : (
                  <div style={{ color: "black" }}>
                    {tournClicked.discipline}
                  </div>
                )}

                <div style={{ color: "grey", marginTop: "20px" }}>
                  Organizer
                </div>

                <div style={{ color: "black", marginTop: "8px" }}>
                  {tournClicked.organizer}
                </div>

                <div style={{ color: "grey", marginTop: "20px" }}>Time</div>
                {edit ? (
                  <TextField
                    id="standard-basic"
                    variant="standard"
                    sx={{ width: "250px" }}
                    value={Time}
                    type="time"
                    onChange={onEditTime}
                  />
                ) : (
                  tournClicked.time
                )}

                {edit && (
                  <>
                    <div style={{ color: "grey", marginTop: "10px" }}>
                      Map coordinates
                    </div>

                    <div style={{ display: "flex" }}>
                      <TextField
                        id="standard-basic"
                        sx={{ width: "120px" }}
                        variant="standard"
                        type="number"
                        value={coordinatesLat}
                        onChange={(event) => {
                          setcoordinatesLat(event.target.value);
                        }}
                        placeholder="Lat"
                      />
                      <TextField
                        id="standard-basic"
                        sx={{ width: "120px", marginLeft: "10px" }}
                        variant="standard"
                        value={coordinatesLong}
                        onChange={(event) => {
                          setcoordinatesLong(event.target.value);
                        }}
                        placeholder="Long"
                      />
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginLeft: edit ? "80px" : "250px" }}>
                <div style={{ color: "grey", marginTop: "15px" }}>
                  Application Deadline
                </div>
                <div style={{ color: "black" }}>
                  {edit ? (
                    <TextField
                      id="standard-basic"
                      sx={{ width: "250px" }}
                      type="date"
                      variant="standard"
                      value={Application_Deadline}
                      onChange={onApplication_Deadline}
                    />
                  ) : (
                    tournClicked.participation_application_deadline
                  )}
                </div>

                <div style={{ color: "grey", marginTop: "20px" }}>
                  Max Participants
                </div>
                <div style={{ color: "black" }}>
                  {edit ? (
                    <TextField
                      id="standard-basic"
                      type="number"
                      variant="standard"
                      value={Max_Participants}
                      sx={{ width: "250px" }}
                      onChange={onMax_Participants}
                    />
                  ) : (
                    tournClicked.max_participants
                  )}
                </div>

                <div style={{ color: "grey", marginTop: "20px" }}>
                  Number of ranked players
                </div>
                <div style={{ color: "black" }}>
                  {edit ? (
                    <TextField
                      id="standard-basic"
                      sx={{ width: "250px" }}
                      type="number"
                      disabled
                      variant="standard"
                      value={Number_players}
                      onChange={onNumber_players}
                    />
                  ) : (
                    tournClicked.number_of_ranked_players
                  )}
                </div>
              </div>
              <div style={{ marginRight: "100px" }}></div>
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
            <div style={{ marginTop: "20px", marginLeft: "10px" }}>
              <div style={{ color: "grey", fontWeight: "bold" }}>
                Sponsor logos
              </div>
              <div
                style={{
                  color: "black",
                  backgroundColor: "white",
                  marginTop: "10px",
                  height: "152px",
                  width: "48%",
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "10px",
                }}
              >
                {tournClicked.logo &&
                  tournClicked.logo.map((tourn) => {
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

                {console.log(tournClicked.logo)}
                {tournClicked.logo && tournClicked.logo.length === 0 && (
                  <div>No Sponsor logos</div>
                )}
                {!tournClicked.logo && <div>No Sponsor logos</div>}
              </div>
            </div>
          </div>
          :
          <div style={{ marginLeft: "10px" }}>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex" }}>
              {!edit && (
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={()=>{settournamentLadder(false)}}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
              )}

              <div style={{display:"flex"}}>

              <h2 style={{ marginLeft: edit ? "10px" : "0px", }}>
                {tournClicked.name_tour} 
              </h2>
              <h2 style={{ marginLeft: edit ? "10px" : "0px", color:"grey" }}>
              -(Tournament Board)
              </h2>
              </div>

              
            </div>
            
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{ height: "1px", width: "99%", backgroundColor: "grey" }}
              ></div>
            </div>
              
              <div style={{marginTop:"15px"}}>
              <TournamentLadder propagateBoard={propagateBoard} board={tournamentBoard} user={user} isParticipating={user && tournClicked.participants.indexOf(user.uid) !== -1 }></TournamentLadder>
            </div>

            </div>

          }
          
        </div>
      )}

      {applyModal && (
        <ApplyModal
          open={applyModal}
          cancelapplyToParticipate={cancelapplyToParticipate}
          finishApplyToParticipate={finishApplyToParticipate}
        ></ApplyModal>
      )}
      {fullTournamentModal && (
        <AlertModal
          open={fullTournamentModal}
          close={closeAlertFullTournamentModal}
          logIn={false}
          text={
            "This tournament is full. It is no longer possible to join this tournament. Sorry for the inconvenience caused!"
          }
        ></AlertModal>
      )}

      {applyModalToAskLogIn && 
              <AlertModal
              open={applyModalToAskLogIn}
              close={closeapplyModalToAskLogIn}
              logIn={true}
              text={
                "You need to be logged in to join tournaments. Please log in first!"
              }
            ></AlertModal>
            }


    </>
  );
}

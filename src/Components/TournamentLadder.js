import React, { useState, useEffect } from "react";

import { Bracket } from "react-brackets";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertModal2 from './Modals/AlertModal2';


export default function TournamentLadder(props) {
  const [tournamentParticipate, settournamentParticipate] = useState(null);
  const [drawResult, setdrawResult] = useState(false);

  const [board, setBoard] = useState(props.board);
  const [renderAux, setrenderAux] = useState(true);

  const [winner1, setresult1] = useState(false);
  const [winner2, setresult2] = useState(false);
  const [alertModal, setAlertModal] = useState(false);

  const closeAlertModal = ()=> {
    setAlertModal(false)
  }
  
  useEffect(() => {
    // Update the document title using the browser API
    if (props.user && props.isParticipating) findTournament();
  });

  const findTournament = (event) => {
    var iName = -1;
    var jName = -1;

    for (var i = 0; i < board.length; i++) {
      if (board[i].seeds) {
        for (var j = 0; j < board[i].seeds.length; j++) {
          for (var z = 0; z < board[i].seeds[j].teams.length; z++) {
            if (board[i].seeds[j].teams[z].uid === props.user.uid) {
                iName = i;
                jName = j;


            }
          }
        }
      }
    }

    settournamentParticipate(board[iName].seeds[jName]);
  };

  const clickWinner1 = () => {
    if (
      tournamentParticipate &&
      tournamentParticipate.insertedBy === props.user.uid
    ) {
    } else {
      setresult1(true);
      setresult2(false);
    }
  };

  const clickWinner2 = () => {
    if (
      tournamentParticipate &&
      tournamentParticipate.insertedBy === props.user.uid
    ) {
    } else {
      setresult1(false);
      setresult2(true);
    }
  };

  const insertResult = (event) => {
    if (!winner1 && !winner2) {
      setdrawResult(true);
    } else {
      var aux = board;

      console.log(tournamentParticipate.id);
      var toGo;
      var seed;
      var check = false;
      var toPosition;
      var winnerName;
      var winnerUid;

      for (var i = 0; i < board.length; i++) {
        if (board[i].seeds) {
          for (var j = 0; j < board[i].seeds.length; j++) {
            if (board[i].seeds[j].id === tournamentParticipate.id) {
              if (
                board[i].seeds[j].insertedBy !== "none" &&
                board[i].seeds[j].insertedBy !== props.user.uid
              ) {

                console.log(board[i].seeds[j].result)
                console.log(winner1
                  ? tournamentParticipate.teams[0].uid
                  : tournamentParticipate.teams[1].uid)
                console.log(winner1)
                console.log(winner2)

                
                if (
                  board[i].seeds[j].result === (winner1
                    ? tournamentParticipate.teams[0].uid
                    : tournamentParticipate.teams[1].uid)
                ) {
                  board[i].seeds[j].checked = true;
                  board[i].seeds[j].date = new Date().toDateString();
                  console.log(board[i].seeds.length)
                  if(board[i].seeds.length === 1) {
                    check = false;

                  } else {
                    check = true;

                  }
                  toGo = Math.floor(j / 2);
                  seed = i + 1;
                  toPosition = j;
                  winnerName = winner1
                    ? tournamentParticipate.teams[0].name
                    : tournamentParticipate.teams[1].name;
                  winnerUid = winner1
                    ? tournamentParticipate.teams[0].uid
                    : tournamentParticipate.teams[1].uid;
                } else {
                  board[i].seeds[j].insertedBy = "none";
                  board[i].seeds[j].result = "---";
                  setresult1(false);
                  setresult2(false);
                  setAlertModal(true);
                }
                //ver se os result match
              } else {
                board[i].seeds[j].insertedBy = props.user.uid;
                board[i].seeds[j].result = winner1
                  ? tournamentParticipate.teams[0].uid
                  : tournamentParticipate.teams[1].uid;
              }
            }
          }
        }
      }

      if (check) {
        if (toPosition % 2 === 0) {
          board[seed].seeds[toGo].teams[0].name = winnerName;
          board[seed].seeds[toGo].teams[0].uid = winnerUid;
        } else {
          board[seed].seeds[toGo].teams[1].name = winnerName;
          board[seed].seeds[toGo].teams[1].uid = winnerUid;
        }
      }

      console.log(board[board.length-1].seeds)


      console.log(board[board.length-1].seeds.length===1 && board[board.length-1].seeds[0].checked === true)

      props.propagateBoard(board)

      setrenderAux(!renderAux);
      setresult1(false);
      setresult2(false);
    }
  };

  return (
    <>
      {renderAux ? (
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: props.isParticipating ? "65%" : "100%",
              height: "450px",
              overflowX: "auto",
            }}
          >
            <Bracket rounds={board} mobileBreakpoint={92} />
          </div>

          {props.isParticipating && board[board.length-1].seeds[0].checked === false && tournamentParticipate && (tournamentParticipate.teams[0].name==="Waiting"||tournamentParticipate.teams[1].name==="Waiting") &&(
            <div style={{ width: "30%", height: "300px", marginTop: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: "95%",
                    height: 220,
                  },
                }}
              >
                <Paper elevation={3}>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      width: "100%",
                      height: "40px",
                      textAlign: "center",
                    }}
                  >
                    Waiting opponent
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",

                      flexWrap: "nowrap",
                      "& > :not(style)": {
                        m: 1,
                        width: "40%",
                        height: 100,
                      },
                    }}
                  >
                    <Paper
                      elevation={5}
                      sx={{
                        backgroundColor: tournamentParticipate &&tournamentParticipate.teams[1].name==="Waiting" ? "gray" : "white",
                        width: "40%",
                        lineHeight: "80px",
                        height: 100,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          width: "100%",
                          textAlign: "center",
                          wordWrap: "break-word",
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "normal",
                        }}
                      >
                        {tournamentParticipate &&
                          tournamentParticipate.teams[0].name}
                      </div>
                    </Paper>
                    <h4 style={{ width: "5%", marginTop: "40px" }}>vs</h4>
                    <Paper
                      elevation={5}
                      sx={{
                        backgroundColor: (tournamentParticipate &&tournamentParticipate.teams[0].name==="Waiting") ? "gray" : "white",
                        width: "40%",
                        lineHeight: "80px",
                        height: 100,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          width: "100%",
                          textAlign: "center",
                          wordWrap: "break-word",
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "normal",
                        }}
                      >
                        {tournamentParticipate &&
                          tournamentParticipate.teams[1].name}
                      </div>
                    </Paper>
                  </Box>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      bottom: "15px",
                    }}
                  >
                    {tournamentParticipate &&
                    tournamentParticipate.insertedBy === props.user.uid ? (
                      tournamentParticipate.checked ? (
                        <Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%" }}
                          variant="contained"
                        >
                          You lose!
                        </Button>
                      ) : (
                        <Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%" }}
                          variant="contained"
                        >
                          Waiting for opponent confirmation
                        </Button>
                      )
                    ) : (
                      <Button
                      disabled
                        onClick={insertResult}
                        sx={{ width: "90%" }}
                        variant="contained"
                      >
                        Insert Result
                      </Button>
                    )}
                  </div>
                </Paper>
                <div style={{ height: "50px" }}>
                  {drawResult && (
                    <Alert severity="error">Please select a winner</Alert>
                  )}
                </div>
              </Box>
            </div>
          )}


          {props.isParticipating  && board[board.length-1].seeds[0].checked === false && tournamentParticipate && !(tournamentParticipate.teams[0].name==="Waiting"||tournamentParticipate.teams[1].name==="Waiting") &&(
            <div style={{ width: "30%", height: "300px", marginTop: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: "95%",
                    height: 220,
                  },
                }}
              >
                <Paper elevation={3}>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      width: "100%",
                      height: "40px",
                      textAlign: "center",
                    }}
                  >
                    Insert Winner
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",

                      flexWrap: "nowrap",
                      "& > :not(style)": {
                        m: 1,
                        width: "40%",
                        height: 100,
                      },
                    }}
                  >
                    <Paper
                      elevation={5}
                      sx={{
                        backgroundColor: winner1 ? "#32B232" : "white",
                        width: "40%",
                        lineHeight: "80px",
                        height: 100,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: winner1 ? "#32B232" : "lightGrey",
                        },
                      }}
                      onClick={clickWinner1}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          width: "100%",
                          textAlign: "center",
                          wordWrap: "break-word",
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "normal",
                        }}
                      >
                        {tournamentParticipate &&
                          tournamentParticipate.teams[0].name}
                      </div>
                    </Paper>
                    <h4 style={{ width: "5%", marginTop: "40px" }}>vs</h4>
                    <Paper
                      elevation={5}
                      sx={{
                        backgroundColor: winner2 ? "#32B232" : "white",
                        width: "40%",
                        lineHeight: "80px",
                        height: 100,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: winner2 ? "#32B232" : "lightGrey",
                        },
                      }}
                      onClick={clickWinner2}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          width: "100%",
                          textAlign: "center",
                          wordWrap: "break-word",
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "normal",
                        }}
                      >
                        {tournamentParticipate &&
                          tournamentParticipate.teams[1].name}
                      </div>
                    </Paper>
                  </Box>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      bottom: "15px",
                    }}
                  >
                    {tournamentParticipate &&
                    tournamentParticipate.insertedBy === props.user.uid ? (
                      tournamentParticipate.checked ? (
                        <Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%" }}
                          variant="contained"
                        >
                          You lose!
                        </Button>
                      ) : (
                        <Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%" }}
                          variant="contained"
                        >
                          Waiting for opponent confirmation
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={insertResult}
                        sx={{ width: "90%" }}
                        variant="contained"
                      >
                        Insert Result
                      </Button>
                    )}
                  </div>
                </Paper>
                <div style={{ height: "50px" }}>
                  {drawResult && (
                    <Alert severity="error">Please select a winner</Alert>
                  )}
                </div>
              </Box>
            </div>
          )}

          {board[board.length-1].seeds.length===1 && board[board.length-1].seeds[0].checked === true &&
          (
            <div style={{ width: "30%", height: "300px", marginTop: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: "95%",
                    height: 220,
                  },
                }}
              >
                <Paper elevation={3}>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      width: "100%",
                      height: "40px",
                      textAlign: "center",
                    }}
                  >
                    Winner
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",

                      flexWrap: "nowrap",
                      "& > :not(style)": {
                        m: 1,
                        width: "80%",
                        height: 100,
                      },
                    }}
                  >
                    <Paper
                      elevation={5}
                      sx={{
                        backgroundColor:"#32B232" ,
                        width: "100%",
                        lineHeight: "80px",
                        height: 100,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          width: "100%",
                          textAlign: "center",
                          wordWrap: "break-word",
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "normal",
                        }}
                      >

                  {(board &&
                    board[board.length-1].seeds.length===1 && 
                    board[board.length-1].seeds[0].checked === true &&
                    board[board.length-1].seeds[0].teams[0].uid===board[board.length-1].seeds[0].result
                    
                    ) ? 
                    
                    board[board.length-1].seeds[0].teams[0].name
                    
                    : 
                    board[board.length-1].seeds[0].teams[1].name
                    }

                      
                      </div>
                    </Paper>

                  </Box>


                  {<div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      bottom: "15px",
                    }}
                  >

                    {(board &&
                    board[board.length-1].seeds.length===1 && board[board.length-1].seeds[0].checked === true &&
                    board[board.length-1].seeds[0].result === props.user.uid
                    
                    ) ?
                      
                      
<Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%", backgroundColor:"green", marginTop:"25px" }}
                          variant="contained"
                        >
                          You win!!!
                        </Button>
                      
                      
                      :
                      
                      
<Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%", backgroundColor:"green", marginTop:"25px" }}
                          variant="contained"
                        >
                          You lose!!!
                        </Button>
                    
                    
                    }


                  </div>}
                
                
                
                
                
                </Paper>

              </Box>
            </div>


          )}








        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: props.isParticipating ? "65%" : "100%",
              height: "450px",
              overflowX: "auto",
            }}
          >
            <Bracket rounds={board} mobileBreakpoint={92} />
          </div>

          {props.isParticipating && board[board.length-1].seeds[0].checked === false && tournamentParticipate && (tournamentParticipate.teams[0].name==="Waiting"||tournamentParticipate.teams[1].name==="Waiting") &&(
            <div style={{ width: "30%", height: "300px", marginTop: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: "95%",
                    height: 220,
                  },
                }}
              >
                <Paper elevation={3}>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      width: "100%",
                      height: "40px",
                      textAlign: "center",
                    }}
                  >
                    Waiting opponent
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",

                      flexWrap: "nowrap",
                      "& > :not(style)": {
                        m: 1,
                        width: "40%",
                        height: 100,
                      },
                    }}
                  >
                    <Paper
                      elevation={5}
                      sx={{
                        backgroundColor: tournamentParticipate &&tournamentParticipate.teams[1].name==="Waiting" ? "gray" : "white",
                        width: "40%",
                        lineHeight: "80px",
                        height: 100,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          width: "100%",
                          textAlign: "center",
                          wordWrap: "break-word",
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "normal",
                        }}
                      >
                        {tournamentParticipate &&
                          tournamentParticipate.teams[0].name}
                      </div>
                    </Paper>
                    <h4 style={{ width: "5%", marginTop: "40px" }}>vs</h4>
                    <Paper
                      elevation={5}
                      sx={{
                        backgroundColor: (tournamentParticipate &&tournamentParticipate.teams[0].name==="Waiting") ? "gray" : "white",
                        width: "40%",
                        lineHeight: "80px",
                        height: 100,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          width: "100%",
                          textAlign: "center",
                          wordWrap: "break-word",
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "normal",
                        }}
                      >
                        {tournamentParticipate &&
                          tournamentParticipate.teams[1].name}
                      </div>
                    </Paper>
                  </Box>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      bottom: "15px",
                    }}
                  >
                    {tournamentParticipate &&
                    tournamentParticipate.insertedBy === props.user.uid ? (
                      tournamentParticipate.checked ? (
                        <Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%" }}
                          variant="contained"
                        >
                          You lose
                        </Button>
                      ) : (
                        <Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%" }}
                          variant="contained"
                        >
                          Waiting for opponent confirmation
                        </Button>
                      )
                    ) : (
                      <Button
                      disabled
                        onClick={insertResult}
                        sx={{ width: "90%" }}
                        variant="contained"
                      >
                        Insert Result
                      </Button>
                    )}
                  </div>
                </Paper>
                <div style={{ height: "50px" }}>
                  {drawResult && (
                    <Alert severity="error">Please select a winner</Alert>
                  )}
                </div>
              </Box>
            </div>
          )}


          {props.isParticipating  && board[board.length-1].seeds[0].checked === false && tournamentParticipate && !(tournamentParticipate.teams[0].name==="Waiting"||tournamentParticipate.teams[1].name==="Waiting") &&(
            <div style={{ width: "30%", height: "300px", marginTop: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: "95%",
                    height: 220,
                  },
                }}
              >
                <Paper elevation={3}>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      width: "100%",
                      height: "40px",
                      textAlign: "center",
                    }}
                  >
                    Insert Winner
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",

                      flexWrap: "nowrap",
                      "& > :not(style)": {
                        m: 1,
                        width: "40%",
                        height: 100,
                      },
                    }}
                  >
                    <Paper
                      elevation={5}
                      sx={{
                        backgroundColor: winner1 ? "#32B232" : "white",
                        width: "40%",
                        lineHeight: "80px",
                        height: 100,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: winner1 ? "#32B232" : "lightGrey",
                        },
                      }}
                      onClick={clickWinner1}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          width: "100%",
                          textAlign: "center",
                          wordWrap: "break-word",
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "normal",
                        }}
                      >
                        {tournamentParticipate &&
                          tournamentParticipate.teams[0].name}
                      </div>
                    </Paper>
                    <h4 style={{ width: "5%", marginTop: "40px" }}>vs</h4>
                    <Paper
                      elevation={5}
                      sx={{
                        backgroundColor: winner2 ? "#32B232" : "white",
                        width: "40%",
                        lineHeight: "80px",
                        height: 100,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: winner2 ? "#32B232" : "lightGrey",
                        },
                      }}
                      onClick={clickWinner2}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          width: "100%",
                          textAlign: "center",
                          wordWrap: "break-word",
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "normal",
                        }}
                      >
                        {tournamentParticipate &&
                          tournamentParticipate.teams[1].name}
                      </div>
                    </Paper>
                  </Box>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      bottom: "15px",
                    }}
                  >
                    {tournamentParticipate &&
                    tournamentParticipate.insertedBy === props.user.uid ? (
                      tournamentParticipate.checked ? (
                        <Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%" }}
                          variant="contained"
                        >
                          You lose!
                        </Button>
                      ) : (
                        <Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%" }}
                          variant="contained"
                        >
                          Waiting for opponent confirmation
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={insertResult}
                        sx={{ width: "90%" }}
                        variant="contained"
                      >
                        Insert Result
                      </Button>
                    )}
                  </div>
                </Paper>
                <div style={{ height: "50px" }}>
                  {drawResult && (
                    <Alert severity="error">Please select a winner</Alert>
                  )}
                </div>
              </Box>
            </div>
          )}

          {board[board.length-1].seeds.length===1 && board[board.length-1].seeds[0].checked === true &&
          (
            <div style={{ width: "30%", height: "300px", marginTop: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: "95%",
                    height: 220,
                  },
                }}
              >
                <Paper elevation={3}>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      width: "100%",
                      height: "40px",
                      textAlign: "center",
                    }}
                  >
                    Winner
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",

                      flexWrap: "nowrap",
                      "& > :not(style)": {
                        m: 1,
                        width: "80%",
                        height: 100,
                      },
                    }}
                  >
                    <Paper
                      elevation={5}
                      sx={{
                        backgroundColor:"#32B232" ,
                        width: "100%",
                        lineHeight: "80px",
                        height: 100,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          width: "100%",
                          textAlign: "center",
                          wordWrap: "break-word",
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "normal",
                        }}
                      >

                  {(board &&
                    board[board.length-1].seeds.length===1 && 
                    board[board.length-1].seeds[0].checked === true &&
                    board[board.length-1].seeds[0].teams[0].uid===board[board.length-1].seeds[0].result
                    
                    ) ? 
                    
                    board[board.length-1].seeds[0].teams[0].name
                    
                    : 
                    board[board.length-1].seeds[0].teams[1].name
                    }

                      
                      </div>
                    </Paper>

                  </Box>


                  {<div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      bottom: "15px",
                    }}
                  >

                    {(board &&
                    board[board.length-1].seeds.length===1 && board[board.length-1].seeds[0].checked === true &&
                    board[board.length-1].seeds[0].result === props.user.uid
                    
                    ) ?
                      
                      
<Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%", backgroundColor:"green", marginTop:"25px" }}
                          variant="contained"
                        >
                          You win!!!
                        </Button>
                      
                      
                      :
                      
                      
<Button
                          disabled
                          onClick={insertResult}
                          sx={{ width: "90%", backgroundColor:"green", marginTop:"25px" }}
                          variant="contained"
                        >
                          You lose!!!
                        </Button>
                    
                    
                    }


                  </div>}
                
                
                
                
                
                </Paper>

              </Box>
            </div>


          )}








        </div>
      )}

      {alertModal && <AlertModal2 open={alertModal} close={closeAlertModal} text={"The two results entered by the players do not match. Please insert the result again."}></AlertModal2>}

    </>
  );
}

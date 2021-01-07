import { GET_NOTES } from "./types";
import { GET_QUE, CLEAR_QUE, ADD_QUE, ADD_OBJ } from "./types";
import axios from "axios";

export const getNotes = (noteBag) => (dispatch) => {
  for (var i = 0; i < noteBag.length; i++) {
    //question id has to be unique
    axios
      .get("api/notes?questionid=" + noteBag[i].question.id)
      .then((res) => {
        dispatch({
          type: GET_NOTES,
          id: i,
          payload_noteArray: res.data,
        });
      })
      .catch((err) => console.log(err));
  }
};
//getQuestion(Meta id) => reducer
// dispatch/action (actions/note.js, types.js )
// reducer (reducers/note.js, index.js)
//  WikiNotebook.js
export const getQuestion = (metaid) => (dispatch) => {
  //get question array depend on coursemetaid
  dispatch({
    type: CLEAR_QUE,
  });

  axios
    .get("api/questions?coursemetaid=" + metaid)
    //res = question array -> json
    .then((questions) => {
      //console.log(questions.data);
      questions.data.map((item, index) => {
        axios
          .get("api/notes?questionid=" + item.id)
          .then((notes) => {
            dispatch({
              type: GET_QUE,
              noteBagItem: {
                id: index,
                question: item,
                notes: notes.data,
              },
            });
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
};

//this is actually add a note to a question
export const addQuestion = (nbObj, notebookObj) => (dispatch) =>{
    console.log("get to addquestion")
    dispatch({
        type: ADD_QUE,
        notebagObj: nbObj,
        notebookObj: notebookObj
    })
}

//this is for adding a new question object
export const addOBJ = (queObj) => (dispatch) =>{
    console.log("get to addobject")
    dispatch({
            type: ADD_OBJ,
            queObj: queObj
    })
}
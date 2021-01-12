import { GET_QUE, CLEAR_QUE, ADD_QUE, ADD_OBJ, LOAD_QUE } from "../actions/types.js";

const initialState = {
  noteBag: [],
};

// [1, 2, 3]
// {}

export default function (state = initialState, action) {
  //console.log(action.payload);

  switch (action.type) {
    case LOAD_QUE:
        let newBag = [...state.noteBag];
        newBag.push(action.noteBagItem)
        //console.log("from load_que")
        //console.log(newBag)
        return{
            noteBag: newBag,
        };
    case GET_QUE:
      //action.payload: note array to one question
      //console.log(action.length)
      let newBag2 = [...state.noteBag];
      newBag2[action.index].notes = action.notes;
      //console.log("from get_que")
      //console.log(newBag2[action.index].notes)
      return {
        noteBag: newBag2,
      };
    case CLEAR_QUE:
      return {
        noteBag: [],
      };
    case ADD_OBJ:
        let newBag4 = [...state.noteBag];
        newBag4.unshift(action.queObj);
        //console.log("from addobj");
        //console.log(newBag4);
        return{
            noteBag: newBag4
        };
    case ADD_QUE:
        let newBag3 = [...state.noteBag];
        let newnbObj = action.notebagObj;
        let newnotebookObj = action.notebookObj;
        console.log(newnotebookObj);
        let indexOfObj = newBag3.findIndex(obj => obj.question.id == newnbObj.question.id);
        newBag3[indexOfObj].notes.unshift(newnotebookObj);
        console.log(indexOfObj);
        console.log(" from add que");
        //console.log("from que");
        //console.log(newBag3);
        return{
            noteBag: newBag3
        };
    default:
      return state;
  }
}

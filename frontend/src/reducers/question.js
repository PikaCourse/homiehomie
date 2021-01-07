import { GET_QUE, CLEAR_QUE, ADD_QUE, ADD_QUE } from "../actions/types.js";

const initialState = {
  noteBag: [],
};

// [1, 2, 3]
// {}

export default function (state = initialState, action) {
  //console.log(action.payload);

  switch (action.type) {
    case GET_QUE:
      //action.payload: note array to one question
      let newBag2 = [...state.noteBag];
      newBag2.push(action.noteBagItem);
      return {
        noteBag: newBag2,
      };
    case CLEAR_QUE:
      return {
        noteBag: [],
      };
    case ADD_OBJ:
        return{

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

import {
  GET_QUE,
  CLEAR_QUE,
  ADD_QUE,
  ADD_OBJ,
  LOAD_QUE,
} from "../actions/types.js";

const initialState = {
  noteBag: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_QUE:
      let newBag = [...state.noteBag];
      newBag.push(action.noteBagItem);
      return {
        noteBag: newBag,
      };
    case GET_QUE:
      let newBag2 = [...state.noteBag];
      newBag2[action.index].notes = action.notes;
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

      return {
        noteBag: newBag4,
      };
    case ADD_QUE:
      let newBag3 = [...state.noteBag];
      let newnbObj = action.notebagObj;
      let newnotebookObj = action.notebookObj;
      let indexOfObj = newBag3.findIndex(
        (obj) => obj.question.id == newnbObj.question.id
      );
      newBag3[indexOfObj].notes.unshift(newnotebookObj);

      return {
        noteBag: newBag3,
      };
    default:
      return state;
  }
}

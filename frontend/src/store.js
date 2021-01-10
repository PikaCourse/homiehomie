import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import {loadState, saveState} from '../src/helper/localStorage'

const initialState = {};

const middleware = [thunk];

console.log("loadState()");
console.log(loadState());

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

store.subscribe(() => {
  saveState(store.getState().calendar.calendarCourseBag);
});
console.log("rootReducer.wishlist"); 
console.log(store.getState().calendar.calendarCourseBag); 

export default store;

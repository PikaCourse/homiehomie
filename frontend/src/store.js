import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import {loadState, saveState, loadCalendarCourseBag} from '../src/helper/localStorage'

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

store.subscribe((listener) => {
  saveState("calendarCourseBag", store.getState().calendar.calendarCourseBag);
  saveState("wishlistCourseBag", store.getState().wishlist.wishlistCourseBag);
  // console.log(listener.getState()); 
});

export default store;

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import {loadState, saveState, loadCalendarCourseBag} from '../src/helper/localStorage'

const initialState = {};

const middleware = [thunk];

// TODO Need to specify what kinds of data to store in the store
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

store.subscribe((listener) => {
  saveState("calendar/courseSchedule", store.getState().calendar.courseSchedule);
  saveState("calendar/customEvents", store.getState().calendar.customEvents);
  saveState("wishlistCourseBag", store.getState().wishlist.wishlistCourseBag);
});

export default store;

import {
  ADD_COURSE_TO_CAL,
  REMOVE_COURSE_FROM_CAL,
  UPDATE_COURSE_IN_CAL,
  PREVIEW_COURSE_IN_CAL,
  CLEAR_PREVIEW_COURSE_IN_CAL,
  ADD_CUS_EVENT_IN_CAL,
} from "../actions/types.js";
const initialState = {
  // calendarCourseBag: [],
  calendarCourseBag: [],
  calenderCusEventBag: [], 
};

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

const today = new Date();

function alignDate(weekDayIndex, timestamp) {
  let date = new Date(today.toDateString() + ", " + timestamp);
  return new Date(
    getMonday(date).setDate(getMonday(date).getDate() + weekDayIndex)
  );
}

function addNewCourseToBag(state, action, update) {
  let newBag = update
    ? state.calendarCourseBag.filter(
        (item) => (item.raw.selectedCourseArray != action.selectedCourseArray)//||(item.id != -1)
      )
    : [...state.calendarCourseBag];
  let idList = state.calendarCourseBag.map((a) => a.id);
  let newId = update
    ? action.oldId
    : state.calendarCourseBag.length == 0
    ? 0
    : Math.max(...idList) + 1;

  action.selectedCourse.time.map((timeslot) => {
    newBag.push({
      type: 'course', 
      id: newId,
      title: action.selectedCourse.course_meta.title,
      allDay: false,
      start: alignDate(timeslot.weekday, timeslot.start_at),
      end: alignDate(timeslot.weekday, timeslot.end_at),
      raw: {
        crn: action.selectedCourse.crn,
        name: action.selectedCourse.course_meta.name,
        instructor: action.selectedCourse.professor,
        course: action.selectedCourse,
        selectedCourseArray: action.selectedCourseArray,
      },
    });
  });
  return newBag;
}

function previewNewCourseToBag(state, action) {
  var newBag = [...state.calendarCourseBag];

  newBag = state.calendarCourseBag.filter((item) => ((item.id != -1) && (item.raw.crn != action.selectedCourse.crn)));

  console.log(action.selectedCourse); 

  action.selectedCourse.time.map((timeslot) => {
    newBag.push({
      type: 'preview', 
      id: -1,
      title: action.selectedCourse.course_meta.title,
      allDay: false,
      start: alignDate(timeslot.weekday, timeslot.start_at),
      end: alignDate(timeslot.weekday, timeslot.end_at),
      raw: {
        crn: action.selectedCourse.crn,
        name: action.selectedCourse.course_meta.name,
        instructor: action.selectedCourse.professor,
        course: action.selectedCourse,
        selectedCourseArray: action.selectedCourseArray,
      },
    });
  });

  return newBag;
}

function addNewCusEventToBag(state, action) {
  console.log("add cus in reducer"); 
  var tempArray = [...state.calenderCusEventBag];
  let update = false; 

  tempArray = tempArray.map((existingEvent) => {
    if (existingEvent.id == action.event.id)
    {
      existingEvent.start = action.event.start; 
      existingEvent.end = action.event.end; 
      update = true; 
    }
    return existingEvent;
    // return existingEvent.id == event.id
    //   ? { ...existingEvent, start, end }
    //   : existingEvent;
  });
  if (update) {
    return tempArray; 
  }

  // tempArray = tempArray.filter(
  //   (item) =>
  //     item.id !=
  //     action.event.id
  // ); 

  // console.log(tempArray); 
  
  // console.log(tempArray); 
  //tempArray = state.calendarCourseBag.filter((item) => item.calendarId != -1);

  // let id = 0;
  // if (state.calendarCourseBag.length != 0) {
  //   id = state.calendarCourseBag[state.calendarCourseBag.length - 1].id + 1;
  // }
  let idList = state.calendarCourseBag.map((a) => a.id);
  let newId = state.calendarCourseBag.length == 0
    ? 0
    : Math.max(...idList) + 1;
  action.event.id = newId;
  tempArray.push(action.event);

  return tempArray;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_COURSE_TO_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCourseToBag(state, action, false),
      };

    case REMOVE_COURSE_FROM_CAL:
      return {
        ...state,
        calendarCourseBag: state.calendarCourseBag.filter(
          (item) => item.raw.selectedCRN != action.selectedCRN
        ), //assume CRN is unique!!
      };
    case UPDATE_COURSE_IN_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCourseToBag(state, action, true),
      };

    case PREVIEW_COURSE_IN_CAL:
      return {
        ...state,
        calendarCourseBag: previewNewCourseToBag(state, action),
      };

    case CLEAR_PREVIEW_COURSE_IN_CAL:
      return {
        ...state,
        calendarCourseBag: state.calendarCourseBag.filter(
          (item) => item.id != -1
        ),
      };

    case ADD_CUS_EVENT_IN_CAL:
      return {
        ...state,
        calenderCusEventBag: addNewCusEventToBag(state, action),
      };

    default:
      return state;
  }
}

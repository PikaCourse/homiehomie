import {
  ADD_COURSE_TO_CAL,
  REMOVE_COURSE_FROM_CAL,
  UPDATE_COURSE_IN_CAL,
  PREVIEW_COURSE_IN_CAL,
  CLEAR_PREVIEW_COURSE_IN_CAL,
} from "../actions/types.js";
const initialState = {
  calendarCourseBag: [],
};

function alignDate(weekDayIndex) {
  let today = new Date(2015, 3, 13);
  today.setDate(today.getDate() + weekDayIndex);
  return today;
}

function addNewCourseToBag(state, action, update) {
  var tempArray = [...state.calendarCourseBag];

  const selectedCourse = action.selectedCourseArray.find(
    ({ crn }) => crn === action.selectedCRN
  );

  if (update) {
    tempArray = state.calendarCourseBag.filter(
      (item) => item.title != selectedCourse.course_meta.name
    );
  }

  let id = 0;
  if (state.calendarCourseBag.length != 0) {
    id = state.calendarCourseBag[state.calendarCourseBag.length - 1].id + 1;
  }

  var timeArray = selectedCourse.time;
  for (var i = 0; i < timeArray.length; i++) {
    let startTime = alignDate(timeArray[i].weekday);
    let tempStartArray = timeArray[i].start_at.split(":");
    startTime.setHours(parseFloat(tempStartArray[0]));
    startTime.setMinutes(parseFloat(tempStartArray[1]));

    let endTime = alignDate(timeArray[i].weekday);
    tempStartArray = timeArray[i].end_at.split(":");
    endTime.setHours(parseFloat(tempStartArray[0]));
    endTime.setMinutes(parseFloat(tempStartArray[1]));

    tempArray.push({
      id: id,
      calendarId: id,
      title: selectedCourse.course_meta.name,
      allDay: false,
      start: startTime,
      end: endTime,
      crn: selectedCourse.course_meta.crn,
      raw: {
        selectedCRN: action.selectedCRN,
        selectedCourseArray: action.selectedCourseArray,
      },
    });
  }

  return tempArray;
}

function previewNewCourseToBag(state, action) {
  var tempArray = [...state.calendarCourseBag];

  tempArray = state.calendarCourseBag.filter((item) => item.calendarId != -1);

  const selectedCourse = action.selectedCourseArray.find(
    ({ crn }) => crn === action.selectedCRN
  );
  let id = 0;
  if (state.calendarCourseBag.length != 0) {
    id = state.calendarCourseBag[state.calendarCourseBag.length - 1].id + 1;
  }

  var timeArray = selectedCourse.time;
  for (var i = 0; i < timeArray.length; i++) {
    let startTime = alignDate(timeArray[i].weekday);
    let tempStartArray = timeArray[i].start_at.split(":");
    startTime.setHours(parseFloat(tempStartArray[0]));
    startTime.setMinutes(parseFloat(tempStartArray[1]));

    let endTime = alignDate(timeArray[i].weekday);
    tempStartArray = timeArray[i].end_at.split(":");
    endTime.setHours(parseFloat(tempStartArray[0]));
    endTime.setMinutes(parseFloat(tempStartArray[1]));

    tempArray.push({
      id: id,
      calendarId: -1,
      title: selectedCourse.course_meta.name,
      allDay: false,
      start: startTime,
      end: endTime,
      crn: selectedCourse.course_meta.crn,
      raw: {
        selectedCRN: action.selectedCRN,
        selectedCourseArray: action.selectedCourseArray,
      },
    });
  }

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
          (item) => item.calendarId != -1
        ),
      };

    default:
      return state;
  }
}

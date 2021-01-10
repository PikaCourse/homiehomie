import {
  ADD_COURSE_TO_CAL,
  REMOVE_COURSE_FROM_CAL,
  UPDATE_COURSE_IN_CAL,
  // PREVIEW_COURSE_IN_CAL,
  // CLEAR_PREVIEW_COURSE_IN_CAL,
  ADD_CUS_EVENT_IN_CAL,
  DO_NOTHING, 
  REMOVE_CUS_EVENT_IN_CAL, 
  ADD_COURSE_TO_WISH, 
  REMOVE_COURSE_FROM_WISH, 
  // UPDATE_PREVIEW,
  // CLEAR_PREVIEW
} from "../actions/types.js";
import {loadState, saveState} from '../../src/helper/localStorage'

const initialState = {
  calendarCourseBag: loadState(),
  pendingCourseBag: [],
  uniqueCourseBag: [],  
  listFormattedBag: [], 
};

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + 1; // adjust when day is sunday
  return new Date(d.setDate(diff));
}

const today = new Date();

function alignDate(weekDayIndex, timestamp) {
  let date = new Date(today.toDateString() + ", " + timestamp);
  return new Date(
    getMonday(date).setDate(getMonday(date).getDate() + weekDayIndex)
  );
}

function updateUniqueCourseBag(state) {
  state.uniqueCourseBag = Array.from(new Set(state.calendarCourseBag.map(a => a.title)))
      .map(title => {
        return state.calendarCourseBag.find(a => a.title === title)
      }); 
  state.calendarCourseBag.filter(
    (item) => (item.type == 'course')
  )
}

function addNewCourseToBag(state, action, update) {
  let newBag = update ?
    state.calendarCourseBag.filter(
      (item) => (item.raw.selectedCourseArray != action.selectedCourseArray)
    ) :
    [...state.calendarCourseBag];
  let idList = state.calendarCourseBag.map((a) => a.id);
  let newId = update ?
    action.oldId :
    state.calendarCourseBag.length == 0 ?
    0 :
    Math.max(...idList) + 1;

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

function updateListFormattedBag(state, action) {
  const uniqueCoursesBag = getUniqueCourses(state.calendarCourseBag); // ...state.pendingCourseBag]; 
  let newListFormattedBag = []; 

  uniqueCoursesBag.forEach(function (course, index) {
    let timeStr = 'yet to implement'; //need to be edited 
    let semesterStr = course.raw.course.year + course.raw.course.semester; 
    newListFormattedBag.push({
      key: index + 1,
      id: index + 1,
      crn: course.raw.crn, 
      time: timeStr, 
      capacity: course.raw.course.capacity, 
      registered: course.raw.course.registered, 
      type: course.raw.course.type, 
      professor: course.raw.instructor, 
      semester: semesterStr,  
      location: course.raw.course.location, 
      title: course.title, 
      name: course.raw.name, 
      credit_hours: course.raw.course.course_meta.credit_hours, 
      description: course.raw.course.course_meta.description, 
      tags: course.raw.course.course_meta.tags, 
      college: course.raw.course.course_meta.college, 
      selectedCourseArray: course.raw.selectedCourseArray, 
  }); 
  }); 

  state.pendingCourseBag.forEach(function (course, index) {
    let timeStr = 'yet to implement'; //need to be edited 
    let semesterStr = course.year + course.semester; 
    newListFormattedBag.push({
      key: uniqueCoursesBag.length + index,
      id: uniqueCoursesBag.length + index,
      crn: course.crn, 
      time: timeStr, 
      capacity: course.capacity, 
      registered: course.registered, 
      type: course.type, 
      professor: course.professor, 
      semester: semesterStr,  
      location: course.location, 
      title: course.course_meta.title, 
      name: course.course_meta.name, 
      credit_hours: course.course_meta.credit_hours, 
      description: course.course_meta.description, 
      tags: course.course_meta.tags, 
      college: course.course_meta.college, 
      selectedCourseArray: course.selectedCourseArray, 
  }); 
  }); 

  return newListFormattedBag; 
}

// function previewNewCourseToBag(state, action) {
//   var newBag = [...state.calendarCourseBag];
//   newBag = state.calendarCourseBag.filter((item) => ((item.type != 'preview') ));

//   action.selectedCourse.time.map((timeslot) => {
//     newBag.push({
//       type: 'preview',
//       id: -1,
//       title: action.selectedCourse.course_meta.title,
//       allDay: false,
//       start: alignDate(timeslot.weekday, timeslot.start_at),
//       end: alignDate(timeslot.weekday, timeslot.end_at),
//       raw: {
//         crn: action.selectedCourse.crn,
//         name: action.selectedCourse.course_meta.name,
//         instructor: action.selectedCourse.professor,
//         course: action.selectedCourse,
//         selectedCourseArray: action.selectedCourseArray,
//       },
//     });
//   });

//   return newBag;
// }

function addNewCusEventToBag(state, action) {
  console.log("add cus in reducer");
  var tempArray = [...state.calendarCourseBag];
  let update = false;

  tempArray = tempArray.map((existingEvent) => {
    if (existingEvent.id == action.event.id) {
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
  let newId = state.calendarCourseBag.length == 0 ?
    0 :
    Math.max(...idList) + 1;
  action.event.id = newId;
  tempArray.push(action.event);

  return tempArray;
}

function addNewCourseToWish(state, action)
{
  console.log("addNewCourseToWish ran"); 
    var tempArray = [...state.pendingCourseBag];

    const selectedCourse = action.selectedCourseArray.find(
        ({ crn }) => crn === action.selectedCRN
    );

    let timeStr = 'yet to implement'; //need to be edited 
    let semesterStr = selectedCourse.year + selectedCourse.semester; 
    tempArray.push({
        key: state.pendingCourseBag.length + 1,
        id: state.pendingCourseBag.length + 1,
        crn: selectedCourse.crn, 
        time: timeStr, 
        capacity: selectedCourse.capacity, 
        registered: selectedCourse.registered, 
        type: selectedCourse.type, 
        professor: selectedCourse.professor, 
        semester: semesterStr,  
        location: selectedCourse.location, 
        title: selectedCourse.course_meta.title, 
        name: selectedCourse.course_meta.name, 
        credit_hours: selectedCourse.course_meta.credit_hours, 
        description: selectedCourse.course_meta.description, 
        tags: selectedCourse.course_meta.tags, 
        college: selectedCourse.course_meta.college, 
        selectedCourseArray: action.selectedCourseArray, 
    });
    return tempArray;
}

function getUniqueCourses(courseBag) {
  let uniqueCourseBag = Array.from(new Set(courseBag.map(a => a.title)))
      .map(title => {
        return courseBag.find(a => a.title === title)
      }); 
      uniqueCourseBag.filter(
    (item) => (item.type == 'course')
  ); 
  return uniqueCourseBag; 
}

function addCurrCourseToWish(state, action)
{
  console.log("addNewCourseToWish ran"); 
    let newPendingCourseBag = [...state.pendingCourseBag];

    const selectedCourse = action.selectedCourseArray.find(
        ({ crn }) => crn === action.selectedCRN
    );

    let copySelectedCourse = {...selectedCourse}; 
    copySelectedCourse.selectedCourseArray = action.selectedCourseArray; 

    // let timeStr = 'yet to implement'; //need to be edited 
    // let semesterStr = selectedCourse.year + selectedCourse.semester; 
    // tempArray.push({
    //     key: state.pendingCourseBag.length + 1,
    //     id: state.pendingCourseBag.length + 1,
    //     crn: selectedCourse.crn, 
    //     time: timeStr, 
    //     capacity: selectedCourse.capacity, 
    //     registered: selectedCourse.registered, 
    //     type: selectedCourse.type, 
    //     professor: selectedCourse.professor, 
    //     semester: semesterStr,  
    //     location: selectedCourse.location, 
    //     title: selectedCourse.course_meta.title, 
    //     name: selectedCourse.course_meta.name, 
    //     credit_hours: selectedCourse.course_meta.credit_hours, 
    //     description: selectedCourse.course_meta.description, 
    //     tags: selectedCourse.course_meta.tags, 
    //     college: selectedCourse.course_meta.college, 
    //     selectedCourseArray: action.selectedCourseArray, 
    // });

    newPendingCourseBag.push(copySelectedCourse); 
    return newPendingCourseBag;
}

function removeCourseFromWish(state, action)
{
    var tempArray = [...state.pendingCourseBag];

    tempArray = state.pendingCourseBag.filter((item) =>
        item.id != action.id);

    for (let i = 0; i < tempArray.length; i++)
    {
        tempArray[i].id = i+1; 
    }

    return tempArray;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_COURSE_TO_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCourseToBag(state, action, false),
        listFormattedBag: updateListFormattedBag(state, action), 
      };

    case REMOVE_COURSE_FROM_CAL:
      return {
        ...state,
        calendarCourseBag: state.calendarCourseBag.filter(
            (item) => item.raw.crn != action.selectedCRN
          ), //assume CRN is unique!!
          listFormattedBag: updateListFormattedBag(state, action), 
      };
    case UPDATE_COURSE_IN_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCourseToBag(state, action, true),
        listFormattedBag: updateListFormattedBag(state, action), 
      };

    // case UPDATE_PREVIEW:
    //   return {
    //     ...state,
    //     calendarCourseBag: previewNewCourseToBag(state, action),
    //   };

    // case CLEAR_PREVIEW:
    //   return {
    //     ...state,
    //     calendarCourseBag: state.calendarCourseBag.filter(
    //       (item) => item.type != "preview"
    //     ),
    //   };

    case ADD_CUS_EVENT_IN_CAL:
      return {
        ...state,
        calendarCourseBag: addNewCusEventToBag(state, action),
      };
    
    case DO_NOTHING:
      return {
        ...state,
        calendarCourseBag: [...state.calendarCourseBag],
      };

    case REMOVE_CUS_EVENT_IN_CAL:
      // title: action.selectedCourse.course_meta.title,
      // allDay: false,
      // start: alignDate(timeslot.weekday, timeslot.start_at),
      // end: alignDate(timeslot.weekday, timeslot.end_at),
      return {
        ...state,
        calendarCourseBag: state.calendarCourseBag.filter(
          (item) => (item.id != action.event.id) 
        ),
      };
    case ADD_COURSE_TO_WISH:
      return { 
        ...state,
            pendingCourseBag: addCurrCourseToWish(state, action), 
            listFormattedBag: updateListFormattedBag(state, action), 
            };
    case REMOVE_COURSE_FROM_WISH:
        return { 
          ...state,
            pendingCourseBag: removeCourseFromWish(state, action), 
            listFormattedBag: updateListFormattedBag(state, action), 
        };
    default:
      return state;
  }
}
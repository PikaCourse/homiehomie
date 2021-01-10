import { ADD_COURSE_TO_WISH, REMOVE_COURSE_FROM_WISH} from "../actions/types.js";
import store from '../store'
import {loadWishlistCourseBag} from '../../src/helper/localStorage'

const initialState = {
    wishlistCourseBag: loadWishlistCourseBag(),
};

function formatTimeDisplay(unformatted) {
    let formatted = ""; 
    unformatted.forEach(element => {
        formatted = formatted+numToWeekDay(element.weekday)+" "+element.start_at+"-"+element.end_at+"\n"; 
    });
    return formatted; 
}

function numToWeekDay(numWeekday) {
    switch(numWeekday) {
        case 0:
          return "Mon"; 
        break;
        case 1:
          return "Tue"; 
        break;
        case 2:
            return "Wed"; 
        break;
        case 3:
            return "Thur"; 
        break;
        case 4:
            return "Fri"; 
        break;
        default:
            return "Online"; 
      }
}

function addNewCourseToWish(state, action)
{ 
    var tempArray = [...state.wishlistCourseBag];

    const selectedCourse = action.selectedCourseArray.find(
        ({ crn }) => crn === action.selectedCRN
    );
    console.log(selectedCourse.time); 
    let semesterStr = selectedCourse.year + selectedCourse.semester; 
    tempArray.push({
        key: state.wishlistCourseBag.length + 1,
        id: state.wishlistCourseBag.length + 1,
        crn: selectedCourse.crn, 
        time: formatTimeDisplay(selectedCourse.time), 
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

function removeCourseFromWish(state, action)
{
    var tempArray = [...state.wishlistCourseBag];

    tempArray = state.wishlistCourseBag.filter((item) =>
        item.id != action.id);

    for (let i = 0; i < tempArray.length; i++)
    {
        tempArray[i].id = i+1; 
    }

    return tempArray;
}
export default function (state = initialState, action) {
	switch (action.type) {
		case ADD_COURSE_TO_WISH:
			return { 
                wishlistCourseBag: addNewCourseToWish(state, action)
            };
        case REMOVE_COURSE_FROM_WISH:
            return { 
                wishlistCourseBag: removeCourseFromWish(state, action)
            };

		default:
			return state;
	}
}
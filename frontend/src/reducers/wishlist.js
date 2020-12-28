import { ADD_COURSE_TO_WISH} from "../actions/types.js";
const initialState = {
    wishlistCourseBag: [],
};

function addNewCourseToWish(state, action)
{
    var tempArray = [...state.wishlistCourseBag];

    const selectedCourse = action.selectedCourseArray.find(
        ({ crn }) => crn === action.selectedCRN
    );

    let timeStr = 'yet to implement'; //need to be edited 
    let semesterStr = selectedCourse.year + selectedCourse.semester; 
    tempArray.push({
        id: state.wishlistCourseBag.length + 1,
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
    });
    return tempArray;
}
export default function (state = initialState, action) {
	switch (action.type) {
		case ADD_COURSE_TO_WISH:
			return { 
                wishlistCourseBag: addNewCourseToWish(state, action)
            };

		default:
			return state;
	}
}
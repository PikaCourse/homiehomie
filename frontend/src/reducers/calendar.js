import { ADD_COURSE_TO_CAL, REMOVE_COURSE_FROM_CAL, UPDATE_COURSE_IN_CAL } from "../actions/types.js";
const initialState = {
	calendarCourseBag: [],
};

function getMonday(d) {
	d = new Date(d);
	var day = d.getDay(),
		diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
	return new Date(d.setDate(diff));
}

function alignDate(weekDayIndex) {
	let today = new Date();
	return new Date(
		getMonday(today).setDate(getMonday(today).getDate() + weekDayIndex)
	);
}
function addNewCourseToBag(state, action, update)
{
    var tempArray = [...state.calendarCourseBag];

    if(update)
    {
        tempArray = state.calendarCourseBag.filter((item) =>
            item.raw.selectedCourseArray != action.selectedCourseArray);
    }

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
            calendarId: id,
            title: selectedCourse.course_meta.name,
            category: "time",
            dueDateClass: "",
            start: startTime, //new Date(new Date().setHours(start.getHours() -4)),
            end: endTime, //new Date(new Date().setHours(start.getHours() -5)),
            isReadOnly: true,
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
			return { calendarCourseBag: addNewCourseToBag(state, action, false) };

		case REMOVE_COURSE_FROM_CAL:
			return {
				calendarCourseBag: state.calendarCourseBag.filter((item) =>
                item.raw.selectedCRN != action.selectedCRN) //assume CRN is unique!!
            };
        case UPDATE_COURSE_IN_CAL:
            return { calendarCourseBag: addNewCourseToBag(state, action, true) };

		default:
			return state;
	}
}

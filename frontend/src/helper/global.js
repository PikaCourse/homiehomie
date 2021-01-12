import { isEmpty } from "./dataCheck";

export const year = "2021";
export const semester = "spring";
export const weekday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
export const Color = "#419EF4";

export function courseDataPatch(courseArray) {
  let Patched = [...courseArray];
  Patched.forEach((course) => {
    course.timeString = timeObjFommatter(course.time);
  });

  return Patched;
}

export function timeObjFommatter(time) {
  if (isEmpty(time)) return null;
  let res = "";
  time.map((obj, index) => {
    if (index == 0)
      res = weekday[obj.weekday] + "-" + obj.start_at + "--" + obj.end_at;
    else
      res =
        res +
        ", " +
        weekday[obj.weekday] +
        "-" +
        obj.start_at +
        "--" +
        obj.end_at;
  });
  return res;
}

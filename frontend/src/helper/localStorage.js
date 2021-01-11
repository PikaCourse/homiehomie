export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('state');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
};

export const loadWishlistCourseBag = () => {
  try {
    const serializedState = localStorage.getItem('wishlistCourseBag');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

export const loadCalendarCourseBag = () => {
    console.log("loadCalendarCourseBag");
    try {
      const serializedState = localStorage.getItem("calendarCourseBag");
      if (serializedState === null) {
        return [];
      }
      let calendarCourseBag = JSON.parse(serializedState);
      calendarCourseBag.map(element => {
        // console.log(element.start); 
        // console.log(element.end); 
        // let startStr = JSON.parse(element.start.replace(/ 0+(?![\. }])/g, ' ')); 
        // let endStr = JSON.parse(element.end.replace(/ 0+(?![\. }])/g, ' '));
        element.start = new Date(element.start);; 
        element.end = new Date(element.end);; 
      })
      console.log(calendarCourseBag); 
      return calendarCourseBag;
    } catch (err) {
        console.log(err); 
        console.log([]); 
      return [];
    }
};

export const saveState = (name, state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(name, serializedState);
    } catch {
      // ignore write errors
    }
  };
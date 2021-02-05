/**
 * File name:	index.js
 * Created:	01/31/2021
 * Author:	Weili An
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	entry file for calendar application
 */

import Calendar from "./components/calendar";
import * as action from "./action";
import reducer from "./reducer";

// Export action and reducer
export {action, reducer};

// Export top react component
export default Calendar;
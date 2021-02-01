/**
 * File name:	localStorage.js
 * Created:	01/31/2021
 * Author:	Weili An, Joanna Fang
 * Email:	China_Aisa@live.com
 * Version:	1.1 Remove redundant code
 * Description:	localStorage management
 */

// TODO Write a function for loading and storing

export const loadState = (key, defaultState=null) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultState;
    } else {
      return JSON.parse(serializedState);
    }
  } catch (err) {
    return defaultState;
  }
};

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch {
    // ignore write errors
    console.log(`[!] Error in setting ${key} for local storage`);
  }
};
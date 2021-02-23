/**
 * File name:	utils.js
 * Created:	02/12/2021
 * Author:	Weili An
 * Email:	China_Aisa@live.com
 * Version:	1.0 Initial file
 * Description:	Utility functions for user module component
 */

export function getCookie(name) {
  var cookieValue = null;
  console.log("document.cookie: " + document.cookie);
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      // var cookie = jQuery.trim(cookies[i]);
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

import React from "react";


export const EventComponent = (event) => {
  console.log(event)
  return (
      <div>
        <p className="mt-1 mb-0" style = {{fontFamily:'Montserrat'}}><strong>{event.title}</strong> </p>
        {/* <span>{event.event.name}</span> */}
        <p className="mt-2" style = {{fontFamily:'Montserrat'}}>{event.event.raw.instructor}</p>
      </div>
    );
}

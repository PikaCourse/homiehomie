/**
 * File name:	color.js
 * Created:	01/31/2021
 * Author:	Weili An, Joanna Fang, Marx Wang
 * Email:	foo@bar.com
 * Version:	1.1 Restructure
 * Description:	Predefined coloar param for calendar events
 */

// TODO Generate automatically
export const colors = [
  {strong:"rgba(65, 158, 244, 1)", weak:"rgba(65, 158, 244, 0.3)"},
  {strong:"rgba(79, 207, 184,  1)", weak:"rgba(79, 207, 184,  0.3)"},
  {strong:"rgba(255, 175, 115, 1)", weak:"rgba(255, 175, 115, 0.3)"},
  {strong:"rgba(166, 65, 244, 1)", weak:"rgba(166, 65, 244, 0.3)"},
  {strong:"rgba(242, 124, 87, 1)", weak:"rgba(242, 124, 87, 0.3)"},
  {strong:"rgba(113, 79, 207, 1)", weak:"rgba(113, 79, 207, 0.3)"},
  {strong:"rgba(109, 218, 120, 1)", weak:"rgba(109, 218, 120, 0.3)"},
  {strong:"rgba(234, 104, 153, 1)", weak:"rgba(234, 104, 153, 0.3)"},
  {strong:"rgba(188, 191, 4, 1)", weak:"rgba(188, 191, 4, 0.3)"},
  {strong:"rgba(21, 77, 222, 1)", weak:"rgba(21, 77, 222, 0.3)"},
  {strong:"rgba(68, 207, 207, 1)", weak:"rgba(68, 207, 207, 0.3)"},
];

export const pcolors = [
  {strong:"#419ef4", weak:"#ffffff"},
];

let val = 0;
export const getNextColor = () => {
  return colors[val++ % colors.length];
};

export const getColor = (x) => colors[x % colors.length];
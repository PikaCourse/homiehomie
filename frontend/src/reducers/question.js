import {GET_NOTES, GET_QUE} from '../actions/types.js'

const initialState = {
    noteBag:[
        {
            id:0,
            question:{},
            note:[]
        },
        {
            id:0,
            question:{
                "id": 0,
                "course_meta": 0,
                "created_by": 0,
                "created_at": "string",
                "last_answered": "string",
                "last_edited": "string",
                "like_count": 0,
                "star_count": 0,
                "dislike_count": 0,
                "is_pin": true,
                "pin_order": 0,
                "title": "string",
                "tags": [
                  "string"
                ]
            },
            note:[
                {
                "course": 0,
                "question": 0,
                "id": 0,
                "created_at": "string",
                "last_edited": "string",
                "like_count": 0,
                "star_count": 0,
                "dislike_count": 0,
                "title": "string",
                "content": "string",
                "tags": [
                  "string"
                ]
              },
              {
                "course": 0,
                "question": 0,
                "id": 0,
                "created_at": "string",
                "last_edited": "string",
                "like_count": 0,
                "star_count": 0,
                "dislike_count": 0,
                "title": "string",
                "content": "string",
                "tags": [
                  "string"
                ]
              }
            ]
        },
        {
            id:1,
            question:[],
            note:[]
        }
    ]
}

// [1, 2, 3] 
// {}

export default function(state = initialState, action) {
    //console.log(action.payload);

    switch (action.type) {
        // case GET_QUE:
        //     console.log("from question.js: "+action.payload)
        //     //action.payload [{q1}, {q2}]
        //     let newBag = [];
        //     action.payload.map((item, index) => 
        //     {
        //         newBag.push(
        //             {
        //                 id: index, 
        //                 question: item,
        //                 notes:[]
        //             }
        //         )
        //     }
        //     );

        //     return {
        //         //add not
        //         noteBag: newBag
        //         //@post: notebag 
        //     } 
        case GET_QUE:
            //action.payload: note array to one question
            let newBag2 = {...state.noteBag};
            newBag2.push(action.noteBagItem);
            return{
                ...state,
                noteBag:newBag2
            };
        default:
            return state;
    }
}
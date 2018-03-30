import { PICTURE_DATA } from '../actions/types.ts';

interface IPictureProps {
    type: string,
    payload: any
}

export default function(state = {}, action: IPictureProps) {
    console.log(action);
    switch (action.type) {
        case PICTURE_DATA:
            return { ...state, picData: action.payload }
    }
    return state;
};



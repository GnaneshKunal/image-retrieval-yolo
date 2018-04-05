import { PICTURE_DATA, PICTURE_DATA2 } from '../actions/types.ts';

interface IPictureProps {
    type: string,
    payload: any
}

export default function(state = {}, action: IPictureProps) {
    console.log(action);
    switch (action.type) {
        case PICTURE_DATA:
            return { ...state, picData: action.payload };
        case PICTURE_DATA2:
            return { ...state, picData2: action.payload };
    }
    return state;
};



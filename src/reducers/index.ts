import * as redux from 'redux';
import pictureReducer from './picture';

const rootReducer: redux.Reducer<any> = redux.combineReducers({
    picture: pictureReducer
});

export default rootReducer;

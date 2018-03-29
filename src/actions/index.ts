import axios from 'axios';

import {
    UPLOAD_PICTURE,
    PICTURE_DATA
} from './types';

interface IUploadError {
    type: string,
    payload: string
}

const ROOT_URL: string = 'http://localhost:8000';

export function uploadPicture(files: Array<any>) {
    console.log('asdsda');
    return function(dispatch: any) {
        console.log(files);
        const uploaders = files.map(file => {
            const formData = new FormData();
            formData.append("file", file);

            return axios.post(`${ROOT_URL}/upload`, formData, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }).then(response => {
                const data = response.data;
                const fileURL = data.secure_url;
                dispatch({
                    type: PICTURE_DATA,
                    payload: response.data
                });
            });
        });

        axios.all(uploaders).then (() => {
            console.log('Uploaded');
        });
    }
}

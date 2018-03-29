import * as React from 'react';
import Home from './Home';
import { connect } from 'react-redux';

import UploadForm from './UploadForm';
import SimilarImages from './SimilarImages';

const Main = (): JSX.Element => (
    <div>
        <UploadForm />
        <SimilarImages data={""} />
    </div>
);

export default Main;

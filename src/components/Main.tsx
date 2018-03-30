import * as React from 'react';
import Home from './Home';
import { connect } from 'react-redux';

import UploadForm from './UploadForm';
import SimilarImages from './SimilarImages';

interface IMainProps {
    picture: {
        picData: string
    }
}


class Main extends React.Component<IMainProps, {}> {

    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div>
                <UploadForm />
                <SimilarImages />
            </div>
        );
    }
}

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps)(Main);

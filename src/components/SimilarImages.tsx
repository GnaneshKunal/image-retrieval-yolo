import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

interface ISimilarImagesProps {
    data: string;
}

class SimilarImages extends React.Component<ISimilarImagesProps, {}> {

    constructor(props: any) {
        super(props);
    }


    public render(): JSX.Element {
        return (
            <div>
                {this.props.data}
            </div>
        );
    }
}

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps)(SimilarImages);

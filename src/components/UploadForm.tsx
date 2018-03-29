import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import DropZone from 'react-dropzone';

import * as actions from '../actions';

interface IUploadFormState {
    file: string,
    search: {
        click: boolean
    },
    redirect: boolean,
    files: Array<any>,
    hasFile: boolean
}

interface IUploadPictureProps {
    uploadPicture: Function
}


class UploadForm extends React.Component<IUploadPictureProps, IUploadFormState> {
    constructor(props: any) {
        super(props);

        this.state = {
            file: '',
            search: {
                click: false
            },
            redirect: false,
            files: [],
            hasFile: false
        };
    }

    onDrop(files: any) {
        this.setState({
            files,
            hasFile: true
        });
        //console.log(this.props);
        //if (this.state.files.length == 1) {
            this.props.uploadPicture(this.state.files);
        //}
    }


    onFormSubmit(event: any) {
        event.preventDefault();
        this.setState({ search: { click: true }, redirect: true })
    }

    renderForm(): JSX.Element {
        return (
            <section>
                <div className="dropzone">
                    <DropZone
                        onDrop={this.onDrop.bind(this)}
                        accept="image/jpeg, image/png">
                        <p>Drop the picture here, or click to select picture </p>
                    </DropZone>
                </div>
                <aside>
                    <h2>Dropped Pictures</h2>
                    <ul>
                        {
                            this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} </li>)
                        }
                    </ul>
                </aside>
            </section>
        );
    }


    public render(): JSX.Element {
        return (
            <div>
                {this.renderForm()}
            </div>
        );
    }
}

const mapStateToProps = (state: any) => state;

export function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        uploadPicture: (files: Array<any>) => dispatch<any>(actions.uploadPicture(files))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);

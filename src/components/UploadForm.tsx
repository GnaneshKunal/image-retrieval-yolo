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
    fileNo: number
}

interface IUploadPictureProps {
    uploadPicture: Function,
    uploadPicture2: Function
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
            fileNo: 0
        };
    }

    async onDrop(files: any) {
        console.log(files[0]);
        let state = this.state;
        await this.setState({
            files: [files[state.fileNo]],
            fileNo: state.fileNo + 1
        });
        //console.log(this.props);
        //if (this.state.files.length == 1) {
        //this.props.uploadPicture([this.state.files[0]]);
        this.props.uploadPicture([files[0]]);
        //if (this.state.files.length > 1) {
          //  this.setState({
            //    files: []
            //})
        //}
        //}
    }


    onFormSubmit(event: any) {
        event.preventDefault();
        this.setState({ search: { click: true }, redirect: true })
    }

    handleForm(event: any) {
        //console.log(event.target);
        this.props.uploadPicture2(event.target.files[0]);
    }


    renderForm(): JSX.Element {
        return (
            <section>


                <input type="file" name="file" onChange={this.handleForm.bind(this)} />


                <div className="dropzone">
                    <DropZone
                        onDrop={this.onDrop.bind(this)}
                        accept="image/jpeg, image/png"
                        multiple={false}>
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
        uploadPicture: (files: Array<any>) => dispatch<any>(actions.uploadPicture(files)),
        uploadPicture2: (file: any) => dispatch<any>(actions.uploadPicture2(file))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);

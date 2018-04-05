import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import * as path from 'path';

interface ISimilarImagesProps {
    picture: {
        picData: string;
        picData2: string;
    }
}

interface ISimilarImagesState {
    pictures: any
}

class SimilarImages extends React.Component<ISimilarImagesProps, ISimilarImagesState> {

    constructor(props: any) {
        super(props);
        this.state = {
            pictures: []
        }
    }

    public makeSimilarImages(): JSX.Element {
        if (this.props.picture !== undefined && this.props.picture.picData !== undefined) {
            let data = JSON.parse(this.props.picture.picData);
            return data.map((e: any) => {
                let imgLink = e.dirp;
                console.log(path.join('./dest/', path.basename(imgLink)));
                //return <img src={path.join('./dest/', path.basename(imgLink))} key={imgLink} />
                return (
                    <div className="col-lg-3 col-md-4 col-xs-6">
                        <a href="#" className="d-block mb-4 h-100">
                            <img className="img-fluid img-thumbnail" src={path.join('./dest/', path.basename(imgLink))} key={imgLink} alt="" />
                        </a>
                    </div>
                );
            });
        } else if (this.props.picture !== undefined && this.props.picture.picData2 !== undefined) {
            console.log(this.props);
            let data = JSON.parse(this.props.picture.picData2);
            console.log(data);
            console.log(data[0][0]);
            let imgLink = data[0][0].dirp;
            console.log(imgLink)
            return (
                <div className="col-lg-3 col-md-4 col-xs-6">
                    <a href="#" className="d-block mb-4 h-100">
                        <img className="img-fluid img-thumbnail" src={path.join('./dest/', path.basename(imgLink))} key={imgLink} alt="" />
                    </a>
                </div>
            );
        } else {
            return (
                <div>
                    Loading
                </div>
            );
        }
    }
            public render(): JSX.Element {
        return (
            <div>

                <div className="container">

                    <h1 className="my-4 text-center text-lg-left">Thumbnail Gallery</h1>
                    <div className="row text-center text-lg-left">
                        {this.makeSimilarImages()}
                    </div>
                </div>
            </div>
        );
            }
}

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps)(SimilarImages);

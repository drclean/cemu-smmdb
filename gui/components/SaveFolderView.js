import React from 'react';
import ReactCSS from 'reactcss';
import { remote } from 'electron';

import SaveFile from "./SaveFile";
import SaveFileDetails from "./SaveFileDetails";

export default class SaveFolderView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            courseNames: [],
            display: false
        };
        for (let i = 0; i < 120; i++) {
            this.state.courseNames.push(`course${i.pad(3)}`);
        }
        this.showSaveDetails = this.showSaveDetails.bind(this);
        this.hideSaveDetails = this.hideSaveDetails.bind(this);
    }
    showSaveDetails (course) {
        this.setState({
            display: true,
            course
        })
    }
    hideSaveDetails () {
        this.setState({
            display: false,
            course: null
        })
    }
    render () {
        const courses = this.props.save.courses;
        const styles = ReactCSS({
            'default': {
                div: {
                    width: '100%',
                    height: '100vh',
                    minHeight: '100vh'
                },
                ul: {
                    margin: 'auto',
                    position: 'absolute',
                    top: '0', right: '0', bottom: '0', left: '0',
                    width: 'calc(100% - 180px)',
                    height: 'calc(100% - 140px)',
                    backgroundColor: '#07070f',
                    color: '#fff',
                    overflowY: 'scroll',
                    border: '12px solid #6e6e85',
                    listStyleType: 'none'
                }
            },
        });
        let self = this;
        return (
            <div style={styles.div}>
                <SaveFileDetails display={this.state.display} course={this.state.course} onClick={this.hideSaveDetails} />
                <ul style={styles.ul}>
                    {
                        Array.from((function* () {
                            for (let i = 0; i < 120; i++) {
                                let course = courses[self.state.courseNames[i]];
                                yield <SaveFile onClick={self.showSaveDetails} course={course} key={self.state.courseNames[i]} />
                            }
                        })())
                    }
                </ul>
            </div>
        )
    }
}

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};
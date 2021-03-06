import React, {
  Component
} from 'react';
import './Editor.css';
import './firepadUserList.css'
import FirepadUserList from './firepadUserList';
import { Segment, Header, Button, Grid } from 'semantic-ui-react';
import firebase from '../../firebase';

class Editor extends Component {

  constructor(props) {
    super(props);
    this.getRef = this.getRef.bind(this);
  }

  componentDidMount() {
    // Initialize Firebase.
    // TODO: replace with your Firebase project configuration.
    window.firebase = firebase;
    const firepadRef = this.getRef();
    const codeMirror = window.CodeMirror(document.getElementById('firepad-container'), {
      lineWrapping: true,
    });
    const firepad = window.Firepad.fromCodeMirror(firepadRef, codeMirror, {
      richTextToolbar: true,
      richTextShortcuts: true,
      userId: localStorage.getItem('name') || 'Unknown',
    });
    const firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
      document.getElementById('userlist'), localStorage.getItem('name') || 'Unknown', localStorage.getItem('name') || 'Unknown');

    firepad.on('ready', function () {
      if (firepad.isHistoryEmpty()) {
        firepad.setHtml('<span style="font-size: 24px;">Lecture Tech</span><br/><br/>Classroom Collaboration\n');
      }
    });
  }

  // Helper to get hash from end of URL or generate a random one.
  getRef() {
    var ref = window.firebase.database().ref();
    var hash = window.location.hash.replace(/#/g, '');
    if (this.props.id) {
      ref = ref.child(this.props.id);
    } else if (hash) {
      ref = ref.child(hash);
    } else {
      ref = ref.push(); // generate unique location.
      window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
    }
    if (typeof console !== 'undefined') {
      console.log('Firebase data: ', ref.toString());
    }
    return ref;
  }

  render() {
    return (
      <div>
        <Segment.Group raised>
          <Segment>
            <Grid>
              <Grid.Row>
                <Grid.Column width="2">
                  <Header size="huge">
                    Notes
                  </Header>
                </Grid.Column>
                <Grid.Column width="14">
                  <Button onClick={this.props.showUsers} floated="right">Show active users</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>

          </Segment>
          <Segment>
            <div id="firepad-container" />
          </Segment>
        </Segment.Group>
      </div>
    );
  }
}
export default Editor;
import React from 'react';
import axios from "axios";
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        notes: false,
        selected: 0,
    }
}

  componentDidMount() {
    axios
      .get("https://fe-notes.herokuapp.com/note/get/all")
      .then(res => this.setState({notes: res.data}))
      .catch(error => console.log(error))
}

  render() {
    return (
      this.state.notes ?
      <View>
          {
              this.state.notes.map((note) => {
                  return (<Text key={note._id}>{note.title} - {note.textBody}</Text>);
              })
          }
      </View> : null
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

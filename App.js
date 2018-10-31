import React from 'react';
import axios from "axios";
import { StyleSheet, ScrollView, TextInput, Text, Button, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Welcome to Lambda Notes</Text>
        <Button
          title="See all of your notes!"
          onPress={() => this.props.navigation.navigate('Notes')}
        />
        <Button
          title="Add a new note!"
          onPress={() => this.props.navigation.navigate("NewNote")}
        />
      </View>
    );
  }
}

class AllNotes extends React.Component {
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
      <ScrollView>
      <View style={styles.notepage}>
          {
              this.state.notes.map((note) => {
                  return (
                    <View key={note._id} style={styles.notecard}>
                      <Text style={styles.header}>{note.title}</Text>
                      <Text>{note.textBody}</Text>
                    </View>);
              })
          }
      </View>
      </ScrollView> : null
    );
  }
}

class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        title: "",
        textBody: "",
        _id: ""
    }
  }

  addANote = () => {
    axios
        .post("https://fe-notes.herokuapp.com/note/create", this.state)
        .then(res => this.props.navigation.push('Home'))
        .catch(error => console.log(error));
  }

  render() {
    return (
        <View>
            <Text>Create New Note:</Text>
            <TextInput 
                onChangeText={(title) => this.setState({title})}
                type="text" 
                placeholder="Note Title"
                name="title"
                value={this.state.title}
                className="new-title"
                >
            </TextInput>
            <TextInput 
                onChangeText={(textBody) => this.setState({textBody})}
                type="text" 
                placeholder="Note Content"
                name="textBody"
                value={this.state.textBody}
                className="new-textBody"
                >
            </TextInput>
            <Button title="Save" onPress={this.addANote} />
        </View>
    )
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Notes: AllNotes,
    NewNote: AddNote,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  notepage: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    backgroundColor: "white",
  },
  notecard: {
    backgroundColor: "#F2F1F2",
    borderColor: "black",
    borderWidth: 0.5,
    width: 150,
    height: "auto",
    marginBottom: 10,
    borderRadius: 5,
  },
  header: {
    borderWidth: 0.25,
    borderColor: "black",
    textAlign: "center",
  }
});

// import React from 'react';
// import { Button, View, Text } from 'react-native';
// import { createStackNavigator } from 'react-navigation';

// class HomeScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Home Screen</Text>
//         <Button
//           title="Go to Details"
//           onPress={() => this.props.navigation.navigate('Details')}
//         />
//       </View>
//     );
//   }
// }

// class DetailsScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Details Screen</Text>
//       </View>
//     );
//   }
// }

// const RootStack = createStackNavigator(
//   {
//     Home: HomeScreen,
//     Details: DetailsScreen,
//   },
//   {
//     initialRouteName: 'Home',
//   }
// );

// export default class App extends React.Component {
//   render() {
//     return <RootStack />;
//   }
// }
import React from 'react';
import axios from "axios";
import { StyleSheet, ScrollView, View } from 'react-native';
import { Container, Header, Content, Form, Item, Button, Input, Label, Card, Text, CardItem, Body, Left, Right, Title } from 'native-base';
import { createStackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ marginBottom: 20 }}>Welcome to Lambda Notes</Text>
        <Button full onPress={() => this.props.navigation.navigate('Notes')} style={{ marginBottom: 20 }}>
          <Text>See all of your notes!</Text>
        </Button>
        <Button full onPress={() => this.props.navigation.navigate("NewNote")}>
          <Text>Add a new note!</Text>
        </Button>
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
      {
              this.state.notes.map((note) => {
                  return (
          <Card key={note._id}>
            <CardItem header>
              <Text>{note.title}</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                {note.textBody}
                </Text>
              </Body>
            </CardItem>
         </Card>);
              })
          }
      
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
        .then(res => this.setState({title: "", textBody: "", _id: ""}))
        .then(this.props.navigation.push('Home'))
        .catch(error => console.log(error));
  }

  render() {
    return (
        // <View>
        //     <Text>Create New Note:</Text>
        //     <TextInput 
        //         onChangeText={(title) => this.setState({title})}
        //         type="text" 
        //         placeholder="Note Title"
        //         name="title"
        //         value={this.state.title}
        //         className="new-title"
        //         >
        //     </TextInput>
        //     <TextInput 
        //         onChangeText={(textBody) => this.setState({textBody})}
        //         type="text" 
        //         placeholder="Note Content"
        //         name="textBody"
        //         value={this.state.textBody}
        //         className="new-textBody"
        //         >
        //     </TextInput>
        //     <Button title="Save" onPress={this.addANote} />
        // </View>
        <Container>
        <Header>
          <Left/>
          <Body>
            <Title>Create a note</Title>
          </Body>
          <Right />
        </Header>
        <Form>
            <Item stackedLabel>
              <Label>Note Title</Label>
              <Input 
              onChangeText={(title) => this.setState({title})}
              type="text"
              value={this.state.title}
              />
            </Item>
            <Item stackedLabel last>
              <Label>Note Text</Label>
              <Input 
                onChangeText={(textBody) => this.setState({textBody})}
                type="text"
                value={this.state.textBody}
              />
            </Item>
            <Button full primary onPress={this.addANote}><Text>Save</Text></Button>
          </Form>
      </Container>
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
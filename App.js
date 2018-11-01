import React from 'react';
import axios from "axios";
import { ScrollView, View, TouchableHighlight } from 'react-native';
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
        <View style={{flexDirection: "column", alignItems: "center"}}>
      {
              this.state.notes.map((note) => {
                  return (
          <TouchableHighlight onPress={() => {
            this.props.navigation.navigate('OneNote', {
              note: {...note},
            })}}>
          <Card style={{width: 200}} key={note._id}>
            <CardItem header>
              <Text>{note.title}</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                {note.textBody.length > 75?
                    note.textBody.substring(0, 75) + "..." :
                    note.textBody}
                </Text>
              </Body>
            </CardItem>
         </Card>
         </TouchableHighlight>);
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
        .then(res => this.setState({title: "", textBody: "", _id: ""}))
        .then(this.props.navigation.push('Home'))
        .catch(error => console.log(error));
  }

  render() {
    return (
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

class SingleNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        title: this.props.navigation.getParam("note", "false"),
        textBody: this.props.navigation.getParam("note", "false"),
    }
  }
  edit = () => {
    this.props.navigation.navigate('EditNote', {
      title: this.state.title.title,
      textBody: this.state.textBody.textBody,
      id: this.state.title._id,
    })}
  
  deleteNote = () => {
    console.log(this.state.title._id)
    axios
      .delete(`https://fe-notes.herokuapp.com/note/delete/${this.state.title._id}`)
      .then(this.setState({title: "", textBody: "",}))
      .then(this.props.navigation.push('Notes'))
      .catch(error => console.log(error))
  }

  render() {
    return (
      this.state.title ?
      <ScrollView>
        <View style={{flexDirection: "column", alignItems: "center"}}>
          <Card style={{width: 200}}>
            <CardItem header>
              <Text>{this.state.title.title}</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                {this.state.textBody.textBody}
                </Text>
              </Body>
            </CardItem>
         </Card>
        </View>
        <Button full primary onPress={this.edit}><Text>Edit</Text></Button>
        <Button full danger onPress={this.deleteNote}><Text>Delete</Text></Button>
      </ScrollView> : null
    );
  }
}

class EditNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        title: this.props.navigation.getParam("title", "false"),
        textBody: this.props.navigation.getParam("textBody", "false"),
        _id: this.props.navigation.getParam("id", "false"),
    }
  }

  updateNote = () => {
    axios
        .put(`https://fe-notes.herokuapp.com/note/edit/${this.state._id}`, this.state)
        .then(res => this.props.navigation.push("Notes"))
        .catch(error => console.log(error))
}

  render() {
    return (
        <Container>
        <Header>
          <Left/>
          <Body>
            <Title>Edit a note</Title>
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
            <Button full primary onPress={this.updateNote}><Text>Save</Text></Button>
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
    OneNote: SingleNote,
    EditNote: EditNote,
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
import React, { Component } from 'react';
import WebSocket from 'reconnecting-websocket';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Dimensions} from 'react-native';
import Expo, { Constants } from 'expo';

class App extends Component {
	constructor(){
    super()

    this.onOpen = this.onOpen.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onMessage = this.onMessage.bind(this)
    this.onError = this.onError.bind(this)
    this.removeTodo = this.removeTodo.bind(this)
    this.addTodo = this.addTodo.bind(this)
  }

  state = { list: [], text: "" }

  wsUri = "wss://frigo.io/"

  apiUri = "https://frigo.io/1bd5807e-21de-4fbd-9002-87b71bee1b3f"

  componentDidMount(){
    this.websocket = new WebSocket(this.wsUri);
    this.websocket.onopen = this.onOpen
    this.websocket.onclose = this.onClose
    this.websocket.onmessage = this.onMessage
    this.websocket.onerror = this.onError
  }
  onOpen(evt) {
    console.log("CONNECTED");
  }

  onClose() {
    console.log("DISCONNECTED");
  }

  onMessage(evt) {
    console.log("MESSAGE: ", evt.data);
    this.setState({ list: JSON.parse(evt.data) })
  }

  onError(evt) {
    console.error(evt.data)
  }

  doSend(message) {
    console.log("SENT: " + message);
    websocket.send(message);
  }

  removeTodo({ _id: id }){
    fetch(this.apiUri, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "remove",
        id
      })
    })
  }

  addTodo(item) {
    fetch(this.apiUri, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "add",
        item
      })
    })
    return true
  }
  
  componentWillUnmount(){
    this.onClose()
  }
	
  render() {
    return (
      <KeyboardAvoidingView 
    	behavior="padding"
    	style={styles.container}
    	>
    	<Text style={styles.heading}>ls-it</Text>
      <Text style={styles.description}>Add stuff when you think of them!</Text>
      <TextInput
    		style={styles.input}
        value={this.state.text}
        onChangeText={text => this.setState({text})}
    	 />
       <TouchableOpacity
    		style={styles.button}
    		onPress={e => this.addTodo(this.state.text) && this.setState({text: ""})}
    	 >
    		<Text style={styles.buttonText}>Add</Text>
    	 </TouchableOpacity>
       <ScrollView>
        {
          this.state.list.map(item => 
            <TouchableOpacity
              key={item._id}
              onPress={this.removeTodo.bind(this, item)}
            >
            <Text
              style={styles.item}
            >
            {item.item}	
            </Text>
          </TouchableOpacity>
        )
        }
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight + Dimensions.get('window').width*0.3,
    backgroundColor: '#ecf0f1',
  },
  heading: {
    margin: 0,
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center"
  },
  description: {
    color: "#333",
    textAlign: "center",
    marginBottom: 80
  },
  item: {
    padding: 20,
    width: Dimensions.get('window').width,
    textAlign: "center"
  },
  input: {
    margin: 20,
  	width: Dimensions.get('window').width*0.8,
  	textAlign: "center",
  },
  button: {
  	backgroundColor: "steelblue",
  	width: Dimensions.get('window').width*0.4,
  	padding: 20,
  },
  buttonText: {
    color: "#fff",
  	textAlign: "center"
  }
});
    

Expo.registerRootComponent(App);

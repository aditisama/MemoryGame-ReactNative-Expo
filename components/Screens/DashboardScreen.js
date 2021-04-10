import React from 'react';
import { StyleSheet, View, Button, Text, Alert } from 'react-native';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons'; // 6.2.2
import firebase from 'firebase'

import Card from './Card';

import helpers from './helpers';
//import moment from "moment"

export default class App extends React.Component {


  componentDidMount(){
    //this.updateTimer();
    this.start();
  }

/*
  get bestScore(){
        const ref = firebase.firestore.collection("user").doc(this.userId).get().then(documentSnapshot => {
    console.log('User exists: ', documentSnapshot.exists);

    if (documentSnapshot.exists) {
      console.log('User data: ', documentSnapshot.data());
      return documentSnapshot.data();
    }
    else{
      firebase.firestore.collection("user").doc(this.userId).set({highScore:0});
      return 0;
    }
  });
  }
*/
  get userId(){
      return firebase.auth().currentUser.uid;
    }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  constructor(props) {
    super(props);
    this.renderCards = this.renderCards.bind(this);
    this.resetCards = this.resetCards.bind(this);
    this.start = this.start.bind(this);
   // this.bestScore = this.bestScore.bind(this);
   
    let sources = {
      'fontawesome': FontAwesome,
      'entypo': Entypo,
      'ionicons': Ionicons
    };

    let cards = [
      {
        src: 'fontawesome',
        name: 'heart',
        color: 'red'
      },
      {
        src: 'entypo',
        name: 'feather',
        color: '#7d4b12'
      },
      {
        src: 'entypo',
        name: 'flashlight',
        color: '#f7911f'
      },
      {
        src: 'entypo',
        name: 'flower',
        color: '#37b24d'
      },
      {
        src: 'entypo',
        name: 'moon',
        color: '#ffd43b'
      },
      {
        src: 'entypo',
        name: 'youtube',
        color: '#FF0000'
      },
      {
        src: 'entypo',
        name: 'shop',
        color: '#5f5f5f'
      },
      {
        src: 'fontawesome',
        name: 'github',
        color: '#24292e'
      },
      {
        src: 'fontawesome',
        name: 'skype',
        color: '#1686D9'
      },
      {
        src: 'fontawesome',
        name: 'send',
        color: '#1c7cd6'
      },
      {
        src: 'ionicons',
        name: 'ios-magnet',
        color: '#d61c1c'
      },
      {
        src: 'ionicons',
        name: 'logo-facebook',
        color: '#3C5B9B'
      }
    ];

    let clone = JSON.parse(JSON.stringify(cards));

    this.cards = cards.concat(clone);
    this.cards.map((obj) => {
      let id = Math.random().toString(36).substring(7);
      obj.id = id;
      obj.src = sources[obj.src];
      obj.is_open = false;
    });

    this.cards = this.cards.shuffle(); 
    this.state = {
      current_selection: [],
      selected_pairs: [],
      score: 0,
      cards: this.cards,
      /*eventDate:moment.duration().add({minutes:2,seconds:0}), 
      mins:0,
      secs:0,*/
      timer: null,
      counter: '00',
      miliseconds: '00',
      startDisabled: true,
      stopDisabled: false,
      //highScore: this.bestScore()
    }
  
  }

  start() {
        var self = this;
        let timer = setInterval(() => {
            var num = (Number(this.state.miliseconds) + 1).toString(),
                count = this.state.counter;

            if( Number(this.state.miliseconds) == 99 && this.state.score!==12 ) {
                count = (Number(this.state.counter) + 1).toString();
                num = '00';
            }

            self.setState({
                counter: count.length == 1 ? '0'+count : count,
                miliseconds: num.length == 1 ? '0'+num : num
            });
        }, 0);
        this.setState({timer});
    }

  updateTimer=()=>{
    
    const x = setInterval(()=>{
      let { eventDate} = this.state
      if(eventDate <=0){
        clearInterval(x)
      }else {
        /*eventDate = eventDate.subtract(1,"s")
        const mins = eventDate.minutes()
        const secs = eventDate.seconds()
        
        this.setState({
          mins,
          secs,
          eventDate
        })*/
      }
    },1000)

  }

  render() {
    /* const { days, hours, mins, secs } = this.state*/
    return (
      <View style={styles.container}>
        <View style={styles.header}>
				<Text style={styles.header_text}>MemoryGame   {this.state.counter}</Text>
			</View>
        <View style={styles.body}>
          { 
            this.renderRows.call(this) 
          }
        </View>
        <View style={styles.score_container}>
				<Text style={styles.score}>{this.state.score}</Text>
			</View>
        <Button
          onPress={this.resetCards}
          title="Reset"
          color="#008CFA" 
        />
      </View>
    );
  }
  

  resetCards() {
    let cards = this.cards.map((obj) => {
      obj.is_open = false;
      return obj;
    });

    cards = cards.shuffle();

    this.setState({
      current_selection: [],
      selected_pairs: [],
      cards: cards,
      score: 0,
      timer: null,
      counter: '00',
      miliseconds: '00'

    });
  }


  renderRows() {
   
    let contents = this.getRowContents(this.state.cards);
    return contents.map((cards, index) => {
      return (
        <View key={index} style={styles.row}>
          { this.renderCards(cards) }
        </View>
      );
    });
   
  }


  renderCards(cards) {
    return cards.map((card, index) => {
      return (
        <Card 
          key={index} 
          src={card.src} 
          name={card.name} 
          color={card.color} 
          is_open={card.is_open}
          clickCard={this.clickCard.bind(this, card.id)} 
        />
      );
    });
  }


  clickCard(id) {
    let selected_pairs = this.state.selected_pairs;
    let current_selection = this.state.current_selection;
    let score = this.state.score;

    let index = this.state.cards.findIndex((card) => {
      return card.id == id;
    });

    let cards = this.state.cards;
    
    if(cards[index].is_open == false && selected_pairs.indexOf(cards[index].name) === -1){

      cards[index].is_open = true;
      
      current_selection.push({ 
        index: index,
        name: cards[index].name
      });

      if(current_selection.length == 2){
        if(current_selection[0].name == current_selection[1].name){
          score += 1;
          selected_pairs.push(cards[index].name);
          if(score==12){
            var hs=this.state.counter;
            firebase.database().ref('/UserInfo/' + firebase.auth().currentUser.uid).on('value',function(snapshot)           {
              //hs= snapshot.val().highScore;
              console.log(hs)
             if(snapshot.val().highScore > hs){
                  firebase.database().ref('/UserInfo/' + firebase.auth().currentUser.uid).update({
              highScore: hs
            })
            Alert.alert("Game Over"+"\n" + hs + " is your score"+"\n"+"Your best scoure is " + hs )
              }
             else{ Alert.alert("Game Over"+"\n" + hs + " is your score"+"\n"+"Your best scoure is " + snapshot.val().highScore )}
              
            })
            //console.log(hs)
           /* if(hs > this.state.counter){
                  firebase.database().ref('/UserInfo/' + firebase.auth().currentUser.uid).update({
              highScore: this.state.counter
            })
              }
            */

            
            //Alert.alert("Game Over"+"\n" + this.state.counter + " is your score"+"\n"+"Your best scoure is ")
            }
        }else{
         
          cards[current_selection[0].index].is_open = false;

          setTimeout(() => {
            cards[index].is_open = false;
            this.setState({
              cards: cards
            });
          }, 500);
        }

        current_selection = [];
      }

      this.setState({
        score: score,
        cards: cards,
        current_selection: current_selection
      });

    }
  
  }


  getRowContents(cards) {
    let contents_r = [];
    let contents = [];
    let count = 0;
    cards.forEach((item) => {
      count += 1;
      contents.push(item);
      if(count == 4){
        contents_r.push(contents)
        count = 0;
        contents = [];
      }
    });

    return contents_r;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  body: {
    flex: 18,
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 20
  },
  header: {
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'stretch',
		paddingTop: 20,
		paddingBottom: 5,
		backgroundColor: '#f3f3f3'
	},
	header_text: {
		fontWeight: 'bold',
		fontSize: 17,
		textAlign: 'center'
	},
  score_container: {
		flex: 1,
		alignItems: 'center',
		padding: 10
	},
	score: {
		fontSize: 40,
		fontWeight: 'bold'
	}
});

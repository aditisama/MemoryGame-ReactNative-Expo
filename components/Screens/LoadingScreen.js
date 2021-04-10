import React,{Component} from 'react';
import { View,Text,StyleSheet,ActivityIndicator } from 'react-native';
import firebase from 'firebase'

export default class LoadingScreen extends Component{

    componentDidMount() {
        this.checkIfLoggedIn();
      }
    
      checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(
          function(user) {
            console.log('AUTH STATE CHANGED CALLED ')
            if (user) {
              this.props.navigation.navigate('DashboardScreen');
            } else {
              this.props.navigation.navigate('LoginScreen');
            }
          }.bind(this)
        );
      };


    render(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
}
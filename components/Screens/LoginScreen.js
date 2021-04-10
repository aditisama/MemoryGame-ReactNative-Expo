import React,{Component} from 'react';
import { View,Text,StyleSheet,Button } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase'

export default class LoginScreen extends Component{
    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (
              providerData[i].providerId ===
                firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()
            ) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      };
      onSignIn = googleUser => {
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(
          function(firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(googleUser, firebaseUser)) {
              // Build Firebase credential with the Google ID token.
              var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
              );
              // Sign in with credential from the Google user.
              try{
                firebase
                .auth()
                .signInWithCredential(credential)
                .then(function(result) {
                  if (result.additionalUserInfo.isNewUser) {
                    firebase
                      .database()
                      .ref('/UserInfo/' + result.user.uid)
                      .set({
                        highScore: 99999,
                        gmail: result.user.email,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                      })
                      .then(function(snapshot) {
                        
                      });
                  } else {
                    firebase
                      .database()
                      .ref('/users/' + result.user.uid)
                      .update({
                        last_logged_in: Date.now()
                      });
                  }
                })
                .catch(function(error) {
                  console.log(error);
                });
              }catch(err){
                  console.log(err);
              }
            } else {
              console.log('User already signed-in Firebase.');
            }
          }.bind(this)
        );
      };

      signInWithGoogleAsync = async () => {
        try {
          const result = await Google.logInAsync({
            behavior: "web",
            androidClientId: "851426145200-r7t0uetua4ro342up8i11bntuecuem38.apps.googleusercontent.com",
            iosClientId: "851426145200-tf1fdct2kpceh54pvgc62kr7adgjj63c.apps.googleusercontent.com",
            // iosClientId: YOUR_CLIENT_ID_HERE,
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
              this.onSignIn(result)
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      }

    render(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Button 
                    title="Sign In with Google"
                    onPress={() => this.signInWithGoogleAsync()}
                />
            </View>
        )
    }
}
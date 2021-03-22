import React from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';
import firebase from 'firebase';
import db from './config';

export default class ReadStoryScreen extends React.Component {
  constructor()
  {
    super();
    this.state = 
    {
      search: '',
      allStories: [],
      dataInDatabase: []
    }
  }

  updateSearchCriteria = (searchCriteria) =>
  {
    this.setState({search: searchCriteria});
  }

  getStories = async() =>
  {
    try
    {
      var availableStories = [];
      var stories = await db.collection("Story").get()
      .then((Snapshot)=>{Snapshot.forEach((doc)=>{
        availableStories.push(doc.data());
      })
      
      this.setState({allStories:availableStories});
    })
    }

    catch(error)
    {
      var errorMessage = error.message;
      alert(errorMessage);
    }
  }

  filterSearch = (searchItem) =>
  {
    var requiredData = this.state.allStories.filter((keyword)=>{
      var keywordData = keyword.title
       ?
       keyword.title.toUpperCase()
       :
       ''.toUpperCase();
      var searchData = searchItem.toUpperCase();
      return(keywordData.indexOf(searchData)>-1);
    });

    this.setState({dataInDatabase:requiredData, search: searchItem});
  }

  componentDidMount = () =>
  {
    this.getStories();
  }

    render() 
    {
      return (
        <View>
          <KeyboardAvoidingView>
          <View>
            <SearchBar
              placeholder = "Search for a Story..."
              onChangeText = {(text)=>{this.filterSearch(text)}}
              value = {this.state.search}
            />
          </View>

          <ScrollView>
            <View>
             {
               this.state.search === ""
               ?
               this.state.allStories.map((item)=>{
                <View>
                  <Text>
                    {item.title}
                  </Text>

                  <Text>
                    {item.author}
                  </Text>
                </View>
               })
               :
               this.state.dataInDatabase.map((item)=>{
                 <View>
                   <Text>
                     {item.title}
                   </Text>

                   <Text>
                     {item.author}
                   </Text>
                 </View>
               })
             }
            </View>
          </ScrollView>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
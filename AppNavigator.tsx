import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import RepoList from './RepoList.tsx'; // Your existing App component
import RepoDetails from './RepoDetails';
import UserDetails from "./UserDetails"; // A new component for showing repo details

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={RepoList}
          options={{title: 'GitHub Repos'}}
        />
        <Stack.Screen
          name="RepoDetails"
          component={RepoDetails}
          options={{title: 'Repo Details'}}
        />
        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{title: 'User Details'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

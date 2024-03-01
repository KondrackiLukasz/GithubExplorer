import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RepoDetails from './RepoDetails.tsx';
import {RepoList} from './RepoList.tsx'; // Your existing App component

const Stack = createNativeStackNavigator();

function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={RepoList} />
        <Stack.Screen name="RepoDetails" component={RepoDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;

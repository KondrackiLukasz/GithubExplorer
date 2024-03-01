import React, {useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Searchbar, Card} from 'react-native-paper';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

function RepoList() {
  const navigation = useNavigation(); // Add this line
  const [searchQuery, setSearchQuery] = useState('');
  const [repos, setRepos] = useState([]);

  const fetchRepos = async query => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=${query}`,
      );
      setRepos(response.data.items);
    } catch (error) {
      console.error('Failed to fetch repositories', error);
      setRepos([]);
    }
  };

  const onChangeSearch = query => {
    setSearchQuery(query);
  };

  const onSubmitSearch = () => {
    if (searchQuery.trim()) {
      fetchRepos(searchQuery);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('RepoDetails', {repoId: item.id})}>
      <Card style={styles.card}>
        <Card.Title
          title={item.name}
          subtitle={`Stars: ${item.stargazers_count}`}
        />
        <Card.Content>
          <Text style={styles.description} numberOfLines={3}>
            {item.description || 'No description available.'}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search GitHub Repos"
        onChangeText={onChangeSearch}
        value={searchQuery}
        onSubmitEditing={onSubmitSearch}
        icon={() => <Text>🔎</Text>}
        clearIcon={() => <Text>X</Text>}
      />
      <FlatList
        data={repos}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  description: {
    marginTop: 5,
  },
});

export default RepoList;

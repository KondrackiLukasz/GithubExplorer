import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const UserRepositories = ({userId}) => {
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRepositories(currentPage);
  }, [userId, currentPage]);

  const fetchRepositories = async page => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/users/${userId}/repos?per_page=5&page=${page}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            // Authorization: 'token <your_github_pat>',
          },
        },
      );
      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${await response.text()}`,
        );
      }
      const data = await response.json();
      setHasMorePages(data.length === 5);
      setRepositories(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch repositories.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1); // Reset to the first page on refresh
    fetchRepositories(1);
  };

  if (isLoading && currentPage === 1) {
    // Only show loading indicator on initial page load
    return (
      <View style={styles.container}>
        <Text>Loading repositories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={false}
        data={repositories}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RepoDetails', {repoId: item.id})
            }>
            <View style={styles.repoContainer}>
              <Text style={styles.repoName}>{item.name}</Text>
              <Text style={styles.repoDescription}>
                {item.description || 'No description'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentPage === 1 && styles.disabledButton,
              ]}
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}>
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, !hasMorePages && styles.disabledButton]}
              disabled={!hasMorePages}
              onPress={() => setCurrentPage(currentPage + 1)}>
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  repoContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  repoName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  repoDescription: {
    fontSize: 14,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  navButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});

export default UserRepositories;

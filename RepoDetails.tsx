import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {format} from 'date-fns'; // Assuming you've installed date-fns
import LanguagesUsed from './RepoDetailsComponents/LanguagesUsed';
import Contributors from './RepoDetailsComponents/Contributors';
import RecentCommits from './RepoDetailsComponents/RecentCommits';

function RepoDetails({route}) {
  const {repoId} = route.params;
  const [repoDetails, setRepoDetails] = useState(null);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      const detailsResponse = await fetch(
        `https://api.github.com/repositories/${repoId}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',

          },
        },
      );
      const detailsData = await detailsResponse.json();
      setRepoDetails(detailsData);
    };

    fetchRepoDetails();
  }, [repoId]);

  const renderHeader = () => (
    <>
      <View style={styles.detailBlock}>
        <Text style={styles.repoName}>{repoDetails?.name}</Text>
        <Text style={styles.description}>
          {repoDetails?.description || 'No description available.'}
        </Text>
        <Text style={styles.detailText}>
          Created At: {format(new Date(repoDetails?.created_at), 'PPP')}
        </Text>
        <Text style={styles.detailText}>
          Last Updated: {format(new Date(repoDetails?.updated_at), 'PPP')}
        </Text>
        <Text style={styles.detailText}>
          Stars: {repoDetails?.stargazers_count}
        </Text>
        <Text style={styles.detailText}>Forks: {repoDetails?.forks_count}</Text>
        <Text style={styles.detailText}>
          Open Issues: {repoDetails?.open_issues_count}
        </Text>
        <Text style={styles.detailText}>
          Size: {(repoDetails?.size / 1024).toFixed(2)} MB
        </Text>
        <Text style={styles.detailText}>
          License: {repoDetails?.license?.name || 'No license information.'}
        </Text>
      </View>
      {repoDetails && <LanguagesUsed repoId={repoId} />}
      <Contributors repoId={repoId} ownerLogin={repoDetails?.owner?.login} />
    </>
  );

  if (!repoDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading repository details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={[{key: 'RecentCommits'}]} // You might have actual data for other sections here.
        renderItem={({item}) => {
          // Handle different item types if needed. For now, it's only RecentCommits.
          switch (item.key) {
            case 'RecentCommits':
              return <RecentCommits repoId={repoId} />;
            default:
              return null; // Placeholder for other item types
          }
        }}
        keyExtractor={item => item.key}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#555',
  },
  detailBlock: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  repoName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  description: {
    fontStyle: 'italic',
    marginBottom: 12,
    color: '#666',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
});

export default RepoDetails;

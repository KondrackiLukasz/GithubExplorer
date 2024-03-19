import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import UserRepositories from './UserDetailsComponents/UserRepositories';

const UserDetails = ({route}) => {
  const {contributorId} = route.params;
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/user/${contributorId}`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              //     Authorization: 'token YOUR_GITHUB_TOKEN_HERE',
            },
          },
        );
        if (!response.ok) {
          throw new Error(
            `GitHub API error: ${response.status} ${await response.text()}`,
          );
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [contributorId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Format date
  const formatDate = dateString => {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        {userDetails && (
          <>
            <Image
              source={{uri: userDetails.avatar_url}}
              style={styles.avatar}
            />
            <Text style={styles.name}>{userDetails.name}</Text>
            <Text style={styles.bio}>{userDetails.bio}</Text>
            <Text>Joined: {formatDate(userDetails.created_at)}</Text>
            <View style={styles.followContainer}>
              <Text style={styles.followText}>
                Followers: {userDetails.followers} - Following:{' '}
                {userDetails.following}
              </Text>
            </View>
            <Text>Public Repos: {userDetails.public_repos}</Text>
            {userDetails.email && <Text>Email: {userDetails.email}</Text>}
            {userDetails.location && (
              <Text>Location: {userDetails.location}</Text>
            )}
            <View style={styles.reposContainer}>
              <Text style={styles.reposTitle}>User Repositories</Text>
              <UserRepositories userId={userDetails.login} />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    alignItems: 'center',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bio: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  followText: {
    fontSize: 16,
  },
  reposContainer: {
    marginTop: 20, // Add some space before the repos section
    width: '100%', // Ensure the container uses full width for alignment
  },
  reposTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10, // Space before listing the repositories
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserDetails;

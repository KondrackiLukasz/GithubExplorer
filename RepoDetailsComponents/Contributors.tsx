import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// openContributorProfile and styles remain the same

const Contributors = ({repoId, ownerLogin}) => {
  const [contributors, setContributors] = useState([]);
  const [error, setError] = useState(''); // Add state to handle error messages

  useEffect(() => {
    const fetchContributors = async () => {
      const response = await fetch(
        `https://api.github.com/repositories/${repoId}/contributors?per_page=5`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization:
              'token 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',
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setContributors(data);
        } else {
          console.error(
            'Expected an array of contributors, but received:',
            data,
          );
          setError('Failed to load contributors data.'); // Update error message
          setContributors([]);
        }
      } else if (response.status === 403) {
        // Specific handling for 403 error
        //console.error('GitHub API error: 403 Forbidden - The amount of users is too large to fetch via the API.');
        setError('The amount of users is too large to fetch via the API.');
      } else {
        // Handle other HTTP errors
        console.error(
          'GitHub API error:',
          response.status,
          await response.text(),
        );
        setError('Failed to load contributors data.'); // Update error message
        setContributors([]);
      }
    };

    fetchContributors();
  }, [repoId]);
  return (
    <View style={styles.contributorsBlock}>
      <Text style={styles.blockTitle}>Contributors:</Text>
      {error ? (
        <Text style={styles.errorText}>{error}</Text> // Display error message if exists
      ) : (
        contributors
          .slice(0, 5)
          .map((contributor, index) => (
            <Contributor
              key={index}
              contributor={contributor}
              isOwner={contributor.login === ownerLogin}
            />
          ))
      )}
    </View>
  );
};

const Contributor = ({contributor, isOwner}) => {
  const navigation = useNavigation(); // If navigation prop is not directly available

  return (
    <TouchableOpacity
      style={styles.contributorContainer}
      onPress={() =>
        navigation.navigate('UserDetails', {contributorId: contributor.id})
      }>
      <Image source={{uri: contributor.avatar_url}} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.contributorName}>
          {contributor.login}{' '}
          {isOwner && <Text style={styles.ownerLabel}>(Owner)</Text>}
        </Text>
        <Text style={styles.contributions}>
          Contributions: {contributor.contributions}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red', // Choose an appropriate color for error messages
    fontSize: 16, // Adjust size as needed
  },
  contributorsBlock: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e7e7e7',
  },
  ownerLabel: {
    color: '#007bff', // Example color, adjust as needed
    fontWeight: 'normal',
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contributorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  contributorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contributions: {
    fontSize: 14,
  },
});

export default Contributors;

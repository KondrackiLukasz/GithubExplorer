import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

// openContributorProfile and styles remain the same

const Contributors = ({repoId, ownerLogin}) => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const fetchContributors = async () => {
      const response = await fetch(
        `https://api.github.com/repositories/${repoId}/contributors`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',

          },
        },
      );
      if (response.ok) {
        // Check if response status is 200-299
        const data = await response.json();
        if (Array.isArray(data)) {
          // Ensure data is an array
          setContributors(data);
        } else {
          console.error(
            'Expected an array of contributors, but received:',
            data,
          );
          setContributors([]); // Set to empty array if not array
        }
      } else {
        // Handle HTTP errors
        console.error(
          'GitHub API error:',
          response.status,
          await response.text(),
        );
        setContributors([]); // Set to empty array on error
      }
    };

    fetchContributors();
  }, [repoId]);
  return (
    <View style={styles.contributorsBlock}>
      <Text style={styles.blockTitle}>Contributors:</Text>
      {contributors.slice(0, 5).map((contributor, index) => (
        <Contributor
          key={index}
          contributor={contributor}
          isOwner={contributor.login === ownerLogin}
        />
      ))}
    </View>
  );
};
const Contributor = ({contributor, isOwner}) => (
  <TouchableOpacity
    style={styles.contributorContainer}
    onPress={() => openContributorProfile(contributor.html_url)}>
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

const openContributorProfile = url => {
  // Implement functionality to open the contributor's GitHub profile
  console.log(`Opening ${url}`);
};

const styles = StyleSheet.create({
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

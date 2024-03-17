import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

const RecentCommits = ({repoId}) => {
  const [recentCommits, setRecentCommits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [expandedCommit, setExpandedCommit] = useState(null);

  useEffect(() => {
    fetchCommits(currentPage);
  }, [repoId, currentPage]);

  const fetchCommits = async page => {
    setIsLoading(true);
    const response = await fetch(
      `https://api.github.com/repositories/${repoId}/commits?per_page=5&page=${page}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',

        },
      },
    );
    const data = await response.json();
    setHasMorePages(data.length === 5); // Assuming 5 is the per_page query parameter
    setRecentCommits(data); // Replace the current commits with new ones
    setIsLoading(false);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (message.length > maxLength) {
      return `${message.substring(0, maxLength)}...`;
    }
    return message;
  };

  const renderCommit = ({item, index}) => (
    <TouchableOpacity
      style={styles.commitItem}
      onPress={() => {
        if (expandedCommit === index) {
          setExpandedCommit(null); // Collapse if it's already expanded
        } else {
          setExpandedCommit(index); // Expand this commit
        }
      }}>
      <Image
        source={{
          uri: item.author?.avatar_url || 'https://placekitten.com/200/200',
        }}
        style={styles.avatar}
      />
      <View style={styles.commitDetails}>
        <Text style={styles.commitText}>
          {expandedCommit === index
            ? item.commit.message
            : truncateMessage(item.commit.message)}
        </Text>
        <Text style={styles.commitDate}>
          {formatDate(item.commit.committer.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.commitsBlock}>
      <Text style={styles.blockTitle}>Recent Commits:</Text>
      <FlatList
        data={recentCommits}
        renderItem={renderCommit}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
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
      {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  commitsBlock: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#dedede',
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
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commitText: {
    fontSize: 16,
  },
  commitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  commitDetails: {
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commitDate: {
    fontSize: 14,
    color: '#666',
  },
  loadMoreButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  loadMoreText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default RecentCommits;

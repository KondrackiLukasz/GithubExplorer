import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const languageColor = {
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  C: '#555555',
  CSharp: '#178600',
  CPlusPlus: '#f34b7d',
  CSS: '#563d7c',
  default: '#cccccc', // Default color for languages not listed above
};

const MIN_WIDTH_PERCENT = 2; // Minimum width percentage for visibility
const SCREEN_WIDTH = Dimensions.get('window').width; // Get the screen width

const LanguagesUsed = ({repoId}) => {
  const [languages, setLanguages] = useState({});
  const [totalBytes, setTotalBytes] = useState(0);

  useEffect(() => {
    const fetchLanguages = async () => {
      const response = await fetch(
        `https://api.github.com/repositories/${repoId}/languages`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',

          },
        },
      );
      const data = await response.json();
      const total = Object.values(data).reduce((acc, curr) => acc + curr, 0);
      setLanguages(data);
      setTotalBytes(total);
    };

    fetchLanguages();
  }, [repoId]);

  return (
    <View style={styles.languagesBlock}>
      <Text style={styles.blockTitle}>Languages Used:</Text>
      {Object.entries(languages).map(([language, bytes]) => {
        const usagePercent = (bytes / totalBytes) * 100;
        const barWidth = Math.max(usagePercent, MIN_WIDTH_PERCENT); // Ensure minimum visibility
        const showTextOutside = usagePercent < MIN_WIDTH_PERCENT * 5; // Adjust threshold for deciding text placement
        const barWidthInPixels = (SCREEN_WIDTH - 20) * (barWidth / 100); // Calculate the pixel width of the bar (-20 for padding)
        const canTextFitInside = barWidthInPixels > language.length * 20; // Check if text can fit inside the bar
        return (
          <View key={language} style={styles.row}>
            <View
              style={[
                styles.languageUsageBlock,
                {
                  backgroundColor:
                    languageColor[language] || languageColor.default,
                  width: `${barWidth}%`,
                },
              ]}>
              {!showTextOutside && canTextFitInside && (
                <Text style={styles.languageText}>
                  {language}: {usagePercent.toFixed(2)}%
                </Text>
              )}
            </View>
            {(showTextOutside || !canTextFitInside) && (
              <Text style={[styles.languageText, styles.textOutside]}>
                {language}: {usagePercent.toFixed(2)}%
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  languagesBlock: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e7e7e7',
    marginBottom: 20,
  },
  languageUsageBlock: {
    minHeight: 20,
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
  },
  languageText: {
    color: '#000000',
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  textOutside: {
    marginLeft: 10,
  },
});

export default LanguagesUsed;

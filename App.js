import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import firestore from '@react-native-firebase/firestore';

const Section = ({ content, label }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <View>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          {content}
        </Text>
      </View>
      <View>
        <Text style={styles.sectionLabel}>
          {label}
        </Text>
      </View>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  let [data, setData] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('TechBits')
      .onSnapshot(querySnapshot => {
        let data = [];
        querySnapshot.forEach(documentSnapshot => {
          data.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
        });
        setData(data);
      });
    return () => subscriber();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {
            data.map((x) => <Section key={x.id} content={x.content} label={x.label} />)
          }
          {
            data.length === 0 && <Text>No LifeBit posted!!!</Text>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingRight: 40,
    paddingLeft: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#AAA',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionLabel: {
    backgroundColor: '#EF1C4D',
    color: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 10,
    lineHeight: 20
  },
  sectionDescription: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'justify'
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

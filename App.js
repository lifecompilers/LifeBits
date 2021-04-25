import React, { useEffect, useState } from 'react';
import {
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

const Section = ({ content, author }) => {
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
      {
        author && <View>
          <Text style={styles.sectionAuthor}>
            - {author}
          </Text>
        </View>
      }
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
      .collection('LifeBits')
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
            data.map((x) => <Section key={x.id} content={x.content} author={x.author} />)
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#AAA',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionAuthor: {
    alignSelf: 'flex-end',
    fontSize: 11,
    fontWeight: '400',
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

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
import SplashScreen from 'react-native-splash-screen';

function getRandomColor(index) {
  const colors = ['#ff006e', 'blue', 'red', 'green', '#9b5de5'];
  return colors[index % 5];
}

const Section = ({ content, author, index }) => {
  return (
    <View style={[styles.sectionContainer, { backgroundColor: getRandomColor(index) }]}>
      <View>
        <Text
          style={
            styles.sectionDescription
          }>
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
        SplashScreen.hide();
      });
    return () => subscriber();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
          {
            data.map((x, index) => <Section key={x.id} content={x.content} author={x.author} index={index} />)
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
    padding: 20,
    paddingVertical: 30,
    marginVertical: 5,
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
    fontSize: 12,
    fontWeight: '400',
    color: '#FFF',
    paddingTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  sectionDescription: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'justify',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

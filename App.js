import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SplashScreen from 'react-native-splash-screen';
import Swiper from 'react-native-deck-swiper';

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
    <View style={styles.container}>
      {
        data?.length > 0 && <Swiper
          cards={data}
          renderCard={(x, index) => {
            return (
              <Section key={x.id} content={x.content} author={x.author} index={index} />
            )
          }}
          stackSeparation={30}
          cardIndex={0}
          infinite
          backgroundColor={'#EF1C4D'}
          cardStyle={styles.swiperContainer}
          stackSize={3}>
        </Swiper>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 100
  },
  swiperContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionContainer: {
    padding: 30,
    paddingVertical: 80,
    marginVertical: 5,
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderColor: '#FFF',
    borderWidth: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionAuthor: {
    alignSelf: 'flex-end',
    fontSize: 14,
    fontWeight: '400',
    color: '#FFF',
    paddingTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  sectionDescription: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'justify',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  }
});

export default App;

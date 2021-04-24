import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import firestore from '@react-native-firebase/firestore';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const openLink = async (url) => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right'
        }
      });
    }
    else Linking.openURL(url)
  } catch (error) {
    Alert.alert(error.message)
  }
}

const Section = ({ content, label, link }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionContent}>
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
      {
        link &&
        <Pressable
          onPress={() => openLink(link)}
        >
          <Text
            style={styles.link}
            numberOfLines={1}>{link}</Text>
        </Pressable>
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
            data.map((x) => <Section key={x.id} content={x.content} label={x.label} link={x.link} />)
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
  },
  sectionContent: {
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
  link: {
    paddingTop: 2,
    fontSize: 12,
    color: '#00F'
  },
});

export default App;

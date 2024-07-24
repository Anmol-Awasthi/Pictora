import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable, Platform, Text, Alert } from 'react-native';
import { BlurView } from 'expo-blur'; 
import { hp, wp } from '../../helpers/common';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Image } from 'expo-image';
import { Entypo, Octicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import Toast from 'react-native-toast-message';

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();  
  const uri = item?.webformatURL;
  const fileName = item?.previewURL.split('/').pop();
  const imageUrl = uri;
  const filePath = `${FileSystem.cacheDirectory}${fileName}`;
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    requestMediaLibraryPermission();
  }, []);

  const onLoad = () => {
    setStatus('');
  };

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS === 'web' ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const handleDownload = async () => {
    if (Platform.OS === 'web') {
      const anchor = document.createElement('a');
      anchor.href = imageUrl;
      anchor.target = '_blank';
      anchor.download = fileName || 'download';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      showToast('Link copied');
    } else {
      setStatus('downloading');
      const uri = await downloadFile();
      if (uri) {
        if (Platform.OS === 'android') {
          try {
            const newUri = `${FileSystem.documentDirectory}${fileName}`;
            await FileSystem.moveAsync({ from: filePath, to: newUri });
            await MediaLibrary.createAssetAsync(newUri);
            showToast('Image downloaded');
          } catch (error) {
            console.error("Failed to move file or save to gallery", error);
            showToast('Failed to save image to gallery');
          }
        }
        if (Platform.OS === 'ios') {
          try {
            await MediaLibrary.saveToLibraryAsync(uri);
            showToast('Image downloaded');
          } catch (error) {
            console.error("Failed to save image to gallery", error);
            showToast('Failed to save image to gallery');
          }
        }
        setStatus('');
      }
    }
  };

  const showToast = (message) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
    });
  }

  const toastConfig = {
    success: ({ text1, props, ...rest }) => (
      <View style={styles.toast}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    )
  }

  const handleImageShare = async () => {
    if (Platform.OS === 'web') {
      showToast("Link copied");
    } else {
      setStatus("sharing");
      const uri = await downloadFile();
      if (uri) {
        await Sharing.shareAsync(uri);
      }
    }
  };

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(
        imageUrl,
        filePath
      );
      setStatus('');
      return uri;
    } catch (e) {
      setStatus('');
      console.error("Download error:", e.message);
      showToast('Failed to download the image.');
      return null;
    }
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need permission to access your media library to save the image.');
    }
  };

  return (
    <BlurView
      style={styles.container}
      tint='dark'
      intensity={70}
    > 
      <View style={getSize()}>
        <View style={styles.loading}>
          {
            status === 'loading' && <ActivityIndicator size="large" color="white" />
          }
        </View>
        <Image
          transition={100}
          source={uri}
          onLoad={onLoad} 
          style={[styles.image, getSize()]} 
        />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name='x' size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          {
            status === 'downloading' ? 
            <View style={styles.button}><ActivityIndicator size='small' color='white' /></View>
            :  <Pressable style={styles.button} onPress={handleDownload}>
              <Octicons name='download' size={24} color="white" />
            </Pressable>
          }
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          {
            status === 'sharing' ? 
            <View style={styles.button}><ActivityIndicator size='small' color='white' /></View>
            :  <Pressable style={styles.button} onPress={handleImageShare}>
              <Entypo name='share' size={22} color="white" />
            </Pressable>
          }
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  image: {
    borderRadius: theme.radius.md,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loading: {
    position: 'absolute',
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    gap: 50,
    alignItems: 'center',
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
  },
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  toastText: {
    color: 'white',
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semiBold,
  }
});

export default ImageScreen;

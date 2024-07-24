import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getImageSize, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Animated, { FadeInRight } from "react-native-reanimated";

const ImageCard = ({ item, index, columns, router }) => {
  const isLastInRow = () => {
    return (index + 1) % columns === 0;
  };
  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) };
  };

  return (
    <Pressable onPress={()=>router.push({pathname: 'home/image', params: {...item}})} style={[styles.imagesWrapper, !isLastInRow() && styles.spacing]}>
      <Animated.View entering={FadeInRight.delay(index * 100).duration(1500).springify().damping(14)}>
        <Image
          style={[styles.image, getImageHeight()]}
          source={item?.webformatURL}
          transition={100}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: "100%",
  },
  imagesWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    borderCurve: "continuous",
    marginBottom: wp(2),
  },
  spacing: {
    marginRight: wp(2),
  },
});

export default ImageCard;

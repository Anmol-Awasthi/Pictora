import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { theme } from "../constants/theme";
import { data } from "../constants/data";
import { hp, wp } from "../helpers/common";
import Animated, { FadeInRight } from 'react-native-reanimated';

const Categories = ({ activeCategory, onChangeCategory }) => {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <View>
      <FlatList
        horizontal
        contentContainerStyle={styles.flatListContainer}
        showsHorizontalScrollIndicator={false}
        data={data.categories}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <CategoryItem
            isActive={activeCategory === item}
            handleChangeCategory={onChangeCategory}
            title={capitalizeFirstLetter(item)}
            category={item}
            index={index}
          />
        )}
      />
    </View>
  );
};

const CategoryItem = ({ title, category, index, isActive, handleChangeCategory }) => {
  const color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  const backgroundColor = isActive ? theme.colors.neutral(0.6) : theme.colors.white;

  return (
    <Animated.View entering={FadeInRight.delay(index * 150).duration(1000).springify().damping(14)}>
      <Pressable onPress={() => handleChangeCategory(isActive ? null : category)} style={[styles.category, { backgroundColor }]}>
        <Text style={[styles.title, { color }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    gap: 8,
    paddingHorizontal: wp(4),
  },
  category: {
    padding: 12,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderCurve: "continuous",
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
  },
});

export default Categories;

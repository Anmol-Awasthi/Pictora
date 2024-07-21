import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { theme } from "../constants/theme";
import { data } from "../constants/data";
import { hp, wp } from "../helpers/common";

const Categories = () => {
  return (
    <View>
      <FlatList
        horizontal
        contentContainerStyle={styles.flatListContainer}
        showsHorizontalScrollIndicator={false}
        data={data.categories}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <CategoryItem title={item} index={index} />
        )}
      />
    </View>
  );
};

const CategoryItem = ({ title, index }) => {
  return (
    <View index={index}>
      <Pressable style={styles.category}>
      <Text style={styles.title}>{title}</Text>
      </Pressable>
    </View>
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
        backgroundColor: 'white',
        borderWidth: 1,
        borderCurve: 'continuous',
    },
    title: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.medium,
    }
});

export default Categories;

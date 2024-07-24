import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { capitalize, hp } from "../helpers/common";
import { theme } from "../constants/theme";

const SectionView = ({ title, content }) => {
  return (
    <View style={{ gap: 2 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFiltersRow = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item) => {
    setFilters((prevFilters) => {
      if (!prevFilters) {
        prevFilters = {};
      }
      return {
        ...prevFilters,
        [filterName]: prevFilters[filterName] === item ? '' : item,
      };
    });
  };

  return (
    <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          let backgroundColor = isActive ? theme.colors.neutral(0.7) : "white";
          let color = isActive ? "white" : theme.colors.neutral(0.7);
          return (
            <Pressable
              onPress={() => onSelect(item)}
              key={index}
              style={[styles.outlinedButton, { backgroundColor }]}
            >
              <Text style={[styles.outlinedButtonText, { color }]}>
                {capitalize(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};


export const ColorsFilter = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item) => {
    setFilters((prevFilters) => {
      if (!prevFilters) {
        prevFilters = {};
      }
      return {
        ...prevFilters,
        [filterName]: prevFilters[filterName] === item ? '' : item,
      };
    });
  };

  return (
    <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          let borderColor = isActive ? theme.colors.neutral(0.9) : theme.colors.neutral(0.1);
          return (
            <Pressable
              onPress={() => onSelect(item)}
              key={index}
            >
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]}>

                </View>
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};


const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.8),
  },
  outlinedButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
  },
  outlinedButtonText: {
    fontSize: hp(2),
    fontWeight: theme.fontWeights.medium,
  },
  color: {
    height: 30,
    width: 40,
    borderRadius: theme.radius.sm-3,
    borderCurve: "continuous",
  },
  colorWrapper: {
    padding: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 2, 
    borderCurve: "continuous",
  }
});

export default SectionView;

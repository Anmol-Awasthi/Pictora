import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useMemo } from "react";
import { BlurView } from "expo-blur";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalize, hp } from "../helpers/common";
import { theme } from "../constants/theme";
import SectionView, { ColorsFilter, CommonFiltersRow } from "./FiltersView";
import { data } from "../constants/data";

const FiltersModal = ({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
}) => {
  const snapPoints = useMemo(() => ["75%"], []);

  const renderSections = () => {
    return Object.keys(sections).map((sectionName, index) => {
      const sectionView = sections[sectionName];
      let title = capitalize(sectionName);
      let sectionData = data.filters[sectionName];
      return (
        <Animated.View 
          entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}
          key={sectionName}
        >
          <SectionView
            title={title}
            content={sectionView({
              data: sectionData,
              filters,
              setFilters,
              filterName: sectionName,
            })}
          />
        </Animated.View>
      );
    });
  };

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={customBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {renderSections()}
        </View>

        {/* actions */}
        <Animated.View  entering={FadeInDown.delay(500).springify().damping(11)} style={styles.buttons}>
          <Pressable style={styles.resetButton} onPress={onReset}>
            <Text style={[styles.buttonText, { color: theme.colors.neutral(0.9) }]}>Reset</Text>
          </Pressable>
          <Pressable style={styles.applyButton} onPress={onApply}>
            <Text style={[styles.buttonText, { color: theme.colors.white }]}>Apply</Text>
          </Pressable>
        </Animated.View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  order: (props) => <CommonFiltersRow {...props} />,
  orientation: (props) => <CommonFiltersRow {...props} />,
  type: (props) => <CommonFiltersRow {...props} />,
  colors: (props) => <ColorsFilter {...props} />,
};

const customBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [1, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });

  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];
  return (
    <Animated.View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill} intensity={25} tint="dark" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semiBold,
    marginBottom: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.9),
    padding: 12,
    alignItems: "center",
    borderRadius: theme.radius.md,
    justifyContent: "center",
    borderCurve: "continuous",
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    alignItems: "center",
    borderRadius: theme.radius.md,
    justifyContent: "center",
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: theme.colors.neutral(0.1),
  },
  buttonText: {
    fontSize: hp(2.2),
    fontWeight: theme.fontWeights.medium,
  },
});

export default FiltersModal;

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import Categories from "../../components/categories";
import { apiCall } from "../../api";
import ImagesGrid from "../../components/ImagesGrid";
import { debounce, set } from "lodash";
import FiltersModal from "../../components/FiltersModal";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);
  const [filters, setFilters] = useState(null);
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const [isEndReached, setIsEndReached] = useState(false);
  const router = useRouter();

  var page = 1;

  useEffect(() => {
    fetchImages();
  }, []);
  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const handleSearch = (text) => {
    setSearch(text);
    page = 1;
    setImages([]);
    if (text.length > 2) {
      fetchImages({ page, q: text, ...filters }, false);
      setActiveCategory(null);
    } else if (text === "") {
      searchInputRef?.current?.clear();
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  const fetchImages = async (params = { page: 1 }, append = true) => {
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      if (append) {
        setImages([...images, ...res.data.hits]);
      } else {
        setImages([...res.data.hits]);
      }
    }
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;
  
    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };
  

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y:0,
      animated: true,
    })
  }

  const openFiltersModal = () => {
    modalRef.current?.present();
  };
  const closeFiltersModal = () => {
    modalRef.current?.close();
  };

  // console.log("filters", filters);

  const clearThisFilter = (filterName) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters(filterz);
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };
  

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp} className="flex-row items-baseline gap-1">
          <Text style={styles.title}>Pictora</Text>
          <Text>by Anmol</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={5}
      ref={scrollRef}
      contentContainerStyle={{ gap: 15 }}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Search for photos..."
            // value={search}
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
            style={styles.searchInput}
          />
          {search && (
            <Pressable
              onPress={() => handleSearch("")}
              style={styles.closeIcon}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>
        {/* Categories */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            onChangeCategory={handleChangeCategory}
          />
        </View>

        {/* Filters */}
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {
                      key=="colors"?(
                        <View style={{height: 20, width: 30, borderRadius: 7, backgroundColor: filters[key]}}></View>
                      ): <Text style={styles.filterItemText}>{filters[key]}</Text>
                    }

                    <Pressable
                      style={styles.filterIconClose}
                      onPress={() => clearThisFilter(key)}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Images Masonry Grid*/}
        <View>{images.length > 0 && <ImagesGrid images={images} router={router} />}</View>

        {/* loading */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>

      {/* Filters Modal */}
      <FiltersModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFiltersModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(5),
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 6,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
    paddingLeft: 8,
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 5,
    borderRadius: theme.radius.lg,
    marginRight: 5,
  },
  filters: {
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xs,
    padding: 8, 
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.9),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.9),
  },
  filterIconClose: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  }
});

import { View } from 'react-native';
import React from 'react';
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from './ImageCard';
import { getColumnCount, wp } from './../helpers/common';

const ImagesGrid = ({ images, router }) => {
  const columns = getColumnCount();

  return (
    <View style={{ flex: 1, minHeight: 3 }}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        initialNumToRender={1000}
        contentContainerStyle={{ paddingHorizontal: wp(4) }}
        renderItem={({ item, index }) => <ImageCard router={router} item={item} columns={columns} index={index} />}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default ImagesGrid;

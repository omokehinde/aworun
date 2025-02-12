import { View, Text, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { searchPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import EmptyState from '../../components/EmptyState';
import SearchInput from '../../components/SearchInput';

function Search() {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  console.log(query, posts);

  useEffect(() => {
    refetch();
  }, [query]);
 
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={ posts }
        keyExtractor={item => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results for
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              {query}
            </Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found"
            subtitle="No video found for this topic"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search;
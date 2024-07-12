import { Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import { router, usePathname } from 'expo-router';

import { icons } from '../constants';

function SearchInput({ initialQuery }){
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');

  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row  space-x-4">
        <TextInput 
            className="text-base mt-0.5 text-white flex-1 font-pregular"
            value={query}
            placeholder="Search for a video topic"
            placeholderTextColor="#CDCDE0"
            onChangeText={e => setQuery(e)}
        />
        <TouchableOpacity
          onPress={() => {
            if (!query) {
              Alert.alert('Missing query', 'Please input a topic to search videos about');
            }
            
            if (pathname.startsWith('/search')) router.setParams({ query });
            else router.push(`/search/${query}`);
          }}
        >
            <Image 
                className="w-5 h-5"
                resizeMode='contain'
                source={icons.search}
            />
        </TouchableOpacity>
    </View>
  )
}

export default SearchInput;
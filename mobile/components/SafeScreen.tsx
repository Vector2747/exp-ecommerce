import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';

const SafeScreen = ({children } : {children: React.ReactNode}) => {
    const insets = useSafeAreaInsets()
  
    return (
        <View className='flex-1 bg-black' style={{
                paddingTop : insets.top
            }}>
            <Text>
                {children}
            </Text>
        </View>
    )

}

export default SafeScreen
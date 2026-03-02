/*import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn,isLoaded } = useAuth()

  if (!isLoaded) return null; // for a better ux

  if (isSignedIn) {
    return <Redirect href={"/(tabs)"} />// 
  }

  return <Stack screenOptions={{ headerShown : false}}/>
}*/

import { Stack, useRouter } from "expo-router"
import { useAuth } from "@clerk/clerk-expo"
import { useEffect } from "react"

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)") // ou "/" selon ton arborescence
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded) return null

  return <Stack screenOptions={{ headerShown: false }} />
}
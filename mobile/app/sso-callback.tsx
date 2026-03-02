import { useEffect } from "react"
import { useRouter } from "expo-router"
import { useAuth } from "@clerk/clerk-expo"

export default function SsoCallback() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      // redirect après que Clerk ait fini
      if (isSignedIn) {
        router.replace("/(tabs)") // ou "/" selon ton app
      } else {
        router.replace("/(auth)") // si login échoué
      }
    }
  }, [isLoaded, isSignedIn])

  return null // rien à afficher
}
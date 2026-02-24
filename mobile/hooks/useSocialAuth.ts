import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

function useSocialAuth () {
    //const [ isLoading, setIsLoading ] = useState(false)
    const [ loadingStrategy, setLoadingStrategy ] = useState<string | null>(null)
    const { startSSOFlow} = useSSO()
    const handleSocialAuth = async (strategy : "oauth_google" | "oauth_apple") =>{
        //setIsLoading(true)
        setLoadingStrategy(strategy)
        try {
            const { createdSessionId,setActive } = await startSSOFlow({strategy})
            if(createdSessionId && setActive){
                await setActive({session : createdSessionId})
            }
        } catch (error) {
            console.log("Error in social auth", error)
            const provider = strategy === "oauth_google" ? "Google" : "Apple"
            Alert.alert("Error", `Failed to sign in with ${provider}. please try again.`)
        } finally {
            //setIsLoading(false)
            setLoadingStrategy(null)
        }
    }
    

    return{loadingStrategy, handleSocialAuth}
}

export default useSocialAuth;
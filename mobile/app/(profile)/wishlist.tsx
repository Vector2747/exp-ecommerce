import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { View,Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Modal } from "react-native";
import { useState } from "react";

const WishlistScreen = () => {
    const { wishlist,isLoading, isError, removeFromWishlist, isRemovingFromWishlist}= useWishlist()

    const { addToCart, isAddingToCart}= useCart()

    if (isLoading) return <LoadingUI />;
    if (isError) return <ErrorUI />;

    /*const handleRemoveFromWishlist = (productId:string, productName:string)=> {
        Alert.alert("Remove from wishlist", `Remove ${productName} from wishlist`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",

        onPress: () => removeFromWishlist(productId),
      },
    ]);
    }

    const handleAddToCart = (productId:string, productName:string) => {
        Alert.alert("Add to cart", `Add ${productName} to cart`,[
            {text: "Cancel", style: "cancel"},
            {
                text: "Add",
                style: "default",

                onPress: () => addToCart(
                { productId, quantity: 1 },
                {
                    onSuccess: () => Alert.alert("Success", `${productName} added to cart!`),
                    onError: (error: any) => {
                    Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
                    },
                }
                )
            }
        ])
    }*/
   const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"remove" | "add" | null>(null);
    const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);
   const handleRemoveFromWishlist = (productId: string, productName: string) => {
    setSelectedItem({ id: productId, name: productName });
    setModalType("remove");
    setModalVisible(true);
    };

    const handleAddToCart = (productId: string, productName: string) => {
    setSelectedItem({ id: productId, name: productName });
    setModalType("add");
    setModalVisible(true);
    };
    return (
        <SafeScreen>
      {/* HEADER */}
      <View className="px-6 pb-5 border-b border-surface flex-row items-center w-full">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">Wishlist</Text>
        <Text className="text-text-secondary text-sm ml-auto">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {wishlist.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6 w-full h-full">
          <Ionicons name="heart-outline" size={80} color="#666" />
          <Text className="text-text-primary font-semibold text-xl mt-4">
            Your wishlist is empty
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Start adding products you love!
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-background font-bold text-base">Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {wishlist.map((item) => (
              <TouchableOpacity
                key={item._id}
                className="bg-surface rounded-3xl overflow-hidden mb-3"
                activeOpacity={0.8}
                // onPress={() => router.push(`/product/${item._id}`)}
              >
                <View className="flex-row p-4">
                  <Image
                    source={item.images[0]}
                    className="rounded-2xl bg-background-lighter"
                    style={{ width: 96, height: 96, borderRadius: 8 }}
                  />

                  <View className="flex-1 ml-4">
                    <Text className="text-text-primary font-bold text-base mb-2" numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text className="text-primary font-bold text-xl mb-2">
                      ${item.price.toFixed(2)}
                    </Text>

                    {item.stock > 0 ? (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        <Text className="text-green-500 text-sm font-semibold">
                          {item.stock} in stock
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                        <Text className="text-red-500 text-sm font-semibold">Out of Stock</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    className="self-start bg-red-500/20 p-2 rounded-full"
                    activeOpacity={0.7}
                    onPress={() => handleRemoveFromWishlist(item._id, item.name)}
                    disabled={isRemovingFromWishlist}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                {item.stock > 0 && (
                  <View className="px-4 pb-4">
                    <TouchableOpacity
                      className="bg-primary rounded-xl py-3 items-center"
                      activeOpacity={0.8}
                      onPress={() => handleAddToCart(item._id, item.name)}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <ActivityIndicator size="small" color="#121212" />
                      ) : (
                        <Text className="text-background font-bold">Add to Cart</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      <Modal transparent animationType="fade" visible={modalVisible}>
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
            <View className="bg-surface w-full rounded-3xl p-6">

            <Text className="text-text-primary text-xl font-bold mb-3">
                {modalType === "remove" ? "Remove from Wishlist" : "Add to Cart"}
            </Text>

            <Text className="text-text-secondary mb-6">
                {modalType === "remove"
                ? `Are you sure you want to remove ${selectedItem?.name}?`
                : `Add ${selectedItem?.name} to your cart?`}
            </Text>

            <View className="flex-row justify-end gap-4">
                <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 rounded-xl bg-background-lighter"
                >
                <Text className="text-text-primary font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={() => {
                    if (modalType === "remove" && selectedItem) {
                    removeFromWishlist(selectedItem.id);
                    }

                    if (modalType === "add" && selectedItem) {
                    addToCart(
                        { productId: selectedItem.id, quantity: 1 },
                        {
                        onSuccess: () => {},
                        onError: () => {},
                        }
                    );
                    }

                    setModalVisible(false);
                }}
                className={`px-4 py-2 rounded-xl ${
                    modalType === "remove" ? "bg-red-500" : "bg-primary"
                }`}
                >
                <Text className="text-background font-bold">
                    {modalType === "remove" ? "Remove" : "Add"}
                </Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </Modal>
    </SafeScreen>
    )
}

export default WishlistScreen;

function LoadingUI() {
  return (
    <SafeScreen>
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">Wishlist</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="text-text-secondary mt-4">Loading wishlist...</Text>
      </View>
    </SafeScreen>
  );
}

function ErrorUI() {
  return (
    <SafeScreen>
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">Wishlist</Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Failed to load wishlist
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Please check your connection and try again
        </Text>
      </View>
    </SafeScreen>
  );
}
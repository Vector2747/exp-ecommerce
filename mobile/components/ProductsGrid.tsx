import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Modal } from "react-native";
import { useState } from "react";

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
}

const ProductsGrid = ({ products, isLoading, isError }: ProductsGridProps) => {
  const { isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } =
    useWishlist();

  const { isAddingToCart, addToCart } = useCart();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  /*const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert("Success", `${productName} added to cart!`);
        },
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
        },
      }
    );
  };*/
  const handleAddToCart = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setModalVisible(true);
  };

  const renderProduct = ({ item: product }: { item: Product }) => (
    <TouchableOpacity
      className="bg-surface rounded-3xl overflow-hidden mb-3"
      style={{ width: "48%" }}
      activeOpacity={0.8}
      onPress={() => router.push({
                pathname: "/product/[id]",
                params: { id: product._id },
              })}
    >
      <View className="relative">
        <Image
          source={{ uri: product.images[0] }}
          className="w-full h-44 bg-background-lighter"
          resizeMode="cover"
        />

        <TouchableOpacity
          className="absolute top-3 right-3 bg-black/30 backdrop-blur-xl p-2 rounded-full"
          activeOpacity={0.7}
          onPress={() => toggleWishlist(product._id)}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={18}
              color={isInWishlist(product._id) ? "#FF6B6B" : "#FFFFFF"}
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text className="text-text-secondary text-xs mb-1">{product.category}</Text>
        <Text className="text-text-primary font-bold text-sm mb-2" numberOfLines={2}>
          {product.name}
        </Text>

        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={12} color="#FFC107" />
          <Text className="text-text-primary text-xs font-semibold ml-1">
            {product.averageRating.toFixed(1)}
          </Text>
          <Text className="text-text-secondary text-xs ml-1">({product.totalReviews})</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-primary font-bold text-lg">${product.price.toFixed(2)}</Text>

          <TouchableOpacity
            className="bg-primary rounded-full w-8 h-8 items-center justify-center"
            activeOpacity={0.7}
            onPress={() => handleAddToCart(product._id, product.name)}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <Ionicons name="add" size={18} color="#121212" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="text-text-secondary mt-4">Loading products...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-20 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text className="text-text-primary font-semibold mt-4">Failed to load products</Text>
        <Text className="text-text-secondary text-sm mt-2">Please try again later</Text>
      </View>
    );
  }

  

  return (
    <View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        ListEmptyComponent={NoProductsFound}
      />
      {/* Confirmation Modal */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-surface w-full rounded-3xl p-6">

            <Text className="text-text-primary text-xl font-bold mb-3">
              Add to Cart
            </Text>

            <Text className="text-text-secondary mb-6">
              Add {selectedProduct?.name} to your cart?
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
                  if (!selectedProduct) return;

                  addToCart(
                    { productId: selectedProduct.id, quantity: 1 },
                    {
                      onSuccess: () => {
                        setModalVisible(false);
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 2000);
                      },
                    }
                  );
                }}
                className="px-4 py-2 rounded-xl bg-primary"
              >
                <Text className="text-background font-bold">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Success Toast */}
      {showSuccess && (
        <View className="absolute top-20 left-6 right-6 bg-primary rounded-2xl p-4 flex-row items-center shadow-lg z-50">
          <Ionicons name="checkmark-circle" size={20} color="#121212" />
          <Text className="text-background font-bold ml-3 flex-1">
            Added to cart successfully!
          </Text>
        </View>
      )}
    </View>
  );//return (<Text>blud</Text>)
};

export default ProductsGrid;

function NoProductsFound() {
  return (
    <View className="py-20 items-center justify-center">
      <Ionicons name="search-outline" size={48} color={"#666"} />
      <Text className="text-text-primary font-semibold mt-4">No products found</Text>
      <Text className="text-text-secondary text-sm mt-2">Try adjusting your filters</Text>
    </View>
  );
}
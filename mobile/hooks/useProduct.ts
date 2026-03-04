import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types";

export const useProduct = (productId: string) => {
  const api = useApi();

  const result = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      console.log("PRODUCT API RESPONSE:", data); // 👈 AJOUTE ÇA
      return data?.product;
    },
    enabled: !!productId,
  });

  return result;
};
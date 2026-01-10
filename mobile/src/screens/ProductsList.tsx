import { useEffect, useState } from "react";
import { 
  View,
  Text,
  FlatList,
  Image,
  StyleSheet
} from "react-native";
import { getProducts } from "@/services/products.services";
import { Product } from "@/types/Product";
import { API_URL } from "../config/env";

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <FlatList
    data={products}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View style={styles.container}>
        {item.img_url && (
          <Image 
            source={{ uri: `${API_URL}${item.img_url}` }}
            style={styles.image}
            />
        )}
        <Text>{item.name}</Text>
        <Text>{item.quantity}</Text>
        <Text>R$ {item.price}</Text>
      </View>
    )}
    />
  )
}


const styles = StyleSheet.create({
  container: {
    padding: 12
  },
  image: {
    width: 80,
    height: 80,
  }
})
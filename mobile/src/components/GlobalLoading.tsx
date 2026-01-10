import { 
  ActivityIndicator, 
  View,
  StyleSheet
} from "react-native";
import { useLoading } from "../contexts/LoadingContext";

export function GlobalLoading() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  }
})
/* 
import { useLoading } from "@/contexts/LoadingContext";
import { useNavigation } from "@react-navigation/native";
 */
import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  return (
    <SafeAreaView style={styles.containerPai}>
      {/* Container superior */}
      <View style={styles.filhoSuperior}>
        <Image
          source={require("../../../assets/logo.jpg")}
          style={styles.img}
        />
      </View>
      {/* Inicio do container inferior */}
      <View style={styles.filhoInferior}>
        <View style={styles.form}>
          <Text style={styles.titulo}>Entre e assuma o controle do seu inventário.</Text>
          <TextInput style={styles.email}
          value="email"
          onChangeText={setEmail}
          />
          <TextInput style={styles.senha}
          value="senha"
          onChangeText={setSenha}
          />
          <TouchableOpacity style={styles.button}>Teste</TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Exportação da página
export default LoginScreen;

const styles = StyleSheet.create({
  containerPai: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#531ADB",
  },
  filhoSuperior: {
    height: "50%",
  },
  filhoInferior: {
    height: "50%",
  },
  img: {
    height: "100%",
    width: "100%",
  },
  form: {
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 26,
  },
  titulo: {
    color: "#000000",
    fontSize: 20,
    alignItems: 'center'
  },
  email: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 50,
  },
  senha: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 50,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#006ffd",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

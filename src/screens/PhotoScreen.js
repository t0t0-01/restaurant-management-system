import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Input, Button } from "@rneui/themed";
import { Feather, AntDesign, FontAwesome } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";
import {
  BACKGROUND_COLOR,
  PRIMARY_GREEN,
  INPUT_TEXT_COLOR,
} from "../constants";
import server from "../api/server";

function splitString(str) {
  const idx = str.indexOf(" ");
  const firstPart = str.slice(0, idx);
  const secondPart = str.slice(idx + 1);
  return [firstPart, secondPart];
}

const PhotoScreen = ({ route, navigation }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [emailExists, setEmailExists] = useState(false);

  const { email, password, phone_nb, dob, type } = route.params;

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 1],
      quality: 1,
      base64: true,
    });

    asset = result.assets[0];

    if (!asset.cancelled) {
      setImageUri(asset.uri);
      base_string = asset.base64;
      setImage("data:image/jpeg;base64," + base_string);
    }
  };

  const signUp = async () => {
    try {
      const endpoint = type == "customer" ? "user" : "staff";
      console.log(`/${endpoint}/sign_up`);
      console.log({
        first_name: splitString(name)[0],
        last_name: splitString(name)[1],
        email: email,
        password: password,
        phone_nb: phone_nb,
        date_of_birth: dob,
      });
      const response = await server.post(`/${endpoint}/sign_up`, {
        first_name: splitString(name)[0],
        last_name: splitString(name)[1],
        email: email,
        password: password,
        phone_nb: phone_nb,
        date_of_birth: dob,
      });

      console.log(response.data);

      if (response.data.success == true) {
        setEmailExists(false);
        console.log("success");

        const formData = new FormData();

        formData.append("image", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });

        const img_response = await server.post(
          `${endpoint}/upload_profile_picture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },

            params: {
              id: response.data.data,
            },
          }
        );

        navigation.dispatch(StackActions.popToTop());
      } else if (response.data.data == "Email already exists!") {
        setEmailExists(true);
        console.log("email exists");
      } else {
        console.log("Other error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.formContainer}>
        <View>
          {image ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleChoosePhoto}
            >
              <FontAwesome name="pencil" size={30} color={PRIMARY_GREEN} />
            </TouchableOpacity>
          ) : (
            <></>
          )}

          <View style={styles.imageContainer}>
            {image ? (
              <View>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            ) : (
              <View style={styles.cameraContainer}>
                <TouchableOpacity
                  onPress={handleChoosePhoto}
                  style={{
                    alignSelf: "flex-end",
                    marginRight: "20%",
                    marginTop: "-5%",
                  }}
                >
                  <AntDesign name="plus" size={35} color="white" />
                </TouchableOpacity>
                <View style={{ marginTop: "-5%" }}>
                  <Feather name="camera" size={75} color="white" />
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.nameView}>
          <Input
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="John Doe"
            inputStyle={{
              ...styles.inputStyle,
              fontSize: 25,
              fontWeight: "bold",
            }}
            textAlign="center"
          />
          <Text style={styles.inputStyle}>
            This is your name as it will appear on the platform.
          </Text>
          <Text style={styles.inputStyle}>
            We recommend you put your full name.
          </Text>
        </View>
      </View>

      <Button
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.loginButton}
        title="Sign Up"
        titleStyle={{ fontWeight: "bold" }}
        onPress={signUp}
      ></Button>

      {emailExists ? (
        <Text style={styles.errorText}>Email already exists!</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: BACKGROUND_COLOR,
  },
  imageContainer: {
    width: 175,
    height: 175,
    borderRadius: 175 / 2,
    overflow: "hidden",
    marginVertical: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  cameraContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: PRIMARY_GREEN,
    justifyContent: "center",
    alignItems: "center",
  },

  nameView: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginHorizontal: "8%",
  },

  inputStyle: {
    color: INPUT_TEXT_COLOR,
  },

  loginButton: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 30,
    borderWidth: "8%",
    borderColor: PRIMARY_GREEN,
  },

  buttonContainer: {
    width: "95%",
    paddingHorizontal: 40,
    marginTop: "15%",
  },

  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  editButton: {
    alignSelf: "flex-end",
    marginBottom: "-8%",
  },

  errorText: {
    alignSelf: "center",
    color: "red",
    paddingTop: 15,
  },
});

export default PhotoScreen;

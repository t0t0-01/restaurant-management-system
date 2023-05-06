import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LIGHT_TEXT, PRIMARY_GREEN } from "../constants";
import { FontAwesome } from "@expo/vector-icons";

const OrderDishCard = ({ item, count, onPressPlus, onPressMinus }) => {
  return (
    <View style={styles.mainView}>
      <Image
        source={{
          uri: "data:image/png;base64," + item.picture,
        }}
        style={styles.image}
      />
      <View style={styles.textView}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>{`$${item.price}`}</Text>
      </View>

      <View style={styles.countCostView}>
        <View style={styles.countView}>
          <TouchableOpacity onPress={onPressMinus}>
            <FontAwesome name="minus-circle" size={24} color={PRIMARY_GREEN} />
          </TouchableOpacity>
          <Text>{count}</Text>

          <TouchableOpacity onPress={onPressPlus}>
            <FontAwesome name="plus-circle" size={24} color={PRIMARY_GREEN} />
          </TouchableOpacity>
        </View>
        <Text style={styles.totalText}>${count * item.price}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    marginHorizontal: 10,
    borderRadius: 25,
    flexDirection: "row",
    backgroundColor: "white",
    height: 100,
    alignItems: "center",
    paddingRight: 5,
    marginVertical: 10,
  },

  countCostView: {
    flex: 1.3,
    alignItems: "center",
  },

  countView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    alignSelf: "stretch",
    marginVertical: 3,
  },
  image: {
    width: 100,
    height: "100%",
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    marginRight: 15,
  },
  textView: {
    marginVertical: 5,

    flex: 2.5,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  totalText: {
    color: LIGHT_TEXT,
  },
});
export default OrderDishCard;

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import RatingStars from "./RatingStars";

import { useNavigation } from "@react-navigation/native";

const RestaurantCard = ({ item, horizontal = true }) => {
  const navigation = useNavigation();

  return (
    <View style={horizontal ? styles.item : styles.itemVertical}>
      <TouchableOpacity
        onPress={() => {
          console.log(item);

          navigation.navigate("RestaurantNavigator", {
            screen: "Restaurant",
            params: { id: item.restaurant_id },
          });
        }}
      >
        <Image
          source={{ uri: "data:image/png;base64," + item.images[0] }}
          style={horizontal ? styles.image : styles.imageVertical}
        />
      </TouchableOpacity>
      <View style={horizontal ? styles.textView : styles.textViewVertical}>
        <View>
          <Text style={styles.title}>{item.name}</Text>
          <Text>
            {item.cuisine.map((element, index, arr) => {
              if (index != arr.length - 1) {
                return element + ", ";
              } else {
                return element;
              }
            })}
          </Text>
        </View>
        <View style={styles.ratingView}>
          <RatingStars rating={item.avg_rating} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 10,
    borderRadius: 25,
  },

  itemVertical: {
    borderRadius: 25,
    marginVertical: 15,
  },

  image: {
    width: 275,
    height: 175,
    borderRadius: 25,
  },

  imageVertical: {
    width: "90%",
    height: 175,
    borderRadius: 25,
    alignSelf: "center",
  },

  textView: {
    marginHorizontal: 0,
    marginTop: 5,
    marginBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textViewVertical: {
    marginHorizontal: 25,
    marginTop: 5,
    marginBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  ratingView: {
    marginRight: 5,
  },
});
export default RestaurantCard;

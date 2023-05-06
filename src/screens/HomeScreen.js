import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RestaurantCard from "../components/RestaurantCard";
import useCustomFont from "../hooks/useCustomFont";
import { PRIMARY_GREEN, GREY_INFO_ICON_COLOR } from "../constants";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import server from "../api/server";

const ListTitle = ({ title, screen = null, type }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.listTitleView}
      onPress={screen ? () => navigation.navigate(screen) : null}
    >
      <Text style={styles.listTitle}>{title}</Text>
      <FontAwesome
        name={type == "customer" ? "angle-right" : "pencil"}
        size={type == "customer" ? 27 : 20}
        color={GREY_INFO_ICON_COLOR}
      />
    </TouchableOpacity>
  );
};

const RestaurantSection = ({ title, restaurant_data }) => {
  return (
    <View style={styles.mainView}>
      <ListTitle title={title} type={"customer"} />
      <FlatList
        data={restaurant_data}
        renderItem={({ item }) => <RestaurantCard item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  const isFontLoaded = useCustomFont();

  const [RESTAURANTS, setRESTAURANTS] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await server.get("/restaurant/get_all");
        setRESTAURANTS(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRestaurants();
  }, []);

  const sections = ["Discounted", "Ramadan Specials", "Popular Restaurants"];

  if (!RESTAURANTS) return null;

  if (!isFontLoaded) {
    return null;
  }

  return (
    <View
      style={{
        ...styles.masterView,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
      }}
    >
      <Text style={styles.title}>Restaurant Selection</Text>

      <FlatList
        data={[
          RESTAURANTS.slice(0, 5),
          RESTAURANTS.slice(5, 10),
          RESTAURANTS.slice(10),
        ]}
        renderItem={({ item, index }) => {
          return (
            <RestaurantSection title={sections[index]} restaurant_data={item} />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  masterView: {
    justifyContent: "center",
  },
  title: {
    color: PRIMARY_GREEN,
    fontFamily: "Satisfy",
    alignSelf: "center",
    fontSize: 35,
    marginTop: 15,
    marginBottom: 10,
  },

  mainView: {
    marginVertical: 15,
  },

  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  listTitleView: {
    marginHorizontal: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default HomeScreen;

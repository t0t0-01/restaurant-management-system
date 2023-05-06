import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "@rneui/themed";
import RestaurantCard from "../components/RestaurantCard";
import server from "../api/server";

const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
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

  const fetchQuery = async (query) => {
    try {
      const response = await server.get("/restaurant/get_by_name", {
        params: { restaurant_name: query },
      });

      setRESTAURANTS(response.data);
      console.log(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  if (!RESTAURANTS) return null;

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <SearchBar
        placeholder="Type Here..."
        value={searchText}
        onChangeText={(value) => {
          setSearchText(value);
        }}
        onSubmitEditing={() => fetchQuery(searchText)}
        onClear={() => {
          setSearchText("");
          fetchQuery("");
        }}
        platform="ios"
        containerStyle={styles.searchContainer}
      />

      <View style={{ paddingBottom: 120 }}>
        <FlatList
          data={RESTAURANTS}
          renderItem={({ item }) => (
            <RestaurantCard item={item} horizontal={false} />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: "#f2f2f2",
    marginHorizontal: 10,
  },
});

export default SearchScreen;

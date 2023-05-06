import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckBox } from "@rneui/themed";
import ReviewCard from "../components/ReviewCard";
import { PRIMARY_GREEN } from "../constants";
import server from "../api/server";
import AuthContext from "../context/AuthContext";

const StaffReviewsScreen = () => {
  const insets = useSafeAreaInsets();
  const [food, setFood] = useState(false);
  const [price, setPrice] = useState(false);
  const [ambiance, setAmbiance] = useState(false);
  const [service, setService] = useState(false);
  const [location, setLocation] = useState(false);
  const { userToken } = useContext(AuthContext);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await server.get("/restaurant/get_review", {
          params: { restaurant_id: userToken.restaurant_id },
        });
        console.log(response.data);

        setReviews(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviews();
  }, []);

  if (!reviews) return null;
  const data_to_show = reviews.filter((review) => {
    if (food && review.classes.food) return true;
    if (price && review.classes.price) return true;
    if (ambiance && review.classes.ambiance) return true;
    if (service && review.classes.service) return true;
    if (location && review.classes.location) return true;
    return false;
  });

  return (
    <View
      style={{
        ...styles.mainView,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <ScrollView
        horizontal
        style={styles.selectionHeader}
        showsHorizontalScrollIndicator={false}
      >
        <CheckBox
          checked={food}
          title="Food"
          onPress={() => setFood(!food)}
          checkedColor={PRIMARY_GREEN}
          textStyle={{ marginLeft: 5 }}
          containerStyle={styles.checkboxView}
        />
        <CheckBox
          checked={price}
          title="Price"
          onPress={() => setPrice(!price)}
          checkedColor={PRIMARY_GREEN}
          textStyle={{ marginLeft: 5 }}
          containerStyle={styles.checkboxView}
        />

        <CheckBox
          checked={service}
          title="Service"
          onPress={() => setService(!service)}
          checkedColor={PRIMARY_GREEN}
          textStyle={{ marginLeft: 5 }}
          containerStyle={styles.checkboxView}
        />
        <CheckBox
          checked={ambiance}
          title="Ambiance"
          onPress={() => setAmbiance(!ambiance)}
          checkedColor={PRIMARY_GREEN}
          textStyle={{ marginLeft: 5 }}
          containerStyle={styles.checkboxView}
        />
        <CheckBox
          checked={location}
          title="Location"
          onPress={() => setLocation(!location)}
          checkedColor={PRIMARY_GREEN}
          textStyle={{ marginLeft: 5 }}
          containerStyle={styles.checkboxView}
        />
      </ScrollView>
      <View style={{ flex: 30 }}>
        <FlatList
          data={
            !food && !price && !ambiance && !service && !location
              ? reviews
              : data_to_show
          }
          renderItem={({ item }) => {
            return (
              <ReviewCard
                rating={item.rating}
                user={item.customer.first_name + " " + item.customer.last_name}
                review={item.comment}
                horizontal={false}
                classes={item.classes}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "white",
    flex: 1,
  },
  selectionHeader: {
    flexDirection: "row",
    marginVertical: 20,
    marginHorizontal: 10,
    flex: 1,
  },

  checkboxView: {
    margin: 0,
    padding: 0,
  },
});

export default StaffReviewsScreen;

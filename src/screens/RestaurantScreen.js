import React, { useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Button } from "@rneui/themed";
import { GREY_INFO_ICON_COLOR, PRIMARY_GREEN } from "../constants";
import useCustomFont from "../hooks/useCustomFont";
import { FontAwesome } from "@expo/vector-icons";
import RestaurantInfo from "../components/RestaurantInfo";
import ReviewCard from "../components/ReviewCard";
import DishCard from "../components/DishCard";
import { Overlay } from "@rneui/themed";
import { useState } from "react";
import BookingLogistics from "../components/BookingLogistics";
import AuthContext from "../context/AuthContext";
import server from "../api/server";

const MARGINBETWEEN = 5;

const ListTitle = ({ title, screen = null, type, params = null }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.listTitleView}
      onPress={screen ? () => navigation.navigate(screen, params) : null}
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

const RestaurantScreen = ({ route, navigation }) => {
  const { userToken } = useContext(AuthContext);

  const [isVisible, setIsVisible] = useState(false);
  const [rest, setRest] = useState(null);
  const [dates_and_times, setDatesAndTimes] = useState(null);

  const isFontLoaded = useCustomFont();

  const { id } = route.params;

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await server.get("/restaurant/get_by_id", {
          params: {
            restaurant_id: id,
          },
        });
        setRest(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRestaurant();
  }, []);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const dates_response = await server.get("/restaurant/get_date_time", {
          params: { restaurant_id: id },
        });
        setDatesAndTimes(dates_response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDates();
  }, [rest]);

  if (!isFontLoaded) {
    return null;
  }

  if (rest) {
    return (
      <>
        <ScrollView
          contentContainerStyle={{
            ...styles.mainView,
          }}
        >
          <View style={styles.titleContainer}>
            <Image
              source={{
                uri: "data:image/png;base64," + rest.images[0],
              }}
              style={styles.mainImage}
            />
            <View style={styles.infoView}>
              <Text style={styles.titleName}>{rest.name}</Text>
              <RestaurantInfo
                address={rest.address}
                phone={rest.phone_number}
                hours={rest.hours_of_operation}
                cuisine={rest.cuisine}
                website={rest.website}
                average_rating={rest.avg_rating}
                facebook={rest.social_media_pages.facebook}
                instagram={rest.social_media_pages.instagram}
              />
            </View>
          </View>

          <View style={styles.listView}>
            <ListTitle title="Images" type={userToken.category} />

            <FlatList
              data={rest.images}
              horizontal
              renderItem={({ item }) => (
                <Image
                  source={{ uri: "data:image/png;base64," + item }}
                  style={styles.image}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.listView}>
            <ListTitle
              title="Reviews"
              screen={
                userToken.category == "customer" ? "Reviews" : "StaffReviews"
              }
              params={{
                reviews: rest.reviews,
                image: rest.images[0],
                restaurant_id: id,
              }}
              type={userToken.category}
            />

            <FlatList
              data={rest.reviews}
              horizontal
              renderItem={({ item }) => (
                <ReviewCard
                  user={
                    item.customer.first_name + " " + item.customer.last_name
                  }
                  review={item.comment}
                  rating={item.rating}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.listView}>
            <ListTitle title="Menu Items" type={userToken.category} />

            <FlatList
              data={rest.dishes}
              horizontal
              renderItem={({ item }) => <DishCard item={item} />}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ScrollView>

        {userToken.category == "customer" ? (
          <>
            <View style={styles.buttonView}>
              <Button
                title="Place a Reservation"
                buttonStyle={styles.button}
                onPress={() => setIsVisible(true)}
              />
            </View>
            <Overlay
              isVisible={isVisible}
              onBackdropPress={() => setIsVisible(!isVisible)}
              overlayStyle={{ borderRadius: 15, width: "98%" }}
            >
              <BookingLogistics
                dates_and_times={dates_and_times}
                current_week={dates_and_times.current_date}
                onNext={(date, time) => {
                  setIsVisible(false);
                  navigation.navigate("TableBooking", {
                    id: id,
                    date: date,
                    time: time,
                  });
                }}
              />
            </Overlay>
          </>
        ) : null}
      </>
    );
  }
};

const styles = StyleSheet.create({
  mainView: {},

  titleContainer: {
    backgroundColor: "white",
    padding: 0,
    marginBottom: MARGINBETWEEN,
  },
  mainImage: {
    width: "100%",
    paddingTop: 350,
  },

  infoView: {
    marginHorizontal: 10,
    paddingVertical: 10,
  },

  image: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginHorizontal: 10,
  },

  titleName: {
    fontSize: 35,
    color: PRIMARY_GREEN,
    fontFamily: "Satisfy",
  },

  listView: {
    width: "100%",
    backgroundColor: "white",
    marginVertical: MARGINBETWEEN,
    paddingBottom: 20,
  },

  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  listTitleView: {
    marginHorizontal: 12,
    marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  buttonView: {
    backgroundColor: "white",
  },

  button: {
    borderRadius: 10,
    backgroundColor: PRIMARY_GREEN,
    margin: 15,
    height: 45,
  },
  noRestaurantText: {
    alignSelf: "center",
  },
});
export default RestaurantScreen;

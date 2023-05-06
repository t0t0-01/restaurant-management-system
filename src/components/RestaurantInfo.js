import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  Entypo,
} from "@expo/vector-icons";
import { PRIMARY_GREEN } from "../constants";
import RatingStars from "./RatingStars";

const RestaurantInfo = ({
  address,
  phone,
  hours,
  cuisine,
  website,
  average_rating,
  facebook,
  instagram,
}) => {
  return (
    <View style={styles.mainView}>
      <View style={styles.rowView}>
        <View style={styles.infoEntryView}>
          <RatingStars rating={average_rating} />
        </View>

        <View style={styles.infoEntryView}>
          <MaterialCommunityIcons
            name="chef-hat"
            size={24}
            color={PRIMARY_GREEN}
            style={styles.icon}
          />
          <Text>
            {cuisine.map((item, index, arr) => {
              return index == arr.length - 1 ? item : item + ", ";
            })}
          </Text>
        </View>
      </View>

      <View style={styles.rowView}>
        <View style={styles.infoEntryView}>
          <AntDesign
            name="clockcircle"
            size={20}
            color={PRIMARY_GREEN}
            style={styles.icon}
          />
          <Text>{hours}</Text>
        </View>
        <View style={styles.infoEntryView}>
          <FontAwesome
            name="phone"
            size={24}
            color={PRIMARY_GREEN}
            style={styles.icon}
          />
          <Text
            onPress={() => Linking.openURL(`tel:${phone.replace(/-|\s/g, "")}`)}
          >
            {phone}
          </Text>
        </View>
      </View>

      <View style={styles.rowView}>
        <View style={styles.infoEntryView}>
          <Ionicons
            name="ios-location"
            size={24}
            color={PRIMARY_GREEN}
            style={styles.icon}
          />
          <Text>{address}</Text>
        </View>
      </View>

      <View style={styles.rowView}>
        <View style={styles.infoEntryView}>
          <Feather
            name="globe"
            size={24}
            color={PRIMARY_GREEN}
            style={styles.icon}
          />
          <Text onPress={() => Linking.openURL(website)}>Website</Text>
          <Feather name="arrow-up-right" size={12} color="black" />
        </View>

        <View style={styles.infoEntryView}>
          <TouchableOpacity
            style={styles.socialIconView}
            onPress={() => Linking.openURL(instagram)}
          >
            <AntDesign name="instagram" size={24} color={PRIMARY_GREEN} />
            <Feather name="arrow-up-right" size={12} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialIconView}
            onPress={() => Linking.openURL(facebook)}
          >
            <Entypo name="facebook" size={24} color={PRIMARY_GREEN} />
            <Feather name="arrow-up-right" size={12} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {},

  icon: {
    marginRight: 4,
  },

  infoEntryView: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  rowView: {
    flexDirection: "row",
    marginVertical: 3,
    justifyContent: "",
  },

  socialIconView: {
    flexDirection: "row",
    marginRight: 10,
  },
});

export default RestaurantInfo;

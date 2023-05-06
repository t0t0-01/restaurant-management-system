import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { BACKGROUND_COLOR, LIGHT_TEXT, PRIMARY_GREEN } from "../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@rneui/themed";
import server from "../api/server";
import AuthContext from "../context/AuthContext";
import { StackActions } from "@react-navigation/native";

const TableSelectionScreen = ({ route, navigation }) => {
  const { id, date, time } = route.params;
  const { userToken } = useContext(AuthContext);

  const [DATA, setDATA] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await server.get("/restaurant/get_available_tables", {
          params: { restaurant_id: id, date_time: `${date} ${time}` },
        });
        setDATA(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTables();
  }, []);

  const submitBooking = async () => {
    try {
      const response = await server.post("/user/reserve_table", {
        customer_id: userToken.id,
        time: `${date} ${time}`,
        table_id: selected,
      });

      navigation.dispatch(StackActions.pop(1));
    } catch (error) {
      console.log(error);
    }
  };

  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);

  const square_selected = require(`../../assets/square_selected.png`);
  const round_selected = require(`../../assets/round_selected.png`);
  const zero_round = require(`../../assets/0_round.png`);
  const one_round = require(`../../assets/1_round.png`);
  const one_table = require(`../../assets/1_table.png`);
  const zero_table = require(`../../assets/0_table.png`);

  if (!DATA) return null;

  const tables = DATA.tables;
  const dimensions = DATA.dimensions;
  const screenWidth = Dimensions.get("window").width * 0.95;
  const screenHeight = Dimensions.get("window").height * 0.95;
  const scalingFactor = Math.min(
    screenWidth / dimensions.width,
    screenHeight / dimensions.height
  );

  const scaledTables = tables.map((table) => {
    return {
      x: table.location.xmin * scalingFactor,
      y: table.location.ymin * scalingFactor,
      width: (table.location.xmax - table.location.xmin) * scalingFactor,
      height: (table.location.ymax - table.location.ymin) * scalingFactor,
      type: table.location.name,
      status: table.available,
      table_id: table.table_id,
    };
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
      <Text style={styles.title}>Choose a Table</Text>
      <View style={styles.legend}>
        <View
          style={{
            borderRadius: 50,
            height: 15,
            width: 15,
            backgroundColor: LIGHT_TEXT,
            marginHorizontal: 5,
          }}
        />
        <Text>Unavailable</Text>
        <View
          style={{
            borderRadius: 50,
            height: 15,
            width: 15,
            backgroundColor: "black",
            marginHorizontal: 5,
          }}
        />
        <Text>Available</Text>

        <View
          style={{
            borderRadius: 50,
            height: 15,
            width: 15,
            backgroundColor: PRIMARY_GREEN,
            marginHorizontal: 5,
          }}
        />
        <Text>Selected</Text>
      </View>

      <View style={styles.tablesView}>
        {scaledTables.map((table) => {
          if (table.table_id == selected) {
            return table.type == "table" ? (
              <TouchableOpacity>
                <Image
                  source={square_selected}
                  style={{
                    ...styles.roundTableIcon,
                    left: table.x,
                    top: table.y,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Image
                  source={round_selected}
                  style={{
                    ...styles.roundTableIcon,
                    left: table.x,
                    top: table.y,
                  }}
                />
              </TouchableOpacity>
            );
          } else {
            switch (table.status + table.type) {
              case "0round":
                return (
                  <TouchableOpacity disabled>
                    <Image
                      source={zero_round}
                      style={{
                        ...styles.roundTableIcon,
                        left: table.x,
                        top: table.y,
                      }}
                    />
                  </TouchableOpacity>
                );

              case "1round":
                return (
                  <TouchableOpacity onPress={() => setSelected(table.table_id)}>
                    <Image
                      source={one_round}
                      style={{
                        ...styles.roundTableIcon,
                        left: table.x,
                        top: table.y,
                      }}
                    />
                  </TouchableOpacity>
                );

              case "0table":
                return (
                  <TouchableOpacity disabled>
                    <Image
                      source={zero_table}
                      style={{
                        ...styles.roundTableIcon,
                        left: table.x,
                        top: table.y,
                      }}
                    />
                  </TouchableOpacity>
                );

              case "1table":
                return (
                  <TouchableOpacity onPress={() => setSelected(table.table_id)}>
                    <Image
                      source={one_table}
                      style={{
                        ...styles.roundTableIcon,
                        left: table.x,
                        top: table.y,
                      }}
                    />
                  </TouchableOpacity>
                );
              default:
                return (
                  <TouchableOpacity>
                    <Image
                      source={one_round}
                      style={{
                        ...styles.roundTableIcon,
                        left: table.x,
                        top: table.y,
                      }}
                    />
                  </TouchableOpacity>
                );
            }
          }
        })}
      </View>
      <Button
        title="Book"
        buttonStyle={styles.button}
        onPress={submitBooking}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },

  roundTableIcon: {
    position: "absolute",
    width: 50,
    height: 50,
  },

  title: {
    fontWeight: "bold",
    color: PRIMARY_GREEN,
    fontSize: 25,
    marginVertical: 20,
    alignSelf: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 15,
    alignItems: "center",
    marginBottom: 5,
  },

  tablesView: {
    width: "98%",
    borderWidth: 3,
    height: "80%",
    alignSelf: "center",
    borderRadius: 10,
    borderColor: LIGHT_TEXT,
    backgroundColor: BACKGROUND_COLOR,
  },
  button: {
    borderRadius: 10,
    backgroundColor: PRIMARY_GREEN,
    marginHorizontal: 15,
    marginTop: 20,
    height: 45,
  },
});

export default TableSelectionScreen;

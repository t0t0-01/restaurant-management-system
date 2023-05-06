import React, { useState, useContext, useEffect } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OrderDishCard from "../components/OrderDishCard";
import { Button } from "@rneui/themed";
import { PRIMARY_GREEN } from "../constants";
import { Input, Overlay } from "@rneui/themed";
import OrderSummary from "../components/OrderSummary";
import AuthContext from "../context/AuthContext";
import server from "../api/server";

function replaceElement(list, index, newElement) {
  if (index < 0 || index >= list.length) {
    throw new Error("Index out of range");
  }

  const newList = [...list];
  newList[index] = newElement;
  return newList;
}

const OrderScreen = () => {
  const insets = useSafeAreaInsets();
  const [table, setTable] = useState();
  const [isVisible, setIsVisible] = useState(false);

  const { userToken } = useContext(AuthContext);
  const [DISHES, setDISHES] = useState(null);
  const [states, setStates] = useState(null);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await server.get("/restaurant/get_by_id", {
          params: { restaurant_id: userToken.restaurant_id },
        });

        setStates(
          response.data.dishes.map((val, index) => ({
            name: val.name,
            price: val.price,
            count: 0,
            dish_id: val.dish_id,
          }))
        );

        setDISHES(response.data.dishes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDishes();
  }, []);

  const submitOrder = async () => {
    try {
      setErr(null);

      const response = await server.post("/staff/send_order", {
        restaurant_id: userToken.restaurant_id,
        table_id: table,
        dishes: states,
      });

      if (response.data.success == false) setErr(response.data.data);
      else if (response.data.success == true) setSuccess(true);

      setIsVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (!DISHES || !states) return null;

  return (
    <View
      style={{
        ...styles.mainView,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Input
        label="Table ID"
        placeholder="0"
        value={table}
        onChangeText={(value) => setTable(value)}
        containerStyle={{ paddingHorizontal: 20, marginTop: 10 }}
        errorMessage={err}
        errorStyle={styles.errText}
      />
      <FlatList
        data={DISHES}
        renderItem={({ item, index }) => (
          <OrderDishCard
            item={item}
            count={states[index].count}
            onPressPlus={() => {
              const new_state = {
                ...states[index],
                count: states[index].count + 1,
              };
              setStates(replaceElement(states, index, new_state));
            }}
            onPressMinus={() => {
              const new_state = {
                ...states[index],
                count: states[index].count - 1,
              };
              setStates(replaceElement(states, index, new_state));
            }}
          />
        )}
      />
      {success ? (
        <Text style={styles.successText}>Order Successful</Text>
      ) : null}

      <Button
        title="Proceed to Checkout"
        buttonStyle={styles.button}
        onPress={() => {
          setIsVisible(!isVisible);
        }}
      />

      <Overlay
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(!isVisible)}
        overlayStyle={{
          borderRadius: 15,
          width: "98%",
          backgroundColor: "white",
          height: "50%",
          padding: 20,
        }}
      >
        <OrderSummary items={states} />
        <Button
          buttonStyle={styles.button}
          title="Confirm"
          onPress={submitOrder}
        />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },

  button: {
    borderRadius: 10,
    backgroundColor: PRIMARY_GREEN,
    margin: 15,
    height: 45,
  },

  errText: {
    color: "red",
  },

  successText: {
    color: PRIMARY_GREEN,
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 20,
  },
});

export default OrderScreen;

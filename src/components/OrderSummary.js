import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { PRIMARY_GREEN } from "../constants";

const OrderSummary = ({ items }) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.price * item.count;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Summary</Text>
      <View style={styles.itemList}>
        <FlatList
          data={items}
          renderItem={({ item, index }) => (
            <View key={index} style={styles.item}>
              <Text>{item.name}</Text>
              <Text>
                {item.count}
                {"\t"}${item.price.toFixed(2) * item.count}
              </Text>
            </View>
          )}
        />
      </View>
      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "space-between",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemList: {
    marginBottom: 16,
    height: "60%",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
  },
  totalLabel: {
    fontWeight: "bold",
    color: PRIMARY_GREEN,
  },
  totalAmount: {
    fontWeight: "bold",
    color: PRIMARY_GREEN,
  },
});

export default OrderSummary;

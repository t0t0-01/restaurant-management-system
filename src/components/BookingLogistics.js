import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { PRIMARY_GREEN } from "../constants";
import { Button } from "@rneui/themed";

const fixDate = (current_week, needed_day) => {
  const date = new Date(current_week);
  date.setDate(needed_day);
  return date.toISOString().slice(0, 10);
};

const fixTime = (time) => {
  const [hours, minutes, meridiem] = time.split(/[\s:]+/);

  let convertedHours = parseInt(hours);
  if (meridiem === "PM" && convertedHours < 12) {
    convertedHours += 12;
  } else if (meridiem === "AM" && convertedHours === 12) {
    convertedHours = 0;
  }

  const convertedTime = `${convertedHours
    .toString()
    .padStart(2, "0")}:${minutes}:00`;

  return convertedTime;
};

const BookingLogistics = ({ dates_and_times, onNext, current_week }) => {
  const [selectedDate, setSelectedDate] = useState(
    Object.keys(dates_and_times.time.available_times)[0]
  );

  const [selectedTime, setSelectedTime] = useState(null);

  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

  if (!dates_and_times) return null;

  return (
    <View style={styles.mainView}>
      <View style={styles.sectionView}>
        <Text style={styles.title}>Date</Text>
        <View style={styles.dateView}>
          {Object.keys(dates_and_times.current_week).map((item, index) => (
            <TouchableOpacity
              disabled={dates_and_times.current_week[item] == 0}
              style={
                item == selectedDate ? styles.dateBoxSelected : styles.dateBox
              }
              onPress={() => {
                setSelectedDate(item);
                setSelectedTime(null);
              }}
            >
              <Text
                style={
                  dates_and_times.current_week[item] == 1
                    ? item == selectedDate
                      ? styles.weekdayTextSelected
                      : styles.weekdayText
                    : styles.weekdayTextGreyed
                }
              >
                {weekdays[index]}
              </Text>

              <Text
                style={
                  dates_and_times.current_week[item] == 1
                    ? item == selectedDate
                      ? styles.dateTextSelected
                      : styles.dateText
                    : styles.dateTextGreyed
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.sectionView}>
        <Text style={styles.title}>Time</Text>
        <View style={styles.timeView}>
          {dates_and_times.time.available_times[selectedDate].map(
            (item, index) => (
              <TouchableOpacity
                style={
                  item == selectedTime ? styles.timeBoxSelected : styles.timeBox
                }
                onPress={() => {
                  setSelectedTime(item);
                }}
                disabled={item.available == 0}
              >
                <Text
                  style={
                    item.available == 1
                      ? item == selectedTime
                        ? styles.timeTextSelected
                        : styles.timeText
                      : styles.timeTextGreyed
                  }
                >
                  {item.time}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <Button
        title="Next"
        buttonStyle={styles.button}
        onPress={() =>
          onNext(
            fixDate(current_week, selectedDate),
            fixTime(selectedTime.time)
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "white",
    justifyContent: "flex-start",
  },

  title: {
    fontWeight: "bold",
    fontSize: 30,
    marginHorizontal: 20,
  },

  sectionView: {
    marginVertical: 10,
  },

  dateView: {
    flexDirection: "row",
    justifyContent: "center",
  },

  dateBox: {
    padding: 17,
    borderRadius: 10,
    alignItems: "center",
  },

  dateBoxSelected: {
    padding: 17,
    borderRadius: 10,
    alignItems: "center",

    backgroundColor: "#f5f5f5",
  },

  weekdayText: {
    color: "#75a591",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 30,
  },

  weekdayTextSelected: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 30,

    color: PRIMARY_GREEN,
  },

  weekdayTextGreyed: {
    fontSize: 15,
    marginBottom: 30,

    color: "#75a591",
  },

  dateText: {
    fontSize: 15,
  },

  dateTextSelected: {
    fontSize: 15,
    color: PRIMARY_GREEN,
    fontWeight: "bold",
  },

  dateTextGreyed: {
    fontSize: 15,
    color: "#75a591",
  },

  timeView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  timeBox: {
    width: 60,
    justifyContent: "center",
    height: 40,
    alignItems: "center",
    margin: 5,
  },

  timeBoxSelected: {
    width: 60,
    justifyContent: "center",
    height: 40,
    alignItems: "center",
    margin: 5,

    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },

  timeText: {
    fontWeight: "bold",
    fontSize: 15,
  },

  timeTextSelected: {
    fontWeight: "bold",
    fontSize: 15,
    color: PRIMARY_GREEN,
  },

  timeTextGreyed: {
    fontSize: 15,
    color: "#75a591",
  },

  button: {
    borderRadius: 10,
    backgroundColor: PRIMARY_GREEN,
    margin: 15,
    height: 45,
  },
});

export default BookingLogistics;

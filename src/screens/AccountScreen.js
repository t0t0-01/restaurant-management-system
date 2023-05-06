import React, { useContext, useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, TextInput } from "react-native";
import { Input, Button, Overlay } from "@rneui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LIGHT_TEXT, PRIMARY_GREEN } from "../constants";
import AuthContext from "../context/AuthContext";
import server from "../api/server";

const AccountScreen = () => {
  const insets = useSafeAreaInsets();
  const { userToken } = useContext(AuthContext);
  const [ACCOUNT, setACCOUNT] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [isShownOverlay, setIsShownOverlay] = useState(false);
  const [new_staff_email, setNewStaffEmail] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const submitStaffEmail = async () => {
    try {
      const response = await server.post(
        "/manager/assign_staff_to_restaurant",
        {
          staff_email: new_staff_email,
          manager_id: userToken.id,
          restaurant_id: userToken.restaurant_id,
        }
      );

      if (response.data.success == false) {
        setErr(response.data.data);
        setSuccess(false);
        setNewStaffEmail("");
      } else if (response.data.success == true) {
        setErr("");
        setSuccess(true);
        setNewStaffEmail("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        console.log(userToken.category);
        const endpoint =
          userToken.category == "customer" ? "user" : userToken.category;

        const key = `${userToken.category}_id`;
        const params = {};
        params[key] = userToken.id;
        const response = await server.get(`/${endpoint}/get_by_id`, {
          params: params,
        });
        setACCOUNT(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRestaurantName = async () => {
      try {
        const response = await server.get("restaurant/get_by_id", {
          params: { restaurant_id: userToken.restaurant_id },
        });
        setRestaurant(response.data.name);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAccount();

    if (userToken.category != "customer") fetchRestaurantName();
  }, []);

  if (!ACCOUNT) return null;

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
      <View
        style={
          userToken.category == "customer" ? styles.header : styles.headerStaff
        }
      >
        <Image
          style={styles.avatar}
          source={{ uri: "data:image/png;base64," + ACCOUNT.picture }}
        />
        <Text style={styles.name}>
          {ACCOUNT.first_name} {ACCOUNT.last_name}
        </Text>
      </View>

      <View style={styles.bodyContent}>
        <Input
          inputContainerStyle={
            userToken.category == "manager" ? styles.infoManager : styles.info
          }
          label="Email"
          value={ACCOUNT.email}
          disabled
          disabledInputStyle={{ color: "black" }}
        />
        <Input
          inputContainerStyle={
            userToken.category == "manager" ? styles.infoManager : styles.info
          }
          label="Phone Number"
          value={ACCOUNT.phone_nb}
          disabled
          disabledInputStyle={{ color: "black" }}
        />
        <Input
          inputContainerStyle={
            userToken.category == "manager" ? styles.infoManager : styles.info
          }
          label="Date of Birth"
          value={ACCOUNT.date_of_birth}
          disabled
          disabledInputStyle={{ color: "black" }}
        />
        {userToken.category != "customer" ? (
          <Input
            inputContainerStyle={
              userToken.category == "manager" ? styles.infoManager : styles.info
            }
            label="Works at"
            value={restaurant}
            disabled
            disabledInputStyle={{ color: "black" }}
          />
        ) : null}

        {userToken.category == "manager" ? (
          <>
            <Button
              buttonStyle={styles.button}
              title="Add Staff"
              onPress={() => setIsShownOverlay(true)}
            />
            {success ? <Text style={styles.successText}>Success</Text> : null}
            {err ? <Text style={styles.errText}>{err}</Text> : null}
          </>
        ) : null}

        <Overlay
          isVisible={isShownOverlay}
          onBackdropPress={() => setIsShownOverlay(false)}
          overlayStyle={{
            height: "32%",
            width: "90%",
            paddingVertical: 10,
            borderRadius: 15,
          }}
        >
          <Text style={styles.newEmailDisclaimer}>
            Add the email of the staff account you would like to assign to the
            restaurant
          </Text>
          <Input
            label="Email"
            value={new_staff_email}
            inputContainerStyle={styles.infoManager}
            placeholder="johndoe@example.com"
            onChangeText={(val) => setNewStaffEmail(val)}
          />
          <Button
            title="Add"
            buttonStyle={styles.button}
            onPress={() => {
              submitStaffEmail();
              setIsShownOverlay(false);
            }}
          />
        </Overlay>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: { flex: 1, backgroundColor: "white" },

  headerStaff: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 0,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: PRIMARY_GREEN,
    marginTop: 30,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    color: PRIMARY_GREEN,
    fontWeight: "600",
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  info: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderColor: LIGHT_TEXT,
    borderRadius: 10,
  },

  infoManager: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderColor: LIGHT_TEXT,
    borderRadius: 10,
  },
  button: {
    borderRadius: 10,
    backgroundColor: PRIMARY_GREEN,
    alignSelf: "center",
    width: "90%",
    height: 50,
  },
  newEmailDisclaimer: {
    marginVertical: 20,
    marginHorizontal: 20,
    color: PRIMARY_GREEN,
    fontSize: 15,
    fontWeight: "bold",
  },

  successText: {
    color: PRIMARY_GREEN,
    fontWeight: "bold",
    fontSize: 15,
    marginVertical: 10,
  },

  errText: {
    color: "red",
    marginVertical: 10,
  },
});

export default AccountScreen;

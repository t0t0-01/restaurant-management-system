import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input, Button, CheckBox, Icon } from "@rneui/themed";
import PasswordInput from "../components/PasswordInput";
import { Feather, AntDesign } from "@expo/vector-icons";
import {
  BACKGROUND_COLOR,
  PRIMARY_GREEN,
  INFO_ICON_COLOR,
  INPUT_TEXT_COLOR,
  LABEL_COLOR,
  LIGHT_TEXT,
} from "../constants";
import PhoneIn from "../components/PhoneIn";
import BDayPicker from "../components/BDayPicker";
import useCustomFont from "../hooks/useCustomFont";

const SignUpScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const isFontLoaded = useCustomFont();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [phone, setPhone] = useState("");

  const [month, setMonth] = useState("January");
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(2000);
  const [selectedIndex, setIndex] = React.useState(0);

  const months = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  if (!isFontLoaded) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          ...styles.mainView,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <Text style={styles.titleStyle}>Let's Get Started!</Text>

        <View style={styles.formView}>
          <View style={styles.typeAcctView}>
            <Text style={styles.labelStyle}>
              Are you a Staff or a Customer?
            </Text>
            <View style={styles.parentRadioStyleView}>
              <View style={styles.radioStyleView}>
                <Text style={styles.typeTextStyle}>Customer</Text>
                <CheckBox
                  checked={selectedIndex === 0}
                  onPress={() => setIndex(0)}
                  checkedIcon={
                    <Icon
                      name="radio-button-checked"
                      type="material"
                      size={25}
                      color={INFO_ICON_COLOR}
                    />
                  }
                  uncheckedIcon={
                    <Icon
                      name="radio-button-unchecked"
                      type="material"
                      size={25}
                      iconStyle={styles.iconStyle}
                      color={INFO_ICON_COLOR}
                    />
                  }
                  containerStyle={{
                    backgroundColor: BACKGROUND_COLOR,
                  }}
                />
              </View>

              <View style={styles.radioStyleView}>
                <Text style={styles.typeTextStyle}>Staff</Text>

                <CheckBox
                  checked={selectedIndex === 1}
                  onPress={() => setIndex(1)}
                  checkedIcon={
                    <Icon
                      name="radio-button-checked"
                      type="material"
                      size={25}
                      iconStyle={styles.iconStyle}
                    />
                  }
                  uncheckedIcon={
                    <Icon
                      name="radio-button-unchecked"
                      type="material"
                      size={25}
                      iconStyle={styles.iconStyle}
                    />
                  }
                  containerStyle={{
                    backgroundColor: BACKGROUND_COLOR,
                  }}
                />
              </View>
            </View>
          </View>

          <Input
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="john@email.com"
            leftIcon={
              <Feather name="mail" size={24} style={styles.iconStyle} />
            }
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
          />
          <PasswordInput value={pass} onChangeText={setPass} label="Password" />
          <PasswordInput
            value={confirmPass}
            onChangeText={setConfirmPass}
            label="Confirm Password"
          />
          {(pass != confirmPass) & (pass !== "") & (confirmPass !== "") ? (
            <Text style={styles.errorText}>Passwords do not match!</Text>
          ) : null}

          <PhoneIn phoneNumber={phone} setPhoneNumber={setPhone} />

          <View style={styles.dateContainer}>
            <BDayPicker
              month={month}
              year={year}
              day={day}
              setMonth={setMonth}
              setYear={setYear}
              setDay={setDay}
            />
          </View>
        </View>

        <Button
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.loginButton}
          title="Next"
          titleStyle={{ fontWeight: "bold" }}
          onPress={() =>
            navigation.navigate("Photo", {
              type: selectedIndex == 0 ? "customer" : "staff",
              email: email,
              password: pass,
              phone_nb: phone,
              dob: `${year}-${months[month]}-${day}`,
            })
          }
          disabled={pass != confirmPass || pass.length == 0}
          disabledStyle={{ backgroundColor: "#d1d1d1" }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "stretch",
    justifyContent: "space-evenly",
  },

  formView: {
    marginHorizontal: "3%",
  },

  typeAcctView: { alignItems: "center" },

  parentRadioStyleView: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: "5%",
    marginTop: "-2%",
  },
  radioStyleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  titleStyle: {
    color: PRIMARY_GREEN,
    fontWeight: "bold",
    fontSize: 35,
    fontFamily: "Satisfy",
    alignSelf: "center",
    marginTop: "5%",
  },

  loginButton: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 30,
    height: 55,
    borderColor: PRIMARY_GREEN,
  },
  buttonContainer: {
    marginHorizontal: "10%",
    marginTop: "-5%",
  },

  dateContainer: {
    margin: 10,
  },

  iconStyle: {
    marginRight: 3,
    color: INFO_ICON_COLOR,
  },

  labelStyle: {
    color: LABEL_COLOR,
    fontWeight: "bold",
    fontSize: 16,
  },

  inputStyle: {
    color: INPUT_TEXT_COLOR,
  },
  errorText: {
    color: "red",
    marginHorizontal: 10,
    marginTop: -20,
    marginBottom: 20,
  },
});

export default SignUpScreen;

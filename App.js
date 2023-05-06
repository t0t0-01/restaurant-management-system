import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignupScreen";
import PhotoScreen from "./src/screens/PhotoScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AuthContext from "./src/context/AuthContext";

import SearchScreen from "./src/screens/SearchScreen";
import { PRIMARY_GREEN } from "./src/constants";
import AccountScreen from "./src/screens/AccountScreen";
import RestaurantScreen from "./src/screens/RestaurantScreen";
import ViewBookingsScreen from "./src/screens/ViewBookingsScreen";
import ReviewsScreen from "./src/screens/ReviewsScreen";
import OrderScreen from "./src/screens/OrderScreen";
import TableSelectionScreen from "./src/screens/TableSelectionScreen";
import StaffReviewsScreen from "./src/screens/StaffReviewsScreen";
import NoRestaurantScreen from "./src/screens/NoRestaurantScreen";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function App() {
  const HomeStack = createNativeStackNavigator();
  const SearchStack = createNativeStackNavigator();
  const LoginStack = createNativeStackNavigator();
  const RestaurantStack = createNativeStackNavigator();
  const StaffUnavailable = createNativeStackNavigator();

  const UserTab = createBottomTabNavigator();
  const StaffTab = createBottomTabNavigator();
  const [userToken, setUserToken] = useState(null);

  const RestaurantNavigator = () => {
    return (
      <RestaurantStack.Navigator screenOptions={{ headerShown: false }}>
        <RestaurantStack.Screen name="Restaurant">
          {(props) => <RestaurantScreen {...props} />}
        </RestaurantStack.Screen>
        <RestaurantStack.Screen name="Reviews" component={ReviewsScreen} />
        <RestaurantStack.Screen
          name="StaffReviews"
          component={StaffReviewsScreen}
        />
        <RestaurantStack.Screen
          name="TableBooking"
          component={TableSelectionScreen}
        />
      </RestaurantStack.Navigator>
    );
  };

  const HomeNavigator = () => {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
        <HomeStack.Screen
          name="RestaurantNavigator"
          component={RestaurantNavigator}
        />
      </HomeStack.Navigator>
    );
  };

  const SearchNavigator = () => {
    return (
      <SearchStack.Navigator screenOptions={{ headerShown: false }}>
        <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
        <SearchStack.Screen
          name="RestaurantNavigator"
          component={RestaurantNavigator}
        />
      </SearchStack.Navigator>
    );
  };

  return (
    <AuthContext.Provider value={{ userToken, setUserToken }}>
      <NavigationContainer>
        {!userToken ? (
          <LoginStack.Navigator
            initialRouteName={"Login"}
            screenOptions={{ headerShown: false }}
          >
            <LoginStack.Screen name="Login" component={LoginScreen} />
            <LoginStack.Screen name="SignUp" component={SignUpScreen} />
            <LoginStack.Screen name="Photo" component={PhotoScreen} />
          </LoginStack.Navigator>
        ) : userToken.category == "customer" ? (
          <UserTab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "Home") {
                  iconName = focused ? "ios-home" : "ios-home-outline";
                } else if (route.name === "Search") {
                  iconName = focused ? "ios-search" : "ios-search-outline";
                } else if (route.name == "Account") {
                  iconName = focused ? "user" : "user-o";
                  size = focused ? 24 : 20;
                  return (
                    <FontAwesome name={iconName} size={size} color={color} />
                  );
                } else if (route.name == "Bookings") {
                  iconName = focused ? "notebook" : "notebook-outline";
                  return (
                    <MaterialCommunityIcons
                      name={iconName}
                      size={size}
                      color={color}
                    />
                  );
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: PRIMARY_GREEN,
              tabBarInactiveTintColor: "gray",
              headerShown: false,
            })}
          >
            <UserTab.Screen name="Home" component={HomeNavigator} />
            <UserTab.Screen name="Search" component={SearchNavigator} />
            <UserTab.Screen name="Bookings" component={ViewBookingsScreen} />
            <UserTab.Screen name="Account" component={AccountScreen} />
          </UserTab.Navigator>
        ) : userToken.restaurant_id != -1 ? (
          <StaffTab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "Home") {
                  iconName = focused ? "ios-home" : "ios-home-outline";
                } else if (route.name === "Order") {
                  iconName = focused ? "pencil-plus" : "pencil-plus-outline";
                  return (
                    <MaterialCommunityIcons
                      name={iconName}
                      size={size}
                      color={color}
                    />
                  );
                } else if (route.name == "Account") {
                  iconName = focused ? "user" : "user-o";
                  size = focused ? 24 : 20;
                  return (
                    <FontAwesome name={iconName} size={size} color={color} />
                  );
                } else if (route.name == "Bookings") {
                  iconName = focused ? "notebook" : "notebook-outline";
                  return (
                    <MaterialCommunityIcons
                      name={iconName}
                      size={size}
                      color={color}
                    />
                  );
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: PRIMARY_GREEN,
              tabBarInactiveTintColor: "gray",
              headerShown: false,
            })}
          >
            <StaffTab.Screen
              name="Home"
              component={RestaurantNavigator}
              initialParams={{
                screen: "Restaurant",
                params: { id: userToken.restaurant_id },
              }}
            />
            <StaffTab.Screen name="Order" component={OrderScreen} />
            <StaffTab.Screen name="Bookings" component={ViewBookingsScreen} />
            <StaffTab.Screen name="Account" component={AccountScreen} />
          </StaffTab.Navigator>
        ) : (
          <StaffUnavailable.Navigator screenOptions={{ headerShown: false }}>
            <StaffUnavailable.Screen
              name="NoRestaurant"
              component={NoRestaurantScreen}
            />
          </StaffUnavailable.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

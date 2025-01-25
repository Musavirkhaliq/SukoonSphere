import React, { createContext, useContext, useReducer, useEffect } from "react";

import customFetch from "@/utils/customFetch";

const UserContext = createContext();

const initialState = {
  user: null,

  isLoading: false,

  error: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,

        user: action.payload,

        isLoading: false,
      };

    case "REMOVE_USER":
      return {
        ...state,

        user: null,

        isLoading: false,
      };

    case "SET_ERROR":
      return {
        ...state,

        error: action.payload,

        isLoading: false,
      };

    case "SET_LOADING":
      return {
        ...state,

        isLoading: action.payload,
      };

    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // User actions

  const login = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const { data } = await customFetch.post("/auth/login", userData);

      // Store user data in localStorage

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));

        localStorage.setItem("isAuthenticated", "true");
      }

      dispatch({ type: "SET_USER", payload: data.user });

      return { success: true };
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.msg || "Login failed",
      });

      return { error: error.response?.data?.msg || "Login failed" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async () => {
    try {
      await customFetch.delete("/auth/logout");

      // Clear user data from localStorage

      localStorage.removeItem("user");

      localStorage.removeItem("isAuthenticated");

      dispatch({ type: "REMOVE_USER" });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  // Initialize user from localStorage

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (storedUser && isAuthenticated === "true") {
      dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) });
    }
  }, []);

  const updateUser = async (updates) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const { data } = await customFetch.patch(
        "/user/change-profile",
        updates,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update localStorage with new user data

      if (data.user) {
        const updatedUser = { ...state.user, ...data.user };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        dispatch({ type: "SET_USER", payload: updatedUser });
      }

      return { success: true };
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.msg || "Update failed",
      });

      return { error: error.response?.data?.msg || "Update failed" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <UserContext.Provider
      value={{
        ...state,

        login,

        logout,

        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the user context

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

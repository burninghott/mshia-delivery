"use client";
import React, { useState } from "react";
import Header from "./_components/Header";
import { Toaster } from "@/components/ui/sonner";
import { CartUpdateContext } from "./_context/CartUpdateContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const Provider = ({ children }) => {
  const [updateCart, setUpdateCart] = useState();
  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
    >
      <CartUpdateContext.Provider value={{ updateCart, setUpdateCart }}>
        <div className="px-10 md:px20 relative mb-20">
          <Header />
          {children}
          <Toaster />
        </div>
      </CartUpdateContext.Provider>
    </PayPalScriptProvider>
  );
};

export default Provider;

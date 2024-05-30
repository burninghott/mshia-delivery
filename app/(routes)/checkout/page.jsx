"use client";
import { CartUpdateContext } from "@/app/_context/CartUpdateContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { ArrowBigRight, Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const Checkout = () => {
  const params = useSearchParams();
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const { updateCart, setUpdateCart } = useContext(CartUpdateContext);
  const [deliveryAmount, setDeliveryAmount] = useState(5);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [zip, setZip] = useState();
  const [address, setAddress] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(params.get("restaurant"));
    user && GetUserCart();
  }, [user || updateCart]);

  const GetUserCart = () => {
    GlobalApi.GetUserCart(user?.primaryEmailAddress.emailAddress).then(
      (resp) => {
        console.log(resp);
        setCart(resp?.userCarts);
        calculateTotalAmount(resp?.userCarts);
      }
    );
  };

  const calculateTotalAmount = (cart_) => {
    let total = 0;
    cart_.forEach((item) => (total = total + item.price));
    setSubTotal(total);
    const tax = total * 0.07;
    setTaxAmount(tax);
    setTotal(total + total * 0.07 + deliveryAmount);
  };
  const addToOrder = () => {
    setLoading(true);
    const data = {
      email: user.primaryEmailAddress.emailAddress,
      orderAmount: total,
      restaurantName: params.get("restaurant"),
      userName: user.fullName,
      phone: phone,
      address: address,
      zipCode: zip,
    };
    GlobalApi.CreateNewOrder(data).then(
      (resp) => {
        const resultId = resp.createOrder.id;
        if (resultId) {
          cart.forEach(
            (item) => {
              GlobalApi.UpdateOrderToAddOrderItems(
                item.productName,
                item.price,
                resultId,
                user.primaryEmailAddress.emailAddress
              ).then((result) => console.log(result));
              setLoading(false);
              toast("Added successfully!");
              setUpdateCart(!updateCart);
            },
            (error) => {
              setLoading(false);
            }
          );
        }
      },
      (error) => {
        setLoading(false);
      }
    );
  };
  return (
    <div className="mt-5 flex flex-col items-center justify-between md:flex-row">
      <div></div>
      <div>
        <div class="font-[sans-serif] bg-white p-4">
          <div class="max-w-4xl mx-auto">
            <div class="text-center">
              <h2 class="text-3xl font-extrabold text-[#333] inline-block border-b-4 border-[#333] pb-1">
                Checkout
              </h2>
            </div>
            <div class="mt-12">
              <div class="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 class="text-lg font-bold text-[#333]">
                    Personal Details
                  </h3>
                </div>
                <div class="md:col-span-2">
                  <form>
                    <div class="grid sm:grid-cols-2 gap-5">
                      <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Name"
                        class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      />
                      {/* <input
                        type="text"
                        placeholder="Last name"
                        class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      /> */}
                      <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      />
                      <input
                        type="number"
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number"
                        class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div class="grid md:grid-cols-3 gap-6 mt-12">
                <div>
                  <h3 class="text-lg font-bold text-[#333]">
                    Shopping Address
                  </h3>
                </div>
                <div class="md:col-span-2">
                  <form>
                    <div class="grid sm:grid-cols-2 gap-5">
                      <input
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        placeholder="Street address"
                        class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      />

                      <input
                        onChange={(e) => setZip(e.target.value)}
                        type="number"
                        placeholder="Zip Code"
                        class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 border w-60 sm:w-72">
        <h2 className="p-3 bg-gray-200 font-bold text-center">
          Total Items: ({cart?.length})
        </h2>
        <div className="p-4 flex flex-col gap-4">
          <h2 className="font-bold flex justify-between">
            Subtotal:{" "}
            <span className="flex justify-between">{subTotal.toFixed(2)}₾</span>
          </h2>
          <hr></hr>
          <h2 className="flex justify-between">
            Delivery : <span>{deliveryAmount.toFixed(2)}₾</span>
          </h2>
          <h2 className="flex justify-between">
            Tax (7%) : <span>{taxAmount.toFixed(2)}₾</span>
          </h2>
          <hr></hr>
          <h2 className="flex justify-between">
            Total : <span>{total.toFixed(2)}₾</span>
          </h2>
          {/* <Button onClick={() => AddToOrder()}>
            {loading ? <Loader className="animate-spin" /> : "Pay"}
          </Button> */}
          {total > 5 && (
            <PayPalButtons
              disabled={!(username && email && address && zip) || loading}
              style={{ layout: "horizontal" }}
              onApprove={addToOrder}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: total.toFixed(2),
                        currency_code: "USD",
                      },
                    },
                  ],
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;

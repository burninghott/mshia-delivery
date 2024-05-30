"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import GlobalApi from "../_utils/GlobalApi";
import BusinessItem from "./BusinessItem";
import BusinessItemSkelton from "./BusinessItemSkelton";

const BusinessList = () => {
  const params = useSearchParams();
  const [category, setCategory] = useState("all");
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const totalResults = businessList?.length;
  useEffect(() => {
    params && defaultList(params.get("category"));
    params && setCategory(params.get("category"));
  }, [params]);

  useEffect(() => {
    params && setCategory(params.get("category"));
    params && getBusinessList(params.get("category"));
  }, [params]);
  const getBusinessList = (category_) => {
    setLoading(true);
    GlobalApi.GetBusiness(category_).then((resp) => {
      setBusinessList(resp?.restaurants);
      setLoading(false);
    });
  };

  const defaultList = () => {
    setLoading(true);
    GlobalApi.DefList().then((resp) => {
      setBusinessList(resp?.restaurants);
    });
    setLoading(false);
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-2xl">
        Popular <span className="capitalize">{category}</span> Restaurants
      </h2>
      <h2 className="font-bold text-primary">
        {totalResults ? totalResults : "Choose any category for"} Results
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-3">
        {!loading
          ? businessList.map((restaurants, index) => (
              <BusinessItem key={index} business={restaurants} />
            ))
          : [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
              <BusinessItemSkelton key={index} />
            ))}
      </div>
    </div>
  );
};

export default BusinessList;

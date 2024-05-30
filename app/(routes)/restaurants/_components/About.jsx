import GlobalApi from "@/app/_utils/GlobalApi";
import React, { useEffect, useState } from "react";

const About = ({ restaurant }) => {
  const [info, setInfo] = useState();
  useEffect(() => {
    getInfo();
  });
  const getInfo = () => {
    GlobalApi.GetBusinessInfo(restaurant.slug).then((resp) => {
      setInfo(resp?.restaurant?.aboutUs);
    });
  };
  return (
    <div>
      <p className="mt-5 px-5">{info}</p>
    </div>
  );
};

export default About;

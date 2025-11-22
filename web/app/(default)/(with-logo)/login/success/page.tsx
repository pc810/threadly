"use client";

import { axios } from "@/lib/axios";
import { useEffect, useState } from "react";

function Page() {
  const [user, setUser] = useState({});
  useEffect(() => {
    // fetch("http://localhost:8080/auth/me", {
    //   credentials: "include",
    // })
    //   .then((res) => res.json())
    //   .then((user) => {
    //     setUser(user);
    //   });
    axios
      .get("http://localhost:8080/auth/me", { withCredentials: true })
      .then(({ data }) => {
        setUser(data);
      });
  }, []);

  return (
    <div>
      Successfully signup <>{JSON.stringify(user)}</>
    </div>
  );
}

export default Page;

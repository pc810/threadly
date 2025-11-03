"use client";

import { useEffect, useState } from "react";

function Page() {
  const [user, setUser] = useState({});
  useEffect(() => {
    fetch("http://localhost:8080/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((user) => {
        setUser(user);
      });
  }, []);

  return (
    <div>
      Successfully signup <>{JSON.stringify(user)}</>
    </div>
  );
}

export default Page;

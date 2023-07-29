import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [route, setRoute] = useState("");
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user | (user === "undefined")) return setRoute("/login");
    return setRoute(`/${user}`);
  }, []);
  if (route) router.push(route);
  return <></>;
}

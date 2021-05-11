import { useCallback, useEffect, useState } from "react";

function Api({ method, url, query, body = null }) {
  const [status, setStatus] = useState(null);
  const [data, setData] = useState([]);

  const handleFetch = useCallback(async () => {
    if (!query) return;
    setStatus("fetching");
    if (method === "GET") {
      let response = await fetch(`https://blackisp.herokuapp.com/${url}`);
      let data = await response.json();
      setData(data);
    }
    if (method === "POST") {
      await fetch(`https://blackisp.herokuapp.com/${url}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((r) => {
          setStatus("success");
          setData(JSON.stringify(r));
        })
        .catch((e) => {
          setStatus("reject");
        });
    }
  }, [query, method, url, body]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return { status, data };
}

export default Api;

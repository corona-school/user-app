import { useEffect, useRef, useState } from "react"

export const WebsocketClient = () => {
  const [val, setVal] = useState(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://ws.kraken.com");

    socket.onopen = () => {
      console.log("opened");
      socket.send("{\"event\":\"subscribe\", \"subscription\":{\"name\":\"ticker\"}, \"pair\":[\"BTC/USD\"]}")
    };

    socket.onclose = () => {
      console.log("closed");
    };

    socket.onmessage = (event) => {
      console.log("got message", event.data);
      setVal(event.data);
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  return <div>Value: {val}</div>;
};
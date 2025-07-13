import React, { useState, useEffect } from "react";

export default function PicItem({ url, type }) {
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoaded(false);
  }, [url]);

  useEffect(() => {
    let timer;
    if (loaded) {
      timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [loaded]);

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <div className="pic-item" key={url}>
      {loading && <div className="media-loading loading"></div>}
      {type === "img" ? (
        <img src={url} loading="lazy" onLoad={handleLoad} />
      ) : (
        <video src={url} onLoadedData={handleLoad} />
      )}
    </div>
  );
}

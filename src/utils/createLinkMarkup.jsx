import React from "react";
import { Anchor } from "react95";

export const createLinkMarkup = (text) => {
  const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  const parts = text.split(urlPattern);
  return parts.map((part, index) => {
    if (urlPattern.test(part)) {
      const url = part.toLowerCase().startsWith("www.") ? `http://${part}` : part;
      return (
        <Anchor key={index} href={url} target="_blank" rel="noopener noreferrer">
          {part}
        </Anchor>
      );
    } else {
      return part;
    }
  });
};

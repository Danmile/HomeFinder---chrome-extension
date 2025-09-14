import axios from "axios";
import { storedAds } from "./store/store.js";

// Function to fetch from Yad2
export async function fetchAds(addressId, addressText, price, key) {
  const url = `https://gw.yad2.co.il/realestate-feed/rent/map?city=0070&area=21&topArea=41&neighborhood=${addressId}&maxPrice=${price}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FetchAds - HTTP ${res.status}: ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    const apartments = data.data?.markers || [];
    const filtered = apartments.filter(
      (apr) => apr.price && apr.address?.neighborhood?.text
    );
    //Check if the key is already in store
    if (!storedAds.has(key)) {
      console.log("filtered first: ", filtered.length);
      storedAds.set(key, filtered);
      return [];
    }

    const existing = storedAds.get(key);
    // Find only new ones
    const newOnes = filtered.filter(
      (apr) => !existing.some((s) => s.orderId === apr.orderId)
    );

    if (newOnes.length > 0) {
      storedAds.set(key, [...existing, ...newOnes]);
    }
    console.log("filtered: ", filtered.length);
    console.log("existing: ", existing.length);
    return newOnes;
  } catch (err) {
    console.error("FetchAds - Error fetching:", err);
    return [];
  }
}

export function deleteAds(key) {
  try {
    const result = storedAds.delete(key);
    return result;
  } catch (error) {
    console.error("Error deleting:", error);
  }
}

export function getAds() {
  try {
    if (storedAds.size > 0) {
      const searches = Array.from(storedAds.keys()).map((key) => {
        const [address, price] = key.split("|");
        return { address, price };
      });
      return searches;
    }
  } catch (error) {
    console.error("getAds - Error fetching:", error);
  }
}

export function generateMessage(newAds) {
  const adMessages = newAds
    .map((ad) => {
      return `${ad.address.city.text || "רחוב לא מצויין"} - ${
        ad.address.neighborhood.text || ""
      },
      ${ad.address.street.text || ""} - ${ad.price || "לא צוין"} - מחיר
      חדרים ${ad.additionalDetails.roomsCount || "לא צוין"},
      https://www.yad2.co.il/realestate/item/${ad.token}`;
    })
    .join("\n\n");
  return adMessages;
}

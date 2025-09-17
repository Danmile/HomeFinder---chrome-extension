import axios from "axios";
import { Ad } from "./models/ad.model.js";

// Function to fetch from Yad2
export async function fetchAds(addressId, price, key) {
  const url = `https://gw.yad2.co.il/realestate-feed/rent/map?city=0070&area=21&topArea=41&neighborhood=${addressId.toString()}&maxPrice=${price.toString()}`;
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
    const existing = await Ad.find({ key }).lean();

    // Find only new ones
    const newOnes = filtered.filter(
      (apr) => !existing.some((s) => s.orderId === apr.orderId)
    );

    if (newOnes.length > 0) {
      const docs = newOnes.map((ad) => ({ ...ad, key }));
      await Ad.insertMany(docs);
    }
    return newOnes;
  } catch (err) {
    console.error("FetchAds - Error fetching:", err);
    return [];
  }
}

export async function deleteAds(key) {
  try {
    await Ad.deleteMany({ key });
  } catch (error) {
    console.error("Error deleting:", error);
  }
}

export async function getAds() {
  try {
    const keys = await Ad.distinct("key");
    return keys.map((key) => {
      const [address, price] = key.split("|");
      return { address, price };
    });
  } catch (error) {
    console.error("getAds - Error fetching:", error);
  }
}

export function generateMessage(newAds) {
  const adMessages = newAds
    .map((ad) => {
      return `${ad.address?.city?.text || "רחוב לא מצויין"} - ${
        ad.address?.neighborhood?.text || ""
      },
      ${ad.address?.street?.text || ""} - ${ad.price || "לא צוין"} - מחיר
      חדרים ${ad.additionalDetails?.roomsCount || "לא צוין"},
      https://www.yad2.co.il/realestate/item/${ad.token}`;
    })
    .join("\n\n");
  return adMessages;
}

import { fetchAds, getAds, deleteAds } from "../scripts.js";
import { searchList } from "../models/searchList.model.js";

export const submitAd = async (req, res) => {
  const { addressId, addressText, price } = req.body;

  try {
    if (!addressId || !price)
      return res.status(400).json({ error: "Missing address or price" });

    const key = `${addressText}|${price}`;
    console.log("key sub:", key);
    const priceNum = Number(price);
    const exists = await searchList.findOne({
      address: addressText,
    });

    if (exists)
      return res
        .status(400)
        .json({ error: "This address and price already exists" });
    try {
      await searchList.create({ address: addressText, price: priceNum });
    } catch (error) {
      console.error("Error in creating list: ", error);
    }
    await fetchAds(addressId, price, key);

    res.status(200).json({ message: `${price} - ${addressText}` });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const getAdsList = async (req, res) => {
  try {
    const ads = await getAds();
    res.status(200).json(ads);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const removeAd = async (req, res) => {
  const { address, price } = req.body;
  const priceNum = Number(price);
  try {
    const key = `${address}|${price}`;
    const exists = await searchList.findOne({ address, price: priceNum });
    if (!exists)
      return res.status(404).json({ error: "This address no longer exists" });

    await deleteAds(key);
    await searchList.deleteOne({ address, price });
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

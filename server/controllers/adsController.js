import { fetchAds, getAds, deleteAds } from "../scripts.js";
import { searchList } from "../store/store.js";

export const submitAd = async (req, res) => {
  const { addressId, addressText, price } = req.body;
  try {
    if (!addressId || !price)
      return res.status(400).json({ error: "Missing address or price" });

    const key = `${addressText}|${price}`;
    if (searchList.has(key))
      return res
        .status(400)
        .json({ error: "This address and price already exists" });

    searchList.add(key);
    await fetchAds(addressId, addressText, price, key);

    res.status(200).json({ message: `${price} - ${addressText}` });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const getAdsList = (req, res) => {
  try {
    const ads = getAds();
    res.status(200).json(ads);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const removeAd = (req, res) => {
  const { address, price } = req.body;
  try {
    const key = `${address}|${price}`;
    if (!searchList.has(key))
      return res.status(404).json({ error: "This address no longer exists" });

    deleteAds(key);
    searchList.delete(key);
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

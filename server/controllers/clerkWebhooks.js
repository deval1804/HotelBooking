import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    console.log("Webhook received:", req.body);

    const evt = wh.verify(JSON.stringify(req.body), headers);
    const { data, type } = evt;

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        console.log("User Created in DB:", userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        console.log("User Updated in DB:", userData);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("User Deleted from DB:", data.id);
        break;

      default:
        console.log("No matching webhook type");
        break;
    }

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebHooks;

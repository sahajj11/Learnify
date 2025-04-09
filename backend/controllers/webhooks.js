import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebHooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHHOOK_SECRET);

    const evt = whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = evt;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.create(userData);
        res.status(200).json({ success: true });
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        res.status(200).json({ success: true });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.status(200).json({ success: true });
        break;
      }

      default:
        res.status(400).json({ success: false, message: "Unknown event type" });
        break;
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

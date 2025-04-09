import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebHooks = async (req, res) => {
  try {
    console.log("🔔 Webhook triggered!");
    const whook = new Webhook(process.env.CLERK_WEBHHOOK_SECRET);

    const evt = whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = evt;
    console.log("📩 Event type:", type);
    console.log("📦 Event data:", data);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        try {
          await User.create(userData);
          console.log("✅ User saved to DB:", userData);
        } catch (err) {
          console.error("❌ Failed to save user:", err);
        }

        return res.status(200).json({ success: true });
      }

      // Handle update and delete as needed...

      default:
        return res.status(400).json({ success: false, message: "Unhandled event type" });
    }
  } catch (err) {
    console.error("⚠️ Webhook error:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

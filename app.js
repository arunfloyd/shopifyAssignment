// require("dotenv").config();
// const express = require("express");
// const Shopify = require("shopify-api-node");
// const bodyParser = require("body-parser");
// const crypto = require("crypto");

// const app = express();
// const port = 3001;

// const shopify = new Shopify({
//   shopName: process.env.STORE_URL,
//   apiKey: process.env.API_KEY,
//   password: process.env.ACCESS_TOKEN,
// });

// const product = {};
// product.title = "Ballaan";
// product.body_html = "<strong>Good snowboard!</strong>";
// product.vendor = "Burton";
// product.product_type = "Snowboard";
// product.variants = [
//   {
//     option1: "First",
//     price: "10.00",
//     sku: "123",
//   },
//   {
//     option1: "Second",
//     price: "20.00",
//     sku: "123",
//   },
// ];
// function verifyWebhook(req, res, next) {
//   const hmac = req.headers["x-shopify-hmac-sha256"];
//   const body = JSON.stringify(req.body);
//   const secret = process.env.SECRET_KEY;

//   const hash = crypto
//     .createHmac("sha256", secret)
//     .update(body, "utf8", "hex")
//     .digest("base64");

//   if (hash === hmac) {
//     next();
//   } else {
//     res.status(403).send("Unauthorized");
//   }
// }

// const CreateProduct = async () => {
//   try {
//     const pro = shopify.product.create(product);
//     console.log("Product created successfully!", pro);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("An error occurred while creating product");
//   }
// };

// app.get("/", (req, res) => {
//   CreateProduct();
//   res.send("Hello World!");
// });

// app.get("/products", async (req, res) => {
//   try {
//     const products = await shopify.product.list({ limit: 5 });
//     res.send(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("An error occurred while fetching products");
//   }
// });
// app.get("/orders", async (req, res) => {
//     try {
//       const params = {
//         limit: 50,
//         status: 'any',
//         fields: 'id,email,total_price,created_at,updated_at'
//       };
//       const orders = await shopify.order.list(params);
//       if (orders.length === 0) {
//         res.status(404).send("No orders found");
//       } else {
//         res.json(orders);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       res.status(500).json({
//         message: "An error occurred while fetching orders",
//         error: err.message
//       });
//     }
//   });

// app.post("/shopify-webhook-request", (req, res) => {
//   console.log(req);
//   res.send("Shopify request received");
// });

// app.post("/webhook/orders/create", (req, res) => {
//   try {
//     const orderData = req.body;
//     console.log("Order data received: ", orderData);

//     // Respond to the webhook request
//     res.status(200).send("Webhook received");
//   } catch (error) {
//     console.error("Error processing webhook: ", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/webhook/orders/update", (req, res) => {
//     try {
//       const orderData = req.body;
//       console.log("Order data received: ", orderData);

//       // Respond to the webhook request
//       res.status(200).send("Webhook received");
//     } catch (error) {
//       console.error("Error processing webhook: ", error);
//       res.status(500).send("Internal Server Error");
//     }
//   });

// app.listen(port, () => {
//   console.log("Listening on port " + port);
// });

// Import Required Modules 
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const Shopify = require("shopify-api-node");


const app = express();
const PORT = 3000;

// MiddleWare to parse JSON body
app.use(bodyParser.json());

//Intialize Shopify API client 
const shopify = new Shopify({
  shopName: process.env.STORE_URL,
  apiKey: process.env.API_KEY,
  password: process.env.ACCESS_TOKEN,
});

// Sample product data to be added 
const addProduct = {
  title:
    "Samsung Galaxy S24 Ultra 5G AI Smartphone (Titanium Black, 12GB, 256GB Storage)",
  body_html:
    "<strong>Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 17.25cm (6.8) flat display. It's an absolute marvel of design. !</strong>",
  vendor: "Samsung",
  product_type: "256 GB",
  images: [
    {
      src: "https://cdn.shopify.com/s/files/1/0646/2046/2236/files/sam1.jpg?v=1722488030",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0646/2046/2236/files/sam3.jpg?v=1722488030",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0646/2046/2236/files/sam2.jpg?v=1722488030",
    },
  ],
};

// Function to create a new product on Shopify
const CreateProduct = async () => {
  try {
    const pro = await shopify.product.create(addProduct);
    console.log("Product created successfully!", pro);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while creating product");
  }
};

// Route to create a product on a GET request
app.get("/addProduct", (req, res) => {
  CreateProduct();
  res.send("<h1>Product Created Successfully</h1>");
});

// Route to list products with fields that are required
app.get("/products", async (req, res) => {
  try {
    const products = await shopify.product.list({
      fields: [
        "id",
        "title",
        "vendor",
        "product_type",
        "variants",
        "created_at",
      ],
    });

    const formattedProducts = products.map((product) => {
      return {
        id: product.id,
        title: product.title,
        vendor: product.vendor,
        product_type: product.product_type,
        variants: product.variants.map((variant) => ({
          price: variant.price,
          inventory_quantity: variant.inventory_quantity,
        })),
        created_at: product.created_at,
      };
    });

    res.send(formattedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching products");
  }
});

// Route to list orders with required fields
app.get("/orders", async (req, res) => {
    try {
      const orders = await shopify.order.list({
        limit: 5,
        fields: ["created_at", "id", "name", "total_price", "customer", "billing_address"],
      });
  
      const formattedOrders = orders.map(order => {
        return {
          created_at: order.created_at,
          id: order.id,
          name: order.name,
          total_price: order.total_price,
          customer: order.customer ? {
            id: order.customer.id,
            first_name: order.customer.first_name,
            last_name: order.customer.last_name
          } : null,
          billing_address: order.billing_address ? {
            zip: order.billing_address.zip
          } : null
        };
      });
  
      res.send(formattedOrders);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while fetching orders");
    }
  });
  
  
  // Route to list customers with required fields
  app.get("/customers", async (req, res) => {
    try {
      const params = {
        limit: 50,
        fields: "id,email,first_name,last_name,orders_count,total_spent",
      };
      const customers = await shopify.customer.list(params);
      if (customers.length === 0) {
        res.status(404).send("No customers found");
      } else {
        res.json(customers);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      res.status(500).json({
        message: "An error occurred while fetching customers",
        error: err.message,
      });
    }
  });
  
  // Route to get a specific customer and their orders
  app.get("/customers/:id", async (req, res) => {
    try {
      const customerId = req.params.id;
      const customer = await shopify.customer.get(customerId);
      const orders = await shopify.order.list({ customer_id: customerId });
      const customerWithOrders = {
        ...customer,
        orders: orders,
      };
  
      res.json(customerWithOrders);
    } catch (err) {
      console.error("Error fetching customer data:", err);
      res.status(500).json({
        message: "An error occurred while fetching customer data",
        error: err.message,
      });
    }
  });
  

  // Route to get the status of a required order
  app.get("/orders/:id/status", async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await shopify.order.get(orderId);
      res.json({
        id: order.id,
        financial_status: order.financial_status,
        fulfillment_status: order.fulfillment_status,
      });
    } catch (err) {
      console.error("Error fetching order status:", err);
      res.status(500).json({
        message: "An error occurred while fetching order status",
        error: err.message,
      });
    }
  });

// Webhook to handle order creation events
app.post("/webhook/orders/create", (req, res) => {
  try {
    const orderData = req.body;
    console.log("Order data received: ", orderData);

    // Respond to the webhook request
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error processing webhook: ", error);
    res.status(500).send("Internal Server Error");
  }
});

// Webhook to handle order update events
app.post("/webhook/orders/update", (req, res) => {
  try {
    const orderData = req.body;
    console.log("Order data received: ", orderData);

    // Respond to the webhook request
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error processing webhook: ", error);
    res.status(500).send("Internal Server Error");
  }
});

// Webhook to handle order cancellation events
app.post("/webhook/orders/cancellation", (req, res) => {
  try {
    const orderData = req.body;
    console.log("Order data received: ", orderData);

    // Respond to the webhook request
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error processing webhook: ", error);
    res.status(500).send("Internal Server Error");
  }
});

// Webhook to handle order fulfillment events
app.post("/webhook/orders/fulfilled", (req, res) => {
  try {
    const orderData = req.body;
    console.log("Order data received: ", orderData);

    // Respond to the webhook request
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error processing webhook: ", error);
    res.status(500).send("Internal Server Error");
  }
});



// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

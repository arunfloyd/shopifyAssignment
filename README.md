# shopifyAssignment


              
Table of Contents


1. Introduction 
2. Prerequisites
3. Installation
4. Configuration
5. Usage 
6. API Endpoints 
7. Webhook Handling




1. Introduction 

This Shopify app is designed to manage orders, track customer data, and provide insights for your Shopify store. It uses Node.js with Express for the backend and integrates with the Shopify API and Webhooks.Also a working Shopify Partner account with a dummy store set up

2. Prerequisites -
  Node.js (v14 or later) 
- npm (v6 or later)
 - A Shopify Partner account 
- A Shopify development store

3. Installation 

1. Clone the repository:  https://github.com/arunfloyd/shopifyAssignment
2. Install dependencies: npm install 
3.  Set up your environment variables in a `.env` file: 

SHOP_NAME =**********
API_KEY = **********
ACCESS_TOKEN = **********
SECRET_KEY = **********
STORE_URL =**********


4. Configuration 

1. In your Shopify Partner dashboard, create a new app.

2. Set the app URL to your server's address.

 		 1. Instal ngrok : npm i ngrok

 		2.Sign up for an ngrok account and get your authentication token.

 3.Add your ngrok authentication token:ngrok config add-authtoken  YOUR_AUTH_TOKEN

 4 .Run ngrok : ngrok http <PORT NUMBER Eg:3000>

   
3. Configure the webhook endpoints in your Shopify app settings: 

 orders/created: `https://your-server.com/webhooks/orders/created`
 orders/updated: `https://your-server.com/webhooks/orders/updated`
 orders/cancelled: `https://your-server.com/webhooks/orders/cancelled`



 5. Usage 

 Start the server: 

 The app will start running on `http://localhost:3001` (Or your specified port)


6. API Endpoints 

Add Product :- 
Add the details on the addProduct

const addProduct = {
 title:
   "Add Product Name",
 body_html:
   "Add Description of Product",
 vendor: "Add Company Name",
 product_type: "Add Type of it",
 images: [
   {
     src: "Add Image1",
   },
   {
     src: "Add Image2",
   },
   {
     src: "Add Image3",
   },
 ],
};



Function to create a new product on Shopify 


const CreateProduct = async () => {
 try {
   const pro = await shopify.product.create(addProduct);
   console.log("Product created successfully!", pro);
 } catch (err) {
   console.error(err);
   res.status(500).send("An error occurred while creating product");
 }
};

To add this product to shopify call a GET request 
Eg: http://localhost:3000/addProduct


List All products in shopify 
 	-  GET ‘/products’ - Eg: http://localhost:3000/products

- List All orders in shopify
           - GET ‘/orders’
           - Eg: http://localhost:3000/orders
- List All Customers in shopify
            - GET ‘/customers
           - Eg: http://localhost:3000/customers

-  Get a specific customer and their orders
    Note  : - You have to pass the correct user id
            - GET ‘/customers/:id’
            -  Eg: http://localhost:3000//customers/:id





 7. Webhook Handling 

The app automatically processes incoming webhooks for order creation, updates, fulfillment and cancellations.


  

const express = require("express");
const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const fetch = require("node-fetch");

mongoose.connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error.message));

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello");
});


const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    rating: Number,
    discount: Number,
    availability: String
});

const Product = mongoose.model("Product", productSchema);

function getData() {
    const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO']; 
    const products = ['Laptop', 'Phone', 'Computer', 'TV', 'Earphone', 'Tablet', 'Charger', 'Mouse', 'Keypad', 'Bluetooth', 'Pendrive', 'Remote', 'Speaker', 'Headset', 'PC']; 
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzI0MTYyMjQyLCJpYXQiOjE3MjQxNjE5NDIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjFjOWQ1NjJhLTM0ZDQtNDI1Yy04Y2M0LTQyZDNhZGM2MjNkMyIsInN1YiI6Imthc2hpc2hrZXNoYXJ3YW5pMjRAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiZmlyc3RBcGkiLCJjbGllbnRJRCI6IjFjOWQ1NjJhLTM0ZDQtNDI1Yy04Y2M0LTQyZDNhZGM2MjNkMyIsImNsaWVudFNlY3JldCI6Ikt6dXBYV2p3Q2hsakZkQmIiLCJvd25lck5hbWUiOiJLYXNoaXNoIEtlc2hhcndhbmkiLCJvd25lckVtYWlsIjoia2FzaGlzaGtlc2hhcndhbmkyNEBnbWFpbC5jb20iLCJyb2xsTm8iOiIyMTAwNTYwMTAwMDU2In0.4uCbFJMllF08wmDWte9lmE2QybDkGNuAmO5X676MxMc';
    companies.forEach(company => {
        products.forEach(product => {
            const API_ENDPOINT = `http://20.244.56.144/test/companies/${company}/categories/${product}/products?top=10&minPrice=1&maxPrice=10000`;
            fetch(API_ENDPOINT, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, 
                    'Content-Type': 'application/json', 
                }
            })
            .then(response => response.json())
            .then(async data => {

                for (let item of data) {
                    const { productName, price, rating, discount, availability } = item;


                    const newProduct = new Product({
                        productName,
                        price,
                        rating,
                        discount,
                        availability
                    });


                    await newProduct.save();
                }


                const sortedProducts = await Product.find().sort({ price: 1 });
                res.json(sortedProducts);
            })
            .catch(error => console.error('Error:', error));
        });
    });
}

app.get("/fetch-products", (req, res) => {
    getData();
});

app.listen(3000, () => console.log("Server running on port 3000"));
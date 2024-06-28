# import shutil
# from PIL import Image
# from io import BytesIO
# from email.mime.multipart import MIMEMultipart
# from email.mime.image import MIMEImage
# import numpy as np
# from fastapi.responses import FileResponse, HTMLResponse, JSONResponse

from typing import List
from fastapi import FastAPI, HTTPException, Response, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import cv2
import base64
from sklearn.metrics.pairwise import cosine_similarity
from pydantic import BaseModel, FilePath

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class FilePath(BaseModel):
    filePath: str

#Function to get image file
@app.post("/process_file")
async def process_file(file_path: str = Form(...)):
    #Resize the image file
    target_image = load_image(file_path)

    #Folder contain the images
    data_folder = "D:\Learning\TopUp\Graduation_Project_(COMP1682)\Term 2\web_project_BE\web_project_BE\image"

    #Perform get image file and the image in folder data_folder to perform compare
    similarity_scores = []
    for root, dirs, files in os.walk(data_folder):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                image_path = os.path.join(root, file)
                compare_image = load_image(image_path)
                similarity_score = calculate_cosine_similarity(target_image, compare_image)
                similarity_scores.append((image_path, similarity_score))

    #Sort the similarity 
    similarity_scores.sort(key=lambda x: x[1], reverse=True)
    top_similar_images = similarity_scores[1:5]

    #Extract paths of the top 3 similar images
    top_similar_image_paths = [image_path for image_path, _ in top_similar_images]

    return {'message' : top_similar_image_paths}

#Function to load image
def load_image(path_image):
    #Read image
    image = cv2.imread(path_image, cv2.IMREAD_GRAYSCALE)
    # Resize image to a consistent shap
    resized_image = cv2.resize(image, (244, 244))
    return resized_image

#Function to measure the similarity
def calculate_cosine_similarity(image1, image2):
    #Get the first image
    flat_image1 = image1.flatten().reshape(1, -1)
    #Get the second image
    flat_image2 = image2.flatten().reshape(1, -1)
    #Calculate the similar by the cosine_similarity of sklearn.metrics.pairwise library
    similarity = cosine_similarity(flat_image1, flat_image2)
    return similarity[0][0]
    

#######################Chat-Bot#########################
import re


# Function to generate response for a given question
@app.get("/chat")
async def generate_response(question : str):
    # Convert question to lowercase for case-insensitive matching
    # question = "I wanna know the size?"
    question = question.lower()

    numberOfCategory = 6
    numberOfSupplier = 1

    # Sample dataset of questions and answers
    qa_pairs = {
        "address": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "where": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "places": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "place": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "locations": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "location": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "located": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "hd shoe store": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "hd shoe": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "hd": "Our store is located at 142 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "store": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "stores": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",
        "stored": "Our store is located at 42 High Street, London, Greater London, W1A 1AA, United Kingdom.",

        "type": "There are " + str(numberOfCategory) + " type",
        "types": "There are " + str(numberOfCategory) + " types",
        "category": "There are " + str(numberOfCategory) + " categories",
        "categories": "There are " + str(numberOfCategory) + " categories",

        "suppliers": "There are " + str(numberOfSupplier) + " suppliers",
        "supplier": "There are " + str(numberOfSupplier) + " supplier",

        "size": ["To choose the right size, measure your foot length and refer to our size chart. "
                "Size: 38, Length: 23 - 24cm, Width: 9 - 9.5cm. "
                "Size: 39, Length: 24.1 - 24.5cm, Width: 9.5cm. "
                "Size: 40, Length: 24.6 - 25cm, Width: 9.5 - 10cm. "
                "Size: 41, Length: 25.1 - 25.5cm, Width: 10cm. "
                "Size: 42, Length: 25.6 - 26cm, Width: 10 - 10.5cm. "
                "Size: 43, Length: 26.1 - 26.5cm, Width: 10.5cm. "
                "Size: 44, Length: 26.6 - 27cm, Width: 10.5 - 11cm. "
                "Size: 45, Length: 27.1 - 27.5cm, Width: 11cm. "],


        "chelsea": "All shoes with the Chelsea Boot type have the price is $200.",
        "price of chelsea": "All shoes with the Chelsea Boot type have the price is $200.",
        "harness": "All shoes with the Harness Boot type have the price is $250.",
        "price of harness": "All shoes with the Harness Boot type have the price is $200.",
        "derby": "All shoes with the Derby Boot type have the price is $200.",
        "price of derby": "All shoes with the Derby Boot type have the price is $200.",
        "loafer": "All shoes with the Loafer Boot type have the price is $200.",
        "price of loafer": "All shoes with the Loafer Boot type have the price is $200.",
        "slipper": "All shoes with the Slipper Boot type have the price is $500.",
        "price of slipper": "All shoes with the Slipper Boot type have the price is $200.",
        "chunky": "All shoes with the Chunky Boot type have the price is $150.",
        "price of chunky": "All shoes with the Chunky Boot type have the price is $200.",
        
        "price": "Please, give me the type of shoe, I'll provide you the price of this type",

        "dirt": ["Remove dirt from leather and sole surfaces. "
                "Shapes and stretches the leather to restore the shoe's shape (70-90%). "
                "Polish the leather and sole. "
                "The suede will be sprayed with water to refresh and moisturize the leather. "
                "Pack and stuff with paper to keep the shoe's shape."],

        "clean": ["Remove dirt from leather and sole surfaces. "
                "Shapes and stretches the leather to restore the shoe's shape (70-90%). "
                "Polish the leather and sole. "
                "The suede will be sprayed with water to refresh and moisturize the leather. "
                "Pack and stuff with paper to keep the shoe's shape."],

        "warranty": ["Lifetime warranty on base glue; In the event that the single layer of adhesive peels off, we will provide permanent re-adhesive. "
                "Warranty on metal hardware (zippers, buttons, decorative details) for 6 months."],
        
        "exchange": ["Exchange Policy: "
                    "If newly purchased shoes have manufacturer defects such as peeling sole glue, broken threads, cracked leather or surface problems. "
                    "Please note: wrinkles on the leather are a natural characteristic of genuine leather, so when worn and stepped on, wrinkles may appear on the leather surface. This is a normal phenomenon and is not a manufacturing defect. "
                    "Shoes do not fit the customer's foot size. "
                    "Exchange Time: "
                    "Buy in Store: up to 24 hours. "
                    "Online purchase: maximum 7 days from date of receipt. "
                    "Exchange Regulations: " 
                    "Only products of the same type can be exchanged, or size exchanges, no model changes allowed. "
                    "Products must be unused (specifically tried on without walking, no heel marks, no toe creases; in case of creases, HD STORE reserves the right to decline exchange). "
                    "Products must be carefully packaged as received including the bag, box, and any internal components. "
                    "In-store exchanges: Customers bring the product to the store and discuss the issue. HD STORE will assess the product, and if everything is in order, HD STORE will exchange it at the store. "
                    ],

        "shipping": ["HD STORE will pay both ends if it is a manufacturing defect. "
                    "HD STORE will pay one end if HD STORE advised the wrong size. "
                    "Customers will pay both ends if they want to exchange sizes on their own."],
        
        "ship": ["HD STORE will pay both ends if it is a manufacturing defect. "
                    "HD STORE will pay one end if HD STORE advised the wrong size. "
                    "Customers will pay both ends if they want to exchange sizes on their own."],

        "contact": ["Phone: [+1 (999) 999-9991] "
                    "Email: hdstore@gmail.com"],
        
        "policy": ["Clean Dirt Policy: "
                "Remove dirt from leather and sole surfaces. "
                "Shapes and stretches the leather to restore the shoe's shape (70-90%). "
                "Polish the leather and sole. "
                "The suede will be sprayed with water to refresh and moisturize the leather. "
                "Pack and stuff with paper to keep the shoe's shape. "
                "Warranty Policy: "
                "Lifetime warranty on base glue; In the event that the single layer of adhesive peels off, we will provide permanent re-adhesive. "
                "Warranty on metal hardware (zippers, buttons, decorative details) for 6 months. "
                "Exchange Policy: "
                "If newly purchased shoes have manufacturer defects such as peeling sole glue, broken threads, cracked leather or surface problems. "
                "Please note: wrinkles on the leather are a natural characteristic of genuine leather, so when worn and stepped on, wrinkles may appear on the leather surface. This is a normal phenomenon and is not a manufacturing defect. "
                "Shoes do not fit the customer's foot size. "
                "Exchange Time: "
                "Buy in Store: up to 24 hours. "
                "Online purchase: maximum 7 days from date of receipt. "
                "Exchange Regulations: "
                "Only products of the same type can be exchanged, or size exchanges, no model changes allowed. "
                "Products must be unused (specifically tried on without walking, no heel marks, no toe creases; in case of creases, HD STORE reserves the right to decline exchange). "
                "Products must be carefully packaged as received including the bag, box, and any internal components. "
                "In-store exchanges: Customers bring the product to the store and discuss the issue. HD STORE will assess the product, and if everything is in order, HD STORE will exchange it at the store. " 
                "Shipping Policy: "
                "HD STORE will pay both ends if it is a manufacturing defect. "
                "HD STORE will pay one end if HD STORE advised the wrong size. "
                "Customers will pay both ends if they want to exchange sizes on their own."],

        "buy": ["To purchase product you must perform some steps: "
                "Step 1: Access to the website and go to the register page. "
                "Step 2: Perform creating a new account. "
                "Step 3: After creating a new account succeed, go to the login page. "
                "Step 4: Login to the website with account just created before. "
                "Step 5: After login succeed, got ot the product page. "
                "Step 6: Choose the product that you wanna purchase. "
                "Step 7: Add this product to your cart. "
                "Step 8: Go to the cart page and perform purchase. "],

        "buy product": ["To purchase product you must perform some steps: "
                        "Step 1: Access to the website and go to the register page. "
                        "Step 2: Perform creating a new account. "
                        "Step 3: After creating a new account succeed, go to the login page. "
                        "Step 4: Login to the website with account just created before. "
                        "Step 5: After login succeed, got ot the product page. "
                        "Step 6: Choose the product that you wanna purchase. "
                        "Step 7: Add this product to your cart. "
                        "Step 8: Go to the cart page and perform purchase. "],

        "purchase product": ["To purchase product you must perform some steps: "
                            "Step 1: Access to the website and go to the register page. "
                            "Step 2: Perform creating a new account. "
                            "Step 3: After creating a new account succeed, go to the login page. "
                            "Step 4: Login to the website with account just created before. "
                            "Step 5: After login succeed, got ot the product page. "
                            "Step 6: Choose the product that you wanna purchase. "
                            "Step 7: Add this product to your cart. "
                            "Step 8: Go to the cart page and perform purchase. "],

        "purchase": ["To purchase product you must perform some steps: "
                            "Step 1: Access to the website and go to the register page. " 
                            "Step 2: Perform creating a new account. "
                            "Step 3: After creating a new account succeed, go to the login page. "
                            "Step 4: Login to the website with account just created before. "
                            "Step 5: After login succeed, got ot the product page. "
                            "Step 6: Choose the product that you wanna purchase. "
                            "Step 7: Add this product to your cart. "
                            "Step 8: Go to the cart page and perform purchase. "],

        "create account": ["To create the account you must perform some steps: "
                            "Step 1: Access to the website and go to the register page. "
                            "Step 2: Perform creating a new account. "],

        "create the account": ["To create the account you must perform some steps: "
                            "Step 1: Access to the website and go to the register page. "
                            "Step 2: Perform creating a new account. "],

        "create an account": ["To create the account you must perform some steps: "
                            "Step 1: Access to the website and go to the register page. "
                            "Step 2: Perform creating a new account. "],

        "account": ["To create the account you must perform some steps: "
                            "Step 1: Access to the website and go to the register page. "
                            "Step 2: Perform creating a new account. "],

        "material": "All products are made of cowhide",

        "hello": "Hi, How can I help you?",
        "helo": "Hi, How can I help you?",
        "hallo": "Hi, How can I help you?",
        "hi": "Hello, How can I help you?",
        "alo": "Yeah, How can I help you?",

        "mornining": "Good morning, How can I help you?",
        "afternoon": "Good afternoon, How can I help you?",
        "evening": "Good evening, How can I help you?",

        "help": "How can I help you?",

        "information of product": "Our website provide the product about the leather shoe",
        "information": "Our website provide the product about the leather shoe",

        "leather shoe": "A leather shoe is a type of footwear made primarily from leather, which is a durable and flexible material derived from the hides of animals, typically cattle. "
                        "Leather shoes come in various styles and designs, ranging from formal dress shoes like oxfords and loafers to casual shoes like boots and sneakers. " 
                        "They are popular for their durability, classic appearance, and versatility, suitable for a wide range of occasions and outfits.",
        
        "leather": "A leather shoe is a type of footwear made primarily from leather, which is a durable and flexible material derived from the hides of animals, typically cattle. "
                        "Leather shoes come in various styles and designs, ranging from formal dress shoes like oxfords and loafers to casual shoes like boots and sneakers. " 
                        "They are popular for their durability, classic appearance, and versatility, suitable for a wide range of occasions and outfits.",
        # Add more question-answer pairs as needed
    }

    # Search for a matching question in the dataset
    for key, value in qa_pairs.items():
        if re.search(r'\b' + re.escape(key) + r'\b', question):
            return {'value' : "HD-Bot: " + ''.join(map(str, value))}
    # Return a default response if no match is found
    return {'value' : "HD-Bot: Sorry, I couldn't understand your question."}

# Example usage
# question = "Please give me the policy?"
# response = generate_response(question)
# if isinstance(response, list):
#     print("HD-Bot:")
#     for answer in response:
#         print("-", answer)
# else:
#     print("Answer:", response)

# # URL of your FastAPI endpoint
# url = "http://127.0.0.1:8000/chat"

# # Query parameter 'question' containing the user's question
# params = {"question": "Please give me the policy?"}

# # Send a GET request to the endpoint
# response = requests.get(url, params=params)

# # Print the response content
# print(response.json())

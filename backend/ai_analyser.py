from typing import List, Dict
import json
from groq import Groq
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Initialize Groq client
groq = Groq(api_key=os.getenv("GROQ_API_KEY"))

class OrderGroup(BaseModel):
    """Pydantic model for grouped orders."""
    group_id: int  # Unique ID for each group
    order_ids: List[int]  # List of order IDs in the group
    skus: List[str]  # List of SKUs in the group
    sku_names: List[str]  # List of SKU names in the group

def club_orders(order_data: List[Dict]) -> List[Dict]:
    """
    Club orders based on SKU descriptions using an LLM.
    
    Args:
        order_data (List[Dict]): List of dictionaries containing order details.
            Each dictionary has the following keys:
                - "order_id" (int): The order ID.
                - "skus" (List[str]): List of SKUs for the order.
                - "sku_names" (List[str]): List of SKU names for the order.
                - "sku_descriptions" (List[str]): List of SKU descriptions for the order.
    
    Returns:
        List[Dict]: JSON output with grouped orders.
    """
    # Prepare the LLM prompt
    prompt = (
        "You are an expert in grouping SKUs based on their descriptions. "
        "Each order can have multiple SKUs, and your task is to group SKUs "
        "that share the EXACT SAME description. Each SKU can belong to only one group. "
        "If a SKU has a unique description, it should form its own group. "
        "The grouping should preserve the original order sequence. "
        "Output the result in JSON format with the following schema:\n"
        "{\n"
        '  "groups": [\n'
        "    {\n"
        '      "group_id": <int>,\n'
        '      "order_ids": [<int>, ...],\n'
        '      "skus": [<str>, ...],\n'
        '      "sku_names": [<str>, ...]\n'
        "    },\n"
        "    ...\n"
        "  ]\n"
        "}\n\n"
        f"Input data: {json.dumps(order_data, indent=2)}"
    )
    
    # Call the LLM
    chat_completion = groq.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are an expert in grouping SKUs based on their descriptions. "
                           "Output must strictly follow the provided JSON schema."
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        model="llama3-70b-8192",
        temperature=0,
        stream=False,
        response_format={"type": "json_object"},
    )
    
    # Parse the LLM response
    response_content = chat_completion.choices[0].message.content
    response_json = json.loads(response_content)
    
    # Validate and return the grouped orders
    groups = [OrderGroup(**group) for group in response_json.get("groups", [])]
    return [group.model_dump() for group in groups]

# # Example usage
# if __name__ == "__main__":
#     # Example input data
#     order_data = [
#     {
#         "order_id": 201,
#         "skus": ["SKU301", "SKU302"],
#         "sku_descriptions": ["Grilled Chicken", "Fried Rice"]
#     },
#     {
#         "order_id": 202,
#         "skus": ["SKU303", "SKU304"],
#         "sku_descriptions": ["Grilled Chicken", "Steamed Vegetables"]
#     },
#     {
#         "order_id": 203,
#         "skus": ["SKU305", "SKU306"],
#         "sku_descriptions": ["Fried Rice", "Ice Cream"]
#     },
#     {
#         "order_id": 204,
#         "skus": ["SKU307"],
#         "sku_descriptions": ["Steamed Vegetables"]
#     }
# ]
    
#     # Get grouped orders
#     grouped_orders = club_orders(order_data)
#     print(json.dumps(grouped_orders, indent=2))
def main():
    # Initialize the database connection
    db = OrderDatabase()
    
    try:
        # Step 1: Retrieve pending orders with SKU details
        pending_orders = db.get_pending_orders_with_details()
        
        # Step 2: Transform the data into the format required by club_orders
        order_dict = {}
        for item in pending_orders:
            order_id = item["order_id"]
            sku = item["sku"]
            sku_description = item["sku_description"]
            
            if order_id not in order_dict:
                order_dict[order_id] = {"skus": [], "sku_descriptions": []}
            
            order_dict[order_id]["skus"].append(sku)
            order_dict[order_id]["sku_descriptions"].append(sku_description)
        
        # Convert the dictionary into a list of dictionaries
        order_data = [
            {"order_id": order_id, "skus": details["skus"], "sku_descriptions": details["sku_descriptions"]}
            for order_id, details in order_dict.items()
        ]
        
        # Step 3: Call club_orders with the transformed data
        grouped_orders = club_orders(order_data)
        
        # Print the grouped orders
        print(json.dumps(grouped_orders, indent=2))
    
    except Exception as e:
        print("Error during processing:", e)
    
    finally:
        # Close the database connection
        db.close()

if __name__ == "__main__":
    main()
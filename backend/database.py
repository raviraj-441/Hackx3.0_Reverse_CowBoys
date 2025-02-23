from pydantic import BaseModel, EmailStr
import uuid
import os
import psycopg2
import json
from dotenv import load_dotenv
from datetime import datetime
from psycopg2.extras import RealDictCursor
import bcrypt

# Load environment variables
load_dotenv()

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "customer"

class UserSchema(BaseModel):
    id: str
    name: str
    email: EmailStr
    password: str
    role: str
    created_at: str

    def __init__(self, **data):
        super().__init__(
            id=str(uuid.uuid4()),
            created_at=datetime.utcnow().isoformat(),
            **data
        )

class CompanyDatabase:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

    def get_company_data(self):
        query = "SELECT * FROM company;"
        self.cursor.execute(query)  # Execute query
        result = self.cursor.fetchall()  # Fetch results
        return result if result else []  # Return empty list if no data

class UserDatabase:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

    def create_user(self, name, email, password, role="customer"):
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        query = """
        INSERT INTO employees (id, name, email, password, role, created_at)
        VALUES (%s, %s, %s, %s, %s, %s) RETURNING id;
        """
        user_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        self.cursor.execute(query, (user_id, name, email, hashed_password, role, created_at))
        self.conn.commit()
        return user_id

    def get_user_by_email(self, email):
        query = "SELECT * FROM employees WHERE email = %s;"
        self.cursor.execute(query, (email,))
        return self.cursor.fetchone()

    def get_user_by_id(self, user_id):
        query = "SELECT * FROM users WHERE id = %s;"
        self.cursor.execute(query, (user_id,))
        return self.cursor.fetchone()
    
    def login_user(self, email, password):
        user = self.get_user_by_email(email)
        if user and bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            return {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"], "created_at": user["created_at"]}
        return None

    def close(self):
        self.cursor.close()
        self.conn.close()

class MenuDatabase:
    def __init__(self):
        """Initialize connection to Supabase PostgreSQL using environment variables."""
        self.conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        self.cursor = self.conn.cursor()
    
    def get_all_menu_items(self):
        """Fetch all menu items from the database."""
        try:
            self.cursor.execute("SELECT * FROM menu;")
            return self.cursor.fetchall()
        except Exception as e:
            print("Error fetching menu:", e)
            return []
    
    def generate_sku(self, sub_category):
        """Generate SKU based on category and occurrence count."""
        try:
            prefix = sub_category[:3].upper()  # First 3 letters of category
            self.cursor.execute("SELECT COUNT(*) FROM menu WHERE sub_category = %s;", (sub_category,))
            count = self.cursor.fetchone()[0] + 1 
            # Get occurrence count
            sku= f"{prefix}{str(count).zfill(3)}" 
            print(f"this is the sku generated{sku}")
            return sku
        except Exception as e:
            print("Error generating SKU:", e)
            return None

    def add_menu_item(self, name, category, sub_category, tax_percentage, packaging_charge,description, variations,image_url):
        """Add a new menu item with auto-generated SKU."""
        try:
                
            sku = self.generate_sku(sub_category)  # Generate SKU
            if not sku:
                return "Error generating SKU"
            
            # Convert variations (Python dict) to JSON string for JSONB column
            variations_json = json.dumps(variations)

            # Insert menu item
            query = """
            INSERT INTO menu (name, category, sub_category, sku, tax_percentage, packaging_charge,description, variations,image_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s);
            """
            self.cursor.execute(query, (name, category, sub_category, sku, tax_percentage, packaging_charge,description, variations_json,image_url))
            self.conn.commit()
            return f"Menu item '{name}' added with SKU: {sku}"
        
        except Exception as e:
            self.conn.rollback()
            print("Error adding menu item:", e)
            return "Error adding menu item"
        
    def delete_menu_item(self, sku):
        """Deletes a menu item by SKU."""
        self.cursor.execute("DELETE FROM menu WHERE sku = %s RETURNING name", (sku,))
        deleted_item = self.cursor.fetchone()
        
        if deleted_item:
            self.conn.commit()
            print(f"🗑️ Deleted item: {deleted_item[0]} (SKU: {sku})")
        else:
            print(f"⚠️ No item found with SKU: {sku}")
            
    def edit_menu_item(self, sku, **updates):
        """Edits a menu item by SKU, updating only the provided fields."""
        if not updates:
            return "⚠️ No updates provided"

        set_clause = []
        values = []

        # Dynamically build the SET clause
        for column, value in updates.items():
            if value is not None:  # Ignore None values
                set_clause.append(f"{column} = %s")
                values.append(value)

        if not set_clause:
            return "⚠️ No valid fields to update"

        query = f"UPDATE menu SET {', '.join(set_clause)} WHERE sku = %s"
        values.append(sku)  # SKU goes at the end for the WHERE condition

        try:
            self.cursor.execute(query, tuple(values))
            self.conn.commit()
            return f"✅ Menu item with SKU {sku} updated successfully"
        except Exception as e:
            self.conn.rollback()
            print("Error updating menu item:", e)
            return "Error updating menu item"
        
    def get_offer_item(self):
        """Returns the menu item with the least sales today for promotion"""
        try:
            query = """
            WITH daily_orders AS (
                SELECT 
                    o_items.sku,
                    SUM(o_items.quantity) AS total_ordered
                FROM orders,
                LATERAL jsonb_to_recordset(items) AS o_items(
                    sku TEXT, 
                    quantity INT, 
                    price NUMERIC  -- Add this to match your JSON structure
                )
                WHERE created_at >= current_date
                GROUP BY o_items.sku
            )
            SELECT 
                m.*,
                COALESCE(d.total_ordered, 0) AS total_ordered
            FROM menu m
            LEFT JOIN daily_orders d ON m.sku = d.sku
            ORDER BY total_ordered ASC, m.created_at DESC
            LIMIT 1;
            """

            self.cursor.execute(query)
            result = self.cursor.fetchone()
            return result  # Directly return RealDictRow

        except Exception as e:
            print("Error finding offer item:", e)
            return None




    def close(self):
        """Close database connection."""
        self.cursor.close()
        self.conn.close()
        


class OrderDatabase:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

    def get_available_waiter(self):
        """
        Get the waiter with no assigned tables or the one with the least tables.
        """
        query = """
        SELECT e.id AS waiter_id, COUNT(a.id) AS table_count
        FROM employees e
        LEFT JOIN allocations a ON e.id = a.waiter_id
        WHERE e.role = 'waiter'
        GROUP BY e.id
        ORDER BY table_count ASC
        LIMIT 1;
        """
        self.cursor.execute(query)
        waiter = self.cursor.fetchone()
        return waiter["waiter_id"] if waiter else None

    def calculate_order_price(self, items):
        """
        Calculate the total order price, including tax, from menu items.
        """
        total_price = 0.0
        for item in items:
            sku = item["sku"]
            quantity = item["quantity"]

            # Fetch item details from menu
            self.cursor.execute("SELECT tax_percentage, packaging_charge FROM menu WHERE sku = %s", (sku,))
            menu_item = self.cursor.fetchone()
            print(menu_item)

            if menu_item:
                base_price = item["price"] * quantity
                print(f"this is base price {base_price}")
                tax = float(menu_item["tax_percentage"] / 100) * base_price
                packaging_charge = menu_item["packaging_charge"]
                total_price += float(base_price) + float(tax) + float(packaging_charge)
                print(f"this is total price {total_price}")

        return round(total_price, 2)

    def create_order(self, channel_type, table_numbers, items, settlement_mode):
        """
        Place an order and assign it to the least-burdened waiter.
        """
        waiter_id = self.get_available_waiter()
        if not waiter_id:
            return {"error": "No available waiters"}

        # Calculate the total order price
        total_price = self.calculate_order_price(items)

        # Convert list to JSON format
        table_no_json = json.dumps({"tables": table_numbers})  
        items_json = json.dumps(items)

        # Insert order into `orders` table with waiter_id
        order_query = """
        INSERT INTO orders (created_at, channel_type, table_no, items, price, settlement_mode, waiter_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id;
        """
        self.cursor.execute(order_query, (datetime.now(), channel_type, table_no_json, items_json, total_price, settlement_mode, waiter_id))
        order_id = self.cursor.fetchone()["id"]

        # Assign waiter in `allocations` table
        alloc_query = """
        INSERT INTO allocations (table_no, waiter_id, created_at)
        VALUES (%s, %s, NOW());
        """
        self.cursor.execute(alloc_query, (table_no_json, waiter_id))

        self.conn.commit()
        return {"order_id": order_id, "waiter_id": waiter_id, "total_price": total_price}
    
    def get_allocations(self):
        query = """
        SELECT a.id, a.created_at, a.table_no, a.waiter_id, e.name AS waiter_name
        FROM allocations a
        JOIN employees e ON a.waiter_id = e.id;
        """
        self.cursor.execute(query)

        allocations = self.cursor.fetchall()
        # return [
        #     {
        #         "id": row[0],
        #         "created_at": row[1],
        #         "table_no": row[2],  # Assuming it's stored as JSON in the DB
        #         "waiter_id": row[3],
        #         "waiter_name": row[4]  # Adding waiter_name to the response
        #     }
        #     for row in allocations
        # ]
        return allocations
    
    def get_order_management(self):
        query = """
SELECT 
    o.id AS order_id,
    o.created_at,
    o.channel_type,
    jsonb_agg(
        jsonb_build_object(
            'name', m.name,
            'sku', i->>'sku',
            'price', (i->>'price')::numeric,
            'quantity', (i->>'quantity')::int
        )
    ) AS items,
    o.price,
    o.settlement_mode,
    o.waiter_id,
    o.table_no->'tables' AS assigned_tables
FROM orders o,
LATERAL jsonb_array_elements(o.items) AS i
JOIN menu m ON m.sku = i->>'sku'
GROUP BY o.id, o.created_at, o.channel_type, o.price, o.settlement_mode, o.waiter_id, o.table_no;


        """
        self.cursor.execute(query)
        result=self.cursor.fetchall()
        return result
    

    def get_pending_orders_with_details(self):
        """
        Retrieve pending orders along with SKU details (name and description).
        
        Returns:
            List[Dict]: A list of dictionaries containing order_id, sku, sku_name, and sku_description.
        """
        try:
            # Query to fetch pending orders and their items
            query = """
            WITH order_items AS (
                SELECT
                    o.id AS order_id,
                    jsonb_array_elements(o.items::jsonb)->>'sku' AS sku
                FROM orders o
                WHERE o.status = 'Pending'
            )
            SELECT
                oi.order_id,
                oi.sku,
                m.name AS sku_name,
                m.description AS sku_description
            FROM order_items oi
            JOIN menu m ON oi.sku = m.sku;
            """
            self.cursor.execute(query)
            rows = self.cursor.fetchall()

            print("Raw rows from database:", rows)  # Debugging log

            # Transform the result into a list of dictionaries
            result = [
                {
                    "order_id": row["order_id"],
                    "sku": row["sku"],
                    "sku_name": row["sku_name"],
                    "sku_description": row["sku_description"].strip() if row["sku_description"] else None
                }
                for row in rows
            ]

            print("Transformed result:", result)  # Debugging log

            return result
        
        except Exception as e:
            print("Error retrieving pending orders:", e)
            return []
    
    def close(self):
        self.cursor.close()
        self.conn.close()


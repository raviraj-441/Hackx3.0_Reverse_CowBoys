import os
import psycopg2
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Database:
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
            self.cursor.execute("SELECT COUNT(*) FROM menu WHERE category = %s;", (sub_category,))
            count = self.cursor.fetchone()[0] + 1  # Get occurrence count
            return f"{prefix}{str(count).zfill(3)}"  # Format: CAT001, CAT002, etc.
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




    def close(self):
        """Close database connection."""
        self.cursor.close()
        self.conn.close()

# Usage Example:


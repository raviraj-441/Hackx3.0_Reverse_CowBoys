from fastapi import APIRouter
from pydantic import BaseModel

from database import OrderDatabase


router = APIRouter()

@router.get("/settlement_master")
def settlement_master():
    db = OrderDatabase()
    try:
        # Get total orders and total sales for Online Delivery
        online_query = """
SELECT COUNT(*) AS order_count, 
       SUM((item->>'price')::numeric * (item->>'quantity')::integer) AS total_sales
FROM orders, 
     jsonb_array_elements(items) AS item
WHERE channel_type = 'Online Delivery';

        """
        db.cursor.execute(online_query)
        online_result = db.cursor.fetchone()
        online_orders = online_result["order_count"] or 0
        online_sales = float(online_result["total_sales"] or 0)
        online_commission = online_sales * 0.10  # 10% commission

        # Get total orders and total sales for Credit Card payments
        credit_card_query = """
SELECT COUNT(*) AS order_count, 
       SUM((item->>'price')::numeric * (item->>'quantity')::integer) AS total_sales
FROM orders, 
     jsonb_array_elements(items) AS item
WHERE settlement_mode = 'Credit Card';

        """
        db.cursor.execute(credit_card_query)
        credit_result = db.cursor.fetchone()
        credit_orders = credit_result["order_count"] or 0
        credit_sales = float(credit_result["total_sales"] or 0)
        credit_commission = credit_sales * 0.05  # 5% commission

        return {
            "Online Delivery": {
                "total_orders": online_orders,
                "total_sales": online_sales,
                "commission_amount": online_commission
            },
            "Credit Card": {
                "total_orders": credit_orders,
                "total_sales": credit_sales,
                "commission_amount": credit_commission
            }
        }
    finally:
        db.close()

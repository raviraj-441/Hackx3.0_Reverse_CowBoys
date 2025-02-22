from fastapi import FastAPI
from routes.menu import router as menu_router
from routes.orders import router as order_router

app = FastAPI()

# Include menu routes
app.include_router(menu_router, prefix="/api", tags=["Menu"])
app.include_router(order_router,prefix="/api",tags=["Orders"])

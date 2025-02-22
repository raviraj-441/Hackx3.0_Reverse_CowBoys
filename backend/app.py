from fastapi import FastAPI
from routes.menu import router as menu_router

app = FastAPI()

# Include menu routes
app.include_router(menu_router, prefix="/api", tags=["Menu"])

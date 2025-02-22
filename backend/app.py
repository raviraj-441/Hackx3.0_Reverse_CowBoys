from fastapi import FastAPI
from routes.menu import router as menu_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include menu routes
app.include_router(menu_router, prefix="/api", tags=["Menu"])

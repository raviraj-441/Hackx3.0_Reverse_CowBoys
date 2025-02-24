from fastapi import FastAPI
from routes.users import router as user_router
from routes.menu import router as menu_router
from routes.orders import router as order_router
from routes.settlement import router as settlement_router
from routes.company import router as company_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/api", tags=["Users"])
# Include menu routes
app.include_router(menu_router, prefix="/api", tags=["Menu"])
app.include_router(order_router,prefix="/api",tags=["Orders"])
app.include_router(settlement_router,prefix="/api",tags=["Settlement"])
app.include_router(company_router,prefix="/api",tags=["Company"])
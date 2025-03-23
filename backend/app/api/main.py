from fastapi import APIRouter

from .routers import (category_router, health_router, item_router,
                      login_router, stock_router, stockmovement_router,
                      user_router, warehouse_router)

api_router = APIRouter()
api_router.include_router(health_router.router)
api_router.include_router(category_router.router)
api_router.include_router(item_router.router)
api_router.include_router(stock_router.router)
api_router.include_router(stockmovement_router.router)
api_router.include_router(warehouse_router.router)
api_router.include_router(login_router.router)
api_router.include_router(user_router.router)

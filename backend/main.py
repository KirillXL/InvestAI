from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor

app = FastAPI(title="InvestAI Local ML API")

# Разрешаем CORS, чтобы React мог делать запросы к нашему API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HistoryItem(BaseModel):
    date: str
    price: float
    predicted: Optional[float] = None

class PredictRequest(BaseModel):
    symbol: str
    history: List[HistoryItem]

@app.post("/api/predict")
async def predict(request: PredictRequest):
    # Преобразуем историю в DataFrame
    df = pd.DataFrame([{"date": item.date, "Close": item.price} for item in request.history])
    
    if len(df) < 5:
        return {
            "price": request.history[-1].price if request.history else 0,
            "trend": "neutral",
            "confidence": 50.0,
            "analysis": "Недостаточно данных для обучения модели."
        }
    
    # --- Подготовка данных (Feature Engineering) ---
    # Создаем лаговые признаки: используем цену за предыдущие 3 дня
    df['Close_lag1'] = df['Close'].shift(1)
    df['Close_lag2'] = df['Close'].shift(2)
    df['Close_lag3'] = df['Close'].shift(3)
    
    # Удаляем строки с NaN (первые 3 дня)
    train_df = df.dropna()
    
    if len(train_df) < 2:
        last_price = df['Close'].iloc[-1]
        return {
            "price": last_price,
            "trend": "neutral",
            "confidence": 50.0,
            "analysis": "Мало данных для корректного прогноза."
        }

    # --- Обучение модели на лету ---
    # В реальном проекте здесь будет загрузка модели: model = joblib.load('model.pkl')
    X = train_df[['Close_lag1', 'Close_lag2', 'Close_lag3']]
    y = train_df['Close']
    
    model = GradientBoostingRegressor(n_estimators=50, max_depth=3, random_state=42)
    model.fit(X, y)
    
    # --- Предсказание ---
    # Берем последние 3 дня из оригинального df
    last_3_days = df['Close'].iloc[-3:].values
    X_next = pd.DataFrame([last_3_days], columns=['Close_lag1', 'Close_lag2', 'Close_lag3'])
    
    predicted_price = float(model.predict(X_next)[0])
    current_price = request.history[-1].price
    
    # Формируем логику для интерфейса
    trend = "bullish" if predicted_price > current_price else "bearish"
    
    price_diff_percent = abs(predicted_price - current_price) / current_price
    confidence = max(50.0, min(99.0, 100.0 - (price_diff_percent * 100))) 
    
    if trend == 'bullish':
        analysis = f"Локальная ML модель ({request.symbol}): Ожидается рост до ${predicted_price:.2f}. Анализ паттернов указывает на восходящий импульс."
    else:
        analysis = f"Локальная ML модель ({request.symbol}): Ожидается снижение до ${predicted_price:.2f}. Градиентный бустинг выявил слабость тренда."
        
    return {
        "price": predicted_price,
        "trend": trend,
        "confidence": float(confidence),
        "analysis": analysis
    }

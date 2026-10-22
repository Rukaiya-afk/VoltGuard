import asyncio
import json
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from model import VoltGuardModel

app = FastAPI(title="VoltGuard Backend API", version="1.0.0")

# Enable CORS for frontend Next.js application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = VoltGuardModel()

class FaultInjectionRequest(BaseModel):
    outlet_id: str
    fault_mode: str # "none", "inrush", "stall", "micro_arc"

class BreakerToggleRequest(BaseModel):
    outlet_id: str
    state: str # "CLOSED" or "TRIPPED"

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "VoltGuard Anomaly Detection Engine",
        "ml_model": "IsolationForest (contamination=0.03)"
    }

@app.get("/api/stream-telemetry")
async def stream_telemetry(request: Request):
    """
    Server-Sent Events (SSE) streaming real-time telemetry updates.
    """
    async def event_generator():
        while True:
            if await request.is_disconnected():
                break
            telemetry = model.update_telemetry()
            data = json.dumps(telemetry)
            yield f"data: {data}\n\n"
            await asyncio.sleep(1.0) # 1-second update interval

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/api/inject-fault")
def inject_fault(req: FaultInjectionRequest):
    if req.outlet_id not in model.outlets:
        raise HTTPException(status_code=404, detail="Outlet not found")
    
    valid_modes = ["none", "inrush", "stall", "micro_arc"]
    if req.fault_mode not in valid_modes:
        raise HTTPException(status_code=400, detail=f"Invalid fault mode. Choose from {valid_modes}")

    model.inject_fault(req.outlet_id, req.fault_mode)
    return {
        "status": "success",
        "outlet_id": req.outlet_id,
        "fault_mode": req.fault_mode,
        "message": f"Fault '{req.fault_mode}' injected into {req.outlets[req.outlet_id]['name']}"
    }

@app.post("/api/trip-breaker")
def trip_breaker(req: BreakerToggleRequest):
    if req.outlet_id not in model.outlets:
        raise HTTPException(status_code=404, detail="Outlet not found")
    
    if req.state not in ["CLOSED", "TRIPPED"]:
        raise HTTPException(status_code=400, detail="State must be CLOSED or TRIPPED")

    model.set_breaker(req.outlet_id, req.state)
    return {
        "status": "success",
        "outlet_id": req.outlet_id,
        "state": req.state
    }

@app.get("/api/billing-census")
def billing_census():
    """
    Returns monthly appliance power disaggregation and slab rate predictions.
    """
    return {
        "consumer_number": "MH-PUN-8921-K",
        "consumer_name": "Rajesh Sharma",
        "bill_number": "ACC-2026-9941",
        "tariff_tier": "MSEDCL Residential LT-1 (Pune Urban)",
        "rate_per_kwh": 8.50, # ₹8.50/kWh
        "sanctioned_load_kw": 7.5,
        "billing_unit_code": "BU-4110-KOTHRUD-PUNE",
        "month_consumed_kwh": 482.5,
        "projected_bill_inr": 4101.25,
        "outlier_waste_kwh": 34.2,
        "outlier_waste_cost_inr": 290.70,
        "appliance_shares": [
            {"name": "Master Bed Split AC (1.5T)", "kwh": 185.2, "percentage": 38.4, "color": "#06b6d4"},
            {"name": "Living Room AC (2.0T)", "kwh": 162.8, "percentage": 33.7, "color": "#3b82f6"},
            {"name": "Kitchen Geyser (25A)", "kwh": 92.5, "percentage": 19.2, "color": "#f59e0b"},
            {"name": "Main Refrigerator (500L)", "kwh": 42.0, "percentage": 8.7, "color": "#10b981"}
        ],
        "degradation_insights": [
            {
                "id": "master_ac_insight",
                "appliance": "Master Bed Split AC (1.5T)",
                "severity": "WARNING",
                "excess_consumption_pct": 26,
                "title": "Abnormal Continuous Drag Detected",
                "description": "Master Bed AC has consumed 26% more energy this week compared to baseline under identical run-hours. High likelihood of clogged filters, low refrigerant pressure, or motor capacitor degradation.",
                "recommendation": "Schedule coil cleaning & refrigerant charge inspection to recover ₹420/month."
            },
            {
                "id": "geyser_insight",
                "appliance": "Kitchen Geyser (25A)",
                "severity": "OPTIMIZATION",
                "excess_consumption_pct": 12,
                "title": "Scaling & Thermal Resistance Spike",
                "description": "Element heating ramp takes 18% longer to satisfy thermostat setpoint. Mineral scaling detected on heating coil element.",
                "recommendation": "Flush tank scaling to reduce thermal resistance waste."
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

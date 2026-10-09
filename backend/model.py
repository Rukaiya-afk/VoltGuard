import numpy as np
import time
from typing import Dict, Any, List
from sklearn.ensemble import IsolationForest

class VoltGuardModel:
    def __init__(self):
        np.random.seed(42)
        
        n_samples = 1500
        V_base = np.random.normal(230, 2.5, n_samples)
        I_base = np.random.exponential(4.0, n_samples) + 0.5
        cos_phi_base = np.random.uniform(0.88, 0.98, n_samples)
        dI_dt_base = np.random.normal(0.2, 0.5, n_samples)
        duration_base = np.random.uniform(100, 300, n_samples)
        T_base = np.random.normal(32, 3.0, n_samples)

        X_train = np.column_stack([V_base, I_base, cos_phi_base, dI_dt_base, duration_base, T_base])
        
        self.iso_forest = IsolationForest(
            n_estimators=100,
            contamination=0.03,
            random_state=42
        )
        self.iso_forest.fit(X_train)
        
        # 6 Monitored Home Circuits
        self.outlets = {
            "master_ac": {
                "id": "master_ac",
                "name": "Master Bedroom AC",
                "rated_current": 12.5,
                "trip_current": 20.0,
                "voltage": 230.0,
                "current": 6.8,
                "cos_phi": 0.92,
                "power_watts": 1444.0,
                "terminal_temp": 38.5,
                "status": "normal",
                "breaker_state": "CLOSED",
                "fault_mode": "none",
                "fault_start_time": 0,
                "last_current": 6.8
            },
            "living_ac": {
                "id": "living_ac",
                "name": "Living Room AC",
                "rated_current": 16.0,
                "trip_current": 25.0,
                "voltage": 228.0,
                "current": 9.2,
                "cos_phi": 0.90,
                "power_watts": 1887.0,
                "terminal_temp": 42.0,
                "status": "normal",
                "breaker_state": "CLOSED",
                "fault_mode": "none",
                "fault_start_time": 0,
                "last_current": 9.2
            },
            "kitchen_geyser": {
                "id": "kitchen_geyser",
                "name": "Kitchen Water Heater",
                "rated_current": 15.0,
                "trip_current": 22.0,
                "voltage": 231.0,
                "current": 11.4,
                "cos_phi": 0.98,
                "power_watts": 2580.0,
                "terminal_temp": 45.2,
                "status": "normal",
                "breaker_state": "CLOSED",
                "fault_mode": "none",
                "fault_start_time": 0,
                "last_current": 11.4
            },
            "refrigerator": {
                "id": "refrigerator",
                "name": "Main Refrigerator",
                "rated_current": 4.0,
                "trip_current": 8.0,
                "voltage": 230.5,
                "current": 1.2,
                "cos_phi": 0.85,
                "power_watts": 235.0,
                "terminal_temp": 30.1,
                "status": "normal",
                "breaker_state": "CLOSED",
                "fault_mode": "none",
                "fault_start_time": 0,
                "last_current": 1.2
            },
            "washing_machine": {
                "id": "washing_machine",
                "name": "Washing Machine & Dryer",
                "rated_current": 10.0,
                "trip_current": 16.0,
                "voltage": 229.0,
                "current": 4.5,
                "cos_phi": 0.88,
                "power_watts": 908.0,
                "terminal_temp": 34.0,
                "status": "normal",
                "breaker_state": "CLOSED",
                "fault_mode": "none",
                "fault_start_time": 0,
                "last_current": 4.5
            },
            "ev_charger": {
                "id": "ev_charger",
                "name": "EV Fast Charger (High Risk Outlet)",
                "rated_current": 20.0,
                "trip_current": 30.0,
                "voltage": 225.0,
                "current": 18.5,
                "cos_phi": 0.94,
                "power_watts": 3912.0,
                "terminal_temp": 52.0,
                "status": "normal",
                "breaker_state": "CLOSED",
                "fault_mode": "none",
                "fault_start_time": 0,
                "last_current": 18.5,
                "hazard_warning": "High power draw circuit - monitor for overheating"
            }
        }

    def predict_anomaly(self, V: float, I: float, cos_phi: float, dI_dt: float, duration_ms: float, T: float) -> float:
        features = np.array([[V, I, cos_phi, dI_dt, duration_ms, T]])
        raw_score = self.iso_forest.decision_function(features)[0]
        normalized_score = max(0.0, min(1.0, 0.5 - (raw_score * 1.8)))
        return float(round(normalized_score, 3))

    def update_telemetry(self) -> Dict[str, Any]:
        now = time.time()
        telemetry_data = {}
        global_anomaly_detected = False
        forensic_alert = None

        for outlet_id, outlet in self.outlets.items():
            if outlet["breaker_state"] == "TRIPPED":
                outlet["current"] = 0.0
                outlet["power_watts"] = 0.0
                outlet["terminal_temp"] = max(25.0, outlet["terminal_temp"] - 0.4)
                outlet["status"] = "tripped"
                telemetry_data[outlet_id] = {
                    **outlet,
                    "anomaly_score": 0.0,
                    "is_masked_inrush": False
                }
                continue

            base_V = 230.0 + np.random.normal(0, 1.2)
            fault_mode = outlet["fault_mode"]

            if fault_mode == "none":
                if outlet_id == "master_ac":
                    target_I = 6.8 + np.random.normal(0, 0.2)
                    target_cos = 0.92
                    target_T = 38.5 + np.random.normal(0, 0.2)
                elif outlet_id == "living_ac":
                    target_I = 9.2 + np.random.normal(0, 0.3)
                    target_cos = 0.90
                    target_T = 42.0 + np.random.normal(0, 0.3)
                elif outlet_id == "kitchen_geyser":
                    target_I = 11.4 + np.random.normal(0, 0.25)
                    target_cos = 0.98
                    target_T = 45.2 + np.random.normal(0, 0.3)
                elif outlet_id == "refrigerator":
                    target_I = 1.2 + np.random.normal(0, 0.1)
                    target_cos = 0.85
                    target_T = 30.1 + np.random.normal(0, 0.2)
                elif outlet_id == "washing_machine":
                    target_I = 4.5 + np.random.normal(0, 0.2)
                    target_cos = 0.88
                    target_T = 34.0 + np.random.normal(0, 0.2)
                else: # EV Charger
                    target_I = 18.5 + np.random.normal(0, 0.4)
                    target_cos = 0.94
                    target_T = 52.0 + np.random.normal(0, 0.4)

                V_val = base_V
                I_val = target_I
                cos_val = target_cos
                T_val = target_T
                duration_ms = 100.0

            elif fault_mode == "inrush":
                elapsed_ms = (now - outlet["fault_start_time"]) * 1000
                if elapsed_ms < 350:
                    I_val = outlet["rated_current"] * 2.2
                    cos_val = 0.72
                    V_val = base_V - 5.0
                    T_val = outlet["terminal_temp"] + 0.2
                    duration_ms = elapsed_ms
                else:
                    outlet["fault_mode"] = "none"
                    I_val = outlet["rated_current"] * 0.55
                    cos_val = 0.91
                    V_val = base_V
                    T_val = outlet["terminal_temp"]
                    duration_ms = 100.0

            elif fault_mode == "stall" or fault_mode == "outbreak":
                elapsed_sec = now - outlet["fault_start_time"]
                V_val = 180.0 + np.random.normal(0, 1.0)
                I_val = 28.5 + np.random.normal(0, 0.8)
                cos_val = 0.62
                T_val = outlet["terminal_temp"] + (elapsed_sec * 5.0)
                duration_ms = elapsed_sec * 1000

            elif fault_mode == "micro_arc":
                jitter = np.random.normal(0, 4.5)
                I_val = max(1.0, outlet["rated_current"] + jitter + 4.0)
                cos_val = max(0.5, 0.80 - abs(jitter) * 0.05)
                V_val = base_V - np.random.uniform(10.0, 25.0)
                T_val = outlet["terminal_temp"] + 3.0
                duration_ms = 1200.0

            dI_dt = abs(I_val - outlet["last_current"]) / 0.5
            outlet["last_current"] = I_val
            
            raw_anomaly_score = self.predict_anomaly(V_val, I_val, cos_val, dI_dt, duration_ms, T_val)

            is_masked_inrush = False
            if fault_mode == "inrush" and duration_ms < 500:
                is_masked_inrush = True
                status = "inrush"
                anomaly_score = min(0.35, raw_anomaly_score * 0.4)
            else:
                anomaly_score = raw_anomaly_score
                if anomaly_score > 0.70 or T_val > 65.0 or (V_val < 185.0 and I_val > 15.0) or I_val > outlet["trip_current"] or fault_mode == "outbreak":
                    status = "anomalous"
                    global_anomaly_detected = True
                    outlet["breaker_state"] = "TRIPPED"
                    outlet["current"] = 0.0
                    outlet["power_watts"] = 0.0
                    
                    reason_map = {
                        "outbreak": f"🔥 CRITICAL FIRE RISK DETECTED: Extreme overheating ({round(T_val, 1)}°C) and severe 180V brownout overload ({round(I_val, 1)}A). Virtual Breaker instantly TRIPPED to prevent fire!",
                        "stall": f"Safety Cutoff: Motor rotor locked under low voltage ({round(V_val, 1)}V); {round(I_val, 1)}A heavy current sustained. Power safely disconnected.",
                        "micro_arc": f"Spark Hazard Cutoff: Sparking loose contact detected. Plug temp hit {round(T_val, 1)}°C. Power safely cut.",
                        "none": f"Overload Safety Trip: Power draw reached {round(I_val, 1)}A exceeding safe limit ({outlet['trip_current']}A)."
                    }
                    forensic_alert = {
                        "outlet_id": outlet_id,
                        "outlet_name": outlet["name"],
                        "timestamp": time.strftime("%H:%M:%S"),
                        "voltage": round(V_val, 1),
                        "current": round(I_val, 1),
                        "cos_phi": round(cos_val, 2),
                        "temperature": round(T_val, 1),
                        "anomaly_score": anomaly_score,
                        "trip_latency_ms": 18,
                        "diagnosis": reason_map.get(fault_mode, reason_map["none"])
                    }
                else:
                    status = "normal"

            outlet["voltage"] = round(float(V_val), 1)
            outlet["current"] = round(float(I_val), 1) if outlet["breaker_state"] == "CLOSED" else 0.0
            outlet["cos_phi"] = round(float(cos_val), 2)
            outlet["power_watts"] = round(float(V_val * I_val * cos_val), 1) if outlet["breaker_state"] == "CLOSED" else 0.0
            outlet["terminal_temp"] = round(float(T_val), 1)
            outlet["status"] = status

            telemetry_data[outlet_id] = {
                **outlet,
                "anomaly_score": anomaly_score,
                "is_masked_inrush": is_masked_inrush
            }

        return {
            "timestamp": time.strftime("%H:%M:%S"),
            "outlets": telemetry_data,
            "global_anomaly": global_anomaly_detected,
            "forensic_alert": forensic_alert
        }

    def inject_fault(self, outlet_id: str, fault_mode: str):
        if outlet_id in self.outlets:
            self.outlets[outlet_id]["fault_mode"] = fault_mode
            self.outlets[outlet_id]["fault_start_time"] = time.time()

    def set_breaker(self, outlet_id: str, state: str):
        if outlet_id in self.outlets:
            self.outlets[outlet_id]["breaker_state"] = state
            if state == "CLOSED":
                self.outlets[outlet_id]["fault_mode"] = "none"

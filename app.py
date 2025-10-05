from typing import Any, Dict, Annotated
from fastapi import FastAPI, Request, Body
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
import joblib
import pandas as pd
import logging
import traceback

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

templates = Jinja2Templates(directory="templates")
model = None
feature_columns = None

def discover_feature_columns(trained_model):
    """Discover feature names from trained model"""
    if hasattr(trained_model, "feature_names_in_"):
        return list(getattr(trained_model, "feature_names_in_"))
    if hasattr(trained_model, "feature_name_"):
        try:
            return list(getattr(trained_model, "feature_name_"))
        except Exception:
            pass
    if hasattr(trained_model, "feature_names"):
        try:
            return list(getattr(trained_model, "feature_names"))
        except Exception:
            pass
    return None

def check_habitability(data_dict):
    """
    Check if exoplanet is potentially habitable based on NASA criteria.
    """
    reasons = []
    is_habitable = True
    
    # Temperature check (175K - 320K for liquid water)
    teq = data_dict.get('koi_teq', 0)
    if teq < 175:
        is_habitable = False
        reasons.append(f"Too cold: {teq:.0f}K (habitable range: 175-320K)")
    elif teq > 320:
        is_habitable = False
        reasons.append(f"Too hot: {teq:.0f}K (habitable range: 175-320K)")
    else:
        reasons.append(f"Temperature: {teq:.0f}K is suitable for liquid water")
    
    # Radius check (0.5 - 2.0 Earth radii for rocky planets)
    prad = data_dict.get('koi_prad', 0)
    if prad < 0.5:
        is_habitable = False
        reasons.append(f"Too small: {prad:.2f}R⊕ (rocky planets: 0.5-2.0 R⊕)")
    elif prad > 2.0:
        is_habitable = False
        reasons.append(f"Too large: {prad:.2f}R⊕ (likely a gas giant)")
    else:
        reasons.append(f"Radius: {prad:.2f}R⊕ indicates rocky composition")
    
    # Insolation flux check (0.36 - 1.77 Earth flux)
    insol = data_dict.get('koi_insol', 0)
    if insol < 0.36:
        is_habitable = False
        reasons.append(f"Too little stellar energy: {insol:.2f} (habitable: 0.36-1.77)")
    elif insol > 1.77:
        is_habitable = False
        reasons.append(f"Too much stellar energy: {insol:.2f} (habitable: 0.36-1.77)")
    else:
        reasons.append(f"Stellar flux: {insol:.2f} in habitable zone")
    
    # False positive flags check
    fp_sum = sum([
        data_dict.get('koi_fpflag_nt', 0),
        data_dict.get('koi_fpflag_ss', 0),
        data_dict.get('koi_fpflag_co', 0),
        data_dict.get('koi_fpflag_ec', 0)
    ])
    if fp_sum > 0:
        is_habitable = False
        reasons.append("Detection quality concerns")
    else:
        reasons.append("Clean detection with no quality flags")
    
    # Add summary at the top
    if is_habitable:
        reasons.insert(0, "POTENTIALLY HABITABLE - All criteria satisfied!")
    else:
        reasons.insert(0, "NOT HABITABLE - One or more criteria not met")
    
    return is_habitable, reasons

# Load model
try:
    model = joblib.load("exoplanet_model.pkl")
    logger.info("✅ Model loaded successfully")
    feature_columns = discover_feature_columns(model)
    if feature_columns is not None:
        logger.info(f"✅ Model expects {len(feature_columns)} features")
except Exception as e:
    logger.error(f"❌ Error loading model: {e}")
    logger.error(traceback.format_exc())

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Serve the HTML frontend"""
    return templates.TemplateResponse("index.html", {"request": request})

def require_and_cast(body: Dict[str, Any], key: str, caster, default=None):
    """Helper to cast and validate input fields"""
    if key not in body:
        if default is not None:
            return default
        raise ValueError(f"Missing required field: {key}")
    try:
        return caster(body[key])
    except Exception:
        raise ValueError(f"Invalid value for {key}: {body[key]}")

PredictBody = Annotated[
    Dict[str, Any],
    Body(
        openapi_examples={
            "habitable_candidate": {
                "summary": "Potentially Habitable Planet",
                "value": {
                    "koi_pdisposition": "CANDIDATE",
                    "koi_score": 0.95,
                    "koi_fpflag_nt": 0,
                    "koi_fpflag_ss": 0,
                    "koi_fpflag_co": 0,
                    "koi_fpflag_ec": 0,
                    "koi_period": 385.0,
                    "koi_time0bk": 200.0,
                    "koi_impact": 0.2,
                    "koi_duration": 8.0,
                    "koi_depth": 300,
                    "koi_prad": 1.2,
                    "koi_teq": 280,
                    "koi_insol": 1.1,
                    "koi_model_snr": 40.0,
                    "koi_tce_plnt_num": 1,
                    "koi_tce_delivname": "q1_q17_dr25_tce",
                    "koi_steff": 5600,
                    "koi_slogg": 4.45,
                    "koi_srad": 0.98,
                    "ra": 280.0,
                    "dec": 45.0,
                    "koi_kepmag": 12.5
                }
            }
        }
    )
]

@app.post("/predict")
async def predict(payload: PredictBody):
    """Main prediction endpoint with habitability check"""
    try:
        if model is None:
            return JSONResponse(status_code=500, content={"error": "Model not loaded"})

        body = payload 
        
        # Categorical mappings
        pdisposition_mapping = {'CANDIDATE': 1, 'FALSE POSITIVE': 0}
        delivname_mapping = {
            'q1_q12_tce': 0, 'q1_q16_tce': 1,
            'q1_q17_dr24_tce': 2, 'q1_q17_dr25_tce': 3
        }
        
        koi_pdisposition_str = require_and_cast(body, "koi_pdisposition", str)
        koi_tce_delivname_str = require_and_cast(body, "koi_tce_delivname", str)
        koi_pdisposition = int(pdisposition_mapping.get(koi_pdisposition_str, 0))
        koi_tce_delivname = int(delivname_mapping.get(koi_tce_delivname_str, 1))

        # Build data dictionary
        data_dict = {
            'koi_pdisposition': koi_pdisposition,
            'koi_score': float(require_and_cast(body, "koi_score", float)),
            'koi_fpflag_nt': int(require_and_cast(body, "koi_fpflag_nt", int)),
            'koi_fpflag_ss': int(require_and_cast(body, "koi_fpflag_ss", int)),
            'koi_fpflag_co': int(require_and_cast(body, "koi_fpflag_co", int)),
            'koi_fpflag_ec': int(require_and_cast(body, "koi_fpflag_ec", int)),
            'koi_period': float(require_and_cast(body, "koi_period", float)),
            'koi_time0bk': float(require_and_cast(body, "koi_time0bk", float)),
            'koi_impact': float(require_and_cast(body, "koi_impact", float)),
            'koi_duration': float(require_and_cast(body, "koi_duration", float)),
            'koi_depth': float(require_and_cast(body, "koi_depth", float)),
            'koi_prad': float(require_and_cast(body, "koi_prad", float)),
            'koi_teq': float(require_and_cast(body, "koi_teq", float)),
            'koi_insol': float(require_and_cast(body, "koi_insol", float)),
            'koi_model_snr': float(require_and_cast(body, "koi_model_snr", float)),
            'koi_tce_plnt_num': int(require_and_cast(body, "koi_tce_plnt_num", int)),
            'koi_tce_delivname': koi_tce_delivname,
            'koi_steff': float(require_and_cast(body, "koi_steff", float)),
            'koi_slogg': float(require_and_cast(body, "koi_slogg", float)),
            'koi_srad': float(require_and_cast(body, "koi_srad", float)),
            'ra': float(require_and_cast(body, "ra", float)),
            'dec': float(require_and_cast(body, "dec", float)),
            'koi_kepmag': float(require_and_cast(body, "koi_kepmag", float))
        }

        # Create DataFrame for prediction
        data = pd.DataFrame([data_dict])

        # Align columns to model's expected feature order
        if feature_columns is not None:
            data = data.reindex(columns=feature_columns, fill_value=0.0)

        # Make prediction
        pred_raw = model.predict(data)[0]
        prediction_mapping = {0: 'FALSE POSITIVE', 1: 'CANDIDATE', 2: 'CONFIRMED'}
        koi_disposition = prediction_mapping.get(pred_raw, str(pred_raw))

        # Build base response
        result = {"koi_disposition": koi_disposition}

        # Check habitability ONLY for CONFIRMED or CANDIDATE planets
        if koi_disposition in ['CONFIRMED', 'CANDIDATE']:
            is_habitable, reasons = check_habitability(data_dict)
            result["is_habitable"] = is_habitable
            result["habitability_status"] = "POTENTIALLY HABITABLE" if is_habitable else "NOT HABITABLE"
            result["habitability_reasons"] = reasons
        else:
            result["is_habitable"] = False
            result["habitability_status"] = "N/A"
            result["habitability_reasons"] = ["Habitability not evaluated for false positive detections"]

        return JSONResponse(content=result)
        
    except ValueError as ve:
        logger.error(f"Validation error: {ve}")
        return JSONResponse(status_code=400, content={"error": str(ve)})
    except Exception as e:
        logger.error(f"❌ Prediction error: {e}")
        logger.error(traceback.format_exc())
        return JSONResponse(status_code=500, content={"error": "Internal server error occurred"})

# Vercel serverless handler
handler = app

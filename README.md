# Return-0: NASA Space Apps Challenge Project

## Project Overview
This project is built for the **NASA Space Apps Challenge**.  
Our goal is to **identify exoplanets** using NASA’s Kepler dataset and check if these exoplanets are **habitable** or not using machine learning models.

We built a full ML pipeline and web app that predicts:
1. Whether an observed celestial object is an **exoplanet**.  
2. If yes, whether it is **habitable** based on scientific parameters.

---

## Problem Statement
Billions of stars exist in our galaxy, and many of them may have planets.  
NASA’s Kepler mission collected huge data about these celestial bodies.  
Our task was to:
- Analyze this data
- Detect which objects are real exoplanets
- Predict which ones can support life

---

## Solution
We designed a **Machine Learning model** that classifies celestial objects into:
- **Not Exoplanet**
- **Exoplanet (Non-Habitable)**
- **Exoplanet (Habitable)**

This model is deployed using **FastAPI** with a simple web interface where users can input Kepler object parameters and get instant predictions.

---

## Dataset
We used the **NASA Kepler Exoplanet dataset** available on Kaggle and NASA’s Open Data portal.

**Disposition & Quality Metrics (3 features)**
1. **koi_pdisposition** - Preliminary disposition (CANDIDATE / FALSE POSITIVE)
2. **koi_score** - Disposition score (0-1, confidence level)
3. **koi_model_snr** - Signal-to-Noise Ratio (detection quality)

**False Positive Flags (4 features)**
4. **koi_fpflag_nt** - Not Transit-Like flag (0 or 1)
5. **koi_fpflag_ss** - Stellar Eclipse flag (0 or 1)
6. **koi_fpflag_co** - Centroid Offset flag (0 or 1)
7. **koi_fpflag_ec** - Ephemeris Match Indicates Contamination flag (0 or 1)

**Transit Parameters (5 features)**
8. **koi_period** - Orbital period (days)
9. **koi_time0bk** - Transit epoch (BKJD - Barycentric Kepler Julian Date)
10. **koi_impact** - Impact parameter (closest approach to star center)
11. **koi_duration** - Transit duration (hours)
12. **koi_depth** - Transit depth (parts per million - ppm)

**Planetary Properties (3 features)**
13. **koi_prad** - Planet radius (Earth radii R⊕)
14. **koi_teq** - Equilibrium temperature (Kelvin)
15. **koi_insol** - Insolation flux (Earth flux units)

**Stellar Properties (3 features)**
16. **koi_steff** - Stellar effective temperature (Kelvin)
17. **koi_slogg** - Stellar surface gravity (log g, cgs units)
18. **koi_srad** - Stellar radius (Solar radii R☉)

**Position & Catalog Data (5 features)**
19. **ra** - Right Ascension (degrees, sky position)
20. **dec** - Declination (degrees, sky position)
21. **koi_kepmag** - Kepler magnitude (brightness)
22. **koi_tce_plnt_num** - TCE planet number
23. **koi_tce_delivname** - TCE delivery name (data release version)


## **Key Features for Habitability Assessment**

From these 23 features, **3 critical ones** determine habitability:
1. **koi_teq** (175-320K) - Temperature for liquid water
2. **koi_prad** (0.5-2.0 R⊕) - Rocky planet size
3. **koi_insol** (0.36-1.77) - Habitable zone energy

Plus all **fp_flags must = 0** for clean detection.

---

## Tech Stack
**Frontend:** HTML, CSS, JavaScript  
**Backend:** FastAPI (Python)  
**Model:** Scikit-learn (Random Forest / Logistic Regression / Lazy Classifier)  
**Deployment:** Render / Hugging Face Spaces  
**Dataset Source:** NASA Kepler Database

---

## Features
- Predict if an object is an **Exoplanet** or not  
- Check if it is **Habitable** based on scientific conditions  
- Simple web interface with input forms for all parameters  
- Real-time prediction using FastAPI backend  

---

## Machine Learning Pipeline
1. **Data Preprocessing:** Handling missing values and scaling  
2. **Feature Selection:** Choosing most relevant astronomical features  
3. **Model Training:** Using classification algorithms like Random Forest  
4. **Evaluation:** Accuracy, Precision, Recall, F1-score  
5. **Deployment:** Model integrated with FastAPI for prediction API  

---

## How to Run Locally

# Clone the repository
git clone https://github.com/iamrahulbisht/Return-0-Nasa-Space-Apps-Challenge.git

# Navigate to folder
cd Return-0-Nasa-Space-Apps-Challenge

# Install dependencies
pip install -r requirements.txt

# Run FastAPI app
uvicorn main:app --reload


Then open your browser and go to:
 `http://127.0.0.1:8000`

---

## Future Improvements

* Improve habitability prediction using deep learning
* Add visualization of exoplanet orbit and distance
* Integrate with live NASA data APIs

---

## Team Members

**Team Name:** Return 0

* Rahul Bisht
* Piyush Naula
* Rahul Joshi
* Piyush Palariya
* Mohd Hifzan
* Samriddhi Gururani

---

## References

* NASA Exoplanet Archive
* Kepler Mission Dataset
* Kaggle Exoplanet Data
* Scikit-learn Documentation

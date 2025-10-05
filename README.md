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

**Main Features Used:**
- `koi_period`
- `koi_prad`
- `koi_teq`
- `koi_srad`
- `koi_steff`
- `koi_depth`
- `koi_insol`
- `koi_dor`
- `ra`, `dec`, `koi_kepmag`

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

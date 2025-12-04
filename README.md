# Crop Diseases and Pests Detection and Recommendation System
This project is a machine learning–based system designed to detect crop diseases and pest infestations affecting major cereal crops such as maize, wheat, rice, and sorghum. It supports both image-based detection (leaf photos) and tabular data analysis (symptoms, environmental factors, and agronomic data). After identifying the disease or pest, the system provides clear and practical recommendations based on standard agricultural practices.

## Overview
The system analyzes either uploaded leaf images or manually entered crop information and predicts the most likely disease or pest. It then provides prevention and management recommendations to help farmers reduce crop losses and improve productivity.

## Features
- Detection of common diseases and pests affecting cereal crops
- Support for image input or tabular symptom data
- Machine learning models for prediction
- Automated recommendation engine for prevention and control
- Data analysis and visualization of disease and pest patterns

## Technologies Used
- Python
- Pandas, NumPy
- Scikit-learn
- TensorFlow or PyTorch (for image models)
- Matplotlib, Seaborn
- Streamlit or Flask (optional interface)

## How It Works
1. The user uploads a leaf image or enters crop symptoms and environmental details.
2. The system preprocesses the input and passes it through a trained machine learning model.
3. The model predicts the likely disease or pest.
4. The system generates appropriate recommendations for prevention, monitoring, and management.

## Current Focus
- Cereal crops (maize, wheat, rice, sorghum)
- Common fungal and bacterial diseases, plus major pest infestations
- Basic ML models (Decision Trees, Random Forest, or CNN for image classification)

## Future Improvements
- Mobile application integration
- Real-time camera-based detection
- Weather-based disease and pest forecasting
- Support for additional crop varieties and larger datasets

- live demo: https://crop-disease-detectorai.netlify.app/

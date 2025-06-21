from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

try:
    modelo = joblib.load('../train/modelo_vinos.pkl')
    print("Modelo cargado correctamente")
except FileNotFoundError:
    print("Error: No se encontró el modelo en train/modelo_vinos.pkl")
    modelo = None

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'API funcionando', 'model_loaded': modelo is not None})

@app.route('/api/predict', methods=['POST'])
def predict():
    """Endpoint para hacer predicciones"""
    try:
        if modelo is None:
            return jsonify({'error': 'Modelo no disponible'}), 500
        
        data = request.json
        
        ejemplo = pd.DataFrame({
            'price': [float(data['price'])],
            'num_reviews': [int(data['num_reviews'])], 
            'body': [float(data['body'])],
            'acidity': [float(data['acidity'])]
        })
        
        prediccion = modelo.predict(ejemplo)
        probabilidad = modelo.predict_proba(ejemplo)[0]
        
        return jsonify({
            'prediction': int(prediccion[0]),
            'result': 'Premium' if prediccion[0] == 1 else 'Común',
            'confidence': f"{max(probabilidad):.1%}"
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/metrics', methods=['GET'])
def metrics():
    """Información del modelo"""
    return jsonify({
        'model': 'Decision Tree Classifier',
        'features': ['price', 'num_reviews', 'body', 'acidity'],
        'target': 'calidad_alta (Rating >= 4.5)',
        'status': 'active' if modelo else 'inactive'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
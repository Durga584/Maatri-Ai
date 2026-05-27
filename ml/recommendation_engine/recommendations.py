import os

# Standard supplement mappings to educational explanations
SUPPLEMENT_IMPORTANCE = {
    'folic acid': (
        "Supports early development of the baby's brain and spinal cord, "
        "significantly reducing the risk of neural tube defects (NTDs)."
    ),
    'iron': (
        "Crucial for producing hemoglobin, which carries oxygen to your organs and "
        "your baby. Helps prevent iron-deficiency anemia, fatigue, and preterm birth."
    ),
    'calcium': (
        "Vital for the development of your baby's bones, teeth, heart, nerves, and muscles. "
        "Also protects your own bone density."
    ),
    'vitamin d': (
        "Works alongside calcium to build your baby's bones and teeth, and supports "
        "healthy immune function and cell division."
    ),
    'prenatal multivitamin': (
        "Provides a balanced blend of essential micronutrients (like folic acid, iron, iodine, "
        "and vitamins A, C, D, B6, B12) to fill any nutritional gaps in your diet."
    ),
    'aspirin': (
        "Sometimes prescribed by doctors to help prevent or delay preeclampsia in "
        "women at high risk for high blood pressure conditions."
    ),
    'progesterone': (
        "Helps prepare and maintain the uterine lining to support the pregnancy, "
        "particularly in the first trimester."
    ),
    'thyroxine': (
        "Replaces or supplements thyroid hormone which is critical for baby's brain "
        "and nervous system development."
    )
}

DISCLAIMER = (
    "⚠️ MEDICAL DISCLAIMER: This system provides educational guidance, lifestyle awareness, "
    "and general recommendations. It does NOT prescribe medications, make diagnoses, or replace "
    "professional medical advice. Always consult your obstetrician or healthcare provider before "
    "making medical decisions or starting new supplements."
)

def get_recommendations(risk_level, health_parameters):
    """
    Generate rule-based educational guidelines based on risk prediction and health indicators.
    health_parameters: dict containing Age, SystolicBP, DiastolicBP, BS, BodyTemp, HeartRate
    """
    recommendations = []
    alerts = []
    
    # Extract params
    age = health_parameters.get('Age')
    sys_bp = health_parameters.get('SystolicBP')
    dia_bp = health_parameters.get('DiastolicBP')
    sugar = health_parameters.get('BS')
    temp = health_parameters.get('BodyTemp')
    hr = health_parameters.get('HeartRate')
    
    # 1. Blood Pressure Rules
    if sys_bp > 130 or dia_bp > 80:
        alerts.append("Elevated Blood Pressure detected.")
        recommendations.append(
            "- **Blood Pressure Management**: Rest frequently, avoid heavy physical exertion, "
            "and measure your blood pressure daily. Restrict sodium (salt) intake and stay hydrated."
        )
    elif sys_bp < 90 or dia_bp < 60:
        alerts.append("Low Blood Pressure detected.")
        recommendations.append(
            "- **Blood Pressure Management**: Change positions slowly (from lying or sitting to standing) "
            "to prevent dizziness. Stay well-hydrated and ensure adequate rest."
        )
        
    # 2. Blood Sugar Rules
    if sugar > 7.0:
        alerts.append("Elevated Blood Sugar detected.")
        recommendations.append(
            "- **Blood Sugar Management**: Limit refined carbohydrates, sweets, and sweetened beverages. "
            "Prioritize high-fiber foods, lean proteins, and complex carbs. Maintain consistent meal timings "
            "and perform gentle exercises like walking, if cleared by your doctor."
        )
    elif sugar < 3.5:
        alerts.append("Low Blood Sugar detected.")
        recommendations.append(
            "- **Blood Sugar Management**: Consume small, frequent meals throughout the day. Carry a "
            "quick source of glucose (like fruit juice or dried fruit) in case of sudden dizziness or shakiness."
        )
        
    # 3. Body Temperature Rules
    if temp > 100.4:
        alerts.append("High Body Temperature (potential fever) detected.")
        recommendations.append(
            "- **Fever/Temperature**: Seek rest immediately in a cool room, drink plenty of fluids, and "
            "use a cool compress. Monitor your temperature closely. If it remains high, consult your obstetrician "
            "to rule out infection."
        )
        
    # 4. Heart Rate Rules
    if hr > 100:
        alerts.append("High Heart Rate (tachycardia) detected.")
        recommendations.append(
            "- **Heart Rate**: Rest and practice slow, deep breathing. Avoid stimulants (like caffeine in coffee or tea) "
            "and discuss this resting heart rate with your healthcare provider."
        )
    elif hr < 60:
        alerts.append("Low Heart Rate (bradycardia) detected.")
        recommendations.append(
            "- **Heart Rate**: Monitor for signs of dizziness, fatigue, or fainting. Mention this resting heart "
            "rate to your obstetrician during your next checkup."
        )
        
    # 5. Age-based Guidelines
    if age >= 35:
        recommendations.append(
            "- **Maternal Age Consideration**: High-risk pregnancy screening and detailed anomaly scans "
            "are often recommended for mothers 35 and older. Consult your doctor for appropriate prenatal testing."
        )
    elif age <= 18:
        recommendations.append(
            "- **Adolescent Pregnancy Guidance**: Ensure adequate nutritional intake (especially iron, calcium, and "
            "protein) to support both your own growth and your baby's development."
        )
        
    # 6. Risk Level Specific Guidelines
    if risk_level == 'High Risk':
        recommendations.append(
            "- **Immediate Action**: Your indicators show high risk. Please contact your obstetrician or maternal care provider "
            "for an immediate assessment and to establish an intensive monitoring schedule."
        )
        recommendations.append(
            "- **Emergency Symptoms**: Be alert to danger signs such as severe headaches, vision changes (blurry vision), "
            "sudden swelling in face/hands, vaginal bleeding, or decreased baby movements. Seek immediate emergency care if these occur."
        )
    elif risk_level == 'Mid Risk':
        recommendations.append(
            "- **Monitoring**: Schedule a follow-up consultation with your doctor to review these indicators. Increase "
            "frequency of self-monitoring for blood pressure and blood sugar."
        )
    else:  # Low Risk
        recommendations.append(
            "- **Maintenance**: Continue your healthy prenatal routine. Focus on nutritious whole foods, regular physical "
            "activity (like prenatal yoga or walking), and adequate sleep (7-9 hours)."
        )
        
    # Add general prenatal care recommendation
    recommendations.append(
        "- **General Prenatal Care**: Keep all scheduled prenatal visits. Ensure you are taking standard vitamins "
        "like Folic Acid and Iron as recommended by your physician."
    )
    
    return {
        'risk_level': risk_level,
        'alerts': alerts,
        'recommendations': recommendations,
        'disclaimer': DISCLAIMER
    }

def get_supplement_importance(med_name):
    """
    Look up the educational importance note for a medicine.
    Returns a standard explanation if the medicine is recognized in the local SUPPLEMENT_IMPORTANCE dictionary,
    otherwise dynamically queries the Gemini API. If Gemini fails, returns a safe fallback message.
    """
    clean_name = med_name.strip().lower()
    
    # Hybrid Approach: First check the local dictionary of trusted pregnancy supplements
    for key, val in SUPPLEMENT_IMPORTANCE.items():
        if key in clean_name or clean_name in key:
            return val
            
    # If not found locally, dynamically generate explanation using Gemini API
    try:
        from llm.chatbot import generate_medicine_info
        return generate_medicine_info(med_name)
    except Exception as e:
        print(f"Error importing or calling generate_medicine_info for '{med_name}': {e}")
        return "Please consult your doctor for information regarding this medicine."


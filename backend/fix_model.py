"""
Utility script to fix and re-save model with proper format
"""
import pickle
import joblib
import sys
from pathlib import Path

# Paths
SOURCE_PATH = Path(r"C:\Users\naula\OneDrive\Desktop\Nasa Return 0\models\exoplanet_model.pkl")
OUTPUT_PATH = Path(r"C:\Users\naula\OneDrive\Desktop\Nasa Return 0\backend\model\exoplanet_model.pkl")

print("=" * 60)
print("ExoProspector Model Fix Utility")
print("=" * 60)
print(f"\n📂 Source: {SOURCE_PATH}")
print(f"📂 Output: {OUTPUT_PATH}\n")

# Ensure output directory exists
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

# Try different loading methods
methods = [
    ('joblib', lambda p: joblib.load(p)),
    ('pickle_default', lambda p: pickle.load(open(p, 'rb'))),
    ('pickle_latin1', lambda p: pickle.load(open(p, 'rb'), encoding='latin1')),
    ('pickle_bytes', lambda p: pickle.load(open(p, 'rb'), encoding='bytes')),
]

model = None
successful_method = None

for method_name, load_func in methods:
    try:
        print(f"🔄 Trying {method_name}...")
        model = load_func(SOURCE_PATH)
        successful_method = method_name
        print(f"✅ Success with {method_name}!")
        print(f"📊 Model type: {type(model)}")
        break
    except Exception as e:
        print(f"❌ Failed with {method_name}: {str(e)[:100]}")

if model is None:
    print("\n❌ All methods failed. Model file might be corrupted.")
    print("\n💡 Suggestions:")
    print("1. Re-train the model")
    print("2. Check if file is complete (not partially downloaded)")
    print("3. Verify Python version compatibility")
    sys.exit(1)

# Re-save with joblib (most reliable)
try:
    print(f"\n💾 Re-saving model with joblib...")
    joblib.dump(model, OUTPUT_PATH)
    print(f"✅ Model saved to: {OUTPUT_PATH}")
    
    # Verify
    print(f"\n🔍 Verifying...")
    test_load = joblib.load(OUTPUT_PATH)
    print(f"✅ Verification successful!")
    print(f"📊 Verified model type: {type(test_load)}")
    
    # Check for feature importances
    if hasattr(test_load, 'feature_importances_'):
        print(f"✅ Feature importances available: {len(test_load.feature_importances_)} features")
    
    print("\n" + "=" * 60)
    print("🎉 Model fix completed successfully!")
    print("=" * 60)
    print("\n✅ You can now restart your FastAPI server")
    
except Exception as e:
    print(f"\n❌ Error saving model: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

rf_model = RandomForestClassifier(n_estimators=300, random_state=42)
rf_model.fit(X_train, y_train)
rf_preds = rf_model.predict(X_test)
rf_acc = accuracy_score(y_test, rf_preds)

xgb_model = XGBClassifier(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric="mlogloss",
    random_state=42,
)
xgb_model.fit(X_train, y_train)
xgb_preds = xgb_model.predict(X_test)
xgb_acc = accuracy_score(y_test, xgb_preds)

print("\nRandom Forest Accuracy:", rf_acc)
print(classification_report(y_test, rf_preds))
print("\nXGBoost Accuracy:", xgb_acc)
print(classification_report(y_test, xgb_preds))

best_model = xgb_model if xgb_acc > rf_acc else rf_model
best_name = "XGBoost" if xgb_acc > rf_acc else "RandomForest"

print(f"\nBest Model: {best_name} with accuracy {max(rf_acc, xgb_acc):.4f}")

os.makedirs("../models", exist_ok=True)
dump(best_model, f"../models/best_model.pkl")

if best_name == "RandomForest":
    importances = best_model.feature_importances_
else:
    importances = best_model.feature_importances_

feat_imp = pd.Series(importances, index=X.columns).sort_values(ascending=False)

plt.figure(figsize=(10,6))
feat_imp.head(15).plot(kind="barh")
plt.title(f"Top 15 Features - {best_name}")
plt.show()
joblib.dump(best_model, "../models/exoplanet_model.pkl")
print("Model saved at models/exoplanet_model.pkl")
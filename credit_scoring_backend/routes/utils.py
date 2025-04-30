def calculate_credit_score(data):
    score = 300

    income = data.get("income", 0)
    if income > 5000:
        score += 100
    elif income > 3000:
        score += 70
    elif income > 1000:
        score += 40

    if data.get("employment_status") == "employed":
        score += 100
    elif data.get("employment_status") == "student":
        score += 40

    debt = data.get("existing_debt", 0)
    if debt < 1000:
        score += 80
    elif debt < 5000:
        score += 50
    else:
        score -= 50

    score -= data.get("missed_payments", 0) * 20
    score += data.get("credit_history_length", 0) * 10

    age = data.get("age", 0)
    if age < 21:
        score -= 20
    elif age > 35:
        score += 20

    return min(max(score, 300), 850)

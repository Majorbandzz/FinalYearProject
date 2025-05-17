from models import db, User, UserCreditData
import traceback

def calculate_credit_score(user_id):
    try:
        credit_data = UserCreditData.query.filter_by(user_id=user_id).first()
        if not credit_data:
            print(f"[DEBUG] Credit data not found for user {user_id}")
            return None

        print(f"[DEBUG] Calculating credit score for user {user_id}")
        print(f"[DEBUG] Credit data: {credit_data.__dict__}")

        score = 0

        if credit_data.total_payments > 0:
            payment_ratio = (credit_data.total_payments - credit_data.missed_payments) / credit_data.total_payments
            payment_score = payment_ratio * 350  
            score += payment_score
            print(f"[DEBUG] Payment score: {payment_score}")

        if credit_data.total_credit_limit > 0:
            utilization = (credit_data.credit_used / credit_data.total_credit_limit) * 100
            utilization_score = max(0, min(100 - utilization, 100))
            utilization_score = (utilization_score / 100) * 300  
            score += utilization_score
            print(f"[DEBUG] Utilization score: {utilization_score}")

        history_score = min(200, (credit_data.credit_history_length / 24) * 200)  
        score += history_score
        print(f"[DEBUG] History score: {history_score}")

        mix_score = min(80, (credit_data.credit_accounts / 4) * 80)  
        score += mix_score
        print(f"[DEBUG] Mix score: {mix_score}")

        if credit_data.missed_payments == 0:
            score += 69 
            print("[DEBUG] Added 69 points for no missed payments")

        final_score = min(999, max(0, int(score)))
        print(f"[DEBUG] Final score: {final_score}")

        user = User.query.get(user_id)
        if user:
            user.credit_score = final_score
            db.session.commit()
            print(f"[DEBUG] Credit score {final_score} saved for user {user_id}")

        return final_score

    except Exception as e:
        print(f"[ERROR] Error calculating credit score: {str(e)}")
        traceback.print_exc()
        db.session.rollback()
        return None

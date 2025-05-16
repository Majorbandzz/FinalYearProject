from models import db, User
import traceback

def calculate_credit_score(user_id, credit_data):
    try:
        user = db.session.query(User).get(user_id)
        if not user:
            print(f"User with ID {user_id} not found.")
            return

        print(f"Calculating credit score for user {user_id}")

        score = 300  

        
        if credit_data.total_payments > 0:
            payment_ratio = (credit_data.total_payments - credit_data.missed_payments) / credit_data.total_payments
            payment_score = payment_ratio * 350
            score += payment_score

        
        if credit_data.total_credit_limit > 0:
            utilization = (credit_data.credit_used / credit_data.total_credit_limit) * 100
            utilization_score = max(0, min(100 - utilization, 100))
            score += (utilization_score / 100) * 300

       
        history_score = (credit_data.credit_history_length / 24) * 150
        score += history_score

        mix_score = min(credit_data.credit_accounts * 50, 100)
        score += mix_score

        
        if credit_data.missed_payments == 0:
            score += 100

        final_score = min(850, max(300, int(score)))
        user.credit_score = final_score

        db.session.commit()
        print(f"Final score: {final_score}")

    except Exception as e:
        print("Error calculating credit score:", str(e))
        print(traceback.format_exc())
        db.session.rollback()

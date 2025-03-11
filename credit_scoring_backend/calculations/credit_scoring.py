from models import db, UserCreditData, User

def calculate_credit_score(user_id):
    user_data = UserCreditData.query.filter_by(user_id=user_id).first()
    
    if not user_data:
        return None  

   
    weight_payment_history = 0.35
    weight_credit_utilization = 0.30
    weight_credit_length = 0.15
    weight_credit_mix = 0.10
    weight_new_credit = 0.10
    
   
    on_time_payments = user_data.on_time_payments
    missed_payments = user_data.missed_payments
    total_credit_limit = user_data.total_credit_limit
    credit_used = user_data.credit_used
    credit_history_length = user_data.credit_history_length
    credit_accounts = user_data.credit_accounts
    recent_inquiries = user_data.recent_inquiries
    
    payment_history_score = (on_time_payments / (on_time_payments + missed_payments)) * 100 if (on_time_payments + missed_payments) > 0 else 0
    credit_utilization_score = (1 - (credit_used / total_credit_limit)) * 100 if total_credit_limit > 0 else 0
    credit_length_score = (credit_history_length / 30) * 100 if credit_history_length <= 30 else 100
    credit_mix_score = (credit_accounts / 10) * 100 if credit_accounts <= 10 else 100
    new_credit_score = (1 - (recent_inquiries / 10)) * 100 if recent_inquiries <= 10 else 0
    
    raw_score = (
        (payment_history_score * weight_payment_history) +
        (credit_utilization_score * weight_credit_utilization) +
        (credit_length_score * weight_credit_length) +
        (credit_mix_score * weight_credit_mix) +
        (new_credit_score * weight_new_credit)
    )
    
    final_score = int(300 + (raw_score / 100) * 550)  
    
    user = User.query.get(user_id)
    if user:
        user.credit_score = final_score
        db.session.commit()

    return final_score

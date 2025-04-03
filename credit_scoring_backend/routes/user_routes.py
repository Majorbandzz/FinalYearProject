from flask import Blueprint

user_blueprint = Blueprint("user_blueprint", __name__)

@user_blueprint.route("/test", methods=["GET"])
def test():
    return {"message": "The user route works smoothly!"}

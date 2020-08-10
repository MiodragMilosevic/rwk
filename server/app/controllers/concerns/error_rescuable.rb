module ErrorRescuable
  extend ActiveSupport::Concern

  included do
    rescue_from ApiError, with: :handle_api_error

    rescue_from JWT::DecodeError, with: :handle_jwt_error
    rescue_from JWT::InvalidAudError, with: :handle_jwt_error
    rescue_from JWT::InvalidJtiError, with: :handle_jwt_error
    rescue_from JWT::InvalidIatError, with: :handle_jwt_error
    rescue_from JWT::ExpiredSignature, with: :handle_jwt_error
    rescue_from JWT::InvalidIssuerError, with: :handle_jwt_error

    rescue_from ActiveRecord::RecordInvalid, with: :handle_record_invalid
    rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found
    rescue_from ActiveRecord::InvalidForeignKey, with: :handle_invalid_foreign_key

    rescue_from ActionController::UnknownFormat, with: :handle_api_error
    rescue_from ActionController::ParameterMissing, with: :handle_params_error

    rescue_from Pundit::NotAuthorizedError, with: :handle_not_authorized

    rescue_from Koala::Facebook::AuthenticationError, with: :handle_api_error
    rescue_from Stripe::CardError, with: :handle_stripe_error
    rescue_from Stripe::InvalidRequestError, with: :handle_stripe_token_error
  end

  def handle_api_error(error)
    render json: error.to_json, status: error.status
  end

  def handle_stripe_token_error(error)
    handle_api_error(ApiError.new("Token is not valid", :bad_request))
  end

  def handle_stripe_error(error)
    render json: error.to_json, status: error.http_status
  end

  def handle_jwt_error(error)
    handle_api_error(ApiError.new("There is something wrong with JWT, #{error.message}", :unauthorized))
  end

  def handle_record_invalid(error)
    handle_api_error(ApiError.new(error.message, :unprocessable_entity, error.record.errors))
  end

  def handle_record_not_found(error)
    handle_api_error(ApiError.new(error.message, :not_found))
  end

  def handle_invalid_foreign_key(error)
    handle_api_error(ApiError.new('Foreign key violation', :bad_request))
  end

  def handle_params_error(error)
    handle_api_error(ApiError.new("Parameter #{error.param} is missing", :bad_request))
  end

  def handle_not_authorized(error)
    handle_api_error(ApiError.new('You are not allowed to access this resource!', :forbidden))
  end

end

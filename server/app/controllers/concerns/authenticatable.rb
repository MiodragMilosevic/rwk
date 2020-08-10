module Authenticatable
  extend ActiveSupport::Concern

  include ActionController::HttpAuthentication::Token::ControllerMethods

  def authenticate_user!
    authenticate_user
    raise AuthenticationFailedError if @current_user.nil? || @current_user.deactivated?
  end

  def set_user_with_token
    decoded = JWT.decode(params[:token], Rails.application.credentials.secret_key_base, true, algorithm: 'HS256').first
    @current_user = User.find(decoded['user_id'])
    raise AuthenticationFailedError if @current_user.nil? || @current_user.deactivated?
  end

  def authenticate_user
    authenticate_with_http_token do |token|
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base, true, algorithm: 'HS256').first
      @current_user = User.find(decoded['user_id'])
      @current_user = nil if @current_user.deactivated?
    end
  end


  def current_user
    @current_user
  end
end

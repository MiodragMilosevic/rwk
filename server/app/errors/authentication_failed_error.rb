class AuthenticationFailedError < ApiError
  def initialize
    super('Authentication failed', :unauthorized)
  end
end
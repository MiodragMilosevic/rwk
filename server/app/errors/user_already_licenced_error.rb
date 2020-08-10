class UserAlreadyLicencedError < ApiError
  def initialize
    super('User already has active or pending licence', :bad_request)
  end
end

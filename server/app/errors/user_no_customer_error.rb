class UserNoCustomerError < ApiError
  def initialize
    super('User is not a customer', :bad_request)
  end
end

class StripeTokenNotSendError < ApiError
  def initialize
    super('Stripe token is not sent', :bad_request)
  end
end

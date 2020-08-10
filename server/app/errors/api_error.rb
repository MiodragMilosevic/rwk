class ApiError < StandardError

  attr_reader :message, :status, :additional_data

  def initialize(message, status = :bad_request, additional_data = nil)
    @message = message
    @status = status
    @additional_data = additional_data
  end

  def to_json
    { message: message, additional_data: additional_data }
  end
end

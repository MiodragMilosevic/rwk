class InvalidCredentials < ApiError
  def initialize
    super('Invalid credentials', :not_found)
  end
end

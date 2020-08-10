class LicenceUnavailableError < ApiError
  def initialize
    super('Licence is not available', :not_found)
  end
end

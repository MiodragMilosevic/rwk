module AuthProvider
  class Username < Base

    def initialize(params)
      super(params)
      @username = params.require(:username)
      @password = params.require(:password)
    end

    def authenticate!
      user = User.find_by(username: @username)
      raise InvalidCredentials if user.nil? || !user.authenticate(@password)
      user
    end
  end
end
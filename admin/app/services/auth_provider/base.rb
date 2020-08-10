module AuthProvider
  class Base
    def to_user
      authenticate!
    end

    protected

    def initialize(params)
      @params = params
    end

    def authenticate!
      # Implement in specific provider
      # Must return User instance
    end

  end
end
class AuthProviderBuilder
  class << self

    def build(params)
      provider = params.require(:provider)
      provider_class = "AuthProvider::#{provider.camelize}"
      provider_class.constantize.new(params)
    end

  end
end
module AuthProvider
  class Facebook < Base

    def initialize(params)
      super(params)
      @access_token = params.require(:access_token)
    end

    def authenticate!
      fb_graph = Koala::Facebook::API.new(@access_token)
      user_data = fb_graph.get_object('me', fields: 'name,first_name,last_name,email').symbolize_keys

      user = User.find_by(facebook_id: user_data.dig(:id))
      user = User.find_by(email_address: user_data.dig(:email)) unless user.present? || user_data.dig(:email).blank?

      if user.nil?
        user = User.create!(
          facebook_id: user_data.dig(:id),
          password: SecureRandom.hex(12),
          email_address: user_data.dig(:email),
          first_name: user_data.dig(:first_name),
          last_name: user_data.dig(:last_name)
        )
      end
      if user.nil?
        raise InvalidCredentials
      else
        user
      end
    end

  end
end
